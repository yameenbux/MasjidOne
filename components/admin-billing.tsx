"use client";

import * as React from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { DirectDebit } from "@/components/admin-direct-debit";
import {
  bandLabel,
  invoiceLines,
  linesTotal,
  money,
  monthlyPence,
  periodFrom,
  planName,
  type InvoiceLine,
} from "@/lib/billing";

/**
 * Billing, inside the panel for one masjid.
 *
 * WHY IT LIVES IN THE SUPPORT CONSOLE AND NOT IN A MASJID'S OWN PORTAL. This
 * is MasjidOne invoicing its customers. A masjid's committee has no business
 * seeing it, and more to the point a masjid's own admin must never be able to
 * read another masjid's billing — so every function behind this checks
 * is_platform_admin() internally and none of them is granted to anon. Editing
 * this JavaScript gets you nothing.
 *
 * NO PRICE IS COMPUTED HERE. lib/billing.ts turns a plan and a band into
 * invoice lines using PRICING_BANDS, which stays the one price list; this file
 * shows the result, asks for a confirmation, and passes the amounts to
 * invoice_raise. The database never learns what a band costs.
 *
 * COLLAPSED BY DEFAULT, for the same reason PlanEditor is: everything in here
 * moves money, and it should take a deliberate click rather than sitting one
 * mis-click away from a committee's bill.
 *
 * IT FAILS SOFT. PostgREST answers PGRST202 for a function it cannot find, so
 * an unapplied migration shows a sentence saying so rather than an error a
 * committee could see, or an empty panel that reads as "nothing owing".
 */

const NOT_MIGRATED = "PGRST202";

type Line = { description: string; qty: number; unit_amount_p: number; amount_p: number };

type Invoice = {
  number: string;
  status: "draft" | "sent" | "paid" | "void";
  overdue: boolean;
  days_overdue: number;
  period_start: string | null;
  period_end: string | null;
  issued_on: string | null;
  due_on: string | null;
  total_p: number;
  vat_p: number;
  paid_on: string | null;
  paid_amount_p: number | null;
  paid_method: string | null;
  paid_reference: string | null;
  short_p: number;
  void_why: string | null;
  lines: Line[];
};

type Summary = {
  masjid: string;
  name: string;
  billing: {
    billable: boolean;
    not_billable_why: string | null;
    email: string | null;
    contact: string | null;
    phone: string | null;
    cycle: "monthly" | "yearly";
    terms_days: number;
    next_invoice_on: string | null;
    setup_fee_state: "due" | "waived" | "paid";
    po_reference: string | null;
    note: string | null;
  } | null;
  plan: { code: string | null; band: string | null; since: string | null } | null;
  outstanding_p: number;
  overdue_p: number;
  paid_to_date_p: number;
  last_paid_on: string | null;
  invoices: Invoice[];
  vat_note: string;
};

