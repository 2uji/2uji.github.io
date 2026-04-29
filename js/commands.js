const WORKER_URL = 'https://yunyun-proxy.vercel.app/api/chat'
const aiHistory = []
let yunyunChatActive = false
const ADMIN_CMDS = ['discord', 'cloud', 'clear']

const yungpt = document.getElementById('yungpt')
const yungptMessages = document.getElementById('yungpt-messages')
const yungptInput = document.getElementById('yungpt-input')
const yungptClose = document.getElementById('yungpt-close')

const _consoleChara = document.getElementById('consoleChara')
const _consoleInputRow = document.getElementById('consoleInputRow')

function openYungpt() {
  aiHistory.length = 0
  yungptMessages.innerHTML = ''

  _consoleChara.style.display = 'none'
  _consoleInputRow.style.display = 'none'

  consoleWrap.style.transition = 'width .5s cubic-bezier(.22,1,.36,1), height .5s cubic-bezier(.22,1,.36,1), border-radius .5s ease'
  consoleWrap.style.width = '680px'
  consoleWrap.style.height = '520px'
  consoleWrap.style.borderRadius = '20px'

  const vw = window.innerWidth
  const vh = window.innerHeight
  consoleWrap.style.position = 'fixed'
  consoleWrap.style.left = (vw / 2 - 340) + 'px'
  consoleWrap.style.top = (vh / 2 - 260) + 'px'
  consoleWrap.style.transform = 'none'

  yungpt.classList.add('open')
  yunyunChatActive = true

  setTimeout(() => {
    yungptInput.focus()
    _ygptAppend('bot', '어서오세요 주인님! 뭐든 물어보세융!')
  }, 400)
}

function closeYungpt() {
  yungpt.classList.remove('open')
  yunyunChatActive = false

  _consoleChara.style.display = ''
  _consoleInputRow.style.display = ''

  consoleWrap.style.position = ''
  consoleWrap.style.left = ''
  consoleWrap.style.top = ''
  consoleWrap.style.transform = ''
  consoleWrap.style.width = ''
  consoleWrap.style.height = ''
  consoleWrap.style.borderRadius = ''

  if (charaMode === 'help' || charaMode === 'chat') {
    _exitCurrentChara(null)
  }

  speak('또 얘기해융!', 2000)
  consoleInput.focus()
}

function _ygptAppend(role, text) {
  const wrap = document.createElement('div')
  wrap.className = `ygpt-msg ${role}`

  const label = document.createElement('div')
  label.className = 'ygpt-msg-label'
  label.textContent = role === 'user' ? 'YOU' : 'YUNGPT'

  const bubble = document.createElement('div')
  bubble.className = 'ygpt-msg-text'
  bubble.textContent = text

  wrap.appendChild(label)
  wrap.appendChild(bubble)
  yungptMessages.appendChild(wrap)
  yungptMessages.scrollTop = yungptMessages.scrollHeight
  return wrap
}

function _ygptTyping() {
  const wrap = document.createElement('div')
  wrap.className = 'ygpt-msg bot ygpt-typing'

  const label = document.createElement('div')
  label.className = 'ygpt-msg-label'
  label.textContent = 'YUNGPT'

  const bubble = document.createElement('div')
  bubble.className = 'ygpt-msg-text'
  bubble.innerHTML = `
    <span class="ygpt-dot">●</span>
    <span class="ygpt-dot">●</span>
    <span class="ygpt-dot">●</span>
  `

  wrap.appendChild(label)
  wrap.appendChild(bubble)
  yungptMessages.appendChild(wrap)
  yungptMessages.scrollTop = yungptMessages.scrollHeight
  return wrap
}

yungptInput.addEventListener('keydown', e => {
  if (e.key !== 'Enter') return
  const text = yungptInput.value.trim()
  if (!text) return
  yungptInput.value = ''
  _ygptAppend('user', text)
  sendToYunyun(text)
})

yungptClose.addEventListener('click', closeYungpt)

const yungptHeader = document.getElementById('yungpt-header')
let _dragActive = false, _dragOffX = 0, _dragOffY = 0

yungptHeader.style.cursor = 'grab'

