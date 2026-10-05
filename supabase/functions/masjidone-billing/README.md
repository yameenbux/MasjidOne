# Automatic billing — setting up Stripe

MasjidOne collects its own monthly fee by **Bacs Direct Debit**, with Stripe
owning the schedule, the retries and the dunning emails. The code is written,
tested and applied. What follows needs a person at a Stripe screen.

Everything below was checked against Stripe's own documentation on
**5 October 2026**, not recalled. Where a figure matters — the number of
business days, the cost of a setting — it is here because it was read, and the
page it came from is linked.

## Why Direct Debit and not card

The thing that stops you chasing is the **mandate**, not the code. A card on
file still has somebody chasing when it expires or the treasurer changes; a
Bacs mandate signed once keeps pulling until it is cancelled. It is also what a
charity bank account can actually do — a mosque treasurer often has no
corporate card — and it is cheaper: 1% capped at £2, against roughly
1.5% + 20p for a UK card. On £269 that is £2 against £4.24.

[Bacs supports recurring payments](https://docs.stripe.com/payments/bacs-debit),
and there is a dedicated guide for
[subscriptions on Bacs](https://docs.stripe.com/billing/subscriptions/bacs-debit),
which is what this integration uses.

## The timings, exactly

Not "a few days". Collecting a **new** mandate, in business days:

| | |
| --- | --- |
| T+0 | Mandate submitted |
| **T+3** | **Mandate becomes active**, payment submitted |
| T+5 | Funds leave the masjid's bank account |
| T+7 | Funds available in your Stripe balance |

Once a mandate exists, a later payment confirms in **4 business days**. So the
first collection from a new masjid is about a week and a half from them signing,
and every one after that is four days. The console says this in a sentence so
nobody is told money is coming on Friday when it is not.

## Two decisions to make before you start

### 1. Whose name appears on the masjid's bank statement

By default a Bacs payer's statement shows **Stripe** as the service user, not
MasjidOne. **Custom Branding** changes it to your business name, and it costs
**£50 per active month**.

That is a real decision, not a detail. A treasurer who sees an unexplained
"STRIPE" debit rings somebody — which is precisely the chasing this whole thing
exists to stop. But £50/month against one customer at £119–£269 is most of the
margin.

The honest reading: **leave it off until there are three or four masajid**, and
tell each committee in the onboarding email exactly what will appear on their
statement and what the mandate reference looks like. Then turn it on when £50
is a rounding error rather than a third of the revenue. New mandates show your
name 5 business days after you request it, so it is not a decision you are
stuck with.

### 2. The legal entity

Register the account to **YSB Ventures Ltd** — company number, registered
address, business bank account. "MasjidOne" is the trading name and what you
want shown to customers. The Direct Debit Instruction names the entity
collecting, so this has to be the company that issues the invoices, not the
product.

## The setup, in order

### 1. Stripe account for YSB Ventures Ltd

**Not the masjid's.** The existing `stripe-webhook` in the masjid's repository
answers to Taiyabah's charity account (1041569) and records donations *into* the
masjid. This one takes money *out* of a masjid as the supplier's fee. Two
accounts, two signing secrets, two repositories. Never merge them.

### 2. Request Bacs Direct Debit

Dashboard → **Settings → Payment methods → Bacs Direct Debit → Request access**.

Access is **approval required**, and Stripe will then prompt you through
**additional identity verification**. Start this early — it is the long pole,
and nothing can be collected from a real masjid until it clears.

### 3. Turn on Direct Debit retries

Dashboard → **Revenue recovery → Retries**. Stripe will automatically retry a
Direct Debit that failed for insufficient funds, **up to 2 times within 30 days
of the original attempt**, and it does not charge the debit failure fee for
retries it initiates itself.

This is the part that does the chasing for you. It is off unless you turn it on.

### 4. A restricted API key, with exactly two permissions

Developers → API keys → **Create restricted key**.

| Resource | Permission |
| --- | --- |
| Customers | **Write** |
| Checkout Sessions | **Write** |
| *everything else* | **None** |

A full `sk_live_` here could issue refunds and read every customer's details. It
would be a worse hole than the problem it solves. The key is never needed to
verify a webhook — that is a local HMAC.

### 5. The webhook endpoint

Developers → Webhooks → **Add endpoint**, pointed at the deployed function's
`/webhook` path, subscribed to **exactly these nine events**:

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

### 6. Deploy

```bash
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

### 7. Tell the console where the function is

Repository variable `NEXT_PUBLIC_BILLING_ENDPOINT` =
`https://<project>.supabase.co/functions/v1/masjidone-billing`, no trailing
slash. The deploy workflow passes it through; until it is set, the Direct Debit
panel says so rather than offering a button that cannot work.

## Testing it in the sandbox first

A sandbox cannot do real Bacs, but it can do the whole flow with test bank
details, and that is worth doing before a real committee ever sees it. Use the
sandbox's **test** keys at step 6 (`sk_test_`/`rk_test_` and the sandbox's own
`whsec_`) and point `NEXT_PUBLIC_BILLING_ENDPOINT` at the same function.

### Do NOT create a test masjid in the live database

This is the trap, and it is a bad one. Testing billing needs a masjid with
`billable = true`, and the founding masjid is contractually not one — so the
obvious move is to add a second. **Do not.**

`sole_masjid()` raises as soon as more than one masjid exists. That is
deliberate: it fails closed rather than guessing. But eleven functions still
call it, and they are the no-argument compatibility shims that older callers
still use. Checked against the live database on 5 October 2026:

```
courses_public()              prayer_year(integer)
madrasah_calendar(date,date)  publish_notice(jsonb)
masjid_brand()                record_donation_paid(...)
mark_deposit_paid(...)        record_public_donation(...)
mark_nikah_fee_paid(...)      record_unmatched_payment(text,jsonb)
masjid_or_sole(text)
```

plus the `hall_availability` and `notices_live` **views**.

Read the payment ones again. `mark_deposit_paid`, `mark_nikah_fee_paid`,
`record_donation_paid`, `record_public_donation` — and
`record_unmatched_payment`, which is the safety net that is supposed to catch
the others failing. The masjid's Stripe webhook was moved onto the
masjid-aware overloads, but **the congregation app is a separate repository
and its call sites have not been checked**. If any of them still calls a
no-argument version, adding a second masjid row stops donations being recorded —
silently, because that is what happened the last time this went wrong.

So the second masjid is not a billing task. It is a prerequisite with its own
audit, and it has to be done before any masjid is onboarded anyway. Until then,
test on **a Supabase branch** — a separate copy of the database where a second
masjid harms nothing — or rely on the 65 ledger assertions, which already cover
the write path end to end against a local fixture.

### On a branch, or a throwaway copy

Then, in the support console, on a **test masjid** — never the founding one:

1. Set a plan, a band and a billing email.
2. **Send the Direct Debit link**, open it, and pay with sort code **10-88-00**
   and one of these account numbers:

| Account number | What happens |
| --- | --- |
| `00012345` | Succeeds immediately |
| `90012345` | Succeeds after three minutes — **use this one**, it behaves like real Bacs |
| `00033333` | The bank refuses the mandate; it goes `inactive` |
| `22222227` | Insufficient funds; the mandate stays active and can be retried |
| `33333335` | `debit_not_authorized`; the mandate dies and cannot be reused |

3. Watch `public.billing_events` fill, and `public.invoices` gain a row with
   **Stripe's** invoice number and `source = 'stripe'`.
4. Check the console's Direct Debit panel moves *Mandate pending* → *Mandate
   live*, and that **Start collecting** is refused until it does.
5. Try `00033333` on a second test masjid and confirm the panel switches
   collection off by itself and says the bank refused it.

Two things that differ from live, so do not read anything into them:
**debit-notification emails are not sent in sandboxes**, and the three-minute
test accounts compress four business days into three minutes.

## What it will refuse, and why that is right

- **The founding masjid.** `billable = false` under clause 4.2 of its
  agreement, enforced by a CHECK rather than by remembering. **So on the day
  this goes live there is nobody to auto-bill.** That is correct — it is built
  so it is ready when the second masjid signs.
- **A masjid with no band.** The amount comes from `PRICING_BANDS`; no band
  means no price, and a guessed figure on a committee's bank statement is worse
  than no collection at all.
- **A mandate that is not yet active.** See the timings above.
- **A browser asking for an amount.** It cannot. The console sends a slug; the
  function reads the plan and band from the database and does the arithmetic
  itself, from the same `lib/pricing-bands.ts` the pricing page renders from.

## Known limits, stated rather than discovered later

- **A new account has a £10,000 weekly Bacs limit**, and £10,000 per
  transaction, rising as volume builds. At £269 that is about 37 masajid in a
  week before it binds — not a near-term problem, but it is a cap, and it is
  better known now than on the day it stops a collection.
- **Bacs disputes are final.** A payer can dispute at any time, with no time
  limit; you cannot submit evidence and there is no appeal. Stripe takes the
  amount and the fee back out of your balance.
- **A dispute is NOT yet reflected in the ledger.** This is the real gap.
  Stripe can tell us a payment failed *after* it succeeded, as
  `charge.dispute.created` — and that event is not in the nine above, so an
  invoice could sit in the console reading `paid` while the money has gone
  back. `invoice_from_stripe` already handles an invoice moving back off paid
  when Stripe says so, so the work is to subscribe to the dispute event and
  route it there. Worth doing before the first real collection, not before the
  first sandbox test.

## Tests

```bash
# The money arithmetic and the Stripe form encoding — no account, no network:
node --experimental-strip-types supabase/functions/masjidone-billing/shape.test.ts

# The ledger, in the masjid's repository (65 assertions):
#   db/_test_stripe_billing.sql, against the local fixture. Never the platform.
```

Between them they assert the things that cannot be eyeballed: that a yearly
charge is exactly twelve times that masjid's own monthly rate, that the setup
fee is waived by being absent rather than reduced, that the £499 is never
encoded as recurring, that a reversed Direct Debit moves an invoice back off
paid, and that a retried webhook delivery cannot write a second payment.
