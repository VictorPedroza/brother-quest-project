import { AuthService } from "./service/auth.service.js";

const logoutButton = document.querySelector(".logout-button");

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