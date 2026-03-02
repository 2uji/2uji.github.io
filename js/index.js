const firebaseConfig = {
  apiKey: 'AIzaSyD7n3wIBU_VU-x3kN_YIsSQBz-kPPwSz1w',
  authDomain: 'yuji-2acd8.firebaseapp.com',
  databaseURL: 'https://yuji-2acd8-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'yuji-2acd8',
  storageBucket: 'yuji-2acd8.firebasestorage.app',
  messagingSenderId: '118462870765',
  appId: '1:118462870765:web:9de2540b2451c0bf64c8e4',
}
const CLOUD_NAME = 'doxgoh2pi'
const UPLOAD_PRESET = 'yunpreset'
const CORRECT_HASH = 'd9077e07b8e1621262ee0769e0dcd5371c462c04b75815e5eb19a8631fcf6f49'

const el = id => document.getElementById(id)

const zero = el('zero')
const pwdBox = el('passwordToggle')
const pwdInput = el('passwordInput')
const submitBtn = el('submitPassword')
const errMsg = el('errorMsg')
const container = el('container')
const cutScene = el('cutScene')
const yunyun = el('yunyun')
const vid = el('video-bg')
const discord = el('discord')
const consoleOverlay = el('consoleOverlay')
const consoleInput = el('consoleInput')
const charaSpeech = el('charaSpeech')
const charaSpeechText = el('charaSpeechText')
const consoleChara = el('consoleChara')
const consoleWrap = el('consoleWrap')

const PanelManager = (() => {
  const registry = new Map()
  const GAP = 10

  function register(id, panelEl, opts = {}) {
    registry.set(id, { el: panelEl, opts })
  }

  function _measure(panelEl) {
    const isHidden = getComputedStyle(panelEl).display === 'none'
    if (!isHidden) {
      return { w: panelEl.offsetWidth, h: panelEl.offsetHeight }
    }
    panelEl.style.visibility = 'hidden'
    panelEl.style.display = 'flex'
    const w = panelEl.offsetWidth
    const h = panelEl.offsetHeight
    panelEl.style.display = 'none'
    panelEl.style.visibility = ''
    return { w, h }
  }

  function place(id) {
    const entry = registry.get(id)
    if (!entry) return
    const { el: panelEl, opts } = entry
    const { w: pw, h: ph } = _measure(panelEl)
    const vw = window.innerWidth
    const vh = window.innerHeight

    let left = null, top = null

    if (opts.getAnchor) {
      const anchor = opts.getAnchor()
      if (anchor) {
        const side = opts.side || 'left'
        left = side === 'left' ? anchor.left - pw - GAP
          : side === 'right' ? anchor.right + GAP
            : anchor.left
        top = anchor.top
      }
    }

    if (left == null) left = (vw - pw) / 2
    if (top == null) top = (vh - ph) / 2

    left = Math.max(GAP, Math.min(left, vw - pw - GAP))
    top = Math.max(GAP, Math.min(top, vh - ph - GAP))

    panelEl.style.position = 'fixed'
    panelEl.style.left = left + 'px'
    panelEl.style.top = top + 'px'
    panelEl.style.bottom = 'auto'
    panelEl.style.right = 'auto'
  }

  function clamp(id) {
    const entry = registry.get(id)
    if (!entry) return
    const panelEl = entry.el
    const vw = window.innerWidth
    const vh = window.innerHeight
    const pw = panelEl.offsetWidth
    const ph = panelEl.offsetHeight
    let left = parseFloat(panelEl.style.left) || 0
    let top = parseFloat(panelEl.style.top) || 0
    left = Math.max(GAP, Math.min(left, vw - pw - GAP))
    top = Math.max(GAP, Math.min(top, vh - ph - GAP))
    panelEl.style.left = left + 'px'
    panelEl.style.top = top + 'px'
    panelEl.style.bottom = 'auto'
    panelEl.style.right = 'auto'
  }

  window.addEventListener('resize', () => {
    registry.forEach((_, id) => {
      const { el: panelEl } = registry.get(id)
      if (panelEl.offsetParent !== null || panelEl.style.display !== 'none') {
        clamp(id)
      }
    })
  })

  return { register, place, clamp }
})()

async function sha256(str) {
  const buf = new TextEncoder().encode('yunyun_s@lt_2025' + str)
  const hash = await crypto.subtle.digest('SHA-256', buf)
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('')
}

