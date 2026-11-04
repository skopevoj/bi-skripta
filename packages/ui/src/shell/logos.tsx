'use client'
import { useId, type ReactNode } from 'react'

// Course logos for the top bar and the course switcher. Colours are fixed brand colours
// (with a lighter variant for dark mode via --logo-* custom properties in shell.css).

/** BI-KOM: the OntoUML symbol without the wordmark (ontouml.org), redrawn as SVG. */
function OntoUmlLogo() {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '')
  // A stadium ring cut by one diagonal: top half blue, bottom half orange.
  const ring = <rect x="59.5" y="19.5" width="81" height="161" rx="40.5" fill="none" strokeWidth="31" />
  return (
    <svg viewBox="40 0 120 200" aria-hidden="true">
      <defs>
        <clipPath id={`${id}t`}><polygon points="0,0 200,0 200,117 0,85" /></clipPath>
        <clipPath id={`${id}b`}><polygon points="0,93 200,125 200,200 0,200" /></clipPath>
      </defs>
      <g clipPath={`url(#${id}t)`} stroke="var(--logo-onto-blue, #2c4b9b)">{ring}</g>
      <g clipPath={`url(#${id}b)`} stroke="var(--logo-onto-orange, #f26b22)">{ring}</g>
    </svg>
  )
}

/** BI-KAB: a padlock — the everyday symbol of encryption (as in the browser's address bar). */
function PadlockLogo() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <path d="M10 14.5V10a6 6 0 0 1 12 0v4.5" fill="none" stroke="var(--logo-kab-steel, #7b8494)" strokeWidth="3.2" />
      <rect x="5.5" y="13" width="21" height="17" rx="3.5" fill="var(--logo-kab-gold, #f2b200)" />
      <path d="M5.5 25h21v1.5a3.5 3.5 0 0 1-3.5 3.5H9a3.5 3.5 0 0 1-3.5-3.5Z" fill="#000" fillOpacity=".12" />
      <circle cx="16" cy="20" r="2.6" fill="#5c3d00" />
      <rect x="14.8" y="20.5" width="2.4" height="5" rx="1.2" fill="#5c3d00" />
    </svg>
  )
}

/** BI-OOP: the official Scala logo (github.com/scala/scala-lang, resources/img/scala-logo-large.svg), unmodified paths. */
function ScalaLogo() {
  return (
    <svg viewBox="0 0 1324 1495" fill="none" aria-hidden="true">
      <path fillRule="evenodd" clipRule="evenodd" d="M398.125 408.215C400.076 426.904 466.312 498.272 571.569 593.547C678.466 685.981 750.951 849.113 864.356 877.191C941.086 896.146 1110.21 767.958 1124.73 742.803L1126.22 740.22C1136.36 722.658 1131.33 700.952 1115.73 676.313C1051.1 576.529 1043.7 549.256 1004.32 538.983C799.746 485.819 502.597 281.064 398.125 408.215Z" fill="black" fillOpacity="0.6" />
      <path fillRule="evenodd" clipRule="evenodd" d="M199.567 752.125C201.399 771.021 267.754 842.182 372.981 937.509C493.145 1039.53 563.858 1186.76 677.345 1214.82C754.075 1233.77 911.619 1111.92 926.173 1086.71L927.604 1084.23C937.714 1066.72 932.713 1044.96 917.087 1020.38C868.62 942.808 799.861 848.495 760.526 838.251C555.705 784.805 313.268 659.09 199.567 752.125Z" fill="black" fillOpacity="0.6" />
      <path fillRule="evenodd" clipRule="evenodd" d="M1153.53 389.453C963.917 342.585 690.815 220.241 551.919 140.049L398.781 405.29C398.299 406.228 398.141 407.299 398.331 408.336C493.116 463.06 803.627 601.011 1008.21 654.389C1043.53 664.329 1079.51 671.731 1115.88 676.537C1143.08 679.292 1162.93 677.117 1169.07 666.476L1323.52 398.962C1308.76 424.05 1230.23 408.46 1153.53 389.453Z" fill="#C02313" />
      <path fillRule="evenodd" clipRule="evenodd" d="M954.942 733.414C841.485 705.307 698.185 650.396 571.569 593.548C486.557 555.417 409.081 516.403 353.243 484.165L200.225 749.2C199.743 750.137 199.584 751.209 199.775 752.246C294.56 806.97 605.071 944.92 809.626 998.35C844.948 1008.26 880.928 1015.66 917.295 1020.5C944.523 1023.2 964.344 1021.08 970.488 1010.44L1124.94 742.923C1110.21 767.959 1031.67 752.369 954.942 733.414Z" fill="#C02313" />
      <path fillRule="evenodd" clipRule="evenodd" d="M756.236 1077.58C642.779 1049.48 499.509 994.513 372.862 937.717C287.748 899.526 210.168 860.452 154.33 828.214L0.000216156 1095.52C93.8033 1149.68 405.663 1288.75 610.833 1342.19C686.449 1361.88 758.9 1376.44 771.724 1354.23L926.173 1086.71C911.501 1112.13 833.085 1096.33 756.236 1077.58Z" fill="#C02313" />
    </svg>
  )
}

const LOGOS: Record<string, () => ReactNode> = {
  'bi-kom': OntoUmlLogo,
  'bi-kab': PadlockLogo,
  'bi-oop': ScalaLogo,
}

/** Logo of a course from `COURSES` (falls back to the accent square). */
export function CourseLogo({ id }: { id: string }) {
  const L = LOGOS[id]
  return <span className="sk-clogo" aria-hidden="true">{L ? <L /> : <span className="sk-logo" />}</span>
}
