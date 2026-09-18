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

  // Envia a evidência antes de registrar a conclusão da atividade.
  static async completeActivity(activityId, userId, photo) {
    if (!photo?.type?.startsWith("image/")) {
      throw new Error("Envie uma foto para concluir a atividade.");
    }

    const extension = photo.name.split(".").pop()?.toLowerCase() || "jpg";
    const photoPath = `upload/${userId}/${activityId}-${Date.now()}.${extension}`;
    const { error: uploadError } = await supabase.storage
      .from("images")
      .upload(photoPath, photo, {
        cacheControl: "3600",
        contentType: photo.type,
        upsert: false,
      });

    if (uploadError) throw uploadError;

    const { data, error } = await supabase.rpc("complete_activity", {
      p_activity_id: activityId,
    });

    if (error) {
      await supabase.storage.from("images").remove([photoPath]);
      throw error;
    }

    return data;
  }
}
