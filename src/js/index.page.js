import "./services/profile.service.js";
import "./ui/profile-select.ui.js";

document.addEventListener("DOMContentLoaded", () => {
  const profiles = ProfileService.getProfiles();

  ProfileSelectUI.render(profiles, (profileId) => {
    window.location.href = `pages/dashboard.html?perfil=${profileId}`;
  });
});