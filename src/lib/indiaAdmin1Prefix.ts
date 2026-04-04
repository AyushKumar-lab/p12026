/**
 * Nominatim/OSM state name → Meta Movement Distribution gadm_id prefix (India admin1).
 * Format: IND.{admin1}.* — see exported mobility CSVs for your Meta release.
 */

const INDIAN_STATE_TO_PREFIX: ReadonlyArray<readonly [string, string]> = [
  ['odisha', 'IND.26.'],
  ['orissa', 'IND.26.'],
  ['chhattisgarh', 'IND.7.'],
  ['maharashtra', 'IND.20.'],
  ['karnataka', 'IND.29.'],
  ['tamil nadu', 'IND.33.'],
  ['gujarat', 'IND.11.'],
  ['uttar pradesh', 'IND.36.'],
  ['west bengal', 'IND.38.'],
  ['bihar', 'IND.4.'],
  ['rajasthan', 'IND.30.'],
  ['madhya pradesh', 'IND.23.'],
  ['andhra pradesh', 'IND.2.'],
  ['telangana', 'IND.37.'],
  ['assam', 'IND.3.'],
  ['kerala', 'IND.18.'],
  ['punjab', 'IND.28.'],
  ['haryana', 'IND.13.'],
  ['jharkhand', 'IND.15.'],
  ['uttarakhand', 'IND.35.'],
  ['himachal pradesh', 'IND.14.'],
  ['arunachal pradesh', 'IND.1.'],
  ['manipur', 'IND.22.'],
  ['meghalaya', 'IND.21.'],
  ['mizoram', 'IND.24.'],
  ['nagaland', 'IND.25.'],
  ['tripura', 'IND.34.'],
  ['sikkim', 'IND.31.'],
  ['goa', 'IND.12.'],
  ['jammu and kashmir', 'IND.16.'],
  ['ladakh', 'IND.17.'],
  ['delhi', 'IND.10.'], // verify if mismatched; extend map as needed
  ['puducherry', 'IND.27.'],
  ['chandigarh', 'IND.6.'],
];

export function gadmAdmin1PrefixForIndianState(stateName: string): string | null {
  const s = stateName.trim().toLowerCase();
  for (const [name, prefix] of INDIAN_STATE_TO_PREFIX) {
    if (name === s) return prefix;
  }
  return null;
}

/** If free text (Mapbox label) mentions a state, return its gadm id prefix. */
export function indianStatePrefixFromText(text: string): string | null {
  const l = text.toLowerCase();
  for (const [name, prefix] of INDIAN_STATE_TO_PREFIX) {
    if (l.includes(name)) return prefix;
  }
  return null;
}
