const zero = document.getElementById('zero'),
      passwordToggle = document.getElementById('passwordToggle'),
      passwordInput = document.getElementById('passwordInput'),
      submitPassword = document.getElementById('submitPassword'),
      errorMsg = document.getElementById('errorMsg'),
      container = document.getElementById('container'),
      flashLayer = document.getElementById('flashLayer'),
      irisOutScreen = document.getElementById('irisOutScreen'),
      contentFrame = document.getElementById('contentFrame');

let audioBomb, audioIrisOut;

async function sha256(str) {
  const buf = new TextEncoder().encode(str);
  const hash = await crypto.subtle.digest('SHA-256', buf);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

const correctHash = 'e65f0dea598d37fd645ffca389c0846c431cfed03b919388e03c70a6ce8627a2';

zero.onclick = () => {
  passwordToggle.style.display = passwordToggle.style.display === 'flex' ? 'none' : 'flex';
  passwordInput.value = '';
  errorMsg.style.display = 'none';
  passwordInput.focus();
};

function triggerFlash() {
  let f = 0;
  const interval = setInterval(() => {
    flashLayer.style.opacity = flashLayer.style.opacity === '0' ? '0.6' : '0';
    if (++f >= 6) {
      flashLayer.style.opacity = '0';
      clearInterval(interval);
    }
  }, 80);
}

function openIrisOut() {
  audioBomb = new Audio('./assets/Bomb!.mp3');
  audioBomb.volume = 1;
  audioBomb.addEventListener('play', triggerFlash);
  audioBomb.play().catch(() => {});

  setTimeout(() => {
    audioIrisOut = new Audio('./assets/IRIS OUT.mp3');
    audioIrisOut.volume = 1;
    audioIrisOut.play().catch(() => {});
  }, 1000);

  container.style.opacity = passwordToggle.style.opacity = '0';
  setTimeout(() => {
    container.style.display = passwordToggle.style.display = 'none';
    irisOutScreen.style.display = 'flex';
    irisOutScreen.style.opacity = 1;
  }, 1000);
}

submitPassword.onclick = async () => {
  errorMsg.style.display = 'none';
  try {
    const val = passwordInput.value.trim();
    if (await sha256(val) === correctHash) openIrisOut();
    else {
      errorMsg.style.display = 'block';
      passwordInput.value = '';
      passwordInput.focus();
    }
  } catch {
    errorMsg.textContent = 'Error';
    errorMsg.style.display = 'block';
  }
};

passwordInput.onkeyup = e => {
  if (e.key === 'Enter') submitPassword.click();
};

let bombBuffer = '', rezeBuffer = '';

document.onkeydown = e => {
  const k = e.key.toLowerCase();
  bombBuffer += k;
  if (bombBuffer.includes('bomb!')) {
    openIrisOut();
    bombBuffer = '';
  }
  if (bombBuffer.length > 10) bombBuffer = bombBuffer.slice(-10);

  rezeBuffer += k;
  if (rezeBuffer.includes('reze') && irisOutScreen.style.display === 'flex') {
    if (audioIrisOut && !audioIrisOut.paused) {
      audioIrisOut.pause();
      audioIrisOut.currentTime = 0;
    }
    document.body.style.background = '#000';
    container.style.opacity = passwordToggle.style.opacity = irisOutScreen.style.opacity = '0';
    setTimeout(() => {
      container.style.display = passwordToggle.style.display = irisOutScreen.style.display = 'none';
      contentFrame.src = './reze.html';
      contentFrame.style.display = 'block';
    }, 1000);
    rezeBuffer = '';
  }
  if (rezeBuffer.length > 10) rezeBuffer = rezeBuffer.slice(-10);
};
