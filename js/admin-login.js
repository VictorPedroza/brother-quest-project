import { AuthService } from "./service/auth.service.js";

const form = document.querySelector("#adminLoginForm");
const emailInput = document.querySelector("#adminEmail");
const passwordInput = document.querySelector("#adminPassword");
const message = document.querySelector("#adminLoginMessage");
const button = document.querySelector("#adminLoginButton");
const ADMIN_DASHBOARD_URL = "/admin.html";

function setMessage(text, isError = true) {
  message.textContent = text;
  message.classList.toggle("is-error", isError && Boolean(text));
  message.classList.toggle("is-success", !isError && Boolean(text));
}

function redirectToAdminDashboard() {
  window.location.replace(ADMIN_DASHBOARD_URL);
}

async function redirectIfAdmin() {
  try {
    await AuthService.getCurrentAdmin();
    redirectToAdminDashboard();
  } catch {
    // A visitor without an admin session stays on the login page.
  }
}

form?.addEventListener("submit", async (event) => {
  event.preventDefault();
  button.disabled = true;
  button.textContent = "Verificando...";
  setMessage("");

  try {
    await AuthService.login(emailInput.value.trim(), passwordInput.value);
    await AuthService.getCurrentAdmin();
    setMessage("Acesso confirmado. Abrindo painel...", false);
    redirectToAdminDashboard();
  } catch (error) {
    await AuthService.logout().catch(() => {});
    const isAccessError = error.message === "Acesso restrito a administradores.";
    setMessage(isAccessError
      ? "Este usuário não possui permissão de administrador."
      : error.message || "Não foi possível validar o acesso. Tente novamente.");
    passwordInput.value = "";
    passwordInput.focus();
    button.disabled = false;
    button.textContent = "Entrar no painel";
  }
});

redirectIfAdmin();
