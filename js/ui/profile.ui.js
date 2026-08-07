/**
 * Módulo de Interface para Seleção de Perfis (BrotherQuest)
 *
 * @author Victor Pedroza <victor242206@protonmail.com>
 * @since 2026-08-04
 * @version 1.0.0
 */

const ICONS = {
  flame: `
    <svg class="flame-icon" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 23c4.97 0 9-3.58 9-8 0-4.19-3.5-7.5-6.5-11-.3-.35-.88-.28-1.08.13C12.3 6.3 11 8.5 11 11c0 1.1.9 2 2 2 .55 0 1-.45 1-1 0-1.5 1-3 2.5-4.5 1.5 2.5 3.5 5 3.5 7.5 0 2.76-2.24 5-5 5s-5-2.24-5-5c0-1.8 1-3.5 2-4.5.3-.3.1-.8-.3-.8-2.5 1-5 4-5 7.3 0 4.42 4.03 8 9 8z"/>
    </svg>
  `,
  arrow: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"></line>
      <polyline points="12 5 19 12 12 19"></polyline>
    </svg>
  `,
};

export class ProfileUI {
  constructor(containerId = "cardsContainer") {
    this.container = document.getElementById(containerId);
  }

  /**
   * Obtém as iniciais do nome do perfil.
   * @param {string} name - O nome do perfil.
   * @returns {string} As iniciais do nome.
   */
  getInitials(name = "") {
    if (!name) return "??";
    const parts = name.trim().split(" ").filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  /**
   * Cria o elemento HTML para um cartão de perfil.
   * @param {Object} profile - Os dados do perfil.
   * @param {Function} onSelect - A função a ser chamada ao selecionar o perfil.
   * @returns {HTMLElement} O elemento HTML do cartão.
   */
  createProfileCardElement(profile, onSelect) {
    const card = document.createElement("div");
    card.className = "card";
    card.setAttribute("data-color", profile.color || "blue");
    card.setAttribute("data-id", profile.id);

    const initials = this.getInitials(profile.name);
    const level = profile.level ?? 1;
    const streak = profile.streak ?? profile.streak_count ?? 0;

    card.innerHTML = `
      <div class="avatar-wrap">
        <div class="blob"></div>
        <div class="avatar-content">
          <span class="initials">${initials}</span>
          <span class="level-tag">Nível ${level}</span>
        </div>
      </div>
      <h3 class="name">${profile.name}</h3>
      <div class="meta">
        <span>Nível ${level}</span>
        <span class="dot">•</span>
        ${ICONS.flame}
        <span>${streak} dias</span>
      </div>
      <button class="enter-btn">
        JOGAR ${ICONS.arrow}
      </button>
    `;

    if (typeof onSelect === "function") {
      card.addEventListener("click", () => onSelect(profile));
    }

    return card;
  }

  /**
   * Exibe uma mensagem de carregamento.
   */
  showLoading() {
    if (!this.container) return;
    this.container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #94a3b8;">
        <p>Carregando jogadores...</p>
      </div>
    `;
  }

  /**
   * Exibe uma mensagem de erro.
   * @param {string} message - A mensagem de erro.
   */
  showError(message = "Erro ao carregar os perfis.") {
    if (!this.container) return;
    this.container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #ef4444;">
        <p>${message}</p>
      </div>
    `;
  }

  /**
   * Renderiza os perfis na interface.
   * @param {Array} profiles - A lista de perfis a serem renderizados.
   * @param {Object} options - As opções para o renderizador.
   * @param {Function} options.onSelectProfile - A função a ser chamada ao selecionar um perfil.
   */
  renderProfiles(profiles = [], { onSelectProfile } = {}) {
    if (!this.container) return;
    this.container.innerHTML = "";

    if (profiles.length === 0) {
      this.container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #94a3b8;">
          <p>Nenhum jogador cadastrado até o momento.</p>
        </div>
      `;
      return;
    }

    profiles.forEach((profile) => {
      const cardEl = this.createProfileCardElement(profile, onSelectProfile);
      this.container.appendChild(cardEl);
    });
  }
}
