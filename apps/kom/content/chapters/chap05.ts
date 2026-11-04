import type { Chapter } from '../types'

export const chap05: Chapter = {
  id: 'chap-5',
  number: '5',
  title: 'Celek–část a aspekty',
  docs: ['P04', 'C05'],
  exam: ['midterm', 'zkouska'],
  summary:
    'Umět rozlišit funkční celek, «collective» a «quantity», vybrat správnou relaci celek–část (componentOf, memberOf, subCollectionOf, subQuantityOf), určit sdílitelnost a povinnosti v obou směrech (essential, inseparable, immutablePart, immutableWhole) a poznat aspekty «quality» a «mode» připojené přes «characterization».',
  sections: [
    // -----------------------------------------------------------------------
    {
      id: 'sec-5-1',
      number: '5.1',
      title: 'Vztah celek–část a sdílitelnost',
      blocks: [
        {
          kind: 'p',
          html:
            'UML zná jen dvě „síly vazby“: <strong>kompozici</strong> (plný diamant, „motor je nedílnou součástí auta“) a <strong>agregaci</strong> (prázdný diamant, „pasažéři existují i bez auta“). Pro ontologické modelování je to málo a nejednoznačné. OntoUML vztahy celek–část chápe jako <strong>zpřesnění asociace „má část“ (has)</strong> a vždy zkoumá <strong>oba směry</strong>: co celek vyžaduje od části a co část vyžaduje od celku.',
          sources: [
            { kind: 'slide', doc: 'P04', page: 4, quote: 'Je třeba se zabývat zejména oběma směry' },
            { kind: 'slide', doc: 'P04', page: 31, quote: 'Vztahy Celek-Část jsou zpřesněním asociace obsahuje (has).' },
          ],
        },
        {
          kind: 'compare',
          title: 'UML: jen „silnější“ a „slabší“ vazba',
          items: [
            {
              label: 'UML kompozice',
              verdict: 'neutral',
              note: 'Motor je nedílnou součástí auta. Ale jak nedílnou? Nějaký motor, nebo právě tento?',
              diagram: {
                classes: [
                  { id: 'car', name: 'Car', st: 'none', x: 0, y: 0 },
                  { id: 'eng', name: 'Engine', st: 'none', x: 2, y: 0 },
                ],
                assocs: [{ from: 'eng', to: 'car', st: 'none', whole: 'to', shareable: false }],
              },
            },
            {
              label: 'UML agregace',
              verdict: 'neutral',
              note: 'Pasažéři existují i bez auta. Jenže je pasažér opravdu „částí“ auta?',
              diagram: {
                classes: [
                  { id: 'car', name: 'Car', st: 'none', x: 0, y: 0 },
                  { id: 'pas', name: 'Passenger', st: 'none', x: 2, y: 0 },
                ],
                assocs: [{ from: 'pas', to: 'car', st: 'none', whole: 'to', shareable: true }],
              },
            },
          ],
          sources: [
            { kind: 'slide', doc: 'P04', page: 4 },
            { kind: 'slide', doc: 'P04', page: 30, quote: 'Vágní pojmy kompozice a agregace z UML jsou v OntoUML nahrazeny přesnějšími.' },
          ],
        },
        {
          kind: 'callout',
          type: 'definice',
          title: 'Plný vs. prázdný diamant = sdílitelnost',
          html:
            'OntoUML musí zůstat syntakticky kompatibilní s UML, takže diamant má i zde význam, ale <strong>jiný</strong>: ukazuje <strong>sdílitelnost části</strong>, a ta se dá <strong>odvodit z multiplicity na straně celku</strong>.<ul><li><strong>plný diamant</strong> = <code>{isShareable = false}</code>: část patří nejvýše jednomu celku (max. multiplicita na straně celku = 1)</li><li><strong>prázdný diamant</strong> = <code>{isShareable = true}</code>: část může patřit více celkům (max. multiplicita na straně celku &gt; 1)</li></ul>',
          sources: [
            { kind: 'slide', doc: 'P04', page: 30, quote: 'nesdílitelná část, multiplicita max. 1' },
            { kind: 'slide', doc: 'P04', page: 30, quote: 'sdílitelná část, multiplicita max. > 1' },
            { kind: 'slide', doc: 'C05', page: 4, quote: 'plný diamant = část není sdílitelná více celky' },
          ],
        },
        {
          kind: 'diagram',
          title: 'Jedna rodina, ale více výzkumných skupin',
          caption:
            'Člen rodiny patří právě jedné rodině (na straně celku 1 → plný diamant). Výzkumník může být ve více skupinách (1..* → prázdný diamant). Podle slajdu, jen s «collective» a minimem 2 členů.',
          diagram: {
            classes: [
              { id: 'fam', name: 'Family', st: 'collective', x: 0, y: 2.9, note: 'Kolektiv: všichni členové mají vůči rodině stejnou roli.' },
              { id: 'fm', name: 'FamilyMember', st: 'role', x: 0, y: 1.25 },
              { id: 'p', name: 'Person', st: 'kind', x: 1, y: 0 },
              { id: 'res', name: 'Researcher', st: 'role', x: 2, y: 1.25 },
              { id: 'rg', name: 'ResearchGroup', st: 'collective', x: 2, y: 2.9 },
            ],
            gens: [{ general: 'p', specifics: ['fm', 'res'] }],
            assocs: [
              { from: 'fm', to: 'fam', st: 'memberOf', whole: 'to', shareable: false, fromMult: '2..*', toMult: '1', mark: 'focus' },
              { from: 'res', to: 'rg', st: 'memberOf', whole: 'to', shareable: true, fromMult: '2..*', toMult: '1..*', mark: 'focus' },
            ],
          },
          sources: [
            { kind: 'slide', doc: 'P04', page: 30 },
            { kind: 'slide', doc: 'C05', page: 4 },
          ],
        },
        {
          kind: 'callout',
          type: 'past',
          title: 'Plný diamant neznamená „část nemůže existovat bez celku“',
          html:
            'To je význam UML kompozice. V OntoUML říká plný diamant jen to, že část nesdílí více celků. Jestli část bez celku existovat může, poznáš z <strong>dolní meze multiplicity na straně celku</strong> (povinný celek) a z meta-atributu <code>{inseparable}</code>.',
          sources: [
            { kind: 'slide', doc: 'P04', page: 31, quote: 'Multiplicita 1..* implikuje možnost sdílet část vícero celky (shareability).' },
          ],
        },
        { kind: 'quiz', ids: ['ch05-01', 'ch05-02'] },
      ],
    },
    // -----------------------------------------------------------------------
    {
      id: 'sec-5-2',
      number: '5.2',
      title: 'Povinnosti z pohledu celku i části',
      blocks: [
        {
          kind: 'p',
          html:
            'U každého vztahu celek–část si polož <strong>dvě otázky</strong>:<br><strong>Celek → Část:</strong> musí mít celek tuto část? Stačí <em>nějaká</em>, nebo musí být <em>určitá</em>?<br><strong>Část → Celek:</strong> musí být část v nějakém celku? Stačí <em>nějaký</em>, nebo musí být <em>určitý</em>?',
          sources: [
            { kind: 'slide', doc: 'P04', page: 31, quote: 'Směrem od Celku k Částem (optional, mandatory, essential).' },
            { kind: 'slide', doc: 'P04', page: 31, quote: 'Směrem od Části k Celku (optional, mandatory, inseparable part)' },
          ],
        },
        {
          kind: 'callout',
          type: 'definice',
          title: 'Generická vs. existenční závislost',
          html:
            '<strong>Generická závislost</strong> = k existenci potřebuji <em>nějakou</em> instanci typu T („člověk musí mít <strong>nějaké</strong> srdce“, srdce lze transplantovat).<br><strong>Existenční závislost</strong> = k existenci potřebuji <em>určitou konkrétní</em> instanci („člověk musí mít <strong>určitý</strong> mozek“, výměna mozku = jiný člověk).<br>Generická závislost dává <strong>povinnost</strong> (stačí multiplicita), existenční dává <strong>essential / inseparable</strong> (meta-atribut).',
          sources: [
            { kind: 'slide', doc: 'P04', page: 10, quote: 'Rozdíl spočívá v závislosti na typu vs závislosti na konkrétní instanci.' },
            { kind: 'slide', doc: 'P04', page: 11 },
            { kind: 'slide', doc: 'P04', page: 14 },
          ],
        },
        {
          kind: 'table',
          caption: 'Tři stupně povinnosti v každém směru',
          head: ['Směr', 'slabé', 'střední', 'nejsilnější'],
          rows: [
            [
              '<strong>Celek → Část</strong><br>(dívám se na celek)',
              '<strong>volitelná část</strong><br>min. 0 na straně části<br><em>Car – Spare Tyre 0..1</em>',
              '<strong>povinná část</strong><br>min. ≥ 1 na straně části, „nějaká“<br><em>Person – Heart 1</em>',
              '<strong>esenciální část</strong> <code>{essential}</code><br>celek bez <em>této</em> části zaniká<br><em>Person – Brain</em>',
            ],
            [
              '<strong>Část → Celek</strong><br>(dívám se na část)',
              '<strong>nepovinný celek</strong><br>min. 0 na straně celku<br><em>Chassis – Car 0..1</em>',
              '<strong>povinný celek</strong><br>min. ≥ 1 na straně celku, „nějaký“<br><em>Heart – Person 1</em>',
              '<strong>neoddělitelná část</strong> <code>{inseparable}</code><br>část bez <em>tohoto</em> celku zaniká<br><em>Brain – Person</em>',
            ],
          ],
          sources: [
            { kind: 'slide', doc: 'P04', page: 6, quote: 'Části, které Celek může postrádat bez vlivu na jeho klasifikaci' },
            { kind: 'slide', doc: 'P04', page: 7, quote: 'Povinné Části jsou Části, které Celek naopak nemůže postrádat.' },
            { kind: 'slide', doc: 'P04', page: 20, quote: 'Část může existovat bez Celku.' },
            { kind: 'slide', doc: 'P04', page: 21 },
            { kind: 'slide', doc: 'P04', page: 22 },
          ],
        },
        {
          kind: 'diagram',
          title: 'Auto: volitelná, povinná a esenciální část',
          caption:
            'Rezerva je volitelná (0..1). Motor je povinný (1), ale lze ho vyměnit. Podvozek je {essential}: auto bez <em>tohoto</em> podvozku už není totéž auto. Na straně celku je všude 0..1: díl může ležet ve skladu bez auta.',
          diagram: {
            classes: [
              { id: 'car', name: 'Car', st: 'kind', x: 0, y: 1 },
              { id: 'spare', name: 'Spare Tyre', st: 'kind', x: 2, y: 0, note: 'Volitelná část: auto bez rezervy je pořád auto.' },
              { id: 'eng', name: 'Engine', st: 'kind', x: 2, y: 1, note: 'Povinná část: auto musí mít nějaký motor (generická závislost).' },
              { id: 'ch', name: 'Chassis', st: 'kind', x: 2, y: 2, note: 'Esenciální část: auto je existenčně závislé na tomto konkrétním podvozku.' },
            ],
            assocs: [
              { from: 'spare', to: 'car', st: 'componentOf', whole: 'to', fromMult: '0..1', toMult: '0..1', route: 'hv' },
              { from: 'eng', to: 'car', st: 'componentOf', whole: 'to', fromMult: '1', toMult: '0..1' },
              { from: 'ch', to: 'car', st: 'componentOf', whole: 'to', fromMult: '1', toMult: '0..1', meta: ['essential'], route: 'hv', mark: 'focus' },
            ],
            steps: [
              { label: 'Volitelná část (0..1)', add: ['car', 'spare'] },
              { label: 'Povinná část (1), vyměnitelná', add: ['eng'] },
              { label: 'Esenciální část {essential}', add: ['ch'] },
            ],
          },
          sources: [
            { kind: 'slide', doc: 'P04', page: 6 },
            { kind: 'slide', doc: 'P04', page: 19 },
            { kind: 'slide', doc: 'P04', page: 20 },
          ],
        },
        {
          kind: 'diagram',
          title: 'Srdce vs. mozek',
          caption:
            'Obě části jsou povinné (1 : 1). Srdce lze transplantovat, takže stačí multiplicita. Mozek je {essential} (osoba nemůže existovat bez tohoto mozku) i {inseparable} (mozek nemůže existovat mimo tuto osobu).',
          diagram: {
            classes: [
              { id: 'p', name: 'Person', st: 'kind', x: 1.9, y: 0 },
              { id: 'h', name: 'Heart', st: 'kind', x: 0, y: 0, note: 'Povinná část + povinný celek, ale ne esenciální: srdce lze vyměnit.' },
              { id: 'b', name: 'Brain', st: 'kind', x: 4, y: 0, note: 'Esenciální i neoddělitelná část.' },
            ],
            assocs: [
              { from: 'h', to: 'p', st: 'componentOf', whole: 'to', fromMult: '1', toMult: '1' },
              { from: 'b', to: 'p', st: 'componentOf', whole: 'to', fromMult: '1', toMult: '1', meta: ['essential', 'inseparable'], mark: 'focus' },
            ],
          },
          sources: [
            { kind: 'slide', doc: 'P04', page: 24 },
            { kind: 'slide', doc: 'C05', page: 5, quote: 'Osoba John nemůže existovat bez instance Johnův mozek jako jeho části.' },
            { kind: 'slide', doc: 'C05', page: 5, quote: 'Johnův mozek nemůže existovat bez toho aniž by byl částí osoby John.' },
          ],
        },
        {
          kind: 'callout',
          type: 'pravidlo',
          title: 'Co z čeho plyne',
          html:
            '<ul><li><code>{essential}</code> ⇒ <strong>povinná část</strong> (esencialita je silnější než povinnost)</li><li><code>{inseparable}</code> ⇒ <strong>povinný celek</strong></li><li><code>{essential}</code> a <code>{inseparable}</code> jsou na sobě <strong>nezávislé</strong>: jedno neplyne z druhého</li></ul>',
          sources: [
            { kind: 'slide', doc: 'P04', page: 18, quote: 'a tudíž esencialita implikuje povinnost' },
            { kind: 'slide', doc: 'P04', page: 22, quote: 'Neoddělitelnost implikuje povinnost Celku.' },
            { kind: 'slide', doc: 'P04', page: 25, quote: 'Jedná se o zcela nezávislé pojmy:' },
          ],
        },
        {
          kind: 'compare',
          title: 'Esencialita a neoddělitelnost jsou nezávislé',
          items: [
            {
              label: 'essential, ale ne inseparable',
              verdict: 'neutral',
              note: '„Sebrané dílo“ je určeno svými díly (essential), ale každé dílo existovalo už předtím a může vyjít i jinde.',
              diagram: {
                classes: [
                  { id: 'cw', name: 'Collected Works', st: 'kind', x: 0, y: 0 },
                  { id: 'w', name: 'Work', st: 'kind', x: 2.2, y: 0 },
                ],
                assocs: [{ from: 'w', to: 'cw', st: 'componentOf', whole: 'to', shareable: true, fromMult: '2..*', toMult: '0..*', meta: ['essential'] }],
              },
            },
            {
              label: 'inseparable, ale ne essential',
              verdict: 'neutral',
              note: 'Díra ve zdi bez této zdi neexistuje (inseparable), ale zeď bez díry klidně existuje.',
              diagram: {
                classes: [
                  { id: 'wall', name: 'Wall', st: 'kind', x: 0, y: 0 },
                  { id: 'hole', name: 'Hole', st: 'kind', x: 2.2, y: 0 },
                ],
                assocs: [{ from: 'hole', to: 'wall', st: 'componentOf', whole: 'to', fromMult: '0..*', toMult: '1', meta: ['inseparable'] }],
              },
            },
          ],
          sources: [
            { kind: 'slide', doc: 'P04', page: 25, quote: 'Díra ve zdi je její neoddělitelná Část, ale nikoliv esenciální.' },
          ],
        },
        {
          kind: 'callout',
          type: 'past',
          title: '„Auto má povinně motor, takže ho nesmím vyměnit?“',
          html:
            'Ne. <strong>Povinná</strong> část = požadavek na <em>nějaký</em> motor (výměna je v pořádku). Teprve <code>{essential}</code> váže existenci auta na <em>konkrétní</em> motor. A ověř doménu: pokud může být auto v opravně dočasně bez motoru, je i obyčejná povinnost (1) příliš silná.',
          sources: [
            { kind: 'slide', doc: 'P04', page: 67, quote: 'Povinná část znamená požadavek na nějaký motor; esenciální část váže existenci celku na' },
          ],
        },
        { kind: 'quiz', ids: ['ch05-03'], title: 'Otázka z midtermu 2022' },
        { kind: 'quiz', ids: ['ch05-04', 'ch05-05'] },
      ],
    },
    // -----------------------------------------------------------------------
    {
      id: 'sec-5-3',
      number: '5.3',
      title: 'Neměnitelná část a neměnitelný celek',
      blocks: [
        {
          kind: 'p',
          html:
            '<code>{essential}</code> a <code>{inseparable}</code> mluví o <em>všech</em> světech, kde instance existuje, a proto dávají smysl jen u <strong>rigidních</strong> typů. Co když je celek nebo část <span class="st">«role»</span> či <span class="st">«phase»</span>? Pak použijeme slabší, „podmíněnou“ verzi: platí jen <strong>po dobu, kdy je instance v dané roli/fázi</strong>.',
          sources: [
            { kind: 'slide', doc: 'P04', page: 17, quote: 'Pouze rigidní typy mohou být použity jako esenciální části.' },
            { kind: 'slide', doc: 'P04', page: 26, quote: 'ta ho musí doprovázet ve všech světech, kde existuje' },
            { kind: 'slide', doc: 'C05', page: 6, quote: 'Obdobné ale pro non-rigidní typy' },
          ],
        },
        {
          kind: 'table',
          caption: 'Čtyři meta-atributy na jednom místě',
          head: ['Meta-atribut', 'Směr', 'Kdy', 'Příklad'],
          rows: [
            ['<code>{essential}</code>', 'Celek → Část', 'celek je <strong>rigidní</strong>', 'Person má vždy tento Brain'],
            ['<code>{immutablePart}</code>', 'Celek → Část', 'celek je <strong>anti-rigidní</strong> (role, phase)', 'dokud je John <em>LivingPerson</em>, má tento mozek'],
            ['<code>{inseparable}</code>', 'Část → Celek', 'část je <strong>rigidní</strong>', 'Brain je vždy částí této Person'],
            ['<code>{immutableWhole}</code>', 'Část → Celek', 'část je <strong>anti-rigidní</strong> (role, phase)', 'dokud je mozek <em>FunctioningBrain</em>, je částí Johna'],
          ],
          sources: [
            { kind: 'slide', doc: 'C05', page: 6, quote: '{immutablePart} pokud je celek' },
            { kind: 'slide', doc: 'P04', page: 28, quote: 'Směrem od Části k Celku u Non-Rigid typů' },
          ],
        },
        {
          kind: 'diagram',
          title: 'immutablePart: boxer a jeho ruce',
          caption:
            'Boxer je «role», takže {essential} použít nejde. {immutablePart}: po celou dobu, co je někdo boxerem, má tytéž ruce.',
          diagram: {
            classes: [
              { id: 'p', name: 'Person', st: 'kind', x: 0, y: 0 },
              { id: 'box', name: 'Boxer', st: 'role', x: 0, y: 1.25, note: 'Anti-rigidní celek: místo {essential} použijeme {immutablePart}.' },
              { id: 'hand', name: 'Hand', st: 'kind', x: 1.9, y: 1.25 },
            ],
            gens: [{ general: 'p', specifics: ['box'] }],
            assocs: [
              { from: 'hand', to: 'box', st: 'componentOf', whole: 'to', fromMult: '1..2', toMult: '1', meta: ['immutablePart'], mark: 'focus' },
            ],
          },
          sources: [{ kind: 'slide', doc: 'P04', page: 27 }],
        },
        {
          kind: 'diagram',
          title: 'Obě strany anti-rigidní: immutablePart i immutableWhole',
          caption:
            'Celek LivingPerson je «phase» → {immutablePart}. Část FunctioningBrain je «phase» → {immutableWhole}. Na slajdu 28 je varianta s celkem «kind» Person: tam je správně {essential, immutableWhole}.',
          diagram: {
            classes: [
              { id: 'brain', name: 'Brain', st: 'kind', x: 0.7, y: 0 },
              { id: 'nfb', name: 'NonFunctioningBrain', st: 'phase', x: 0, y: 1.25 },
              { id: 'fb', name: 'FunctioningBrain', st: 'phase', x: 1.4, y: 1.25, note: 'Vždy když je Johnův mozek funkční, je částí osoby John.' },
              { id: 'lp', name: 'LivingPerson', st: 'phase', x: 3.4, y: 1.25, note: 'Vždy když je John žijící, je Johnův mozek jeho částí.' },
              { id: 'dp', name: 'DeceasedPerson', st: 'phase', x: 4.6, y: 1.25 },
              { id: 'person', name: 'Person', st: 'kind', x: 4, y: 0 },
            ],
            gens: [
              { general: 'brain', specifics: ['nfb', 'fb'], set: { disjoint: true, complete: true } },
              { general: 'person', specifics: ['lp', 'dp'], set: { disjoint: true, complete: true } },
            ],
            assocs: [
              { from: 'fb', to: 'lp', st: 'componentOf', whole: 'to', fromMult: '1', toMult: '1', meta: ['immutablePart', 'immutableWhole'], mark: 'focus' },
            ],
          },
          sources: [
            { kind: 'slide', doc: 'P04', page: 29, quote: 'Opět se jedná o nezávislé pojmy.' },
            { kind: 'slide', doc: 'C05', page: 6, quote: 'Vždy když je osoba John žijící (fáze), pak je Johnův mozek jeho částí.' },
            { kind: 'slide', doc: 'C05', page: 6, quote: 'Vždy když je Johnův mozek funkční, pak je částí osoby John.' },
          ],
        },
        {
          kind: 'callout',
          type: 'pravidlo',
          title: 'Jak vybrat meta-atribut',
          html:
            '<ol><li>Je vztah „určitá instance“, nebo stačí „nějaká“? Pokud stačí nějaká, žádný meta-atribut nedávej, stačí multiplicita.</li><li>Směr <strong>Celek → Část</strong>: rigidní celek → <code>{essential}</code>, anti-rigidní celek → <code>{immutablePart}</code>.</li><li>Směr <strong>Část → Celek</strong>: rigidní část → <code>{inseparable}</code>, anti-rigidní část → <code>{immutableWhole}</code>.</li><li>Obě dvojice jsou nezávislé, klidně platí obě najednou.</li></ol>',
          sources: [
            { kind: 'slide', doc: 'P04', page: 31 },
            { kind: 'slide', doc: 'C05', page: 6 },
          ],
        },
        { kind: 'quiz', ids: ['ch05-06'] },
      ],
    },
    // -----------------------------------------------------------------------
    {
      id: 'sec-5-4',
      number: '5.4',
      title: 'Tři druhy celků; funkční celek a componentOf',
      blocks: [
        {
          kind: 'p',
          html:
            'Zatím byl celkem vždy <span class="st">«kind»</span>. Kognitivní věda a lingvistika ale ukazují, že vnímáme <strong>tři různé druhy celků</strong>, a každý má vlastní relace celek–část.',
          sources: [{ kind: 'slide', doc: 'P04', page: 33 }],
        },
        {
          kind: 'table',
          caption: 'Funkční celek, kolektiv, kvantita',
          head: ['Druh celku', 'Stereotyp', 'Části', 'Čím je celek vymezen', 'Relace', 'Příklady'],
          rows: [
            [
              '<strong>Funkční celek</strong> (functional complex)',
              '<span class="st">«kind»</span> (+ podtypy)',
              'mají <strong>různé funkce</strong>',
              'strukturou a funkcí',
              'componentOf',
              'motor–auto, srdce–oběhový systém, ředitel–firma',
            ],
            [
              '<strong>Kolektiv</strong>',
              '<span class="st">«collective»</span>',
              'všechny hrají <strong>stejnou roli</strong>; nejsou téhož typu jako celek (strom není les)',
              '<strong>sjednocující relací</strong>, ≥ 2 členové',
              'memberOf, subCollectionOf',
              'strom–les, student–paralelka, pták–hejno',
            ],
            [
              '<strong>Kvantita</strong>',
              '<span class="st">«quantity»</span>',
              'jsou <strong>téhož typu</strong> jako celek (část vína je víno)',
              '<strong>topologicky</strong>: maximální spojitý objekt',
              'subQuantityOf, containment',
              'alkohol–víno, písek–malta, víno–láhev (containment)',
            ],
          ],
          sources: [
            { kind: 'slide', doc: 'P04', page: 33, quote: 'memberOf : strom-les, student-paralelka, pták-hejno' },
            { kind: 'slide', doc: 'P04', page: 35, quote: 'Kvantita je typ celku, pro který je charakteristické' },
            { kind: 'slide', doc: 'P04', page: 38, quote: 'Všechny Prvky hrají v kolektivu stejnou roli' },
            { kind: 'slide', doc: 'P04', page: 51, quote: 'Funkční celek se skládá z částí, které mají různé úlohy/funkce' },
          ],
        },
        {
          kind: 'diagram',
          title: 'Kdo poskytuje identitu (ultimate sortals)',
          caption:
            '«quantity» a «collective» jsou rigidní sortály poskytující identitu, stejně jako «kind» a «relator». Platí pro ně tedy stejná pravidla jako pro kind.',
          diagram: {
            classes: [
              { id: 'us', name: 'UltimateSortal', st: 'none', x: 1.5, y: 0, abstract: true, note: 'Rigidní sortál, který poskytuje identitu.' },
              { id: 'k', name: 'Kind', st: 'none', x: 0, y: 1.25, note: 'Person, Organisation' },
              { id: 'r', name: 'Relator', st: 'none', x: 1, y: 1.25, note: 'Marriage, Contract' },
              { id: 'q', name: 'Quantity', st: 'none', x: 2, y: 1.25, note: 'Wine, Clay' },
              { id: 'c', name: 'Collective', st: 'none', x: 3, y: 1.25, note: 'Club, Forest' },
            ],
            gens: [{ general: 'us', specifics: ['k', 'r', 'q', 'c'], set: { disjoint: true, complete: true } }],
          },
          sources: [
            { kind: 'slide', doc: 'P04', page: 34 },
            { kind: 'slide', doc: 'P04', page: 53, quote: 'Quantity a Collective jsou stejně jako Kind a Relator rigidní sortály poskytující' },
          ],
        },
        {
          kind: 'callout',
          type: 'pravidlo',
          title: '«collective» a «quantity» se chovají jako «kind»',
          html:
            'Poskytují identitu a jsou rigidní. Proto:<ul><li><strong>nadtyp</strong> může být jen <span class="st">«category»</span> nebo <span class="st">«mixin»</span> (ne kind, jiná kvantita, kolektiv…)</li><li><strong>podtypy</strong> mohou být <span class="st">«subkind»</span>, <span class="st">«role»</span>, <span class="st">«phase»</span></li></ul>',
          sources: [
            { kind: 'web', label: 'OntoUML docs: Quantity', url: 'https://ontouml.readthedocs.io/en/latest/classes/sortals/quantity/index.html' },
            { kind: 'web', label: 'OntoUML docs: Collective', url: 'https://ontouml.readthedocs.io/en/latest/classes/sortals/collective/index.html' },
          ],
        },
        {
          kind: 'diagram',
          title: 'Funkční celek: auto a jeho komponenty',
          caption:
            'Každá část má v autě jinou funkci, proto jde o «componentOf». Kolo je na straně celku 0..1: auto má 4 kola, kolo nejvýše jedno auto (plný diamant).',
          diagram: {
            classes: [
              { id: 'car', name: 'Car', st: 'kind', x: 1.4, y: 0 },
              { id: 'eng', name: 'Engine', st: 'kind', x: 0, y: 1.8 },
              { id: 'wh', name: 'Wheel', st: 'kind', x: 1.4, y: 1.8 },
              { id: 'ch', name: 'Chassis', st: 'kind', x: 2.8, y: 1.8 },
            ],
            assocs: [
              { from: 'eng', to: 'car', st: 'componentOf', whole: 'to', fromMult: '1', toMult: '0..1' },
              { from: 'wh', to: 'car', st: 'componentOf', whole: 'to', fromMult: '4', toMult: '0..1' },
              { from: 'ch', to: 'car', st: 'componentOf', whole: 'to', fromMult: '1', toMult: '0..1', meta: ['essential'] },
            ],
          },
          sources: [
            { kind: 'slide', doc: 'P04', page: 33 },
            { kind: 'slide', doc: 'C05', page: 10, quote: 'každá část může mít v celku jinou funkci (různé typy částí)' },
          ],
        },
        {
          kind: 'callout',
          type: 'definice',
          title: '«componentOf»',
          html:
            'Váže části k <strong>funkčnímu celku</strong>. Na obou koncích jsou funkční celky (kind a jeho podtypy). Je <strong>irreflexivní</strong> a <strong>anti-symetrická</strong> (to platí pro všechny relace celek–část), ale <strong>obecně není tranzitivní</strong>: někdy ano, jindy ne. Funkční celek může mít volitelné, povinné i esenciální části.',
          sources: [
            { kind: 'slide', doc: 'P04', page: 51, quote: 'Není obecně tranzitivní (v některých případech je, v jiných není).' },
            { kind: 'web', label: 'OntoUML docs: ComponentOf', url: 'https://ontouml.readthedocs.io/en/latest/relationships/aggregations/componentOf/index.html' },
          ],
        },
        {
          kind: 'callout',
          type: 'past',
          title: 'Rodina: kolektiv, nebo funkční celek?',
          html:
            'Záleží na doméně. Mají-li všichni členové vůči celku stejnou roli, je to <span class="st">«collective»</span> (memberOf). Rozlišujeme-li „hlavu rodiny“, „živitele“… (různé funkce), je to funkční celek (componentOf). Podobně vozový park, tým, orchestr.',
          sources: [
            { kind: 'web', label: 'OntoUML docs: Collective', url: 'https://ontouml.readthedocs.io/en/latest/classes/sortals/collective/index.html' },
          ],
        },
        { kind: 'quiz', ids: ['ch05-07', 'ch05-08'] },
      ],
    },
    // -----------------------------------------------------------------------
    {
      id: 'sec-5-5',
      number: '5.5',
      title: 'Kolektiv: memberOf a subCollectionOf',
      blocks: [
        {
          kind: 'p',
          html:
            '<strong>Identita kolektivu:</strong> kolektiv není matematická množina, ale „kognitivní množina“ (<em>integrální celek</em>). Drží ho pohromadě <strong>sjednocující relace</strong> (třída studentů: „společně studují ve třídě X“). Členové mohou být kdekoliv na světě (kamarádi), kolektiv je <strong>maximální</strong> vůči své sjednocující relaci a musí mít <strong>alespoň 2 členy</strong>. Sjednocující relace se v OntoUML modelu explicitně nekreslí.',
          sources: [
            { kind: 'slide', doc: 'P04', page: 40 },
            { kind: 'slide', doc: 'P04', page: 41, quote: 'Sjednocující relace není v OntoUML modelu však explicitně vyjádřena.' },
            { kind: 'slide', doc: 'P04', page: 42, quote: 'Kolektiv musí mít alespoň 2 členy' },
          ],
        },
        {
          kind: 'diagram',
          title: 'memberOf: strom v lese',
          caption:
            'Les má alespoň 2 stromy. Strom je nejvýše v jednom lese (plný diamant). Strom sám «collective» není: strom není les.',
          diagram: {
            classes: [
              { id: 'forest', name: 'Forest', st: 'collective', x: 0, y: 0, note: 'Kolektiv: všechny stromy hrají v lese stejnou roli.' },
              { id: 'tree', name: 'Tree', st: 'kind', x: 2, y: 0, note: 'Prvek (atom) kolektivu, funkční celek.' },
            ],
            assocs: [{ from: 'tree', to: 'forest', st: 'memberOf', whole: 'to', fromMult: '2..*', toMult: '0..1' }],
          },
          sources: [
            { kind: 'slide', doc: 'P04', page: 33 },
            { kind: 'slide', doc: 'P04', page: 38, quote: 'Kolektiv je oproti Kvantitě složen z částí, které nejsou stejného typu jako on sám' },
          ],
        },
        {
          kind: 'callout',
          type: 'definice',
          title: '«memberOf»',
          html:
            'Relace mezi <strong>prvkem</strong> (funkční celek nebo kolektiv) a <strong>kolektivem</strong>. Na straně celku je vždy <span class="st">«collective»</span>, celkem ≥ 2 členové. Je irreflexivní, anti-symetrická a <strong>NEtranzitivní</strong>. Prvek je atomický jen vůči kolektivu: sám může mít části (klub je prvek federace, ale má své členy).',
          sources: [
            { kind: 'slide', doc: 'P04', page: 44, quote: 'Relace MemberOf je irreflexivní, anti-symetrická a NEtranzitivní' },
            { kind: 'slide', doc: 'P04', page: 54 },
            { kind: 'web', label: 'OntoUML docs: MemberOf', url: 'https://ontouml.readthedocs.io/en/latest/relationships/aggregations/memberOf/index.html' },
          ],
        },
        {
          kind: 'diagram',
          title: 'memberOf není tranzitivní',
          caption:
            'Jsem členem klubu a klub je členem federace. Z toho <strong>neplyne</strong>, že jsem členem federace: jejími členy jsou jen kluby.',
          diagram: {
            classes: [
              { id: 'fed', name: 'Club Federation', st: 'collective', x: 0, y: 0 },
              { id: 'club', name: 'Club', st: 'collective', x: 0, y: 1.8, note: 'Pro federaci je klub atomický prvek, ale sám má členy.' },
              { id: 'person', name: 'Person', st: 'kind', x: 2.1, y: 0 },
              { id: 'cm', name: 'Club Member', st: 'role', x: 2.1, y: 1.8 },
            ],
            gens: [{ general: 'person', specifics: ['cm'] }],
            assocs: [
              { from: 'club', to: 'fed', st: 'memberOf', whole: 'to', shareable: true, fromMult: '2..*', toMult: '1..*' },
              { from: 'cm', to: 'club', st: 'memberOf', whole: 'to', shareable: true, fromMult: '2..*', toMult: '1..*' },
            ],
          },
          sources: [
            { kind: 'slide', doc: 'P04', page: 44, quote: 'nevyplývá, že jsem členem Federace, protože členové Federace mohou být pouze kluby,' },
          ],
        },
        {
          kind: 'callout',
          type: 'definice',
          title: '«subCollectionOf»',
          html:
            'Relace mezi <strong>dvěma kolektivy</strong> (plurálními entitami): „severní cíp lesa – les“, „mladí ptáci – hejno“. Sjednocující relace podkolektivu je specializací relace kolektivu, takže všichni členové podkolektivu jsou členy kolektivu: relace je <strong>tranzitivní</strong>. Dále je irreflexivní, kolektiv má <strong>nejvýše 1 podkolektiv daného typu</strong> a podkolektiv <strong>lze sdílet</strong> (sourozenci jsou zároveň v rodině i ve fotbalovém týmu). Samotná subCollectionOf neznamená {inseparable}.',
          sources: [
            { kind: 'slide', doc: 'P04', page: 45, quote: 'Relace mezi dvěma plurálními entitami' },
            { kind: 'slide', doc: 'P04', page: 46, quote: 'Kolektiv může mít max. 1 Podkolektiv určitého typu.' },
            { kind: 'slide', doc: 'P04', page: 47, quote: 'Podkolektiv může být sdílený' },
            { kind: 'web', label: 'OntoUML docs: SubCollectionOf', url: 'https://ontouml.readthedocs.io/en/latest/relationships/aggregations/subCollectionOf/index.html' },
          ],
        },
        {
          kind: 'diagram',
          title: 'memberOf + subCollectionOf = tranzitivní',
          caption:
            'Výzkumník je členem podskupiny Modelování, ta je podkolektivem Výzkumné skupiny, a proto je výzkumník i členem Výzkumné skupiny. Tranzitivita šíří práva a závazky (člen fakulty má i práva člena univerzity).',
          diagram: {
            classes: [
              { id: 'rg', name: 'Research Group', st: 'collective', x: 0, y: 0 },
              { id: 'mrg', name: 'Modelling Research Group', st: 'collective', x: 2.3, y: 0, note: 'Podkolektiv: jeho sjednocující relace zužuje relaci celé skupiny.' },
              { id: 'r', name: 'Researcher', st: 'kind', x: 4.6, y: 0 },
            ],
            assocs: [
              { from: 'mrg', to: 'rg', st: 'subCollectionOf', whole: 'to', fromMult: '1', toMult: '1', mark: 'focus' },
              { from: 'r', to: 'mrg', st: 'memberOf', whole: 'to', shareable: true, fromMult: '2..*', toMult: '0..*' },
            ],
          },
          sources: [
            { kind: 'slide', doc: 'P04', page: 48, quote: 'Kombinace relace MemberOf a SubCollectionOf zachovává tranzitivitu' },
            { kind: 'slide', doc: 'P04', page: 49 },
          ],
        },
        { kind: 'quiz', ids: ['ch05-10'] },
      ],
    },
    // -----------------------------------------------------------------------
    {
      id: 'sec-5-6',
      number: '5.6',
      title: 'Kvantita: subQuantityOf a containment; výběr relace',
      blocks: [
        {
          kind: 'p',
          html:
            '<span class="st">«quantity»</span> modeluje <strong>množství látky</strong>: kapaliny, sypké a vazké materiály (víno, voda, písek) a materiály, ze kterých jsou věci (jíl, dřevo). <strong>Identitu</strong> dává topologie: kvantita je <strong>maximální spojitý objekt</strong>. Spojitý = části na sebe plynule navazují, maximální = není částí větší porce téže látky. Test: rozdělíš-li ji na dvě, vzniknou dvě nové instance téhož typu (dvě hromádky písku).',
          sources: [
            { kind: 'slide', doc: 'P04', page: 35 },
            { kind: 'slide', doc: 'P04', page: 36, quote: 'Kvantita je agregovaný celek, který je vždy maximální spojitý objekt:' },
            { kind: 'slide', doc: 'C05', page: 9, quote: 'Maximální spojitý objekt, nerozlišujeme jednotlivé části' },
            { kind: 'web', label: 'OntoUML docs: Quantity', url: 'https://ontouml.readthedocs.io/en/latest/classes/sortals/quantity/index.html' },
          ],
        },
        {
          kind: 'diagram',
          title: 'Víno v láhvi, alkohol ve víně',
          caption:
            'Láhev víno <em>obsahuje</em> («containment», bez diamantu). Alkohol je <em>součástí</em> vína («subQuantityOf», vždy {essential}, na straně části právě 1).',
          diagram: {
            classes: [
              { id: 'bottle', name: 'Bottle', st: 'kind', x: 0, y: 0, note: 'Kontejner je funkční celek (kind), ne kvantita.' },
              { id: 'wine', name: 'Wine', st: 'quantity', x: 1.9, y: 0, note: 'Část vína je zase víno.' },
              { id: 'alc', name: 'Alcohol', st: 'quantity', x: 3.8, y: 0, note: 'Vydestiluj alkohol a nahraď ho jiným: už to není totéž víno.' },
            ],
            assocs: [
              { from: 'bottle', to: 'wine', st: 'containment', fromMult: '1', toMult: '1' },
              { from: 'alc', to: 'wine', st: 'subQuantityOf', whole: 'to', shareable: false, fromMult: '1', toMult: '1', meta: ['essential'], mark: 'focus' },
            ],
          },
          sources: [
            { kind: 'slide', doc: 'P04', page: 35 },
            { kind: 'slide', doc: 'P04', page: 37 },
          ],
        },
        {
          kind: 'callout',
          type: 'definice',
          title: '«subQuantityOf» a «containment»',
          html:
            '<strong>subQuantityOf</strong> (kvantita → kvantita): na straně části <strong>právě 1</strong> (podkvantity jsou také maximální), <strong>vždy esenciální</strong>, <strong>nesdílitelná</strong> (plný diamant), <strong>tranzitivní</strong> a irreflexivní.<br><strong>containment</strong> (kvantita → kontejner): láhev–víno, kyblík–malta, socha–jíl. Kontejner je obvykle <span class="st">«kind»</span>, ve vzoru ze slajdu 1 : 1, <strong>není tranzitivní</strong>.',
          sources: [
            { kind: 'slide', doc: 'P04', page: 37, quote: 'Relace je tranzitivní a irreflexivní (vyplývá z maximality).' },
            { kind: 'slide', doc: 'P04', page: 37, quote: 'Vždy se jedná o esenciální část' },
            { kind: 'web', label: 'OntoUML docs: SubQuantityOf', url: 'https://ontouml.readthedocs.io/en/latest/relationships/aggregations/subQuantityOf/index.html' },
            { kind: 'web', label: 'OntoUML docs: Containment', url: 'https://ontouml.readthedocs.io/en/latest/relationships/aggregations/containment/index.html' },
          ],
        },
        {
          kind: 'callout',
          type: 'past',
          title: 'Co kvantita NENÍ',
          html:
            '<ul><li>Peněžní částka není automaticky <span class="st">«quantity»</span> (není to spojitá látka v prostoru).</li><li>Přednáška je událost, ne kvantita.</li><li><span class="st">«quality»</span> ≠ <span class="st">«quantity»</span>: kvalita je aspekt (barva, hmotnost), kvantita je množství látky.</li></ul>',
          sources: [
            { kind: 'slide', doc: 'P04', page: 36, quote: 'Kvantita je tedy vymezena topologicky' },
            { kind: 'slide', doc: 'P04', page: 62, quote: 'není stereotyp celek–část Quantity' },
          ],
        },
        {
          kind: 'table',
          caption: 'Jak vybrat relaci celek–část (podle slajdu 54)',
          head: ['Relace', 'Část → celek', 'Tranzitivní?', 'Klíčové omezení'],
          rows: [
            ['<strong>componentOf</strong>', 'funkční celek → funkční celek', 'obecně ne', 'sdílení závisí na doméně'],
            ['<strong>memberOf</strong>', 'funkční celek či kolektiv → kolektiv', 'ne', 'celkem alespoň 2 členové'],
            ['<strong>subCollectionOf</strong>', 'kolektiv → kolektiv', 'ano', 'nejvýše 1 podkolektiv daného typu; lze sdílet'],
            ['<strong>containment</strong>', 'kvantita → kontejner', 'ne', '1 : 1 v uvedeném vzoru'],
            ['<strong>subQuantityOf</strong>', 'kvantita → kvantita', 'ano', 'právě 1 na straně části; esenciální, nesdílená'],
          ],
          sources: [
            { kind: 'slide', doc: 'P04', page: 54, quote: 'Právě 1 na straně části; esenciální, nesdílená' },
            { kind: 'slide', doc: 'P04', page: 54, quote: 'Nejvýše 1 podkolektiv daného typu; lze sdílet' },
          ],
        },
        {
          kind: 'interactive',
          component: 'part-whole',
          title: 'Která relace celek–část?',
          hint: 'Nejdřív urči druh celku (funkční celek / kolektiv / kvantita), potom druh části. Relace pak skoro vždy vyplyne sama.',
        },
        {
          kind: 'diagram',
          title: 'Vzorové řešení cvičení 5: vozový park',
          caption:
            'Shrnuje skoro vše z kapitoly: memberOf mezi kolektivy, podvozek {essential, inseparable} (VIN je na podvozku i motoru), motor jen u fáze Operable Car, a proto {immutablePart}, nádrž jako komponenta a palivo v nádrži přes «containment». (Ve vzoru je ještě «category» Car Gadgets a subQuantityOf Fuel ← Biocomponent.)',
          diagram: {
            classes: [
              { id: 'cf', name: 'Car Fleet', st: 'collective', x: 0, y: 0 },
              { id: 'lf', name: 'Local Fleet', st: 'collective', x: 0, y: 1.8, note: 'Kolektiv, který je sám členem jiného kolektivu.' },
              { id: 'car', name: 'Car', st: 'kind', x: 2, y: 1.8 },
              { id: 'chassis', name: 'Chassis', st: 'kind', x: 2, y: 0, note: 'VIN je na podvozku: bez tohoto podvozku to není totéž auto.' },
              { id: 'inop', name: 'Inoperable Car', st: 'phase', x: 1.3, y: 3.1 },
              { id: 'op', name: 'Operable Car', st: 'phase', x: 2.7, y: 3.1 },
              { id: 'engine', name: 'Engine', st: 'kind', x: 4.6, y: 3.1, note: 'Celek je «phase», takže {immutablePart} místo {essential}.' },
              { id: 'tank', name: 'Fuel Tank', st: 'kind', x: 4, y: 1.8 },
              { id: 'fuel', name: 'Fuel', st: 'quantity', x: 4, y: 0 },
            ],
            gens: [{ general: 'car', specifics: ['inop', 'op'], set: { disjoint: true, complete: true } }],
            assocs: [
              { from: 'lf', to: 'cf', st: 'memberOf', whole: 'to', fromMult: '2..*', toMult: '1' },
              { from: 'car', to: 'lf', st: 'memberOf', whole: 'to', fromMult: '2..*', toMult: '0..1' },
              { from: 'chassis', to: 'car', st: 'componentOf', whole: 'to', fromMult: '1', toMult: '1', meta: ['essential', 'inseparable'] },
              { from: 'tank', to: 'car', st: 'componentOf', whole: 'to', fromMult: '1', toMult: '0..1' },
              { from: 'engine', to: 'op', st: 'componentOf', whole: 'to', fromMult: '1', toMult: '1', meta: ['immutablePart'], mark: 'focus' },
              { from: 'tank', to: 'fuel', st: 'containment', fromMult: '1', toMult: '1' },
            ],
            steps: [
              { label: 'Kolektivy: Car je členem Local Fleet, ta je členem Car Fleet', add: ['cf', 'lf', 'car'] },
              { label: 'Esenciální a neoddělitelný podvozek', add: ['chassis'] },
              { label: 'Fáze auta a motor s {immutablePart}', add: ['inop', 'op', 'engine'] },
              { label: 'Nádrž (componentOf) a palivo (containment)', add: ['tank', 'fuel'] },
            ],
          },
          sources: [
            { kind: 'image', src: '/sources/c05-reseni.jpg', label: 'Cvičení 5: vzorové řešení (vozový park)' },
            { kind: 'slide', doc: 'C05', page: 12 },
          ],
        },
        { kind: 'quiz', ids: ['ch05-11', 'ch05-12'] },
        { kind: 'quiz', ids: ['ch05-09', 'ch05-13'] },
      ],
    },
    // -----------------------------------------------------------------------
    {
      id: 'sec-5-7',
      number: '5.7',
      title: 'Aspekty: «quality», «mode» a «characterization»',
      blocks: [
        {
          kind: 'p',
          html:
            'Dosud byly všechny entity <strong>existenčně nezávislé</strong> (objekty). Spousta věcí ale sama existovat nemůže: <em>barva jablka</em>, <em>velikost člověka</em>, <em>verze softwaru</em>, <em>bolest hlavy</em>. V UFO jim říkáme <strong>aspekty</strong> (ve filozofii moments, tropes). Pozor: <strong>existenční</strong> závislost (na <em>určitém</em> nositeli) je něco jiného než <strong>relační</strong> závislost u role.',
          sources: [
            { kind: 'slide', doc: 'P04', page: 55, quote: 'existenčně závislá na jiné: barva na jablku' },
            { kind: 'slide', doc: 'P04', page: 57 },
          ],
        },
        {
          kind: 'callout',
          type: 'definice',
          title: 'Aspekt, nositel, inherence',
          html:
            '<strong>Aspekt</strong> je existenčně závislý na svém <strong>nositeli</strong> (bearer). Tato vazba se jmenuje <strong>inherence</strong> (irreflexivní, asymetrická, netranzitivní). Zanikne-li nositel, zaniknou i všechny jeho aspekty (sníš jablko, zmizí i jeho barva). Nositelem může být i jiný aspekt: barva jablka má odstín, sytost a jas.',
          sources: [
            { kind: 'slide', doc: 'P04', page: 58, quote: 'Aspekty jsou existenčně závislé na Objektu, kterému říkáme nositel (bearer).' },
            { kind: 'slide', doc: 'P04', page: 59, quote: 'Existenční povaha inherence navíc vyžaduje, aby při zániku Objektu zanikly i všechny' },
            { kind: 'slide', doc: 'P04', page: 60, quote: 'Nositel Aspektu může být sám Aspektem:' },
          ],
        },
        {
          kind: 'diagram',
          title: 'Typy aspektů v UFO',
          caption:
            'Quality a mode jsou <strong>intrinsické</strong> aspekty (závisí na jednom nositeli). Relator je <strong>relační</strong> aspekt (závisí na více entitách, které propojuje).',
          diagram: {
            classes: [
              { id: 'ind', name: 'Individual', st: 'none', x: 1.25, y: 0, abstract: true },
              { id: 'obj', name: 'Object', st: 'none', x: 0, y: 1.25, note: 'Existenčně nezávislý: Person, Car, Apple…' },
              { id: 'asp', name: 'Aspect', st: 'none', x: 2.5, y: 1.25, abstract: true, note: 'Existenčně závislý na nositeli.' },
              { id: 'intr', name: 'Intrinsic Aspect', st: 'none', x: 1.5, y: 2.5, abstract: true },
              { id: 'rel', name: 'Relational Aspect', st: 'none', x: 3.5, y: 2.5, abstract: true },
              { id: 'q', name: 'Quality', st: 'none', x: 1, y: 3.75, note: 'Se strukturovaným prostorem hodnot.' },
              { id: 'm', name: 'Mode', st: 'none', x: 2, y: 3.75, note: 'Bez strukturovaného prostoru hodnot.' },
              { id: 'r', name: 'Relator', st: 'none', x: 3.5, y: 3.75, note: 'Propojuje (mediation) více entit.' },
            ],
            gens: [
              { general: 'ind', specifics: ['obj', 'asp'], set: { disjoint: true, complete: true } },
              { general: 'asp', specifics: ['intr', 'rel'], set: { disjoint: true, complete: true } },
              { general: 'intr', specifics: ['q', 'm'] },
              { general: 'rel', specifics: ['r'] },
            ],
          },
          sources: [
            { kind: 'slide', doc: 'P04', page: 61 },
            { kind: 'slide', doc: 'P04', page: 66, quote: 'Patří mezi ně «Relator», «Quality» a «Mode».' },
          ],
        },
        {
          kind: 'table',
          caption: 'Quality vs. Mode',
          head: ['', '<span class="st">«quality»</span>', '<span class="st">«mode»</span>'],
          rows: [
            ['Druh', 'intrinsický aspekt', 'intrinsický aspekt'],
            ['Prostor hodnot', '<strong>strukturovaný</strong> (škála, dimenze: RGB, kg, Kč)', '<strong>bez</strong> strukturovaného prostoru hodnot'],
            ['Příklady', 'hmotnost, barva, rychlost, peněžní hodnota; nominální: jméno, ISBN', 'dovednost, konkrétní nemoc, bolest hlavy, nálada, verze knihy, stav osoby'],
            ['Typicky', 'nahraditelná atributem („syntactic sugar“)', 'vlastní třída s atributy, analogie <em>slabé entity</em> v ER'],
            ['Připojení', '«characterization», nositel právě 1', '«characterization», nositel právě 1'],
          ],
          sources: [
            { kind: 'slide', doc: 'P04', page: 62, quote: 'Intrinsické aspekty se strukturovaným prostorem hodnot' },
            { kind: 'slide', doc: 'P04', page: 64, quote: 'Módy jsou intrinsické aspekty bez strukturovaného prostoru hodnot, např. dovednost' },
            { kind: 'slide', doc: 'P04', page: 64, quote: 'Módy jsou analogické slabým entitám v ER modelování.' },
          ],
        },
        {
          kind: 'diagram',
          title: 'Kvality jablka',
          caption:
            'Barva i hmotnost mají strukturovaný prostor hodnot → «quality». Na straně nositele (Apple) je vždy právě 1.',
          diagram: {
            classes: [
              { id: 'w', name: 'Weight', st: 'quality', x: 0, y: 0, attrs: ['value: Real', 'unit: Unit'] },
              { id: 'apple', name: 'Apple', st: 'kind', x: 1.5, y: 0, note: 'Nositel (bearer) obou kvalit.' },
              { id: 'c', name: 'Color', st: 'quality', x: 3, y: 0, attrs: ['red: Integer', 'green: Integer', 'blue: Integer'], note: 'Strukturovaný prostor hodnot: tři dimenze RGB.' },
            ],
            assocs: [
              { from: 'apple', to: 'w', st: 'characterization', fromMult: '1', toMult: '1' },
              { from: 'apple', to: 'c', st: 'characterization', fromMult: '1', toMult: '1' },
            ],
          },
          sources: [
            { kind: 'slide', doc: 'P04', page: 58 },
            { kind: 'slide', doc: 'P04', page: 62 },
          ],
        },
        {
          kind: 'diagram',
          title: 'Kvalita a mód jedné osoby',
          caption:
            'IQ je «quality» (hodnota na škále). Bolest hlavy je «mode»: je to konkrétní „věc“ na osobě, osoba jich může mít víc a má vlastní vlastnosti, ani intenzita z ní kvalitu nedělá.',
          diagram: {
            classes: [
              { id: 'iq', name: 'IQ', st: 'quality', x: 0, y: 0, attrs: ['value: Integer'] },
              { id: 'p', name: 'Person', st: 'kind', x: 1.5, y: 0 },
              { id: 'ha', name: 'Headache', st: 'mode', x: 3, y: 0, attrs: ['intensity: Integer', 'since: DateTime'], note: 'Mód: měřitelná intenzita z něj ještě nedělá kvalitu.' },
            ],
            assocs: [
              { from: 'p', to: 'iq', st: 'characterization', fromMult: '1', toMult: '1' },
              { from: 'p', to: 'ha', st: 'characterization', fromMult: '1', toMult: '0..*', mark: 'focus' },
            ],
          },
          sources: [
            { kind: 'slide', doc: 'C05', page: 11 },
            { kind: 'slide', doc: 'P04', page: 64, quote: 'Měřitelné vlastnosti módu z něj ještě nedělají Kvalitu.' },
          ],
        },
        {
          kind: 'callout',
          type: 'past',
          title: 'Měřitelnost nerozhoduje',
          html:
            'Slajd ze cvičení zjednodušuje: «quality» = měřitelné, «mode» = neměřitelné. Přednáška to upřesňuje: rozhoduje <strong>strukturovaný prostor hodnot</strong>, ne samotná měřitelnost. Mód může mít měřitelné atributy (intenzita bolesti) a pořád je to mód. Kvalita naopak může být i nominální (jméno). Při rozporu platí přednáška.',
          sources: [
            { kind: 'slide', doc: 'C05', page: 11, quote: '«Quality» = měřitelné (na nějaké škále)' },
            { kind: 'slide', doc: 'P04', page: 64, quote: 'Měřitelné vlastnosti módu z něj ještě nedělají Kvalitu.' },
            { kind: 'slide', doc: 'P04', page: 66 },
          ],
        },
        {
          kind: 'callout',
          type: 'pravidlo',
          title: '«characterization»',
          html:
            'Spojuje nositele s jeho kvalitou či módem. Na straně <strong>nositele</strong> je multiplicita <strong>právě 1</strong> (aspekt patří jednomu nositeli). Na straně aspektu bývá 1 (kvalita) nebo i 1..* / 0..* (módy, stavy, verze). Každá «quality» i «mode» musí být charakterizací připojena k nějakému nositeli. Mezi aspekty nekresli relace celek–část (componentOf, memberOf…).',
          sources: [
            { kind: 'slide', doc: 'P04', page: 62, quote: 'spojuje Kvalitu či Mód s právě jedním nositelem' },
            { kind: 'web', label: 'OntoUML docs: Characterization', url: 'https://ontouml.readthedocs.io/en/latest/relationships/characterization/index.html' },
            { kind: 'web', label: 'OntoUML docs: Mode', url: 'https://ontouml.readthedocs.io/en/latest/classes/aspects/mode/index.html' },
          ],
        },
        { kind: 'quiz', ids: ['ch05-14'], title: 'Otázka z midtermu 2022' },
        { kind: 'quiz', ids: ['ch05-15', 'ch05-16'] },
      ],
    },
    // -----------------------------------------------------------------------
    {
      id: 'sec-5-8',
      number: '5.8',
      title: 'Kvalita vs. atribut, mode vs. relator a phase',
      blocks: [
        {
          kind: 'compare',
          title: 'Kvalita jako třída, nebo jako atribut?',
          items: [
            {
              label: 'samostatná «quality»',
              verdict: 'good',
              note: 'Má smysl, když kvalita potřebuje vlastní atributy, vazby nebo různé stupnice (km/h vs. mph).',
              diagram: {
                classes: [
                  { id: 'car', name: 'Car', st: 'kind', x: 0, y: 0 },
                  { id: 'sp', name: 'Speed', st: 'quality', x: 2, y: 0, attrs: ['value: Integer'] },
                ],
                assocs: [{ from: 'car', to: 'sp', st: 'characterization', name: 'maxSpeed', fromMult: '1', toMult: '1' }],
              },
            },
            {
              label: 'atribut (zkratka)',
              verdict: 'good',
              note: 'Atribut je v OntoUML „syntactic sugar“ pro kvalitu. Pro prostou hodnotu stačí.',
              diagram: {
                classes: [{ id: 'car', name: 'Car', st: 'kind', x: 0, y: 0, attrs: ['maxSpeed: Integer'] }],
              },
            },
          ],
          sources: [
            { kind: 'slide', doc: 'P04', page: 63, quote: 'Atributy jsou v OntoUML de-facto "syntactic sugar" pro Kvality.' },
            { kind: 'slide', doc: 'P04', page: 68, quote: 'Nemusíme: přednáška používá atributy jako úsporný zápis kvalit.' },
          ],
        },
        {
          kind: 'p',
          html:
            '<strong>Struktura hodnot kvality:</strong> barva v RGB má tři dimenze (red, green, blue), rychlost jednu (value). Rozlišuj kvalitu samotnou (hmotnost <em>tohoto</em> auta), její číselnou hodnotu (1 200 kg) a záznam měření (kdo, kdy vážil).',
          sources: [
            { kind: 'slide', doc: 'P04', page: 62 },
            { kind: 'slide', doc: 'P04', page: 68 },
            { kind: 'web', label: 'OntoUML docs: Quality', url: 'https://ontouml.readthedocs.io/en/latest/classes/aspects/quality/index.html' },
          ],
        },
        {
          kind: 'diagram',
          title: 'Mód jako stav osoby',
          caption:
            'Módy často reprezentují stavy objektu: John@1988, John@2002 … jsou různé instance Person State téhož Johna. «phase» je také „stav“, ale jiný: dělí instance kindu podle intrinsické vlastnosti, sám nic nenese.',
          diagram: {
            classes: [
              { id: 'p', name: 'Person', st: 'kind', x: 0, y: 0, attrs: ['name', 'SSN'] },
              { id: 'ps', name: 'Person State', st: 'mode', x: 1.5, y: 0, attrs: ['age', 'weight'], note: 'Jeden snímek stavu osoby v čase.' },
            ],
            assocs: [{ from: 'p', to: 'ps', st: 'characterization', fromMult: '1', toMult: '1..*' }],
          },
          sources: [{ kind: 'slide', doc: 'P04', page: 65, quote: 'Pomocí Módů často reprezentujeme stavy Objektů:' }],
        },
        {
          kind: 'compare',
          title: 'Mode vs. relator',
          items: [
            {
              label: '«mode»: jeden nositel',
              verdict: 'neutral',
              note: 'Intrinsický aspekt: bolest hlavy závisí jen na Johnovi. Připojení přes «characterization».',
              diagram: {
                classes: [
                  { id: 'p', name: 'Person', st: 'kind', x: 0, y: 0 },
                  { id: 'h', name: 'Headache', st: 'mode', x: 2, y: 0 },
                ],
                assocs: [{ from: 'p', to: 'h', st: 'characterization', fromMult: '1', toMult: '0..*' }],
              },
            },
            {
              label: '«relator»: více entit',
              verdict: 'neutral',
              note: 'Relační aspekt: zápis závisí na studentovi i na univerzitě. Připojení přes «mediation».',
              diagram: {
                classes: [
                  { id: 's', name: 'Student', st: 'role', x: 0, y: 0 },
                  { id: 'e', name: 'Enrollment', st: 'relator', x: 1.8, y: 0 },
                  { id: 'u', name: 'University', st: 'kind', x: 3.6, y: 0 },
                ],
                assocs: [
                  { from: 'e', to: 's', st: 'mediation', fromMult: '1..*', toMult: '1' },
                  { from: 'e', to: 'u', st: 'mediation', fromMult: '0..*', toMult: '1' },
                ],
              },
            },
          ],
          sources: [{ kind: 'slide', doc: 'P04', page: 61 }],
        },
        {
          kind: 'table',
          caption: 'Tři věci, kterým se říká „stav“ nebo „vlastnost“',
          head: ['', '<span class="st">«mode»</span>', '<span class="st">«relator»</span>', '<span class="st">«phase»</span>'],
          rows: [
            ['Co to je', 'aspekt (individuum)', 'aspekt (individuum)', 'anti-rigidní sortál (typ objektu)'],
            ['Závisí na', 'jednom nositeli (existenčně)', 'více entitách (existenčně)', 'intrinsické vlastnosti instance'],
            ['Vazba', '«characterization»', '«mediation»', 'generalizace z kindu'],
            ['Příklad', 'Headache, Skill, Book Version', 'Marriage, Enrollment', 'Child, Adult, LivingPerson'],
          ],
          sources: [
            { kind: 'slide', doc: 'P04', page: 61 },
            { kind: 'slide', doc: 'P04', page: 65 },
          ],
        },
        {
          kind: 'callout',
          type: 'shrnuti',
          title: 'Shrnutí kapitoly',
          html:
            '<ul><li>Diamant v OntoUML = <strong>sdílitelnost</strong> (z multiplicity na straně celku), ne síla vazby.</li><li>Povinnost řeš <strong>v obou směrech</strong>: volitelná / povinná / {essential} část; nepovinný / povinný celek / {inseparable}. Pro anti-rigidní typy {immutablePart} / {immutableWhole}.</li><li>Funkční celek → componentOf; «collective» → memberOf (netranzitivní), subCollectionOf (tranzitivní); «quantity» → subQuantityOf (tranzitivní, essential, právě 1), containment.</li><li>Aspekty jsou existenčně závislé na nositeli: «quality» se strukturovanými hodnotami, «mode» bez nich, oba přes «characterization» s nositelem právě 1.</li></ul>',
          sources: [
            { kind: 'slide', doc: 'P04', page: 31 },
            { kind: 'slide', doc: 'P04', page: 54 },
            { kind: 'slide', doc: 'P04', page: 66 },
          ],
        },
        { kind: 'quiz', ids: ['ch05-17', 'ch05-18'] },
      ],
    },
  ],
}
