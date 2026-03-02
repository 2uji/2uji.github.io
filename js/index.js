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
const consoleInput   = el('consoleInput')
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

let mainSceneActive = false

function launchMainScene() {
  mainSceneActive = true
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
  if (wallActive) speakWall(text, duration)
  else speakConsole(text, duration)
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
    if (accessDeniedActive) return
    if (consoleOverlay.classList.contains('open')) {
      speak(idleLines[Math.floor(Math.random() * idleLines.length)], 5000)
    }
  }, 10000)
}

function stopIdle() { clearInterval(idleInterval) }

document.addEventListener('visibilitychange', () => {
  if (!mainSceneActive) return
  if (document.hidden) {
    document.title = '돌아와융...'
  } else {
    document.title = '404 Not Found'
    if (consoleOverlay.classList.contains('open')) speak('보고싶었어융!')
  }
})

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

const subConsoles = new Map()

const wallBreak     = el('wallBreak')
const wallCharaWrap = el('wallCharaWrap')
const wallPanel     = el('wallPanel')
const wallList      = el('wallList')
const wallSpeech    = el('wallSpeech')
const wallSpeechText = el('wallSpeechText')

let wallActive = false

const HELP_LIST = [
  { cmd: 'help',  desc: '이 목록을 다시 보여줘융!' },
  { cmd: 'mute',  desc: '영상 소리 켜고 끄기에융!' },
  { cmd: 'chat',  desc: '실시간 채팅창 열기에융!' },
  { cmd: 'close', desc: '콘솔 닫기에융!' },
]

const HELP_LIST_ADMIN = [
  { cmd: 'discord', desc: '디스코드 봇 초대 링크에융!' },
  { cmd: 'cloud',   desc: '자료실 불러오기에융!' },
]

function triggerWallBreak() {
  if (wallActive) return
  wallActive = true
  subConsoles.set('wall', closeWallBreak)

  clearTimeout(speechTimer)
  charaSpeechText.parentElement.classList.remove('show')
  el('consoleChara').classList.add('blackout')

  const wrap = el('consoleWrap')
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

  if (window.isAdmin && HELP_LIST_ADMIN.length > 0) {
    const divider = document.createElement('div')
    divider.className = 'wall-cmd-divider'
    divider.style.animationDelay = `${0.35 + HELP_LIST.length * 0.08}s`
    wallList.appendChild(divider)
    HELP_LIST_ADMIN.forEach((item, i) => {
      const div = document.createElement('div')
      div.className = 'wall-cmd wall-cmd-admin'
      div.style.animationDelay = `${0.35 + (HELP_LIST.length + 1 + i) * 0.08}s`
      div.innerHTML = `<span class="wall-cmd-name">${item.cmd}</span><span class="wall-cmd-desc">${item.desc}</span>`
      wallList.appendChild(div)
    })
  }

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
  el('consoleChara').classList.remove('blackout')
  consoleInput.placeholder = '명령어를 입력하세융!'

  setTimeout(() => {
    wallBreak.style.display = 'none'
    wallCharaWrap.classList.remove('slide-out')
    wallPanel.classList.remove('slide-out')
    wallActive = false
    subConsoles.delete('wall')
  }, 500)
}

const chatBox             = el('chatBox')
const chatMessages        = el('chatMessages')
const chatNameInput       = el('chatNameInput')
const chatTextInput       = el('chatTextInput')
const chatUserCount       = el('chatUserCount')
const chatUserList        = el('chatUserList')
const chatToggleList      = el('chatToggleList')
const chatClose           = el('chatClose')
const chatHeader          = el('chatHeader')
const chatColorBar        = el('chatColorBar')
const chatColorPreview    = el('chatColorPreview')
const chatImageFile       = el('chatImageFile')
const chatImagePreview    = el('chatImagePreview')
const chatImagePreviewImg = el('chatImagePreviewImg')
const chatImagePreviewName = el('chatImagePreviewName')
const chatImageClear      = el('chatImageClear')
const chatActColorBtn     = el('chatActColorBtn')
const chatActImgBtn       = el('chatActImgBtn')
const chatActSendBtn      = el('chatActSendBtn')
const sliderR = el('sliderR'), sliderG = el('sliderG'), sliderB = el('sliderB')
const valR = el('valR'), valG = el('valG'), valB = el('valB')

let nameColor = 'rgb(176,127,255)'
window.nameColor = nameColor
let pendingImage = null

