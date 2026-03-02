// ══════════════════════════════════════════════════════════
// 오목 (omok.js)
// ══════════════════════════════════════════════════════════

const BOARD_SIZE = 15
const CELL_SIZE  = 28
const BOARD_PX   = CELL_SIZE * (BOARD_SIZE - 1)

const omokRef = db.ref('omok')

// ── DOM 생성 ───────────────────────────────────────────────
const omokBox = document.createElement('div')
omokBox.id    = 'omokBox'
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
      <button id="omokReset" style="display:none">새 게임</button>
    </div>
  </div>
`

// ── CSS 주입 ───────────────────────────────────────────────
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
#omokTitle {
  font-size: 11px;
  color: #b07fff;
  letter-spacing: .12em;
}
#omokHeaderRight {
  display: flex;
  align-items: center;
  gap: 10px;
}
#omokStatus {
  font-size: 11px;
  color: #7a5599;
}
#omokClose {
  font-size: 13px;
  color: #7a5599;
  cursor: pointer;
  transition: color 0.2s;
}
#omokClose:hover { color: #ff6b6b; }
#omokBody {
  padding: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}
#omokCanvas {
  display: block;
  border-radius: 4px;
}
#omokFooter {
  padding: 8px 14px 12px;
  border-top: 1px solid rgba(180,120,255,0.15);
  display: flex;
  flex-direction: column;
  gap: 8px;
}
#omokInfo {
  font-size: 11px;
  color: #7a5599;
  min-height: 16px;
  text-align: center;
}
#omokBtnRow {
  display: flex;
  gap: 8px;
  justify-content: center;
}
#omokBtnRow button {
  background: transparent;
  border: 1px solid rgba(180,120,255,0.3);
  border-radius: 6px;
  color: #b07fff;
  font-family: 'Courier New', monospace;
  font-size: 11px;
  padding: 5px 12px;
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s;
}
#omokBtnRow button:hover {
  background: rgba(180,120,255,0.12);
  border-color: rgba(180,120,255,0.6);
}
#omokBtnRow button:disabled {
  opacity: 0.35;
  cursor: url('assets/cursor6.cur'), not-allowed;
}
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
  animation: winFadeIn 0.4s ease forwards;
}
#omokWinImg {
  max-width: 80%;
  max-height: 70%;
  object-fit: contain;
  filter: drop-shadow(0 0 24px rgba(180,120,255,0.9));
  animation: winPop 0.5s cubic-bezier(0.22,1,0.36,1) forwards;
}
#omokQSpeech {
  position: absolute;
  bottom: 14px;
  left: 12px;
  right: 12px;
  background: rgba(10,2,25,0.88);
  border: 1px solid rgba(180,120,255,0.35);
  border-radius: 8px;
  padding: 8px 12px;
  display: flex;
  gap: 8px;
  align-items: baseline;
  backdrop-filter: blur(4px);
  opacity: 0;
  transition: opacity 0.4s ease 0.5s;
}
#omokWinOverlay.show #omokQSpeech {
  opacity: 1;
}
#omokQName {
  font-size: 12px;
  font-weight: 600;
  color: #ff9ef7;
  white-space: nowrap;
  font-family: 'Inter', monospace;
  flex-shrink: 0;
}
#omokQText {
  font-size: 13px;
  color: #e0ccff;
  font-family: 'Inter', monospace;
  line-height: 1.5;
}
@keyframes winFadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@keyframes winPop {
  0%   { transform: scale(0.7); opacity: 0; }
  60%  { transform: scale(1.08); opacity: 1; }
  100% { transform: scale(1);    opacity: 1; }
}
body.custom-cursor #omokJoinBlack,
body.custom-cursor #omokJoinWhite,
body.custom-cursor #omokResign,
body.custom-cursor #omokReset,
body.custom-cursor #omokClose {
  cursor: url('assets/cursor2.cur'), pointer;
}
body.custom-cursor #omokJoinBlack:disabled,
body.custom-cursor #omokJoinWhite:disabled {
  cursor: url('assets/cursor6.cur'), not-allowed;
}
body.custom-cursor #omokCanvas {
  cursor: url('assets/cursor2.cur'), crosshair;
}
`
document.head.appendChild(omokStyle)