const STATUS_WORD: Record<Invoice["status"], string> = {
  draft: "Draft",
  sent: "Awaiting payment",
  paid: "Paid",
  void: "Void",
};

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export function BillingPanel({
  sb,
  slug,
  plan,
  band,
}: {
  sb: SupabaseClient;
  slug: string;
  plan: string | null;
  band: string | null;
}) {
  const [open, setOpen] = React.useState(false);
  const [sum, setSum] = React.useState<Summary | null>(null);
  const [migrated, setMigrated] = React.useState(true);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [editing, setEditing] = React.useState(false);
  const [raising, setRaising] = React.useState(false);

  const load = React.useCallback(async () => {
    const { data, error: e } = await sb.rpc("masjid_billing_summary", { p_masjid: slug });
    if (e) {
      if (e.code === NOT_MIGRATED) { setMigrated(false); return; }
      setError(e.message);
      return;
    }
    setSum(data as Summary);
  }, [sb, slug]);

  React.useEffect(() => { if (open) void load(); }, [open, load]);

  async function call(fn: string, args: Record<string, unknown>) {
    setBusy(true);
    setError(null);
    const { error: e } = await sb.rpc(fn, args);
    setBusy(false);
    if (e) { setError(e.message); return false; }
    await load();
    return true;
  }

  if (!open) {
    return (
      <button
        type="button"
        className="ops__disc"
        aria-expanded={false}
        onClick={() => setOpen(true)}
      >
        Billing
      </button>
    );
  }

  if (!migrated) {
    return (
      <div className="ops__bill">
        <button type="button" className="ops__disc" aria-expanded onClick={() => setOpen(false)}>
          Billing
        </button>
        <p className="ops__note">
          <strong>Not switched on yet.</strong> Migration 136 is written and
          tested but has not been applied to the platform, so there is no
          invoice ledger to show.
        </p>
      </div>
    );
  }

  const b = sum?.billing ?? null;
  const monthly = monthlyPence(plan, band);

  return (
    <div className="ops__bill">
      <button type="button" className="ops__disc" aria-expanded onClick={() => setOpen(false)}>
        Billing
      </button>

      {error ? <p className="lsup__err" role="alert">{error}</p> : null}
      {sum === null ? <p className="ops__why">Loading…</p> : null}

      {sum ? (
        <>
          {/* NOT BILLED is said first and said loudly. The founding masjid is
              contractually never invoiced, and the one thing this panel must
              never do is make that easy to forget. */}
          {b && !b.billable ? (
            <p className="ops__note" role="note">
              <strong>This masjid is not billed.</strong> {b.not_billable_why}
            </p>
          ) : null}

          {b === null ? (
            <p className="ops__note">
              <strong>Billing is not set up.</strong> Add a billing contact
              before raising anything — an invoice with nowhere to go is not an
              invoice.
            </p>
          ) : (
            <dl className="ops__kv">
              <dt>Plan</dt>
              <dd>
                {planName(plan)} · {bandLabel(band)}
                {monthly === null ? (
                  <> · <strong>no price can be worked out</strong></>
                ) : (
                  <> · {money(monthly)} a month</>
                )}
              </dd>
              <dt>Invoice to</dt>
              <dd>
                {b.contact ?? <em>no contact</em>}
                {b.email ? <> · {b.email}</> : null}
                {b.phone ? <> · {b.phone}</> : null}
              </dd>
              <dt>Cycle</dt>
              <dd>
                {b.cycle === "yearly" ? "Yearly" : "Monthly"} · {b.terms_days} day terms
                {b.next_invoice_on ? <> · next covers from {b.next_invoice_on}</> : null}
              </dd>
              <dt>Setup fee</dt>
              <dd>
                {b.setup_fee_state === "waived"
                  ? "Waived"
                  : b.setup_fee_state === "paid"
                    ? "Paid"
                    : "Still due"}
              </dd>
              {b.po_reference ? (<><dt>Their reference</dt><dd>{b.po_reference}</dd></>) : null}
            </dl>
          )}

          <p className="ops__meta">
            <strong>{money(sum.outstanding_p)}</strong> outstanding
            {sum.overdue_p > 0 ? (
              <> · <strong>{money(sum.overdue_p)} overdue</strong></>
            ) : null}
            {" · "}{money(sum.paid_to_date_p)} paid to date
            {sum.last_paid_on ? <> · last paid {sum.last_paid_on}</> : null}
          </p>

          {/* Mounted only once billing details exist: a mandate needs an
              email to send to, and this panel is what asks for one. */}
          {b ? <DirectDebit sb={sb} slug={slug} /> : null}

          <p className="ops__acts">
            <button
              type="button"
              className="btn"
              disabled={busy}
              onClick={() => setEditing(!editing)}
            >
              <span className="btn__t">{editing ? "Cancel" : b === null ? "Set up billing" : "Edit billing details"}</span>
            </button>
            {b?.billable ? (
              <button
                type="button"
                className="btn btn--solid"
                disabled={busy || monthly === null}
                title={monthly === null ? "Set the plan and band first" : undefined}
                onClick={() => setRaising(!raising)}
              >
                <span className="btn__t">{raising ? "Cancel" : "Raise an invoice"}</span>
              </button>
            ) : null}
          </p>

          {editing ? (
            <BillingForm
              current={b}
              busy={busy}
              onSave={async (payload) => {
                if (await call("billing_set", { p_masjid: slug, payload })) setEditing(false);
              }}
            />
          ) : null}

          {raising && b ? (
            <RaiseInvoice
              plan={plan}
              band={band}
              cycle={b.cycle}
              startFrom={b.next_invoice_on ?? today()}
              includeSetup={b.setup_fee_state === "due"}
              busy={busy}
              onRaise={async (payload) => {
                if (await call("invoice_raise", { p_masjid: slug, payload })) setRaising(false);
              }}
            />
          ) : null}

          <InvoiceList
            invoices={sum.invoices}
            busy={busy}
            onSend={(n) => call("invoice_send", { p_number: n })}
            onPaid={(n, payload) => call("invoice_mark_paid", { p_number: n, payload })}
            onVoid={(n, why) => call("invoice_void", { p_number: n, p_reason: why })}
          />

          <p className="ops__why">{sum.vat_note}</p>
        </>
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------------------ */

function BillingForm({
  current,
  busy,
  onSave,
}: {
  current: Summary["billing"];
  busy: boolean;
  onSave: (payload: Record<string, unknown>) => void;
}) {
  const [billable, setBillable] = React.useState(current?.billable ?? true);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const get = (k: string) => String(f.get(k) ?? "").trim();
    onSave({
      billable,
      not_billable_why: get("why"),
      billing_contact: get("contact"),
      billing_email: get("email"),
      billing_phone: get("phone"),
      cycle: get("cycle"),
      terms_days: Number(get("terms")) || 30,
      next_invoice_on: get("next"),
      setup_fee_state: get("setup"),
      po_reference: get("po"),
      note: get("note"),
    });
  }

  return (
    <form className="cform cform--tight" onSubmit={submit}>
      <div className="cform__grid">
        <p className="cform__field">
          <label htmlFor="bf-contact">Billing contact</label>
          <input id="bf-contact" name="contact" type="text" defaultValue={current?.contact ?? ""} />
        </p>
        <p className="cform__field">
          <label htmlFor="bf-email">Billing email</label>
          <input id="bf-email" name="email" type="email" defaultValue={current?.email ?? ""} />
        </p>
        <p className="cform__field">
          <label htmlFor="bf-phone">Phone</label>
          <input id="bf-phone" name="phone" type="tel" defaultValue={current?.phone ?? ""} />
        </p>
        <p className="cform__field">
          <label htmlFor="bf-cycle">Cycle</label>
          <select id="bf-cycle" name="cycle" defaultValue={current?.cycle ?? "monthly"}>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly — waives the setup fee</option>
          </select>
        </p>
        <p className="cform__field">
          <label htmlFor="bf-terms">Payment terms (days)</label>
          <input id="bf-terms" name="terms" type="number" min={0} max={120}
                 defaultValue={current?.terms_days ?? 30} />
        </p>
        <p className="cform__field">
          <label htmlFor="bf-next">Next invoice covers from</label>
          <input id="bf-next" name="next" type="date" defaultValue={current?.next_invoice_on ?? ""} />
        </p>
        <p className="cform__field">
          <label htmlFor="bf-setup">Setup fee</label>
          <select id="bf-setup" name="setup" defaultValue={current?.setup_fee_state ?? "due"}>
            <option value="due">Still due</option>
            <option value="waived">Waived</option>
            <option value="paid">Paid</option>
          </select>
        </p>
        <p className="cform__field">
          <label htmlFor="bf-po">Their own reference</label>
          <input id="bf-po" name="po" type="text" defaultValue={current?.po_reference ?? ""} />
        </p>
      </div>

      <p className="cform__field cform__check">
        <label htmlFor="bf-billable">
          <input
            id="bf-billable"
            name="billable"
            type="checkbox"
            checked={billable}
            onChange={(e) => setBillable(e.currentTarget.checked)}
          />{" "}
          Invoice this masjid
        </label>
        <span className="cform__hint">
          Clear this for a masjid that is never invoiced. A reason is required,
          and no invoice can be raised for them until it is set again.
        </span>
      </p>

      {!billable ? (
        <p className="cform__field">
          <label htmlFor="bf-why">Why are they not billed? <span aria-hidden="true">*</span></label>
          <input id="bf-why" name="why" type="text" required
                 defaultValue={current?.not_billable_why ?? ""} />
        </p>
      ) : null}

      <p className="cform__field">
        <label htmlFor="bf-note">Note</label>
        <input id="bf-note" name="note" type="text" defaultValue={current?.note ?? ""} />
      </p>

      <button className="btn btn--solid" type="submit" disabled={busy}>
        <span className="btn__t">{busy ? "Saving…" : "Save billing details"}</span>
      </button>
    </form>
  );
}

/* ------------------------------------------------------------------------ */

/* The invoice is shown in full BEFORE it is raised, with its total, because
   the amounts come from the price list rather than from anything typed here
   and the one chance to notice a wrong band is before the thing exists. */
function RaiseInvoice({
  plan, band, cycle, startFrom, includeSetup, busy, onRaise,
}: {
  plan: string | null;
  band: string | null;
  cycle: "monthly" | "yearly";
  startFrom: string;
  includeSetup: boolean;
  busy: boolean;
  onRaise: (payload: Record<string, unknown>) => void;
}) {
  const [start, setStart] = React.useState(startFrom);
  const [withSetup, setWithSetup] = React.useState(includeSetup);

  const period = periodFrom(start, cycle);
  const { lines, problem } = invoiceLines({
    plan, band, cycle,
    periodStart: period.start,
    periodEnd: period.end,
    includeSetup: withSetup,
  });
  const total = linesTotal(lines);

  return (
    <div className="ops__raise">
      <p className="cform__field">
        <label htmlFor="ri-start">Period starts</label>
        <input id="ri-start" type="date" value={start}
               onChange={(e) => setStart(e.currentTarget.value)} />
        <span className="cform__hint">
          {cycle === "yearly" ? "Twelve months" : "One month"} from this date,
          ending {period.end}.
        </span>
      </p>

      {cycle === "monthly" ? (
        <p className="cform__field cform__check">
          <label htmlFor="ri-setup">
            <input id="ri-setup" type="checkbox" checked={withSetup}
                   onChange={(e) => setWithSetup(e.currentTarget.checked)} />{" "}
            Add the one-off setup fee
          </label>
        </p>
      ) : (
        <p className="ops__why">
          A yearly invoice waives the setup fee, so it is not added.
        </p>
      )}

      {problem ? (
        <p className="lsup__err" role="alert">{problem}</p>
      ) : (
        <>
          <table className="ops__lines">
            <caption className="u-visually-hidden">
              The lines of the invoice about to be raised
            </caption>
            <thead>
              <tr><th scope="col">What for</th><th scope="col">Qty</th><th scope="col">Each</th><th scope="col">Amount</th></tr>
            </thead>
            <tbody>
              {lines.map((l: InvoiceLine, i) => (
                <tr key={i}>
                  <td>{l.description}</td>
                  <td className="is-num">{l.qty ?? 1}</td>
                  <td className="is-num">{money(l.unit_amount_p)}</td>
                  <td className="is-num">{money((l.qty ?? 1) * l.unit_amount_p)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr><th scope="row" colSpan={3}>Total</th><td className="is-num">{money(total)}</td></tr>
            </tfoot>
          </table>

          <button
            type="button"
            className="btn btn--solid"
            disabled={busy}
            onClick={() =>
              onRaise({
                period_start: period.start,
                period_end: period.end,
                lines,
              })
            }
          >
            <span className="btn__t">
              {busy ? "Raising…" : `Raise a draft for ${money(total)}`}
            </span>
          </button>
          <p className="ops__why">
            It is raised as a draft. Nothing is sent until you send it.
          </p>
        </>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------------ */

function InvoiceList({
  invoices, busy, onSend, onPaid, onVoid,
}: {
  invoices: Invoice[];
  busy: boolean;
  onSend: (n: string) => void;
  onPaid: (n: string, payload: Record<string, unknown>) => void;
  onVoid: (n: string, why: string) => void;
}) {
  const [paying, setPaying] = React.useState<string | null>(null);

  if (invoices.length === 0) {
    return <p className="ops__why">No invoices yet.</p>;
  }

  return (
    <ul className="ops__invs">
      {invoices.map((i) => (
        <li key={i.number} className={i.overdue ? "is-overdue" : undefined}>
          <p className="ops__invhead">
            <code>{i.number}</code>
            <span className="ops__tag">{STATUS_WORD[i.status]}</span>
            <strong className="is-num">{money(i.total_p)}</strong>
          </p>

          <p className="ops__why">
            {i.period_start && i.period_end ? <>{i.period_start} to {i.period_end}. </> : null}
            {i.issued_on ? <>Issued {i.issued_on}, due {i.due_on}. </> : null}
            {i.overdue ? (
              <strong>
                {i.days_overdue} day{i.days_overdue === 1 ? "" : "s"} overdue.{" "}
              </strong>
            ) : null}
            {i.status === "paid" ? (
              <>
                Paid {i.paid_on} by {i.paid_method}
                {i.paid_reference ? <> ({i.paid_reference})</> : null}.
                {i.short_p > 0 ? (
                  <strong> {money(i.short_p)} short.</strong>
                ) : null}
              </>
            ) : null}
            {i.status === "void" ? <>Voided: {i.void_why}</> : null}
          </p>

          {i.lines.length > 0 ? (
            <ul className="ops__linelist">
              {i.lines.map((l, n) => (
                <li key={n}>
                  {l.description}
                  {l.qty > 1 ? <> × {l.qty}</> : null}
                  {" — "}<span className="is-num">{money(l.amount_p)}</span>
                </li>
              ))}
            </ul>
          ) : null}

          <p className="ops__acts">
            {i.status === "draft" ? (
              <button type="button" className="btn btn--solid" disabled={busy}
                      onClick={() => onSend(i.number)}>
                <span className="btn__t">Send it</span>
              </button>
            ) : null}

            {i.status === "sent" ? (
              <button type="button" className="btn btn--solid" disabled={busy}
                      onClick={() => setPaying(paying === i.number ? null : i.number)}>
                <span className="btn__t">{paying === i.number ? "Cancel" : "Record payment"}</span>
              </button>
            ) : null}

            {i.status === "draft" || i.status === "sent" ? (
              <button
                type="button"
                className="btn"
                disabled={busy}
                onClick={() => {
                  const why = window.prompt(
                    `Why is ${i.number} being voided? The number is kept and the reason is written to the audit trail.`,
                  );
                  if (why && why.trim()) onVoid(i.number, why);
                }}
              >
                <span className="btn__t">Void</span>
              </button>
            ) : null}
          </p>

          {paying === i.number ? (
            <form
              className="cform cform--tight"
              onSubmit={(e) => {
                e.preventDefault();
                const f = new FormData(e.currentTarget);
                const amount = String(f.get("amount") ?? "").trim();
                onPaid(i.number, {
                  /* Defaults to the full amount, so the common case is one
                     click and a method. */
                  amount_p: amount ? Math.round(Number(amount) * 100) : i.total_p,
                  method: String(f.get("method") ?? "").trim(),
                  reference: String(f.get("ref") ?? "").trim(),
                  paid_on: String(f.get("on") ?? "").trim(),
                });
                setPaying(null);
              }}
            >
              <div className="cform__grid">
                <p className="cform__field">
                  <label htmlFor={`pm-${i.number}`}>How was it paid? <span aria-hidden="true">*</span></label>
                  <select id={`pm-${i.number}`} name="method" required defaultValue="Bank transfer">
                    <option>Bank transfer</option>
                    <option>Standing order</option>
                    <option>Direct Debit</option>
                    <option>Cheque</option>
                    <option>Card</option>
                    <option>Cash</option>
                  </select>
                </p>
                <p className="cform__field">
                  <label htmlFor={`pd-${i.number}`}>Date</label>
                  <input id={`pd-${i.number}`} name="on" type="date" defaultValue={today()} />
                </p>
                <p className="cform__field">
                  <label htmlFor={`pa-${i.number}`}>Amount, if not the full {money(i.total_p)}</label>
                  <input id={`pa-${i.number}`} name="amount" type="number" step="0.01" min="0.01" />
                </p>
                <p className="cform__field">
                  <label htmlFor={`pr-${i.number}`}>Reference on the statement</label>
                  <input id={`pr-${i.number}`} name="ref" type="text" />
                </p>
              </div>
              <button className="btn btn--solid" type="submit" disabled={busy}>
                <span className="btn__t">Record it</span>
              </button>
            </form>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
