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

  static async redeemReward(userId, rewardId) {
    const { data: reward, error: rewardError } = await supabase
      .from("rewards")
      .select("id, title, price, stock")
      .eq("id", rewardId)
      .single();

    if (rewardError) throw rewardError;
    if (reward.stock < 1) throw new Error("Este prêmio esgotou.");

    const { error: stockError } = await supabase
      .from("rewards")
      .update({ stock: reward.stock - 1, updated_at: new Date().toISOString() })
      .eq("id", rewardId)
      .eq("stock", reward.stock);

    if (stockError) throw stockError;

    const { data, error } = await supabase
      .from("redemptions")
      .insert({ user_id: userId, reward_id: rewardId })
      .select("id, reward_id, status, created_at")
      .single();

    if (error) {
      await supabase
        .from("rewards")
        .update({ stock: reward.stock, updated_at: new Date().toISOString() })
        .eq("id", rewardId)
        .eq("stock", reward.stock - 1);
      throw error;
    }

    return { redemption: data, reward };
  }
}
