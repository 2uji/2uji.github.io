const BOARD_SIZE = 15
const CELL_SIZE = 28
const BOARD_PX = CELL_SIZE * (BOARD_SIZE - 1)

const omokRef = db.ref('omok')

const omokBox = document.createElement('div')
omokBox.id = 'omokBox'
document.body.appendChild(omokBox)

omokBox.innerHTML = `
  <div id="omokHeader">
    <span id="omokTitle">// OMOK</span>
    <div id="omokHeaderRight">
      <span id="omokStatus">대기 중...</span>
      <span id="omokClose">✕</span>
    </div>
  </div>
  <div id="omokBody">
    <canvas id="omokCanvas" width="${BOARD_PX + CELL_SIZE}" height="${BOARD_PX + CELL_SIZE}"></canvas>
    <div id="omokWinOverlay">
      <img id="omokWinImg" src="assets/win.gif" alt="">
      <div id="omokQSpeech">
        <span id="omokQName">Q</span>
        <span id="omokQText"></span>
      </div>
    </div>
  </div>
  <div id="omokFooter">
    <div id="omokInfo"></div>
    <div id="omokBtnRow">
      <button id="omokJoinBlack">⚫ 흑 참여</button>
      <button id="omokJoinWhite">⚪ 백 참여</button>
      <button id="omokResign" style="display:none">기권</button>
      <button id="omokReset"  style="display:none">새 게임</button>
    </div>
  </div>
`

const omokStyle = document.createElement('style')
omokStyle.textContent = `
#omokBox {
  position: fixed;
  display: none;
  flex-direction: column;
  z-index: 40;
  font-family: 'Courier New', monospace;
  user-select: none;
  background: rgba(8,1,18,0.97);
  border: 1px solid rgba(180,120,255,0.4);
  border-radius: 12px;
  box-shadow: 0 8px 40px rgba(80,20,160,0.4);
  overflow: hidden;
}
#omokBox.open { display: flex; }
#omokHeader {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 14px;
  border-bottom: 1px solid rgba(180,120,255,0.2);
  cursor: grab;
  background: rgba(10,2,20,0.95);
}
#omokHeader:active { cursor: grabbing; }
#omokTitle { font-size:11px; color:#b07fff; letter-spacing:.12em; }
#omokHeaderRight { display:flex; align-items:center; gap:10px; }
#omokStatus { font-size:11px; color:#7a5599; }
#omokClose { font-size:13px; color:#7a5599; cursor:pointer; transition:color .2s; }
#omokClose:hover { color:#ff6b6b; }
#omokBody {
  padding: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}
#omokCanvas { display:block; border-radius:4px; }
#omokFooter {
  padding: 8px 14px 12px;
  border-top: 1px solid rgba(180,120,255,0.15);
  display: flex;
  flex-direction: column;
  gap: 8px;
}
#omokInfo { font-size:11px; color:#7a5599; min-height:16px; text-align:center; }
#omokBtnRow { display:flex; gap:8px; justify-content:center; }
#omokBtnRow button {
  background: transparent;
  border: 1px solid rgba(180,120,255,0.3);
  border-radius: 6px;
  color: #b07fff;
  font-family: 'Courier New', monospace;
  font-size: 11px;
  padding: 5px 12px;
  cursor: pointer;
  transition: background .2s, border-color .2s;
}
#omokBtnRow button:hover { background:rgba(180,120,255,0.12); border-color:rgba(180,120,255,0.6); }
#omokBtnRow button:disabled { opacity:.35; cursor:not-allowed; }
#omokWinOverlay {
  position: absolute;
  inset: 0;
  display: none;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: rgba(8,1,18,0.6);
  border-radius: 4px;
  pointer-events: none;
}
#omokWinOverlay.show {
  display: flex;
  pointer-events: all;
  animation: winFadeIn .4s ease forwards;
}
#omokWinImg {
  max-width: 80%;
  max-height: 70%;
  object-fit: contain;
  filter: drop-shadow(0 0 24px rgba(180,120,255,0.9));
  animation: winPop .5s cubic-bezier(.22,1,.36,1) forwards;
}
#omokQSpeech {
  position: absolute;
  bottom: 14px; left: 12px; right: 12px;
  background: rgba(10,2,25,0.88);
  border: 1px solid rgba(180,120,255,0.35);
  border-radius: 8px;
  padding: 8px 12px;
  display: flex;
  gap: 8px;
  align-items: baseline;
  backdrop-filter: blur(4px);
  opacity: 0;
  transition: opacity .4s ease .5s;
}
#omokWinOverlay.show #omokQSpeech { opacity:1; }
#omokQName { font-size:12px; font-weight:600; color:#ff9ef7; white-space:nowrap; font-family:'Inter',monospace; flex-shrink:0; }
#omokQText { font-size:13px; color:#e0ccff; font-family:'Inter',monospace; line-height:1.5; }
@keyframes winFadeIn { from { opacity:0; } to { opacity:1; } }
@keyframes winPop {
  0%   { transform:scale(.7); opacity:0; }
  60%  { transform:scale(1.08); opacity:1; }
  100% { transform:scale(1); opacity:1; }
}
body.custom-cursor #omokJoinBlack,
body.custom-cursor #omokJoinWhite,
body.custom-cursor #omokResign,
body.custom-cursor #omokReset,
body.custom-cursor #omokClose { cursor:url('assets/cursor2.cur'),pointer; }
body.custom-cursor #omokJoinBlack:disabled,
body.custom-cursor #omokJoinWhite:disabled { cursor:url('assets/cursor6.cur'),not-allowed; }
body.custom-cursor #omokCanvas { cursor:url('assets/cursor2.cur'),crosshair; }
`
document.head.appendChild(omokStyle)

