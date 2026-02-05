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
    // Phase 1: Initial flirty exchange
    { type: 'msg', side: 'right', text: 'passenger seat tho', emotional: false, delay: 400 },
    { type: 'msg', side: 'left', text: 'That cute smile 😉', emotional: true, delay: 600 },
    { type: 'msg', side: 'right', text: '😂', emotional: false, delay: 300 },
    { type: 'msg', side: 'left', text: 'I mean it', emotional: false, delay: 350 },
    { type: 'msg', side: 'right', text: 'okay okay', emotional: false, delay: 400 },
    { type: 'separator', text: '1 week later', delay: 800 },

    // Phase 2: Introduction
    { type: 'msg', side: 'left', text: "I'm Devika", emotional: true, delay: 500 },
    { type: 'msg', side: 'right', text: 'Sreeharsh', emotional: true, delay: 500 },
    { type: 'msg', side: 'left', text: 'Nice name', emotional: false, delay: 350 },
    { type: 'msg', side: 'right', text: 'Thanks, yours too', emotional: false, delay: 400 },
    { type: 'separator', text: '2 weeks later', delay: 800 },

    // Phase 3: The turning point
    { type: 'msg', side: 'right', text: 'So,how many text until i get to see that cute smile in person', emotional: true, delay: 600 },
    { type: 'msg', side: 'left', text: 'Thts too fast', emotional: false, delay: 400 },
    { type: 'msg', side: 'right', text: 'Is it though?', emotional: false, delay: 350 },
    { type: 'msg', side: 'left', text: 'Maybe not 😅', emotional: false, delay: 450 },
    { type: 'separator', text: 'a day later', delay: 700 },

    // Phase 4: Timeline negotiation
    { type: 'msg', side: 'left', text: '2030?', emotional: false, delay: 400 },
    { type: 'msg', side: 'right', text: '😂', emotional: false, delay: 200 },
    { type: 'msg', side: 'right', text: 'Thts too long', emotional: false, delay: 350 },
    { type: 'msg', side: 'left', text: 'April then', emotional: false, delay: 400 },
    { type: 'msg', side: 'right', text: 'April works', emotional: false, delay: 350 },
    { type: 'msg', side: 'right', text: "Cool,I'll use that to make u rethink waiting", emotional: true, delay: 600 },
    { type: 'msg', side: 'left', text: 'We'll see 😏', emotional: false, delay: 450 },
    { type: 'separator', text: '3 weeks later', delay: 900 },

    // Phase 5: Resolution
    { type: 'msg', side: 'right', text: 'April has 30 days right', emotional: false, delay: 400 },
    { type: 'msg', side: 'left', text: 'Yes why', emotional: false, delay: 350 },
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

    // Clear timeline body
    timelineBody.innerHTML = '';
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
