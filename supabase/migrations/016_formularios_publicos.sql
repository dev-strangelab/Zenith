-- Migración: Formularios y Leads Externos

create table leads_preinscripciones (
    id uuid default gen_random_uuid() primary key,
    organizacion_id uuid references organizaciones(id) on delete cascade not null,
    sede_id uuid references sedes(id) on delete cascade,
    datos_json jsonb not null default '{}'::jsonb, -- Almacena todos los campos del form de la familia
    estado lead_estado not null default 'pendiente',
    observaciones_admin text, -- Anotaciones internas del equipo
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table leads_postulaciones (
    id uuid default gen_random_uuid() primary key,
    organizacion_id uuid references organizaciones(id) on delete cascade not null,
    sede_id uuid references sedes(id) on delete cascade,
    datos_json jsonb not null default '{}'::jsonb, -- Almacena los campos del profesional
    cv_url text, -- Link al almacenamiento de su curriculum
    estado lead_estado not null default 'pendiente',
    observaciones_admin text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS
alter table leads_preinscripciones enable row level security;
alter table leads_postulaciones enable row level security;

-- Index
create index idx_leads_pre_organizacion on leads_preinscripciones(organizacion_id);
create index idx_leads_post_organizacion on leads_postulaciones(organizacion_id);

-- Policies (Los accesos para inserción pública se manejan vía Role Anon o Service Role si usamos un form público)
-- Asumiremos que se usa autenticación o service role en el form, por lo que creamos para inserción anon/pública:
create policy "Cualquiera puede insertar un lead de preinscripcion"
on leads_preinscripciones for insert
with check (true);

create policy "Cualquiera puede insertar un lead de postulacion"
on leads_postulaciones for insert
with check (true);

-- Policies Administracion
create policy "Admins pueden gestionar leads_preinscripciones"
on leads_preinscripciones for all
using (
    exists (
        select 1 from memberships
        where memberships.user_id = auth.uid()
        and memberships.organizacion_id = leads_preinscripciones.organizacion_id
        and (memberships.rol = 'director_organizacion' or memberships.rol = 'administrativo' or memberships.rol = 'coordinador')
    )
);

create policy "Admins pueden gestionar leads_postulaciones"
on leads_postulaciones for all
using (
    exists (
        select 1 from memberships
        where memberships.user_id = auth.uid()
        and memberships.organizacion_id = leads_postulaciones.organizacion_id
        and (memberships.rol = 'director_organizacion' or memberships.rol = 'administrativo' or memberships.rol = 'coordinador')
    )
);
