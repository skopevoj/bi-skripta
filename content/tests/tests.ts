import type { MockTest } from '../types'

// Cvičné testy: kombinace reálných otázek z FIT Wiki (bank/wiki.ts) a vlastních otázek (bank/mocks.ts).
// Úlohy o DEMO (starší verze předmětu) záměrně nejsou zařazené.
export const tests: MockTest[] = [
  {
    id: 'midterm-1',
    title: 'Cvičný midterm 1',
    description: 'OntoUML: sortály, non-sortály, aspekty, celek–část a anti-patterny. 10 otázek jako v Moodle (cvičení 8).',
    minutes: 20,
    questionIds: ['mid22-01', 'mid22-03', 'ex-02', 'ex-19', 'wq-03', 'ex-64', 'ex-03', 'mock-01', 'mock-07', 'mock-15'],
  },
  {
    id: 'midterm-2',
    title: 'Cvičný midterm 2',
    description: 'OntoUML: povolené generalizace, kvantity a kolektivy, vztahy a aspekty. 10 otázek jako v Moodle (cvičení 8).',
    minutes: 20,
    questionIds: ['mid22-04', 'mid22-10', 'ex-60', 'ex-67', 'ex-85', 'ex-46', 'ex-113', 'mock-05', 'mock-08', 'mock-12'],
  },
  {
    id: 'midterm-3',
    title: 'Cvičný midterm 3',
    description: 'OntoUML: identita, modularizace, relátory, vlastnosti relací celek–část a anti-patterny. 10 otázek jako v Moodle (cvičení 8).',
    minutes: 20,
    questionIds: ['mid22-05', 'mid22-08', 'ex-118', 'ex-50', 'ex-89', 'ex-116', 'ex-34', 'mock-02', 'mock-06', 'mock-17'],
  },
  {
    id: 'zkouska-1',
    title: 'Cvičná zkouška 1',
    description: 'Celý předmět: OntoUML, transformace do OO, OCL, RDF/OWL/SPARQL a BPMN. 25 otázek.',
    minutes: 45,
    questionIds: [
      // OntoUML a úvod
      'mid22-02', 'ex-07', 'wq-02', 'ex-29', 'ex-37', 'ex-41', 'ex-95', 'ex-120', 'mock-04', 'mock-10', 'ex-31',
      // transformace
      'ex-17', 'ex-59', 'mock-19',
      // OCL
      'ex-47', 'ex-79', 'ex-122', 'mock-23',
      // RDF / OWL
      'ex-04', 'ex-40', 'ex-52', 'mock-26',
      // BPMN
      'ex-08', 'ex-102', 'mock-29',
    ],
  },
  {
    id: 'zkouska-2',
    title: 'Cvičná zkouška 2',
    description: 'Celý předmět: OntoUML, transformace do OO, OCL, RDF/OWL/SPARQL, BPMN a AI v KM. 25 otázek.',
    minutes: 45,
    questionIds: [
      // OntoUML a úvod
      'mid22-07', 'ex-21', 'ex-49', 'ex-58', 'ex-33', 'ex-75', 'ex-109', 'ex-45', 'wq-01', 'mock-13', 'mock-14', 'mock-33',
      // transformace
      'ex-14', 'ex-65', 'mock-20',
      // OCL
      'ex-69', 'ex-86', 'ex-121', 'mock-24',
      // RDF / OWL
      'ex-10', 'ex-81', 'mock-27',
      // BPMN
      'ex-76', 'ex-111', 'mock-30',
    ],
  },
]
