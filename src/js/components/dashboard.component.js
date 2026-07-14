const dashboardTitle = document.getElementById("dashboard-title");
const dashboardAvatar = document.getElementById("dashboard-avatar");
const dashboardAvatarEmoji = document.getElementById("dashboard-avatar-emoji");
const dashboardLevel = document.getElementById("dashboard-level");
const dashboardXp = document.getElementById("dashboard-xp");
const dashboardStreak = document.getElementById("dashboard-streak");

export function renderDashboard(profile) {
  dashboardTitle.textContent = `Olá, ${profile.name}!`;
  dashboardAvatar.className = `avatar dashboard-avatar ${profile.colorClass}`;
  dashboardAvatarEmoji.textContent = profile.emoji;
  dashboardLevel.textContent = profile.level;
  dashboardXp.textContent = `${profile.xp} XP`;
  dashboardStreak.textContent = `🔥 ${profile.streak} dias`;
}
