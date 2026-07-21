const video = document.getElementById('webcam');
const startBtn = document.getElementById('start-btn');
const downloadBtn = document.getElementById('download-btn');
const countdownEl = document.getElementById('countdown');
const canvas = document.getElementById('strip-canvas');
const ctx = canvas.getContext('2d');

const layoutSelect = document.getElementById('layout-select');
const frameStyleSelect = document.getElementById('frame-style-select');
const filterSelect = document.getElementById('filter-select');

let capturedImages = [];

// Filter Webcam Realtime
filterSelect.addEventListener('change', () => {
  video.style.filter = filterSelect.value;
});

// Setup Kamera
async function setupCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { width: 1280, height: 720 },
      audio: false
    });
    video.srcObject = stream;
  } catch (err) {
    alert("Kamera tidak terdeteksi. Pastikan Iriun/DroidCam terhubung!");
  }
}

function startCountdown(seconds) {
  return new Promise((resolve) => {
    countdownEl.classList.remove('hidden');
    let count = seconds;
    countdownEl.textContent = count;

    const timer = setInterval(() => {
      count--;
      if (count > 0) {
        countdownEl.textContent = count;
      } else {
        clearInterval(timer);
        countdownEl.classList.add('hidden');
        resolve();
      }
    }, 1000);
  });
}

// Snapshot Foto dari Video
function captureSnapshot() {
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = video.videoWidth || 1280;
  tempCanvas.height = video.videoHeight || 720;
  const tempCtx = tempCanvas.getContext('2d');

  tempCtx.filter = filterSelect.value;
  tempCtx.translate(tempCanvas.width, 0);
  tempCtx.scale(-1, 1);
  tempCtx.drawImage(video, 0, 0, tempCanvas.width, tempCanvas.height);

  return tempCanvas;
}

// Menentukan Jumlah Foto Berdasarkan Layout
function getTotalPhotos() {
  const layout = layoutSelect.value;
  if (layout === '1x1') return 1;
  if (layout === '2x1') return 2;
  if (layout === '3x1') return 3;
  if (layout === '2x2') return 4;
  if (layout === '2x3') return 6;
  return 3;
}

startBtn.addEventListener('click', async () => {
  capturedImages = [];
  startBtn.disabled = true;
  downloadBtn.disabled = true;

  const totalPhotos = getTotalPhotos();

  for (let i = 0; i < totalPhotos; i++) {
    await startCountdown(3);
    const snap = captureSnapshot();
    capturedImages.push(snap);
  }

  renderPhotoLayout();
  startBtn.disabled = false;
  downloadBtn.disabled = false;
});

// FUNGSI KHUSUS: Menggambar gambar ke canvas dengan rasio proporsional (Tanpa Gepeng)
function drawImageProp(targetCtx, img, x, y, w, h) {
  const imgW = img.width;
  const imgH = img.height;
  const imgRatio = imgW / imgH;
  const targetRatio = w / h;

  let srcX = 0, srcY = 0, srcW = imgW, srcH = imgH;

  if (imgRatio > targetRatio) {
    srcW = imgH * targetRatio;
    srcX = (imgW - srcW) / 2;
  } else {
    srcH = imgW / targetRatio;
    srcY = (imgH - srcH) / 2;
  }

  targetCtx.drawImage(img, srcX, srcY, srcW, srcH, x, y, w, h);
}

