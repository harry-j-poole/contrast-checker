// ── Colour conversion ─────────────────────────────────────────
function hexToHsl(hex) {
  let { r, g, b } = hexToRgb(hex)
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  let h = 0, s = 0
  const l = (max + min) / 2
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
      case g: h = ((b - r) / d + 2) / 6; break
      case b: h = ((r - g) / d + 4) / 6; break
    }
  }
  return { h: h * 360, s: s * 100, l: l * 100 }
}

function hslToHex(h, s, l) {
  s /= 100; l /= 100
  const a = s * Math.min(l, 1 - l)
  const f = n => {
    const k = (n + h / 30) % 12
    const c = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(255 * c).toString(16).padStart(2, '0')
  }
  return `#${f(0)}${f(8)}${f(4)}`
}

// ── WCAG maths ────────────────────────────────────────────────
function hexToRgb(hex) {
  const c = hex.replace('#', '')
  const full = c.length === 3 ? c.split('').map(x => x + x).join('') : c
  const n = parseInt(full, 16)
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 }
}

function toLinear(c) {
  const s = c / 255
  return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
}

function luminance(hex) {
  const { r, g, b } = hexToRgb(hex)
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b)
}

function contrastRatio(a, b) {
  const l1 = luminance(a), l2 = luminance(b)
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)
}

function isValidHex(h) {
  return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(h)
}

// ── State ─────────────────────────────────────────────────────
let fg = '#e0ddf9', bg = '#5746dd', surface = '#fbfbfe'
// Reference hue & saturation stored separately so they survive the slider
// hitting 0% (black) or 100% (white), where HSL loses hue information
let fgH = 0, fgS = 0
let bgH = 0, bgS = 0
let surfaceH = 0, surfaceS = 0

// ── Elements ──────────────────────────────────────────────────
const fgPicker  = document.getElementById('fg-picker')
const fgHex     = document.getElementById('fg-hex')
const fgSlider  = document.getElementById('fg-lightness')
const bgPicker  = document.getElementById('bg-picker')
const bgHex     = document.getElementById('bg-hex')
const bgSlider  = document.getElementById('bg-lightness')
const surfacePicker = document.getElementById('surface-picker')
const surfaceHex    = document.getElementById('surface-hex')
const surfaceSlider = document.getElementById('surface-lightness')
const previewText = document.getElementById('preview-text')
const previewUi   = document.getElementById('preview-ui')
const ratioDis       = document.getElementById('ratio-display')
const badgeAA        = document.getElementById('badge-aa')
const badgeAAA       = document.getElementById('badge-aaa')
const scaleDot       = document.getElementById('scale-dot')
const ratioDisSurface = document.getElementById('ratio-display-surface')
const badgeAA2        = document.getElementById('badge-aa-surface')
const badgeAAA2       = document.getElementById('badge-aaa-surface')
const scaleDot2       = document.getElementById('scale-dot-surface')
const tbody     = document.getElementById('criteria-body')

// ── Criteria ──────────────────────────────────────────────────
const CRITERIA = [
  { label: 'Normal Text',   desc: 'Text under 18pt (24px) or under 14pt bold (18.67px)', aa: 4.5, aaa: 7   },
  { label: 'Large Text',    desc: 'Text 18pt (24px)+ or 14pt bold (18.67px)+',            aa: 3,   aaa: 4.5 },
  { label: 'UI Components', desc: 'Graphical objects, icons, and interface components',    aa: 3,   aaa: null },
]

function badge(pass) {
  return pass
    ? '<span class="badge badge-pass">&#10003; Pass</span>'
    : '<span class="badge badge-fail">&#10007; Fail</span>'
}

function buildTable(ratio1, ratio2) {
  tbody.innerHTML = CRITERIA.map(c => `
    <tr>
      <td>
        <p class="crit-name">${c.label}</p>
        <p class="crit-desc">${c.desc}</p>
      </td>
      <td>
        <span class="ratio-pill">AA ${c.aa}:1</span>
        ${c.aaa != null ? `<span class="ratio-pill">AAA ${c.aaa}:1</span>` : ''}
      </td>
      <td class="center">${badge(ratio1 >= c.aa)}</td>
      <td class="center">${c.aaa != null ? badge(ratio1 >= c.aaa) : '<span class="na">—</span>'}</td>
      <td class="center">${badge(ratio2 >= c.aa)}</td>
      <td class="center">${c.aaa != null ? badge(ratio2 >= c.aaa) : '<span class="na">—</span>'}</td>
    </tr>
  `).join('')
}