// ── 요소 참조 ──────────────────────────────────────────────
const omokCanvas     = document.getElementById('omokCanvas')
const omokCtx        = omokCanvas.getContext('2d')
const omokCloseBtn   = document.getElementById('omokClose')
const omokStatusEl   = document.getElementById('omokStatus')
const omokInfoEl     = document.getElementById('omokInfo')
const omokJoinBlack  = document.getElementById('omokJoinBlack')
const omokJoinWhite  = document.getElementById('omokJoinWhite')
const omokResignBtn  = document.getElementById('omokResign')
const omokResetBtn   = document.getElementById('omokReset')
const omokHeaderEl   = document.getElementById('omokHeader')
const omokWinOverlay = document.getElementById('omokWinOverlay')
const omokQText      = document.getElementById('omokQText')

// ── 상태 ───────────────────────────────────────────────────
let omokRole      = null
let omokMyName    = ''
let omokGameData  = null
let omokListeners = []
let omokWinSpoken = false

// ── 열기/닫기 ──────────────────────────────────────────────
function openOmok() {
  if (!chatBox.classList.contains('open')) {
    speak('채팅창을 먼저 열어봐융! chat 이라고 쳐봐융!')
    return
  }
  omokBox.classList.add('open')
  subConsoles.set('omok', closeOmok)
  positionOmok()
  startOmokListeners()
}

function closeOmok() {
  omokBox.classList.remove('open')
  subConsoles.delete('omok')
  stopOmokListeners()
  if (omokRole && omokRole !== 'spectator') {
    omokRef.set(defaultGame())
    omokRef.onDisconnect().cancel()
  }
  omokRole   = null
  omokMyName = ''
}

function positionOmok() {
  const chatRect = chatBox.getBoundingClientRect()
  const gap      = 10
  const boxW     = BOARD_PX + CELL_SIZE + 28 * 2 + 2
  omokBox.style.left  = (chatRect.left - boxW - gap) + 'px'
  omokBox.style.top   = chatRect.top + 'px'
  omokBox.style.width = boxW + 'px'
}

omokCloseBtn.addEventListener('click', closeOmok)

// ── 드래그 ─────────────────────────────────────────────────
let omokDragging = false
let omokDragOffX = 0, omokDragOffY = 0

omokHeaderEl.addEventListener('mousedown', e => {
  omokDragging = true
  const rect   = omokBox.getBoundingClientRect()
  omokDragOffX = e.clientX - rect.left
  omokDragOffY = e.clientY - rect.top
  omokBox.style.transition = 'none'
})
document.addEventListener('mousemove', e => {
  if (!omokDragging) return
  omokBox.style.left = (e.clientX - omokDragOffX) + 'px'
  omokBox.style.top  = (e.clientY - omokDragOffY) + 'px'
})
document.addEventListener('mouseup', () => { omokDragging = false })

// ══════════════════════════════════════════════════════════
// Firebase
// ══════════════════════════════════════════════════════════
function startOmokListeners() {
  const ref = omokRef.on('value', snapshot => {
    omokGameData = snapshot.val()
    renderOmok()
  })
  omokListeners.push(() => omokRef.off('value', ref))
}

function stopOmokListeners() {
  omokListeners.forEach(fn => fn())
  omokListeners = []
  omokGameData  = null
}

function defaultGame() {
  return {
    board:   Array(BOARD_SIZE * BOARD_SIZE).fill(0),
    turn:    1,
    black:   null,
    white:   null,
    winner:  null,
    started: false,
  }
}

