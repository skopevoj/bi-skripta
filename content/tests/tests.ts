import type { MockTest } from '../types'

// Cvičné midtermy: oficiální ukázka + 4 testy nanečisto ve stejném formátu
// (10 otázek × 2 body, ~6× „Co se vypíše?“ a ~4× výběr více odpovědí).
// Otázky: bank/sample.ts, bank/mocks.ts (původní) a reálné otázky z kvizyA.ts, wiki.ts.
// Žádná otázka (ani její téměř totožná varianta) se neopakuje ve dvou testech.

export const tests: MockTest[] = [
  {
    id: 'sample',
    title: 'Ukázkový midterm 2026 (oficiální)',
    description:
      'Oficiální sample od vyučujících – přesně tak bude vypadat skutečný test. Statický vs. dynamický dispatch, overloading, bounds a variance, chyba kompilace je platná odpověď.',
    questionIds: ['sample-01', 'sample-02', 'sample-03', 'sample-04', 'sample-05', 'sample-06', 'sample-07', 'sample-08', 'sample-09', 'sample-10'],
  },
  {
    id: 'mock-1',
    title: 'Midterm nanečisto 1',
    description:
      'Nejbližší ukázkovému testu: statický typ u generik, horní mez, overloading + řetěz super, návratový typ v overridu a základy variance. Jedna otázka na pattern matching.',
    questionIds: ['mock1-01', 'kv2-10', 'mock1-04', 'mock1-03', 'mock1-02', 'kv2-08', 'kv1-08', 'mock1-06', 'mock1-05', 'kv5-07'],
  },
  {
    id: 'mock-2',
    title: 'Midterm nanečisto 2',
    description:
      'Důraz na dolní meze a odvozování typů, kontravarianci v konkrétních přiřazeních a všechna pravidla pro override. Navíc overloading uvnitř generické metody a stackable traity.',
    questionIds: ['mock2-01', 'kv2-09', 'kv1-09', 'mock2-04', 'mock2-06', 'mock2-02', 'mock2-03', 'kv1-07', 'wiki-marast_05_11_20-01', 'mock2-05'],
  },
  {
    id: 'mock-3',
    title: 'Midterm nanečisto 3',
    description:
      'Variance do hloubky – variance positions, subtyping funkcí, kontravariance s mezí – a trasování this/super přes tři úrovně. Po jedné otázce na linearizaci traitů a na case class + pattern matching.',
    questionIds: ['mock3-06', 'kv2-05', 'wiki-test_05_11_19-01', 'kv2-02', 'mock3-01', 'mock3-04', 'mock3-03', 'mock3-02', 'wiki-test_04_11_19-02', 'mock3-05'],
  },
  {
    id: 'mock-4',
    title: 'Midterm nanečisto 4 (nejtěžší)',
    description:
      'Nejtěžší sada: double dispatch, přetížení přepsané jen napůl, kombinace dolní a horní meze, kontravariance v kolekci, variance positions a linearizace s opakovaným traitem. Počítej s chybou kompilace i za běhu.',
    questionIds: ['mock4-02', 'mock4-03', 'wiki-zkouska_13_1_26-01', 'wiki-k4-03', 'mock4-04', 'mock4-06', 'wiki-test_04_11_19-01', 'kv1-06', 'mock4-01', 'mock4-05'],
  },
]
