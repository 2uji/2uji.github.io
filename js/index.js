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
const muteBtn = el('muteBtn')

async function sha256(str) {
  const buf = new TextEncoder().encode(str)
  const hash = await crypto.subtle.digest('SHA-256', buf)
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('')
}

const correct = '621cddf6391aeff30ae73abc836da66074688774e1d72a5a2445e4ec9fbfc2f0'

zero.onclick = () => {
  pwdBox.style.display = 'flex'
  pwdBox.style.opacity = '1'
  pwdInput.value = ''
  errMsg.style.display = 'none'
  pwdInput.focus()
}

pwdInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') submitBtn.click()
})

submitBtn.onclick = async () => {
  const val = pwdInput.value.trim()
  const hash = await sha256(val)
  if (hash === correct) startCut()
  else {
    errMsg.style.display = 'block'
    pwdInput.value = ''
    pwdInput.focus()
  }
}

function setCursor() {
  document.body.classList.add('custom-cursor')
}

function startCut() {
  setCursor()
  container.style.transition = 'opacity .6s'
  pwdBox.style.transition = 'opacity .6s'
  container.style.opacity = 0
  pwdBox.style.opacity = 0
  document.body.style.background = '#0d0d0d'
  document.body.style.color = '#eee'

  const fade = document.createElement('div')
  fade.style.cssText = 'position:fixed;inset:0;background:#000;opacity:0;transition:opacity .8s;z-index:15;'
  document.body.appendChild(fade)

  setTimeout(() => fade.style.opacity = '1', 200)

  setTimeout(() => {
    container.style.display = 'none'
    pwdBox.style.display = 'none'
    document.body.removeChild(fade)
    cutScene.style.display = 'flex'
    cutScene.style.opacity = '1'
    showYunyun()
  }, 1100)
}

function showYunyun() {
  setTimeout(() => (yunyun.style.opacity = 1), 200)

  yunyun.addEventListener('click', () => {
    vid.muted = false
    vid.preload = 'auto'
    vid.load()
    vid.play().catch(() => {})

    cutScene.style.transition = 'opacity 1s ease'
    cutScene.style.opacity = '0'

    setTimeout(() => {
      cutScene.style.display = 'none'
      launchMainScene()
    }, 1000)
  }, { once: true })
}

function launchMainScene() {
  vid.style.display = 'block'
  vid.style.opacity = '0'
  vid.style.transition = 'opacity 2s ease'
  setTimeout(() => vid.style.opacity = '1', 50)

  muteBtn.style.display = 'block'
  setTimeout(() => muteBtn.style.opacity = '1', 50)

  discord.style.display = 'block'
  moveDiscord()
}

muteBtn.addEventListener('click', () => {
  vid.muted = !vid.muted
  muteBtn.classList.toggle('muted', vid.muted)
})

function rand(min, max) { return Math.random() * (max - min) + min }
function randSign() { return Math.random() < 0.5 ? -1 : 1 }

let vw = window.innerWidth, vh = window.innerHeight
let x = rand(0.2 * vw, 0.7 * vw)
let y = rand(0.2 * vh, 0.7 * vh)
let vx = rand(0.4, 1.0) * randSign()
let vy = rand(0.4, 1.0) * randSign()
let rot = rand(0, 360)
let rotSpeed = rand(-2, 2)

function moveDiscord() {
  vw = window.innerWidth; vh = window.innerHeight
  x += vx; y += vy
  const w = discord.offsetWidth, h = discord.offsetHeight
  if (x < 0 || x > vw - w) { vx *= -1; vx += rand(-0.3, 0.3) }
  if (y < 0 || y > vh - h) { vy *= -1; vy += rand(-0.3, 0.3) }
  rot += rotSpeed
  discord.style.left = `${x}px`
  discord.style.top = `${y}px`
  discord.style.transform = `rotate(${rot}deg)`
  requestAnimationFrame(moveDiscord)
}

discord.addEventListener('click', () => {
  window.open("https://discord.com/oauth2/authorize?client_id=1426139711507923057&permissions=274878221440&scope=bot%20applications.commands", "_blank")
})