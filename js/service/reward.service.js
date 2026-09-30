import { supabase } from "../supabase/supabaseClient.js";

export class RewardService {
  /**
   * Busca os prêmios disponíveis em ordem crescente de preço.
   * @returns {Promise<Array<Object>>} Prêmios cadastrados.
   */
  static async getRewards() {
    const { data, error } = await supabase
      .from("rewards")
      .select("id, title, price, stock")
      .order("price", { ascending: true });

    if (error) throw error;
    return data || [];
  }

  /**
   * Busca os resgates do usuário em ordem cronológica decrescente.
   * @param {string} userId - Identificador do usuário.
   * @returns {Promise<Array<Object>>} Resgates do usuário.
   */
  static async getCurrentRedemptions(userId) {
    const { data, error } = await supabase
      .from("redemptions")
      .select("id, reward_id, status, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  /**
   * Busca todos os resgates com dados relacionados de perfil e prêmio.
   * @returns {Promise<Array<Object>>} Resgates registrados.
   */
  static async getAllRedemptions() {
    const { data, error } = await supabase
      .from("redemptions")
      .select("id, user_id, reward_id, status, created_at, profiles(name), rewards(title, price)")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  /**
   * Confirma um resgate pendente.
   * @param {string} redemptionId - Identificador do resgate.
   * @returns {Promise<Object>} Resultado da confirmação.
   */
  static async confirmRedemption(redemptionId) {
    const { data, error } = await supabase.rpc("confirm_redemption", {
      p_redemption_id: redemptionId,
    });

    if (error) throw error;
    return data;
  }

  /**
   * Solicita o resgate de um prêmio pelo usuário.
   * @param {string} userId - Identificador do usuário.
   * @param {string} rewardId - Identificador do prêmio.
   * @returns {Promise<Object>} Prêmio, resultado e registro do resgate.
   * @throws {Error} Se o prêmio não existir ou o resgate falhar.
   */
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
