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

  static async getCurrentUser() {
    const { data, error } = await supabase.auth.getUser();

    if (error) throw error;
    if (!data.user) throw new Error("Sessão expirada");

    return data.user;
  }

  static isAdmin(user) {
    return user?.app_metadata?.role === "admin" || user?.user_metadata?.role === "admin";
  }

  static async getCurrentAdmin() {
    const user = await this.getCurrentUser();

    if (this.isAdmin(user)) {
      return user;
    }

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (error) {
      throw error;
    }

    if (profile?.role !== "admin") {
      throw new Error("Acesso restrito a administradores.");
    }

    return user;
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