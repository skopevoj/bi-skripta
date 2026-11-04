import type { Chapter, Diagram, SourceRef } from '../types'

// ---------------------------------------------------------------------------
// Sdílené odkazy

const DOC_CATEGORY: SourceRef = {
  kind: 'web',
  label: 'OntoUML docs: Category',
  url: 'https://ontouml.readthedocs.io/en/latest/classes/nonsortals/category/index.html',
}
const DOC_MIXIN: SourceRef = {
  kind: 'web',
  label: 'OntoUML docs: Mixin',
  url: 'https://ontouml.readthedocs.io/en/latest/classes/nonsortals/mixin/index.html',
}
const DOC_ROLEMIXIN: SourceRef = {
  kind: 'web',
  label: 'OntoUML docs: RoleMixin',
  url: 'https://ontouml.readthedocs.io/en/latest/classes/nonsortals/rolemixin/index.html',
}
const DOC_PHASEMIXIN: SourceRef = {
  kind: 'web',
  label: 'OntoUML docs: PhaseMixin',
  url: 'https://ontouml.readthedocs.io/en/latest/classes/nonsortals/phasemixin/index.html',
}
const DOC_KIND: SourceRef = {
  kind: 'web',
  label: 'OntoUML docs: Kind',
  url: 'https://ontouml.readthedocs.io/en/latest/classes/sortals/kind/index.html',
}
const DOC_ROLE: SourceRef = {
  kind: 'web',
  label: 'OntoUML docs: Role',
  url: 'https://ontouml.readthedocs.io/en/latest/classes/sortals/role/index.html',
}
const DOC_PHASE: SourceRef = {
  kind: 'web',
  label: 'OntoUML docs: Phase',
  url: 'https://ontouml.readthedocs.io/en/latest/classes/sortals/phase/index.html',
}
const DOC_SUBKIND: SourceRef = {
  kind: 'web',
  label: 'OntoUML docs: Subkind',
  url: 'https://ontouml.readthedocs.io/en/latest/classes/sortals/subkind/index.html',
}
const DOC_RELATOR: SourceRef = {
  kind: 'web',
  label: 'OntoUML docs: Relator',
  url: 'https://ontouml.readthedocs.io/en/latest/classes/sortals/relator/index.html',
}
const DOC_QUANTITY: SourceRef = {
  kind: 'web',
  label: 'OntoUML docs: Quantity',
  url: 'https://ontouml.readthedocs.io/en/latest/classes/sortals/quantity/index.html',
}
const DOC_FORMAL: SourceRef = {
  kind: 'web',
  label: 'OntoUML docs: Formal',
  url: 'https://ontouml.readthedocs.io/en/latest/relationships/formal/index.html',
}
const DOC_MATERIAL: SourceRef = {
  kind: 'web',
  label: 'OntoUML docs: Material',
  url: 'https://ontouml.readthedocs.io/en/latest/relationships/material/index.html',
}
const DOC_MEDIATION: SourceRef = {
  kind: 'web',
  label: 'OntoUML docs: Mediation',
  url: 'https://ontouml.readthedocs.io/en/latest/relationships/mediation/index.html',
}
const DOC_DERIVATION: SourceRef = {
  kind: 'web',
  label: 'OntoUML docs: Derivation',
  url: 'https://ontouml.readthedocs.io/en/latest/relationships/derivation/index.html',
}
const DOC_MIXRIG: SourceRef = {
  kind: 'web',
  label: 'OntoUML anti-pattern: MixRig',
  url: 'https://ontouml.readthedocs.io/en/latest/anti-patterns/MixRig/index.html',
}
const DOC_RELRIG: SourceRef = {
  kind: 'web',
  label: 'OntoUML anti-pattern: RelRig',
  url: 'https://ontouml.readthedocs.io/en/latest/anti-patterns/RelRig/index.html',
}
const MIDTERM_2022: SourceRef = {
  kind: 'image',
  src: '/sources/wiki/kom_midterm_2022.png',
  label: 'Midterm 2022 (FIT Wiki)',
}

// ---------------------------------------------------------------------------
// Diagramy

const dRationalEntity: Diagram = {
  classes: [
    { id: 're', name: 'Rational Entity', st: 'category', x: 0.5, y: 0, abstract: true, note: 'Rigidní: kdo je racionální entita, je jí nutně po celou dobu existence. Vlastní identitu nedává.' },
    { id: 'person', name: 'Person', st: 'kind', x: 0, y: 1, note: 'Poskytuje identitu osobám.' },
    { id: 'agent', name: 'Artificial Agent', st: 'kind', x: 1, y: 1, note: 'Poskytuje identitu umělým agentům — jiný princip identity než Person.' },
  ],
  gens: [{ general: 're', specifics: ['person', 'agent'], set: { disjoint: true } }],
}

const dInsuredItem: Diagram = {
  classes: [
    { id: 'ii', name: 'Insured Item', st: 'mixin', x: 0.5, y: 0, abstract: true, mark: 'focus', note: 'Semi-rigidní: auto je pojištěné nutně (v tomto modelu), dům jen někdy.' },
    { id: 'car', name: 'Car', st: 'kind', x: 0, y: 1, note: 'Rigidní podtyp mixinu: každé auto je v tomto modelu pojištěné vždy.' },
    { id: 'ih', name: 'Insured House', st: 'role', x: 1, y: 1, note: 'Anti-rigidní podtyp mixinu: dům může pojištění získat i ztratit.' },
    { id: 'house', name: 'House', st: 'kind', x: 2, y: 1, note: 'Dodává identitu domům (pojištěným i nepojištěným).' },
    { id: 'ins', name: 'Insurance', st: 'relator', x: 1, y: 2, note: 'Relátor zakládající roli Insured House. Druhého účastníka (pojišťovnu) pro jednoduchost vynecháváme.' },
  ],
  gens: [
    { general: 'ii', specifics: ['car', 'ih'], set: { disjoint: true } },
    { general: 'house', specifics: ['ih'] },
  ],
  assocs: [{ from: 'ins', to: 'ih', st: 'mediation', fromMult: '1..*', toMult: '1' }],
}

const dMixRigBad: Diagram = {
  classes: [
    { id: 'ii', name: 'Insured Item', st: 'mixin', x: 0.5, y: 0, abstract: true, mark: 'bad', note: 'Mixin, jehož všechny podtypy jsou rigidní → anti-pattern MixRig.' },
    { id: 'car', name: 'Car', st: 'kind', x: 0, y: 1 },
    { id: 'house', name: 'House', st: 'kind', x: 1, y: 1 },
  ],
  gens: [{ general: 'ii', specifics: ['car', 'house'], set: { disjoint: true }, mark: 'bad' }],
}

const dMixRigGood: Diagram = {
  classes: [
    { id: 'ii', name: 'Insurable Item', st: 'category', x: 0.5, y: 0, abstract: true, mark: 'good', note: 'Pojistitelné je každé auto i dům nutně → rigidní → «category».' },
    { id: 'car', name: 'Car', st: 'kind', x: 0, y: 1 },
    { id: 'house', name: 'House', st: 'kind', x: 1, y: 1 },
  ],
  gens: [{ general: 'ii', specifics: ['car', 'house'], set: { disjoint: true } }],
}

