import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const SUPABASE_URL = "https://fqsicowoeapbclpviqqo.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_XxcmPwuAjDEOpwBPKRXdLQ_zmy8J3Bw";

/**
 * Instância global do cliente Supabase para ser reutilizada na aplicação.
 */
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Testa a conexão com o Supabase.
 * 
 * @author Victor Pedroza <victor.pedroza@protonmail.com>
 * @since 2026-08-05
 * @version 1.0.0
 * 
 **/
async function testConnection() {
  const { data, error } = await supabase
    .from("profiles")
    .select("count", { count: "exact" });
  if (error) {
    console.warn("⚠️ Erro ao conectar ao Supabase:", error.message);
  } else {
    console.log("✅ Supabase conectado com sucesso!");
  }
}

// Testa a conexão com o Supabase ao carregar o módulo
testConnection();