import { createBrowserClient } from "@supabase/ssr";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "database.types";
import { useState } from "react";

export type TypedSupabaseClient = SupabaseClient<Database>;

export type SupabaseOutletContext = {
  supabase: TypedSupabaseClient;
  domainUrl: string;
};

type SupabaseEnv = {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
};

type UseSupabase = {
  env: SupabaseEnv;
};

export const useSupabase = ({ env }: UseSupabase) => {
  const [supabase] = useState(() =>
    createBrowserClient<Database>(env.SUPABASE_URL!, env.SUPABASE_ANON_KEY)
  );

  return { supabase };
};
