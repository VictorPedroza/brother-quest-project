import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const SUPABASE_URL = "https://fqsicowoeapbclpviqqo.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_XxcmPwuAjDEOpwBPKRXdLQ_zmy8J3Bw";

/** Cliente Supabase compartilhado pelos módulos da aplicação. */
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Testa a conexão com o Supabase.
 * @returns {Promise<void>}
 */
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