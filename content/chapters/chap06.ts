import type { Chapter } from '../types'

const AP = 'https://ontouml.readthedocs.io/en/latest/anti-patterns/'

export const chap06: Chapter = {
  id: 'chap-6',
  number: '6',
  title: 'Shrnutí OntoUML a antipatterny',
  docs: ['P05', 'C06', 'C06-eshop', 'W-suhrn'],
  exam: ['midterm', 'zkouska'],
  summary:
    'Umíš z hlavy říct rigiditu, identitu a závislost každého stereotypu OntoUML, postavit model od páteře identity a v hotovém modelu poznat osm antipatternů z přednášky (BinOver, DepPhase, FreeRole, HetColl, MixRig, MultDep, RelRig, UndefPhase) včetně jejich opravy.',
  sections: [
    // -----------------------------------------------------------------------
    {
      id: 'sec-6-1',
      number: '6.1',
      title: 'Všechny stereotypy na jedné stránce',
      blocks: [
        {
          kind: 'p',
          html:
            'Než začneš hledat chyby v modelech, musíš mít stereotypy „v prstech“. Každý typ entity v OntoUML popisují tři otázky: <strong>Má identitu?</strong> (sortál × non-sortál), <strong>Může instance přestat být tímto typem?</strong> (rigidní × anti-rigidní × semi-rigidní) a <strong>Na čem závisí?</strong> (na vnitřní vlastnosti, na vztahu, na nositeli).',
          sources: [
            { kind: 'slide', doc: 'C06', page: 4, quote: 'Založený na filozofii a kognitivních vědách - princip identity, rigidity' },
          ],
        },
        {
          kind: 'table',
          caption: 'Tahák: stereotypy tříd OntoUML (vše, co padá v midtermu)',
          head: ['Stereotyp', 'Druh', 'Rigidita', 'Identita', 'Příklad', 'Jak to poznám / pravidlo'],
          rows: [
            ['<span class="st">«kind»</span>', 'sortál', 'rigidní', '<strong>poskytuje</strong>', 'Person, Car', 'základní „co to je“; nadtypem může být jen non-sortál (<span class="st">«category»</span>, <span class="st">«mixin»</span>)'],
            ['<span class="st">«subkind»</span>', 'sortál', 'rigidní', 'dědí', 'Man, Woman', 'rigidní specializace s esenciální vlastností; partice není povinná'],
            ['<span class="st">«collective»</span>', 'sortál', 'rigidní', '<strong>poskytuje</strong>', 'Forest, Fleet', 'celek ze členů <em>stejného druhu</em>, <span class="st">«memberOf»</span> (min. 2 části)'],
            ['<span class="st">«quantity»</span>', 'sortál', 'rigidní', '<strong>poskytuje</strong>', 'Wine, Water', 'nespočetná hmota; <span class="st">«containment»</span> 1–1, <span class="st">«subQuantityOf»</span>'],
            ['<span class="st">«relator»</span>', 'sortál (moment)', 'rigidní', '<strong>poskytuje</strong>', 'Marriage, Enrollment', 'truthmaker <span class="st">«material»</span> vztahu, <span class="st">«mediation»</span> na obě strany'],
            ['<span class="st">«role»</span>', 'sortál', 'anti-rigidní', 'dědí', 'Student, Husband', 'stane se jím <em>navázáním vztahu</em>; povinný vztah (mediation), min. multiplicita ≥ 1'],
            ['<span class="st">«phase»</span>', 'sortál', 'anti-rigidní', 'dědí', 'Child, Adult, Living', 'stane se jím <em>změnou vnitřní vlastnosti</em>; vždy partition <code>{disjoint, complete}</code>'],
            ['<span class="st">«category»</span>', 'non-sortál', 'rigidní', 'nemá (agreguje různé)', 'LegalEntity', 'abstraktní nadtyp rigidních typů různých kindů'],
            ['<span class="st">«mixin»</span>', 'non-sortál', '<strong>semi-rigidní</strong>', 'nemá', 'InsuredItem', 'podtypy rigidní <em>i</em> anti-rigidní'],
            ['<span class="st">«roleMixin»</span>', 'non-sortál', 'anti-rigidní', 'nemá', 'Customer', 'relačně závislý; nadtyp rolí různých kindů'],
            ['<span class="st">«phaseMixin»</span>', 'non-sortál', 'anti-rigidní', 'nemá', 'LivingBeing (alive)', 'nadtyp fází různých kindů'],
            ['<span class="st">«quality»</span>', 'aspekt', 'rigidní', '<strong>poskytuje</strong>', 'Height, Color', 'měřitelná veličina, <span class="st">«characterization»</span> k nositeli'],
            ['<span class="st">«mode»</span>', 'aspekt', 'rigidní', '<strong>poskytuje</strong>', 'Skill, Symptom', 'neměřitelná vlastnost či stav, <span class="st">«characterization»</span>'],
          ],
          sources: [
            { kind: 'slide', doc: 'C06', page: 5, quote: '«Kind» = základní rigidní sortál poskytující identitu (identity provider)' },
            { kind: 'slide', doc: 'C06', page: 6, quote: 'Vždy tvoří phase partition, který musí být {disjoint, complete}' },
            { kind: 'slide', doc: 'C06', page: 7, quote: '«Mixin» = semi-rigidní non-sortál, pro rigidní a současně anti-rigidní podtypy' },
            { kind: 'slide', doc: 'C06', page: 8, quote: '«Mode» = neměřitelné veličiny a stavy' },
            { kind: 'slide', doc: 'P05', page: 5 },
          ],
        },
        {
          kind: 'diagram',
          title: 'Přehled v jednom modelu',
          caption:
            'Jedna osoba „prochází“ stereotypy: identitu jí dává kind Person, fáze se mění podle věku (vnitřní vlastnost), role Student vzniká zápisem (relátor Enrollment). Najeď myší na třídy.',
          diagram: {
            classes: [
              { id: 'height', name: 'Height', st: 'quality', x: 0, y: 0, note: 'Quality: měřitelná veličina, existenčně závislá na osobě.' },
              { id: 'person', name: 'Person', st: 'kind', x: 1, y: 0, attrs: ['birthDate: Date'], note: 'Kind: rigidní, poskytuje identitu. Atribut birthDate definuje fáze.' },
              { id: 'child', name: 'Child', st: 'phase', x: 0, y: 1, note: 'Phase: anti-rigidní, mění se podle vnitřní vlastnosti (věku).' },
              { id: 'adult', name: 'Adult', st: 'phase', x: 2, y: 1, note: 'Phase: z Child se stane Adult bez jakéhokoli vztahu.' },
              { id: 'group', name: 'StudyGroup', st: 'collective', x: 1, y: 2, note: 'Collective: celek ze stejnorodých členů.' },
              { id: 'student', name: 'Student', st: 'role', x: 2, y: 2, note: 'Role: anti-rigidní, relačně závislá – Studentem je jen díky zápisu.' },
              { id: 'enr', name: 'Enrollment', st: 'relator', x: 3, y: 3, note: 'Relator: truthmaker vztahu studies at.' },
              { id: 'uni', name: 'University', st: 'kind', x: 4, y: 2 },
            ],
            gens: [{ general: 'person', specifics: ['child', 'adult'], set: { name: 'age', disjoint: true, complete: true } }, { general: 'adult', specifics: ['student'] }],
            assocs: [
              { from: 'person', to: 'height', st: 'characterization', fromMult: '1', toMult: '1' },
              { from: 'group', to: 'student', st: 'memberOf', whole: 'from', shareable: true, fromMult: '0..*', toMult: '2..*' },
              { id: 'studies', from: 'student', to: 'uni', st: 'material', name: 'studies at', fromMult: '1..*', toMult: '1..*' },
              { from: 'enr', to: 'student', st: 'mediation', fromMult: '1..*', toMult: '1' },
              { from: 'enr', to: 'uni', st: 'mediation', fromMult: '0..*', toMult: '1' },
            ],
            derivations: [{ relator: 'enr', assoc: 'studies' }],
          },
        },
        {
          kind: 'callout',
          type: 'past',
          title: 'Kdo může být čím nadtyp',
          html:
            '<ul><li>Nadtypem <span class="st">«kind»</span> (i quantity, collective, relator) může být <strong>jen non-sortál</strong> – <span class="st">«category»</span> nebo <span class="st">«mixin»</span>. Kind nemůže dědit identitu od jiného sortálu.</li><li>Non-sortál nikdy není podtypem sortálu (zdědil by identitu, kterou nemá).</li><li>Rigidní ani semi-rigidní typ nemůže být podtypem anti-rigidního (Person nemůže být podtypem Student).</li><li>Podtypem <span class="st">«category»</span> jsou jen rigidní typy (kind, subkind, relator, collective, quality…), ne role/phase.</li></ul>',
          sources: [
            { kind: 'slide', doc: 'P05', page: 5, quote: 'Každý sortál dědící identitu musí vést k právě jednomu poskytovateli' },
            { kind: 'wiki', label: 'FIT Wiki: Súhrn OntoUML (W-suhrn), str. 1' },
          ],
        },
        { kind: 'quiz', ids: ['ch06-01', 'ch06-02'] },
        { kind: 'quiz', ids: ['ch06-03'] },
      ],
    },
    // -----------------------------------------------------------------------
    {
      id: 'sec-6-2',
      number: '6.2',
      title: 'Postup modelování a princip reifikace',
      blocks: [
        {
          kind: 'list',
          ordered: true,
          items: [
            '<strong>Páteř identity:</strong> urči, co jsou jedinci a kdo jim dává identitu (<span class="st">«kind»</span>, <span class="st">«collective»</span>, <span class="st">«quantity»</span>, <span class="st">«relator»</span>, <span class="st">«mode»</span>, <span class="st">«quality»</span>).',
            '<strong>Rigidní specializace:</strong> přidej <span class="st">«subkind»</span>. <code>disjoint</code>/<code>complete</code> vol podle domény – partice není povinná.',
            '<strong>Anti-rigidní specializace:</strong> „Může se Person, který není Otec, stát Otcem? Může přestat být Otcem?“ Dvakrát ano → anti-rigidní.',
            '<strong>Role vs. phase:</strong> stane se jím <em>navázáním vztahu</em> → <span class="st">«role»</span> (pojmenuj definující relaci, urči kardinality); <em>změnou hodnoty atributu</em> → <span class="st">«phase»</span> (najdi definující atribut).',
            '<strong>Non-sortály:</strong> až nakonec – společné rysy více kindů vytáhni do abstraktního nadtypu a vyber správný druh non-sortálu.',
          ],
          sources: [
            { kind: 'slide', doc: 'P05', page: 5, quote: 'Nejprve určíme, co jsou jedinci a co zachovává jejich identitu.' },
            { kind: 'slide', doc: 'P05', page: 6, quote: 'Subkind dědí identitu a přidává esenciální rozlišující vlastnost.' },
            { kind: 'slide', doc: 'P05', page: 7, quote: 'Může se [A], které není [B], stát [B]?' },
            { kind: 'slide', doc: 'P05', page: 8, quote: 'Role dědí právě jeden princip identity a klasifikuje jedince na základě relační podmínky.' },
            { kind: 'slide', doc: 'P05', page: 10, quote: 'Phase dědí právě jeden princip identity' },
            { kind: 'slide', doc: 'P05', page: 11, quote: 'Non-sortály reprezentují společné rysy, které jsou sdíleny entitami vícero typů.' },
          ],
        },
        {
          kind: 'callout',
          type: 'definice',
          title: 'Reifikace',
          html:
            '<strong>Reifikace</strong> = do modelu zavádíme dosud nevyjádřené pojmy (skryté role, relátory, fáze). Model se tím zpřesňuje a roste jeho výrazovost. Signálem bývá volitelná multiplicita <code>0..1</code> – vybízí k otázce „nechybí tu role nebo vztah s vlastní identitou?“ (sama o sobě ale nic nerozhoduje).',
          sources: [
            { kind: 'slide', doc: 'P05', page: 12, quote: 'je postup, kdy do modelu zavádíme dosud nevyjádřené pojmy' },
            { kind: 'slide', doc: 'P05', page: 15, quote: 'dobou trvání nebo vlastnostmi? Samotná volitelnost nerozhoduje.' },
          ],
        },
        {
          kind: 'diagram',
          title: 'Reifikace krok za krokem: manželství',
          caption:
            'Z naivního „Person married to Person (0..1)“ se postupně stane přesný model: subkindy, role Husband/Wife (multiplicita 0..1 → 1) a nakonec relátor Marriage, z něhož je vztah married to odvozen.',
          diagram: {
            classes: [
              { id: 'p', name: 'Person', st: 'kind', x: 1, y: 0 },
              { id: 'man', name: 'Man', st: 'subkind', x: 0, y: 1 },
              { id: 'woman', name: 'Woman', st: 'subkind', x: 2, y: 1 },
              { id: 'hus', name: 'Husband', st: 'role', x: 0, y: 2, note: 'Pojem byl „skrytý“ v Man – proto dřív multiplicita 0..1.' },
              { id: 'wife', name: 'Wife', st: 'role', x: 2, y: 2 },
              { id: 'mar', name: 'Marriage', st: 'relator', x: 1, y: 3, note: 'Relátor: vztah s vlastní identitou, dobou trvání a vlastnostmi.' },
            ],
            gens: [
              { general: 'p', specifics: ['man', 'woman'], set: { disjoint: true, complete: true } },
              { general: 'man', specifics: ['hus'] },
              { general: 'woman', specifics: ['wife'] },
            ],
            assocs: [
              { id: 'mt', from: 'hus', to: 'wife', st: 'material', name: 'married to', fromMult: '1', toMult: '1' },
              { from: 'mar', to: 'hus', st: 'mediation', fromMult: '1..*', toMult: '1' },
              { from: 'mar', to: 'wife', st: 'mediation', fromMult: '1..*', toMult: '1' },
            ],
            derivations: [{ relator: 'mar', assoc: 'mt' }],
            steps: [
              { label: 'Person – kdo dává identitu', add: ['p'] },
              { label: 'Man / Woman – rigidní specializace', add: ['man', 'woman'] },
              { label: 'Husband / Wife – skryté role (0..1 → 1)', add: ['hus', 'wife'] },
              { label: 'Marriage – reifikace vztahu do relátoru', add: ['mar'] },
            ],
          },
          sources: [
            { kind: 'slide', doc: 'P05', page: 14 },
            { kind: 'slide', doc: 'P05', page: 15 },
            { kind: 'slide', doc: 'P05', page: 16 },
          ],
        },
        {
          kind: 'callout',
          type: 'priklad',
          title: 'Ani to nestačí: „Zombie Land“',
          html:
            'V modelu výše si může vzít Husband i mrtvá osoba. Přednáška to opravuje fázemi <span class="st">«phase»</span> Living Person / Deceased Person <code>{disjoint, complete}</code> a mezifázemi Living Man / Living Woman, ze kterých teprve dědí role Husband a Wife.',
          sources: [
            { kind: 'slide', doc: 'P05', page: 15, quote: 'takto se mohou vzít i mrtví lidé' },
            { kind: 'slide', doc: 'P05', page: 16 },
          ],
        },
        { kind: 'quiz', ids: ['ch06-04'] },
      ],
    },
    // -----------------------------------------------------------------------
    {
      id: 'sec-6-3',
      number: '6.3',
      title: 'Jak kontrolujeme modely',
      blocks: [
        {
          kind: 'table',
          caption: 'Tři úrovně kontroly',
          head: ['Kontrola', 'Co hlídá', 'Kdo / čím', 'Nález znamená'],
          rows: [
            ['<strong>Verifikace</strong> (syntaktická)', 'pravidla jazyka: dovolené generalizace, povinné závislosti, multiplicity', 'automaticky (OpenPonk: <em>Verify model</em>, červeně)', '<strong>chybu – vždy opravit</strong>'],
            ['<strong>Detekce antipatternů</strong> (sémantická)', 'podezřelé struktury, které připouští nežádoucí situace', 'automaticky (OpenPonk: <em>Detect anti-patterns</em>, žlutě)', 'podnět k prověření, nemusí být chyba'],
            ['<strong>Validace s doménou</strong>', 'zda model vystihuje zamýšlenou doménu (příklady i protipříklady)', '<strong>ručně</strong>, s doménovým expertem', 'nesoulad se zadáním'],
          ],
          sources: [
            { kind: 'slide', doc: 'P05', page: 18, quote: 'Nástroj nerozhodne, zda model vystihuje zamýšlenou doménu.' },
            { kind: 'slide', doc: 'P05', page: 20, quote: 'Všechny syntaktické chyby je nutno opravit!' },
            { kind: 'slide', doc: 'P05', page: 39, quote: 'sémantická kontrola, nálezy obarví elementy do žluta' },
            { kind: 'slide', doc: 'C06', page: 13, quote: 'Kontrolu souladu s doménou je vždy nutno provádět manuálně.' },
          ],
        },
        {
          kind: 'list',
          ordered: false,
          items: [
            '<strong>Syntaktické otázky:</strong> „Může být X podtypem Y?“ · „Je každá Phase součástí disjoint a complete generalization setu?“ · „Mají všechny role splněnou relační závislost?“',
            '<strong>Sémantické otázky:</strong> „Může být X v relaci Y sám se sebou?“ · „Má nadtyp phase alespoň jeden atribut, quality nebo mode?“ · „Nemíchá jeden generalization set (bez mixinu nahoře) rigidní a anti-rigidní podtypy?“',
          ],
          sources: [
            { kind: 'slide', doc: 'P05', page: 19, quote: 'Je každá Phase součástí disjoint a complete generalization setu?' },
            { kind: 'slide', doc: 'P05', page: 21, quote: 'Má nadtyp phase alespoň jeden atribut, quality nebo mode?' },
          ],
        },
        {
          kind: 'callout',
          type: 'past',
          title: 'Antipattern ≠ automaticky chyba',
          html:
            'Nález antipatternu je <strong>podnět k prověření</strong> konkrétního rizika: zjisti, jaké nežádoucí situace struktura připouští a jestli jsou v tvé doméně opravdu nepřípustné. Naopak model <em>bez</em> nálezů může pořád zachycovat špatně pochopené zadání. (Cvičení říká opatrněji, že výskyt „většinou znamená chybu“ – na testu ber verzi z přednášky.)',
          sources: [
            { kind: 'slide', doc: 'P05', page: 60, quote: 'Nález je podnět k prověření konkrétního rizika, nikoli automatický rozsudek.' },
            { kind: 'slide', doc: 'P05', page: 22, quote: 'Nález vybízí k prověření; sám o sobě nedokazuje chybu.' },
            { kind: 'slide', doc: 'C06', page: 15, quote: 'Výskyt anti-patternu většinou znamená chybu.' },
          ],
        },
        {
          kind: 'table',
          caption: 'Osm antipatternů z přednášky (OpenPonk jich umí 20, katalog na ontouml.readthedocs.io)',
          head: ['Zkratka', 'Celý název', 'Jedna věta'],
          rows: [
            ['BinOver', 'Binary relation between overlapping types', 'vztah, na jehož obou koncích může být tentýž jedinec'],
            ['DepPhase', 'Relationally dependent phase', 'phase s <span class="st">«mediation»</span> – má to být role'],
            ['FreeRole', 'Free role specialization', 'podrole bez vlastní definující mediation'],
            ['HetColl', 'Heterogeneous collective', 'collective s ≥ 2 různými typy členů'],
            ['MixRig', 'Mixin with the same rigidity', 'mixin, jehož podtypy mají všechny stejnou rigiditu'],
            ['MultDep', 'Multiple relational dependency', 'typ mediovaný ≥ 2 nesouvisejícími relátory'],
            ['RelRig', 'Relator mediating rigid types', 'relátor přímo mediuje rigidní typ – chybí role'],
            ['UndefPhase', 'Undefined phase partition', 'fáze, jejichž nadtyp nemá žádný atribut / quality / mode'],
          ],
          sources: [
            { kind: 'slide', doc: 'P05', page: 23 },
            { kind: 'slide', doc: 'P05', page: 22, quote: 'V OpenPonku implementováno celkem dvacet anti-patternů.' },
            { kind: 'web', label: 'OntoUML docs: Anti-patterns', url: AP + 'index.html' },
          ],
        },
        { kind: 'quiz', ids: ['ch06-05', 'ch06-06'] },
      ],
    },
    // -----------------------------------------------------------------------
    {
      id: 'sec-6-4',
      number: '6.4',
      title: 'Antipatterny vztahů a rolí: BinOver, RelRig, MultDep, FreeRole',
      blocks: [
        {
          kind: 'callout',
          type: 'definice',
          title: 'BinOver – Binary relation between overlapping types',
          html:
            '<strong>Vypadá:</strong> asociace mezi dvěma <em>překrývajícími se</em> typy – stejný typ na obou koncích, podtyp a nadtyp, nebo dvě role téhož kindu bez <code>{disjoint}</code>.<br><strong>Riziko:</strong> na obou stranách může být tentýž jedinec (dozorce hlídá sám sebe, člověk je rodičem sám sobě).<br><strong>Oprava:</strong> (a) udělej typy disjunktní generalization setem, (b) přidej OCL invariant (ireflexivita, asymetrie…), (c) změň stereotyp vztahu. Příbuzné: PartOver, RelOver, WholeOver.',
          sources: [
            { kind: 'slide', doc: 'P05', page: 24, quote: 'Overlapping typy = dva typy, které mohou být instancovány stejným individualem.' },
            { kind: 'web', label: 'OntoUML docs: BinOver', url: AP + 'BinOver/index.html' },
          ],
        },
        {
          kind: 'compare',
          title: 'BinOver: Guard guards Prisoner',
          items: [
            {
              label: 'Antipattern',
              verdict: 'bad',
              note: 'Guard i Prisoner jsou role téhož kindu a nejsou disjunktní – jedna osoba může hlídat sama sebe.',
              diagram: {
                classes: [
                  { id: 'p', name: 'Person', st: 'kind', x: 0.5, y: 0 },
                  { id: 'g', name: 'Guard', st: 'role', x: 0, y: 1, mark: 'focus' },
                  { id: 'pr', name: 'Prisoner', st: 'role', x: 1, y: 1, mark: 'focus' },
                ],
                gens: [{ general: 'p', specifics: ['g', 'pr'] }],
                assocs: [{ from: 'g', to: 'pr', name: 'guards', fromMult: '1', toMult: '1', mark: 'bad' }],
              },
            },
            {
              label: 'Oprava: disjunkce (nebo OCL)',
              verdict: 'good',
              note: '{disjoint} vylučuje, aby byl někdo zároveň dozorcem i vězněm. Pokud to doména dovoluje, místo toho OCL: nikdo nehlídá sám sebe.',
              diagram: {
                classes: [
                  { id: 'p', name: 'Person', st: 'kind', x: 0.5, y: 0 },
                  { id: 'g', name: 'Guard', st: 'role', x: 0, y: 1 },
                  { id: 'pr', name: 'Prisoner', st: 'role', x: 1, y: 1 },
                ],
                gens: [{ general: 'p', specifics: ['g', 'pr'], set: { disjoint: true }, mark: 'good' }],
                assocs: [{ from: 'g', to: 'pr', name: 'guards', fromMult: '1', toMult: '1' }],
              },
            },
          ],
          sources: [{ kind: 'slide', doc: 'P05', page: 24 }],
        },
        {
          kind: 'callout',
          type: 'definice',
          title: 'RelRig – Relator mediating rigid types',
          html:
            '<strong>Vypadá:</strong> <span class="st">«relator»</span> spojený <span class="st">«mediation»</span> přímo s rigidním typem (kind, subkind, category…).<br><strong>Riziko:</strong> mediation znamená vnější závislost – instance by „byla Restaurací jen díky objednávce“ a bez ní by zanikla.<br><strong>Oprava:</strong> většinou chybí <span class="st">«role»</span> (u non-sortálů <span class="st">«roleMixin»</span>) – vlož ji pod rigidní typ a mediation přesuň na ni. Jinak: rigidní typ je ve skutečnosti <span class="st">«mode»</span> relátoru.',
          sources: [
            { kind: 'slide', doc: 'P05', page: 35, quote: 'Většinou značí chybějící roli, případně rolemixin.' },
            { kind: 'slide', doc: 'P05', page: 35, quote: 'Může být též znakem toho, že rigidní typ má být stereotypován jako mode.' },
            { kind: 'web', label: 'OntoUML docs: RelRig', url: AP + 'RelRig/index.html' },
          ],
        },
        {
          kind: 'compare',
          title: 'RelRig: Food order',
          items: [
            {
              label: 'Antipattern',
              verdict: 'bad',
              diagram: {
                classes: [
                  { id: 'p', name: 'Person', st: 'kind', x: 0, y: 0 },
                  { id: 'c', name: 'Customer', st: 'role', x: 0, y: 1 },
                  { id: 'o', name: 'Food order', st: 'relator', x: 1, y: 1 },
                  { id: 'r', name: 'Restaurant', st: 'kind', x: 2, y: 1, mark: 'bad', note: 'Rigidní kind mediovaný relátorem.' },
                ],
                gens: [{ general: 'p', specifics: ['c'] }],
                assocs: [
                  { from: 'o', to: 'c', st: 'mediation', fromMult: '1..*', toMult: '1' },
                  { from: 'o', to: 'r', st: 'mediation', fromMult: '*', toMult: '1', mark: 'bad' },
                ],
              },
            },
            {
              label: 'Oprava: chybějící role',
              verdict: 'good',
              diagram: {
                classes: [
                  { id: 'p', name: 'Person', st: 'kind', x: 0, y: 0 },
                  { id: 'co', name: 'Company', st: 'kind', x: 2, y: 0 },
                  { id: 'c', name: 'Customer', st: 'role', x: 0, y: 1 },
                  { id: 'o', name: 'Food order', st: 'relator', x: 1, y: 1 },
                  { id: 'r', name: 'Restaurant', st: 'role', x: 2, y: 1, mark: 'good', note: 'Company je Restaurací, dokud přijímá objednávky.' },
                ],
                gens: [{ general: 'p', specifics: ['c'] }, { general: 'co', specifics: ['r'] }],
                assocs: [
                  { from: 'o', to: 'c', st: 'mediation', fromMult: '1..*', toMult: '1' },
                  { from: 'o', to: 'r', st: 'mediation', fromMult: '1..*', toMult: '1' },
                ],
              },
            },
          ],
          sources: [{ kind: 'slide', doc: 'P05', page: 35 }, { kind: 'slide', doc: 'P05', page: 36 }],
        },
        { kind: 'quiz', ids: ['ch06-07'] },
        {
          kind: 'callout',
          type: 'definice',
          title: 'MultDep – Multiple relational dependency',
          html:
            '<strong>Vypadá:</strong> jeden typ je mediován dvěma a více různými relátory, které nejsou nadtypem/podtypem jeden druhého.<br><strong>Riziko:</strong> redundance, přílišné zjednodušení nebo špatná granularita – auto by „bylo pronajaté“, jen když má zároveň platnou STK.<br><strong>Oprava:</strong> pro každou závislost samostatná role (případně uspořádaná hierarchie rolí), nebo formální vztah mezi relátory.',
          sources: [
            { kind: 'slide', doc: 'P05', page: 33, quote: 'propojen pomocí mediation s dvěma a více různými relatory' },
            { kind: 'slide', doc: 'P05', page: 33, quote: 'Velmi často důsledek redundance, přílišného zjednodušení, nebo špatné granularity' },
            { kind: 'web', label: 'OntoUML docs: MultDep', url: AP + 'MultDep/index.html' },
          ],
        },
        {
          kind: 'compare',
          title: 'MultDep: STK a nájemní smlouva',
          items: [
            {
              label: 'Antipattern',
              verdict: 'bad',
              diagram: {
                classes: [
                  { id: 'ca', name: 'Certification authority', st: 'kind', x: 0, y: 0 },
                  { id: 'car', name: 'Car', st: 'kind', x: 1, y: 0 },
                  { id: 'co', name: 'Company', st: 'kind', x: 2, y: 0 },
                  { id: 'mot', name: 'MOT', st: 'relator', x: 0, y: 1 },
                  { id: 'rc', name: 'Rented car', st: 'role', x: 1, y: 1, mark: 'bad', note: 'Jedna role závisí na dvou nesouvisejících relátorech.' },
                  { id: 'rent', name: 'Rental contract', st: 'relator', x: 2, y: 1 },
                ],
                gens: [{ general: 'car', specifics: ['rc'] }],
                assocs: [
                  { from: 'mot', to: 'ca', st: 'mediation', fromMult: '*', toMult: '1' },
                  { from: 'mot', to: 'rc', st: 'mediation', fromMult: '1', toMult: '1', mark: 'bad' },
                  { from: 'rent', to: 'rc', st: 'mediation', fromMult: '1', toMult: '1', mark: 'bad' },
                  { from: 'rent', to: 'co', st: 'mediation', fromMult: '1..*', toMult: '1' },
                ],
              },
            },
            {
              label: 'Oprava: role pro každou závislost',
              verdict: 'good',
              diagram: {
                classes: [
                  { id: 'ca', name: 'Certification authority', st: 'kind', x: 0, y: 0 },
                  { id: 'car', name: 'Car', st: 'kind', x: 1.5, y: 0 },
                  { id: 'co', name: 'Company', st: 'kind', x: 3, y: 0 },
                  { id: 'mot', name: 'MOT', st: 'relator', x: 0, y: 1 },
                  { id: 'op', name: 'Operational car', st: 'role', x: 1, y: 1, mark: 'good' },
                  { id: 'rc', name: 'Rented car', st: 'role', x: 2, y: 1, mark: 'good' },
                  { id: 'rent', name: 'Rental contract', st: 'relator', x: 3, y: 1 },
                ],
                gens: [{ general: 'car', specifics: ['op', 'rc'] }],
                assocs: [
                  { from: 'mot', to: 'ca', st: 'mediation', fromMult: '*', toMult: '1' },
                  { from: 'mot', to: 'op', st: 'mediation', fromMult: '1', toMult: '1' },
                  { from: 'rent', to: 'rc', st: 'mediation', fromMult: '1', toMult: '1' },
                  { from: 'rent', to: 'co', st: 'mediation', fromMult: '1..*', toMult: '1' },
                ],
              },
            },
          ],
          sources: [{ kind: 'slide', doc: 'P05', page: 33 }, { kind: 'slide', doc: 'P05', page: 34 }],
        },
        {
          kind: 'callout',
          type: 'definice',
          title: 'FreeRole – Free role specialization',
          html:
            'Relační závislost role je splněna, když (1) role sama má <span class="st">«mediation»</span>, (2) je přímým podtypem roleMixinu s mediation, nebo (3) je <strong>podtypem jiné role</strong>, která ji má splněnou.<br><strong>Vypadá:</strong> případ (3) – podrole bez vlastní mediation. Syntakticky je to v pořádku, ale <strong>není definováno, čím se Doctor stane X-ray operatorem</strong>.<br><strong>Oprava:</strong> přidej podrolu vlastní relátor (např. podtyp původního relátoru), nebo ji definuj odvozovacím pravidlem (OCL <code>derive</code>).',
          sources: [
            { kind: 'slide', doc: 'P05', page: 27, quote: 'Role je podtypem jiné role, která má splněnou relační závislost' },
            { kind: 'web', label: 'OntoUML docs: FreeRole', url: AP + 'FreeRole/index.html' },
          ],
        },
        {
          kind: 'compare',
          title: 'FreeRole: rentgenový operátor',
          items: [
            {
              label: 'Antipattern',
              verdict: 'bad',
              diagram: {
                classes: [
                  { id: 'p', name: 'Person', st: 'kind', x: 1, y: 0 },
                  { id: 'pat', name: 'Patient', st: 'role', x: 0, y: 1 },
                  { id: 'mc', name: 'Medical checkup', st: 'relator', x: 1, y: 1 },
                  { id: 'doc', name: 'Doctor', st: 'role', x: 2, y: 1 },
                  { id: 'xo', name: 'X-ray operator', st: 'role', x: 2, y: 2, mark: 'bad', note: 'Volná role: nic neříká, kdy se Doctor stane X-ray operatorem.' },
                ],
                gens: [{ general: 'p', specifics: ['pat', 'doc'] }, { general: 'doc', specifics: ['xo'], mark: 'bad' }],
                assocs: [
                  { from: 'mc', to: 'pat', st: 'mediation', fromMult: '1..*', toMult: '1' },
                  { from: 'mc', to: 'doc', st: 'mediation', fromMult: '1..*', toMult: '1' },
                ],
              },
            },
            {
              label: 'Oprava: vlastní relátor podrole',
              verdict: 'good',
              diagram: {
                classes: [
                  { id: 'p', name: 'Person', st: 'kind', x: 1, y: 0 },
                  { id: 'pat', name: 'Patient', st: 'role', x: 0, y: 1 },
                  { id: 'mc', name: 'Medical checkup', st: 'relator', x: 1, y: 1 },
                  { id: 'doc', name: 'Doctor', st: 'role', x: 2, y: 1 },
                  { id: 'xc', name: 'X-ray checkup', st: 'subkind', x: 1, y: 2, mark: 'good', note: 'Subkind relátoru Medical checkup.' },
                  { id: 'xo', name: 'X-ray operator', st: 'role', x: 2, y: 2 },
                ],
                gens: [{ general: 'p', specifics: ['pat', 'doc'] }, { general: 'doc', specifics: ['xo'] }, { general: 'mc', specifics: ['xc'] }],
                assocs: [
                  { from: 'mc', to: 'pat', st: 'mediation', fromMult: '1..*', toMult: '1' },
                  { from: 'mc', to: 'doc', st: 'mediation', fromMult: '1..*', toMult: '1' },
                  { from: 'xc', to: 'xo', st: 'mediation', fromMult: '1..*', toMult: '1', mark: 'good' },
                ],
              },
            },
          ],
          sources: [{ kind: 'slide', doc: 'P05', page: 27 }, { kind: 'slide', doc: 'P05', page: 28 }],
        },
        { kind: 'quiz', ids: ['ch06-08', 'ch06-09'] },
      ],
    },
    // -----------------------------------------------------------------------
    {
      id: 'sec-6-5',
      number: '6.5',
      title: 'Antipatterny fází, mixinů a kolektivů: DepPhase, UndefPhase, MixRig, HetColl',
      blocks: [
        {
          kind: 'callout',
          type: 'definice',
          title: 'DepPhase – Relationally dependent phase',
          html:
            '<strong>Vypadá:</strong> <span class="st">«phase»</span> je koncem jedné nebo více <span class="st">«mediation»</span>.<br><strong>Proč špatně:</strong> phase = změna <em>vnitřního</em> stavu, role = existence <em>vnější</em> asociace. Phase s mediation míchá obě metakategorie.<br><strong>Oprava:</strong> zaveď <span class="st">«role»</span> (např. Patient) a mediation přesuň na ni; fáze zůstanou čistě intrinsické.',
          sources: [
            { kind: 'slide', doc: 'P05', page: 25, quote: 'Phase, která je součástí jedné nebo více asociací typu mediation.' },
            { kind: 'web', label: 'OntoUML docs: DepPhase', url: AP + 'DepPhase/index.html' },
          ],
        },
        {
          kind: 'compare',
          title: 'DepPhase: karta pacienta',
          items: [
            {
              label: 'Antipattern',
              verdict: 'bad',
              diagram: {
                classes: [
                  { id: 'p', name: 'Person', st: 'kind', x: 1, y: 0 },
                  { id: 'h', name: 'Healthy patient', st: 'phase', x: 0, y: 1, mark: 'bad' },
                  { id: 'i', name: 'Ill patient', st: 'phase', x: 1, y: 1, mark: 'bad' },
                  { id: 'd', name: 'Doctor', st: 'role', x: 2, y: 1 },
                  { id: 'card', name: 'Patient card', st: 'relator', x: 1, y: 2 },
                ],
                gens: [{ general: 'p', specifics: ['h', 'i'], set: { disjoint: true, complete: true } }, { general: 'p', specifics: ['d'] }],
                assocs: [
                  { from: 'card', to: 'h', st: 'mediation', fromMult: '1', toMult: '0..1', mark: 'bad' },
                  { from: 'card', to: 'i', st: 'mediation', fromMult: '1', toMult: '0..1', mark: 'bad' },
                  { from: 'card', to: 'd', st: 'mediation', fromMult: '*', toMult: '1' },
                ],
              },
            },
            {
              label: 'Oprava: role Patient',
              verdict: 'good',
              diagram: {
                classes: [
                  { id: 'p', name: 'Person', st: 'kind', x: 1.5, y: 0 },
                  { id: 'h', name: 'Healthy', st: 'phase', x: 0, y: 1 },
                  { id: 'i', name: 'Ill', st: 'phase', x: 1, y: 1 },
                  { id: 'pat', name: 'Patient', st: 'role', x: 2, y: 1, mark: 'good' },
                  { id: 'd', name: 'Doctor', st: 'role', x: 3, y: 1 },
                  { id: 'card', name: 'Patient card', st: 'relator', x: 2.5, y: 2 },
                ],
                gens: [{ general: 'p', specifics: ['h', 'i'], set: { disjoint: true, complete: true } }, { general: 'p', specifics: ['pat', 'd'] }],
                assocs: [
                  { from: 'card', to: 'pat', st: 'mediation', fromMult: '1', toMult: '1', mark: 'good' },
                  { from: 'card', to: 'd', st: 'mediation', fromMult: '*', toMult: '1' },
                ],
              },
            },
          ],
          sources: [{ kind: 'slide', doc: 'P05', page: 25 }, { kind: 'slide', doc: 'P05', page: 26 }],
        },
        {
          kind: 'callout',
          type: 'definice',
          title: 'UndefPhase – Undefined phase partition',
          html:
            '<strong>Vypadá:</strong> partition fází, jejichž společný nadtyp nemá (ani nedědí) žádný atribut, <span class="st">«quality»</span> ani <span class="st">«mode»</span>.<br><strong>Proč špatně:</strong> fáze se mění podle vnitřní vlastnosti – když nadtyp žádnou nemá, podle čeho se fáze určí?<br><strong>Oprava:</strong> přidej definující vlastnost (Person.birthDate → Baby/Child/…/Senior), případně quality/mode, které se ve fázi objeví; pokud fázi určuje vztah, změň fáze na role.',
          sources: [
            { kind: 'slide', doc: 'P05', page: 37, quote: 'Množina entit stereotypovaných jako phase, jejichž společný nadtyp nemá žádný' },
            { kind: 'slide', doc: 'P05', page: 37, quote: 'Tyto vlastnosti lze přiřadit přímo k jednotlivým phase.' },
            { kind: 'web', label: 'OntoUML docs: UndefPhase', url: AP + 'UndefPhase/index.html' },
          ],
        },
        {
          kind: 'compare',
          title: 'UndefPhase: věkové fáze (zkráceno na 3 z 5)',
          items: [
            {
              label: 'Antipattern',
              verdict: 'bad',
              diagram: {
                classes: [
                  { id: 'p', name: 'Person', st: 'kind', x: 1, y: 0, mark: 'bad', note: 'Žádný atribut – fáze nemají definující vlastnost.' },
                  { id: 'c', name: 'Child', st: 'phase', x: 0, y: 1 },
                  { id: 't', name: 'Teenager', st: 'phase', x: 1, y: 1 },
                  { id: 'a', name: 'Adult', st: 'phase', x: 2, y: 1 },
                ],
                gens: [{ general: 'p', specifics: ['c', 't', 'a'], set: { disjoint: true, complete: true } }],
              },
            },
            {
              label: 'Oprava: definující atribut',
              verdict: 'good',
              diagram: {
                classes: [
                  { id: 'p', name: 'Person', st: 'kind', x: 1, y: 0, attrs: ['birthDate: Date'], mark: 'good' },
                  { id: 'c', name: 'Child', st: 'phase', x: 0, y: 1 },
                  { id: 't', name: 'Teenager', st: 'phase', x: 1, y: 1 },
                  { id: 'a', name: 'Adult', st: 'phase', x: 2, y: 1 },
                ],
                gens: [{ general: 'p', specifics: ['c', 't', 'a'], set: { disjoint: true, complete: true } }],
              },
            },
          ],
          sources: [{ kind: 'slide', doc: 'P05', page: 37 }, { kind: 'slide', doc: 'P05', page: 38 }],
        },
        { kind: 'quiz', ids: ['ch06-10'] },
        {
          kind: 'callout',
          type: 'definice',
          title: 'MixRig – Mixin with the same rigidity',
          html:
            '<strong>Vypadá:</strong> <span class="st">«mixin»</span>, jehož podtypy jsou <em>všechny</em> rigidní, nebo <em>všechny</em> anti-rigidní.<br><strong>Proč špatně:</strong> mixin je semi-rigidní – musí mít aspoň dva podtypy s různou rigiditou, jinak je to ve skutečnosti něco jiného.<br><strong>Oprava:</strong> samé rigidní → změň na <span class="st">«category»</span>; samé anti-rigidní → <span class="st">«roleMixin»</span>/<span class="st">«phaseMixin»</span>; nebo oprav stereotypy podtypů (Stolen car je spíš role než subkind).',
          sources: [
            { kind: 'slide', doc: 'P05', page: 31, quote: 'Mixin musí mít minimálně dva podtypy s různou rigiditou.' },
            { kind: 'web', label: 'OntoUML docs: MixRig', url: AP + 'MixRig/index.html' },
          ],
        },
        {
          kind: 'compare',
          title: 'MixRig: nelegální zboží',
          items: [
            {
              label: 'Antipattern',
              verdict: 'bad',
              note: 'Drugs (kind) i Stolen (subkind) jsou rigidní – mixin nemá žádný anti-rigidní podtyp.',
              diagram: {
                classes: [
                  { id: 'ig', name: 'Illegal goods', st: 'mixin', x: 0.5, y: 0, abstract: true, mark: 'bad' },
                  { id: 'car', name: 'Car', st: 'kind', x: 2, y: 0 },
                  { id: 'dr', name: 'Drugs', st: 'kind', x: 0, y: 1 },
                  { id: 'st', name: 'Stolen', st: 'subkind', x: 1, y: 1, mark: 'bad', note: 'Kradené auto může být vráceno – není to rigidní vlastnost.' },
                  { id: 'lo', name: 'Legally owned', st: 'subkind', x: 3, y: 1 },
                ],
                gens: [
                  { general: 'ig', specifics: ['dr', 'st'] },
                  { general: 'car', specifics: ['st', 'lo'], set: { disjoint: true, complete: true } },
                ],
              },
            },
            {
              label: 'Oprava: anti-rigidní podtypy',
              verdict: 'good',
              diagram: {
                classes: [
                  { id: 'ig', name: 'Illegal goods', st: 'mixin', x: 0.5, y: 0, abstract: true },
                  { id: 'car', name: 'Car', st: 'kind', x: 2, y: 0 },
                  { id: 'dr', name: 'Drugs', st: 'kind', x: 0, y: 1 },
                  { id: 'st', name: 'Stolen', st: 'role', x: 1, y: 1, mark: 'good' },
                  { id: 'lo', name: 'Legally owned', st: 'role', x: 3, y: 1, mark: 'good' },
                ],
                gens: [
                  { general: 'ig', specifics: ['dr', 'st'], set: { disjoint: true } },
                  { general: 'car', specifics: ['st', 'lo'], set: { disjoint: true, complete: true } },
                ],
              },
            },
          ],
          sources: [{ kind: 'slide', doc: 'P05', page: 31 }, { kind: 'slide', doc: 'P05', page: 32 }],
        },
        {
          kind: 'callout',
          type: 'definice',
          title: 'HetColl – Heterogeneous collective',
          html:
            '<strong>Vypadá:</strong> <span class="st">«collective»</span> se dvěma či více <em>různými</em> typy částí přes <span class="st">«memberOf»</span>.<br><strong>Proč špatně:</strong> v kolektivu jsou všechny části rovnocenné; když mají části různé role, je to <strong>funkční celek</strong> (<span class="st">«kind»</span> + <span class="st">«componentOf»</span>). Opačný antipattern je HomoFunc (funkční celek se stejnorodými částmi).<br><strong>Oprava:</strong> (a) přestereotypuj na funkční celek s <span class="st">«componentOf»</span>, nebo (b) nech collective a jednotné členy zaveď přes společný <span class="st">«roleMixin»</span> (Musician).',
          sources: [
            { kind: 'slide', doc: 'P05', page: 29, quote: 'Collective s dvěma či více rozdílnými typy částí.' },
            { kind: 'slide', doc: 'P05', page: 30 },
            { kind: 'web', label: 'OntoUML docs: HetColl', url: AP + 'HetColl/index.html' },
          ],
        },
        {
          kind: 'compare',
          title: 'HetColl: orchestr',
          items: [
            {
              label: 'Antipattern',
              verdict: 'bad',
              diagram: {
                classes: [
                  { id: 'o', name: 'Orchestra', st: 'collective', x: 1, y: 0, mark: 'bad' },
                  { id: 'c', name: 'Conductor', st: 'kind', x: 0, y: 1 },
                  { id: 's', name: 'Soloist', st: 'kind', x: 1, y: 1 },
                  { id: 'v', name: 'Violinist', st: 'kind', x: 2, y: 1 },
                ],
                assocs: [
                  { from: 'o', to: 'c', st: 'memberOf', whole: 'from', fromMult: '1', toMult: '1', mark: 'bad' },
                  { from: 'o', to: 's', st: 'memberOf', whole: 'from', shareable: true, fromMult: '1..*', toMult: '*', mark: 'bad' },
                  { from: 'o', to: 'v', st: 'memberOf', whole: 'from', fromMult: '1', toMult: '2..*', mark: 'bad' },
                ],
              },
            },
            {
              label: 'Oprava: funkční celek',
              verdict: 'good',
              note: 'Orchestr jako kind s komponentami; dirigent, sólista a houslista jsou role osoby.',
              diagram: {
                classes: [
                  { id: 'p', name: 'Person', st: 'kind', x: 1, y: 0 },
                  { id: 'c', name: 'Conductor', st: 'role', x: 0, y: 1 },
                  { id: 's', name: 'Soloist', st: 'role', x: 1, y: 1 },
                  { id: 'v', name: 'Violinist', st: 'role', x: 2, y: 1 },
                  { id: 'o', name: 'Orchestra', st: 'kind', x: 1, y: 2, mark: 'good' },
                ],
                gens: [{ general: 'p', specifics: ['c', 's', 'v'] }],
                assocs: [
                  { from: 'o', to: 'c', st: 'componentOf', whole: 'from', fromMult: '1', toMult: '1' },
                  { from: 'o', to: 's', st: 'componentOf', whole: 'from', shareable: true, fromMult: '1..*', toMult: '*' },
                  { from: 'o', to: 'v', st: 'componentOf', whole: 'from', fromMult: '1', toMult: '2..*' },
                ],
              },
            },
          ],
          sources: [{ kind: 'slide', doc: 'P05', page: 29 }, { kind: 'slide', doc: 'P05', page: 30 }],
        },
        { kind: 'quiz', ids: ['ch06-11', 'ch06-12'] },
      ],
    },
    // -----------------------------------------------------------------------
    {
      id: 'sec-6-6',
      number: '6.6',
      title: 'Vyřešený příklad: kontrola modelu e-shopu',
      blocks: [
        {
          kind: 'p',
          html:
            'Úkol ze cvičení 6: dostaneš hotový model e-shopu, máš ho <strong>verifikovat i validovat</strong> a odstranit problémy. Antipattern smíš v modelu nechat, ale musíš to zdůvodnit. Doména: zákazník (fyzická i právnická osoba) vytváří objednávku, kterou přebírá asistent expedice; objednávka má řádky, každý s právě jedním produktem; po zaplacení je objednávka <em>zaplacená</em> a kurýr ji doručí proti podpisu potvrzení o doručení.',
          sources: [
            { kind: 'slide', doc: 'C06-eshop', page: 1, quote: 'Zákazník vytváří v systému objednávku, kterou přebírá asistent' },
            { kind: 'slide', doc: 'C06-eshop', page: 1, quote: 'Po zaplacení se objednávka přesune do stavu' },
            { kind: 'slide', doc: 'C06-eshop', page: 1, quote: 'je potřeba vaše rozhodnutí zdůvodnit' },
          ],
        },
        {
          kind: 'compare',
          title: 'Výřez modelu: před a po kontrole',
          items: [
            {
              label: 'Zadaný model (výřez)',
              verdict: 'bad',
              note: 'Order je kind spojený s rolemi obyčejnými asociacemi; fáze objednávky nemají definující atribut; relátor Delivery receipt mediuje fázi.',
              diagram: {
                classes: [
                  { id: 'cu', name: 'Customer', st: 'roleMixin', x: 0, y: 0, abstract: true },
                  { id: 'o', name: 'Order', st: 'kind', x: 1, y: 0, mark: 'bad', note: 'Bez atributů → UndefPhase. Ve skutečnosti spojuje zákazníka a asistenta.' },
                  { id: 'ea', name: 'Expedition assistant', st: 'role', x: 2, y: 0, mark: 'bad', note: 'Podrole Employee bez vlastní mediation → FreeRole.' },
                  { id: 'up', name: 'Unpaid', st: 'phase', x: 0, y: 1 },
                  { id: 'pd', name: 'Paid', st: 'phase', x: 1, y: 1 },
                  { id: 'dl', name: 'Delivered', st: 'phase', x: 2, y: 1, mark: 'bad', note: 'Phase s mediation → DepPhase.' },
                  { id: 'co', name: 'Courier', st: 'role', x: 3, y: 1 },
                  { id: 'dr', name: 'Delivery receipt', st: 'relator', x: 3, y: 2 },
                ],
                gens: [{ general: 'o', specifics: ['up', 'pd', 'dl'], set: { disjoint: true, complete: true } }],
                assocs: [
                  { from: 'cu', to: 'o', st: 'none', fromMult: '1', toMult: '1..*', mark: 'bad' },
                  { from: 'ea', to: 'o', st: 'none', toMult: '0..*', mark: 'bad' },
                  { from: 'dr', to: 'dl', st: 'mediation', mark: 'bad' },
                  { from: 'dr', to: 'co', st: 'mediation', fromMult: '1..*' },
                ],
              },
            },
            {
              label: 'Po opravě (jedno z možných řešení)',
              verdict: 'good',
              note: 'Order jako relátor mezi zákazníkem a asistentem; fáze definuje atribut; potvrzení mediuje objednávku, ne fázi; všude multiplicity.',
              diagram: {
                classes: [
                  { id: 'co', name: 'Courier', st: 'role', x: 0, y: 0 },
                  { id: 'dr', name: 'Delivery receipt', st: 'relator', x: 1, y: 0 },
                  { id: 'cu', name: 'Customer', st: 'roleMixin', x: 0, y: 1, abstract: true },
                  { id: 'o', name: 'Order', st: 'relator', x: 1, y: 1, attrs: ['paidAt: Date [0..1]', 'deliveredAt: Date [0..1]'], mark: 'good' },
                  { id: 'ea', name: 'Expedition assistant', st: 'role', x: 2, y: 1 },
                  { id: 'up', name: 'Unpaid', st: 'phase', x: 0, y: 2 },
                  { id: 'pd', name: 'Paid', st: 'phase', x: 1, y: 2 },
                  { id: 'dl', name: 'Delivered', st: 'phase', x: 2, y: 2 },
                ],
                gens: [{ general: 'o', specifics: ['up', 'pd', 'dl'], set: { disjoint: true, complete: true } }],
                assocs: [
                  { from: 'dr', to: 'co', st: 'mediation', fromMult: '1..*', toMult: '1', mark: 'good' },
                  { from: 'dr', to: 'o', st: 'mediation', fromMult: '0..1', toMult: '1', mark: 'good' },
                  { from: 'o', to: 'cu', st: 'mediation', fromMult: '1..*', toMult: '1', mark: 'good' },
                  { from: 'o', to: 'ea', st: 'mediation', fromMult: '1..*', toMult: '1', mark: 'good' },
                ],
              },
            },
          ],
          sources: [{ kind: 'slide', doc: 'C06-eshop', page: 1 }],
        },
        {
          kind: 'table',
          caption: 'Nálezy v modelu a co s nimi',
          head: ['Nález', 'Typ', 'Oprava'],
          rows: [
            ['asociace bez multiplicit (Employee – Employment contract, Delivery receipt – Delivered…)', 'verifikace', 'doplnit – multiplicita je u všech asociací povinná'],
            ['Order «kind» spojený s Customer a Expedition assistant obyčejnou asociací', 'validace', 'Order je ve skutečnosti <span class="st">«relator»</span> (zakládá vztah zákazník – asistent) → <span class="st">«mediation»</span>'],
            ['Expedition assistant nemá vlastní mediation (jen nadrole Employee)', 'FreeRole', 'mediation z relátoru Order'],
            ['fáze Unpaid / Paid / Delivered, ale Order nemá atribut', 'UndefPhase', 'definující atributy (paidAt, deliveredAt)'],
            ['Delivery receipt mediuje fázi Delivered', 'DepPhase', 'mediovat Order (fáze zůstane intrinsická)'],
            ['Product «componentOf» Order line', 'validace', 'zvážit, zda je produkt opravdu součástí řádku – spíš je řádkem jen odkazován'],
          ],
          sources: [
            { kind: 'slide', doc: 'C06', page: 3, quote: 'Multiplicita je u všech asociací povinná!' },
            { kind: 'slide', doc: 'C06-eshop', page: 1, quote: 'Objednávka se skládá z řádků a každý řádek obsahuje právě jeden produkt.' },
          ],
        },
        {
          kind: 'callout',
          type: 'shrnuti',
          title: 'Postup na cvičení i na zkoušce',
          html:
            '<ol><li><strong>Verify model</strong> – opravit všechno červené.</li><li><strong>Detect anti-patterns</strong> – každý žlutý nález prověřit: jakou nežádoucí situaci model připouští?</li><li>Projít text zadání větu po větě (validace) – sedí stereotypy na skutečný význam?</li><li>Co nechávám, zdůvodním (např. „oprava by vyžadovala OCL pravidlo“).</li></ol>',
          sources: [{ kind: 'slide', doc: 'C06-eshop', page: 1, quote: 'proveďte kontrolu modelu (verifikace i validace) a odstraňte nalezené problémy' }],
        },
        { kind: 'quiz', ids: ['ch06-13', 'ch06-14'] },
      ],
    },
  ],
}
