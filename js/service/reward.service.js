import { supabase } from "../supabase/supabaseClient.js";

export class RewardService {
  static async getRewards() {
    const { data, error } = await supabase
      .from("rewards")
      .select("id, title, price, stock")
      .order("price", { ascending: true });

    if (error) throw error;
    return data || [];
  }

  static async getCurrentRedemptions(userId) {
    const { data, error } = await supabase
      .from("redemptions")
      .select("id, reward_id, status, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async getAllRedemptions() {
    const { data, error } = await supabase
      .from("redemptions")
      .select("id, user_id, reward_id, status, created_at, profiles(name), rewards(title, price)")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async confirmRedemption(redemptionId) {
    const { data, error } = await supabase.rpc("confirm_redemption", {
      p_redemption_id: redemptionId,
    });

    if (error) throw error;
    return data;
  }

  static async redeemReward(userId, rewardId) {
    const reward = (await this.getRewards()).find((item) => item.id === rewardId);
    if (!reward) throw new Error("Recompensa não encontrada.");

    const { data, error } = await supabase.rpc("redeem_reward", {
      p_reward_id: rewardId,
    });

    if (error) throw error;

    return {
      reward,
      result: data,
      redemption: {
        id: data.redemption_id,
        reward_id: rewardId,
        status: "pending",
      },
    };
  }
}
