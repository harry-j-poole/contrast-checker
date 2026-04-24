import { useState, useEffect } from 'react'

function hexToRgb(hex) {
  const clean = hex.replace('#', '')
  const full =
    clean.length === 3
      ? clean
          .split('')
          .map(c => c + c)
          .join('')
      : clean
  const num = parseInt(full, 16)
  if (isNaN(num)) return { r: 0, g: 0, b: 0 }
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  }
}

function toLinear(c) {
  const s = c / 255
  return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
}

function getLuminance(hex) {
  const { r, g, b } = hexToRgb(hex)
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b)
}

function getContrastRatio(hex1, hex2) {
  const l1 = getLuminance(hex1)
  const l2 = getLuminance(hex2)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

function isValidHex(hex) {
  return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(hex)
}

function PassBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
        <path
          d="M1.5 5L3.5 7.5L8.5 2.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      Pass
    </span>
  )
}

function FailBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200">
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
        <path
          d="M2 2L8 8M8 2L2 8"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
      Fail
    </span>
  )
}

function NABadge() {
  return <span className="text-gray-300 text-sm font-medium">—</span>
}

function ColorPicker({ label, value, onChange }) {
  const [text, setText] = useState(value.toUpperCase())

  useEffect(() => {
    setText(value.toUpperCase())
  }, [value])

  const handleText = e => {
    let v = e.target.value
    if (v && !v.startsWith('#')) v = '#' + v
    setText(v.toUpperCase())
    if (isValidHex(v)) onChange(v)
  }

  const handleBlur = () => {
    if (!isValidHex(text)) setText(value.toUpperCase())
  }

  return (
    <div className="flex-1 min-w-0">
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">
        {label}
      </label>
      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
        <div className="relative flex-shrink-0">
          <input
            type="color"
            value={value}
            onChange={e => onChange(e.target.value)}
            className="w-11 h-11 rounded-lg cursor-pointer border-0 bg-transparent"
            style={{ padding: 0 }}
            aria-label={`${label} colour picker`}
          />
        </div>
        <input
          type="text"
          value={text}
          onChange={handleText}
          onBlur={handleBlur}
          maxLength={7}
          spellCheck={false}
          className="flex-1 min-w-0 bg-transparent border-0 text-base font-mono font-semibold text-gray-800 focus:outline-none placeholder-gray-300 uppercase"
          placeholder="#000000"
          aria-label={`${label} hex colour value`}
        />
      </div>
    </div>
  )
}

const CRITERIA = [
  {
    label: 'Normal Text',
    desc: 'Text under 18pt (24px) or under 14pt bold (18.67px)',
    aa: 4.5,
    aaa: 7,
  },
  {
    label: 'Large Text',
    desc: 'Text 18pt (24px)+ or 14pt bold (18.67px)+',
    aa: 3,
    aaa: 4.5,
  },
  {
    label: 'UI Components',
    desc: 'Graphical objects, icons, and interface components',
    aa: 3,
    aaa: null,
  },
]

