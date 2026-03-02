const ADMIN_CMDS = ['discord', 'cloud', 'clear']

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
      if (wallActive) closeWallBreak()
      setTimeout(closeConsole, 100)
    }, 1300)
  },
  machu() {
    if (isAdmin) { speak('이미 어드민이에융!'); return }
    isAdmin        = true
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

}

function handleCommand(cmd) {
  if (ADMIN_CMDS.includes(cmd) && !isAdmin) {
    triggerAccessDenied()
    return
  }
  if (COMMANDS[cmd]) COMMANDS[cmd]()
  else speak(`'${cmd}' 는 모르는 명령어에융. help라고 쳐봐융!`)
}
