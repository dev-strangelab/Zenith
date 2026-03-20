-- Tabla de Organizaciones (Nivel Raíz)
create table organizaciones (
    id uuid primary key default uuid_generate_v4(),
    nombre text not null,
    cuit text unique,
    email_contacto text,
    configuracion_global jsonb default '{}'::jsonb,
    plan_tipo text default 'basico',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS
alter table organizaciones enable row level security;
