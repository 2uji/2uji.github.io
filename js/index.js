const el = id => document.getElementById(id)
const zero            = el('zero')
const pwdBox          = el('passwordToggle')
const pwdInput        = el('passwordInput')
const submitBtn       = el('submitPassword')
const errMsg          = el('errorMsg')
const container       = el('container')
const cutScene        = el('cutScene')
const yunyun          = el('yunyun')
const vid             = el('video-bg')
const discord         = el('discord')
const consoleOverlay  = el('consoleOverlay')
const consoleInput    = el('consoleInput')
const charaSpeechText = el('charaSpeechText')

async function sha256(str) {
  const buf = new TextEncoder().encode(str)
  const hash = await crypto.subtle.digest('SHA-256', buf)
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2,'0')).join('')
}
const correct = '621cddf6391aeff30ae73abc836da66074688774e1d72a5a2445e4ec9fbfc2f0'

zero.onclick = () => {
  pwdBox.style.display = 'flex'
  pwdBox.style.opacity = '1'
  pwdInput.value = ''
  errMsg.style.display = 'none'
  pwdInput.focus()
}
pwdInput.addEventListener('keydown', e => { if (e.key === 'Enter') submitBtn.click() })
submitBtn.onclick = async () => {
  const hash = await sha256(pwdInput.value.trim())
  if (hash === correct) startCut()
  else { errMsg.style.display = 'block'; pwdInput.value = ''; pwdInput.focus() }
}

function setCursor() { document.body.classList.add('custom-cursor') }

function startCut() {
  setCursor()
  container.style.transition = 'opacity .6s'
  pwdBox.style.transition    = 'opacity .6s'
  container.style.opacity    = 0
  pwdBox.style.opacity       = 0
  document.body.style.background = '#0d0d0d'

  const fade = document.createElement('div')
  fade.style.cssText = 'position:fixed;inset:0;background:#000;opacity:0;transition:opacity .8s;z-index:15;'
  document.body.appendChild(fade)
  setTimeout(() => fade.style.opacity = '1', 200)
  setTimeout(() => {
    container.style.display = 'none'
    pwdBox.style.display    = 'none'
    document.body.removeChild(fade)
    cutScene.style.display  = 'flex'
    cutScene.style.opacity  = '1'
    showYunyun()
  }, 1100)
}

function showYunyun() {
  setTimeout(() => (yunyun.style.opacity = 1), 200)
  yunyun.addEventListener('click', () => {
    vid.muted   = false
    vid.preload = 'auto'
    vid.play().catch(() => {})
    cutScene.style.transition = 'opacity 1s ease'
    cutScene.style.opacity    = '0'
    setTimeout(() => {
      cutScene.style.display = 'none'
      launchMainScene()
    }, 1000)
  }, { once: true })
}

function launchMainScene() {
  vid.style.display    = 'block'
  vid.style.opacity    = '0'
  vid.style.transition = 'opacity 2s ease'
  setTimeout(() => vid.style.opacity = '1', 50)

  discord.style.display = 'block'
  if (discord.complete && discord.naturalWidth > 0) moveDiscord()
  else discord.onload = () => moveDiscord()
}

function rand(min, max) { return Math.random() * (max - min) + min }
function randSign()     { return Math.random() < 0.5 ? -1 : 1 }

let vw, vh, x, y
let vx = rand(0.4, 1.0) * randSign()
let vy = rand(0.4, 1.0) * randSign()
let rot = rand(0, 360), rotSpeed = rand(-2, 2)
let started = false

function moveDiscord() {
  if (!started) {
    vw = window.innerWidth; vh = window.innerHeight
    x  = rand(0.2 * vw, 0.7 * vw)
    y  = rand(0.2 * vh, 0.7 * vh)
    started = true
  }
  vw = window.innerWidth; vh = window.innerHeight
  x += vx; y += vy
  const w = discord.offsetWidth, h = discord.offsetHeight
  if (x < 0 || x > vw - w) { vx *= -1; vx += rand(-0.3, 0.3) }
  if (y < 0 || y > vh - h) { vy *= -1; vy += rand(-0.3, 0.3) }
  rot += rotSpeed
  discord.style.left      = `${x}px`
  discord.style.top       = `${y}px`
  discord.style.transform = `rotate(${rot}deg)`
  requestAnimationFrame(moveDiscord)
}

let speechTimer = null

function speak(text, duration = 5000) {
  if (wallActive) {
    speakWall(text, duration)
  } else {
    speakConsole(text, duration)
  }
}

