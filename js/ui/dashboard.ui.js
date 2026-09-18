export class DashboardUI {
  constructor() {
    this.logoutButton = document.querySelector(".logout-button");
    this.activitiesList = document.querySelector("#activitiesList");
    this.activitiesCount = document.querySelector("#activitiesCount");
    this.profileName = document.querySelector(".user-menu__name");
    this.profileLevel = document.querySelector(".user-menu__level");
    this.currentLevel = document.querySelector("#current-level");
    this.xpValue = document.querySelector(".level-card__xp-value");
    this.levelHint = document.querySelector(".level-card__hint");
    this.progressFill = document.querySelector(".progress__fill");
    this.progressBar = document.querySelector(".progress");
    this.streakValue = document.querySelector(".streak-metric__value");
    this.xpMetricValue = document.querySelector(".xp-metric__value");
    this.coinValue = document.querySelector(".coin-metric__value");
    this.completedMetricValue = document.querySelector(".completed-metric__value");
  }

  onLogout(handler) {
    this.logoutButton?.addEventListener("click", handler);
  }

  onCompleteActivity(handler) {
    this.activitiesList?.addEventListener("click", (event) => {
      const button = event.target.closest("[data-activity-id]");
      if (!button) return;

      event.preventDefault();
      button.parentElement.querySelector(".activity-photo-input")?.click();
    });

    this.activitiesList?.addEventListener("change", (event) => {
      const input = event.target.closest(".activity-photo-input");
      if (!input?.files?.[0]) return;

      const button = input.parentElement.querySelector("[data-activity-id]");
      handler(button.dataset.activityId, button, input.files[0]);
      input.value = "";
    });
  }

  setLogoutLoading(isLoading) {
    if (this.logoutButton) this.logoutButton.disabled = isLoading;
  }

  setActivityLoading(button, isLoading) {
    if (button) button.disabled = isLoading;
  }

  showActivityError(message) {
    if (this.activitiesList) {
      this.activitiesList.innerHTML = `<p class="activities-message">${message}</p>`;
    }
  }

  renderActivities(activities, completedActivityIds) {
    const completedCount = activities.filter((activity) =>
      completedActivityIds.has(activity.id),
    ).length;

    this.activitiesCount.textContent = `${completedCount}/${activities.length}`;
    if (this.completedMetricValue) {
      this.completedMetricValue.textContent = `${completedCount}/${activities.length}`;
    }

    if (!activities.length) {
      this.showActivityError("Nenhuma atividade cadastrada.");
      return;
    }

    const dailyActivities = activities.filter((activity) => activity.frequency === "daily");
    const weeklyActivities = activities.filter((activity) => activity.frequency === "weekly");
    this.activitiesList.innerHTML = [
      this.renderActivityGroup("Atividades diárias", dailyActivities, completedActivityIds),
      this.renderActivityGroup("Atividades semanais", weeklyActivities, completedActivityIds),
    ].join(""); 
  }

  renderActivityGroup(title, activities, completedActivityIds) {
    if (!activities.length) return "";

    return `
      <section class="activity-group" aria-labelledby="${title.toLowerCase()}-activities-title">
        <h3 class="activity-group__title" id="${title.toLowerCase()}-activities-title">${title}</h3>
        <div class="activity-group__list">
          ${activities.map((activity) => this.renderActivity(activity, completedActivityIds)).join("")}
        </div>
      </section>`;
  }

  renderActivity(activity, completedActivityIds) {
    const completed = completedActivityIds.has(activity.id);
    const frequency = activity.frequency === "weekly" ? "Semanal" : "Diária";

    return `
      <article class="activity-item${completed ? " activity-item--completed" : ""}">
        <div class="activity-item__content">
          <h4>${activity.title}</h4>
          <p>${frequency} · ${activity.xp_reward} XP · ${activity.coins_reward}</p>
        </div>
        <div class="activity-action">
          <input class="activity-photo-input" type="file" accept="image/*" capture="environment" aria-label="Enviar foto da conclusão de ${activity.title}" ${completed ? "disabled" : ""} />
          <button class="activity-button" type="button" data-activity-id="${activity.id}" ${completed ? "disabled" : ""}>
            ${completed ? "Concluída" : "Concluir"}
          </button>
        </div>
      </article>`;
  }

  updateProfile(profile) {
    const level = Math.floor(profile.xp / 100) + 1;
    const xpInLevel = profile.xp % 100;
    const remainingXp = 100 - xpInLevel;
    const coins = Number(profile.coins ?? 0);

    this.profileName.textContent = profile.name;
    this.profileLevel.textContent = `Nível ${level}`;
    this.currentLevel.textContent = `Nível ${level}`;
    this.xpValue.innerHTML = `${xpInLevel} <span>/ 100 XP</span>`;
    this.levelHint.innerHTML = `Faltam <strong>${remainingXp} <span>XP</span></strong> para o próximo nível!`;
    this.progressFill.style.width = `${xpInLevel}%`;
    this.progressBar.setAttribute("aria-valuenow", xpInLevel);
    if (this.streakValue) this.streakValue.textContent = `${profile.streak_count} dias`;
    if (this.xpMetricValue) this.xpMetricValue.textContent = `${profile.xp} XP`;
    if (this.coinValue) this.coinValue.textContent = `${coins} Gold`;
  }
}