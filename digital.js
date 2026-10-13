console.log("Chrono JavaScript is working!");

// ===== CHRONO DIGITAL CLOCK =====
document.addEventListener("DOMContentLoaded", function () {
  const clock = document.getElementById("clock");
  const greeting = document.getElementById("greeting");
  const dateDisplay = document.getElementById("date");
  const clockContent = document.querySelector(".clock-content");

  const themeButton = document.getElementById("theme-toggle");
  const body = document.body;

  // ===== RESTORE SAVED THEME =====
  const savedTheme = localStorage.getItem("chrono-theme");

  if (savedTheme === "light") {
    body.classList.add("light-mode");
    themeButton.textContent = "🌙 Dark Mode";
    themeButton.setAttribute("aria-label", "Switch to dark mode");
  }

  // ===== CHECK REQUIRED HTML ELEMENTS =====
  const stopwatchDisplay = document.getElementById("stopwatch-display");
  const stopwatchStart = document.getElementById("stopwatch-start");
  const stopwatchReset = document.getElementById("stopwatch-reset");

  if (
    !clock ||
    !greeting ||
    !dateDisplay ||
    !clockContent ||
    !themeButton ||
    !stopwatchDisplay ||
    !stopwatchStart ||
    !stopwatchReset
  ) {
    console.error(
      "Chrono: An HTML element is missing. Check your element IDs and class names.",
    );
    return;
  }

  // ===== 12/24-HOUR FORMAT =====
  let is24Hour = false;

  const formatButton = document.createElement("button");
  formatButton.id = "format-toggle";
  formatButton.type = "button";
  formatButton.textContent = "Switch to 24-hour format";
  formatButton.setAttribute("aria-pressed", "false");

  clockContent.appendChild(formatButton);

  // ===== UPDATE CLOCK =====
  function updateClock() {
    const now = new Date();
    const currentHour = now.getHours();

    if (currentHour < 12) {
      greeting.textContent = "🌅 Good Morning";
    } else if (currentHour < 18) {
      greeting.textContent = "☀️ Good Afternoon";
    } else {
      greeting.textContent = "🌙 Good Evening";
    }

    clock.textContent = now.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: !is24Hour,
    });

    dateDisplay.textContent = now.toLocaleDateString("en-GB", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  formatButton.addEventListener("click", function () {
    is24Hour = !is24Hour;

    formatButton.textContent = is24Hour
      ? "Switch to 12-hour format"
      : "Switch to 24-hour format";

    formatButton.setAttribute("aria-pressed", String(is24Hour));

    updateClock();
  });

  // ===== THEME TOGGLE =====
  themeButton.addEventListener("click", function () {
    const isLightMode = body.classList.toggle("light-mode");

    themeButton.textContent = isLightMode ? "🌙 Dark Mode" : "☀️ Light Mode";

    themeButton.setAttribute(
      "aria-label",
      isLightMode ? "Switch to dark mode" : "Switch to light mode",
    );

    localStorage.setItem("chrono-theme", isLightMode ? "light" : "dark");
  });

  // ===== CHRONO STOPWATCH =====
  let stopwatchElapsed = 0;
  let stopwatchStartedAt = 0;
  let stopwatchInterval = null;
  let stopwatchRunning = false;

  function updateStopwatchDisplay() {
    const elapsed =
      stopwatchElapsed +
      (stopwatchRunning ? Date.now() - stopwatchStartedAt : 0);

    const totalCentiseconds = Math.floor(elapsed / 10);
    const minutes = Math.floor(totalCentiseconds / 6000);
    const seconds = Math.floor((totalCentiseconds % 6000) / 100);
    const centiseconds = totalCentiseconds % 100;

    stopwatchDisplay.textContent =
      String(minutes).padStart(2, "0") +
      ":" +
      String(seconds).padStart(2, "0") +
      "." +
      String(centiseconds).padStart(2, "0");
  }

  stopwatchStart.addEventListener("click", function () {
    if (stopwatchRunning) {
      // Pause the stopwatch
      stopwatchElapsed += Date.now() - stopwatchStartedAt;
      stopwatchRunning = false;

      clearInterval(stopwatchInterval);
      stopwatchInterval = null;

      stopwatchStart.textContent = "Resume";
    } else {
      // Start or resume the stopwatch
      stopwatchStartedAt = Date.now();
      stopwatchRunning = true;

      stopwatchInterval = setInterval(updateStopwatchDisplay, 10);

      stopwatchStart.textContent = "Pause";
    }

    updateStopwatchDisplay();
  });

  stopwatchReset.addEventListener("click", function () {
    clearInterval(stopwatchInterval);

    stopwatchInterval = null;
    stopwatchElapsed = 0;
    stopwatchStartedAt = 0;
    stopwatchRunning = false;

    stopwatchStart.textContent = "Start";

    updateStopwatchDisplay();
  });

  // ===== START EVERYTHING =====
  updateClock();
  updateStopwatchDisplay();

  setInterval(updateClock, 1000);
});