zero.addEventListener('click', () => {
  pwdBox.style.cssText = 'display:flex; opacity:1;'
  pwdInput.value = ''
  errMsg.style.display = 'none'
  pwdInput.focus()
})
pwdInput.addEventListener('keydown', e => { if (e.key === 'Enter') submitBtn.click() })
submitBtn.addEventListener('click', async () => {
  const hash = await sha256(pwdInput.value.trim())
  if (hash === CORRECT_HASH) {
    document.title = '융융'
    const favicon = document.querySelector("link[rel~='icon']")
    if (favicon) favicon.href = 'assets/discord.png'
    else {
      const link = document.createElement('link')
      link.rel = 'icon'; link.href = 'assets/discord.png'
      document.head.appendChild(link)
    }
    startCut()
  }
  else {
    errMsg.style.display = 'block'
    pwdInput.value = ''
    pwdInput.focus()
  }
})

function startCut() {
  document.body.classList.add('custom-cursor')
  container.style.transition = pwdBox.style.transition = 'opacity .6s'
  container.style.opacity = pwdBox.style.opacity = '0'
  document.body.style.background = '#0d0d0d'

  const fade = Object.assign(document.createElement('div'), {
    style: 'position:fixed;inset:0;background:#000;opacity:0;transition:opacity .8s;z-index:15;'
  })
  document.body.appendChild(fade)
  setTimeout(() => fade.style.opacity = '1', 200)
  setTimeout(() => {
    container.style.display = pwdBox.style.display = 'none'
    document.body.removeChild(fade)
    cutScene.style.cssText = 'display:flex; opacity:1;'
    showYunyun()
  }, 1100)
}

function showYunyun() {
  setTimeout(() => yunyun.style.opacity = '1', 200)
  const proceed = () => {
    vid.muted = false; vid.preload = 'auto'
    vid.play().catch(() => { })
    cutScene.style.transition = 'opacity 1s ease'
    cutScene.style.opacity = '0'
    setTimeout(() => { cutScene.style.display = 'none'; launchMainScene() }, 1000)
  }
  yunyun.addEventListener('click', proceed, { once: true })
}

let mainSceneActive = false

function launchMainScene() {
  mainSceneActive = true
  vid.style.cssText = 'display:block; opacity:0; transition:opacity 2s ease;'
  setTimeout(() => vid.style.opacity = '1', 50)
  discord.style.display = 'block'
  if (discord.complete && discord.naturalWidth > 0) initDiscord()
  else discord.onload = initDiscord
}

let dvx = (Math.random() * 0.6 + 0.4) * (Math.random() < .5 ? 1 : -1)
let dvy = (Math.random() * 0.6 + 0.4) * (Math.random() < .5 ? 1 : -1)
let dx, dy, dRot = Math.random() * 360, dRotSpeed = Math.random() * 4 - 2
let dStarted = false, dProximity = 1.0
const D_MAX_SPEED = 3.0

document.addEventListener('mousemove', e => {
  if (!dStarted) return
  const r = discord.getBoundingClientRect()
  const dist = Math.hypot(e.clientX - r.left - r.width / 2, e.clientY - r.top - r.height / 2)
  dProximity = dist < 200 ? 0.0 : 1.0
})

function initDiscord() {
  if (!dStarted) {
    dx = Math.random() * window.innerWidth * 0.5 + window.innerWidth * 0.2
    dy = Math.random() * window.innerHeight * 0.5 + window.innerHeight * 0.2
    dStarted = true
  }
  animateDiscord()
}

function animateDiscord() {
  const vw = window.innerWidth, vh = window.innerHeight
  const w = discord.offsetWidth, h = discord.offsetHeight
  dx += dvx * dProximity
  dy += dvy * dProximity
  if (dx < 0 || dx > vw - w) { dvx *= -1; dvx = clampSpeed(dvx + randSmall()) }
  if (dy < 0 || dy > vh - h) { dvy *= -1; dvy = clampSpeed(dvy + randSmall()) }
  dRot += dRotSpeed * dProximity
  discord.style.left = dx + 'px'
  discord.style.top = dy + 'px'
  discord.style.transform = `rotate(${dRot}deg)`
  requestAnimationFrame(animateDiscord)
}

function clampSpeed(v) { return Math.sign(v) * Math.min(Math.abs(v), D_MAX_SPEED) }
function randSmall() { return Math.random() * 0.6 - 0.3 }

let speechTimer = null

function speak(text, duration = 5000) {
  if (charaMode !== null) speakWall(text, duration)
  else speakConsole(text, duration)
}

function speakConsole(text, duration) {
  clearTimeout(speechTimer)
  charaSpeechText.textContent = text
  charaSpeech.classList.add('show')
  speechTimer = setTimeout(() => charaSpeech.classList.remove('show'), duration)
}

