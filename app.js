(function () {
  'use strict';

  // ===== Elements =====
  const screenProfile = document.getElementById('screen-profile');
  const screenMatch = document.getElementById('screen-match');
  const screenChat = document.getElementById('screen-chat');
  const card = document.getElementById('swipe-card');

  // ===== Swipe State =====
  let startX = 0;
  let startY = 0;
  let currentX = 0;
  let isDragging = false;
  const SWIPE_THRESHOLD = 100;

  // ===== Swipe Handlers =====
  function getClientX(e) {
    return e.touches ? e.touches[0].clientX : e.clientX;
  }

  function getClientY(e) {
    return e.touches ? e.touches[0].clientY : e.clientY;
  }

  function onStart(e) {
    isDragging = true;
    startX = getClientX(e);
    startY = getClientY(e);
    currentX = 0;
    card.style.transition = 'none';
  }

  function onMove(e) {
    if (!isDragging) return;
    currentX = getClientX(e) - startX;
    const rotation = currentX * 0.08;
    card.style.transform = 'translateX(' + currentX + 'px) rotate(' + rotation + 'deg)';

    // Show swipe labels based on direction
    const likeLabel = card.querySelector('.swipe-like');
    const nopeLabel = card.querySelector('.swipe-nope');
    const progress = Math.min(Math.abs(currentX) / SWIPE_THRESHOLD, 1);

    if (currentX > 0) {
      likeLabel.style.opacity = progress;
      nopeLabel.style.opacity = 0;
    } else {
      nopeLabel.style.opacity = progress;
      likeLabel.style.opacity = 0;
    }
  }

  function onEnd() {
    if (!isDragging) return;
    isDragging = false;

    const likeLabel = card.querySelector('.swipe-like');
    const nopeLabel = card.querySelector('.swipe-nope');

    if (currentX > SWIPE_THRESHOLD) {
      // Swipe right — fly off and go to match
      card.classList.add('fly-off');
      card.style.transform = 'translateX(150vw) rotate(30deg)';
      card.style.opacity = '0';
      setTimeout(showMatchScreen, 400);
    } else if (currentX < -SWIPE_THRESHOLD) {
      // Swipe left — fly off left, then reset
      card.classList.add('fly-off');
      card.style.transform = 'translateX(-150vw) rotate(-30deg)';
      card.style.opacity = '0';
      setTimeout(function () {
        card.classList.remove('fly-off');
        card.style.transition = 'none';
        card.style.transform = '';
        card.style.opacity = '';
        likeLabel.style.opacity = 0;
        nopeLabel.style.opacity = 0;
      }, 400);
    } else {
      // Snap back
      card.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
      card.style.transform = '';
      likeLabel.style.opacity = 0;
      nopeLabel.style.opacity = 0;
    }
  }

  // Touch events
  card.addEventListener('touchstart', onStart, { passive: true });
  card.addEventListener('touchmove', onMove, { passive: true });
  card.addEventListener('touchend', onEnd);

  // Mouse events (for desktop testing)
  card.addEventListener('mousedown', onStart);
  document.addEventListener('mousemove', onMove);
  document.addEventListener('mouseup', function () {
    if (isDragging) onEnd();
  });

  // ===== Screen Transitions =====
  function switchScreen(from, to) {
    from.classList.remove('active');
    to.classList.add('active');
  }

  // ===== Match Screen =====
  function showMatchScreen() {
    switchScreen(screenProfile, screenMatch);

    // Trigger animations
    var title = screenMatch.querySelector('.match-title');
    var photoHis = screenMatch.querySelector('.match-photo-his');
    var photoHer = screenMatch.querySelector('.match-photo-her');
    var heart = screenMatch.querySelector('.match-heart');
    var subtitle = screenMatch.querySelector('.match-subtitle');

    title.classList.add('animate');
    photoHis.classList.add('animate');
    photoHer.classList.add('animate');
    heart.classList.add('animate');
    subtitle.classList.add('animate');

    // Confetti burst
    setTimeout(fireConfetti, 500);

    // Auto-transition to chat after 3.5s, or tap to skip
    var transitioned = false;
    function goToChat() {
      if (transitioned) return;
      transitioned = true;
      switchScreen(screenMatch, screenChat);
      setTimeout(animateChatMessages, 300);
    }

    screenMatch.addEventListener('click', goToChat);
    screenMatch.addEventListener('touchend', goToChat);
    setTimeout(goToChat, 3500);
  }

  // ===== Confetti =====
  function fireConfetti() {
    if (typeof confetti !== 'function') return;

    // Burst from both sides
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { x: 0.25, y: 0.5 },
      colors: ['#FFC629', '#FFD700', '#FF6B6B', '#FF1493', '#fff'],
    });
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { x: 0.75, y: 0.5 },
      colors: ['#FFC629', '#FFD700', '#FF6B6B', '#FF1493', '#fff'],
    });

    // Second burst slightly later
    setTimeout(function () {
      confetti({
        particleCount: 50,
        spread: 100,
        origin: { x: 0.5, y: 0.4 },
        colors: ['#FFC629', '#FFD700', '#FF6B6B', '#FF1493'],
      });
    }, 300);
  }

  // ===== Chat Message Animation =====
  function animateChatMessages() {
    var messages = screenChat.querySelectorAll('[data-chat-msg]');
    messages.forEach(function (msg, i) {
      setTimeout(function () {
        msg.classList.add('visible');
      }, i * 300);
    });
  }
})();
