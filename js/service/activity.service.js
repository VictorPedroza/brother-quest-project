import { supabase } from "../supabase/supabaseClient.js";

/** Operações de leitura e conclusão de atividades. */
export class ActivityService {
  /**
   * Busca as atividades disponíveis em ordem de criação.
   * @returns {Promise<Array<Object>>} Atividades cadastradas.
   */
  static async getActivities() {
    const { data, error } = await supabase
      .from("activities")
      .select("id, title, frequency, xp_reward, coins_reward")
      .order("created_at", { ascending: true });

    if (error) throw error;
    return data || [];
  }

  /**
   * Busca as conclusões registradas desde o início da semana atual.
   * @returns {Promise<Array<Object>>} Conclusões do usuário atual.
   */
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

  /**
   * Envia a foto de evidência e registra a conclusão da atividade.
   * @param {string} activityId - Identificador da atividade.
   * @param {string} userId - Identificador do usuário autenticado.
   * @param {File} photo - Foto enviada como evidência.
   * @returns {Promise<Object>} Resultado da conclusão retornado pelo Supabase.
   * @throws {Error} Se a evidência não for uma imagem ou a operação falhar.
   */
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