function speakWall(text, duration) {
  clearTimeout(speechTimer)
  wallSpeechText.textContent = text
  wallSpeech.classList.add('show')
  speechTimer = setTimeout(() => wallSpeech.classList.remove('show'), duration)
}

const idleLines = [
  '뭐 필요한 거 있어융?', 'help 라고 쳐봐융!', '심심해융...',
  '여기 왜 왔어융?', '…', '나 여기 있어융.', '뭔가 해봐융.',
]
let idleInterval = null

function startIdle() {
  stopIdle()
  idleInterval = setInterval(() => {
    if (!accessDeniedActive && consoleOverlay.classList.contains('open'))
      speak(idleLines[Math.floor(Math.random() * idleLines.length)])
  }, 10000)
}
function stopIdle() { clearInterval(idleInterval) }

document.addEventListener('visibilitychange', () => {
  if (!mainSceneActive) return
  document.title = document.hidden ? '돌아와융...' : '융융'
  if (!document.hidden && consoleOverlay.classList.contains('open'))
    speak('보고싶었어융!')
})

const subConsoles = new Map()

discord.addEventListener('click', openConsole)

function openConsole() {
  consoleOverlay.style.display = 'flex'
  requestAnimationFrame(() => consoleOverlay.classList.add('open'))
  consoleInput.focus()
  speak('뭐 필요한 거 있어융? help 라고 쳐봐융!')
  startIdle()
}

function closeConsole() {
  consoleOverlay.classList.remove('open')
  consoleInput.value = ''
  stopIdle()
  setTimeout(() => { consoleOverlay.style.display = 'none' }, 250)
}

consoleInput.addEventListener('keydown', e => {
  if (e.key !== 'Enter') return
  const raw = consoleInput.value.trim()
  if (!raw) return
  consoleInput.value = ''
  handleCommand(raw.toLowerCase())
})

