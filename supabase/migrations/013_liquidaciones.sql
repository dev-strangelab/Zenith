-- Tabla de Prestaciones (Configuración de valores por Obra Social)
create table prestaciones (
    id uuid primary key default uuid_generate_v4(),
    organizacion_id uuid references organizaciones(id) on delete cascade not null,
    obra_social_id uuid references obras_sociales(id) on delete cascade not null,
    codigo text not null, -- ej: "42.01 Módulo Integral"
    descripcion text not null,
    valor_sesion numeric(12, 2) not null default 0,
    is_active boolean default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Tabla de Liquidaciones (Lotes de facturación mensual)
create table liquidaciones (
    id uuid primary key default uuid_generate_v4(),
    sede_id uuid references sedes(id) on delete cascade not null,
    organizacion_id uuid references organizaciones(id) on delete cascade not null,
    obra_social_id uuid references obras_sociales(id) on delete cascade not null,
    periodo text not null, -- formato 'YYYY-MM'
    estado text default 'borrador' check (estado in ('borrador', 'generada', 'presentada', 'aprobada', 'cobrada', 'rechazada')),
    fecha_emision timestamp with time zone,
    fecha_presentacion timestamp with time zone,
    monto_total numeric(12, 2) default 0,
    notas text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS
alter table prestaciones enable row level security;
alter table liquidaciones enable row level security;

-- Indexes
create index idx_prestaciones_organizacion on prestaciones(organizacion_id);
create index idx_prestaciones_obra_social on prestaciones(obra_social_id);
create index idx_liquidaciones_sede on liquidaciones(sede_id);
create index idx_liquidaciones_obra_social on liquidaciones(obra_social_id);
create index idx_liquidaciones_periodo on liquidaciones(periodo);

-- Policies
create policy "Usuarios ven prestaciones de su organizacion"
on prestaciones for select
using (
    exists (
        select 1 from memberships
        where memberships.organizacion_id = prestaciones.organizacion_id
        and memberships.user_id = auth.uid()
    )
);

create policy "Usuarios ven liquidaciones de su sede"
on liquidaciones for select
using (
    exists (
        select 1 from memberships
        where memberships.sede_id = liquidaciones.sede_id
        and memberships.user_id = auth.uid()
    )
);

create policy "Usuarios administran liquidaciones de su sede"
on liquidaciones for insert
with check (
    exists (
        select 1 from memberships
        where memberships.sede_id = liquidaciones.sede_id
        and memberships.user_id = auth.uid()
    )
);

create policy "Usuarios editan liquidaciones de su sede"
on liquidaciones for update
using (
    exists (
        select 1 from memberships
        where memberships.sede_id = liquidaciones.sede_id
        and memberships.user_id = auth.uid()
    )
);
