export type TipoServico =
  | 'consulta_externa'
  | 'transporte_consulta'
  | 'passeio'
  | 'recolha_pos_alta'
  | 'acompanhamento_exame'

export type EstadoPedido =
  | 'pendente'
  | 'atribuido'
  | 'guia_a_caminho'
  | 'em_curso'
  | 'concluido'
  | 'cancelado'

export type TipoInstituicao = 'hospital' | 'clinica' | 'residencia'
export type EstadoInstituicao = 'pendente' | 'ativa' | 'suspensa'
export type EstadoGuia = 'disponivel' | 'ocupado' | 'inativo'

export interface Instituicao {
  id: string
  nome: string
  tipo: TipoInstituicao
  morada?: string
  cidade?: string
  nif?: string
  email: string
  telefone?: string
  estado: EstadoInstituicao
  created_at: string
}

export interface Utente {
  id: string
  instituicao_id: string
  nome: string
  data_nascimento?: string
  condicao?: string
  notas_clinicas?: string
  ativo: boolean
  created_at: string
}

export interface Guia {
  id: string
  nome: string
  email: string
  telefone?: string
  zona?: string
  estado: EstadoGuia
  rating: number
  total_horas: number
  created_at: string
}

export interface Pedido {
  id: string
  codigo: string
  instituicao_id: string
  utente_id: string
  guia_id?: string
  tipo_servico: TipoServico
  origem?: string
  destino?: string
  data_servico: string
  duracao_horas?: number
  urgente: boolean
  estado: EstadoPedido
  notas?: string
  feedback_rating?: number
  feedback_texto?: string
  created_at: string
  updated_at: string
  // joins
  instituicao?: Instituicao
  utente?: Utente
  guia?: Guia
}

export interface StatsMensais {
  mes: string
  total_pedidos: number
  concluidos: number
  total_horas: number
  satisfacao_media: number
}

export interface StatsGeral {
  totalMes: number
  horasMes: number
  satisfacaoMedia: number
  guiasAtivos: number
  instituicoesAtivas: number
  crescimento: number
}

// Supabase Database type (simplificado)
export type Database = {
  public: {
    Tables: {
      instituicoes: { Row: Instituicao; Insert: Omit<Instituicao, 'id' | 'created_at'>; Update: Partial<Instituicao> }
      utentes:      { Row: Utente;      Insert: Omit<Utente, 'id' | 'created_at'>;      Update: Partial<Utente> }
      guias:        { Row: Guia;        Insert: Omit<Guia, 'id' | 'created_at'>;        Update: Partial<Guia> }
      pedidos:      { Row: Pedido;      Insert: Omit<Pedido, 'id' | 'codigo' | 'created_at' | 'updated_at'>; Update: Partial<Pedido> }
    }
    Views: {
      v_stats_mensais:   { Row: StatsMensais }
      v_pedidos_por_tipo:{ Row: { tipo_servico: TipoServico; total: number; percentagem: number } }
      v_top_guias:       { Row: Guia & { total_acompanhamentos: number; horas_mes: number } }
    }
  }
}
