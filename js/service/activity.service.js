import { supabase } from "../supabase/supabaseClient.js";

export class ActivityService {
  static async getActivities() {
    const { data, error } = await supabase
      .from("activities")
      .select("id, title, frequency, xp_reward, coins_reward")
      .order("created_at", { ascending: true });

    if (error) throw error;
    return data || [];
  }

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

  static async completeActivity(activityId) {
    const { data, error } = await supabase.rpc("complete_activity", {
      p_activity_id: activityId,
    });

    if (error) throw error;
    return data;
  }
}