const dCustomerBad: Diagram = {
  classes: [
    { id: 'customer', name: 'Customer', st: 'role', x: 0.5, y: 0, mark: 'bad', note: 'Anti-rigidní typ nad rigidními kindy — zakázáno. Navíc role musí mít právě jeden princip identity.' },
    { id: 'person', name: 'Person', st: 'kind', x: 0, y: 1 },
    { id: 'org', name: 'Organisation', st: 'kind', x: 1, y: 1 },
  ],
  gens: [{ general: 'customer', specifics: ['person', 'org'], mark: 'bad' }],
}

const dCustomerGood: Diagram = {
  classes: [
    { id: 'customer', name: 'Customer', st: 'roleMixin', x: 1.2, y: 0, abstract: true, mark: 'good' },
    { id: 'pc', name: 'PersonalCustomer', st: 'role', x: 0.6, y: 1 },
    { id: 'cc', name: 'CorporateCustomer', st: 'role', x: 1.8, y: 1 },
    { id: 'person', name: 'Person', st: 'kind', x: -0.5, y: 1 },
    { id: 'org', name: 'Organisation', st: 'kind', x: 2.95, y: 1 },
  ],
  gens: [
    { general: 'customer', specifics: ['pc', 'cc'] },
    { general: 'person', specifics: ['pc'] },
    { general: 'org', specifics: ['cc'] },
  ],
}

const dRoleMixinPattern: Diagram = {
  classes: [
    { id: 'order', name: 'Order', st: 'none', x: 1.7, y: 0, note: 'Na slidu obyčejná třída. V plném OntoUML by relační závislost typicky zajistil relátor a «mediation».' },
    { id: 'customer', name: 'Customer', st: 'roleMixin', x: 1.7, y: 1, abstract: true, mark: 'focus', note: 'Anti-rigidní, relačně závislý, bez vlastní identity. Abstraktní — instance má vždy přes jednu z rolí.' },
    { id: 'pc', name: 'PersonalCustomer', st: 'role', x: 1.1, y: 2, note: 'Role osoby: identitu bere od Person.' },
    { id: 'cc', name: 'CorporateCustomer', st: 'role', x: 2.3, y: 2, note: 'Role organizace: identitu bere od Organisation.' },
    { id: 'person', name: 'Person', st: 'kind', x: 0, y: 2 },
    { id: 'org', name: 'Organisation', st: 'kind', x: 3.4, y: 2 },
  ],
  gens: [
    { general: 'customer', specifics: ['pc', 'cc'] },
    { general: 'person', specifics: ['pc'] },
    { general: 'org', specifics: ['cc'] },
  ],
  assocs: [{ from: 'order', to: 'customer', name: 'placed by', fromMult: '1..*', toMult: '1' }],
  steps: [
    { label: 'Dva druhy s různým principem identity: Person a Organisation', add: ['person', 'org'] },
    { label: 'Společný nadtyp zákaznických vlastností: «roleMixin» Customer (abstraktní)', add: ['customer'] },
    { label: 'Pro každý druh vlastní «role» — ta nese identitu svého kindu', add: ['pc', 'cc'] },
    { label: 'Relační závislost: zákazníkem jsi jen díky vztahu (objednávce); roleMixin ji dodá potomkům', add: ['order'] },
  ],
}

const dPhaseMixin: Diagram = {
  classes: [
    { id: 'lb', name: 'Living Being', st: 'category', x: 1.5, y: 0, abstract: true },
    { id: 'person', name: 'Person', st: 'kind', x: 0.5, y: 1 },
    { id: 'dog', name: 'Dog', st: 'kind', x: 2.5, y: 1 },
    { id: 'adult', name: 'Adult', st: 'phase', x: 0, y: 2 },
    { id: 'child', name: 'Child', st: 'phase', x: 1, y: 2 },
    { id: 'puppy', name: 'Puppy', st: 'phase', x: 2, y: 2 },
    { id: 'adog', name: 'Adult Dog', st: 'phase', x: 3, y: 2 },
    { id: 'young', name: 'Young Being', st: 'phaseMixin', x: 1.5, y: 3, abstract: true, mark: 'focus', note: 'Společná fáze „mládě“ napříč druhy. Podtypy jen anti-rigidní (zde phase), nadtyp nikdy sortál.' },
  ],
  gens: [
    { general: 'lb', specifics: ['person', 'dog'] },
    { general: 'person', specifics: ['adult', 'child'], set: { disjoint: true, complete: true } },
    { general: 'dog', specifics: ['puppy', 'adog'], set: { disjoint: true, complete: true } },
    { general: 'young', specifics: ['child', 'puppy'] },
  ],
}

const dFormal: Diagram = {
  classes: [
    { id: 'po', name: 'Physical Object', st: 'category', x: 1, y: 0, abstract: true, attrs: ['weight: Real'], note: 'Váha je vnitřní vlastnost každého fyzického objektu.' },
    { id: 'person', name: 'Person', st: 'kind', x: 0, y: 1 },
    { id: 'car', name: 'Car', st: 'kind', x: 2, y: 1 },
  ],
  gens: [{ general: 'po', specifics: ['person', 'car'] }],
  assocs: [{ from: 'person', to: 'car', st: 'formal', name: '/heavier-than', fromMult: '*', toMult: '*', mark: 'focus' }],
}

const dTreatmentBad: Diagram = {
  classes: [
    { id: 'person', name: 'Person', st: 'kind', x: 0, y: 1 },
    { id: 'patient', name: 'Patient', st: 'role', x: 1, y: 1 },
    { id: 'mu', name: 'Medical Unit', st: 'kind', x: 2.4, y: 1 },
  ],
  gens: [{ general: 'person', specifics: ['patient'] }],
  assocs: [{ from: 'patient', to: 'mu', name: 'treated in ►', fromMult: '1..*', toMult: '1..*', mark: 'bad' }],
}

const dTreatmentGood: Diagram = {
  classes: [
    { id: 'person', name: 'Person', st: 'kind', x: 0, y: 1 },
    { id: 'patient', name: 'Patient', st: 'role', x: 1, y: 1 },
    { id: 'mu', name: 'Medical Unit', st: 'kind', x: 3, y: 1 },
    { id: 'treat', name: 'Treatment', st: 'relator', x: 2, y: 2, mark: 'good', note: 'Jedno konkrétní ošetření = jedna instance relátoru. Mediuje právě 1 pacienta a právě 1 jednotku.' },
  ],
  gens: [{ general: 'person', specifics: ['patient'] }],
  assocs: [
    { id: 'm1', from: 'treat', to: 'patient', st: 'mediation', fromMult: '1..*', toMult: '1' },
    { id: 'm2', from: 'treat', to: 'mu', st: 'mediation', fromMult: '1..*', toMult: '1' },
    { id: 'mat', from: 'patient', to: 'mu', st: 'material', name: '/treated in ►', fromMult: '1..*', toMult: '1..*' },
  ],
  derivations: [{ relator: 'treat', assoc: 'mat' }],
}

