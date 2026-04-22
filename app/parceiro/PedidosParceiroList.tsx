"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

type Pedido = {
  id: string;
  codigo: string;
  data_pedido: string;
  servico: string;
  estado: string;
  origem: string;
  destino: string;
  utente_nome_livre?: string;
  urgente?: boolean;
};

type Pack = {
  horas_contratadas: number;
  horas_usadas: number;
  ativo: boolean;
};

const ESTADO_CONFIG: Record<string, { label: string; bg: string; color: string }> = {
  pendente:   { label: "Pendente",   bg: "#fef9c3", color: "#854d0e" },
  atribuido:  { label: "Atribuído",  bg: "#dcfce7", color: "#15803d" },
  em_curso:   { label: "Em Curso",   bg: "#f3e8ff", color: "#7e22ce" },
  concluido:  { label: "Concluído",  bg: "#EBF2FA", color: "#1B65B2" },
  cancelado:  { label: "Cancelado",  bg: "#fee2e2", color: "#991b1b" },
};

function EstadoBadge({ estado }: { estado: string }) {
  const cfg = ESTADO_CONFIG[estado] ?? { label: estado, bg: "#f3f4f6", color: "#374151" };
  return (
    <span style={{ fontSize: 11, fontWeight: 600, background: cfg.bg, color: cfg.color, padding: "3px 10px", borderRadius: 20 }}>
      {cfg.label}
    </span>
  );
}