// ── 참여 ───────────────────────────────────────────────────
function joinOmok(color) {
  omokMyName  = chatNameInput.value.trim() || '익명'
  const field = color === 'black' ? 'black' : 'white'

  omokRef.transaction(data => {
    if (!data) data = defaultGame()
    if (data[field]) return
    data[field] = omokMyName
    if (data.black && data.white) data.started = true
    return data
  }, (err, committed) => {
    if (!committed) { speak('이미 자리가 찼어융!'); return }
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

// ── 기권 ───────────────────────────────────────────────────
omokResignBtn.addEventListener('click', () => {
  if (!omokRole || omokRole === 'spectator') return
  omokRef.update({ winner: omokRole === 'black' ? 'white' : 'black' })
})

// ── 새 게임 ────────────────────────────────────────────────
omokResetBtn.addEventListener('click', () => {
  omokRef.set(defaultGame())
  omokRole   = null
  omokMyName = ''
  speak('새 게임 시작이에융!')
})

// ── 돌 놓기 ────────────────────────────────────────────────
omokCanvas.addEventListener('click', e => {
  if (!omokGameData?.started || omokGameData.winner) return
  if (!omokRole || omokRole === 'spectator') return
  const myStone = omokRole === 'black' ? 1 : 2
  if (omokGameData.turn !== myStone) return

  const rect   = omokCanvas.getBoundingClientRect()
  const offset = CELL_SIZE / 2
  const col    = Math.round((e.clientX - rect.left - offset) / CELL_SIZE)
  const row    = Math.round((e.clientY - rect.top  - offset) / CELL_SIZE)
  if (col < 0 || col >= BOARD_SIZE || row < 0 || row >= BOARD_SIZE) return

  const idx = row * BOARD_SIZE + col
  if (omokGameData.board[idx] !== 0) return

  const newBoard  = [...omokGameData.board]
  newBoard[idx]   = myStone
  const winnerVal = checkWin(newBoard, row, col, myStone)
    ? (omokRole === 'black' ? 'black' : 'white')
    : null

  omokRef.update({ board: newBoard, turn: omokGameData.turn === 1 ? 2 : 1, winner: winnerVal })
})

// ── 승리 판정 ──────────────────────────────────────────────
function checkWin(board, row, col, stone) {
  const dirs = [[0,1],[1,0],[1,1],[1,-1]]
  for (const [dr, dc] of dirs) {
    let count = 1
    for (let d = 1; d < 5; d++) {
      const r = row + dr*d, c = col + dc*d
      if (r < 0 || r >= BOARD_SIZE || c < 0 || c >= BOARD_SIZE) break
      if (board[r * BOARD_SIZE + c] !== stone) break
      count++
    }
    for (let d = 1; d < 5; d++) {
      const r = row - dr*d, c = col - dc*d
      if (r < 0 || r >= BOARD_SIZE || c < 0 || c >= BOARD_SIZE) break
      if (board[r * BOARD_SIZE + c] !== stone) break
      count++
    }
    if (count >= 5) return true
  }
  return false
}

// ══════════════════════════════════════════════════════════
// 렌더링
// ══════════════════════════════════════════════════════════
function renderOmok() {
  if (!omokGameData) {
    drawEmptyBoard()
    omokStatusEl.textContent    = '대기 중...'
    omokInfoEl.textContent      = ''
    omokJoinBlack.disabled      = false
    omokJoinWhite.disabled      = false
    omokResignBtn.style.display = 'none'
    omokResetBtn.style.display  = 'none'
    omokWinOverlay.classList.remove('show')
    omokWinSpoken         = false
    omokQText.textContent = ''
    return
  }

  const { board, turn, black, white, winner, started } = omokGameData

  // 버튼 상태
  omokJoinBlack.disabled      = !!black
  omokJoinWhite.disabled      = !!white
  omokJoinBlack.style.display = winner ? 'none' : ''
  omokJoinWhite.style.display = winner ? 'none' : ''
  omokResignBtn.style.display = (started && !winner && omokRole && omokRole !== 'spectator') ? '' : 'none'
  omokResetBtn.style.display  = winner ? '' : 'none'

  if (winner) {
    const winName = winner === 'black' ? black : white
    omokStatusEl.textContent = `${winName} 승리!`
    omokInfoEl.textContent   = `⚫ ${black || '?'}  vs  ⚪ ${white || '?'}`
    omokWinOverlay.classList.add('show')
    if (!omokWinSpoken) {
      omokWinSpoken         = true
      omokQText.textContent = `${winName}님이 승리했어...`
    }
  } else {
    omokWinOverlay.classList.remove('show')
    omokWinSpoken         = false
    omokQText.textContent = ''

    if (!started) {
      omokStatusEl.textContent = `⚫ ${black || '기다리는 중'}  ⚪ ${white || '기다리는 중'}`
      omokInfoEl.textContent   = '두 명이 참여하면 시작돼융!'
    } else {
      const turnName = turn === 1 ? `⚫ ${black}` : `⚪ ${white}`
      omokStatusEl.textContent = `${turnName} 차례`
      omokInfoEl.textContent   = `⚫ ${black}  vs  ⚪ ${white}`
      if (!omokRole) omokInfoEl.textContent += '  |  👁 관전 중'
    }
  }

  drawBoard(board, turn)
}

function drawEmptyBoard() {
  drawBoard(Array(BOARD_SIZE * BOARD_SIZE).fill(0), 1)
}

function drawBoard(board, turn) {
  const ctx    = omokCtx
  const size   = BOARD_PX + CELL_SIZE
  const offset = CELL_SIZE / 2

  ctx.clearRect(0, 0, size, size)

  // 배경
  ctx.fillStyle = '#1a0f2e'
  ctx.fillRect(0, 0, size, size)

  // 격자선
  ctx.strokeStyle = 'rgba(180,120,255,0.25)'
  ctx.lineWidth   = 0.8
  for (let i = 0; i < BOARD_SIZE; i++) {
    const x = offset + i * CELL_SIZE
    ctx.beginPath(); ctx.moveTo(x, offset); ctx.lineTo(x, offset + (BOARD_SIZE-1)*CELL_SIZE); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(offset, x); ctx.lineTo(offset + (BOARD_SIZE-1)*CELL_SIZE, x); ctx.stroke()
  }

  // 화점
  const stars = [3, 7, 11]
  ctx.fillStyle = 'rgba(180,120,255,0.5)'
  for (const r of stars) {
    for (const c of stars) {
      ctx.beginPath()
      ctx.arc(offset + c*CELL_SIZE, offset + r*CELL_SIZE, 2.5, 0, Math.PI*2)
      ctx.fill()
    }
  }

  // 돌
  for (let i = 0; i < board.length; i++) {
    if (board[i] === 0) continue
    const row = Math.floor(i / BOARD_SIZE)
    const col = i % BOARD_SIZE
    const cx  = offset + col * CELL_SIZE
    const cy  = offset + row * CELL_SIZE
    const r   = CELL_SIZE * 0.42

    const grad = ctx.createRadialGradient(cx - r*0.3, cy - r*0.3, r*0.1, cx, cy, r)
    if (board[i] === 1) {
      grad.addColorStop(0, '#666'); grad.addColorStop(1, '#111')
    } else {
      grad.addColorStop(0, '#fff'); grad.addColorStop(1, '#bbb')
    }
    ctx.fillStyle = grad
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI*2); ctx.fill()
    ctx.strokeStyle = board[i] === 1 ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.2)'
    ctx.lineWidth   = 0.5
    ctx.stroke()
  }
}

// ── 호버 미리보기 ──────────────────────────────────────────
omokCanvas.addEventListener('mousemove', e => {
  if (!omokGameData?.started || omokGameData.winner) return
  if (!omokRole || omokRole === 'spectator') return
  const myStone = omokRole === 'black' ? 1 : 2
  if (omokGameData.turn !== myStone) return

  const rect   = omokCanvas.getBoundingClientRect()
  const offset = CELL_SIZE / 2
  const col    = Math.round((e.clientX - rect.left - offset) / CELL_SIZE)
  const row    = Math.round((e.clientY - rect.top  - offset) / CELL_SIZE)

  drawBoard(omokGameData.board, omokGameData.turn)
  if (col < 0 || col >= BOARD_SIZE || row < 0 || row >= BOARD_SIZE) return
  if (omokGameData.board[row * BOARD_SIZE + col] !== 0) return

  const cx = offset + col * CELL_SIZE
  const cy = offset + row * CELL_SIZE
  omokCtx.globalAlpha = 0.4
  omokCtx.fillStyle   = myStone === 1 ? '#222' : '#eee'
  omokCtx.beginPath(); omokCtx.arc(cx, cy, CELL_SIZE*0.42, 0, Math.PI*2); omokCtx.fill()
  omokCtx.globalAlpha = 1.0
})

omokCanvas.addEventListener('mouseleave', () => {
  if (omokGameData) drawBoard(omokGameData.board, omokGameData.turn)
})

drawEmptyBoard()