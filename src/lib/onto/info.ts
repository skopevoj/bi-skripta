import type { ClassSt, RelSt } from '../../../content/types'

export type Family = 'object' | 'relator' | 'aspect' | 'event' | 'type' | 'datatype' | 'plain'

export type StInfo = {
  label: string // as printed in guillemets
  family: Family
  sortal?: boolean
  rigidity?: 'rigidní' | 'anti-rigidní' | 'semi-rigidní'
  identity?: 'poskytuje identitu' | 'nese identitu' | 'nemá vlastní identitu'
  dependence?: string
  desc: string
}

export const CLASS_INFO: Record<ClassSt, StInfo> = {
  kind: { label: 'kind', family: 'object', sortal: true, rigidity: 'rigidní', identity: 'poskytuje identitu', desc: 'Základní typ objektu, který dává instancím princip identity (Person, Car).' },
  subkind: { label: 'subkind', family: 'object', sortal: true, rigidity: 'rigidní', identity: 'nese identitu', desc: 'Rigidní podtyp kindu; identitu dědí od svého kindu (Man, Woman).' },
  role: { label: 'role', family: 'object', sortal: true, rigidity: 'anti-rigidní', identity: 'nese identitu', dependence: 'relační závislost', desc: 'Entitu jí dělá vztah k něčemu jinému (Student — studuje na univerzitě).' },
  phase: { label: 'phase', family: 'object', sortal: true, rigidity: 'anti-rigidní', identity: 'nese identitu', desc: 'Fáze podle vnitřní vlastnosti; fáze tvoří disjunktní a úplný rozklad (Child / Adult).' },
  collective: { label: 'collective', family: 'object', sortal: true, rigidity: 'rigidní', identity: 'poskytuje identitu', desc: 'Kolekce členů se stejnou rolí v celku (Forest, Crowd).' },
  quantity: { label: 'quantity', family: 'object', sortal: true, rigidity: 'rigidní', identity: 'poskytuje identitu', desc: 'Množství látky, nepočitatelné (Water, Wine).' },
  relator: { label: 'relator', family: 'relator', sortal: true, rigidity: 'rigidní', identity: 'poskytuje identitu', dependence: 'existenční závislost na ≥ 2 entitách', desc: 'Zhmotněný vztah — pravdivostní základ materiálních relací (Marriage, Enrollment).' },
  category: { label: 'category', family: 'object', sortal: false, rigidity: 'rigidní', identity: 'nemá vlastní identitu', desc: 'Rigidní ne-sortál: spojuje instance různých kindů se společnou vlastností (Physical Object).' },
  mixin: { label: 'mixin', family: 'object', sortal: false, rigidity: 'semi-rigidní', identity: 'nemá vlastní identitu', desc: 'Semi-rigidní ne-sortál: pro některé instance podstatný, pro jiné ne (Seatable).' },
  roleMixin: { label: 'roleMixin', family: 'object', sortal: false, rigidity: 'anti-rigidní', identity: 'nemá vlastní identitu', dependence: 'relační závislost', desc: 'Role společná instancím různých kindů (Customer jako osoba nebo firma).' },
  phaseMixin: { label: 'phaseMixin', family: 'object', sortal: false, rigidity: 'anti-rigidní', identity: 'nemá vlastní identitu', desc: 'Fáze společná instancím různých kindů (Living Being: Alive / Dead).' },
  mode: { label: 'mode', family: 'aspect', rigidity: 'rigidní', dependence: 'existenční závislost na nositeli', desc: 'Intrinsický aspekt bez hodnotové struktury (Headache, Skill).' },
  quality: { label: 'quality', family: 'aspect', rigidity: 'rigidní', dependence: 'existenční závislost na nositeli', desc: 'Intrinsický aspekt měřitelný v hodnotové struktuře (Color, Weight).' },
  event: { label: 'event', family: 'event', desc: 'Událost — děje se v čase (Wedding, Crash).' },
  type: { label: 'type', family: 'type', desc: 'Typ, jehož instance jsou zase typy (CarModel).' },
  datatype: { label: 'datatype', family: 'datatype', desc: 'Datový typ — hodnota bez identity (Date, Money).' },
  enumeration: { label: 'enumeration', family: 'datatype', desc: 'Výčet hodnot.' },
  none: { label: '', family: 'plain', desc: 'Obyčejná UML třída.' },
}

export const REL_INFO: Record<RelSt, { label: string; desc: string }> = {
  material: { label: 'material', desc: 'Materiální vztah — existuje díky relátoru (je od něj odvozen).' },
  formal: { label: 'formal', desc: 'Formální vztah — plyne přímo z vlastností entit (větší než, starší než).' },
  mediation: { label: 'mediation', desc: 'Spojuje relátor s entitami, na kterých existenčně závisí.' },
  characterization: { label: 'characterization', desc: 'Spojuje aspekt (mode / quality) s jeho nositelem.' },
  derivation: { label: 'derivation', desc: 'Váže materiální vztah k relátoru.' },
  componentOf: { label: 'componentOf', desc: 'Funkční část celku (Engine — Car).' },
  memberOf: { label: 'memberOf', desc: 'Člen kolekce (Tree — Forest).' },
  subCollectionOf: { label: 'subCollectionOf', desc: 'Podkolekce kolekce.' },
  subQuantityOf: { label: 'subQuantityOf', desc: 'Část množství látky (Alcohol — Wine).' },
  containment: { label: 'containment', desc: 'Obsahování: nádoba obsahuje množství.' },
  externalDependence: { label: 'externalDependence', desc: 'Externí závislost aspektu na jiné entitě.' },
  instantiation: { label: 'instantiation', desc: 'Instance typu vyššího řádu.' },
  none: { label: '', desc: '' },
}

export const FAMILY_LABEL: Record<Family, string> = {
  object: 'Typy objektů',
  relator: 'Relátory',
  aspect: 'Aspekty',
  event: 'Události',
  type: 'Typy',
  datatype: 'Datové typy',
  plain: 'UML',
}
