const el = id => document.getElementById(id)
const zero           = el('zero')
const pwdBox         = el('passwordToggle')
const pwdInput       = el('passwordInput')
const submitBtn      = el('submitPassword')
const errMsg         = el('errorMsg')
const container      = el('container')
const cutScene       = el('cutScene')
const yunyun         = el('yunyun')
const vid            = el('video-bg')
const discord        = el('discord')
const consoleOverlay = el('consoleOverlay')
const consoleLog     = el('consoleLog')
const consoleInput   = el('consoleInput')

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
    vid.load()
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
  vid.style.cssText = 'display:block;opacity:0;transition:opacity 2s ease;'
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

discord.addEventListener('click', openConsole)

function openConsole() {
  consoleOverlay.classList.add('open')
  consoleInput.focus()
  if (consoleLog.children.length === 0) printLine('system', '명령어를 입력하세융! 도움말: help')
}

function closeConsole() {
  consoleOverlay.classList.remove('open')
  consoleInput.value = ''
}

document.addEventListener('keydown', e => { if (e.key === 'Escape') closeConsole() })
consoleOverlay.addEventListener('click', e => { if (e.target === consoleOverlay) closeConsole() })

function printLine(type, text) {
  const div = document.createElement('div')
  div.className = `cl-line cl-${type}`
  div.textContent = text
  consoleLog.appendChild(div)
  consoleLog.scrollTop = consoleLog.scrollHeight
}

consoleInput.addEventListener('keydown', e => {
  if (e.key !== 'Enter') return
  const raw = consoleInput.value.trim()
  if (!raw) return
  printLine('input', '> ' + raw)
  consoleInput.value = ''
  handleCommand(raw.toLowerCase())
})

const COMMANDS = {
  help() {
    printLine('res', '사용 가능한 명령어에융!')
    printLine('res', '  discord  — 융융 디스코드 봇 초대 링크에융!')
    printLine('res', '  mute     — 뮤트/언뮤트에융!')
    printLine('res', '  clear    — 콘솔 지우개에융!')
    printLine('res', '  close    — 콘솔 닫기에융!')
  },
  mute() {
    vid.muted = !vid.muted
    printLine('res', vid.muted ? '조용해졌어융!' : '시끄러워졌어융!')
  },
  discord() {
    printLine('res', '융융 봇 로딩 중이에융...')
    setTimeout(() => window.open(
      'https://discord.com/oauth2/authorize?client_id=1426139711507923057&permissions=274878221440&scope=bot%20applications.commands',
      '_blank'
    ), 400)
  },
  clear() { consoleLog.innerHTML = '' },
  close() {
    printLine('res', '콘솔을 닫을게융!')
    setTimeout(closeConsole, 500)
  }
}

function handleCommand(cmd) {
  if (COMMANDS[cmd]) COMMANDS[cmd]()
  else printLine('err', `'${cmd}' 는 알 수 없는 명령어에융!`)
}