export default function App() {
  const [fg, setFg] = useState('#1e293b')
  const [bg, setBg] = useState('#f1f5f9')

  const ratio = getContrastRatio(fg, bg)
  const ratioDisplay = ratio.toFixed(2) + ':1'
  const indicatorPct = Math.min(((ratio - 1) / 20) * 100, 100)

  const aaPass = ratio >= 4.5
  const aaaPass = ratio >= 7

  const swap = () => {
    setFg(bg)
    setBg(fg)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Page header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-6 py-8">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Colour Contrast Checker
          </h1>
          <p className="text-gray-500 text-sm mt-1.5 leading-relaxed">
            Evaluate foreground and background colour combinations against WCAG 2.2 accessibility
            standards. Covers Success Criteria 1.4.3 (Level AA) and 1.4.6 (Level AAA).
          </p>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-6 py-8 space-y-5">
        {/* Colour inputs */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
          <div className="p-6 space-y-5">
            <div className="flex items-end gap-3">
              <ColorPicker label="Foreground colour" value={fg} onChange={setFg} />
              <button
                onClick={swap}
                title="Swap foreground and background"
                aria-label="Swap foreground and background colours"
                className="flex-shrink-0 mb-0.5 p-2.5 rounded-xl border border-gray-200 text-gray-400 hover:text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M2 6h14M13 3l3 3-3 3M16 12H2M5 9l-3 3 3 3"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <ColorPicker label="Background colour" value={bg} onChange={setBg} />
            </div>
          </div>

          {/* Live preview */}
          <div
            className="px-8 py-8 border-t border-gray-100 transition-colors duration-200"
            style={{ backgroundColor: bg, color: fg }}
          >
            <p
              className="font-bold leading-snug mb-2"
              style={{ fontSize: '24px' }}
              aria-label="Large text preview"
            >
              Large text — The quick brown fox jumps over the lazy dog.
            </p>
            <p
              className="leading-normal"
              style={{ fontSize: '16px' }}
              aria-label="Normal text preview"
            >
              Normal text — The quick brown fox jumps over the lazy dog. Aa Bb Cc Dd 0123456789
            </p>
          </div>
        </div>

        {/* Contrast ratio */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">
                Contrast Ratio
              </p>
              <p className="text-5xl font-bold text-gray-900 tabular-nums leading-none">
                {ratioDisplay}
              </p>
            </div>
            <div className="flex gap-3">
              <div className="text-center px-5 py-3.5 rounded-xl bg-gray-50 border border-gray-200 min-w-[90px]">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5">
                  WCAG AA
                </p>
                {aaPass ? <PassBadge /> : <FailBadge />}
              </div>
              <div className="text-center px-5 py-3.5 rounded-xl bg-gray-50 border border-gray-200 min-w-[90px]">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5">
                  WCAG AAA
                </p>
                {aaaPass ? <PassBadge /> : <FailBadge />}
              </div>
            </div>
          </div>

          {/* Ratio scale bar */}
          <div className="mt-6">
            <div className="relative h-2.5 rounded-full overflow-hidden bg-gray-100">
              {/* Fail zone: 1–3 */}
              <div
                className="absolute left-0 top-0 h-full bg-red-300"
                style={{ width: `${(2 / 20) * 100}%` }}
              />
              {/* Marginal zone: 3–4.5 (large text AA passes) */}
              <div
                className="absolute top-0 h-full bg-amber-300"
                style={{ left: `${(2 / 20) * 100}%`, width: `${(1.5 / 20) * 100}%` }}
              />
              {/* AA pass zone: 4.5–7 */}
              <div
                className="absolute top-0 h-full bg-emerald-300"
                style={{ left: `${(3.5 / 20) * 100}%`, width: `${(2.5 / 20) * 100}%` }}
              />
              {/* AAA pass zone: 7–21 */}
              <div
                className="absolute top-0 h-full bg-emerald-500"
                style={{ left: `${(6 / 20) * 100}%`, right: 0 }}
              />
              {/* Indicator dot */}
              <div
                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-gray-800 border-2 border-white shadow-md transition-all duration-200"
                style={{ left: `calc(${indicatorPct}% - 8px)` }}
                role="img"
                aria-label={`Contrast ratio ${ratioDisplay} on scale`}
              />
            </div>
            <div className="flex justify-between text-[10px] text-gray-400 mt-1.5 font-medium">
              <span>1:1</span>
              <span>3:1</span>
              <span>4.5:1</span>
              <span>7:1</span>
              <span>21:1</span>
            </div>
          </div>
        </div>

        {/* WCAG criteria table */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900 text-sm">WCAG 2.2 Compliance Detail</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Success Criteria 1.4.3 (Contrast Minimum, AA) and 1.4.6 (Contrast Enhanced, AAA)
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Criterion
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Required ratio
                  </th>
                  <th className="text-center px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide w-24">
                    AA
                  </th>
                  <th className="text-center px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide w-24">
                    AAA
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {CRITERIA.map((c, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900 text-sm">{c.label}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{c.desc}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded-md">
                        AA {c.aa}:1
                      </span>
                      {c.aaa && (
                        <span className="ml-1.5 text-xs font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded-md">
                          AAA {c.aaa}:1
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {ratio >= c.aa ? <PassBadge /> : <FailBadge />}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {c.aaa != null ? (
                        ratio >= c.aaa ? (
                          <PassBadge />
                        ) : (
                          <FailBadge />
                        )
                      ) : (
                        <NABadge />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
            <p className="text-xs text-gray-400 leading-relaxed">
              <strong className="text-gray-500 font-semibold">Large text</strong> is defined as at
              least 18pt (24px) regular weight, or 14pt (approximately 18.67px) bold.{' '}
              <strong className="text-gray-500 font-semibold">UI Components</strong> covers
              graphical objects and user interface component states (WCAG 1.4.11, Level AA only).
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
