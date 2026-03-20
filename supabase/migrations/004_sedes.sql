-- Tabla de Sedes
create table sedes (
    id uuid primary key default uuid_generate_v4(),
    organizacion_id uuid references organizaciones(id) on delete cascade not null,
    nombre text not null,
    direccion text,
    cuit_prestador text,
    matricula_andis text,
    color_identidad text default '#3b82f6', -- default blue
    configuracion jsonb default '{}'::jsonb,
    is_active boolean default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS
alter table sedes enable row level security;

-- Índices
create index idx_sedes_organizacion on sedes(organizacion_id);
