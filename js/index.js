const zero = document.getElementById('zero');
const passwordToggle = document.getElementById('passwordToggle');
const passwordInput = document.getElementById('passwordInput');
const submitPassword = document.getElementById('submitPassword');
const errorMsg = document.getElementById('errorMsg');
const container = document.getElementById('container');
const flashLayer = document.getElementById('flashLayer');
const irisOutScreen = document.getElementById('irisOutScreen');
const contentFrame = document.getElementById('contentFrame');

let audioBomb, audioIrisOut;

async function sha256(str) {
  const buf = new TextEncoder().encode(str);
  const hashBuf = await crypto.subtle.digest('SHA-256', buf);
  return Array.from(new Uint8Array(hashBuf))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

const correctHash = 'e65f0dea598d37fd645ffca389c0846c431cfed03b919388e03c70a6ce8627a2';

zero.addEventListener('click', () => {
  passwordToggle.style.display = passwordToggle.style.display === 'flex' ? 'none' : 'flex';
  passwordInput.value = '';
  errorMsg.style.display = 'none';
  passwordInput.focus();
});

function triggerFlashEffect() {
  let flashes = 0;
  const maxFlashes = 6;
  const interval = setInterval(() => {
    flashLayer.style.opacity = flashLayer.style.opacity === '0' ? '0.6' : '0';
    flashes++;
    if (flashes >= maxFlashes) {
      flashLayer.style.opacity = '0';
      clearInterval(interval);
    }
  }, 80);
}

function openIrisOut() {
  audioBomb = new Audio('https://github.com/2uji/2uji.github.io/raw/refs/heads/reze/assets/Bomb!.mp3');
  audioBomb.volume = 1.0;
  audioBomb.addEventListener('play', triggerFlashEffect);
  audioBomb.play().catch(()=>{});

  setTimeout(() => {
    audioIrisOut = new Audio('https://github.com/2uji/2uji.github.io/raw/refs/heads/reze/assets/IRIS%20OUT.mp3');
    audioIrisOut.volume = 1.0;
    audioIrisOut.play().catch(()=>{});
  }, 1000);

  container.style.transition = 'opacity 1s';
  container.style.opacity = 0;
  passwordToggle.style.transition = 'opacity 1s';
  passwordToggle.style.opacity = 0;
  setTimeout(() => {
    container.style.display = 'none';
    passwordToggle.style.display = 'none';
    irisOutScreen.style.display = 'flex';
    irisOutScreen.style.opacity = 1;
  }, 1000);
}

submitPassword.addEventListener('click', async () => {
  errorMsg.style.display = 'none';
  try {
    const val = passwordInput.value.trim();
    const hash = await sha256(val);
    if (hash === correctHash) {
      openIrisOut();
    } else {
      errorMsg.style.display = 'block';
      passwordInput.value = '';
      passwordInput.focus();
    }
  } catch (err) {
    console.error(err);
    errorMsg.textContent = 'Error';
    errorMsg.style.display = 'block';
  }
});

passwordInput.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') submitPassword.click();
});

let bombBuffer = '';
let rezeBuffer = '';

document.addEventListener('keydown', (e) => {
  const key = e.key.toLowerCase();

  bombBuffer += key;
  if (bombBuffer.includes('bomb!')) {
    openIrisOut();
    bombBuffer = '';
  }
  if (bombBuffer.length > 10) bombBuffer = bombBuffer.slice(-10);

  rezeBuffer += key;
  if (rezeBuffer.includes('reze') && irisOutScreen.style.display === 'flex') {
    if (audioIrisOut && !audioIrisOut.paused) {
      audioIrisOut.pause();
      audioIrisOut.currentTime = 0;
    }

    document.body.style.transition = 'background-color 1s';
    document.body.style.backgroundColor = '#000';
    
    container.style.transition = 'opacity 1s';
    container.style.opacity = 0;
    passwordToggle.style.transition = 'opacity 1s';
    passwordToggle.style.opacity = 0;
    irisOutScreen.style.transition = 'opacity 1s';
    irisOutScreen.style.opacity = 0;

    setTimeout(() => {
      container.style.display = 'none';
      passwordToggle.style.display = 'none';
      irisOutScreen.style.display = 'none';
      contentFrame.src = 'Reze.html';
      contentFrame.style.display = 'block';
    }, 1000);

    rezeBuffer = '';
  }
  if (rezeBuffer.length > 10) rezeBuffer = rezeBuffer.slice(-10);
});