yungptHeader.addEventListener('mousedown', e => {
  if (!yunyunChatActive) return
  _dragActive = true
  const rect = consoleWrap.getBoundingClientRect()
  _dragOffX = e.clientX - rect.left
  _dragOffY = e.clientY - rect.top
  consoleWrap.style.transition = 'none'
  document.body.style.userSelect = 'none'
  yungptHeader.style.cursor = 'grabbing'
})

document.addEventListener('mousemove', e => {
  if (_dragActive) {
    const vw = window.innerWidth, vh = window.innerHeight
    const w = consoleWrap.offsetWidth, h = consoleWrap.offsetHeight
    let x = e.clientX - _dragOffX
    let y = e.clientY - _dragOffY
    x = Math.max(0, Math.min(x, vw - w))
    y = Math.max(0, Math.min(y, vh - h))
    consoleWrap.style.left = x + 'px'
    consoleWrap.style.top = y + 'px'
  }
})

document.addEventListener('mouseup', () => {
  if (_dragActive) {
    _dragActive = false
    document.body.style.userSelect = ''
    yungptHeader.style.cursor = 'grab'
  }
})

;(function () {
  const MIN_W = 400
  const MIN_H = 300
  const MAX_W = () => Math.min(1200, window.innerWidth - 40)
  const MAX_H = () => Math.min(900, window.innerHeight - 40)

  let resizing = null

  // cursor.cur = 기본, cursor2.cur = pointer, cursor3.cur = ew-resize, cursor5.cur = ns-resize
  const EDGES = [
    { id: 'e', style: 'right:-5px; top:8px; bottom:8px; width:10px;', cur: "url('../assets/cursor3.cur'), ew-resize" },
    { id: 's', style: 'bottom:-5px; left:8px; right:8px; height:10px;', cur: "url('../assets/cursor5.cur'), ns-resize" },
    { id: 'w', style: 'left:-5px; top:8px; bottom:8px; width:10px;', cur: "url('../assets/cursor3.cur'), ew-resize" },
    { id: 'n', style: 'top:-5px; left:8px; right:8px; height:10px;', cur: "url('../assets/cursor5.cur'), ns-resize" },
  ]

  EDGES.forEach(({ id, style, cur }) => {
    const handle = document.createElement('div')
    handle.dataset.resizeEdge = id
    handle.style.cssText = `position:absolute; z-index:100; ${style} cursor:${cur};`

    handle.addEventListener('mousedown', e => {
      e.preventDefault()
      e.stopPropagation()
      const rect = consoleWrap.getBoundingClientRect()
      resizing = {
        edge: id,
        startX: e.clientX,
        startY: e.clientY,
        startW: rect.width,
        startH: rect.height,
        startL: rect.left,
        startT: rect.top,
      }
      document.body.style.userSelect = 'none'
      document.body.style.cursor = cur
    })

    consoleWrap.appendChild(handle)
  })

  document.addEventListener('mousemove', e => {
    if (!resizing || !yunyunChatActive) return
    const { edge, startX, startY, startW, startH, startL, startT } = resizing
    const dx = e.clientX - startX
    const dy = e.clientY - startY

    let newW = startW, newH = startH

    if (edge === 'e') newW = startW + dx
    if (edge === 'w') {
      newW = startW - dx
      if (newW >= MIN_W && newW <= MAX_W()) {
        consoleWrap.style.left = (startL + dx) + 'px'
      }
    }
    if (edge === 's') newH = startH + dy
    if (edge === 'n') {
      newH = startH - dy
      if (newH >= MIN_H && newH <= MAX_H()) {
        consoleWrap.style.top = (startT + dy) + 'px'
      }
    }

    newW = Math.min(MAX_W(), Math.max(MIN_W, newW))
    newH = Math.min(MAX_H(), Math.max(MIN_H, newH))

    consoleWrap.style.transition = 'none'
    consoleWrap.style.width = newW + 'px'
    consoleWrap.style.height = newH + 'px'
  })

  document.addEventListener('mouseup', () => {
    if (!resizing) return
    resizing = null
    document.body.style.userSelect = ''
    document.body.style.cursor = ''
  })
})()

