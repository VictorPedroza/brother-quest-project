import { supabase } from '../supabase/supabaseClient.js';

/**
 * Serviço responsável pela autenticação dos usuários
 * 
 * @author Victor Pedroza <victor.pedroza@protonmail.com>
 * @since 2026-08-10
 * @version 1.0.0 
 * 
 * @class AuthService
 * @static
 **/
export class AuthService {

  /**
   * Realiza o login de um usuário
   * 
   * @param {string} email - O email do usuário
   * @param {string} password - A senha do usuário
   * @returns {Promise<Object>} Os dados do usuário e sessão autenticada
   */
  static async login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ 
      email, 
      password 
    });

    if (error) {
      throw error;
    }

    return data;
  }

  /**
   * Encerra a sessão do usuário atual.
   *
   * @returns {Promise<void>}
   */
  static async logout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw error;
    }
  }
}