const dMarriage: Diagram = {
  classes: [
    { id: 'person', name: 'Person', st: 'kind', x: 1, y: 0 },
    { id: 'husband', name: 'Husband', st: 'role', x: 0, y: 1, note: 'Role: manželem je Person jen díky existenci manželství.' },
    { id: 'wife', name: 'Wife', st: 'role', x: 2, y: 1 },
    { id: 'marriage', name: 'Marriage', st: 'relator', x: 1, y: 2, attrs: ['date: Date'], mark: 'focus', note: 'Truthmaker vztahu married-to. Existenčně závisí na manželovi i manželce; končí rozvodem.' },
  ],
  gens: [{ general: 'person', specifics: ['husband', 'wife'] }],
  assocs: [
    { id: 'mh', from: 'marriage', to: 'husband', st: 'mediation', fromMult: '1..*', toMult: '1' },
    { id: 'mw', from: 'marriage', to: 'wife', st: 'mediation', fromMult: '1..*', toMult: '1' },
    { id: 'mat', from: 'husband', to: 'wife', st: 'material', name: '/married-to', fromMult: '1..*', toMult: '1..*' },
  ],
  derivations: [{ relator: 'marriage', assoc: 'mat' }],
  steps: [
    { label: 'Naivně: dvě role a vztah married-to mezi nimi. Ale co ten vztah zakládá?', add: ['person', 'husband', 'wife'] },
    { label: 'Truthmaker: «relator» Marriage, «mediation» k oběma účastníkům, «derivation» k materiálnímu vztahu', add: ['marriage'] },
  ],
}

const dEnrollment: Diagram = {
  classes: [
    { id: 'person', name: 'Person', st: 'kind', x: 0, y: 0 },
    { id: 'student', name: 'Student', st: 'role', x: 0, y: 1, note: 'Studentem je Person jen díky zápisu — relační závislost splněna povinnou mediací.' },
    { id: 'enr', name: 'Enrollment', st: 'relator', x: 1.5, y: 1, attrs: ['since: Date'], mark: 'focus', note: 'Zápis ke studiu: má vlastní identitu i vlastnosti (od kdy, číslo studenta…).' },
    { id: 'uni', name: 'University', st: 'kind', x: 3, y: 1 },
  ],
  gens: [{ general: 'person', specifics: ['student'] }],
  assocs: [
    { from: 'enr', to: 'student', st: 'mediation', fromMult: '1..*', toMult: '1' },
    { from: 'enr', to: 'uni', st: 'mediation', fromMult: '0..*', toMult: '1' },
  ],
}

const dWorksForBad: Diagram = {
  classes: [
    { id: 'person', name: 'Person', st: 'kind', x: 0, y: 0 },
    { id: 'company', name: 'Company', st: 'kind', x: 2, y: 0 },
  ],
  assocs: [{ from: 'person', to: 'company', st: 'formal', name: 'works for', fromMult: '*', toMult: '*', mark: 'bad' }],
}

const dWorksForGood: Diagram = {
  classes: [
    { id: 'person', name: 'Person', st: 'kind', x: 0, y: 0 },
    { id: 'company', name: 'Company', st: 'kind', x: 2, y: 0 },
    { id: 'employee', name: 'Employee', st: 'role', x: 0, y: 1 },
    { id: 'employer', name: 'Employer', st: 'role', x: 2, y: 1 },
    { id: 'emp', name: 'Employment', st: 'relator', x: 1, y: 2, mark: 'good' },
  ],
  gens: [
    { general: 'person', specifics: ['employee'] },
    { general: 'company', specifics: ['employer'] },
  ],
  assocs: [
    { from: 'emp', to: 'employee', st: 'mediation', fromMult: '1..*', toMult: '1' },
    { from: 'emp', to: 'employer', st: 'mediation', fromMult: '1..*', toMult: '1' },
    { id: 'mat', from: 'employee', to: 'employer', st: 'material', name: '/works-for', fromMult: '1..*', toMult: '1..*' },
  ],
  derivations: [{ relator: 'emp', assoc: 'mat' }],
}

function assignment(roleMult: string, matSup: string): Diagram {
  return {
    classes: [
      { id: 'gs', name: 'Graduate Student', st: 'role', x: 0, y: 1 },
      { id: 'sup', name: 'Supervisor', st: 'role', x: 2, y: 1 },
      { id: 'asg', name: 'Assignment', st: 'relator', x: 1, y: 2 },
    ],
    assocs: [
      { from: 'asg', to: 'gs', st: 'mediation', fromMult: '1..*', toMult: roleMult },
      { from: 'asg', to: 'sup', st: 'mediation', fromMult: '1..*', toMult: roleMult },
      { id: 'mat', from: 'gs', to: 'sup', st: 'material', name: '/supervised-by ►', fromMult: '1..*', toMult: matSup },
    ],
    derivations: [{ relator: 'asg', assoc: 'mat' }],
  }
}

const dRelRigBad: Diagram = {
  classes: [
    { id: 'man', name: 'Man', st: 'kind', x: 0, y: 0, mark: 'bad', note: 'Povinná mediace na rigidním typu: každý muž by musel být nutně ženatý.' },
    { id: 'marriage', name: 'Marriage', st: 'relator', x: 1.5, y: 0 },
    { id: 'woman', name: 'Woman', st: 'kind', x: 3, y: 0, mark: 'bad' },
  ],
  assocs: [
    { from: 'marriage', to: 'man', st: 'mediation', fromMult: '1..*', toMult: '1', mark: 'bad' },
    { from: 'marriage', to: 'woman', st: 'mediation', fromMult: '1..*', toMult: '1', mark: 'bad' },
  ],
}

const dRelRigGood: Diagram = {
  classes: [
    { id: 'man', name: 'Man', st: 'kind', x: 0, y: 0 },
    { id: 'woman', name: 'Woman', st: 'kind', x: 3, y: 0 },
    { id: 'husband', name: 'Husband', st: 'role', x: 0, y: 1, mark: 'good' },
    { id: 'marriage', name: 'Marriage', st: 'relator', x: 1.5, y: 1 },
    { id: 'wife', name: 'Wife', st: 'role', x: 3, y: 1, mark: 'good' },
  ],
  gens: [
    { general: 'man', specifics: ['husband'] },
    { general: 'woman', specifics: ['wife'] },
  ],
  assocs: [
    { from: 'marriage', to: 'husband', st: 'mediation', fromMult: '1..*', toMult: '1' },
    { from: 'marriage', to: 'wife', st: 'mediation', fromMult: '1..*', toMult: '1' },
  ],
}

// ---------------------------------------------------------------------------