const wallBreak = el('wallBreak')
const wallCharaWrap = el('wallCharaWrap')
const wallPanel = el('wallPanel')
const wallList = el('wallList')
const wallSpeech = el('wallSpeech')
const wallSpeechText = el('wallSpeechText')

  ; (() => {
    const s = document.createElement('style')
    s.textContent = `
/* ── 공통 래퍼 ── */
#wallCharaWrap {
  position: fixed !important;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 55;
  opacity: 0;
  pointer-events: none;
  max-width: 400px;
  bottom: -700px;
  right: 0;
}

/* ── help: 우측 하단 중앙부에서 올라와 콘솔 우측을 침범 ── */
#wallCharaWrap.mode-help.slide-in {
  animation: helpCharaIn 0.75s cubic-bezier(0.22,1,0.36,1) forwards;
}
#wallCharaWrap.mode-help.slide-out {
  animation: helpCharaOut 0.45s ease-in forwards;
}
@keyframes helpCharaIn {
  /* 시작: 콘솔 우측 아래 바깥 */
  0%   { opacity:0; bottom:-700px; right:calc(50vw - 340px); top:auto; left:auto; }
  25%  { opacity:1; }
  /* 착지: 우측 하단 중앙부, 콘솔 우측 절반 침범 */
  100% { opacity:1; bottom:-10px;  right:calc(50vw - 320px); top:auto; left:auto; }
}
@keyframes helpCharaOut {
  0%   { opacity:1; bottom:-10px;  right:calc(50vw - 320px); top:auto; left:auto; }
  100% { opacity:0; bottom:-700px; right:calc(50vw - 340px); top:auto; left:auto; }
}

/* ── chat: 좌측 위에서 내려와 콘솔을 좌측에서 침범 ── */
#wallCharaWrap.mode-chat.slide-in {
  animation: chatCharaIn 0.72s cubic-bezier(0.22,1,0.36,1) forwards;
}
#wallCharaWrap.mode-chat.slide-out {
  animation: chatCharaOut 0.45s ease-in forwards;
}
@keyframes chatCharaIn {
  /* 시작: 콘솔 좌측 위 바깥 */
  0%   { opacity:0; top:-700px; left:calc(50vw - 420px); bottom:auto; right:auto; }
  20%  { opacity:1; }
  /* 착지: 콘솔 좌측 중앙을 침범하는 위치 (콘솔 너비 520px 기준 좌측 260px 지점) */
  100% { opacity:1; top:calc(50vh - 300px); left:calc(50vw - 400px); bottom:auto; right:auto; }
}
@keyframes chatCharaOut {
  0%   { opacity:1; top:calc(50vh - 300px); left:calc(50vw - 400px); bottom:auto; right:auto; }
  100% { opacity:0; top:-700px; left:calc(50vw - 420px); bottom:auto; right:auto; }
}

/* ── 캐릭터 이미지 공통 ── */
#wallChara {
  width: 360px;
  height: auto;
  display: block;
  filter: drop-shadow(0 0 30px rgba(180,80,255,0.95));
}

/* chat 모드일 때는 chat.gif 사용 (JS에서 src 교체) */

/* ── 말풍선 공통 ── */
#wallSpeech {
  background: rgba(10,2,25,0.92);
  border: 1px solid rgba(180,120,255,0.55);
  padding: 10px 16px;
  display: flex;
  gap: 8px;
  align-items: baseline;
  max-width: 300px;
  opacity: 0;
  transform: translateY(4px);
  transition: opacity 0.2s ease, transform 0.2s ease;
  backdrop-filter: blur(8px);
  box-shadow: 0 0 24px rgba(140,50,255,0.45);
  pointer-events: none;
  z-index: 56;
}
#wallSpeech.show { opacity:1; transform:translateY(0); }

/* help: 말풍선 캐릭터 위 */
#wallCharaWrap.mode-help #wallSpeech {
  order: -1;
  margin-bottom: 10px;
  border-radius: 10px 10px 10px 4px;
}
/* chat: 말풍선 캐릭터 아래 */
#wallCharaWrap.mode-chat #wallSpeech {
  order: 1;
  margin-top: 10px;
  border-radius: 4px 10px 10px 10px;
}

#wallSpeechName {
  font-size:12px; font-weight:600; color:#b07fff;
  white-space:nowrap; font-family:'Inter',monospace; flex-shrink:0;
}
#wallSpeechText {
  font-size:13px; color:#e0ccff;
  font-family:'Inter',monospace; line-height:1.5;
}

/* ── 커맨드 패널: 캐릭터(우측)와 충분히 분리된 독립 위치 ──
   캐릭터가 우측(right:-80px, 너비360px)에 있으므로
   패널은 우측에서 360+80+20(gap)=460px 안쪽에 배치         */
#wallPanel {
  position: fixed !important;
  left: -320px;
  top: 50%;
  transform: translateY(-50%);
  width: 240px;
  background: rgba(8,1,18,0.95);
  border: 1px solid rgba(180,120,255,0.45);
  border-radius: 12px;
  padding: 18px 20px;
  font-family: 'Courier New', monospace;
  opacity: 0;
  transition: none;
  box-shadow: 0 4px 40px rgba(140,50,255,0.35);
  z-index: 51;
}
#wallPanel.slide-in {
  animation: panelSlideIn 0.5s cubic-bezier(0.22,1,0.36,1) 0.3s forwards;
}
#wallPanel.slide-out {
  animation: panelSlideOut 0.35s ease-in forwards;
}
/* 착지: 우측에서 460px 안쪽 = 캐릭터 바로 왼쪽 공간 */
@keyframes panelSlideIn {
  0%   { opacity:0; left:-320px; }
  100% { opacity:1; left:calc(100vw - 460px); }
}
@keyframes panelSlideOut {
  0%   { opacity:1; left:calc(100vw - 460px); }
  100% { opacity:0; left:-320px; }
}
  `
    document.head.appendChild(s)
  })()

let charaMode = null
let wallActive = false
let chatCharaActive = false

function _charaBlackout() {
  clearTimeout(speechTimer)
  charaSpeech.classList.remove('show')
  consoleChara.classList.add('blackout')
  _glitch(consoleWrap)
  _noiseLine()
}

function _charaRestore() {
  consoleChara.classList.remove('blackout')
}

function _charaTransition(newMode, enterFn) {
  if (charaMode === newMode) return
  if (charaMode !== null) {
    _exitCurrentChara(() => enterFn())
  } else {
    enterFn()
  }
}

function _exitCurrentChara(cb) {
  wallSpeech.classList.remove('show')

  if (wallCharaWrap.classList.contains('slide-in')) {
    wallCharaWrap.classList.replace('slide-in', 'slide-out')
  }

  if (charaMode === 'help') {
    wallPanel.classList.replace('slide-in', 'slide-out')
    consoleInput.placeholder = '명령어를 입력하세융!'
    wallActive = false
    subConsoles.delete('wall')
  }
  if (charaMode === 'chat') {
    chatCharaActive = false
  }

  setTimeout(() => {
    wallCharaWrap.classList.remove('slide-in', 'slide-out', 'mode-help', 'mode-chat')
    wallPanel.classList.remove('slide-in', 'slide-out')
    wallBreak.style.display = 'none'
    charaMode = null
    _charaRestore()
    cb?.()
  }, 460)
}

