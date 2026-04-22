"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

type Pedido = {
  id: string;
  data_pedido: string;
  data_transporte: string;
  estado: string;
  origem: string;
  destino: string;
  nome_paciente?: string;
  observacoes?: string;
};

const ESTADO_CONFIG: Record<string, { label: string; bg: string; color: string }> = {
  pendente:   { label: "Pendente",   bg: "#fef9c3", color: "#854d0e" },
  confirmado: { label: "Confirmado", bg: "#EBF2FA", color: "#1B65B2" },
  em_curso:   { label: "Em Curso",   bg: "#f3e8ff", color: "#7e22ce" },
  concluido:  { label: "Concluído",  bg: "#dcfce7", color: "#15803d" },
  cancelado:  { label: "Cancelado",  bg: "#fee2e2", color: "#991b1b" },
};

function EstadoBadge({ estado }: { estado: string }) {
  const cfg = ESTADO_CONFIG[estado] ?? { label: estado, bg: "#f3f4f6", color: "#374151" };
  return (
    <span style={{ fontSize: 12, fontWeight: 600, background: cfg.bg, color: cfg.color, padding: "2px 10px", borderRadius: 20 }}>
      {cfg.label}
    </span>
  );
}

export default function PedidosParceiroList() {
  const router = useRouter();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPedidos() {
      setLoading(true);
      setErro(null);
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setErro("Utilizador não autenticado.");
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from("pedidos")
        .select("id, data_pedido, data_transporte, estado, origem, destino, nome_paciente, observacoes")
        .eq("parceiro_id", user.id)
        .order("data_pedido", { ascending: false });
      if (error) {
        setErro("Erro ao carregar pedidos: " + error.message);
      } else {
        setPedidos(data ?? []);
      }
      setLoading(false);
    }
    fetchPedidos();
  }, []);

  if (loading) return (
    <div style={{ display: "flex", justifyContent: "center", padding: "48px 0" }}>
      <div style={{ width: 32, height: 32, borderRadius: "50%", border: "3px solid #EBF2FA", borderTopColor: "#1B65B2", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (erro) return (
    <div style={{ background: "#fee2e2", border: "1px solid #fca5a5", borderRadius: 8, padding: 16, color: "#991b1b", fontSize: 13 }}>{erro}</div>
  );

  if (pedidos.length === 0) return (
    <div style={{ textAlign: "center", padding: "48px 0", color: "#9ca3af" }}>
      <p style={{ fontSize: 15, fontWeight: 500, margin: "0 0 4px" }}>Sem pedidos registados</p>
      <p style={{ fontSize: 13, margin: 0 }}>Os seus pedidos de transporte aparecerão aqui.</p>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {pedidos.map((p) => (
        <div key={p.id} style={{ background: "white", borderRadius: 12, border: "1px solid rgba(0,0,0,0.06)", padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#1B65B2" }}>#{p.id.slice(0, 8).toUpperCase()}</span>
            <EstadoBadge estado={p.estado} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 24px", marginBottom: 12 }}>
            {p.nome_paciente && (
              <div>
                <p style={{ fontSize: 10, fontWeight: 500, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 2px" }}>Utente</p>
                <p style={{ fontSize: 13, fontWeight: 600, color: "#1a1a18", margin: 0 }}>{p.nome_paciente}</p>
              </div>
            )}
            <div>
              <p style={{ fontSize: 10, fontWeight: 500, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 2px" }}>Data</p>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#1a1a18", margin: 0 }}>{new Date(p.data_transporte).toLocaleDateString("pt-PT")}</p>
            </div>
            <div>
              <p style={{ fontSize: 10, fontWeight: 500, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 2px" }}>Origem</p>
              <p style={{ fontSize: 13, color: "#374151", margin: 0 }}>{p.origem}</p>
            </div>
            <div>
              <p style={{ fontSize: 10, fontWeight: 500, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 2px" }}>Destino</p>
              <p style={{ fontSize: 13, color: "#374151", margin: 0 }}>{p.destino}</p>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              onClick={() => router.push(`/parceiro/pedidos/${p.id}/editar`)}
              style={{ fontSize: 13, fontWeight: 500, color: "#1B65B2", background: "#EBF2FA", border: "none", borderRadius: 8, padding: "6px 14px", cursor: "pointer" }}
            >
              Editar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}