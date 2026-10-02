# The form endpoint

The website is a static export on GitHub Pages and has no server. This is the
one piece of the site that runs code, and it exists to do one thing: take a demo
request and turn it into an email to us.

**Nothing in this directory is secret, and nothing secret may be added to it.**
The repository is public and git history is permanent.

## Why this rather than Formspree

A third-party form service is twenty minutes of work. The cost is that a company
we do not control holds every enquiry a mosque committee ever sends us, in their
dashboard, under their retention policy, and has to be named in our privacy
notice as a processor of it.

This way Cloudflare carries the submission and we hold it. Cloudflare is still a
processor and the privacy notice still names them — that part was not avoidable
and the notice says so — but nobody keeps a copy except us, and there is no
service to cancel, no plan to outgrow and no account somebody else owns.

## What it costs

Nothing, and for a documented reason rather than a hopeful one.

Cloudflare meters outbound email to arbitrary recipients and that needs the
Workers Paid plan. But **sending to a verified destination address on your own
account is free on every plan** and does not count against the monthly quota.
A contact form sends to exactly one address — ours — so it stays in the free
case permanently. `wrangler.toml` pins the binding to that single address with
`destination_address`, which keeps it free *and* means a bug in the Worker
cannot mail anybody else.

If you ever widen that to send to the enquirer as well, you have left the free
case and are on the paid plan. That is a decision, not a tweak.

## Setting it up

You need: the `masjidone.co.uk` zone on Cloudflare, and `npx wrangler login`.

1. **Verify the destination address.** Cloudflare dashboard → the zone → Email →
   Email Routing → Destination addresses. Add the address you want enquiries to
   land in and click the link in the confirmation email. Nothing works until
   this is done.

   Use a MasjidOne address, not a personal one. It should be the same address as
   `CONTACT_EMAIL` in `lib/site.ts` — the one already meant to be printed on the
   site — so there is nothing in this repository that was not going to be public.

2. **Onboard the sending domain.** Email → Email Sending. This is what makes
   `forms@masjidone.co.uk` a sender Cloudflare will accept. Without it every
   send fails with `E_SENDER_NOT_VERIFIED`.

3. **Fill in `wrangler.toml`** — replace `REPLACE-ME@masjidone.co.uk` with the
   address from step 1. Leave `SEND_FROM` alone unless the sending domain
   differs.

4. **Deploy.**

   ```sh
   cd worker
   npm install
   npx wrangler deploy
   ```

5. **Point the site at it.** Set the repository variable
   `NEXT_PUBLIC_FORM_ENDPOINT` to:

   ```
   https://forms.masjidone.co.uk/demo-request
   ```

   GitHub → the repository → Settings → Secrets and variables → Actions →
   Variables. Then re-run the deploy workflow. The form switches from handing
   its answers to the visitor's mail client to posting them here, and the
   privacy notice's wording switches with it — both read the same variable, so
   they cannot disagree.

## Check it actually works before you rely on it

Deploying is not evidence. Submit the real form on the real site and confirm the
email arrives, then check that **Reply** in your mail client addresses the
enquirer and not `forms@masjidone.co.uk`.

One thing to watch on that first send: the Worker does not pass a `to`, because
Cloudflare uses the binding's `destination_address` when `to` is null or
undefined. If a send ever fails with `E_FIELD_MISSING`, that behaviour has
changed and the fix is to pass the address explicitly.

```sh
npx wrangler tail          # watch it live
```

Emails sent from a Worker show as **dropped** in the Email Routing summary even
when they were delivered. That is a known quirk of that panel, not a failure —
use the Email Sending metrics instead.

## What it refuses

| Case | Response |
| --- | --- |
| Not `POST`, or not `/demo-request` | 405 / 404 |
| `Origin` is not the site | 403 |
| Body over 32 KB | 413 |
| More than 5 posts a minute from one IP | 429 |
| Honeypot filled | **200, and nothing sent** — a bot told it failed tries again |
| No masjid, no name, or no usable email | 422 |

There is no captcha, deliberately. reCAPTCHA is a Google tracker and would bring
back the cookie banner this site exists without.

## What it does not do

It does not store anything. If the send fails, the enquiry is lost and the
visitor is told to email instead. That is the right trade for now — a store
means a retention policy, a deletion route and a thing to secure — but it is
worth revisiting if the form ever carries something you cannot afford to drop.
