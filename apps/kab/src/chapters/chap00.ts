import type { Chapter } from '../types'

export const chap00: Chapter = {
  id: 'chap-glossary',
  number: '13',
  title: 'Přehled pojmů',
  intro: [
    {
      kind: 'p',
      html: 'Slovník všech pojmů, které se ve skriptech používají. Kdekoliv v textu naleznete podtržené slovo — najetím myši (nebo dotykem / klávesou <strong>Tab</strong>) se zobrazí jeho stručné vysvětlení. Tato kapitola obsahuje úplný seznam pro orientaci.',
    },
    { kind: 'glossary' },
  ],
  sections: [],
}