function openChat() {
  chatBox.classList.add('open')
  subConsoles.set('chat', closeChat)
  updateChatUsers(['방문자1', '방문자2', '방문자3'])
  addChatMessage('융융', '어서오세융! 채팅으로 대화해봐융!(아직 서버 연동이 되지 않았습니다.)')
}

function closeChat() {
  chatBox.classList.remove('open')
  subConsoles.delete('chat')
}

function updateChatUsers(users) {
  chatUserCount.textContent = users.length
  chatUserList.innerHTML = ''
  users.forEach(name => {
    const div = document.createElement('div')
    div.className = 'chat-user-item'
    div.textContent = name
    chatUserList.appendChild(div)
  })
}

function addChatMessage(name, text, isSystem = false, imgSrc = null, isAdminMsg = false) {
  const div = document.createElement('div')
  div.className = 'chat-msg'

  const nameEl = document.createElement('span')
  nameEl.className = 'chat-msg-name' + (isAdminMsg ? ' admin' : '')
  nameEl.textContent = name
  if (isAdminMsg) nameEl.style.color = nameColor
  else nameEl.style.color = isSystem ? '#b07fff' : nameColor
  div.appendChild(nameEl)

  if (text) {
    const textEl = document.createElement('span')
    textEl.className = 'chat-msg-text'
    textEl.textContent = text
    div.appendChild(textEl)
  }

  if (imgSrc) {
    const img = document.createElement('img')
    img.className = 'chat-msg-img'
    img.src = imgSrc
    img.onclick = () => window.open(imgSrc, '_blank')
    div.appendChild(img)
  }

  chatMessages.appendChild(div)
  chatMessages.scrollTop = chatMessages.scrollHeight
}

function sendChatMessage() {
  const name = chatNameInput.value.trim() || '익명'
  const text = chatTextInput.value.trim()
  if (!text && !pendingImage) return
  addChatMessage(name, text || null, false, pendingImage, window.isAdmin)
  chatTextInput.value = ''
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

function updateColor() {
  const r = sliderR.value, g = sliderG.value, b = sliderB.value
  valR.value = r; valG.value = g; valB.value = b
  nameColor = `rgb(${r},${g},${b})`
  window.nameColor = nameColor
  const name = chatNameInput.value.trim() || '이름'
  chatColorPreview.textContent = name
  chatColorPreview.style.color = nameColor
  if (window.isAdmin) {
    const dim = `rgb(${Math.floor(r*0.6)},${Math.floor(g*0.6)},${Math.floor(b*0.6)})`
    document.documentElement.style.setProperty('--admin-badge-color', `linear-gradient(90deg, ${dim}, ${nameColor})`)
  }
}

function clamp(v) { return Math.max(0, Math.min(255, parseInt(v) || 0)) }

sliderR.addEventListener('input', () => { valR.value = sliderR.value; updateColor() })
sliderG.addEventListener('input', () => { valG.value = sliderG.value; updateColor() })
sliderB.addEventListener('input', () => { valB.value = sliderB.value; updateColor() })
valR.addEventListener('input', () => { sliderR.value = clamp(valR.value); updateColor() })
valG.addEventListener('input', () => { sliderG.value = clamp(valG.value); updateColor() })
valB.addEventListener('input', () => { sliderB.value = clamp(valB.value); updateColor() })
chatNameInput.addEventListener('input', updateColor)

chatActColorBtn.addEventListener('click', () => {
  chatColorBar.classList.toggle('show')
  updateColor()
})
chatClose.addEventListener('click', closeChat)
chatActSendBtn.addEventListener('click', sendChatMessage)
chatTextInput.addEventListener('keydown', e => { if (e.key === 'Enter') sendChatMessage() })
chatActImgBtn.addEventListener('click', () => chatImageFile.click())
chatImageClear.addEventListener('click', clearImagePreview)
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
chatToggleList.addEventListener('click', () => {
  chatUserList.classList.toggle('show')
  chatToggleList.textContent = chatUserList.classList.contains('show') ? '접기' : '명단'
})

let dragOffsetX = 0, dragOffsetY = 0, isDragging = false

chatHeader.addEventListener('mousedown', e => {
  isDragging = true
  const rect = chatBox.getBoundingClientRect()
  dragOffsetX = e.clientX - rect.left
  dragOffsetY = e.clientY - rect.top
  chatBox.style.transition = 'none'
  chatBox.style.bottom = 'auto'
  chatBox.style.left = rect.left + 'px'
  chatBox.style.top  = rect.top  + 'px'
})

const chatResizeE = el('chatResizeE')
const chatResizeN = el('chatResizeN')
let resizeDir = null
let resizeStartX = 0, resizeStartY = 0, resizeStartW = 0, resizeStartH = 0, resizeStartTop = 0

chatResizeE.addEventListener('mousedown', e => {
  e.stopPropagation()
  resizeDir = 'e'
  resizeStartX = e.clientX
  resizeStartW = chatBox.offsetWidth
})
chatResizeN.addEventListener('mousedown', e => {
  e.stopPropagation()
  resizeDir = 'n'
  resizeStartY = e.clientY
  resizeStartH = chatMessages.offsetHeight
  const rect = chatBox.getBoundingClientRect()
  resizeStartTop = rect.top
})

document.addEventListener('mousemove', e => {
  if (isDragging) {
    chatBox.style.left = (e.clientX - dragOffsetX) + 'px'
    chatBox.style.top  = (e.clientY - dragOffsetY) + 'px'
  }
  if (resizeDir === 'e') {
    const newW = Math.min(600, Math.max(240, resizeStartW + (e.clientX - resizeStartX)))
    chatBox.style.width = newW + 'px'
  } else if (resizeDir === 'n') {
    const delta = resizeStartY - e.clientY
    const newH = Math.min(500, Math.max(100, resizeStartH + delta))
    chatMessages.style.height = newH + 'px'
    chatBox.style.bottom = 'auto'
    chatBox.style.top = (resizeStartTop - delta) + 'px'
  }
})
document.addEventListener('mouseup', () => { isDragging = false; resizeDir = null })

// ── 클라우드 ───────────────────────────────────────────────
const cloudOverlay = el('cloudOverlay')
const cloudList    = el('cloudList')
const cloudStatus  = el('cloudStatus')
const cloudEmpty   = el('cloudEmpty')
const cloudClose   = el('cloudClose')

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / 1024 / 1024).toFixed(1) + ' MB'
}

