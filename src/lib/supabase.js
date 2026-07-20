import { createClient } from "@supabase/supabase-js";

// .env 파일의 VITE_ 환경변수를 읽어와 Supabase 클라이언트를 만듭니다.
// 여기서 쓰는 키는 브라우저에 노출돼도 되는 anon(publishable) key여야 하며,
// service_role key는 절대 이 파일이나 .env에 넣지 않습니다.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    ".env 파일에 VITE_SUPABASE_URL과 VITE_SUPABASE_ANON_KEY를 설정해주세요."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
