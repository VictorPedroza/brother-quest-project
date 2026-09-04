import { supabase } from "../supabase/supabaseClient.js";

/**
 * Serviço responsável lidar com atividades.
 *
 * @author Victor Pedroza <victor.pedroza@protonmail.com>
 * @since 2026-09-04
 * @version 1.0.0
 *
 * @class ActivityService
 * @static
 * @description Este serviço fornece métodos relacionados a atividades.
 *
 */
export class ActivityService {
  // Busca atividades no banco de dados
  static async getActivities() {
    const { data, error } = await supabase
      .from("activities")
      .select("id, title, frequency, xp_reward, coins_reward")
      .order("created_at", { ascending: true });

    if (error) throw error;
    return data || [];
  }

  // Busca atividades completas do usuário
  static async getCurrentCompletions() {
    const now = new Date();
    const daysSinceMonday = (now.getUTCDay() + 6) % 7;
    now.setUTCDate(now.getUTCDate() - daysSinceMonday);
    now.setUTCHours(0, 0, 0, 0);

    const { data, error } = await supabase
      .from("user_activities")
      .select("activity_id, completed_at")
      .gte("completed_at", now.toISOString());

    if (error) throw error;
    return data || [];
  }

  // Função para completar atividade (Chama a Trigger no Banco de Dados)
  static async completeActivity(activityId) {
    const { data, error } = await supabase.rpc("complete_activity", {
      p_activity_id: activityId,
    });

    if (error) throw error;
    return data;
  }
}