const HELP_LIST = [
  { cmd: 'help', desc: '이 목록을 다시 보여줘융!' },
  { cmd: 'mute', desc: '영상 소리 켜고 끄기에융!' },
  { cmd: 'chat', desc: '채팅창 열기에융!' },
  { cmd: 'close', desc: '콘솔 닫기에융!' },
  { cmd: 'omok', desc: '오목 게임이에융!' },
]
const HELP_LIST_ADMIN = [
  { cmd: 'discord', desc: '디스코드 봇 초대 링크에융!' },
  { cmd: 'cloud', desc: '자료실 불러오기에융!' },
  { cmd: 'clear', desc: '채팅 청소하기에융!' },
]

function triggerWallBreak() {
  _charaTransition('help', _enterHelp)
}

function _enterHelp() {
  charaMode = 'help'
  wallActive = true
  chatCharaActive = false
  subConsoles.set('wall', closeWallBreak)

  _charaBlackout()

  el('wallChara').src = 'assets/help.gif'

  wallList.innerHTML = ''
  HELP_LIST.forEach((item, i) => wallList.appendChild(_wallCmd(item, i)))
  if (window.isAdmin) {
    const div = document.createElement('div')
    div.className = 'wall-cmd-divider'
    div.style.animationDelay = `${0.35 + HELP_LIST.length * 0.08}s`
    wallList.appendChild(div)
    HELP_LIST_ADMIN.forEach((item, i) =>
      wallList.appendChild(_wallCmd(item, HELP_LIST.length + 1 + i, true)))
  }

  wallBreak.style.display = 'block'
  wallCharaWrap.classList.add('mode-help')
  requestAnimationFrame(() => {
    wallCharaWrap.classList.add('slide-in')
    wallPanel.classList.add('slide-in')
  })

  consoleInput.placeholder = '이해됐어융?'
  setTimeout(() => speak('화면 밖에서 알려줄게융!'), 600)
}

function _wallCmd(item, i, admin = false) {
  const div = document.createElement('div')
  div.className = 'wall-cmd' + (admin ? ' wall-cmd-admin' : '')
  div.style.animationDelay = `${0.35 + i * 0.08}s`
  div.innerHTML = `<span class="wall-cmd-name">${item.cmd}</span><span class="wall-cmd-desc">${item.desc}</span>`
  return div
}

function closeWallBreak() {
  if (charaMode !== 'help') return
  _exitCurrentChara(null)
}

function triggerChatChara() {
  _charaTransition('chat', _enterChatChara)
}

function _enterChatChara() {
  charaMode = 'chat'
  chatCharaActive = true
  wallActive = false

  _charaBlackout()

  el('wallChara').src = 'assets/chat.gif'

  wallBreak.style.display = 'block'
  wallCharaWrap.classList.add('mode-chat')
  requestAnimationFrame(() => {
    wallCharaWrap.classList.add('slide-in')
  })

  setTimeout(() => speak('채팅으로 대화해봐융!'), 560)
}

function closeChatChara() {
  if (charaMode !== 'chat') return
  _exitCurrentChara(null)
}

let accessDeniedActive = false

function closeAll() {
  const fns = [...subConsoles.values()]
  subConsoles.clear()
  fns.forEach(fn => fn())
  if (charaMode !== null) _exitCurrentChara(null)
}
window.closeAll = closeAll

function triggerAccessDenied() {
  if (accessDeniedActive) return
  accessDeniedActive = true
  _glitch(consoleWrap, true)
  _noiseLine(true)

  closeAll()

  setTimeout(() => {
    consoleChara.classList.add('blackout')

    const warn = Object.assign(document.createElement('img'), {
      src: 'assets/warning.png', className: 'deny-warning'
    })
    consoleChara.appendChild(warn)
    requestAnimationFrame(() => warn.classList.add('show'))

    const nameEl = el('charaSpeechName')
    const prevColor = nameEl.style.color
    nameEl.style.color = '#ff3b3b'
    speakConsole('...너 누구에융.', 7000)

    consoleInput.disabled = true
    consoleInput.placeholder = '접근 거부에융.'

    setTimeout(() => {
      warn.classList.remove('show')
      setTimeout(() => { warn.remove() }, 300)
      consoleChara.classList.remove('blackout')
      charaSpeech.classList.remove('show')
      nameEl.style.color = prevColor
      consoleInput.disabled = false
      consoleInput.placeholder = '명령어를 입력하세융!'
      accessDeniedActive = false
    }, 7000)
  }, 0)
}

