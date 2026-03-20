-- Tabla que vincula Usuarios con Sedes (Many-to-Many)
create table memberships (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users(id) on delete cascade not null,
    sede_id uuid references sedes(id) on delete cascade not null,
    organizacion_id uuid references organizaciones(id) on delete cascade not null,
    rol app_role not null default 'profesional',
    configuracion_personal jsonb default '{}'::jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    
    -- Un usuario solo puede tener un rol por sede
    unique(user_id, sede_id)
);

-- RLS
alter table memberships enable row level security;

-- Índices
create index idx_memberships_user on memberships(user_id);
create index idx_memberships_sede on memberships(sede_id);
create index idx_memberships_organizacion on memberships(organizacion_id);