// ===== CHRONO COUNTDOWN TIMER =====

document.addEventListener("DOMContentLoaded", function () {
  const minutesInput = document.getElementById("countdown-minutes");
  const secondsInput = document.getElementById("countdown-seconds");
  const display = document.getElementById("countdown-display");
  const startButton = document.getElementById("countdown-start");
  const resetButton = document.getElementById("countdown-reset");
  const message = document.getElementById("countdown-message");

  let countdownInterval = null;
  let remainingSeconds = 300;
  let endTime = null;

  // ===== COUNTDOWN COMPLETION SOUND =====
  const countdownSound = new Audio(
    "https://actions.google.com/sounds/v1/alarms/beep_short.ogg",
  );

  countdownSound.preload = "auto";
  countdownSound.volume = 0.7;

  function playCountdownSound() {
    countdownSound.currentTime = 0;

    countdownSound.play().catch(function (error) {
      console.warn("Countdown sound could not play:", error);
    });
  }

  function updateDisplay() {
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;

    display.textContent =
      String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0");
  }

  function stopCountdown() {
    clearInterval(countdownInterval);
    countdownInterval = null;
    endTime = null;
  }

  function startCountdown() {
    if (countdownInterval !== null) return;

    if (remainingSeconds <= 0) {
      const minutes = Number(minutesInput.value);
      const seconds = Number(secondsInput.value);

      if (
        minutesInput.value.trim() === "" ||
        secondsInput.value.trim() === "" ||
        !Number.isInteger(minutes) ||
        !Number.isInteger(seconds) ||
        minutes < 0 ||
        minutes > 999 ||
        seconds < 0 ||
        seconds > 59 ||
        minutes + seconds === 0
      ) {
        message.textContent = "Enter a valid time greater than zero.";
        return;
      }

      remainingSeconds = minutes * 60 + seconds;
      updateDisplay();
    }

    message.textContent = "Countdown is running...";
    endTime = Date.now() + remainingSeconds * 1000;

    countdownInterval = setInterval(function () {
      remainingSeconds = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));

      updateDisplay();

      if (remainingSeconds === 0) {
        stopCountdown();
        playCountdownSound();
        message.textContent = "Time is up! ⏰";
      }
    }, 200);
  }

  function resetCountdown() {
    stopCountdown();

    const minutes = Number(minutesInput.value);
    const seconds = Number(secondsInput.value);

    if (
      minutesInput.value.trim() === "" ||
      secondsInput.value.trim() === "" ||
      !Number.isInteger(minutes) ||
      !Number.isInteger(seconds) ||
      minutes < 0 ||
      minutes > 999 ||
      seconds < 0 ||
      seconds > 59
    ) {
      remainingSeconds = 0;
      display.textContent = "00:00";
      message.textContent = "Enter a valid time.";
      return;
    }

    remainingSeconds = minutes * 60 + seconds;
    updateDisplay();
    message.textContent = "Set your time and press Start.";
  }

  minutesInput.addEventListener("input", resetCountdown);
  secondsInput.addEventListener("input", resetCountdown);
  startButton.addEventListener("click", startCountdown);
  resetButton.addEventListener("click", resetCountdown);

  updateDisplay();
});

// ===== CHRONO ALARM CLOCK =====

