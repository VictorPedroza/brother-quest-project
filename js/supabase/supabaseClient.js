import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const SUPABASE_URL = "https://fqsicowoeapbclpviqqo.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_XxcmPwuAjDEOpwBPKRXdLQ_zmy8J3Bw";

/**
 * Instância global do cliente Supabase para ser reutilizada na aplicação.
 */
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
