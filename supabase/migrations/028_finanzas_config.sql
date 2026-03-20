-- Migración: Finanzas e Integridad de Obras Sociales
create table if not exists cuentas_bancarias (
    id uuid primary key default uuid_generate_v4(),
    organizacion_id uuid references organizaciones(id) on delete cascade not null,
    sede_id uuid references sedes(id) on delete cascade, -- Null para cuenta central
    banco text not null,
    titular text not null,
    cbu_cvu text not null unique,
    alias text,
    tipo_cuenta text default 'corriente', -- 'corriente', 'ahorro'
    moneda text default 'ARS',
    is_active boolean default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Extender Obras Sociales para liquidaciones
alter table obras_sociales 
add column if not exists cuit text,
add column if not exists direccion_facturacion text,
add column if not exists email_glp text; -- Email para envío masivo de liquidaciones

-- RLS
alter table cuentas_bancarias enable row level security;

-- Index
create index idx_cuentas_bancarias_organizacion on cuentas_bancarias(organizacion_id);

-- Policies
create policy "Usuarios ven cuentas de su organizacion"
on cuentas_bancarias for select
using (
    exists (
        select 1 from memberships
        where memberships.organizacion_id = cuentas_bancarias.organizacion_id
        and memberships.user_id = auth.uid()
    )
);

create policy "Admin y Directores gestionan cuentas"
on cuentas_bancarias for all
using (
    exists (
        select 1 from profiles
        where profiles.id = auth.uid()
        and profiles.id = auth.uid() -- Simplificado para MVP, se refinará con roles
    )
)
with check (true);
