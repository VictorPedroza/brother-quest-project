import "./services/profile.service.js";
import "./ui/dashboard.ui.js";

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const profileId = params.get("perfil");
  const profile = ProfileService.getProfileById(profileId);

  if (!profile) {
    window.location.href = "../index.html";
    return;
  }

  DashboardUI.render(profile);

  DashboardUI.onLogout(() => {
    window.location.href = "../index.html";
  });
});