export const chap04: Chapter = {
  id: 'chap-4',
  number: '4',
  title: 'Ne-sortály a vztahy',
  docs: ['P03', 'C04'],
  exam: ['midterm', 'zkouska'],
  summary:
    'Poznáš «category», «mixin», «roleMixin» a «phaseMixin», víš, co smí být nad- a podtypem čeho, a umíš místo holé asociace postavit vzor s relátorem: «relator» + «mediation» + odvozený «material» přes «derivation».',
  sections: [
    // =====================================================================
    {
      id: 'sec-4-1',
      number: '4.1',
      title: 'Ne-sortály: společné vlastnosti různých druhů',
      blocks: [
        {
          kind: 'p',
          html: 'Sortály (kind, subkind, role, phase) mají vždy <strong>právě jeden princip identity</strong>. Někdy ale potřebujeme typ, který sdružuje instance <em>různých</em> druhů: pojistitelná věc může být auto, budova i část těla sportovce. Takový typ nemůže být sortál — nemá jak dát všem instancím stejnou identitu. Je to <strong>ne-sortál</strong> (non-sortal).',
          sources: [
            { kind: 'slide', doc: 'P03', page: 3, quote: 'Pojistitelná věc může být Auto, Budova, Část těla (sportovce).' },
            { kind: 'slide', doc: 'C04', page: 3, quote: 'nemohou být Sortály kvůli identitě' },
          ],
        },
        {
          kind: 'callout',
          type: 'definice',
          title: 'Ne-sortál',
          html: '<ul><li><strong>Nemá vlastní identitu</strong> (neposkytuje ani nenese princip identity) — instance od něj dostane obecné vlastnosti, ale identitu má od svého kindu.</li><li>Jeho instance <strong>mohou mít různé principy identity</strong> (každá jednotlivá instance ale má právě jednu).</li><li>Třída ne-sortálu je <strong>vždy abstraktní</strong> (název kurzívou) — instance vzniká jen přes nějaký sortální podtyp.</li></ul>',
          sources: [
            { kind: 'slide', doc: 'P03', page: 3, quote: 'Nemá vlastní identitu z hlediska našeho vnímání' },
            { kind: 'slide', doc: 'P03', page: 3, quote: 'Všechny třídy reprezentující non-sortal typy jsou abstraktní.' },
            { kind: 'slide', doc: 'C04', page: 4, quote: '(ale každá jedna instance má právě jednu svou identitu)' },
          ],
        },
        {
          kind: 'diagram',
          title: 'Nejjednodušší ne-sortál: «category» nad dvěma kindy',
          diagram: dRationalEntity,
          caption: 'Person i Artificial Agent dávají identitu po svém; Rational Entity je jen sdružuje a dodává společné (nutné) vlastnosti.',
          sources: [{ kind: 'slide', doc: 'P03', page: 5 }],
        },
        {
          kind: 'p',
          html: 'Ne-sortály dělíme stejně jako sortály podle <strong>rigidity</strong> (a u anti-rigidních ještě podle relační závislosti). Vzniknou čtyři stereotypy:',
          sources: [{ kind: 'slide', doc: 'P03', page: 17 }],
        },
        {
          kind: 'table',
          head: ['Stereotyp', 'Poskytuje identitu', 'Nese identitu', 'Rigidita', 'Relační závislost', 'Ne-sortální obdoba…'],
          rows: [
            ['<span class="st">«category»</span>', '−', '−', '+ rigidní', '−', 'kindu / subkindu'],
            ['<span class="st">«mixin»</span>', '−', '−', '~ semi-rigidní', '−', '(nemá sortální obdobu)'],
            ['<span class="st">«roleMixin»</span>', '−', '−', '− anti-rigidní', '+', 'role'],
            ['<span class="st">«phaseMixin»</span>', '−', '−', '− anti-rigidní', '−', 'phase'],
            ['<em>pro srovnání</em> <span class="st">«kind»</span>', '+', '+', '+', '−', ''],
            ['<em>pro srovnání</em> <span class="st">«role»</span>', '−', '+', '−', '+', ''],
          ],
          caption: 'Přehled podle slidu „Přehled kategorií typů OntoUML“. Ne-sortál má v obou sloupcích identity vždy minus.',
          sources: [{ kind: 'slide', doc: 'P03', page: 27 }],
        },
        {
          kind: 'callout',
          type: 'past',
          title: 'Jak poznám ne-sortál?',
          html: 'Zeptej se: <em>„Mají všechny instance stejný princip identity?“</em> Pokud ne (osoba × firma, auto × dům, člověk × pes), je společný nadtyp ne-sortál. A obráceně: ne-sortál <strong>nikdy nesmí být podtypem sortálu</strong> — zdědil by identitu, kterou mít nemá.',
          sources: [{ kind: 'slide', doc: 'P02', page: 59, quote: 'Non-Sortal nemůže být podtypem sortálu.' }],
        },
        { kind: 'quiz', ids: ['ch04-01', 'ch04-17'] },
      ],
    },
    // =====================================================================
    {
      id: 'sec-4-2',
      number: '4.2',
      title: '«category» a «mixin»',
      blocks: [
        {
          kind: 'callout',
          type: 'definice',
          title: '«category» — rigidní ne-sortál',
          html: 'Reprezentuje <strong>nutné</strong> vlastnosti instancí různých sortálů: kdo je Physical Object, je jím po celou svou existenci. Typicky kategorizuje kindy a subkindy a tvoří <strong>nejsvrchnější vrstvu</strong> ontologie (Physical Object, Rational Entity, Living Being). Jeden kind může mít nad sebou i několik category.',
          sources: [
            { kind: 'slide', doc: 'P03', page: 5, quote: 'Typicky tvoří nejsvrchnější vrstvu typů ontologie.' },
            { kind: 'slide', doc: 'P03', page: 6, quote: 'je abstraktní a může zobecňovat sortály i další non-sortály' },
            { kind: 'slide', doc: 'C04', page: 5, quote: 'Kategorizují zejména rigidní podtypy' },
            DOC_CATEGORY,
          ],
        },
        {
          kind: 'callout',
          type: 'poznamka',
          title: 'Disjoint pod category',
          html: 'Dva různé kindy pod jednou category jsou disjunktní vždy — instance nemůže mít dvě identity. <strong>Libovolné</strong> podtypy category ale disjunktní být nemusí; <code>disjoint</code> a <code>complete</code> volíš pro každý generalization set podle domény, ze stereotypu samy neplynou.',
          sources: [
            { kind: 'slide', doc: 'P03', page: 6, quote: 'Různí poskytovatelé identity jsou disjunktní.' },
            { kind: 'slide', doc: 'C04', page: 5, quote: 'Podtypy musí být {disjoint} (vyplývá z identity)' },
          ],
        },
        {
          kind: 'callout',
          type: 'definice',
          title: '«mixin» — semi-rigidní ne-sortál',
          html: 'Vlastnost, která je pro <strong>některé</strong> instance nutná (□) a pro jiné jen možná (◇). Proto <strong>každý mixin musí mít alespoň dva podtypy s různou rigiditou</strong> — aspoň jeden rigidní a aspoň jeden anti-rigidní. Klasický příklad: Seatable — židle (kind) je k sezení vždy, bedna (Crate) jen ve fázi Solid Crate.',
          sources: [
            { kind: 'slide', doc: 'P03', page: 19, quote: 'Každý Mixin musí být nadtypem rigidního typu a současně nadtypem anti-rigidního' },
            { kind: 'slide', doc: 'C04', page: 7, quote: 'Každý Mixin musí mít alespoň dva podtypy s různou rigiditou.' },
            DOC_MIXIN,
          ],
        },
        {
          kind: 'diagram',
          title: '«mixin» Insured Item: rigidní Car + anti-rigidní Insured House',
          diagram: dInsuredItem,
          caption: 'V tomto modelu je auto pojištěné vždy (rigidní podtyp), dům jen dokud má pojistku (role). Proto je Insured Item semi-rigidní → «mixin».',
          sources: [
            { kind: 'slide', doc: 'P03', page: 20 },
            { kind: 'slide', doc: 'P03', page: 21 },
          ],
        },
        {
          kind: 'compare',
          title: 'Mixin se stejnou rigiditou podtypů (anti-pattern MixRig)',
          items: [
            { label: 'Špatně', verdict: 'bad', note: 'Oba podtypy jsou rigidní kindy — „semi-rigidita“ se nemá kde projevit.', diagram: dMixRigBad },
            { label: 'Správně', verdict: 'good', note: 'Má-li mixin jen rigidní podtypy, je to ve skutečnosti «category» (jen anti-rigidní → «roleMixin» / «phaseMixin»).', diagram: dMixRigGood },
          ],
          sources: [
            { kind: 'slide', doc: 'P05', page: 31, quote: 'Mixin musí mít minimálně dva podtypy s různou rigiditou.' },
            DOC_MIXRIG,
          ],
        },
        { kind: 'quiz', ids: ['ch04-02', 'ch04-08'] },
      ],
    },
    // =====================================================================
    {
      id: 'sec-4-3',
      number: '4.3',
      title: '«roleMixin» a «phaseMixin»',
      blocks: [
        {
          kind: 'p',
          html: 'Firma i člověk mohou být zákazníky. Lákavé je udělat <span class="st">«role»</span> Customer a pověsit pod ni Person a Organisation. To je ale chyba hned dvakrát: anti-rigidní typ nesmí být nadtypem rigidního a role musí mít právě jeden princip identity.',
          sources: [{ kind: 'slide', doc: 'P03', page: 10, quote: 'Anti-rigidní typ nemůže být nadtypem rigidního.' }],
        },
        {
          kind: 'compare',
          title: 'Zákazník: osoba nebo firma',
          items: [
            { label: 'Špatně', verdict: 'bad', note: '«role» nad dvěma «kind» — anti-rigidní nad rigidním, a role by měla dvě identity.', diagram: dCustomerBad },
            { label: 'Správně', verdict: 'good', note: '«roleMixin» sjednotí zákaznické vlastnosti; identitu dodají role pod Person a Organisation.', diagram: dCustomerGood },
          ],
          sources: [
            { kind: 'slide', doc: 'P03', page: 10 },
            { kind: 'slide', doc: 'P03', page: 12 },
            { kind: 'slide', doc: 'P03', page: 55, quote: 'pod kterým rozlišíme role člověka a organizace' },
          ],
        },
        {
          kind: 'callout',
          type: 'definice',
          title: '«roleMixin» — anti-rigidní a relačně závislý',
          html: 'Reprezentuje <strong>možné</strong> (◇) vlastnosti instancí různých druhů, které entita má díky vztahu k něčemu jinému. Jak <span class="st">«category»</span> klasifikuje kindy, tak <span class="st">«roleMixin»</span> klasifikuje <strong>role</strong>. Relační závislost (vztah, na kterém role závisí) stačí připojit k roleMixinu — <strong>dodá ji všem potomkům</strong>.',
          sources: [
            { kind: 'slide', doc: 'P03', page: 11, quote: 'RoleMixin jsou anti-rigidní a relačně závislé non-sortální typy' },
            { kind: 'slide', doc: 'C04', page: 6, quote: '«RoleMixin» je relačně závislý, dodává potomkům relaci, na které závisí' },
            DOC_ROLEMIXIN,
          ],
        },
        {
          kind: 'diagram',
          title: 'Vzor roleMixin krok za krokem',
          diagram: dRoleMixinPattern,
          caption: 'Obecně: roleMixin A nad rolemi B, C; každá role pod jiným druhem (D, E); vztah k F visí na A. Role B a C mají relační závislost splněnou díky tomu, že jsou přímými podtypy A.',
          sources: [
            { kind: 'slide', doc: 'P03', page: 13 },
            { kind: 'slide', doc: 'P03', page: 14 },
            { kind: 'slide', doc: 'P05', page: 27, quote: 'Role je přímým podtypem rolemixinu, který je součástí mediation asociace.' },
          ],
        },
        {
          kind: 'callout',
          type: 'definice',
          title: '«phaseMixin» — anti-rigidní, relačně nezávislý',
          html: 'Obdoba <span class="st">«phase»</span> pro vnitřní stav sdílený napříč druhy (mládě: dítě i štěně). Pravidla: nadtypem smí být jen <span class="st">«category»</span>, <span class="st">«mixin»</span> nebo jiný <span class="st">«phaseMixin»</span> (nikdy sortál), potomci musí zůstat anti-rigidní. Konkrétní phase pod ním dál patří do <code>{disjoint, complete}</code> rozkladu svého kindu.',
          sources: [
            { kind: 'slide', doc: 'P03', page: 9, quote: 'Je obdobou Phase pro intrinsický, relačně nezávislý stav sdílený napříč několika druhy.' },
            { kind: 'slide', doc: 'P03', page: 9, quote: 'Jeho potomci musí zůstat anti-rigidní; rigidní a semi-rigidní typy jsou zakázány.' },
            DOC_PHASEMIXIN,
          ],
        },
        {
          kind: 'diagram',
          title: '«phaseMixin» Young Being nad fázemi dvou různých druhů',
          diagram: dPhaseMixin,
          caption: 'Child (fáze Person) i Puppy (fáze Dog) jsou „mládě“. Na slidu je analogicky i Mature Being nad Adult a Adult Dog.',
          sources: [{ kind: 'slide', doc: 'P03', page: 8 }],
        },
        {
          kind: 'callout',
          type: 'shrnuti',
          title: 'Čtyři ne-sortály jednou větou',
          html: '<span class="st">«category»</span> = nutná společná vlastnost (rigidní) · <span class="st">«mixin»</span> = pro někoho nutná, pro někoho ne (semi-rigidní, podtypy s různou rigiditou) · <span class="st">«roleMixin»</span> = společná role různých druhů (anti-rigidní + relačně závislý) · <span class="st">«phaseMixin»</span> = společná fáze různých druhů (anti-rigidní, nezávislý).',
          sources: [{ kind: 'slide', doc: 'C06', page: 7 }],
        },
        { kind: 'quiz', ids: ['ch04-07', 'ch04-09'] },
        {
          kind: 'interactive',
          component: 'stereotype-tree',
          title: 'Který stereotyp? Rozhodovací strom',
          hint: 'Zkus si projít Customer, Insured Item, Living Being a Young Being: má typ vlastní identitu? Je rigidní? Závisí na vztahu?',
        },
      ],
    },
    // =====================================================================
    {
      id: 'sec-4-4',
      number: '4.4',
      title: 'Co smí být nadtypem a podtypem čeho',
      blocks: [
        {
          kind: 'p',
          html: 'Midterm se rád ptá „Nadtypem «X» může být…“. Tabulku se nemusíš učit nazpaměť — stačí tři pravidla, ze kterých všechno plyne:',
        },
        {
          kind: 'list',
          ordered: true,
          items: [
            '<strong>Ne-sortál nikdy pod sortálem.</strong> Zdědil by identitu. → Nad <span class="st">«category»</span>, <span class="st">«mixin»</span>, <span class="st">«roleMixin»</span>, <span class="st">«phaseMixin»</span> jsou jen ne-sortály.',
            '<strong>Anti-rigidní nikdy nad rigidním (ani semi-rigidním).</strong> → Pod <span class="st">«role»</span>, <span class="st">«phase»</span>, <span class="st">«roleMixin»</span>, <span class="st">«phaseMixin»</span> jsou jen anti-rigidní typy.',
            '<strong>Poskytovatel identity nemá nad sebou sortál.</strong> <span class="st">«kind»</span>, <span class="st">«collective»</span>, <span class="st">«quantity»</span>, <span class="st">«relator»</span> (a aspekty) smí mít nad sebou jen <span class="st">«category»</span> a <span class="st">«mixin»</span> — tedy rigidní/semi-rigidní ne-sortály.',
          ],
          sources: [
            { kind: 'slide', doc: 'P02', page: 59, quote: 'Anti-rigidní typ nemůže být nadtypem rigidního typu.' },
            { kind: 'slide', doc: 'P02', page: 59, quote: 'Kind poskytuje identitu a nemůže být podtypem jiného sortálu.' },
            { kind: 'slide', doc: 'P03', page: 45, quote: 'Relator je rigidní sortál poskytující identitu' },
          ],
        },
        {
          kind: 'table',
          head: ['Stereotyp', 'Povolené nadtypy', 'Povolené podtypy'],
          rows: [
            ['<span class="st">«kind»</span>, <span class="st">«collective»</span>, <span class="st">«quantity»</span>, <span class="st">«relator»</span>', '<strong>Category, Mixin</strong>', 'Subkind, Role, Phase'],
            ['<span class="st">«subkind»</span>', 'poskytovatel identity, Subkind, Category, Mixin', 'Subkind, Role, Phase'],
            ['<span class="st">«phase»</span>', 'rigidní sortály, Phase, Category, Mixin, PhaseMixin', 'Phase, Role'],
            ['<span class="st">«role»</span>', 'cokoli (sortály i ne-sortály, včetně Role, RoleMixin)', '<strong>jen Role</strong>'],
            ['<span class="st">«category»</span>', 'Category, Mixin', 'všechny typy (sortály i ne-sortály, aspekty)*'],
            ['<span class="st">«mixin»</span>', 'Category, Mixin', 'všechny typy (sortály i ne-sortály, aspekty)'],
            ['<span class="st">«roleMixin»</span>', 'Category, Mixin, RoleMixin, PhaseMixin', 'Role, RoleMixin'],
            ['<span class="st">«phaseMixin»</span>', 'Category, Mixin, PhaseMixin', 'Phase, PhaseMixin, Role, RoleMixin'],
          ],
          caption: 'Podle tabulek „Allowed supertypes / subtypes“ v OntoUML docs. * Midterm 2022 u „Podtypem «Category» může být“ uznal jen rigidní typy, zkouška už všech 8 — viz past níže.',
          sources: [DOC_KIND, DOC_QUANTITY, DOC_RELATOR, DOC_SUBKIND, DOC_PHASE, DOC_ROLE, DOC_CATEGORY, DOC_MIXIN, DOC_ROLEMIXIN, DOC_PHASEMIXIN],
        },
        {
          kind: 'callout',
          type: 'past',
          title: 'Midterm 2022: podtypy «category»',
          html: 'Na otázku „Podtypem «Category» může být…“ uznal Moodle v midtermu 2022 jen <strong>Subkind, Kind, Relator, Collective, Category, Quality</strong> a Phase i Role označil jako chybné (odpovídá zjednodušení na cvičení: „«Category» = rigidní non-sortál, pro rigidní podtypy“). Ve zkouškové verzi téže otázky ale prošlo všech 8 možností a přednáška i OntoUML docs pod category připouštějí i anti-rigidní typy. <strong>Odpovídej podle přednášky (i Phase a Role)</strong>, jen počítej s tím, že starší klíč to bral jinak. Nad <span class="st">«kind»</span> a <span class="st">«quantity»</span> byla správně <strong>Category, Mixin</strong>.',
          sources: [
            MIDTERM_2022,
            { kind: 'slide', doc: 'C06', page: 7, quote: '«Category» = rigidní non-sortál, pro rigidní podtypy' },
            { kind: 'slide', doc: 'P03', page: 6, quote: 'je abstraktní a může zobecňovat sortály i další non-sortály' },
          ],
        },
        { kind: 'quiz', ids: ['ch04-03', 'ch04-04', 'ch04-05'], title: 'Otázky z midtermu 2022' },
        { kind: 'quiz', ids: ['ch04-06', 'ch04-10', 'ch04-11'] },
      ],
    },
    // =====================================================================
    {
      id: 'sec-4-5',
      number: '4.5',
      title: 'Formální a materiální vztahy',
      blocks: [
        {
          kind: 'p',
          html: 'V OntoUML nesmí být asociace bez stereotypu. Základní otázka u každého vztahu: <em>stojí mezi entitami ještě něco třetího?</em>',
          sources: [{ kind: 'slide', doc: 'C04', page: 8, quote: 'V OntoUML také blíže určujeme i relace (nelze mít asociaci bez typu)' }],
        },
        {
          kind: 'table',
          head: ['', '<span class="st">«formal»</span>', '<span class="st">«material»</span>'],
          rows: [
            ['Co ho zakládá', 'nic navíc — plyne přímo z <strong>vnitřních vlastností</strong> obou entit', 'třetí entita: <span class="st">«relator»</span> (truthmaker) vzniklý <strong>zakládající událostí</strong>'],
            ['Příklady', 'heavier-than, older-than, taller-than, opposite-colored', 'married-to, works-for, treated-in, studies-at'],
            ['Připomíná', '<span class="st">«phase»</span> (vnitřní atribut)', '<span class="st">«role»</span> (něco vnějšího)'],
            ['Zápis', 'vždy odvozený: <code>/název</code>', 'odvozený z relátoru přes <span class="st">«derivation»</span>'],
          ],
          sources: [
            { kind: 'slide', doc: 'P03', page: 29, quote: 'Formální relace existují mezi dvěma entitami přímo, bez dalšího intervenujícího' },
            { kind: 'slide', doc: 'P03', page: 29, quote: 'V tomto ohledu připomínají «phase», které jsou založeny na vnitřních atributech.' },
            { kind: 'slide', doc: 'P03', page: 33, quote: 'Formální relace jsou vždy relace odvozené' },
            { kind: 'slide', doc: 'C04', page: 8, quote: 'Materiální relace naopak vyžadují existenci pečetidla vztahu = «Relator»' },
          ],
        },
        {
          kind: 'diagram',
          title: '«formal»: porovnání vnitřních vlastností',
          diagram: dFormal,
          caption: 'heavierThan(x, y) ⇔ weight(x) > weight(y). Vztah se dá kdykoli spočítat z vah — proto je odvozený (/heavier-than) a nepotřebuje relátor.',
          sources: [
            { kind: 'slide', doc: 'P03', page: 32 },
            { kind: 'slide', doc: 'P03', page: 33 },
            DOC_FORMAL,
          ],
        },
        {
          kind: 'callout',
          type: 'pravidlo',
          title: 'Jak poznám formální vztah',
          html: 'Zkus vztah <strong>spočítat</strong> jen z atributů / kvalit obou stran (věk, výška, barva). Jde to? → <span class="st">«formal»</span>. Potřebuješ smlouvu, svatbu, zápis, ošetření — něco, co vzniklo a může zaniknout? → <span class="st">«material»</span> + <span class="st">«relator»</span>.',
          sources: [{ kind: 'slide', doc: 'P03', page: 29, quote: 'Vždy jsme schopni identifikovat vnitřní atributy / aspekty entit, které relaci definují: výška' }],
        },
        {
          kind: 'compare',
          title: 'Typická chyba: „pracuje pro“ jako formální vztah',
          items: [
            { label: 'Špatně', verdict: 'bad', note: 'Z vlastností osoby a firmy pracovní poměr nespočítáš — vzniká smlouvou a smlouvou zaniká.', diagram: dWorksForBad },
            { label: 'Správně', verdict: 'good', note: 'Truthmaker je Employment; works-for je odvozený materiální vztah mezi rolemi.', diagram: dWorksForGood },
          ],
          sources: [{ kind: 'slide', doc: 'P03', page: 43, quote: 'Bill pracuje pro společnost X a nikoliv pro' }],
        },
        { kind: 'quiz', ids: ['ch04-12'] },
      ],
    },
    // =====================================================================
    {
      id: 'sec-4-6',
      number: '4.6',
      title: '«relator» a «mediation»',
      blocks: [
        {
          kind: 'p',
          html: 'John se ožení s Mary. Tím získá vlastnosti, které jsou jeho, ale <strong>existenčně závisí na Mary</strong> (jméno manželky, společné jmění…). Vznikly <strong>zakládající událostí</strong> (svatbou). Souhrn těchto vlastností Johna vůči Mary je <em>qua individual</em> „John-qua-husband-of-Mary“; totéž má Mary vůči Johnovi.',
          sources: [
            { kind: 'slide', doc: 'P03', page: 35, quote: 'John se ožení s Mary. (A naopak.)' },
            { kind: 'slide', doc: 'P03', page: 36, quote: 'získal John v důsledku zakládající události (founding event)' },
            { kind: 'slide', doc: 'P03', page: 38, quote: 'Entity, které jsou agregací všech vlastností získaných na základě stejné' },
          ],
        },
        {
          kind: 'callout',
          type: 'definice',
          title: '«relator»',
          html: '<ul><li>Entita agregující všechny qua individuals jedné zakládající události — zhmotněný vztah (Marriage, Enrollment, Employment, Treatment).</li><li><strong>Truthmaker (pečetidlo) materiálního vztahu</strong>: odpovídá na „Co znamená, že John je ženatý s Mary?“ Vztah trvá, jen dokud trvá relátor (zrušení smlouvy ukončí pracovní poměr).</li><li><strong>Rigidní sortál poskytující identitu</strong> — pravidla jako pro kind: podtypy Subkind/Role/Phase, nadtypy Category/Mixin.</li><li>Existenčně závisí na <strong>alespoň dvou různých</strong> jedincích, se kterými je spojen přes <span class="st">«mediation»</span>.</li></ul>',
          sources: [
            { kind: 'slide', doc: 'P03', page: 40, quote: 'Nyní můžeme vytvořit entitu, která je agregací všech qua individuals, které se váží ke' },
            { kind: 'slide', doc: 'P03', page: 43, quote: 'Relátory jsou tedy určitým pečetidlem (angl. truthmaker) pro materiální relace' },
            { kind: 'slide', doc: 'P03', page: 45, quote: 'Relator je rigidní sortál poskytující identitu' },
            { kind: 'slide', doc: 'P03', page: 50, quote: 'Každý relátor závisí na alespoň dvou různých jedincích' },
            DOC_RELATOR,
          ],
        },
        {
          kind: 'callout',
          type: 'definice',
          title: '«mediation»',
          html: 'Vztah mezi relátorem a entitami, které spojuje. Je to <strong>existenčně závislý</strong> vztah: relátor bez svých účastníků neexistuje. Mediace, která definuje roli, musí být na straně relátoru <strong>povinná</strong> (min. 1; může být i zděděná) — tím je splněna relační závislost role.',
          sources: [
            { kind: 'slide', doc: 'P03', page: 41, quote: 'Mediace je typ existenčně závislé relace.' },
            { kind: 'slide', doc: 'P03', page: 50, quote: 'Mediace definující roli musí být' },
            DOC_MEDIATION,
          ],
        },
        {
          kind: 'diagram',
          title: 'Enrollment: relátor mezi studentem a univerzitou',
          diagram: dEnrollment,
          caption: 'Student je role — studentem jsi jen díky zápisu. Enrollment má vlastní identitu a vlastnosti (od kdy). Jeden člověk může mít víc zápisů, každý zápis patří právě jednomu studentovi a jedné univerzitě.',
          sources: [{ kind: 'slide', doc: 'P03', page: 53 }],
        },
        {
          kind: 'callout',
          type: 'poznamka',
          title: 'Relátor ≠ dokument, relátor ≠ spojovací tabulka',
          html: 'Nájemní vztah (relátor) a PDF smlouvy jsou dvě různé věci: dvě kopie PDF nejsou dva nájmy a smazání souboru nájem neukončí. A spojovací tabulka v databázi je až <em>jedna z implementací</em> relátoru. Relátor může mít hmotný odraz (oddací list), nebo být jen společenská úmluva (kamarádství, zasnoubení).',
          sources: [
            { kind: 'slide', doc: 'P03', page: 57, quote: 'rozlišujeme nájemní vztah a dokument, který ho zachycuje' },
            { kind: 'slide', doc: 'P03', page: 56, quote: 'Spojovací tabulka je až jedna z možných implementací.' },
            { kind: 'slide', doc: 'P03', page: 43, quote: 'relátorům říkáme společenská úmluva (social contract).' },
          ],
        },
        {
          kind: 'compare',
          title: 'Relátor mediující rigidní typy (anti-pattern RelRig)',
          items: [
            { label: 'Špatně', verdict: 'bad', note: 'Povinná mediace přímo na kindu: každý Man by musel být nutně (po celou existenci) ženatý.', diagram: dRelRigBad },
            { label: 'Správně', verdict: 'good', note: 'Mediace vede na anti-rigidní role Husband / Wife — ženatým se člověk stává a přestává být.', diagram: dRelRigGood },
          ],
          sources: [
            { kind: 'slide', doc: 'P05', page: 35, quote: 'Většinou značí chybějící roli, případně rolemixin.' },
            DOC_RELRIG,
          ],
        },
        { kind: 'quiz', ids: ['ch04-13', 'ch04-14'] },
      ],
    },
    // =====================================================================
    {
      id: 'sec-4-7',
      number: '4.7',
      title: '«material», «derivation» a kardinalita',
      blocks: [
        {
          kind: 'p',
          html: 'Vztah M:N „pacient je ošetřován ve zdravotnické jednotce“ je bez relátoru <strong>vágní</strong>: je to jedno ošetření ve více jednotkách? Více ošetření v jedné? Relátor tyto nejasnosti odstraní a přinutí nás říct, <em>co</em> vztah zakládá.',
          sources: [
            { kind: 'slide', doc: 'P03', page: 46, quote: 'Relátory hrají klíčovou roli ve specifikaci vztahů M:N.' },
            { kind: 'slide', doc: 'P03', page: 48, quote: 'Řešení s relátorem vylučuje nejasnosti.' },
          ],
        },
        {
          kind: 'compare',
          title: 'Pacient a zdravotnická jednotka',
          items: [
            { label: 'Bez relátoru', verdict: 'bad', note: '1..* : 1..* — ale kolik ošetření? Kdo s kým, kdy, jak dlouho?', diagram: dTreatmentBad },
            { label: 'S relátorem', verdict: 'good', note: 'Každé ošetření = jedna instance Treatment s právě 1 pacientem a 1 jednotkou. /treated in je z něj odvozený.', diagram: dTreatmentGood },
          ],
          sources: [
            { kind: 'slide', doc: 'P03', page: 47 },
            { kind: 'slide', doc: 'P03', page: 49, quote: 'Pokud chceme vyznačit a pojmenovat i samotnou materiální relaci, použijeme' },
          ],
        },
        {
          kind: 'callout',
          type: 'pravidlo',
          title: 'Vzor s relátorem',
          html: '<ol><li>Relátor spoj s účastníky přes <span class="st">«mediation»</span> (účastníci jsou typicky <span class="st">«role»</span> / <span class="st">«roleMixin»</span>).</li><li>Chceš-li vztah pojmenovat, přidej mezi účastníky odvozený <span class="st">«material»</span> <code>/název</code>.</li><li><span class="st">«derivation»</span> = <strong>čárkovaná čára</strong> z materiálního vztahu k relátoru, ze kterého je odvozen.</li><li>Multiplicity <span class="st">«material»</span> musí být konzistentní s mediacemi.</li></ol>Stejnou dvojici může spojovat víc relátorů: dvě nájemní smlouvy mezi týmž zákazníkem a dodavatelem jsou dva relátory, ale v materiálním vztahu jen jedna dvojice.',
          sources: [
            { kind: 'slide', doc: 'P03', page: 50, quote: '«derivation» váže tuto relaci k relátoru' },
            { kind: 'slide', doc: 'P03', page: 50, quote: 'dvě nájemní smlouvy mezi týmž zákazníkem a dodavatelem jsou dva relátory' },
            { kind: 'slide', doc: 'C06', page: 9, quote: '«derivation» = vztah mezi «material» a «Relator» (čárkovaná čára)' },
            { kind: 'slide', doc: 'C06', page: 9, quote: 'multiplicity pro «material» a odpovídající «mediation» musí být konzistentní' },
            DOC_DERIVATION,
          ],
        },
        {
          kind: 'diagram',
          title: 'Marriage: od naivního vztahu k relátoru',
          diagram: dMarriage,
          caption: 'Krok 1: mezi rolemi Husband a Wife je vztah married-to — ale co ho zakládá? Krok 2: truthmaker je relátor Marriage; čárkovaná čára (derivation) říká, že /married-to je z něj odvozený.',
          sources: [
            { kind: 'slide', doc: 'P03', page: 42 },
            { kind: 'slide', doc: 'P03', page: 51 },
          ],
        },
        {
          kind: 'compare',
          title: 'Kardinalita se „slévá“ přes derivation',
          items: [
            {
              label: 'Skupinové vedení',
              verdict: 'neutral',
              note: 'Jedno Assignment může spojovat víc studentů a víc vedoucích (1..* na stranách rolí).',
              diagram: assignment('1..*', '1..*'),
            },
            {
              label: 'Jedna dvojice na Assignment',
              verdict: 'neutral',
              note: 'Každé Assignment spojuje právě 1 studenta a 1 vedoucího — každá dvojice v /supervised-by odpovídá jednomu relátoru.',
              diagram: assignment('1', '1..*'),
            },
          ],
          sources: [{ kind: 'slide', doc: 'P03', page: 52 }, DOC_MATERIAL],
        },
        {
          kind: 'table',
          head: ['', 'Relátor <span class="st">«relator»</span>', 'Materiální vztah <span class="st">«material»</span>'],
          rows: [
            ['Co to je', 'třída (endurant) s vlastní identitou', 'asociace mezi účastníky'],
            ['Atributy', 'ano (datum, podmínky, doba trvání…)', 'ne'],
            ['Opakování', 'dva nájmy mezi stejnými lidmi = dva relátory', 'pořád jedna dvojice'],
            ['Vztah k druhému', '— (je to základ)', 'odvozen z relátoru (<span class="st">«derivation»</span>)'],
          ],
          sources: [
            { kind: 'slide', doc: 'P03', page: 56, quote: 'Umožní rozlišit opakované nájmy mezi stejnými účastníky a přiřadit jim vlastní podmínky či' },
            { kind: 'slide', doc: 'P03', page: 50 },
          ],
        },
        { kind: 'quiz', ids: ['ch04-15', 'ch04-16'] },
      ],
    },
    // =====================================================================
    {
      id: 'sec-4-8',
      number: '4.8',
      title: 'Přehled vztahů a typické chyby',
      blocks: [
        {
          kind: 'table',
          head: ['Stereotyp', 'Mezi čím', 'Jak poznám'],
          rows: [
            ['<span class="st">«formal»</span>', 'libovolné typy', 'spočítatelné z vlastností obou stran; <code>/název</code>'],
            ['<span class="st">«material»</span>', 'účastníci relátoru (role, roleMixin…)', 'existuje díky relátoru; odvozený'],
            ['<span class="st">«mediation»</span>', 'relátor → účastník', 'existenční závislost relátoru, povinná pro roli'],
            ['<span class="st">«derivation»</span>', '«material» ↔ «relator»', 'čárkovaná čára'],
            ['<span class="st">«characterization»</span>', 'aspekt (quality / mode) → nositel', 'na straně nositele vždy 1 (kapitola o aspektech)'],
            ['<em>celek–část</em>: componentOf, memberOf, subCollectionOf, subQuantityOf', 'část → celek', 'diamant u celku (další kapitola)'],
          ],
          caption: 'Vztahy, které nejsou celek–část: formal, material, mediation, characterization (+ pomocná derivation).',
          sources: [
            { kind: 'slide', doc: 'C06', page: 9, quote: '«formal» = vztah odvozený přímo z vlastností entit ve vztahu' },
            { kind: 'slide', doc: 'C06', page: 9, quote: '«characterization» = vztah mezi aspektem a nositelem, vždy 1 na straně nositele' },
            { kind: 'slide', doc: 'C06', page: 10 },
          ],
        },
        {
          kind: 'callout',
          type: 'past',
          title: 'Typické chyby',
          html: '<ul><li><strong>Holá M:N asociace</strong> mezi rolemi bez relátoru → chybí truthmaker, vágní kardinalita.</li><li><strong>«formal» u vztahu, který vznikl událostí</strong> (works-for, married-to) → má být «material» + relátor.</li><li><strong>Relátor mediuje kindy</strong> (RelRig) → chybí role.</li><li><strong>Relátor s jedinou mediací</strong> → relátor závisí na alespoň dvou různých jedincích.</li><li><strong>«role» nad kindy</strong> → «roleMixin» + role pod každým kindem.</li><li><strong>«mixin» jen s rigidními podtypy</strong> → «category» (MixRig).</li><li><strong>Ne-sortál pod sortálem</strong> → nikdy.</li></ul>',
          sources: [
            { kind: 'slide', doc: 'P03', page: 46 },
            { kind: 'slide', doc: 'P03', page: 50, quote: 'Každý relátor závisí na alespoň dvou různých jedincích' },
            { kind: 'slide', doc: 'P05', page: 23 },
          ],
        },
        {
          kind: 'callout',
          type: 'shrnuti',
          title: 'Shrnutí kapitoly',
          html: 'Ne-sortál nemá identitu, sdružuje různé druhy, je abstraktní a nikdy neleží pod sortálem. Rigidita určí stereotyp: rigidní <span class="st">«category»</span>, semi-rigidní <span class="st">«mixin»</span>, anti-rigidní <span class="st">«roleMixin»</span> (relačně závislý) / <span class="st">«phaseMixin»</span>. U vztahů rozhoduje, zda je mezi entitami „něco třetího“: ne → <span class="st">«formal»</span>; ano → <span class="st">«relator»</span> + <span class="st">«mediation»</span> + odvozený <span class="st">«material»</span> přes <span class="st">«derivation»</span>.',
        },
        { kind: 'quiz', ids: ['ch04-18'] },
      ],
    },
  ],
}