document.addEventListener("DOMContentLoaded", function () {
  const alarmTimeInput = document.getElementById("alarm-time");
  const alarmDisplay = document.getElementById("alarm-display");
  const setAlarmButton = document.getElementById("alarm-set");
  const stopAlarmButton = document.getElementById("alarm-stop");
  const alarmMessage = document.getElementById("alarm-message");
  const alarmSound = document.getElementById("alarm-sound");

  let alarmTimeout = null;
  let activeAlarmTime = null;
  let alarmRinging = false;

  function stopAlarmSound() {
    alarmSound.pause();
    alarmSound.currentTime = 0;
    alarmRinging = false;
  }

  function clearAlarm() {
    if (alarmTimeout !== null) {
      clearTimeout(alarmTimeout);
      alarmTimeout = null;
    }
  }

  function checkAlarm() {
    if (!activeAlarmTime || alarmRinging) return;

    const now = new Date();
    const currentTime =
      String(now.getHours()).padStart(2, "0") +
      ":" +
      String(now.getMinutes()).padStart(2, "0");

    if (currentTime === activeAlarmTime) {
      clearAlarm();
      alarmRinging = true;
      alarmMessage.textContent = "Wake up! Your alarm is ringing! 🔔";

      alarmSound.play().catch(function () {
        alarmMessage.textContent =
          "Alarm time reached! Tap Stop Alarm, then set another alarm if needed.";
      });
    }
  }

  function scheduleAlarmCheck() {
    clearAlarm();

    if (!activeAlarmTime) return;

    checkAlarm();

    if (!alarmRinging && activeAlarmTime) {
      alarmTimeout = setTimeout(scheduleAlarmCheck, 1000);
    }
  }

  setAlarmButton.addEventListener("click", function () {
    const selectedTime = alarmTimeInput.value;

    if (!selectedTime) {
      alarmMessage.textContent = "Please choose an alarm time first.";
      return;
    }

    clearAlarm();
    stopAlarmSound();

    activeAlarmTime = selectedTime;
    alarmDisplay.textContent = "Alarm set for " + selectedTime;
    alarmMessage.textContent = "Your alarm is active. 🔔";

    scheduleAlarmCheck();
  });

  stopAlarmButton.addEventListener("click", function () {
    clearAlarm();
    stopAlarmSound();
    activeAlarmTime = null;

    alarmDisplay.textContent = "No alarm set";
    alarmMessage.textContent = "Alarm stopped. Set a new time when ready.";
  });

  window.addEventListener("beforeunload", clearAlarm);
});

// ===== CHRONO WORLD CLOCK =====