const omokCanvas = document.getElementById('omokCanvas')
const omokCtx = omokCanvas.getContext('2d')
const omokCloseBtn = document.getElementById('omokClose')
const omokStatusEl = document.getElementById('omokStatus')
const omokInfoEl = document.getElementById('omokInfo')
const omokJoinBlack = document.getElementById('omokJoinBlack')
const omokJoinWhite = document.getElementById('omokJoinWhite')
const omokResignBtn = document.getElementById('omokResign')
const omokResetBtn = document.getElementById('omokReset')
const omokHeaderEl = document.getElementById('omokHeader')
const omokWinOverlay = document.getElementById('omokWinOverlay')
const omokQText = document.getElementById('omokQText')

let omokRole = null
let omokMyName = ''
let omokGameData = null
let omokListeners = []
let omokWinSpoken = false

PanelManager.register('omok', omokBox, {
  getAnchor: () => chatBox.classList.contains('open') ? chatBox.getBoundingClientRect() : null,
  side: 'left',
})

function openOmok() {
  if (!chatBox.classList.contains('open')) {
    speak('채팅창을 먼저 열어봐융! chat 이라고 쳐봐융!')
    return
  }
  omokBox.style.display = 'flex'
  omokBox.classList.add('open')
  subConsoles.set('omok', closeOmok)
  startOmokListeners()
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      PanelManager.place('omok')
      speak('오목 게임이에융!')
    })
  })
}

function closeOmok() {
  omokBox.classList.remove('open')
  omokBox.style.display = ''
  subConsoles.delete('omok')
  stopOmokListeners()

  omokRef.set(defaultGame())
  if (omokRole && omokRole !== 'spectator') {
    omokRef.onDisconnect().cancel()
  }
  omokRole = null
  omokMyName = ''
}

let omokDragging = false, omokDragOffX = 0, omokDragOffY = 0

omokHeaderEl.addEventListener('mousedown', e => {
  omokDragging = true
  const rect = omokBox.getBoundingClientRect()
  omokDragOffX = e.clientX - rect.left
  omokDragOffY = e.clientY - rect.top
  omokBox.style.transition = 'none'
})
document.addEventListener('mousemove', e => {
  if (!omokDragging) return
  omokBox.style.left = (e.clientX - omokDragOffX) + 'px'
  omokBox.style.top = (e.clientY - omokDragOffY) + 'px'
})
document.addEventListener('mouseup', () => {
  if (omokDragging) PanelManager.clamp('omok')
  omokDragging = false
})

function defaultGame() {
  return {
    board: Array(BOARD_SIZE * BOARD_SIZE).fill(0),
    turn: 1,
    black: null,
    white: null,
    blackSession: null,
    whiteSession: null,
    winner: null,
    started: false,
  }
}

function startOmokListeners() {
  const cb = omokRef.on('value', snap => { omokGameData = snap.val(); renderOmok() })
  omokListeners.push(() => omokRef.off('value', cb))
}

function stopOmokListeners() {
  omokListeners.forEach(fn => fn())
  omokListeners = []
  omokGameData = null
}

