import { supabase } from '../supabase/supabaseClient.js';

/** Operações de consulta a perfis de jogadores. */
export class ProfileService {
  /**
   * Busca os dados do perfil associado ao usuário.
   * @param {string} userId - Identificador do usuário autenticado.
   * @returns {Promise<Object>} Dados do perfil.
   */
  static async getCurrentProfile(userId) {
    const { data, error } = await supabase
      .from('profiles')
      .select('name, xp, streak_count, coins')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Busca e formata os perfis públicos de jogadores.
   * @returns {Promise<Array<Object>>} Perfis prontos para a interface.
   */
  static async getPlayerProfiles() {
    try {
      // Chama a função RPC que criamos no Supabase
      const { data, error } = await supabase.rpc('get_public_players');

      if (error) {
        console.error('Erro na RPC get_public_players:', error.message);
        throw error;
      }

      // Mapeia os dados calculando o nível dinamicamente
      return (data || []).map(profile => ({
        id: profile.id,
        name: profile.name,
        email: profile.email,
        level: Math.floor((profile.xp || 0) / 100) + 1,
        streak: profile.streak_count || 0,
        xp: profile.xp || 0,
        coins: profile.coins || 0,
        color: 'blue' 
      }));
    } catch (err) {
      console.error('Falha ao buscar jogadores públicos:', err);
      throw err;
    }
  }
}