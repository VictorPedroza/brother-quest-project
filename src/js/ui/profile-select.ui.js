window.ProfileSelectUI = (function () {
  const gridEl = document.getElementById("profile-grid");

  function createCard(profile, onSelect) {
    const card = document.createElement("button");
    card.className = "profile-card";
    card.type = "button";
    card.setAttribute("aria-label", `Entrar como ${profile.name}`);

    card.innerHTML = `
      <div class="avatar ${profile.colorClass}">
        <span class="text-white">${profile.abbreviation}</span>
      </div>
      <div>
        <h3>${profile.name}</h3>
        <span class="badge">Nível ${profile.level}</span>
      </div>
      <div class="stat-row">
        <span>${profile.xp} XP</span>
        <span>&middot;</span>
        <span class="flame">🔥</span>
        <span>${profile.streak} dias</span>
      </div>
      <div class="hover-indicator">
        Entrar
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M5 12h14M13 6l6 6-6 6"/>
        </svg>
      </div>
    `;

    card.addEventListener("click", () => onSelect(profile.id));
    return card;
  }

  function render(profiles, onSelect) {
    gridEl.innerHTML = "";
    profiles.forEach((profile) => {
      gridEl.appendChild(createCard(profile, onSelect));
    });
  }

  return {
    render,
  };
})();