// ── Render ────────────────────────────────────────────────────
function render() {
  const ratio1 = contrastRatio(fg, bg)
  const ratio2 = contrastRatio(surface, bg)

  previewText.style.backgroundColor = bg
  previewText.style.color = fg
  previewUi.style.backgroundColor = surface
  previewUi.style.setProperty('--preview-fg', fg)
  previewUi.style.setProperty('--preview-bg', bg)

  // Three-state badge: pass / partial (some criteria pass) / fail
  const setB3 = (el, ratio, passAt, partialAt) => {
    if (ratio >= passAt) {
      el.className = 'badge badge-pass'
      el.innerHTML = '&#10003; Pass'
    } else if (ratio >= partialAt) {
      el.className = 'badge badge-partial'
      el.innerHTML = '~ Partial'
    } else {
      el.className = 'badge badge-fail'
      el.innerHTML = '&#10007; Fail'
    }
  }

  ratioDis.textContent = ratio1.toFixed(2) + ':1'
  setB3(badgeAA,  ratio1, 4.5, 3)
  setB3(badgeAAA, ratio1, 7,   4.5)
  scaleDot.style.left = Math.min(((ratio1 - 1) / 20) * 100, 100) + '%'

  ratioDisSurface.textContent = ratio2.toFixed(2) + ':1'
  setB3(badgeAA2,  ratio2, 4.5, 3)
  setB3(badgeAAA2, ratio2, 7,   4.5)
  scaleDot2.style.left = Math.min(((ratio2 - 1) / 20) * 100, 100) + '%'

  buildTable(ratio1, ratio2)
}

// ── Slider helpers ────────────────────────────────────────────
function setSliderTrack(slider, h, s) {
  const mid = `hsl(${h.toFixed(1)}, ${s.toFixed(1)}%, 50%)`
  slider.style.setProperty('--track-bg', `linear-gradient(to right, #000, ${mid}, #fff)`)
}

// ── Wire inputs ───────────────────────────────────────────────

// applyFg/applyBg update everything except slider position.
// They use the stored fgH/fgS so the track stays correct even when
// the current hex is black or white and has no meaningful hue.
function applyFg(val) {
  fg = val
  fgPicker.value = val
  fgHex.value    = val.toUpperCase()
  setSliderTrack(fgSlider, fgH, fgS)
  render()
}

function applyBg(val) {
  bg = val
  bgPicker.value = val
  bgHex.value    = val.toUpperCase()
  setSliderTrack(bgSlider, bgH, bgS)
  render()
}

function applySurface(val) {
  surface = val
  surfacePicker.value = val
  surfaceHex.value    = val.toUpperCase()
  setSliderTrack(surfaceSlider, surfaceH, surfaceS)
  render()
}

// syncFg/syncBg are called when a new colour is chosen externally
// (picker, hex input, swap). They capture the new hue/saturation as
// the reference, then also snap the slider thumb to the correct lightness.
function syncFg(val) {
  const { h, s, l } = hexToHsl(val)
  fgH = h; fgS = s
  fgSlider.value = Math.round(l)
  applyFg(val)
}

function syncBg(val) {
  const { h, s, l } = hexToHsl(val)
  bgH = h; bgS = s
  bgSlider.value = Math.round(l)
  applyBg(val)
}

function syncSurface(val) {
  const { h, s, l } = hexToHsl(val)
  surfaceH = h; surfaceS = s
  surfaceSlider.value = Math.round(l)
  applySurface(val)
}

fgPicker.addEventListener('input', e => syncFg(e.target.value))
bgPicker.addEventListener('input', e => syncBg(e.target.value))

fgHex.addEventListener('input', e => {
  let v = e.target.value
  if (!v.startsWith('#')) v = '#' + v
  fgHex.value = v.toUpperCase()
  if (isValidHex(v)) syncFg(v)
})
fgHex.addEventListener('blur', () => { if (!isValidHex(fgHex.value)) fgHex.value = fg.toUpperCase() })

bgHex.addEventListener('input', e => {
  let v = e.target.value
  if (!v.startsWith('#')) v = '#' + v
  bgHex.value = v.toUpperCase()
  if (isValidHex(v)) syncBg(v)
})
bgHex.addEventListener('blur', () => { if (!isValidHex(bgHex.value)) bgHex.value = bg.toUpperCase() })

surfacePicker.addEventListener('input', e => syncSurface(e.target.value))

surfaceHex.addEventListener('input', e => {
  let v = e.target.value
  if (!v.startsWith('#')) v = '#' + v
  surfaceHex.value = v.toUpperCase()
  if (isValidHex(v)) syncSurface(v)
})
surfaceHex.addEventListener('blur', () => { if (!isValidHex(surfaceHex.value)) surfaceHex.value = surface.toUpperCase() })

surfaceSlider.addEventListener('input', e => {
  applySurface(hslToHex(surfaceH, surfaceS, parseFloat(e.target.value)))
})

// Slider listeners use stored H/S — NOT hexToHsl on current hex — so
// the colour snaps back to the original hue after coming back from 0/100.
fgSlider.addEventListener('input', e => {
  applyFg(hslToHex(fgH, fgS, parseFloat(e.target.value)))
})

bgSlider.addEventListener('input', e => {
  applyBg(hslToHex(bgH, bgS, parseFloat(e.target.value)))
})


// ── Init ──────────────────────────────────────────────────────
syncFg(fg)
syncBg(bg)
syncSurface(surface)
