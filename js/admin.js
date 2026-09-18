import { AuthService } from "./service/auth.service.js";
import { ProfileService } from "./service/profile.service.js";
import { RewardService } from "./service/reward.service.js";

const tableBody = document.querySelector("#playersTableBody");
const playersCount = document.querySelector("#playersCount");
const averageXp = document.querySelector("#averageXp");
const highestLevel = document.querySelector("#highestLevel");
const redemptionsCount = document.querySelector("#redemptionsCount");
const sessionEmail = document.querySelector("#adminSessionEmail");
const logoutButton = document.querySelector("#adminLogoutButton");
const refreshButton = document.querySelector("#refreshPlayers");
const refreshRedemptionsButton = document.querySelector("#refreshRedemptions");
const redemptionsTableBody = document.querySelector("#redemptionsTableBody");

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function initials(name) {
  return name.trim().split(/\s+/).map((part) => part[0]).slice(0, 2).join("").toUpperCase();
}

function renderPlayers(players) {
  const totalXp = players.reduce((sum, player) => sum + player.xp, 0);
  const maxLevel = players.reduce((max, player) => Math.max(max, player.level), 0);
  playersCount.textContent = players.length;
  averageXp.textContent = players.length ? `${Math.round(totalXp / players.length)} XP` : "0 XP";
  highestLevel.textContent = players.length ? `Nível ${maxLevel}` : "Nível 0";

  if (!players.length) {
    tableBody.innerHTML = '<tr><td colspan="5">Nenhum jogador encontrado.</td></tr>';
    return;
  }

  tableBody.innerHTML = players.map((player) => `
    <tr>
      <td><span class="admin-player"><span class="admin-player__avatar">${initials(player.name)}</span><strong>${player.name}</strong></span></td>
      <td><span class="admin-level">Nível ${player.level}</span></td>
      <td>${player.xp} XP</td>
      <td>${player.streak} dias</td>
      <td>${player.coins} Gold</td>
    </tr>`).join("");
}

async function loadPlayers() {
  refreshButton.disabled = true;
  tableBody.innerHTML = '<tr><td colspan="5">Atualizando jogadores...</td></tr>';

  try {
    renderPlayers(await ProfileService.getPlayerProfiles());
  } catch (error) {
    console.error("Erro ao carregar jogadores:", error);
    tableBody.innerHTML = '<tr><td colspan="5">Não foi possível carregar os jogadores.</td></tr>';
  } finally {
    refreshButton.disabled = false;
  }
}

function relatedValue(value) {
  return Array.isArray(value) ? value[0] : value;
}

function formatDate(value) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatStatus(status) {
  const labels = { pending: "Pendente", approved: "Aprovado", rejected: "Recusado" };
  return labels[status] || status || "Pendente";
}

function renderRedemptions(redemptions) {
  redemptionsCount.textContent = redemptions.length;

  if (!redemptions.length) {
    redemptionsTableBody.innerHTML = '<tr><td colspan="5">Nenhum resgate registrado.</td></tr>';
    return;
  }

  redemptionsTableBody.innerHTML = redemptions.map((redemption) => {
    const profile = relatedValue(redemption.profiles);
    const reward = relatedValue(redemption.rewards);
    const status = formatStatus(redemption.status);

    return `
      <tr>
        <td><span class="admin-player"><span class="admin-player__avatar">${initials(profile?.name || "?")}</span><strong>${escapeHtml(profile?.name || "Usuário")}</strong></span></td>
        <td>${escapeHtml(reward?.title || "Prêmio removido")}</td>
        <td>${escapeHtml(reward?.price ?? "-")} Gold</td>
        <td>${escapeHtml(formatDate(redemption.created_at))}</td>
        <td><span class="redemption-status redemption-status--${escapeHtml(redemption.status || "pending")}">${escapeHtml(status)}</span></td>
      </tr>`;
  }).join("");
}

async function loadRedemptions() {
  refreshRedemptionsButton.disabled = true;
  redemptionsTableBody.innerHTML = '<tr><td colspan="5">Atualizando resgates...</td></tr>';

  try {
    renderRedemptions(await RewardService.getAllRedemptions());
  } catch (error) {
    console.error("Erro ao carregar resgates:", error);
    redemptionsTableBody.innerHTML = '<tr><td colspan="5">Não foi possível carregar os resgates.</td></tr>';
  } finally {
    refreshRedemptionsButton.disabled = false;
  }
}

async function init() {
  try {
    const user = await AuthService.getCurrentAdmin();
    sessionEmail.textContent = user.email || "Sessão administrativa";
    await Promise.all([loadPlayers(), loadRedemptions()]);
  } catch (error) {
    console.warn("Acesso administrativo bloqueado:", error);
    window.location.replace("/admin-login.html");
  }
}

logoutButton?.addEventListener("click", async () => {
  logoutButton.disabled = true;
  await AuthService.logout();
  window.location.replace("/admin-login.html");
});
refreshButton?.addEventListener("click", loadPlayers);
refreshRedemptionsButton?.addEventListener("click", loadRedemptions);
init();