function _glitch(target, red = false) {
  const cls = red ? 'glitch-red' : 'glitch'
  target.classList.add(cls)
  setTimeout(() => target.classList.remove(cls), red ? 500 : 400)
}

function _noiseLine(red = false) {
  const div = document.createElement('div')
  div.className = 'noise-line' + (red ? ' noise-line-red' : '')
  document.body.appendChild(div)
  setTimeout(() => div.remove(), 900)
}

firebase.initializeApp(firebaseConfig)
const db = firebase.database()
const messagesRef = db.ref('chat/messages')
const usersRef = db.ref('chat/users')

const chatBox = el('chatBox')
const chatMessages = el('chatMessages')
const chatNameInput = el('chatNameInput')
const chatTextInput = el('chatTextInput')
const chatUserCount = el('chatUserCount')
const chatUserList = el('chatUserList')
const chatToggleList = el('chatToggleList')
const chatClose = el('chatClose')
const chatHeader = el('chatHeader')
const chatColorBar = el('chatColorBar')
const chatColorPreview = el('chatColorPreview')
const chatImageFile = el('chatImageFile')
const chatImagePreview = el('chatImagePreview')
const chatImagePreviewImg = el('chatImagePreviewImg')
const chatImagePreviewName = el('chatImagePreviewName')
const chatImageClear = el('chatImageClear')
const chatActColorBtn = el('chatActColorBtn')
const chatActImgBtn = el('chatActImgBtn')
const chatActSendBtn = el('chatActSendBtn')
const chatResizeE = el('chatResizeE')
const chatResizeN = el('chatResizeN')
const sliderR = el('sliderR'), sliderG = el('sliderG'), sliderB = el('sliderB')
const valR = el('valR'), valG = el('valG'), valB = el('valB')

let nameColor = 'rgb(176,127,255)'
window.nameColor = nameColor
let pendingImage = null
let isAdmin = false
window.isAdmin = false

const sessionId = Math.random().toString(36).slice(2)
let hasJoined = false

function updateColor() {
  const r = sliderR.value, g = sliderG.value, b = sliderB.value
  valR.value = r; valG.value = g; valB.value = b
  nameColor = window.nameColor = `rgb(${r},${g},${b})`
  chatColorPreview.textContent = chatNameInput.value.trim() || '이름'
  chatColorPreview.style.color = nameColor
  if (window.isAdmin) {
    const dim = `rgb(${Math.floor(r * .6)},${Math.floor(g * .6)},${Math.floor(b * .6)})`
    document.documentElement.style.setProperty('--admin-badge-color', `linear-gradient(90deg,${dim},${nameColor})`)
  }
  updateMyInfo()
}

function clampRGB(v) { return Math.max(0, Math.min(255, parseInt(v) || 0)) }

sliderR.addEventListener('input', () => { valR.value = sliderR.value; updateColor() })
sliderG.addEventListener('input', () => { valG.value = sliderG.value; updateColor() })
sliderB.addEventListener('input', () => { valB.value = sliderB.value; updateColor() })
valR.addEventListener('input', () => { sliderR.value = clampRGB(valR.value); updateColor() })
valG.addEventListener('input', () => { sliderG.value = clampRGB(valG.value); updateColor() })
valB.addEventListener('input', () => { sliderB.value = clampRGB(valB.value); updateColor() })
chatNameInput.addEventListener('input', updateColor)

chatActColorBtn.addEventListener('click', () => { chatColorBar.classList.toggle('show'); updateColor() })
chatActSendBtn.addEventListener('click', sendChatMessage)
chatTextInput.addEventListener('keydown', e => { if (e.key === 'Enter') sendChatMessage() })
chatActImgBtn.addEventListener('click', () => chatImageFile.click())
chatImageClear.addEventListener('click', clearImagePreview)
chatToggleList.addEventListener('click', () => {
  chatUserList.classList.toggle('show')
  chatToggleList.textContent = chatUserList.classList.contains('show') ? '접기' : '명단'
})

chatImageFile.addEventListener('change', () => {
  const file = chatImageFile.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = e => {
    pendingImage = e.target.result
    chatImagePreviewImg.src = pendingImage
    chatImagePreviewName.textContent = file.name
    chatImagePreview.classList.add('show')
  }
  reader.readAsDataURL(file)
})

let chatDragging = false, chatDragOffX = 0, chatDragOffY = 0

