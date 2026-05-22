import { svg } from './Figure'

// Two CA hierarchies side-by-side, joined at the top by a bidirectional
// cross-certification link. Each tree has a root CA, two sub-CAs and a
// couple of end-entity leaves. Edges are plain lines (tree edges, no
// arrowheads); the cross-certification arrow is dashed and double-headed.
export function CertTree() {
  const W = 720
  const H = 360

  // tree centres
  const cx1 = 180
  const cx2 = 540

  // row Y positions
  const yRoot = 70
  const ySub = 170
  const yLeaf = 270

  // box sizes
  const rootW = 110
  const rootH = 38
  const subW = 96
  const subH = 32
  const leafW = 84
  const leafH = 26

  // horizontal spread of sub-CAs around their parent
  const subDx = 80
  // horizontal offset of leaves relative to their sub-CA
  const leafDx = 44

  // ------- coordinates per tree -------
  type Coords = {
    rootX: number
    subAX: number
    subBX: number
    leafAX: number
    leafBX: number
    leafCX: number
    leafDX: number
  }
  const t1: Coords = {
    rootX: cx1,
    subAX: cx1 - subDx,
    subBX: cx1 + subDx,
    leafAX: cx1 - subDx - leafDx / 2,
    leafBX: cx1 - subDx + leafDx / 2,
    leafCX: cx1 + subDx - leafDx / 2,
    leafDX: cx1 + subDx + leafDx / 2,
  }
  const t2: Coords = {
    rootX: cx2,
    subAX: cx2 - subDx,
    subBX: cx2 + subDx,
    leafAX: cx2 - subDx - leafDx / 2,
    leafBX: cx2 - subDx + leafDx / 2,
    leafCX: cx2 + subDx - leafDx / 2,
    leafDX: cx2 + subDx + leafDx / 2,
  }

  // helper for centring text vertically in a box
  const cy = (y: number, h: number) => y + h / 2 + 4

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      style={{ maxWidth: 720 }}
      fontFamily="Inter, system-ui, sans-serif"
      fontSize="13"
    >
      {/* ===== cross-certification at the top ===== */}
      {/* label (small caps) */}
      <text
        x={W / 2}
        y={yRoot - 36}
        textAnchor="middle"
        fill={svg.textFaint}
        fontSize="11"
        letterSpacing="2"
      >
        KŘÍŽOVÁ CERTIFIKACE
      </text>
      <text
        x={W / 2}
        y={yRoot - 20}
        textAnchor="middle"
        fill={svg.textFaint}
        fontStyle="italic"
        fontSize="11"
      >
        (obousměrná)
      </text>
      {/* dashed double-headed arrow between the two roots */}
      <line
        x1={t1.rootX + rootW / 2 + 8}
        y1={yRoot + rootH / 2}
        x2={t2.rootX - rootW / 2 - 8}
        y2={yRoot + rootH / 2}
        stroke={svg.stroke}
        strokeWidth="1.2"
        strokeDasharray="5 4"
      />
      {/* left arrowhead */}
      <polygon
        points={`${t1.rootX + rootW / 2 + 8},${yRoot + rootH / 2} ${t1.rootX + rootW / 2 + 16},${yRoot + rootH / 2 - 5} ${t1.rootX + rootW / 2 + 16},${yRoot + rootH / 2 + 5}`}
        fill={svg.stroke}
      />
      {/* right arrowhead */}
      <polygon
        points={`${t2.rootX - rootW / 2 - 8},${yRoot + rootH / 2} ${t2.rootX - rootW / 2 - 16},${yRoot + rootH / 2 - 5} ${t2.rootX - rootW / 2 - 16},${yRoot + rootH / 2 + 5}`}
        fill={svg.stroke}
      />

      {/* ===== render both trees ===== */}
      {[t1, t2].map((c, idx) => {
        const rootLabel = idx === 0 ? 'CA₁ (kořen)' : 'CA₂ (kořen)'
        const subALabel = idx === 0 ? 'Sub-CA₁ₐ' : 'Sub-CA₂ₐ'
        const subBLabel = idx === 0 ? 'Sub-CA₁ᵦ' : 'Sub-CA₂ᵦ'
        const leaves =
          idx === 0
            ? ['uživatel A', 'uživatel B', 'uživatel C', 'uživatel D']
            : ['uživatel E', 'uživatel F', 'uživatel G', 'uživatel H']

        return (
          <g key={idx}>
            {/* edges: root → subs */}
            <line
              x1={c.rootX}
              y1={yRoot + rootH}
              x2={c.subAX}
              y2={ySub}
              stroke={svg.stroke}
              strokeWidth="1.2"
            />
            <line
              x1={c.rootX}
              y1={yRoot + rootH}
              x2={c.subBX}
              y2={ySub}
              stroke={svg.stroke}
              strokeWidth="1.2"
            />

            {/* edges: subA → leafA, leafB */}
            <line
              x1={c.subAX}
              y1={ySub + subH}
              x2={c.leafAX}
              y2={yLeaf}
              stroke={svg.stroke}
              strokeWidth="1.2"
            />
            <line
              x1={c.subAX}
              y1={ySub + subH}
              x2={c.leafBX}
              y2={yLeaf}
              stroke={svg.stroke}
              strokeWidth="1.2"
            />
            {/* edges: subB → leafC, leafD */}
            <line
              x1={c.subBX}
              y1={ySub + subH}
              x2={c.leafCX}
              y2={yLeaf}
              stroke={svg.stroke}
              strokeWidth="1.2"
            />
            <line
              x1={c.subBX}
              y1={ySub + subH}
              x2={c.leafDX}
              y2={yLeaf}
              stroke={svg.stroke}
              strokeWidth="1.2"
            />

            {/* root box */}
            <rect
              x={c.rootX - rootW / 2}
              y={yRoot}
              width={rootW}
              height={rootH}
              rx="6"
              fill={svg.fillBoxAlt}
              stroke={svg.stroke}
              strokeWidth="1.2"
            />
            <text
              x={c.rootX}
              y={cy(yRoot, rootH)}
              textAnchor="middle"
              fill={svg.text}
              fontStyle="italic"
            >
              {rootLabel}
            </text>

            {/* sub-CA A */}
            <rect
              x={c.subAX - subW / 2}
              y={ySub}
              width={subW}
              height={subH}
              rx="4"
              fill={svg.fillBox}
              stroke={svg.stroke}
              strokeWidth="1.2"
            />
            <text
              x={c.subAX}
              y={cy(ySub, subH)}
              textAnchor="middle"
              fill={svg.text}
              fontStyle="italic"
            >
              {subALabel}
            </text>

            {/* sub-CA B */}
            <rect
              x={c.subBX - subW / 2}
              y={ySub}
              width={subW}
              height={subH}
              rx="4"
              fill={svg.fillBox}
              stroke={svg.stroke}
              strokeWidth="1.2"
            />
            <text
              x={c.subBX}
              y={cy(ySub, subH)}
              textAnchor="middle"
              fill={svg.text}
              fontStyle="italic"
            >
              {subBLabel}
            </text>

            {/* four leaves */}
            {[
              { x: c.leafAX, label: leaves[0] },
              { x: c.leafBX, label: leaves[1] },
              { x: c.leafCX, label: leaves[2] },
              { x: c.leafDX, label: leaves[3] },
            ].map((leaf, i) => (
              <g key={i}>
                <rect
                  x={leaf.x - leafW / 2}
                  y={yLeaf}
                  width={leafW}
                  height={leafH}
                  rx="2"
                  fill={svg.fillBox}
                  stroke={svg.stroke}
                  strokeWidth="1.2"
                />
                <text
                  x={leaf.x}
                  y={cy(yLeaf, leafH)}
                  textAnchor="middle"
                  fill={svg.text}
                  fontStyle="italic"
                  fontSize="12"
                >
                  {leaf.label}
                </text>
              </g>
            ))}
          </g>
        )
      })}
    </svg>
  )
}