function joinOmok(color) {
  omokMyName = chatNameInput.value.trim() || '익명'
  const field = color === 'black' ? 'black' : 'white'
  const oppSession = color === 'black' ? 'whiteSession' : 'blackSession'
  const mySession = color === 'black' ? 'blackSession' : 'whiteSession'

  omokRef.transaction(data => {
    if (!data) data = defaultGame()
    if (data[oppSession] === sessionId) return undefined
    if (data[field]) return undefined
    data[field] = omokMyName
    data[mySession] = sessionId
    if (data.black && data.white) data.started = true
    return data
  }, (err, committed, snapshot) => {
    if (!committed) {
      const d = snapshot?.val()
      speak(d?.[oppSession] === sessionId
        ? '같은 사람이 흑백 둘 다 할 수 없어융!'
        : '이미 자리가 찼어융!')
      return
    }
    omokRole = color
    omokRef.onDisconnect().set(defaultGame())
    speak(color === 'black' ? '흑으로 참여했어융!' : '백으로 참여했어융!')
  })
}

omokJoinBlack.addEventListener('click', () => {
  if (omokGameData?.black) { speak('흑 자리는 이미 찼어융!'); return }
  joinOmok('black')
})
omokJoinWhite.addEventListener('click', () => {
  if (omokGameData?.white) { speak('백 자리는 이미 찼어융!'); return }
  joinOmok('white')
})

omokResignBtn.addEventListener('click', () => {
  if (!omokRole || omokRole === 'spectator') return
  omokRef.update({ winner: omokRole === 'black' ? 'white' : 'black' })
})

omokResetBtn.addEventListener('click', () => {
  omokRef.set(defaultGame())
  omokRole = null
  omokMyName = ''
  speak('새 게임 시작이에융!')
})

omokCanvas.addEventListener('click', e => {
  if (!omokGameData?.started || omokGameData.winner) return
  if (!omokRole || omokRole === 'spectator') return
  const myStone = omokRole === 'black' ? 1 : 2
  if (omokGameData.turn !== myStone) return

  const rect = omokCanvas.getBoundingClientRect()
  const offset = CELL_SIZE / 2
  const col = Math.round((e.clientX - rect.left - offset) / CELL_SIZE)
  const row = Math.round((e.clientY - rect.top - offset) / CELL_SIZE)
  if (col < 0 || col >= BOARD_SIZE || row < 0 || row >= BOARD_SIZE) return

  const idx = row * BOARD_SIZE + col
  if (omokGameData.board[idx] !== 0) return

  const newBoard = [...omokGameData.board]
  newBoard[idx] = myStone
  omokRef.update({
    board: newBoard,
    turn: omokGameData.turn === 1 ? 2 : 1,
    winner: checkWin(newBoard, row, col, myStone)
      ? (omokRole === 'black' ? 'black' : 'white')
      : null,
  })
})

function checkWin(board, row, col, stone) {
  const dirs = [[0, 1], [1, 0], [1, 1], [1, -1]]
  for (const [dr, dc] of dirs) {
    let count = 1
    for (let d = 1; d < 5; d++) {
      const r = row + dr * d, c = col + dc * d
      if (r < 0 || r >= BOARD_SIZE || c < 0 || c >= BOARD_SIZE) break
      if (board[r * BOARD_SIZE + c] !== stone) break
      count++
    }
    for (let d = 1; d < 5; d++) {
      const r = row - dr * d, c = col - dc * d
      if (r < 0 || r >= BOARD_SIZE || c < 0 || c >= BOARD_SIZE) break
      if (board[r * BOARD_SIZE + c] !== stone) break
      count++
    }
    if (count >= 5) return true
  }
  return false
}