function speakConsole(text, duration) {
  clearTimeout(speechTimer)
  charaSpeechText.textContent = text
  charaSpeechText.parentElement.classList.add('show')
  speechTimer = setTimeout(() => {
    charaSpeechText.parentElement.classList.remove('show')
  }, duration)
}

function speakWall(text, duration) {
  clearTimeout(speechTimer)
  wallSpeechText.textContent = text
  wallSpeech.classList.add('show')
  speechTimer = setTimeout(() => {
    wallSpeech.classList.remove('show')
  }, duration)
}

const idleLines = [
  '뭐 필요한 거 있어융?',
  'help 라고 쳐봐융!',
  '심심해융...',
  '여기 왜 왔어융?',
  '…',
  '나 여기 있어융.',
  '뭔가 해봐융.',
]

let idleInterval = null

function startIdle() {
  stopIdle()
  idleInterval = setInterval(() => {
    if (consoleOverlay.style.display === 'flex') {
      const line = idleLines[Math.floor(Math.random() * idleLines.length)]
      speak(line, 5000)
    }
  }, 10000)
}

function stopIdle() {
  clearInterval(idleInterval)
}

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

document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return
  if (wallActive) closeWallBreak()
  else closeConsole()
})
consoleOverlay.addEventListener('click', e => {
  if (e.target !== consoleOverlay) return
  if (wallActive) closeWallBreak()
  else closeConsole()
})

consoleInput.addEventListener('keydown', e => {
  if (e.key !== 'Enter') return
  const raw = consoleInput.value.trim()
  if (!raw) return
  consoleInput.value = ''
  handleCommand(raw.toLowerCase())
})

function handleCommand(cmd) {
  if (COMMANDS[cmd]) COMMANDS[cmd]()
  else speak(`'${cmd}' 는 모르는 명령어에융. help라고 쳐봐융!`)
}

const wallBreak      = document.getElementById('wallBreak')
const wallCharaWrap  = document.getElementById('wallCharaWrap')
const wallPanel      = document.getElementById('wallPanel')
const wallList       = document.getElementById('wallList')
const wallSpeech     = document.getElementById('wallSpeech')
const wallSpeechText = document.getElementById('wallSpeechText')

const HELP_LIST = [
  { cmd: 'help',    desc: '이 목록을 다시 보여줘융!' },
  { cmd: 'mute',    desc: '영상 소리 켜고 끄기에융!' },
  { cmd: 'discord', desc: '디스코드 봇 초대 링크에융!' },
  { cmd: 'close',   desc: '콘솔 닫기에융!' },
]

let wallActive = false

function triggerWallBreak() {
  if (wallActive) return
  wallActive = true

  clearTimeout(speechTimer)
  charaSpeechText.parentElement.classList.remove('show')

  document.getElementById('consoleChara').classList.add('blackout')

  const wrap = document.getElementById('consoleWrap')
  wrap.classList.add('glitch')
  setTimeout(() => wrap.classList.remove('glitch'), 400)

  const noise = document.createElement('div')
  noise.className = 'noise-line'
  document.body.appendChild(noise)
  setTimeout(() => noise.remove(), 900)

  wallList.innerHTML = ''
  HELP_LIST.forEach((item, i) => {
    const div = document.createElement('div')
    div.className = 'wall-cmd'
    div.style.animationDelay = `${0.35 + i * 0.08}s`
    div.innerHTML = `<span class="wall-cmd-name">${item.cmd}</span><span class="wall-cmd-desc">${item.desc}</span>`
    wallList.appendChild(div)
  })

  wallBreak.style.display = 'block'
  requestAnimationFrame(() => {
    wallCharaWrap.classList.add('slide-in')
    wallPanel.classList.add('slide-in')
  })

  consoleInput.placeholder = '이해됐어융?'

  speak('화면 밖에서 알려줄게융!')

}

function closeWallBreak() {
  wallCharaWrap.classList.remove('slide-in')
  wallPanel.classList.remove('slide-in')
  wallCharaWrap.classList.add('slide-out')
  wallPanel.classList.add('slide-out')
  wallSpeech.classList.remove('show')

  document.getElementById('consoleChara').classList.remove('blackout')
  consoleInput.placeholder = '명령어를 입력하세융!'

  setTimeout(() => {
    wallBreak.style.display = 'none'
    wallCharaWrap.classList.remove('slide-out')
    wallPanel.classList.remove('slide-out')
    wallActive = false
  }, 500)
}