document.addEventListener("DOMContentLoaded", function () {
  const cities = [
    {
      timeId: "lagos-time",
      dateId: "lagos-date",
      timeZone: "Africa/Lagos",
    },
    {
      timeId: "london-time",
      dateId: "london-date",
      timeZone: "Europe/London",
    },
    {
      timeId: "newyork-time",
      dateId: "newyork-date",
      timeZone: "America/New_York",
    },
  ];

  function updateWorldClocks() {
    cities.forEach(function (city) {
      const timeElement = document.getElementById(city.timeId);
      const dateElement = document.getElementById(city.dateId);

      if (!timeElement || !dateElement) return;

      const now = new Date();

      timeElement.textContent = new Intl.DateTimeFormat("en-GB", {
        timeZone: city.timeZone,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).format(now);

      dateElement.textContent = new Intl.DateTimeFormat("en-GB", {
        timeZone: city.timeZone,
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(now);
    });
  }

  updateWorldClocks();
  setInterval(updateWorldClocks, 1000);
});

/* ===== CHRONO POMODORO FOCUS TIMER ===== */

(function () {
  function initPomodoro() {
    const display = document.getElementById("pomodoro-display");
    const status = document.getElementById("pomodoro-status");
    const message = document.getElementById("pomodoro-message");

    const focusButton = document.getElementById("pomodoro-focus");
    const breakButton = document.getElementById("pomodoro-break");
    const startButton = document.getElementById("pomodoro-start");
    const pauseButton = document.getElementById("pomodoro-pause");
    const resetButton = document.getElementById("pomodoro-reset");

    // Make sure every required HTML element exists.
    if (
      !display ||
      !status ||
      !message ||
      !focusButton ||
      !breakButton ||
      !startButton ||
      !pauseButton ||
      !resetButton
    ) {
      console.error("Pomodoro: A required HTML element is missing.");
      return;
    }

    const FOCUS_TIME = 25 * 60;
    const BREAK_TIME = 5 * 60;

    let currentMode = "focus";
    let remainingSeconds = FOCUS_TIME;
    let timerInterval = null;
    let endTime = null;

    function updateDisplay() {
      const minutes = Math.floor(remainingSeconds / 60);
      const seconds = remainingSeconds % 60;

      display.textContent =
        String(minutes).padStart(2, "0") +
        ":" +
        String(seconds).padStart(2, "0");

      const circle = document.querySelector(".pomodoro-circle");
      const totalSeconds = currentMode === "focus" ? FOCUS_TIME : BREAK_TIME;

      const progress = (remainingSeconds / totalSeconds) * 100;

      if (circle) {
        circle.style.setProperty("--pomodoro-progress", `${progress}%`);
      }
    }

    function updateModeButtons() {
      focusButton.classList.toggle("active", currentMode === "focus");

      breakButton.classList.toggle("active", currentMode === "break");
    }

    function stopTimer() {
      if (timerInterval !== null) {
        clearInterval(timerInterval);
        timerInterval = null;
      }

      endTime = null;
    }

    function selectMode(mode) {
      stopTimer();

      currentMode = mode;
      remainingSeconds = mode === "focus" ? FOCUS_TIME : BREAK_TIME;

      status.textContent =
        mode === "focus" ? "Ready to focus" : "Time to relax";

      message.textContent =
        mode === "focus"
          ? "Ready? Start your focus session!"
          : "Ready for a short break?";

      updateDisplay();
      updateModeButtons();
    }

    function finishTimer() {
      stopTimer();
      remainingSeconds = 0;

      updateDisplay();
      status.textContent = "Session complete!";

      message.textContent =
        currentMode === "focus"
          ? "Focus session complete! Take a short break. 🎉"
          : "Break finished! Ready to focus again? 🚀";
    }

    function tick() {
      if (endTime === null) return;

      remainingSeconds = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));

      updateDisplay();

      if (remainingSeconds === 0) {
        finishTimer();
      }
    }

    function startTimer() {
      if (timerInterval !== null) return;

      if (remainingSeconds <= 0) {
        message.textContent = "Press Reset to start a new session.";
        return;
      }

      endTime = Date.now() + remainingSeconds * 1000;

      status.textContent =
        currentMode === "focus" ? "Focus in progress" : "Break in progress";

      message.textContent =
        currentMode === "focus"
          ? "Stay focused. You've got this! 💪"
          : "Relax and recharge. ☕";

      tick();

      if (remainingSeconds > 0) {
        timerInterval = setInterval(tick, 250);
      }
    }

    function pauseTimer() {
      if (timerInterval === null) return;

      remainingSeconds = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));

      stopTimer();
      updateDisplay();

      if (remainingSeconds === 0) {
        finishTimer();
        return;
      }

      status.textContent = "Paused";
      message.textContent = "Timer paused. Press Start to continue.";
    }

    function resetTimer() {
      stopTimer();

      remainingSeconds = currentMode === "focus" ? FOCUS_TIME : BREAK_TIME;

      status.textContent =
        currentMode === "focus" ? "Ready to focus" : "Time to relax";

      message.textContent = "Timer reset. Ready when you are!";

      updateDisplay();
    }

    focusButton.addEventListener("click", function () {
      selectMode("focus");
    });

    breakButton.addEventListener("click", function () {
      selectMode("break");
    });

    startButton.addEventListener("click", startTimer);
    pauseButton.addEventListener("click", pauseTimer);
    resetButton.addEventListener("click", resetTimer);

    updateDisplay();
    updateModeButtons();

    console.log("Chrono Pomodoro Timer is working!");
  }

  // Works whether the page is loading or already loaded.
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initPomodoro);
  } else {
    initPomodoro();
  }
})();
