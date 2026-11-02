(function () {
  "use strict";
  var W = 480, H = 640, DURATION = 60, MAX_LIVES = 3;
  var canvas = document.getElementById("game");
  var ctx = canvas.getContext("2d");
  var el = {
    score: document.getElementById("score"), time: document.getElementById("time"),
    lives: document.getElementById("lives"), overlay: document.getElementById("overlay"),
    ovTitle: document.getElementById("ovTitle"), ovText: document.getElementById("ovText"),
    start: document.getElementById("startBtn"), restart: document.getElementById("restartBtn"),
    left: document.getElementById("leftBtn"), right: document.getElementById("rightBtn")
  };

  // Aset dimuat dengan path relatif (bukan C:\... dan bukan /assets/...)
  var starImg = new Image();
  var starReady = false;
  starImg.onload = function () { starReady = true; };
  starImg.src = "assets/star.svg";

  var player = { w: 84, h: 22, x: W / 2, y: H - 36, speed: 380 };
  var keys = { left: false, right: false }, touchX = null;
  var items = [], bgStars = [];
  var state, score, timeLeft, lives, spawnTimer, last = 0;

  // Modifikasi 2: latar bintang berlapis yang bergerak pelan (parallax)
  for (var i = 0; i < 60; i++) {
    bgStars.push({ x: Math.random() * W, y: Math.random() * H,
      r: 0.6 + Math.random() * 1.6, v: 12 + Math.random() * 40 });
  }

  function reset() {
    score = 0; timeLeft = DURATION; lives = MAX_LIVES; spawnTimer = 0;
    items = []; player.x = W / 2; touchX = null; hud();
  }
  function hud() {
    el.score.textContent = score;
    el.time.textContent = Math.ceil(timeLeft);
    el.lives.textContent = lives;
  }
  function begin() {
    reset(); state = "play"; last = performance.now();
    el.overlay.classList.add("hidden"); canvas.focus();
  }
  function finish(reason) {
    state = "over";
    el.ovTitle.textContent = reason === "lives" ? "Nyawa habis!" : "Waktu habis!";
    el.ovText.textContent = "Skor akhir kamu: " + score + ".";
    el.start.textContent = "Mulai ulang";
    el.overlay.classList.remove("hidden");
  }

  function spawn() {
    var r = Math.random(), type = "star";
    if (r > 0.92) type = "gold";        // Modifikasi 1: bintang emas bernilai +5
    else if (r > 0.70) type = "meteor";
    var size = type === "meteor" ? 26 : (type === "gold" ? 24 : 28);
    var boost = 1 + (DURATION - timeLeft) / DURATION * 0.7; // makin lama makin cepat
    items.push({ type: type, size: size, x: size + Math.random() * (W - size * 2),
      y: -size, vy: (130 + Math.random() * 90) * boost, rot: 0 });
  }

  function update(dt) {
    var dir = (keys.right ? 1 : 0) - (keys.left ? 1 : 0);
    if (touchX !== null) {
      var d = touchX - player.x;
      player.x += Math.max(-player.speed * dt * 1.6, Math.min(player.speed * dt * 1.6, d));
    } else {
      player.x += dir * player.speed * dt;
    }
    player.x = Math.max(player.w / 2, Math.min(W - player.w / 2, player.x));

    timeLeft -= dt;
    spawnTimer -= dt;
    if (spawnTimer <= 0) {
      spawn();
      spawnTimer = 0.85 - (DURATION - timeLeft) / DURATION * 0.4;
    }
    for (var i = items.length - 1; i >= 0; i--) {
      var it = items[i];
      it.y += it.vy * dt; it.rot += dt * 2;
      var hit = Math.abs(it.x - player.x) < (player.w / 2 + it.size * 0.45) &&
                Math.abs(it.y - player.y) < (player.h / 2 + it.size * 0.45);
      if (hit) {
        if (it.type === "star") score += 1;
        else if (it.type === "gold") score += 5;
        else lives -= 1;
        items.splice(i, 1);
      } else if (it.y > H + it.size) {
        items.splice(i, 1);
      }
    }
    for (var j = 0; j < bgStars.length; j++) {
      var b = bgStars[j]; b.y += b.v * dt;
      if (b.y > H) { b.y = 0; b.x = Math.random() * W; }
    }
    hud();
    if (lives <= 0) { lives = 0; hud(); finish("lives"); }
    else if (timeLeft <= 0) { timeLeft = 0; hud(); finish("time"); }
  }

  function polyStar(x, y, R, fill, stroke) {
    ctx.beginPath();
    for (var k = 0; k < 10; k++) {
      var rad = k % 2 === 0 ? R : R * 0.45, a = -Math.PI / 2 + k * Math.PI / 5;
      ctx.lineTo(x + Math.cos(a) * rad, y + Math.sin(a) * rad);
    }
    ctx.closePath(); ctx.fillStyle = fill; ctx.fill();
    ctx.lineWidth = 2; ctx.strokeStyle = stroke; ctx.stroke();
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    var g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, "#0b1026"); g.addColorStop(1, "#1d2a63");
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "#ffffff";
    bgStars.forEach(function (b) {
      ctx.globalAlpha = 0.35 + b.r / 3;
      ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, 6.2832); ctx.fill();
    });
    ctx.globalAlpha = 1;
    items.forEach(function (it) {
      if (it.type === "star") {
        if (starReady) ctx.drawImage(starImg, it.x - it.size, it.y - it.size, it.size * 2, it.size * 2);
        else polyStar(it.x, it.y, it.size, "#ffe66d", "#f4a300");
      } else if (it.type === "gold") {
        ctx.save(); ctx.shadowColor = "#fff2a8"; ctx.shadowBlur = 18;
        polyStar(it.x, it.y, it.size + 6, "#ffc400", "#fff6c7"); ctx.restore();
      } else {
        ctx.save(); ctx.translate(it.x, it.y); ctx.rotate(it.rot);
        ctx.fillStyle = "#8a6a55"; ctx.strokeStyle = "#ff7a45"; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(0, 0, it.size, 0, 6.2832); ctx.fill(); ctx.stroke();
        ctx.fillStyle = "#6b4f3f";
        ctx.beginPath(); ctx.arc(-8, -6, 6, 0, 6.2832); ctx.arc(7, 8, 4, 0, 6.2832); ctx.fill();
        ctx.restore();
      }
    });
    ctx.fillStyle = "#4dd2ff";
    ctx.fillRect(player.x - player.w / 2, player.y - player.h / 2, player.w, player.h);
    ctx.fillStyle = "#e8fbff";
    ctx.fillRect(player.x - player.w / 2 + 6, player.y - player.h / 2 + 4, player.w - 12, 5);
  }

  function loop(now) {
    var dt = Math.min(0.05, (now - last) / 1000); last = now;
    if (state === "play") update(dt);
    draw();
    requestAnimationFrame(loop);
  }

  // Input
  function setKey(e, down) {
    var k = e.key.toLowerCase();
    if (k === "arrowleft" || k === "a") { keys.left = down; e.preventDefault(); }
    if (k === "arrowright" || k === "d") { keys.right = down; e.preventDefault(); }
  }
  window.addEventListener("keydown", function (e) { setKey(e, true); });
  window.addEventListener("keyup", function (e) { setKey(e, false); });
  function hold(btn, name) {
    var on = function (e) { e.preventDefault(); keys[name] = true; };
    var off = function (e) { e.preventDefault(); keys[name] = false; };
    btn.addEventListener("pointerdown", on);
    ["pointerup", "pointerleave", "pointercancel"].forEach(function (t) { btn.addEventListener(t, off); });
  }
  hold(el.left, "left"); hold(el.right, "right");
  function pointerToX(e) {
    var rect = canvas.getBoundingClientRect();
    return (e.clientX - rect.left) / rect.width * W;
  }
  canvas.addEventListener("pointerdown", function (e) { touchX = pointerToX(e); canvas.focus(); });
  canvas.addEventListener("pointermove", function (e) { if (touchX !== null) touchX = pointerToX(e); });
  ["pointerup", "pointerleave", "pointercancel"].forEach(function (t) {
    canvas.addEventListener(t, function () { touchX = null; });
  });
  el.start.addEventListener("click", begin);
  el.restart.addEventListener("click", begin);

  state = "ready"; reset(); requestAnimationFrame(loop);
})();
