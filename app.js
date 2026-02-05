(function () {
  'use strict';

  // ===== Elements =====
  const screenProfile = document.getElementById('screen-profile');
  const screenMatch = document.getElementById('screen-match');
  const screenChat = document.getElementById('screen-chat');
  const screenTimeline = document.getElementById('screen-timeline');
  const card = document.getElementById('swipe-card');
  const nopeMessage = document.getElementById('nope-message');
  const timelineBody = document.getElementById('timeline-body');
  const timelineCta = document.getElementById('timeline-cta');
  const ctaButton = document.getElementById('cta-button');

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
      // Swipe left — show nope message, then reset
      card.classList.add('fly-off');
      card.style.transform = 'translateX(-150vw) rotate(-30deg)';
      card.style.opacity = '0';

      // Show the nope message
      setTimeout(function () {
        nopeMessage.classList.add('show');
      }, 200);

      // Reset card after showing message
      setTimeout(function () {
        card.classList.remove('fly-off');
        card.style.transition = 'none';
        card.style.transform = '';
        card.style.opacity = '';
        likeLabel.style.opacity = 0;
        nopeLabel.style.opacity = 0;

        // Hide message after a delay
        setTimeout(function () {
          nopeMessage.classList.remove('show');
        }, 2000);
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

    // Auto-transition to timeline screen after chat messages complete
    setTimeout(function() {
      showTimelineScreen();
    }, (messages.length * 300) + 2000);
  }

  // ===== Timeline Message Data =====
  const timelineMessages = [
    // Initial exchange
    { type: 'msg', side: 'right', text: 'where did u get that from', emotional: false, delay: 400 },
    { type: 'msg', side: 'left', text: 'get what', emotional: false, delay: 350 },
    { type: 'msg', side: 'left', text: 'that cute smile 😊', emotional: true, delay: 600 },
    { type: 'msg', side: 'right', text: 'haha', emotional: false, delay: 300 },
    { type: 'msg', side: 'left', text: 'i am devika', emotional: true, delay: 500 },
    { type: 'msg', side: 'left', text: 'wbu', emotional: false, delay: 350 },
    { type: 'msg', side: 'right', text: 'Sreeharsh', emotional: true, delay: 500 },
    { type: 'msg', side: 'right', text: 'So,how many text until i get to see that cute smile in person', emotional: true, delay: 600 },

    // Time lapse with blurred messages
    { type: 'separator', text: 'many messages later...', delay: 800 },
    { type: 'blur', side: 'left', emoji: '❤️', delay: 150 },
    { type: 'blur', side: 'right', emoji: '😊', delay: 150 },
    { type: 'blur', side: 'left', emoji: '💕', delay: 150 },
    { type: 'blur', side: 'right', emoji: '😍', delay: 150 },
    { type: 'blur', side: 'left', emoji: '🥰', delay: 150 },
    { type: 'blur', side: 'right', emoji: '💖', delay: 150 },
    { type: 'blur', side: 'left', emoji: '😘', delay: 150 },
    { type: 'blur', side: 'right', emoji: '❤️', delay: 150 },
    { type: 'blur', side: 'left', emoji: '💗', delay: 150 },
    { type: 'blur', side: 'right', emoji: '😊', delay: 150 },
    { type: 'blur', side: 'left', emoji: '💝', delay: 150 },
    { type: 'blur', side: 'right', emoji: '🥰', delay: 150 },
    { type: 'blur', side: 'left', emoji: '💕', delay: 150 },
    { type: 'blur', side: 'right', emoji: '❤️', delay: 150 },
    { type: 'blur', side: 'left', emoji: '😍', delay: 150 },
    { type: 'blur', side: 'right', emoji: '💖', delay: 150 },
    { type: 'blur', side: 'left', emoji: '🥰', delay: 150 },
    { type: 'blur', side: 'right', emoji: '💗', delay: 150 },
    { type: 'blur', side: 'left', emoji: '😘', delay: 150 },
    { type: 'blur', side: 'right', emoji: '💕', delay: 150 },

    // Resume clear messages
    { type: 'msg', side: 'right', text: 'i am in kerala', emotional: false, delay: 500 },
    { type: 'msg', side: 'left', text: '😮😊', emotional: false, delay: 400 },

    // More blurred time lapse
    { type: 'separator', text: 'weeks later...', delay: 800 },
    { type: 'blur', side: 'right', emoji: '💭', delay: 150 },
    { type: 'blur', side: 'left', emoji: '💕', delay: 150 },
    { type: 'blur', side: 'right', emoji: '😊', delay: 150 },
    { type: 'blur', side: 'left', emoji: '❤️', delay: 150 },
    { type: 'blur', side: 'right', emoji: '🥰', delay: 150 },
    { type: 'blur', side: 'left', emoji: '💖', delay: 150 },
    { type: 'blur', side: 'right', emoji: '😍', delay: 150 },
    { type: 'blur', side: 'left', emoji: '💗', delay: 150 },
    { type: 'blur', side: 'right', emoji: '💕', delay: 150 },
    { type: 'blur', side: 'left', emoji: '😘', delay: 150 },
    { type: 'blur', side: 'right', emoji: '❤️', delay: 150 },
    { type: 'blur', side: 'left', emoji: '💝', delay: 150 },
    { type: 'blur', side: 'right', emoji: '🥰', delay: 150 },
    { type: 'blur', side: 'left', emoji: '💖', delay: 150 },
    { type: 'blur', side: 'right', emoji: '😊', delay: 150 },

    // Final message before CTA
    { type: 'separator', text: 'April arrives...', delay: 1000 },
    { type: 'msg', side: 'left', text: 'can you come to the canteen', emotional: true, delay: 800 }
  ];

  // ===== Timeline Helper Functions =====
  function createTimelineMessage(msgData) {
    if (msgData.type === 'separator') {
      const separator = document.createElement('div');
      separator.className = 'timeline-separator';
      separator.innerHTML = '<div class="timeline-separator-line">' + msgData.text + '</div>';
      return separator;
    }

    if (msgData.type === 'blur') {
      const msgDiv = document.createElement('div');
      msgDiv.className = 'timeline-msg timeline-msg-' + msgData.side;

      const bubble = document.createElement('div');
      bubble.className = 'chat-bubble chat-bubble-' + msgData.side + ' blur-bubble';
      bubble.innerHTML = '<span class="blur-text">████████</span> ' + msgData.emoji;

      msgDiv.appendChild(bubble);
      return msgDiv;
    }

    const msgDiv = document.createElement('div');
    msgDiv.className = 'timeline-msg timeline-msg-' + msgData.side;
    msgDiv.setAttribute('data-emotional', msgData.emotional);

    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble chat-bubble-' + msgData.side;
    bubble.textContent = msgData.text;

    msgDiv.appendChild(bubble);
    return msgDiv;
  }

  function animateTimelineMessages() {
    if (!timelineBody || !timelineCta) return;

    let cumulativeDelay = 0;

    timelineMessages.forEach(function(msgData, index) {
      setTimeout(function() {
        const msgElement = createTimelineMessage(msgData);
        timelineBody.appendChild(msgElement);

        // Trigger appearance animation
        setTimeout(function() {
          msgElement.classList.add('appear');
        }, 50);

        // Auto-scroll to bottom
        setTimeout(function() {
          timelineBody.scrollTop = timelineBody.scrollHeight;
        }, 100);
      }, cumulativeDelay);

      cumulativeDelay += msgData.delay;
    });

    // Show CTA button after all messages
    setTimeout(function() {
      timelineCta.classList.add('show');
    }, cumulativeDelay);
  }

  function showTimelineScreen() {
    if (!screenTimeline || !timelineBody || !timelineCta) return;

    switchScreen(screenChat, screenTimeline);

    // Copy existing chat messages to timeline to continue the conversation
    timelineBody.innerHTML = '';
    const chatMessages = screenChat.querySelectorAll('[data-chat-msg]');
    chatMessages.forEach(function(msg) {
      const clone = msg.cloneNode(true);
      clone.classList.remove('visible');
      clone.style.opacity = '1';
      clone.style.transform = 'none';
      timelineBody.appendChild(clone);
    });

    timelineCta.classList.remove('show');

    // Start animation after a brief delay
    setTimeout(animateTimelineMessages, 300);
  }

  // ===== CTA Button Handler =====
  if (ctaButton) {
    ctaButton.addEventListener('click', function() {
      console.log('CTA clicked: Ready for next screen!');
      // Future: Add transition to next screen here
    });
  }
})();
