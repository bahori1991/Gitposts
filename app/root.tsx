import {
  json,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import styles from "./tailwind.css?url";
import {
  getSupabaseEnv,
  getSupabaseWithSessionAndHeaders,
} from "./lib/supabase.server";
import { useSupabase } from "./lib/supabase";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
  {
    rel: "stylesheet",
    href: styles,
  },
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { user, headers } = await getSupabaseWithSessionAndHeaders({
    request,
  });
  const domainUrl = process.env.DOMAIN_URL!;
  const env = getSupabaseEnv();

  return json({ user, env, domainUrl }, { headers });
};

export default function App() {
  const { env, domainUrl } = useLoaderData<typeof loader>();
  const { supabase } = useSupabase({ env });

  return (
    <html lang="ja">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet context={{ supabase, domainUrl }} />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