chatHeader.addEventListener('mousedown', e => {
  chatDragging = true
  const rect = chatBox.getBoundingClientRect()
  chatDragOffX = e.clientX - rect.left
  chatDragOffY = e.clientY - rect.top
  chatBox.style.transition = 'none'
  chatBox.style.bottom = 'auto'
  chatBox.style.left = rect.left + 'px'
  chatBox.style.top = rect.top + 'px'
})

let resizeDir = null
let rsX = 0, rsY = 0, rsW = 0, rsH = 0, rsTop = 0

chatResizeE.addEventListener('mousedown', e => {
  e.stopPropagation()
  resizeDir = 'e'; rsX = e.clientX; rsW = chatBox.offsetWidth
})
chatResizeN.addEventListener('mousedown', e => {
  e.stopPropagation()
  resizeDir = 'n'; rsY = e.clientY; rsH = chatMessages.offsetHeight
  rsTop = chatBox.getBoundingClientRect().top
})

document.addEventListener('mousemove', e => {
  if (chatDragging) {
    chatBox.style.left = (e.clientX - chatDragOffX) + 'px'
    chatBox.style.top = (e.clientY - chatDragOffY) + 'px'
  }
  if (resizeDir === 'e') {
    chatBox.style.width = Math.min(600, Math.max(240, rsW + e.clientX - rsX)) + 'px'
  } else if (resizeDir === 'n') {
    const delta = rsY - e.clientY
    chatMessages.style.height = Math.min(500, Math.max(100, rsH + delta)) + 'px'
    chatBox.style.bottom = 'auto'
    chatBox.style.top = (rsTop - delta) + 'px'
  }

  if (dStarted) {
    const r = discord.getBoundingClientRect()
    const dist = Math.hypot(e.clientX - r.left - r.width / 2, e.clientY - r.top - r.height / 2)
    dProximity = dist < 200 ? 0.0 : 1.0
  }
})

document.addEventListener('mouseup', () => {
  if (chatDragging) PanelManager.clamp('chat')
  chatDragging = false
  resizeDir = null
})

usersRef.on('value', snapshot => {
  const users = Object.values(snapshot.val() || {})
  chatUserCount.textContent = users.length
  chatUserList.innerHTML = ''
  users.forEach(u => {
    const div = document.createElement('div')
    div.className = 'chat-user-item'
    div.textContent = u.name
    div.style.color = u.color || '#b07fff'
    chatUserList.appendChild(div)
  })
})

function joinChat() {
  const name = chatNameInput.value.trim() || '익명'
  const userRef = db.ref(`chat/users/${sessionId}`)
  userRef.set({ name, color: nameColor })
  if (!hasJoined) { userRef.onDisconnect().remove(); hasJoined = true }
}

function updateMyInfo() {
  if (!hasJoined) return
  db.ref(`chat/users/${sessionId}`).set({ name: chatNameInput.value.trim() || '익명', color: nameColor })
}

function openChat() {
  if (chatBox.classList.contains('open')) return
  chatBox.classList.add('open')
  subConsoles.set('chat', closeChat)
  joinChat()
  _appendSystemMsg('어서오세융! 채팅으로 대화해봐융!')
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      PanelManager.place('chat')
      triggerChatChara()
    })
  })
}

function closeChat() {
  chatBox.classList.remove('open')
  subConsoles.delete('chat')
  if (hasJoined) {
    db.ref(`chat/users/${sessionId}`).remove()
    hasJoined = false
  }
  closeChatChara()
}

function _appendSystemMsg(text) {
  const div = document.createElement('div')
  div.className = 'chat-msg'
  const nameEl = Object.assign(document.createElement('span'), {
    className: 'chat-msg-name', textContent: '융융'
  })
  nameEl.style.color = '#b07fff'
  const textEl = Object.assign(document.createElement('span'), {
    className: 'chat-msg-text', textContent: text
  })
  div.append(nameEl, textEl)
  chatMessages.appendChild(div)
  chatMessages.scrollTop = chatMessages.scrollHeight
}

async function uploadToCloudinary(file) {
  const form = new FormData()
  form.append('file', file)
  form.append('upload_preset', UPLOAD_PRESET)
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, { method: 'POST', body: form })
  const data = await res.json()
  if (!data.secure_url) throw new Error('업로드 실패')
  return data.secure_url
}

