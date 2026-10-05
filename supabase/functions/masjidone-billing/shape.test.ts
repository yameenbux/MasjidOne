// Tests for shape.ts. Run with:
//   node --experimental-strip-types supabase/functions/masjidone-billing/shape.test.ts
// No Stripe account, no network, no database. That is the point.
import assert from "node:assert/strict";
import { checkoutLines, form, isPermanent, monthlyPence, pence } from "./shape.ts";
import { PRICING, PRICING_BANDS } from "./pricing-bands.ts";

let passed = 0;
function ok(label: string, fn: () => void) {
  fn();
  passed += 1;
  console.log(`pass  ${label}`);
}

// --- the figures come from the published bands, not from here ---------------
ok("every band and plan has a price in pence", () => {
  for (const b of PRICING_BANDS) {
    assert.equal(monthlyPence("madrasah", b.id), pence(b.madrasah));
    assert.equal(monthlyPence("complete", b.id), pence(b.complete));
  }
});

ok("an unknown band yields null, never a middling guess", () => {
  assert.equal(monthlyPence("complete", null), null);
  assert.equal(monthlyPence("complete", "z"), null);
  assert.equal(monthlyPence("gold", "a"), null);
});

ok("the entry band is the cheapest and the top band the dearest, in both plans", () => {
  const m = PRICING_BANDS.map((b) => b.madrasah);
  const c = PRICING_BANDS.map((b) => b.complete);
  assert.deepEqual(m, [...m].sort((x, y) => x - y));
  assert.deepEqual(c, [...c].sort((x, y) => x - y));
});

// --- the yearly invariant --------------------------------------------------
ok("a yearly line is exactly twelve times that masjid's own monthly rate", () => {
  for (const b of PRICING_BANDS) {
    const { lines } = checkoutLines({
      plan: "complete", band: b.id, cycle: "yearly", setupFeeState: "due",
    });
    assert.equal(lines[0].price_data.unit_amount, pence(b.complete) * 12);
    assert.equal(lines[0].price_data.recurring?.interval, "year");
  }
});

ok("prepaying twelve months omits the setup fee rather than reducing it", () => {
  const yearly = checkoutLines({
    plan: "complete", band: "d", cycle: "yearly", setupFeeState: "due",
  });
  assert.equal(yearly.lines.length, 1, "no second line at all");
  const monthly = checkoutLines({
    plan: "complete", band: "d", cycle: "monthly", setupFeeState: "due",
  });
  assert.equal(monthly.lines.length, 2);
  assert.equal(monthly.lines[1].price_data.unit_amount, pence(PRICING.setup));
});

ok("a setup fee already waived or paid is not charged again", () => {
  for (const s of ["waived", "paid", null]) {
    const { lines } = checkoutLines({
      plan: "madrasah", band: "a", cycle: "monthly", setupFeeState: s,
    });
    assert.equal(lines.length, 1, `setup_fee_state=${s}`);
  }
});

ok("the monthly line is the band rate, never twelve times it", () => {
  const { lines } = checkoutLines({
    plan: "madrasah", band: "b", cycle: "monthly", setupFeeState: "waived",
  });
  assert.equal(lines[0].price_data.unit_amount, pence(79));
  assert.equal(lines[0].price_data.recurring?.interval, "month");
});

ok("no price means no lines, so nothing can be charged on a guess", () => {
  const { lines, monthly } = checkoutLines({
    plan: "complete", band: null, cycle: "monthly", setupFeeState: "due",
  });
  assert.equal(monthly, null);
  assert.equal(lines.length, 0);
});

ok("everything is in whole pence", () => {
  for (const b of PRICING_BANDS) {
    for (const cycle of ["monthly", "yearly"] as const) {
      for (const line of checkoutLines({
        plan: "complete", band: b.id, cycle, setupFeeState: "due",
      }).lines) {
        assert.equal(Number.isInteger(line.price_data.unit_amount), true);
      }
    }
  }
});

ok("the currency is sterling, lower-cased the way Stripe wants it", () => {
  const { lines } = checkoutLines({
    plan: "complete", band: "a", cycle: "monthly", setupFeeState: "due",
  });
  assert.equal(lines[0].price_data.currency, "gbp");
});

// --- the form encoder ------------------------------------------------------
ok("nested objects become bracketed keys", () => {
  const q = form({ mode: "subscription", subscription_data: { metadata: { masjid: "alpha" } } });
  assert.equal(q.get("mode"), "subscription");
  assert.equal(q.get("subscription_data[metadata][masjid]"), "alpha");
});

ok("arrays are indexed, which is how Stripe reads line items", () => {
  const q = form({ payment_method_types: ["bacs_debit"] });
  assert.equal(q.get("payment_method_types[0]"), "bacs_debit");
});

ok("a real line item encodes to the keys Stripe documents", () => {
  const { lines } = checkoutLines({
    plan: "complete", band: "d", cycle: "monthly", setupFeeState: "due",
  });
  const q = form({ line_items: lines });
  assert.equal(q.get("line_items[0][price_data][unit_amount]"), "26900");
  assert.equal(q.get("line_items[0][price_data][recurring][interval]"), "month");
  assert.equal(q.get("line_items[0][quantity]"), "1");
  assert.equal(q.get("line_items[1][price_data][unit_amount]"), "49900");
  // The setup fee must NOT be recurring. A recurring £499 is a disaster.
  assert.equal(q.get("line_items[1][price_data][recurring][interval]"), null);
});

ok("null and undefined are dropped, not sent as the words", () => {
  const q = form({ a: null, b: undefined, c: "", d: 0, e: false });
  assert.equal(q.has("a"), false);
  assert.equal(q.has("b"), false);
  assert.equal(q.get("c"), "");
  assert.equal(q.get("d"), "0");
  assert.equal(q.get("e"), "false");
});

// --- which failures Stripe should stop retrying ----------------------------
ok("the database's own refusals are recognised as permanent", () => {
  for (const m of [
    "No masjid is linked to Stripe customer cus_x.",
    "Invoice in_1 is still a draft in Stripe, so it has no number yet.",
    "Stripe invoice in_1 has no number.",
    "Stripe invoice in_1 has no lines.",
    "Line 1 of Stripe invoice in_1 has no unit amount in any of the places Stripe puts it.",
    'Stripe invoice in_1 is in status "weird", which this ledger has no word for.',
    "There is no masjid called nosuch.",
  ]) assert.equal(isPermanent(m), true, m);
});

ok("anything else is transient, so Stripe is asked to try again", () => {
  for (const m of [
    "fetch failed",
    "canceling statement due to statement timeout",
    "could not serialize access due to concurrent update",
    "",
  ]) assert.equal(isPermanent(m), false, JSON.stringify(m));
});

console.log(`\n${passed} assertions passed`);