export default function PedidosParceiroList() {
  const router = useRouter();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [pack, setPack] = useState<Pack | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setErro(null);
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setErro("Utilizador não autenticado."); setLoading(false); return; }

      // Buscar perfil para obter instituicao_id
      const { data: perfil } = await supabase
        .from("perfis")
        .select("instituicao_id")
        .eq("id", user.id)
        .single();

      // Buscar pack de horas da instituição
      if (perfil?.instituicao_id) {
        const { data: packData } = await supabase
          .from("packs_horas")
          .select("horas_contratadas, horas_usadas, ativo")
          .eq("instituicao_id", perfil.instituicao_id)
          .eq("ativo", true)
          .single();
        if (packData) setPack(packData);
      }

      // Buscar pedidos
      const { data, error } = await supabase
        .from("pedidos")
        .select("id, codigo, data_pedido, servico, estado, origem, destino, utente_nome_livre, urgente")
        .eq("criado_por", user.id)
        .order("data_pedido", { ascending: false });

      if (error) setErro("Erro ao carregar pedidos: " + error.message);
      else setPedidos(data ?? []);
      setLoading(false);
    }
    fetchData();
  }, []);

  const horasRestantes = pack ? pack.horas_contratadas - pack.horas_usadas : 0;
  const percentagem = pack ? Math.min((pack.horas_usadas / pack.horas_contratadas) * 100, 100) : 0;
  const corBarra = percentagem > 80 ? "#dc2626" : percentagem > 60 ? "#d97706" : "#1B65B2";

  return (
    <div className="fade-in">

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: "Fraunces, serif", fontSize: 28, fontWeight: 400, color: "#1B65B2", margin: 0 }}>
            Os meus pedidos
          </h1>
          <p style={{ fontSize: 13, color: "#6b7280", marginTop: 4, marginBottom: 0 }}>
            Gestão dos seus pedidos de transporte
          </p>
        </div>
        <button
          onClick={() => router.push("/parceiro/pedidos/novo")}
          style={{ background: "#1B65B2", color: "white", border: "none", borderRadius: 8, padding: "10px 18px", fontSize: 13, fontWeight: 500, cursor: "pointer", whiteSpace: "nowrap" }}
        >
          + Novo pedido
        </button>
      </div>

      {/* Pack de horas */}
      {pack && (
        <div style={{ background: "white", borderRadius: 12, border: "1px solid rgba(0,0,0,0.06)", padding: "20px 24px", marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: "#374151", margin: 0 }}>Utilização do pack</p>
            <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>
              <span style={{ fontWeight: 600, color: "#1a1a18" }}>{pack.horas_usadas}h</span> / {pack.horas_contratadas}h
              <span style={{ marginLeft: 8, fontSize: 11, fontWeight: 600, background: horasRestantes <= 5 ? "#fee2e2" : "#dcfce7", color: horasRestantes <= 5 ? "#991b1b" : "#15803d", padding: "2px 8px", borderRadius: 20 }}>
                {horasRestantes}h restantes
              </span>
            </p>
          </div>
          <div style={{ background: "#f3f4f6", borderRadius: 99, height: 8, overflow: "hidden" }}>
            <div style={{ width: `${percentagem}%`, height: "100%", background: corBarra, borderRadius: 99, transition: "width 0.5s ease" }} />
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div style={{ display: "flex", justifyContent: "center", padding: "48px 0" }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", border: "3px solid #EBF2FA", borderTopColor: "#1B65B2", animation: "spin 0.8s linear infinite" }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {/* Erro */}
      {!loading && erro && (
        <div style={{ background: "#fee2e2", border: "1px solid #fca5a5", borderRadius: 8, padding: 16, color: "#991b1b", fontSize: 13 }}>{erro}</div>
      )}

      {/* Vazio */}
      {!loading && !erro && pedidos.length === 0 && (
        <div style={{ background: "white", borderRadius: 12, border: "1px solid rgba(0,0,0,0.06)", padding: "48px 24px", textAlign: "center" }}>
          <p style={{ fontSize: 15, fontWeight: 500, color: "#374151", margin: "0 0 8px" }}>Sem pedidos registados</p>
          <p style={{ fontSize: 13, color: "#9ca3af", margin: "0 0 20px" }}>Crie o seu primeiro pedido de transporte.</p>
          <button
            onClick={() => router.push("/parceiro/pedidos/novo")}
            style={{ background: "#1B65B2", color: "white", border: "none", borderRadius: 8, padding: "10px 20px", fontSize: 13, fontWeight: 500, cursor: "pointer" }}
          >
            + Novo pedido
          </button>
        </div>
      )}

      {/* Lista */}
      {!loading && !erro && pedidos.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {pedidos.map((p) => (
            <div key={p.id} style={{ background: "white", borderRadius: 12, border: `1px solid ${p.urgente ? "#fca5a5" : "rgba(0,0,0,0.06)"}`, padding: "18px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>

              {/* Código + badges */}
              <div style={{ minWidth: 100 }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#1B65B2", margin: "0 0 4px" }}>#{p.codigo}</p>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  <EstadoBadge estado={p.estado} />
                  {p.urgente && (
                    <span style={{ fontSize: 11, fontWeight: 600, background: "#fee2e2", color: "#991b1b", padding: "3px 10px", borderRadius: 20 }}>
                      Urgente
                    </span>
                  )}
                </div>
              </div>

              {/* Utente */}
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 10, fontWeight: 500, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 2px" }}>Utente</p>
                <p style={{ fontSize: 13, fontWeight: 600, color: "#1a1a18", margin: 0 }}>{p.utente_nome_livre || "—"}</p>
              </div>

              {/* Serviço */}
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 10, fontWeight: 500, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 2px" }}>Serviço</p>
                <p style={{ fontSize: 13, color: "#374151", margin: 0, textTransform: "capitalize" }}>{p.servico?.replace('_', ' ') || "—"}</p>
              </div>

              {/* Data */}
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 10, fontWeight: 500, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 2px" }}>Data</p>
                <p style={{ fontSize: 13, color: "#374151", margin: 0 }}>
                  {p.data_pedido ? new Date(p.data_pedido).toLocaleDateString("pt-PT") : "—"}
                </p>
              </div>

              {/* Rota */}
              <div style={{ flex: 2 }}>
                <p style={{ fontSize: 10, fontWeight: 500, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 2px" }}>Rota</p>
                <p style={{ fontSize: 13, color: "#374151", margin: 0 }}>{p.origem} → {p.destino}</p>
              </div>

              {/* Botão editar - só para pedidos pendentes */}
              <div style={{ minWidth: 70, display: "flex", justifyContent: "flex-end" }}>
                {p.estado === "pendente" && (
                  <button
                    onClick={() => router.push(`/parceiro/pedidos/${p.id}/editar`)}
                    style={{ fontSize: 12, fontWeight: 500, color: "#1B65B2", background: "#EBF2FA", border: "none", borderRadius: 8, padding: "6px 14px", cursor: "pointer", whiteSpace: "nowrap" }}
                  >
                    Editar
                  </button>
                )}
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}