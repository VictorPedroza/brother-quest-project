/**
 * Escapa texto para inserção segura em conteúdo HTML.
 * @param {*} value - Valor a ser escapado.
 * @returns {string} Texto escapado.
 */
function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

/**
 * Formata uma data para exibição resumida em pt-BR.
 * @param {string|Date} value - Data a formatar.
 * @returns {string} Data formatada.
 */
function formatDate(value) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
  }).format(new Date(value));
}

/** Renderização e interação da loja de recompensas. */
export class RewardsUI {
  /** Inicializa as referências aos elementos da loja de recompensas. */
  constructor() {
    this.rewardsGrid = document.querySelector("#rewardsGrid");
    this.redemptionsList = document.querySelector("#redemptionsList");
    this.balance = document.querySelector("#rewardsBalance");
    this.message = document.querySelector("#rewardsMessage");
    this.logoutButton = document.querySelector(".logout-button");
  }

  /**
   * Registra o callback do botão de logout.
   * @param {Function} handler - Callback executado ao sair.
   * @returns {void}
   */
  onLogout(handler) {
    this.logoutButton?.addEventListener("click", handler);
  }

  /**
   * Registra o callback de resgate na grade de prêmios.
   * @param {Function} handler - Callback com ID do prêmio e botão acionado.
   * @returns {void}
   */
  onRedeem(handler) {
    this.rewardsGrid?.addEventListener("click", (event) => {
      const button = event.target.closest("[data-reward-id]");
      if (button) handler(button.dataset.rewardId, button);
    });
  }

  /**
   * Atualiza o estado do botão de logout.
   * @param {boolean} isLoading - Indica se o logout está em andamento.
   * @returns {void}
   */
  setLogoutLoading(isLoading) {
    if (this.logoutButton) this.logoutButton.disabled = isLoading;
  }

  /**
   * Atualiza o estado do botão de resgate.
   * @param {HTMLButtonElement} button - Botão do prêmio.
   * @param {boolean} isLoading - Indica se o resgate está em andamento.
   * @returns {void}
   */
  setRedeemLoading(button, isLoading) {
    if (!button) return;
    button.disabled = isLoading;
    button.textContent = isLoading ? "Resgatando..." : "Resgatar prêmio";
  }

  /**
   * Atualiza os dados do jogador e o saldo exibido.
   * @param {Object} profile - Dados atuais do perfil.
   * @returns {void}
   */
  updateProfile(profile) {
    const level = Math.floor(profile.xp / 100) + 1;
    const initials = profile.name
      .split(" ")
      .map((name) => name[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

    document.querySelector(".user-menu__name").textContent = profile.name;
    document.querySelector(".user-menu__level").textContent = `Nível ${level}`;
    document.querySelector(".user-menu__avatar").textContent = initials;
    this.balance.textContent = `${Number(profile.coins || 0)} Gold`;
  }

  /**
   * Exibe uma mensagem de estado da loja.
   * @param {string} message - Mensagem a exibir.
   * @param {boolean} [isError=false] - Indica se a mensagem representa erro.
   * @returns {void}
   */
  showMessage(message, isError = false) {
    this.message.textContent = message;
    this.message.classList.toggle("rewards-message--error", isError);
  }

  /**
   * Renderiza os prêmios e atualiza o saldo disponível.
   * @param {Array<Object>} rewards - Prêmios disponíveis.
   * @param {number} balance - Saldo atual em Gold.
   * @returns {void}
   */
  renderRewards(rewards, balance) {
    this.balance.textContent = `${Number(balance || 0)} Gold`;
    if (!rewards.length) {
      this.rewardsGrid.innerHTML = `<p class="rewards-message">Nenhum prêmio disponível no momento.</p>`;
      return;
    }

    this.rewardsGrid.innerHTML = rewards.map((reward) => {
      const affordable = balance >= reward.price;
      const available = reward.stock > 0;
      const disabled = !affordable || !available;
      const status = !available ? "Esgotado" : `${reward.stock} disponível${reward.stock === 1 ? "" : "is"}`;
      return `
        <article class="reward-card${!available ? " reward-card--sold-out" : ""}">
          <div class="reward-card__icon" aria-hidden="true">✦</div>
          <div class="reward-card__body">
            <p class="reward-card__status">${escapeHtml(status)}</p>
            <h2>${escapeHtml(reward.title)}</h2>
            <p class="reward-card__price"><span aria-hidden="true">◈</span> ${reward.price} Gold</p>
          </div>
          <button class="reward-card__button" type="button" data-reward-id="${escapeHtml(reward.id)}" ${disabled ? "disabled" : ""}>
            ${!available ? "Indisponível" : !affordable ? "Gold insuficiente" : "Resgatar prêmio"}
          </button>
        </article>`;
    }).join("");
  }

  /**
   * Renderiza o histórico de resgates do jogador.
   * @param {Array<Object>} redemptions - Resgates do jogador.
   * @param {Map<string, string>} rewardsById - Títulos dos prêmios indexados por ID.
   * @returns {void}
   */
  renderRedemptions(redemptions, rewardsById) {
    if (!redemptions.length) {
      this.redemptionsList.innerHTML = `<p class="rewards-message">Seus resgates aparecerão aqui.</p>`;
      return;
    }

    this.redemptionsList.innerHTML = redemptions.map((redemption) => `
      <article class="redemption-item">
        <div>
          <strong>${escapeHtml(rewardsById.get(redemption.reward_id) || "Prêmio")}</strong>
          <span>${formatDate(redemption.created_at)}</span>
        </div>
        <span class="redemption-status redemption-status--${escapeHtml(redemption.status)}">${escapeHtml(redemption.status)}</span>
      </article>`).join("");
  }
}
