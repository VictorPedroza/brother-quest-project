import { AuthService } from "./service/auth.service.js";
import { ProfileService } from "./service/profile.service.js";
import { RewardService } from "./service/reward.service.js";
import { RewardsUI } from "./ui/rewards.ui.js";

const ui = new RewardsUI();
let user;
let profile;
let rewards = [];
let redemptions = [];

async function loadRewardsPage() {
  try {
    user = await AuthService.getCurrentUser();
    document.body.classList.remove("rewards-page--auth-checking");
  } catch (error) {
    console.warn("Acesso aos prêmios bloqueado: sessão não autenticada.", error);
    window.location.replace("/index.html");
    return;
  }

  try {
    [profile, rewards, redemptions] = await Promise.all([
      ProfileService.getCurrentProfile(user.id),
      RewardService.getRewards(),
      RewardService.getCurrentRedemptions(user.id),
    ]);
    ui.updateProfile(profile);
    ui.renderRewards(rewards, profile.coins);
    ui.renderRedemptions(redemptions, new Map(rewards.map((reward) => [reward.id, reward.title])));
  } catch (error) {
    console.error("Erro ao carregar prêmios:", error);
    ui.showMessage("Não foi possível carregar os prêmios. Tente novamente.", true);
  }
}

async function redeemReward(rewardId, button) {
  const reward = rewards.find((item) => item.id === rewardId);
  if (!reward) return;

  ui.setRedeemLoading(button, true);
  try {
    await RewardService.redeemReward(user.id, rewardId);
    profile = { ...profile, coins: Number(profile.coins) - reward.price };
    redemptions = await RewardService.getCurrentRedemptions(user.id);
    const updatedRewards = await RewardService.getRewards();
    rewards = updatedRewards;
    ui.updateProfile(profile);
    ui.renderRewards(rewards, profile.coins);
    ui.renderRedemptions(redemptions, new Map(rewards.map((item) => [item.id, item.title])));
    ui.showMessage("Prêmio resgatado! Seu pedido está pendente de aprovação.");
  } catch (error) {
    console.error("Erro ao resgatar prêmio:", error);
    ui.setRedeemLoading(button, false);
    ui.showMessage(error.message || "Não foi possível resgatar este prêmio.", true);
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
  }
}

ui.onRedeem(redeemReward);
ui.onLogout(logout);
loadRewardsPage();
