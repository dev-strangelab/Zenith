-- Migración: Plantillas de Evolución (Snippets)
create table if not exists plantillas_evolucion (
    id uuid primary key default uuid_generate_v4(),
    organizacion_id uuid references organizaciones(id) on delete cascade not null,
    profesional_id uuid references profiles(id) on delete set null, -- Null para plantillas compartidas
    sede_id uuid references sedes(id) on delete cascade, -- Null para plantillas generales de la organización
    titulo text not null,
    contenido text not null,
    categoria text default 'general',
    is_shared boolean default false,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS
alter table plantillas_evolucion enable row level security;

-- Index
create index idx_plantillas_evolucion_organizacion on plantillas_evolucion(organizacion_id);
create index idx_plantillas_evolucion_profesional on plantillas_evolucion(profesional_id);

-- Policies
create policy "Usuarios ven sus plantillas o compartidas de la org"
on plantillas_evolucion for select
using (
    (profesional_id = auth.uid()) OR 
    (is_shared = true AND organizacion_id IN (
        select organizacion_id from memberships where user_id = auth.uid()
    ))
);

create policy "Usuarios administran sus plantillas"
on plantillas_evolucion for all
using (
    profesional_id = auth.uid() 
    or exists (
        select 1 from memberships
        where memberships.user_id = auth.uid()
        and memberships.organizacion_id = plantillas_evolucion.organizacion_id
        and (
            memberships.rol = 'director_organizacion'
            or (memberships.rol IN ('director_sede', 'coordinador') and memberships.sede_id = plantillas_evolucion.sede_id)
        )
    )
);
