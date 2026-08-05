import { supabase } from '../supabase/supabaseClient.js';

/**
 * Serviço responsável por buscar dados públicos dos perfis.
 * 
 * @author Victor Pedroza <victor.pedroza@protonmail.com>
 * @since 2026-08-04
 * @version 1.0.0
 * 
 * @class ProfileService
 * @static
 * @description Este serviço fornece métodos para buscar perfis públicos de jogadores.
 * 
 */
export class ProfileService {
  /**
   * Busca os perfis do tipo 'player' chamando a RPC pública (não exige login).
   * @returns {Promise<Array<Object>>} Lista de perfis formatados para a UI
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