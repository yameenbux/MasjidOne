# Automatic billing — what is built, and the six things only a person can do

MasjidOne collects its own monthly fee by **Bacs Direct Debit**, with Stripe
owning the schedule, the retries and the dunning emails. The code is written
and tested. None of it can run until the six steps below are done, because
every one of them needs a human at a Stripe or Supabase screen.

## Why Direct Debit and not card

The thing that stops you chasing is the **mandate**, not the code. A card on
file still has somebody chasing when it expires or the treasurer changes; a
Bacs mandate signed once keeps pulling until it is cancelled. It is also what a
charity bank account can actually do — a mosque treasurer often has no
corporate card at all — and it is cheaper: 1% capped at £2, against roughly
1.5% + 20p for a UK card. On £269 that is £2 against £4.24.

**The cost of Bacs is time, and it is not a bug.** A mandate is not usable the
moment it is signed: Stripe confirms it with the bank over several working days,
and the first collection takes a few more. The console says so in a sentence,
and the database refuses to switch collection on until the mandate is live.

## The six steps

### 1. A Stripe account for YSB Ventures Ltd

**Not the masjid's.** The existing `stripe-webhook` in the masjid's repository
answers to Taiyabah's charity account (1041569) and records donations *into*
the masjid. This one takes money *out* of a masjid as the supplier's fee. Two
accounts, two signing secrets, two repositories. Never merge them.

Register at stripe.com as **YSB Ventures Ltd**, with the company number, the
registered address and the business bank account.

### 2. Activate Bacs Direct Debit on it

Stripe → Settings → Payment methods → **Bacs Direct Debit** → Turn on. Stripe
reviews it; allow a few working days. Nothing below works until it reads
"Active", and you cannot test it with a card.

### 3. A restricted API key, with exactly two permissions

Stripe → Developers → API keys → **Create restricted key**.

| Resource | Permission |
| --- | --- |
| Customers | **Write** |
| Checkout Sessions | **Write** |
| *everything else* | **None** |

A full `sk_live_` here could issue refunds and read every customer's details.
It would be a worse hole than the problem it solves. The key is never needed to
verify a webhook — that is a local HMAC.

### 4. The webhook endpoint

Stripe → Developers → Webhooks → **Add endpoint**, pointed at the deployed
function's `/webhook` path, subscribed to **exactly these nine events**:

```
checkout.session.completed
customer.subscription.created
customer.subscription.updated
customer.subscription.deleted
invoice.finalized
invoice.paid
invoice.payment_failed
invoice.voided
invoice.marked_uncollectible
```

Copy the signing secret (`whsec_…`).

### 5. Apply the migration and deploy the function

```bash
# In the masjid's repo — the migration, in the Supabase SQL editor:
#   db/141_stripe_bills_the_masjid.sql

# Here, from the repository root:
supabase secrets set MASJIDONE_STRIPE_RESTRICTED_KEY=rk_live_...
supabase secrets set MASJIDONE_STRIPE_WEBHOOK_SECRET=whsec_...
supabase functions deploy masjidone-billing --no-verify-jwt
```

`--no-verify-jwt` is required: Stripe does not send a Supabase JWT. The
`/start` route therefore checks the caller itself, by asking the database a
question only a two-step platform admin may ask.

**The keys go in `supabase secrets set` and nowhere else** — not in a file, not
in a commit, not in a chat message. Both these repositories are public and git
history is permanent. A key committed once is burned and must be rolled.

### 6. Tell the console where the function is

Set the repository variable `NEXT_PUBLIC_BILLING_ENDPOINT` to
`https://<project>.supabase.co/functions/v1/masjidone-billing` (no trailing
slash). Until it is set, the Direct Debit panel says so rather than offering a
button that cannot work.

## Then, per masjid

1. Support console → the masjid → **Billing** → set the plan, band and a
   billing email.
2. **Send the Direct Debit link.** Give it to the treasurer. They sign a Bacs
   mandate on a Stripe-hosted page; no card, just sort code and account number.
3. Wait. The panel reads *Mandate pending* while Bacs confirms with the bank.
4. When it reads *Mandate live*, press **Start collecting**. Stripe raises the
   invoice each month, retries a failure and emails them. Each invoice appears
   in the ledger with **Stripe's** number, because that is the number on the
   document the treasurer is holding.

## What it will refuse, and why that is right

- **The founding masjid.** `billable = false` under clause 4.2 of its
  agreement, enforced by a CHECK rather than by remembering. A Direct Debit is
  an invoice that collects itself, so it is refused for the same reason an
  invoice is. **On the day this is applied the platform therefore has nobody to
  auto-bill.** That is correct: it is built so it is ready when the second
  masjid signs.
- **A masjid with no band.** The amount comes from `PRICING_BANDS`; no band
  means no price, and a guessed figure on a committee's bank statement is worse
  than no collection at all.
- **A mandate that is not yet active.** See the Bacs timing above.
- **A browser asking for an amount.** It cannot. The console sends a slug; the
  function reads the plan and band from the database and does the arithmetic
  itself, out of the same `lib/pricing-bands.ts` the pricing page renders from.

## Tests

```bash
# The money arithmetic and the Stripe form encoding — no account, no network:
node --experimental-strip-types supabase/functions/masjidone-billing/shape.test.ts

# The ledger, in the masjid's repository (63 assertions):
#   db/_test_stripe_billing.sql, against the local fixture. Never the platform.
```

Between them they assert the things that cannot be eyeballed: that a yearly
charge is exactly twelve times that masjid's own monthly rate, that the setup
fee is waived by being absent rather than reduced, that the £499 is never
recurring, that a reversed Direct Debit moves an invoice back off paid, and
that a retried webhook delivery cannot write a second payment.
