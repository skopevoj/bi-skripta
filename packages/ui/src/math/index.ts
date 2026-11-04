// @skripta/ui/math — KaTeX. `katex` je volitelný peer: tuhle podcestu importuj jen tam, kde je katex nainstalovaný.
// KaTeX CSS importuje aplikace sama (jednou, ve vstupním souboru): `import 'katex/dist/katex.min.css'`.
// Drobné styly (.mx-*) jsou v `@skripta/ui/styles.css` (math.css) — bez závislosti na katexu.
export { Tex, Tex as Math, MathHTML, type TexProps, type MathHTMLProps } from './Math'
export { renderTex, renderMathInHtml, tokenizeMath, createTermWrapper, type TexOptions, type MathHtmlOptions, type TermEntry } from './render'
