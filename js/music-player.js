/*
 * Background music controller for the Mr. Dork 3 home page.
 *
 * The visitor's explicit play/pause choice is kept separate from temporary
 * pauses caused by a hidden tab or an unfocused browser window. Browsers may
 * block audible autoplay; in that case playback is retried after the first
 * non-player interaction and the button always reflects the real audio state.
 */
(function (window, document) {
  "use strict";

  var STORAGE_KEY = "mrdork_music_enabled";
  var TARGET_VOLUME = 0.08;
  var FADE_DURATION = 350;

  var audio = document.getElementById("backgroundMusic");
  var button = document.getElementById("musicToggle");
  if (!audio || !button) return;

  var wantsPlayback = readPreference();
  var blurred = false;
  var autoplayBlocked = false;
  var fadeFrame = 0;

  function readPreference() {
    try {
      var stored = window.localStorage.getItem(STORAGE_KEY);
      return stored === null ? true : stored === "true";
    } catch (e) {
      return true;
    }
  }

  function writePreference(value) {
    try {
      window.localStorage.setItem(STORAGE_KEY, value ? "true" : "false");
    } catch (e) {
      /* Playback still works when storage is unavailable. */
    }
  }

  function environmentIsActive() {
    return !document.hidden && !blurred;
  }

  function text(key, fallback) {
    if (window.I18N && typeof window.I18N.t === "function") {
      return window.I18N.t(key) || fallback;
    }
    return fallback;
  }

  function updateButton() {
    var playing = !audio.paused && !audio.ended;
    var label = playing ? text("music.pause", "Pause Music") : text("music.play", "Play Music");
    var icon = playing ? "fa-pause" : "fa-music";

    button.innerHTML = '<span><i class="fa ' + icon + '" aria-hidden="true"></i></span> ' + label;
    button.setAttribute("aria-label", label);
    button.setAttribute("aria-pressed", playing ? "true" : "false");
    button.dataset.autoplayBlocked = autoplayBlocked ? "true" : "false";
  }

  function cancelFade() {
    if (fadeFrame) {
      window.cancelAnimationFrame(fadeFrame);
      fadeFrame = 0;
    }
  }

  function fadeVolume(from, to, duration, done) {
    cancelFade();
    var started = window.performance.now();

    function tick(now) {
      var progress = Math.min((now - started) / duration, 1);
      audio.volume = from + (to - from) * progress;
      if (progress < 1) {
        fadeFrame = window.requestAnimationFrame(tick);
      } else {
        fadeFrame = 0;
        if (done) done();
      }
    }

    fadeFrame = window.requestAnimationFrame(tick);
  }

  function startPlayback(withFade) {
    if (!wantsPlayback || !environmentIsActive()) {
      updateButton();
      return Promise.resolve(false);
    }

    cancelFade();
    audio.volume = withFade ? 0 : TARGET_VOLUME;

    var result;
    try {
      result = audio.play();
    } catch (error) {
      autoplayBlocked = true;
      updateButton();
      return Promise.resolve(false);
    }

    return Promise.resolve(result).then(function () {
      autoplayBlocked = false;
      if (withFade) fadeVolume(0, TARGET_VOLUME, FADE_DURATION);
      updateButton();
      return true;
    }).catch(function () {
      autoplayBlocked = true;
      audio.pause();
      updateButton();
      return false;
    });
  }

  function pausePlayback(withFade) {
    cancelFade();
    if (audio.paused) {
      updateButton();
      return;
    }

    if (!withFade || document.hidden) {
      audio.pause();
      audio.volume = TARGET_VOLUME;
      updateButton();
      return;
    }

    fadeVolume(audio.volume, 0, FADE_DURATION, function () {
      audio.pause();
      audio.volume = TARGET_VOLUME;
      updateButton();
    });
  }

  function userPlay() {
    wantsPlayback = true;
    writePreference(true);
    return startPlayback(true);
  }

  function userPause() {
    wantsPlayback = false;
    autoplayBlocked = false;
    writePreference(false);
    pausePlayback(true);
  }

  button.addEventListener("click", function (event) {
    event.preventDefault();
    if (!audio.paused && !audio.ended) {
      userPause();
    } else {
      userPlay();
    }
  });

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
      pausePlayback(false);
    } else if (!blurred && wantsPlayback) {
      startPlayback(true);
    }
  });

  window.addEventListener("blur", function () {
    blurred = true;
    pausePlayback(false);
  });

  window.addEventListener("focus", function () {
    blurred = false;
    if (!document.hidden && wantsPlayback) startPlayback(true);
  });

  function retryAfterGesture(event) {
    var playerButton = event.target && event.target.closest ? event.target.closest("#musicToggle") : null;
    if (playerButton || !autoplayBlocked || !wantsPlayback) return;
    startPlayback(true).then(function (started) {
      if (started) {
        document.removeEventListener("pointerdown", retryAfterGesture, true);
        document.removeEventListener("keydown", retryAfterGesture, true);
      }
    });
  }

  document.addEventListener("pointerdown", retryAfterGesture, true);
  document.addEventListener("keydown", retryAfterGesture, true);
  window.addEventListener("i18n:changed", updateButton);
  audio.addEventListener("play", updateButton);
  audio.addEventListener("pause", updateButton);
  audio.addEventListener("ended", updateButton);
  audio.addEventListener("error", updateButton);

  audio.volume = TARGET_VOLUME;
  updateButton();

  if (wantsPlayback) {
    startPlayback(true);
  }

  window.MusicPlayer = {
    play: userPlay,
    pause: userPause,
    state: function () {
      return {
        wantsPlayback: wantsPlayback,
        paused: audio.paused,
        hidden: document.hidden,
        blurred: blurred,
        autoplayBlocked: autoplayBlocked,
        currentTime: audio.currentTime,
        volume: audio.volume
      };
    }
  };
})(window, document);
