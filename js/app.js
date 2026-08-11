import { ProfileService } from "./service/profile.service.js";
import { AuthService } from "./service/auth.service.js";
import { ProfileUI } from "./ui/profile.ui.js";

const ui = new ProfileUI("cardsContainer");

// Elementos do Overlay de Boas-Vindas
const welcomeOverlay = document.getElementById("welcomeOverlay");
const overlayGreeting = document.getElementById("overlayGreeting");
const overlayAvatar = document.getElementById("overlayAvatar");
const overlayCloseBtn = document.getElementById("overlayClose");

function showWelcomeOverlay(player) {
  if (!welcomeOverlay) return;

  if (overlayGreeting) {
    overlayGreeting.textContent = `Bem-vindo de volta, ${player.name}!`;
  }

  if (overlayAvatar) {
    overlayAvatar.textContent = ui.getInitials(player.name);
  }

  welcomeOverlay.classList.add("active");
  welcomeOverlay.style.display = "flex";
}

function hideWelcomeOverlay() {
  if (!welcomeOverlay) return;
  welcomeOverlay.classList.remove("active");
  welcomeOverlay.style.display = "none";
}

/**
 * Handler do Login executado quando o usuário digita a senha na UI
 */
async function handleLogin(player, password) {
  if (!player || !player.email) {
    alert("Perfil inválido ou sem e-mail atrelado.");
    return;
  }

  if (ui.submitButton) {
    ui.submitButton.disabled = true;
    ui.submitButton.textContent = "Autenticando...";
  }

  try {
    // 1. Chama a autenticação via AuthService
    await AuthService.login(player.email, password);

    // 2. Mostra o modal animado de entrada
    showWelcomeOverlay(player);

    // 3. Redireciona para a Dashboard após a transição
    setTimeout(() => {
      window.location.href = "/dashboard.html";
    }, 2500);
  } catch (err) {
    console.error("Erro ao realizar login:", err.message);
    alert("Senha incorreta! Tente novamente.");

    if (ui.passwordInput) {
      ui.passwordInput.value = "";
      ui.passwordInput.focus();
    }

    // Reabilita o botão apenas em caso de erro para o usuário tentar novamente
    if (ui.submitButton) {
      ui.submitButton.disabled = false;
      ui.submitButton.textContent = `Entrar como ${player.name} →`;
    }
  }
}
async function init() {
  ui.showLoading();

  try {
    // 1. Busca os perfis públicos via ProfileService
    const players = await ProfileService.getPlayerProfiles();

    // 2. Renderiza na tela e registra o callback
    ui.renderProfiles(players, {
      onSelectProfile: (player, password) => {
        handleLogin(player, password);
      },
    });
  } catch (err) {
    ui.showError("Não foi possível carregar a lista de jogadores.");
  }

  overlayCloseBtn?.addEventListener("click", hideWelcomeOverlay);
}

document.addEventListener("DOMContentLoaded", init);
