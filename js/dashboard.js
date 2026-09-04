import { AuthService } from "./service/auth.service.js";
import { ActivityService } from "./service/activity.service.js";
import { supabase } from "./supabase/supabaseClient.js";

const logoutButton = document.querySelector(".logout-button");
const activitiesList = document.querySelector("#activitiesList");
const activitiesCount = document.querySelector("#activitiesCount");
const profileName = document.querySelector(".user-menu__name");
const profileLevel = document.querySelector(".user-menu__level");
const currentLevel = document.querySelector("#current-level");
const xpValue = document.querySelector(".level-card__xp-value");
const levelHint = document.querySelector(".level-card__hint");
const progressFill = document.querySelector(".progress__fill");
const progressBar = document.querySelector(".progress");
const metricValues = document.querySelectorAll(".metric__value");

let activities = [];
let completedActivityIds = new Set();

function getActivityKey(activity) {
  return activity.frequency === "weekly" ? "weekly" : "daily";
}

function renderActivities() {
  if (!activitiesList) return;

  const completedCount = activities.filter((activity) =>
    completedActivityIds.has(activity.id),
  ).length;
  activitiesCount.textContent = `${completedCount}/${activities.length}`;
  if (metricValues[2]) metricValues[2].textContent = `${completedCount}/${activities.length}`;

  if (!activities.length) {
    activitiesList.innerHTML = '<p class="activities-message">Nenhuma atividade cadastrada.</p>';
    return;
  }

  activitiesList.innerHTML = activities
    .map((activity) => {
      const completed = completedActivityIds.has(activity.id);
      return `
        <article class="activity-item${completed ? " activity-item--completed" : ""}">
          <div class="activity-item__content">
            <h3>${activity.title}</h3>
            <p>${getActivityKey(activity)} · ${activity.xp_reward} XP · ${activity.coins_reward} moedas</p>
          </div>
          <button class="activity-button" type="button" data-activity-id="${activity.id}" ${completed ? "disabled" : ""}>
            ${completed ? "Concluída" : "Concluir"}
          </button>
        </article>`;
    })
    .join("");
}

function updateProfile(profile) {
  const level = Math.floor(profile.xp / 100) + 1;
  const xpInLevel = profile.xp % 100;
  const remainingXp = 100 - xpInLevel;

  profileName.textContent = profile.name;
  profileLevel.textContent = `Nível ${level}`;
  currentLevel.textContent = `Nível ${level}`;
  xpValue.innerHTML = `${xpInLevel} <span>/ 100 XP</span>`;
  levelHint.innerHTML = `Faltam <strong>${remainingXp} <span>XP</span></strong> para o próximo nível!`;
  progressFill.style.width = `${xpInLevel}%`;
  progressBar.setAttribute("aria-valuenow", xpInLevel);
  metricValues[0].textContent = `${profile.streak_count} dias`;
  metricValues[1].textContent = `${profile.xp} XP`;
}

async function handleActivityClick(event) {
  const button = event.target.closest("[data-activity-id]");
  if (!button) return;

  button.disabled = true;

  try {
    const result = await ActivityService.completeActivity(button.dataset.activityId);
    completedActivityIds.add(button.dataset.activityId);
    renderActivities();
    updateProfile({
      name: profileName.textContent,
      xp: result.xp_total,
      streak_count: result.streak_count,
    });
  } catch (error) {
    console.error("Erro ao concluir atividade:", error);
    button.disabled = false;
    alert(error.message || "Não foi possível concluir a atividade.");
  }
}

async function loadDashboard() {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) throw userError || new Error("Sessão expirada");

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("name, xp, streak_count")
      .eq("id", userData.user.id)
      .single();
    if (profileError) throw profileError;

    const [loadedActivities, completions] = await Promise.all([
      ActivityService.getActivities(),
      ActivityService.getCurrentCompletions(),
    ]);
    activities = loadedActivities;
    completedActivityIds = new Set(
      completions
        .filter((completion) => {
          const activity = activities.find((item) => item.id === completion.activity_id);
          if (!activity) return false;
          if (activity.frequency === "weekly") return true;
          return completion.completed_at.slice(0, 10) === new Date().toISOString().slice(0, 10);
        })
        .map((item) => item.activity_id),
    );
    updateProfile(profile);
    renderActivities();
  } catch (error) {
    console.error("Erro ao carregar dashboard:", error);
    activitiesList.innerHTML = '<p class="activities-message">Não foi possível carregar as atividades.</p>';
  }
}

activitiesList?.addEventListener("click", handleActivityClick);
loadDashboard();

logoutButton?.addEventListener("click", async () => {
  logoutButton.disabled = true;

  try {
    await AuthService.logout();
    window.location.href = "/index.html";
  } catch (error) {
    console.error("Erro ao realizar logout:", error);
    logoutButton.disabled = false;
    alert("Não foi possível sair. Tente novamente.");
  }
});