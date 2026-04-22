import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import PedidosParceiroList from "./PedidosParceiroList";

export const dynamic = "force-dynamic";

export default async function ParceiroPage() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  return <PedidosParceiroList />;
}
