import { AuthService } from "./service/auth.service.js";
import { ProfileService } from "./service/profile.service.js";

const tableBody = document.querySelector("#playersTableBody");
const playersCount = document.querySelector("#playersCount");
const averageXp = document.querySelector("#averageXp");
const highestLevel = document.querySelector("#highestLevel");
const sessionEmail = document.querySelector("#adminSessionEmail");
const logoutButton = document.querySelector("#adminLogoutButton");
const refreshButton = document.querySelector("#refreshPlayers");

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

async function init() {
  try {
    const user = await AuthService.getCurrentAdmin();
    sessionEmail.textContent = user.email || "Sessão administrativa";
    await loadPlayers();
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
init();