function renderOmok() {
  if (!omokGameData) {
    drawBoard(Array(BOARD_SIZE * BOARD_SIZE).fill(0), 1)
    omokStatusEl.textContent = '대기 중...'
    omokInfoEl.textContent = ''
    omokJoinBlack.disabled = false
    omokJoinWhite.disabled = false
    omokResignBtn.style.display = 'none'
    omokResetBtn.style.display = 'none'
    omokWinOverlay.classList.remove('show')
    omokWinSpoken = false; omokQText.textContent = ''
    return
  }

  const { board, turn, black, white, winner, started } = omokGameData

  omokJoinBlack.disabled = !!black
  omokJoinWhite.disabled = !!white
  omokJoinBlack.style.display = winner ? 'none' : ''
  omokJoinWhite.style.display = winner ? 'none' : ''
  omokResignBtn.style.display = (started && !winner && omokRole && omokRole !== 'spectator') ? '' : 'none'
  omokResetBtn.style.display = winner ? '' : 'none'

  if (winner) {
    const winName = winner === 'black' ? black : white
    omokStatusEl.textContent = `${winName} 승리!`
    omokInfoEl.textContent = `⚫ ${black || '?'}  vs  ⚪ ${white || '?'}`
    omokWinOverlay.classList.add('show')
    if (!omokWinSpoken) { omokWinSpoken = true; omokQText.textContent = `${winName}님이 승리했어...` }
  } else {
    omokWinOverlay.classList.remove('show')
    omokWinSpoken = false; omokQText.textContent = ''
    if (!started) {
      omokStatusEl.textContent = `⚫ ${black || '기다리는 중'}  ⚪ ${white || '기다리는 중'}`
      omokInfoEl.textContent = '두 명이 참여하면 시작돼융!'
    } else {
      omokStatusEl.textContent = `${turn === 1 ? `⚫ ${black}` : `⚪ ${white}`} 차례`
      omokInfoEl.textContent = `⚫ ${black}  vs  ⚪ ${white}` + (!omokRole ? '  |  👁 관전 중' : '')
    }
  }

  drawBoard(board, turn)
}

function drawBoard(board, turn) {
  const ctx = omokCtx
  const size = BOARD_PX + CELL_SIZE
  const offset = CELL_SIZE / 2

  ctx.clearRect(0, 0, size, size)
  ctx.fillStyle = '#1a0f2e'
  ctx.fillRect(0, 0, size, size)

  ctx.strokeStyle = 'rgba(180,120,255,0.25)'
  ctx.lineWidth = 0.8
  for (let i = 0; i < BOARD_SIZE; i++) {
    const p = offset + i * CELL_SIZE
    ctx.beginPath(); ctx.moveTo(p, offset); ctx.lineTo(p, offset + (BOARD_SIZE - 1) * CELL_SIZE); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(offset, p); ctx.lineTo(offset + (BOARD_SIZE - 1) * CELL_SIZE, p); ctx.stroke()
  }

  ctx.fillStyle = 'rgba(180,120,255,0.5)'
    ;[3, 7, 11].forEach(r => [3, 7, 11].forEach(c => {
      ctx.beginPath()
      ctx.arc(offset + c * CELL_SIZE, offset + r * CELL_SIZE, 2.5, 0, Math.PI * 2)
      ctx.fill()
    }))

  for (let i = 0; i < board.length; i++) {
    if (!board[i]) continue
    const row = Math.floor(i / BOARD_SIZE), col = i % BOARD_SIZE
    const cx = offset + col * CELL_SIZE, cy = offset + row * CELL_SIZE
    const r = CELL_SIZE * 0.42
    const g = ctx.createRadialGradient(cx - r * .3, cy - r * .3, r * .1, cx, cy, r)
    board[i] === 1
      ? (g.addColorStop(0, '#666'), g.addColorStop(1, '#111'))
      : (g.addColorStop(0, '#fff'), g.addColorStop(1, '#bbb'))
    ctx.fillStyle = g
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill()
    ctx.strokeStyle = board[i] === 1 ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.2)'
    ctx.lineWidth = 0.5
    ctx.stroke()
  }
}

omokCanvas.addEventListener('mousemove', e => {
  if (!omokGameData?.started || omokGameData.winner) return
  if (!omokRole || omokRole === 'spectator') return
  const myStone = omokRole === 'black' ? 1 : 2
  if (omokGameData.turn !== myStone) return

  const rect = omokCanvas.getBoundingClientRect()
  const offset = CELL_SIZE / 2
  const col = Math.round((e.clientX - rect.left - offset) / CELL_SIZE)
  const row = Math.round((e.clientY - rect.top - offset) / CELL_SIZE)

  drawBoard(omokGameData.board, omokGameData.turn)
  if (col < 0 || col >= BOARD_SIZE || row < 0 || row >= BOARD_SIZE) return
  if (omokGameData.board[row * BOARD_SIZE + col] !== 0) return

  omokCtx.globalAlpha = 0.4
  omokCtx.fillStyle = myStone === 1 ? '#222' : '#eee'
  omokCtx.beginPath(); omokCtx.arc(offset + col * CELL_SIZE, offset + row * CELL_SIZE, CELL_SIZE * .42, 0, Math.PI * 2); omokCtx.fill()
  omokCtx.globalAlpha = 1.0
})

omokCanvas.addEventListener('mouseleave', () => {
  if (omokGameData) drawBoard(omokGameData.board, omokGameData.turn)
})

drawBoard(Array(BOARD_SIZE * BOARD_SIZE).fill(0), 1)
