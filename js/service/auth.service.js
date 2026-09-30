import { supabase } from '../supabase/supabaseClient.js';

/** Operações de autenticação e autorização de usuários. */
export class AuthService {
  /**
    * Autentica um usuário com e-mail e senha.
    * @param {string} email - E-mail da conta.
    * @param {string} password - Senha da conta.
    * @returns {Promise<Object>} Dados do usuário e da sessão.
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
   * Retorna o usuário da sessão atual.
   * @returns {Promise<Object>} Usuário autenticado.
   * @throws {Error} Se não houver uma sessão válida.
   */
  static async getCurrentUser() {
    const { data, error } = await supabase.auth.getUser();

    if (error) throw error;
    if (!data.user) throw new Error("Sessão expirada");

    return data.user;
  }

  /**
   * Verifica se os metadados do usuário declaram o papel de administrador.
   * @param {Object} user - Usuário autenticado.
   * @returns {boolean} `true` quando o papel é de administrador.
   */
  static isAdmin(user) {
    return user?.app_metadata?.role === "admin" || user?.user_metadata?.role === "admin";
  }

  /**
   * Retorna o usuário atual somente se tiver permissão administrativa.
   * @returns {Promise<Object>} Usuário administrador autenticado.
   * @throws {Error} Se o usuário não tiver permissão administrativa.
   */
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