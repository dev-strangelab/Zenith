-- Perfiles de usuario vinculados a auth.users
create table profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    organizacion_id uuid references organizaciones(id),
    full_name text,
    avatar_url text,
    phone text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS
alter table profiles enable row level security;

-- Índices
create index idx_profiles_organizacion on profiles(organizacion_id);