async function openCloud() {
  cloudOverlay.classList.add('open')
  subConsoles.set('cloud', closeCloud)
  cloudList.innerHTML = ''
  cloudEmpty.style.display = 'none'
  cloudStatus.textContent = '불러오는 중...'

  try {
    const res = await fetch('https://api.github.com/repos/2uji/cloud/contents')
    if (!res.ok) throw new Error(res.status)
    const files = (await res.json()).filter(f => f.type === 'file')
    cloudStatus.textContent = `파일 ${files.length}개`
    if (files.length === 0) { cloudEmpty.style.display = 'block'; return }
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
  } catch {
    cloudStatus.textContent = '불러오기 실패... 잠시 후 다시 시도해봐융!'
  }
}

function closeCloud() {
  cloudOverlay.classList.remove('open')
  subConsoles.delete('cloud')
}

cloudClose.addEventListener('click', closeCloud)
cloudOverlay.addEventListener('click', e => { if (e.target === cloudOverlay) closeCloud() })

let accessDeniedActive = false

function triggerAccessDenied() {
  accessDeniedActive = true
  const wrap  = el('consoleWrap')
  const chara = el('consoleChara')

  wrap.classList.add('glitch-red')
  setTimeout(() => wrap.classList.remove('glitch-red'), 500)

  const noise = document.createElement('div')
  noise.className = 'noise-line noise-line-red'
  document.body.appendChild(noise)
  setTimeout(() => noise.remove(), 900)

  subConsoles.forEach(fn => fn())

  chara.classList.add('blackout')
  chara.style.overflow = 'visible'
  const warn = document.createElement('img')
  warn.src = 'assets/warning.png'
  warn.className = 'deny-warning'
  chara.appendChild(warn)
  requestAnimationFrame(() => warn.classList.add('show'))

  clearTimeout(speechTimer)
  charaSpeechText.parentElement.classList.remove('show')
  const nameEl = el('charaSpeechName')
  const prevColor = nameEl.style.color
  nameEl.style.color = '#ff3b3b'
  charaSpeechText.textContent = '...너 누구에융.'
  charaSpeechText.parentElement.classList.add('show')

  consoleInput.disabled = true
  consoleInput.placeholder = '접근 거부에융.'

  setTimeout(() => {
    warn.classList.remove('show')
    setTimeout(() => { warn.remove(); chara.style.overflow = 'hidden' }, 300)
    chara.classList.remove('blackout')
    charaSpeechText.parentElement.classList.remove('show')
    nameEl.style.color = prevColor
    consoleInput.disabled = false
    consoleInput.placeholder = '명령어를 입력하세융!'
    accessDeniedActive = false
  }, 7000)
}

