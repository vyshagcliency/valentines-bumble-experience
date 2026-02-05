(function () {
  'use strict';

  // ===== Elements =====
  const screenProfile = document.getElementById('screen-profile');
  const screenMatch = document.getElementById('screen-match');
  const screenChat = document.getElementById('screen-chat');
  const screenTimeline = document.getElementById('screen-timeline');
  const screenNarration = document.getElementById('screen-narration');
  const screenDiaryCover = document.getElementById('screen-diary-cover');
  const screenDiaryPages = document.getElementById('screen-diary-pages');
  const card = document.getElementById('swipe-card');
  const nopeMessage = document.getElementById('nope-message');
  const timelineBody = document.getElementById('timeline-body');
  const timelineCta = document.getElementById('timeline-cta');
  const ctaButton = document.getElementById('cta-button');
  const narrationText = document.getElementById('narration-text');
  const diaryBook = document.getElementById('diary-book');
  const passwordModal = document.getElementById('password-modal');
  const passwordInput = document.getElementById('password-input');
  const passwordSubmit = document.getElementById('password-submit');
  const passwordError = document.getElementById('password-error');
  const diaryCloseBtn = document.getElementById('diary-close-btn');

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
      showNarrationScreen();
    });
  }

  // ===== Narration Screen =====
  function showNarrationScreen() {
    if (!screenNarration || !narrationText) return;

    switchScreen(screenTimeline, screenNarration);

    // Show narration text with typewriter effect
    narrationText.classList.add('show');

    // Check if Typed.js is available
    if (typeof Typed !== 'undefined') {
      const typed = new Typed('#narration-text', {
        strings: ["that's when the diary of my life started getting written"],
        typeSpeed: 50,
        showCursor: false,
        onComplete: function() {
          // Auto-advance to diary cover after 2 seconds
          setTimeout(showDiaryCoverScreen, 2000);
        }
      });
    } else {
      // Fallback: Show text instantly
      narrationText.textContent = "that's when the diary of my life started getting written";
      setTimeout(showDiaryCoverScreen, 3000);
    }
  }

  // ===== Diary Cover Screen =====
  function showDiaryCoverScreen() {
    if (!screenDiaryCover || !diaryBook) return;

    switchScreen(screenNarration, screenDiaryCover);

    // Add click handler to diary book
    diaryBook.addEventListener('click', showPasswordModal);
  }

  // ===== Password Modal =====
  function showPasswordModal() {
    if (!passwordModal || !passwordInput) return;

    passwordModal.classList.add('show');

    // Auto-focus input after animation
    setTimeout(function() {
      passwordInput.focus();
    }, 400);
  }

  function hidePasswordModal() {
    if (!passwordModal) return;
    passwordModal.classList.remove('show');
  }

  function validatePassword() {
    if (!passwordInput || !passwordError) return;

    const password = passwordInput.value.trim().toLowerCase();
    const correctPassword = 'devika';

    if (password === correctPassword) {
      // Correct password
      passwordError.textContent = '';
      hidePasswordModal();

      // Confetti burst
      setTimeout(confettiForDiary, 300);

      // Show diary pages
      setTimeout(showDiaryPagesScreen, 800);
    } else {
      // Wrong password
      passwordError.textContent = 'Wrong password. Try again!';

      // Shake animation
      const passwordContent = passwordModal.querySelector('.password-content');
      if (passwordContent) {
        passwordContent.classList.add('shake');
        setTimeout(function() {
          passwordContent.classList.remove('shake');
        }, 500);
      }

      // Clear input
      passwordInput.value = '';
      passwordInput.focus();
    }
  }

  // ===== Confetti for Diary =====
  function confettiForDiary() {
    if (typeof confetti !== 'function') return;

    // Center burst
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { x: 0.5, y: 0.5 },
      colors: ['#FFD700', '#FFC629', '#FF69B4', '#FFB6C1', '#FFFF00'],
    });

    // Side bursts
    setTimeout(function() {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { x: 0.2, y: 0.6 },
        colors: ['#FFD700', '#FFC629', '#FF69B4'],
      });
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { x: 0.8, y: 0.6 },
        colors: ['#FFD700', '#FFC629', '#FF69B4'],
      });
    }, 200);
  }

  // ===== Diary Pages Screen =====
  function showDiaryPagesScreen() {
    if (!screenDiaryPages) return;

    switchScreen(screenDiaryCover, screenDiaryPages);

    // Reset to first spread when opening
    currentSpread = 0;
    updateSpreadDisplay();
    updateNavigationButtons();
  }

  // ===== Diary Pages Navigation =====
  let currentSpread = 0;
  const totalSpreads = 4;
  let isAnimating = false;
  let valentineResponseShown = false;

  const diarySpreads = document.querySelectorAll('.diary-spread');
  const pageIndicators = document.querySelectorAll('.page-indicator');
  const navPrevBtn = document.querySelector('.nav-prev');
  const navNextBtn = document.querySelector('.nav-next');
  const diaryBookWrapper = document.querySelector('.diary-book-wrapper');
  const valentineYesBtn = document.getElementById('valentine-yes');
  const valentineNoBtn = document.getElementById('valentine-no');
  const valentineButtons = document.getElementById('valentine-buttons');
  const noResponse = document.getElementById('no-response');
  const yesResponse = document.getElementById('yes-response');

  function updateSpreadDisplay() {
    diarySpreads.forEach((spread, index) => {
      if (index === currentSpread) {
        spread.classList.add('active');
      } else {
        spread.classList.remove('active');
      }
    });

    pageIndicators.forEach((indicator, index) => {
      if (index === currentSpread) {
        indicator.classList.add('active');
      } else {
        indicator.classList.remove('active');
      }
    });
  }

  function updateNavigationButtons() {
    if (navPrevBtn) {
      navPrevBtn.disabled = currentSpread === 0;
    }
    if (navNextBtn) {
      navNextBtn.disabled = currentSpread === totalSpreads - 1;
    }
  }

  function turnPageForward() {
    if (isAnimating || currentSpread >= totalSpreads - 1) return;

    isAnimating = true;
    const currentSpreadEl = diarySpreads[currentSpread];

    currentSpreadEl.classList.add('turning-forward');

    setTimeout(() => {
      currentSpreadEl.classList.remove('turning-forward', 'active');
      currentSpread++;
      updateSpreadDisplay();
      updateNavigationButtons();
      isAnimating = false;
    }, 800);
  }

  function turnPageBackward() {
    if (isAnimating || currentSpread === 0) return;

    isAnimating = true;
    currentSpread--;
    const newSpreadEl = diarySpreads[currentSpread];

    newSpreadEl.classList.add('active', 'turning-backward');

    setTimeout(() => {
      newSpreadEl.classList.remove('turning-backward');
      updateSpreadDisplay();
      updateNavigationButtons();
      isAnimating = false;
    }, 800);
  }

  function handlePageClick(event) {
    if (isAnimating) return;

    const rect = diaryBookWrapper.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const halfWidth = rect.width / 2;

    if (clickX > halfWidth) {
      turnPageForward();
    } else {
      turnPageBackward();
    }
  }

  function handleKeyboard(event) {
    if (!screenDiaryPages || !screenDiaryPages.classList.contains('active')) return;

    switch(event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        turnPageForward();
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        turnPageBackward();
        break;
      case 'Escape':
        if (diaryCloseBtn) {
          diaryCloseBtn.click();
        }
        break;
    }
  }

  // Touch swipe support for diary pages
  let diaryTouchStartX = 0;
  let diaryTouchEndX = 0;

  function handleDiaryTouchStart(event) {
    diaryTouchStartX = event.touches[0].clientX;
  }

  function handleDiaryTouchEnd(event) {
    diaryTouchEndX = event.changedTouches[0].clientX;
    const swipeDistance = diaryTouchStartX - diaryTouchEndX;

    if (Math.abs(swipeDistance) > 50) {
      if (swipeDistance > 0) {
        // Swiped left - go forward
        turnPageForward();
      } else {
        // Swiped right - go backward
        turnPageBackward();
      }
    }
  }

  // Valentine button handlers
  function handleNoButton() {
    if (!valentineButtons || !noResponse) return;

    valentineButtons.style.display = 'none';
    noResponse.style.display = 'flex';

    setTimeout(() => {
      noResponse.style.display = 'none';
      valentineButtons.style.display = 'flex';
    }, 3000);
  }

  function handleYesButton() {
    if (!valentineButtons || !yesResponse) return;

    valentineButtons.style.display = 'none';
    yesResponse.style.display = 'flex';
    valentineResponseShown = true;

    // Trigger confetti bursts
    if (typeof confetti === 'function') {
      setTimeout(() => confetti(), 300);
      setTimeout(() => confetti(), 800);
      setTimeout(() => confetti(), 1500);
    }
  }

  // Event Listeners for diary pages navigation
  if (navPrevBtn) {
    navPrevBtn.addEventListener('click', turnPageBackward);
  }

  if (navNextBtn) {
    navNextBtn.addEventListener('click', turnPageForward);
  }

  if (diaryBookWrapper) {
    diaryBookWrapper.addEventListener('click', handlePageClick);
    diaryBookWrapper.addEventListener('touchstart', handleDiaryTouchStart);
    diaryBookWrapper.addEventListener('touchend', handleDiaryTouchEnd);
  }

  if (pageIndicators.length > 0) {
    pageIndicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => {
        if (isAnimating) return;
        if (index > currentSpread) {
          turnPageForward();
        } else if (index < currentSpread) {
          turnPageBackward();
        }
      });
    });
  }

  if (valentineNoBtn) {
    valentineNoBtn.addEventListener('click', handleNoButton);
  }

  if (valentineYesBtn) {
    valentineYesBtn.addEventListener('click', handleYesButton);
  }

  document.addEventListener('keydown', handleKeyboard);

  // ===== Password Event Listeners =====
  if (passwordSubmit) {
    passwordSubmit.addEventListener('click', validatePassword);
  }

  if (passwordInput) {
    passwordInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        validatePassword();
      }
    });
  }

  // ===== Diary Close Button =====
  if (diaryCloseBtn) {
    diaryCloseBtn.addEventListener('click', function() {
      switchScreen(screenDiaryPages, screenDiaryCover);
    });
  }
})();
