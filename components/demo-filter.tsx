"use client";

import * as React from "react";

/**
 * Search and filter for the demo's list screens.
 *
 * WHY THIS EXISTS. The roll tile says 438 pupils. Before this, every list was
 * a fixed table with no way into it, and the first question a madrasah
 * secretary asks about any system holding 438 children is how to find one of
 * them. A demonstration that cannot answer that loses the room on the screen
 * it was winning.
 *
 * HONESTY. The demo carries a crafted slice of the roll, not all 438 rows —
 * the households here are the same ones the fees table bills, which is what
 * makes the cross-portal numbers agree. So the count line says how many rows
 * are loaded and how many are on the roll, and a search that finds nothing
 * says which of the two it looked in. Pretending to search 438 rows that are
 * not there is the kind of thing a committee finds out during the trial.
 */

export type FilterSelect = {
  /** Stable id, used for the label association. */
  id: string;
  label: string;
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
};

export function DemoFilter({
  label,
  placeholder,
  query,
  onQuery,
  selects = [],
  showing,
  loaded,
  total,
  noun,
}: {
  label: string;
  placeholder: string;
  query: string;
  onQuery: (q: string) => void;
  selects?: readonly FilterSelect[];
  /** Rows after filtering. */
  showing: number;
  /** Rows the demo carries. */
  loaded: number;
  /** What the masjid actually has, for the honest line. */
  total: number;
  noun: string;
}) {
  const id = React.useId();
  const filtered = showing !== loaded;

  return (
    <div className="dfilter">
      <div className="dfilter__row">
        <p className="dfilter__field dfilter__field--grow">
          <label htmlFor={`${id}-q`}>{label}</label>
          <input
            id={`${id}-q`}
            type="search"
            value={query}
            placeholder={placeholder}
            autoComplete="off"
            onChange={(e) => onQuery(e.target.value)}
          />
        </p>

        {selects.map((s) => (
          <p className="dfilter__field" key={s.id}>
            <label htmlFor={`${id}-${s.id}`}>{s.label}</label>
            <select
              id={`${id}-${s.id}`}
              value={s.value}
              onChange={(e) => s.onChange(e.target.value)}
            >
              {s.options.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </p>
        ))}

        {filtered || query ? (
          <button
            type="button"
            className="dfilter__clear"
            onClick={() => {
              onQuery("");
              selects.forEach((s) => s.onChange(s.options[0]));
            }}
          >
            Clear
          </button>
        ) : null}
      </div>

      {/* aria-live so a screen reader hears the count change as the list narrows. */}
      <p className="dfilter__count" role="status" aria-live="polite">
        {filtered ? (
          <>
            <strong>{showing}</strong> of {loaded} {noun} shown
          </>
        ) : (
          <>
            <strong>{loaded}</strong> {noun} loaded here
          </>
        )}
        {total > loaded ? <> · {total.toLocaleString("en-GB")} on the roll in the live system</> : null}
      </p>
    </div>
  );
}

/** Case- and diacritic-insensitive match, so "nazirah" finds "Nāẓirah". */
export function matches(query: string, ...fields: string[]) {
  const q = fold(query);
  if (!q) return true;
  return fields.some((f) => fold(f).includes(q));
}

/* A madrasah secretary types "nazirah" and "Qaidah" on an ordinary keyboard;
   the data carries "Nāẓirah" and "Qāʿidah". Stripping the marks on both sides
   is the difference between a search that works and one that looks broken. */
function fold(s: string) {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[ʿʾ'']/g, "")
    .toLowerCase()
    .trim();
}

/** Nothing matched — say which set was searched rather than just "no results". */
export function DemoEmpty({
  query,
  loaded,
  total,
  noun,
}: {
  query: string;
  loaded: number;
  total: number;
  noun: string;
}) {
  return (
    <p className="dfilter__empty">
      No {noun} here match {query ? <strong>“{query}”</strong> : "that filter"}. This
      demonstration carries {loaded} of the {total.toLocaleString("en-GB")} on the roll,
      so a real name may simply not be in the sample — the live system searches all of
      them.
    </p>
  );
}
