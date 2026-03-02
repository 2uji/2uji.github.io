const COMMANDS = {
  help() {
    triggerWallBreak()
  },
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
  close() {
    speak('잘가융!', 1200)
    setTimeout(() => {
      if (wallActive) closeWallBreak()
      setTimeout(closeConsole, 100)
    }, 1300)
  }
}