// MENGGAMBAR BUNGA MAWAR 3D BESAR
function drawLargeRoseCluster(x, y, scale = 1.8) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);

  ctx.fillStyle = '#1e4620';
  [
    { rx: -35, ry: 25, rot: -0.6, w: 32, h: 16 },
    { rx: 45, ry: -15, rot: 0.8, w: 30, h: 15 },
    { rx: -15, ry: -45, rot: -0.3, w: 28, h: 14 },
    { rx: 30, ry: 35, rot: 0.4, w: 25, h: 12 }
  ].forEach(d => {
    ctx.beginPath();
    ctx.ellipse(d.rx, d.ry, d.w, d.h, d.rot, 0, Math.PI * 2);
    ctx.fill();
  });

  const roses = [
    { cx: 0, cy: 0, r: 42 },
    { cx: -32, cy: 30, r: 28 },
    { cx: 32, cy: -25, r: 25 }
  ];

  roses.forEach(r => {
    ctx.fillStyle = '#881337';
    ctx.beginPath();
    ctx.arc(r.cx, r.cy, r.r, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#e11d48';
    ctx.beginPath();
    ctx.arc(r.cx, r.cy, r.r * 0.78, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#fb7185';
    ctx.beginPath();
    ctx.arc(r.cx - 3, r.cy - 3, r.r * 0.4, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#fff1f2';
    ctx.beginPath();
    ctx.arc(r.cx - 1, r.cy - 1, r.r * 0.15, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.restore();
}

// MENGGAMBAR HATI 3D BESAR
function drawLargeHeart3D(x, y, size = 25) {
  ctx.save();
  ctx.translate(x, y);

  ctx.fillStyle = '#9f1239';
  ctx.beginPath();
  ctx.moveTo(0, size / 4);
  ctx.quadraticCurveTo(0, 0, size / 2, 0);
  ctx.quadraticCurveTo(size, 0, size, size / 2);
  ctx.quadraticCurveTo(size, (size * 3) / 4, 0, size * 1.2);
  ctx.quadraticCurveTo(-size, (size * 3) / 4, -size, size / 2);
  ctx.quadraticCurveTo(-size, 0, -size / 2, 0);
  ctx.quadraticCurveTo(0, 0, 0, size / 4);
  ctx.fill();

  ctx.fillStyle = '#f43f5e';
  ctx.beginPath();
  ctx.moveTo(0, size / 4);
  ctx.lineTo(size, size / 2);
  ctx.lineTo(0, size * 1.2);
  ctx.fill();

  ctx.restore();
}

// Helper Menggambar List Ikon Dekorasi
function drawEmojiBorder(icons) {
  ctx.font = '42px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  let idx = 0;

  for (let x = 45; x <= canvas.width - 45; x += 65) {
    ctx.fillText(icons[idx % icons.length], x, 40);
    ctx.fillText(icons[(idx + 2) % icons.length], x, canvas.height - 40);
    idx++;
  }

  for (let y = 105; y <= canvas.height - 105; y += 65) {
    ctx.fillText(icons[idx % icons.length], 40, y);
    ctx.fillText(icons[(idx + 3) % icons.length], canvas.width - 40, y);
    idx++;
  }
}

// Render Hasil Akhir Frame
function renderPhotoLayout() {
  const layout = layoutSelect.value;
  const style = frameStyleSelect.value;

  const borderThickness = 80; 
  const imgW = 280;
  const imgH = 210; // Rasio standar 4:3
  const gap = 15;

  let cols = 1;
  let rows = 1;

  if (layout === '1x1') { cols = 1; rows = 1; }
  else if (layout === '2x1') { cols = 1; rows = 2; }
  else if (layout === '3x1') { cols = 1; rows = 3; }
  else if (layout === '2x2') { cols = 2; rows = 2; }
  else if (layout === '2x3') { cols = 2; rows = 3; }

  canvas.width = borderThickness * 2 + (imgW * cols) + (gap * (cols - 1));
  canvas.height = borderThickness * 2 + (imgH * rows) + (gap * (rows - 1));

  // 1. Base Frame Putih Studio
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 2. Draw Photos Proporsional (Anti Gepeng)
  capturedImages.forEach((img, index) => {
    const col = index % cols;
    const row = Math.floor(index / cols);

    const xPos = borderThickness + col * (imgW + gap);
    const yPos = borderThickness + row * (imgH + gap);

    // Inner Border Foto
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(xPos - 3, yPos - 3, imgW + 6, imgH + 6);
    
    // Dipanggil lewat fungsi drawImageProp agar rasio foto tidak tertarik/gepeng
    drawImageProp(ctx, img, xPos, yPos, imgW, imgH);
  });

  // 3. Dekorasi Frame
  if (style === 'rose_romantic') {
    drawLargeRoseCluster(60, 60, 1.4);
    drawLargeRoseCluster(canvas.width - 60, 60, 1.4);
    drawLargeRoseCluster(60, canvas.height - 60, 1.4);
    drawLargeRoseCluster(canvas.width - 60, canvas.height - 60, 1.4);

    for (let x = 150; x < canvas.width - 120; x += 60) {
      drawLargeHeart3D(x, 40, 22);
      drawLargeHeart3D(x, canvas.height - 40, 22);
    }
    for (let y = 150; y < canvas.height - 120; y += 60) {
      drawLargeHeart3D(40, y, 22);
      drawLargeHeart3D(canvas.width - 40, y, 22);
    }
  } else if (style === 'gold_glitter') {
    drawEmojiBorder(['⭐', '✨', '👑', '💫', '🌟', '🥇']);
  } else if (style === 'cute_birthday') {
    drawEmojiBorder(['🎈', '🎁', '🎂', '🎉', '🥳', '🧁', '🍿']);
  } else if (style === 'cute_cats') {
    drawEmojiBorder(['🐱', '🐾', '🐟', '😺', '🧶', '🐈']);
  } else if (style === 'coquette_ribbon') {
    drawEmojiBorder(['🎀', '💖', '🌹', '💌', '🌸', '🩰']);
  } else if (style === 'y2k_cyber') {
    drawEmojiBorder(['👾', '🎮', '⭐', '⚡', '🛸', '💎']);
  } else if (style === 'flower_garden') {
    drawEmojiBorder(['🌻', '🌸', '🦋', '🌷', '🌺', '🐝']);
  } else if (style === 'ocean_splash') {
    drawEmojiBorder(['🐚', '🦪', '🐬', '🌊', '🐠', '⭐']);
  } else if (style === 'sweet_dessert') {
    drawEmojiBorder(['🍩', '🍦', '🍰', '🍭', '🧁', '🍬']);
  } else if (style === 'space_galaxy') {
    drawEmojiBorder(['🚀', '🪐', '🌙', '⭐', '☄️', '🛸']);
  }
}

// Event Listeners
frameStyleSelect.addEventListener('change', () => {
  if (capturedImages.length > 0) renderPhotoLayout();
});

layoutSelect.addEventListener('change', () => {
  if (capturedImages.length > 0) renderPhotoLayout();
});

downloadBtn.addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = `photobooth-${layoutSelect.value}-${Date.now()}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
});

setupCamera();