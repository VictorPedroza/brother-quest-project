window.DashboardUI = (function () {
  const titleEl = document.getElementById("dashboard-title");
  const avatarEl = document.getElementById("dashboard-avatar");
  const avatarEmojiEl = document.getElementById("dashboard-avatar-emoji");
  const levelEl = document.getElementById("dashboard-level");
  const xpEl = document.getElementById("dashboard-xp");
  const streakEl = document.getElementById("dashboard-streak");
  const logoutBtn = document.getElementById("logout-btn");

  function render(profile) {
    titleEl.textContent = `Olá, ${profile.name}!`;
    avatarEl.className = `avatar dashboard-avatar ${profile.colorClass}`;
    avatarEmojiEl.textContent = profile.emoji;
    levelEl.textContent = profile.level;
    xpEl.textContent = `${profile.xp} XP`;
    streakEl.textContent = `🔥 ${profile.streak} dias`;
  }

  function onLogout(callback) {
    logoutBtn.addEventListener("click", callback);
  }

  return {
    render,
    onLogout,
  };
})();