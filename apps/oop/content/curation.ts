// Questions hidden everywhere in the app: duplicates and out-of-scope items.
// Rules: never exclude an id referenced by tests/tests.ts or by a chapter `quiz` block —
// keep that one and exclude the other copy. Each kept copy got the excluded copies'
// origin.seen entries and their image/wiki sources merged in (marked "sloučeno z duplicit").

export const EXCLUDED_IDS = new Set<string>([
  // ---- Duplicates (same / near-identical question; kept copy named) ----
  'anki-27', // duplicate of kv1-01
  'wiki-k1-07', // duplicate of kv1-01 + kv1-02
  'anki-33', // duplicate of kv1-03
  'wiki-k1-05', // duplicate of kv1-03
  'anki-30', // duplicate of kv1-04
  'wiki-k1-01', // duplicate of kv1-04
  'anki-34', // duplicate of kv1-05
  'anki-31', // duplicate of kv1-06
  'anki-29', // duplicate of kv1-07
  'anki-28', // duplicate of kv1-08
  'wiki-k1-06', // duplicate of kv1-08
  'anki-35', // duplicate of kv1-09
  'wiki-poly-01', // duplicate of kv1-09
  'kv2-01', // duplicate of sample-06
  'anki-42', // duplicate of sample-06
  'wiki-k4-04', // duplicate of sample-06
  'anki-43', // duplicate of kv2-02
  'wiki-k4-02', // duplicate of sample-08
  'anki-37', // duplicate of kv2-03
  'wiki-marast_22_10_20-01', // duplicate of sample-02
  'anki-41', // duplicate of kv2-04
  'wiki-k2-02', // duplicate of kv2-05
  'anki-36', // duplicate of kv2-06
  'kv2-07', // duplicate of wiki-k4-03
  'anki-39', // duplicate of wiki-k4-03
  'anki-40', // duplicate of kv2-08
  'wiki-k4-01', // duplicate of kv2-08
  'anki-38', // duplicate of kv2-10
  'wiki-k2-04', // duplicate of kv2-10
  'anki-46', // duplicate of kv4-01
  'wiki-k2-03', // duplicate of kv4-01
  'anki-45', // duplicate of kv4-02
  'anki-09', // duplicate of kv4-03
  'anki-49', // duplicate of kv4-03
  'wiki-marast_2021_2022_mix-02', // duplicate of kv4-03
  'anki-48', // duplicate of kv4-04
  'anki-50', // duplicate of kv4-05
  'anki-44', // duplicate of kv4-06
  'anki-03', // duplicate of kv4-07
  'wiki-marast_2021_2022_mix-01', // duplicate of kv4-07
  'anki-51', // duplicate of kv4-08
  'anki-59', // duplicate of kv5-01
  'anki-53', // duplicate of kv5-02
  'anki-55', // duplicate of kv5-03
  'anki-58', // duplicate of kv5-04
  'anki-52', // duplicate of kv5-05
  'anki-54', // duplicate of kv5-06
  'wiki-marast_15_10_20-02', // duplicate of kv5-06
  'anki-57', // duplicate of kv5-07
  'anki-56', // duplicate of kv5-08
  'anki-06', // duplicate of kv5-08
  'wiki-k7-02', // duplicate of kv5-08
  'anki-88', // duplicate of kv10-01
  'anki-85', // duplicate of kv10-02
  'wiki-marast_2021_2022_mix-05', // duplicate of kv10-03
  'anki-04', // duplicate of wiki-k1-04
  'anki-07', // duplicate of wiki-k7-01
  'anki-20', // duplicate of wiki-marast_2021_2022_mix-03
  'anki-21', // duplicate of wiki-marast_2021_2022_mix-04

  // ---- Out of scope (midterm = lectures 1, 2, 4, 5, 6) ----
  'kv10-04', // out of scope: CBI vs PBI (prototype-based inheritance) – jen zmínka v diagramu L1, na midtermu není
  'kv10-05', // out of scope: CBI vs PBI – které jazyky (prototype-based inheritance) – jen zmínka v diagramu L1, na midtermu není
  'kv10-06', // out of scope: prototype-based inheritance – jen zmínka v diagramu L1, na midtermu není
  'kv10-07', // out of scope: prototype-based inheritance – lookup po řetězu prototypů – jen zmínka v diagramu L1, na midtermu není
  'kv10-08', // out of scope: prototype-based inheritance – změny prototypu – jen zmínka v diagramu L1, na midtermu není
  'anki-84', // out of scope: CBI vs PBI (prototype-based inheritance); = kv10-05 – jen zmínka v diagramu L1, na midtermu není
  'anki-86', // out of scope: CBI vs PBI (prototype-based inheritance); = kv10-04 – jen zmínka v diagramu L1, na midtermu není
  'anki-89', // out of scope: CBI vs PBI (prototype-based inheritance); = kv10-04 – jen zmínka v diagramu L1, na midtermu není
])
