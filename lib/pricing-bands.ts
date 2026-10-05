/**
 * The prices, re-exported.
 *
 * THE FILE ITSELF LIVES UNDER supabase/functions/masjidone-billing/, because a
 * deployed Edge Function bundle is an explicit list of files and cannot import
 * anything outside itself — so the stricter runtime decides where the data
 * sits. Its header explains the rest.
 *
 * This file exists so that nothing in the site has to know that. Pages import
 * from "@/lib/site", which re-exports from here, which re-exports from there.
 */
export {
  PRICING,
  PRICING_BANDS,
  DEFAULT_BAND,
  BAND_RANGE,
  yearlyTotal,
} from "../supabase/functions/masjidone-billing/pricing-bands";
export type { PricingBand } from "../supabase/functions/masjidone-billing/pricing-bands";
