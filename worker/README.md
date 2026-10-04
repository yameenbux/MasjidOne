# The form endpoint

The website is a static export on GitHub Pages and has no server. This is the
one piece that runs code, and it exists to do one thing: take a demo request and
turn it into an email to us.

**Nothing in this directory is secret, and nothing secret may be added to it.**
The repository is public and git history is permanent. The Resend API key goes
in `wrangler secret put`, never in a file.

## Why not Formspree

A third-party form service is twenty minutes of work. The cost is that a company
we do not control holds every enquiry a mosque committee ever sends us, in their
dashboard, under their retention policy, and has to be named in our privacy
notice as a processor of it.

We sell careful handling of families' records. "Your enquiry went to a form
company" is a bad answer to a trustee who asks.

## Why not Cloudflare Email either — this changed on 4 October 2026

It used to use Cloudflare's `send_email` binding. That is now ruled out, and the
reasoning is here so nobody spends an evening rediscovering it:

| | |
| --- | --- |
| Cloudflare's docs | *"You must be using Cloudflare DNS to use Email Service."* |
| Our DNS | entirely on One.com — domain, DNS and mail |
| Moving it | costs One.com's **automatic DKIM**, which works today by itself |
| Workers Free plan | outbound Email Sending reads **"Not available"** |
| Email Routing instead | replaces the **root MX** and the mailboxes stop receiving |

So: a paid plan, plus a DNS migration, plus losing working DKIM. For a contact
form. No.

## What it does instead

The Worker receives the POST and hands the message to **Resend's REST API**.
Free tier: 3,000 a month, 100 a day, which a contact form will not come near.
The Worker has no email binding any more, so it stays on the Workers free tier.

**Resend verifies `send.masjidone.co.uk`, not the root domain.** That is the
safety property, not a detail: its SPF, DKIM and bounce records then live on the
subdomain and cannot collide with the root SPF record or disturb the MX that the
One.com mailboxes depend on. Verifying the root would mean editing the root SPF,
and two SPF records on one name is a broken configuration, not a merged one.

Resend transmits; it is not a dashboard somebody else reads your enquiries out
of. It is still a processor and the privacy notice still names it — that part
was never avoidable — but the enquiry lands in our mailbox and lives there.

## Setting it up

### 1. Verify the sending domain in Resend

1. Create a Resend account. Free plan.
2. **Domains → Add Domain →** `send.masjidone.co.uk`
3. Resend shows three records. Add them **in the One.com DNS panel**, exactly as
   given. They are all on the `send` subdomain — **if any screen offers to
   change the root MX or the root SPF, stop.**
4. Wait for Verified. Usually about fifteen minutes.

### 2. Put the API key in as a secret

```sh
cd worker
npm install
npx wrangler login
npx wrangler secret put RESEND_API_KEY     # paste when prompted
```

`wrangler secret put` reads the value from the prompt and uploads it. It is
never written to disk and never appears in the repository. Do not pass it as a
command-line argument — that lands in your shell history.

### 3. Check the config before you deploy

Needs no credentials:

```sh
npx wrangler deploy --dry-run
```

Three bindings: `RATE_LIMIT (5 requests/60s)`, `SEND_FROM`, `SEND_TO`. If you
see an `EMAIL` binding, you are on an old `wrangler.toml`. Verified passing
4 October 2026.

### 4. Deploy

```sh
npx wrangler deploy
```

It prints the hostname. It will look like
`https://masjidone-forms.<your-subdomain>.workers.dev`.

### 5. Point the site at it

Repository variable `NEXT_PUBLIC_FORM_ENDPOINT`, set to that hostname **plus the
path**:

```
https://masjidone-forms.<your-subdomain>.workers.dev/demo-request
```

GitHub → the repository → Settings → Secrets and variables → Actions →
Variables. Then re-run the deploy workflow.

The form switches from handing its answers to the visitor's mail client to
posting them here, and the privacy notice's wording switches with it — both read
the same variable, so they cannot disagree.

## Check it actually works before you rely on it

Deploying is not evidence, and neither is the test run below.

Submit the real form on the real site. Confirm the email arrives at `info@`, and
confirm that **Reply** in your mail client addresses the enquirer rather than
`forms@send.masjidone.co.uk`.

```sh
npx wrangler tail     # watch it live
```

**What was tested locally on 4 October 2026**, against `wrangler dev`:

| Case | Expected | Result |
| --- | --- | --- |
| `GET /demo-request` | 405 | ✅ |
| `POST /nope` | 404 | ✅ |
| Wrong `Origin` | 403 | ✅ |
| Empty body | 422 | ✅ |
| No email address | 422 | ✅ |
| `_gotcha` honeypot filled | 200 `{ok:true}`, **no send attempted** | ✅ |
| Six posts in a minute | 429 after the fifth | ✅ |
| `Access-Control-Allow-Origin` | the site's origin | ✅ |
| Enquiry text in the logs | **never** | ✅ none found |
| A send that actually succeeds | — | **NOT TESTED — needs a real API key** |

That last row is the one that matters and it is the one a local run cannot
cover. Step 5 above is not optional.

## What it refuses

| Case | Response |
| --- | --- |
| Not `POST`, or not `/demo-request` | 405 / 404 |
| `Origin` is not the site | 403 |
| Body over 32 KB | 413 |
| More than 5 posts a minute from one IP | 429 |
| Honeypot filled | **200, and nothing sent** — a bot told it failed tries again |
| No masjid, no name, or no usable email | 422 |
| Resend returns any non-2xx | 502, and the visitor is told to email directly |

That last row exists because `fetch` only rejects on a network failure. A 401
from a rolled key arrives as a perfectly happy `Response`, so an unchecked call
would tell every visitor their enquiry was sent while nothing was.

There is no captcha, deliberately. reCAPTCHA is a Google tracker and would bring
back the cookie banner this site exists without.

## What it does not do

It does not store anything. If the send fails, the enquiry is lost and the
visitor is told to email instead. That is the right trade for now — a store
means a retention policy, a deletion route and a thing to secure — but it is
worth revisiting if the form ever carries something you cannot afford to drop.

It also never logs what was submitted. Only a status code reaches the Workers
log, because a committee's details have no business being there.