async function sendChatMessage() {
  const name = chatNameInput.value.trim() || '익명'
  const text = chatTextInput.value.trim()
  const file = chatImageFile.files[0]
  if (!text && !file) return

  joinChat()

  let imgUrl = null
  if (file) {
    chatActSendBtn.textContent = '업로드 중...'
    chatActSendBtn.disabled = true
    try { imgUrl = await uploadToCloudinary(file) }
    catch { speak('이미지 업로드 실패했어융...'); chatActSendBtn.textContent = '메세지 전송'; chatActSendBtn.disabled = false; return }
  }

  messagesRef.push({
    name, text: text || null, color: nameColor,
    imgUrl: imgUrl || null, isAdmin: isAdmin || false,
    timestamp: firebase.database.ServerValue.TIMESTAMP,
  })

  chatTextInput.value = ''
  chatActSendBtn.textContent = '메세지 전송'
  chatActSendBtn.disabled = false
  clearImagePreview()
  chatTextInput.focus()
}

function clearImagePreview() {
  pendingImage = null
  chatImagePreview.classList.remove('show')
  chatImagePreviewImg.src = ''
  chatImagePreviewName.textContent = ''
  chatImageFile.value = ''
}

const seenMsgs = new Set()

messagesRef.on('value', snapshot => {
  if (snapshot.val() === null) { chatMessages.innerHTML = ''; seenMsgs.clear() }
})

messagesRef.on('child_added', snapshot => {
  if (seenMsgs.has(snapshot.key)) return
  seenMsgs.add(snapshot.key)

  const { name, text, color, imgUrl, isAdmin: msgIsAdmin } = snapshot.val()
  const div = document.createElement('div')
  div.className = 'chat-msg'

  const nameEl = document.createElement('span')
  nameEl.className = 'chat-msg-name' + (msgIsAdmin ? ' admin' : '')
  nameEl.textContent = name
  nameEl.style.color = color || '#b07fff'

  if (msgIsAdmin) {
    const [r, g, b] = color.match(/\d+/g).map(Number)
    nameEl.style.setProperty('--admin-badge-color',
      `linear-gradient(90deg,rgb(${Math.floor(r * .6)},${Math.floor(g * .6)},${Math.floor(b * .6)}),${color})`)
  }

  div.appendChild(nameEl)

  if (text) {
    div.appendChild(Object.assign(document.createElement('span'), {
      className: 'chat-msg-text', textContent: text
    }))
  }

  if (imgUrl) {
    const img = Object.assign(document.createElement('img'), {
      className: 'chat-msg-img', src: imgUrl
    })
    img.onclick = () => window.open(imgUrl, '_blank')
    div.appendChild(img)
  }

  chatMessages.appendChild(div)
  chatMessages.scrollTop = chatMessages.scrollHeight
})

const cloudOverlay = el('cloudOverlay')
const cloudList = el('cloudList')
const cloudStatus = el('cloudStatus')
const cloudEmpty = el('cloudEmpty')

function formatBytes(b) {
  return b < 1024 ? b + ' B' : b < 1048576 ? (b / 1024).toFixed(1) + ' KB' : (b / 1048576).toFixed(1) + ' MB'
}

async function openCloud() {
  cloudOverlay.classList.add('open')
  subConsoles.set('cloud', closeCloud)
  cloudList.innerHTML = ''; cloudEmpty.style.display = 'none'
  cloudStatus.textContent = '불러오는 중...'

  try {
    const res = await fetch('https://api.github.com/repos/2uji/cloud/contents')
    if (!res.ok) throw new Error(res.status)
    const files = (await res.json()).filter(f => f.type === 'file')
    cloudStatus.textContent = `파일 ${files.length}개`
    if (!files.length) { cloudEmpty.style.display = 'block'; return }
    files.forEach((file, i) => {
      const item = document.createElement('div')
      item.className = 'cloud-item'
      item.style.animationDelay = `${i * 0.04}s`
      item.innerHTML = `
        <div class="cloud-item-info">
          <span class="cloud-item-name">${file.name}</span>
          <span class="cloud-item-size">${formatBytes(file.size)}</span>
        </div>
        <a class="cloud-item-dl" href="${file.download_url}" download="${file.name}" target="_blank">다운로드</a>`
      cloudList.appendChild(item)
    })
  } catch { cloudStatus.textContent = '불러오기 실패... 잠시 후 다시 시도해봐융!' }
}

function closeCloud() {
  cloudOverlay.classList.remove('open')
  subConsoles.delete('cloud')
}

el('cloudClose').addEventListener('click', closeCloud)
cloudOverlay.addEventListener('click', e => { if (e.target === cloudOverlay) closeCloud() })

PanelManager.register('chat', chatBox, {
  getAnchor: () => {
    const vh = window.innerHeight
    const ph = chatBox.offsetHeight || 400
    return { left: 40, top: vh - ph - 40, right: 340, bottom: vh - 40 }
  }
})
