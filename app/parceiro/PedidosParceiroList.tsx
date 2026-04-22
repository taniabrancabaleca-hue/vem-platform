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
      <div style