async function sendToYunyun(text) {
  const typing = _ygptTyping()
  aiHistory.push({ role: 'user', content: text })

  try {
    const res = await fetch(WORKER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: aiHistory }),
    })

    const data = await res.json()
    typing.remove()

    if (data.error) {
      _ygptAppend('bot', `오류가 났에융... (${data.error.message})`)
      return
    }

    const reply = data.content
      ?.filter(b => b.type === 'text' && b.text?.trim())
      .map(b => b.text.trim())
      .join('\n') || '음... 잘 모르겠에융!'

    aiHistory.push({ role: 'assistant', content: reply })

    const modes = ['help', 'chat']
    const mode = modes[Math.floor(Math.random() * modes.length)]
    el('wallChara').src = _randomCharaGif()
    wallBreak.style.display = 'block'
    wallCharaWrap.classList.remove('mode-help', 'mode-chat', 'slide-in', 'slide-out')
    wallCharaWrap.classList.add(`mode-${mode}`)
    requestAnimationFrame(() => wallCharaWrap.classList.add('slide-in'))
    charaMode = mode

    _ygptAppend('bot', reply)
    speakWall(reply.length > 40 ? reply.slice(0, 40) + '...' : reply, 5000)

  } catch (e) {
    typing.remove()
    _ygptAppend('bot', '통신 오류에융... 다시 시도해봐융!')
  }
}

const COMMANDS = {
  omok() { openOmok() },
  help() { triggerWallBreak() },
  mute() {
    vid.muted = !vid.muted
    speak(vid.muted ? '조용해졌어융!' : '시끄러워졌어융!')
  },
  discord() {
    speak('디스코드 봇 초대 링크 열게융!')
    setTimeout(() => window.open(
      'https://discord.com/oauth2/authorize?client_id=1426139711507923057&permissions=274878221440&scope=bot%20applications.commands',
      '_blank'
    ), 400)
  },
  chat() { openChat() },
  close() {
    speak('잘가융!', 1200)
    setTimeout(() => {
      closeAll()
      setTimeout(closeConsole, 100)
    }, 1300)
  },
  machu() {
    if (charaMode === 'help') {
      wallList.innerHTML = ''
      HELP_LIST.forEach((item, i) => wallList.appendChild(_wallCmd(item, i)))
      const div = document.createElement('div')
      div.className = 'wall-cmd-divider'
      div.style.animationDelay = `${0.35 + HELP_LIST.length * 0.08}s`
      wallList.appendChild(div)
      HELP_LIST_ADMIN.forEach((item, i) =>
        wallList.appendChild(_wallCmd(item, HELP_LIST.length + 1 + i, true)))
    }
    if (isAdmin) { speak('이미 어드민이에융!'); return }
    isAdmin = true
    window.isAdmin = true

    sliderR.value = 255; valR.value = 255
    sliderG.value = 215; valG.value = 215
    sliderB.value = 0;   valB.value = 0
    updateColor()

    const wrap = document.getElementById('consoleWrap')
    wrap.classList.add('glitch')
    setTimeout(() => wrap.classList.remove('glitch'), 400)

    const noise = document.createElement('div')
    noise.className = 'noise-line'
    document.body.appendChild(noise)
    setTimeout(() => noise.remove(), 900)

    setTimeout(() => speak('주인님 어서오세융!'), 300)
  },
  cloud() { openCloud() },
  clear() {
    messagesRef.remove()
    chatMessages.innerHTML = ''
    speak('채팅 청소했어융!')
  },
  yunyun() {
    if (!isAdmin) { triggerAccessDenied(); return }
    openYungpt()
  },
}

function handleCommand(cmd) {
  if (yunyunChatActive) {
    if (cmd === 'exit') {
      closeYungpt()
      return
    }
    return
  }
  if (ADMIN_CMDS.includes(cmd) && !isAdmin) {
    triggerAccessDenied()
    return
  }
  if (COMMANDS[cmd]) COMMANDS[cmd]()
  else speak(`'${cmd}' 는 모르는 명령어에융. help라고 쳐봐융!`)
}
