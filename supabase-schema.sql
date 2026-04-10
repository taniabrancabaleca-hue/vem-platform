-- =============================================
-- VEM PLATFORM — Schema Supabase
-- Executar em: Supabase > SQL Editor
-- =============================================

-- EXTENSÕES
create extension if not exists "uuid-ossp";

-- =============================================
-- INSTITUIÇÕES PARCEIRAS
-- =============================================
create table public.instituicoes (
  id          uuid primary key default uuid_generate_v4(),
  nome        text not null,
  tipo        text not null check (tipo in ('hospital','clinica','residencia')),
  morada      text,
  cidade      text,
  nif         text unique,
  email       text unique not null,
  telefone    text,
  estado      text default 'pendente' check (estado in ('pendente','ativa','suspensa')),
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- =============================================
-- UTENTES (doentes / residentes)
-- =============================================
create table public.utentes (
  id              uuid primary key default uuid_generate_v4(),
  instituicao_id  uuid references public.instituicoes(id) on delete cascade,
  nome            text not null,
  data_nascimento date,
  condicao        text,  -- ex: "baixa visão", "mobilidade reduzida"
  notas_clinicas  text,
  ativo           boolean default true,
  created_at      timestamptz default now()
);

-- =============================================
-- GUIAS VEM
-- =============================================
create table public.guias (
  id          uuid primary key default uuid_generate_v4(),
  nome        text not null,
  email       text unique not null,
  telefone    text,
  zona        text,  -- ex: "Lisboa", "Setúbal"
  estado      text default 'disponivel' check (estado in ('disponivel','ocupado','inativo')),
  rating      numeric(3,2) default 5.00,
  total_horas numeric(8,2) default 0,
  created_at  timestamptz default now()
);

-- =============================================
-- PEDIDOS DE ACOMPANHAMENTO
-- =============================================
create table public.pedidos (
  id              uuid primary key default uuid_generate_v4(),
  codigo          text unique not null,  -- ex: VEM-089
  instituicao_id  uuid references public.instituicoes(id),
  utente_id       uuid references public.utentes(id),
  guia_id         uuid references public.guias(id),
  tipo_servico    text not null check (tipo_servico in (
    'consulta_externa','transporte_consulta','passeio',
    'recolha_pos_alta','acompanhamento_exame'
  )),
  origem          text,
  destino         text,
  data_servico    timestamptz not null,
  duracao_horas   numeric(4,2),
  urgente         boolean default false,
  estado          text default 'pendente' check (estado in (
    'pendente','atribuido','guia_a_caminho',
    'em_curso','concluido','cancelado'
  )),
  notas           text,
  feedback_rating integer check (feedback_rating between 1 and 5),
  feedback_texto  text,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

-- Sequência para código VEM-XXX
create sequence if not exists pedido_seq start 1;

-- Função para gerar código automático
create or replace function gerar_codigo_pedido()
returns trigger as $$
begin
  new.codigo := 'VEM-' || lpad(nextval('pedido_seq')::text, 3, '0');
  return new;
end;
$$ language plpgsql;

create trigger set_codigo_pedido
  before insert on public.pedidos
  for each row execute function gerar_codigo_pedido();

-- =============================================
-- BANCO DE HORAS
-- =============================================
create table public.banco_horas (
  id          uuid primary key default uuid_generate_v4(),
  guia_id     uuid references public.guias(id) on delete cascade,
  pedido_id   uuid references public.pedidos(id),
  horas       numeric(4,2) not null,
  mes         integer,
  ano         integer,
  tipo        text default 'servico' check (tipo in ('servico','ajuste','bonus')),
  notas       text,
  created_at  timestamptz default now()
);

-- =============================================
-- NOTAS E AJUSTES (Admin)
-- =============================================
create table public.notas_admin (
  id          uuid primary key default uuid_generate_v4(),
  pedido_id   uuid references public.pedidos(id),
  tipo        text check (tipo in ('nota_aquisicao','correcao_horas','ocorrencia','feedback')),
  descricao   text not null,
  criado_por  text,
  created_at  timestamptz default now()
);

-- =============================================
-- VIEWS úteis para o dashboard
-- =============================================

-- Estatísticas mensais
create or replace view v_stats_mensais as
select
  date_trunc('month', data_servico) as mes,
  count(*)                          as total_pedidos,
  count(*) filter (where estado = 'concluido') as concluidos,
  sum(duracao_horas)                as total_horas,
  round(avg(feedback_rating), 2)   as satisfacao_media
from public.pedidos
group by 1
order by 1;

-- Pedidos por tipo de serviço
create or replace view v_pedidos_por_tipo as
select
  tipo_servico,
  count(*) as total,
  round(count(*) * 100.0 / sum(count(*)) over(), 1) as percentagem
from public.pedidos
where estado = 'concluido'
group by tipo_servico;

-- Top guias
create or replace view v_top_guias as
select
  g.id, g.nome, g.rating, g.zona,
  count(p.id) as total_acompanhamentos,
  sum(p.duracao_horas) as horas_mes
from public.guias g
left join public.pedidos p on p.guia_id = g.id
  and date_trunc('month', p.data_servico) = date_trunc('month', now())
group by g.id, g.nome, g.rating, g.zona
order by total_acompanhamentos desc;

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================
alter table public.instituicoes enable row level security;
alter table public.utentes     enable row level security;
alter table public.pedidos     enable row level security;
alter table public.guias       enable row level security;
alter table public.banco_horas enable row level security;
alter table public.notas_admin enable row level security;

-- Política: acesso total para service_role (admin VEM)
create policy "service_role full access" on public.instituicoes
  for all using (true);
create policy "service_role full access" on public.utentes
  for all using (true);
create policy "service_role full access" on public.pedidos
  for all using (true);
create policy "service_role full access" on public.guias
  for all using (true);
create policy "service_role full access" on public.banco_horas
  for all using (true);
create policy "service_role full access" on public.notas_admin
  for all using (true);

-- =============================================
-- DADOS DE DEMONSTRAÇÃO
-- =============================================
insert into public.instituicoes (nome, tipo, cidade, email, estado) values
  ('Hospital Santa Maria',    'hospital',   'Lisboa',     'contacto@hsm.min-saude.pt',    'ativa'),
  ('Clínica Mediterrâneo',    'clinica',    'Portalegre', 'geral@clinicamediterraneo.pt',  'ativa'),
  ('Lar dos Pinheiros',       'residencia', 'Elvas',      'info@lardospinheiros.pt',       'pendente'),
  ('Hospital Garcia de Orta', 'hospital',   'Almada',     'geral@hgo.min-saude.pt',        'ativa');

insert into public.guias (nome, email, zona, rating, total_horas) values
  ('Ana Lima',       'ana.lima@vem.pt',       'Lisboa',  5.00, 41),
  ('Sofia Martins',  'sofia.martins@vem.pt',  'Lisboa',  4.90, 34),
  ('Rui Fernandes',  'rui.fernandes@vem.pt',  'Setúbal', 4.80, 28),
  ('Pedro Costa',    'pedro.costa@vem.pt',    'Lisboa',  4.70, 22),
  ('Tiago Santos',   'tiago.santos@vem.pt',   'Évora',   4.70, 18);
