import { ActivityService } from "./service/activity.service.js";
import { AuthService } from "./service/auth.service.js";
import { ProfileService } from "./service/profile.service.js";
import { DashboardUI } from "./ui/dashboard.ui.js";

const ui = new DashboardUI();
let activities = [];
let completedActivityIds = new Set();
let profile = null;

async function loadDashboard() {
  try {
    const user = await AuthService.getCurrentUser();
    const [loadedProfile, loadedActivities, completions] = await Promise.all([
      ProfileService.getCurrentProfile(user.id),
      ActivityService.getActivities(),
      ActivityService.getCurrentCompletions(),
    ]);

    profile = loadedProfile;
    activities = loadedActivities;
    completedActivityIds = new Set(
      completions
        .filter((completion) => {
          const activity = activities.find((item) => item.id === completion.activity_id);
          return activity && (
            activity.frequency === "weekly" ||
            completion.completed_at.slice(0, 10) === new Date().toISOString().slice(0, 10)
          );
        })
        .map((completion) => completion.activity_id),
    );

    ui.updateProfile(profile);
    ui.renderActivities(activities, completedActivityIds);
  } catch (error) {
    console.error("Erro ao carregar dashboard:", error);
    ui.showActivityError("Não foi possível carregar as atividades.");
  }
}

async function completeActivity(activityId, button) {
  ui.setActivityLoading(button, true);

  try {
    const result = await ActivityService.completeActivity(activityId);
    completedActivityIds.add(activityId);
    profile = { ...profile, xp: result.xp_total, streak_count: result.streak_count };
    ui.updateProfile(profile);
    ui.renderActivities(activities, completedActivityIds);
  } catch (error) {
    console.error("Erro ao concluir atividade:", error);
    ui.setActivityLoading(button, false);
    alert(error.message || "Não foi possível concluir a atividade.");
  }
}

async function logout() {
  ui.setLogoutLoading(true);

  try {
    await AuthService.logout();
    window.location.href = "/index.html";
  } catch (error) {
    console.error("Erro ao realizar logout:", error);
    ui.setLogoutLoading(false);
    alert("Não foi possível sair. Tente novamente.");
  }
}

ui.onCompleteActivity(completeActivity);
ui.onLogout(logout);
loadDashboard();