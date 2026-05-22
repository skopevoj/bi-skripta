import { svg } from './Figure'

// FIDO2 / WebAuthn authentication (assertion) sequence diagram.
// Mirrors Fido2Register layout: three lifelines (User+Authenticator, Browser, RP),
// numbered messages flow top → bottom.
export function Fido2Auth() {
  const W = 640
  const H = 480

  // Lifeline x-coordinates (match registration diagram)
  const xA = 110 // Authenticator + User
  const xB = 340 // Klient (prohlížeč)
  const xR = 560 // Relying Party

  // Actor box geometry
  const boxW = 170
  const boxH = 44
  const yBoxTop = 20
  const yBoxBottom = yBoxTop + boxH

  // Lifeline vertical extent
  const yLifeStart = yBoxBottom
  const yLifeEnd = H - 20

  // Message y-coordinates (top → bottom time flow)
  const y1 = 110 // RP → Klient: challenge, allowCredentials
  const y2 = 160 // Klient → Authenticator: navigator.credentials.get()
  const y3 = 210 // Authenticator → User: confirm gesture
  const y4a = 250 // self-arrow start (sign challenge + counter)
  const y4b = 310 // self-arrow end
  const y5 = 370 // Authenticator → Klient: signature, authenticatorData
  const y6 = 430 // Klient → RP: signature, authenticatorData

  // Helpers ------------------------------------------------------------------
  const arrowSize = 5

  // Triangle pointing right (apex at x,y)
  const triRight = (x: number, y: number) =>
    `${x},${y} ${x - arrowSize - 1},${y - arrowSize} ${x - arrowSize - 1},${y + arrowSize}`
  // Triangle pointing left (apex at x,y)
  const triLeft = (x: number, y: number) =>
    `${x},${y} ${x + arrowSize + 1},${y - arrowSize} ${x + arrowSize + 1},${y + arrowSize}`

  // Numbered step label gutter
  const stepX = 18

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      style={{ maxWidth: 640 }}
      fontFamily="Inter, system-ui, sans-serif"
      fontSize="13"
    >
      {/* ---------- Actor boxes ---------- */}
      {[
        { x: xA, label: 'Uživatel + Authenticator' },
        { x: xB, label: 'Klient (prohlížeč)' },
        { x: xR, label: 'Relying Party (RP)' },
      ].map((a) => (
        <g key={a.label}>
          <rect
            x={a.x - boxW / 2}
            y={yBoxTop}
            width={boxW}
            height={boxH}
            fill={svg.fillBox}
            stroke={svg.stroke}
            strokeWidth="1.2"
            rx="2"
          />
          <text
            x={a.x}
            y={yBoxTop + boxH / 2 + 4}
            textAnchor="middle"
            fill={svg.text}
          >
            {a.label}
          </text>
        </g>
      ))}

      {/* ---------- Lifelines (dashed) ---------- */}
      {[xA, xB, xR].map((x) => (
        <line
          key={x}
          x1={x}
          y1={yLifeStart}
          x2={x}
          y2={yLifeEnd}
          stroke={svg.strokeFaint}
          strokeWidth="1.2"
          strokeDasharray="4 4"
        />
      ))}

      {/* ====================================================== */}
      {/* 1. RP → Klient: challenge, seznam credential ID        */}
      {/* ====================================================== */}
      <text x={stepX} y={y1 + 4} fill={svg.textFaint} fontSize="11">
        1.
      </text>
      <line
        x1={xR}
        y1={y1}
        x2={xB + arrowSize + 1}
        y2={y1}
        stroke={svg.stroke}
        strokeWidth="1.2"
      />
      <polygon points={triLeft(xB + 1, y1)} fill={svg.stroke} />
      <text
        x={(xB + xR) / 2}
        y={y1 - 6}
        textAnchor="middle"
        fill={svg.text}
        fontStyle="italic"
        fontSize="12"
      >
        challenge, seznam credential ID
      </text>

      {/* ====================================================== */}
      {/* 2. Klient → Authenticator: navigator.credentials.get() */}
      {/* ====================================================== */}
      <text x={stepX} y={y2 + 4} fill={svg.textFaint} fontSize="11">
        2.
      </text>
      <line
        x1={xB}
        y1={y2}
        x2={xA + arrowSize + 1}
        y2={y2}
        stroke={svg.stroke}
        strokeWidth="1.2"
      />
      <polygon points={triLeft(xA + 1, y2)} fill={svg.stroke} />
      <text
        x={(xA + xB) / 2}
        y={y2 - 6}
        textAnchor="middle"
        fill={svg.text}
        fontStyle="italic"
        fontSize="12"
      >
        navigator.credentials.get(...)
      </text>

      {/* ====================================================== */}
      {/* 3. Authenticator → User: user gesture                  */}
      {/* ====================================================== */}
      <text x={stepX} y={y3 + 4} fill={svg.textFaint} fontSize="11">
        3.
      </text>
      <line
        x1={xA}
        y1={y3}
        x2={xA - 60 + arrowSize + 1}
        y2={y3}
        stroke={svg.stroke}
        strokeWidth="1.2"
      />
      <polygon points={triLeft(xA - 60 + 1, y3)} fill={svg.stroke} />
      <text
        x={xA - 30}
        y={y3 - 6}
        textAnchor="middle"
        fill={svg.text}
        fontStyle="italic"
        fontSize="12"
      >
        potvrď ověření
      </text>
      <text
        x={xA - 30}
        y={y3 + 18}
        textAnchor="middle"
        fill={svg.textFaint}
        fontSize="11"
      >
        (user gesture)
      </text>

      {/* ====================================================== */}
      {/* 4. Authenticator self-action: find cred + sign         */}
      {/* ====================================================== */}
      <text x={stepX} y={(y4a + y4b) / 2 + 4} fill={svg.textFaint} fontSize="11">
        4.
      </text>
      {/* Activation box on the lifeline */}
      <rect
        x={xA - 6}
        y={y4a}
        width={12}
        height={y4b - y4a}
        fill={svg.fillBoxAlt}
        stroke={svg.stroke}
        strokeWidth="1.2"
      />
      {/* Self-loop arrow exiting and re-entering the lifeline */}
      <line
        x1={xA + 6}
        y1={y4a + 10}
        x2={xA + 46}
        y2={y4a + 10}
        stroke={svg.stroke}
        strokeWidth="1.2"
      />
      <line
        x1={xA + 46}
        y1={y4a + 10}
        x2={xA + 46}
        y2={y4b - 10}
        stroke={svg.stroke}
        strokeWidth="1.2"
      />
      <line
        x1={xA + 46}
        y1={y4b - 10}
        x2={xA + 6 + arrowSize + 1}
        y2={y4b - 10}
        stroke={svg.stroke}
        strokeWidth="1.2"
      />
      <polygon points={triLeft(xA + 6 + 1, y4b - 10)} fill={svg.stroke} />
      <text
        x={xA + 56}
        y={(y4a + y4b) / 2 - 4}
        fill={svg.text}
        fontStyle="italic"
        fontSize="12"
      >
        najde credential, podepíše
      </text>
      <text
        x={xA + 56}
        y={(y4a + y4b) / 2 + 12}
        fill={svg.text}
        fontStyle="italic"
        fontSize="12"
      >
        challenge + counter pomocí SK
      </text>

      {/* ====================================================== */}
      {/* 5. Authenticator → Klient: signature, authenticatorData */}
      {/* ====================================================== */}
      <text x={stepX} y={y5 + 4} fill={svg.textFaint} fontSize="11">
        5.
      </text>
      <line
        x1={xA}
        y1={y5}
        x2={xB - arrowSize - 1}
        y2={y5}
        stroke={svg.stroke}
        strokeWidth="1.2"
      />
      <polygon points={triRight(xB - 1, y5)} fill={svg.stroke} />
      <text
        x={(xA + xB) / 2}
        y={y5 - 6}
        textAnchor="middle"
        fill={svg.text}
        fontStyle="italic"
        fontSize="12"
      >
        signature, authenticatorData
      </text>
      <text
        x={(xA + xB) / 2}
        y={y5 + 18}
        textAnchor="middle"
        fill={svg.textFaint}
        fontSize="11"
        fontStyle="italic"
      >
        (vč. sign counter)
      </text>

      {/* ====================================================== */}
      {/* 6. Klient → RP: signature, authenticatorData           */}
      {/* ====================================================== */}
      <text x={stepX} y={y6 + 4} fill={svg.textFaint} fontSize="11">
        6.
      </text>
      <line
        x1={xB}
        y1={y6}
        x2={xR - arrowSize - 1}
        y2={y6}
        stroke={svg.stroke}
        strokeWidth="1.2"
      />
      <polygon points={triRight(xR - 1, y6)} fill={svg.stroke} />
      <text
        x={(xB + xR) / 2}
        y={y6 - 6}
        textAnchor="middle"
        fill={svg.text}
        fontStyle="italic"
        fontSize="12"
      >
        signature, authenticatorData
      </text>
      <text
        x={(xB + xR) / 2}
        y={y6 + 18}
        textAnchor="middle"
        fill={svg.textFaint}
        fontSize="11"
        fontStyle="italic"
      >
        RP ověří podpis pomocí VK
      </text>
    </svg>
  )
}
