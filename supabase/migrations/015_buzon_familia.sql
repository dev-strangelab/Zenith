-- Migración: Buzón Familia

create table buzon_mensajes (
    id uuid default gen_random_uuid() primary key,
    organizacion_id uuid references organizaciones(id) on delete cascade not null,
    sede_id uuid references sedes(id) on delete cascade not null,
    alumno_id uuid references alumnos(id) on delete cascade not null,
    remitente_tipo buzon_remitente_tipo not null,
    remitente_id uuid not null, -- ID del usuario/padre/profesional que envía el mensaje
    asunto text not null,
    mensaje text not null,
    leido_por_admin boolean default false,
    leido_por_familia boolean default false,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table buzon_adjuntos (
    id uuid default gen_random_uuid() primary key,
    mensaje_id uuid references buzon_mensajes(id) on delete cascade not null,
    file_url text not null,
    file_name text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS
alter table buzon_mensajes enable row level security;
alter table buzon_adjuntos enable row level security;

-- Index
create index idx_buzon_mensajes_alumno on buzon_mensajes(alumno_id);
create index idx_buzon_mensajes_organizacion on buzon_mensajes(organizacion_id);

-- Policies (Simplificadas para Admins y Familiares/Profesionales vinculados al alumno)
create policy "Admins pueden ver todos los mensajes de su organizacion"
on buzon_mensajes for all
using (
    exists (
        select 1 from memberships
        where memberships.user_id = auth.uid()
        and memberships.organizacion_id = buzon_mensajes.organizacion_id
        and (memberships.rol = 'director_organizacion' or memberships.rol = 'administrativo' or memberships.rol = 'coordinador')
    )
);

create policy "Admins pueden ver todos los adjuntos de su organizacion"
on buzon_adjuntos for all
using (
    exists (
        select 1 from buzon_mensajes
        join memberships on memberships.organizacion_id = buzon_mensajes.organizacion_id
        where buzon_mensajes.id = buzon_adjuntos.mensaje_id
        and memberships.user_id = auth.uid()
        and (memberships.rol = 'director_organizacion' or memberships.rol = 'administrativo' or memberships.rol = 'coordinador')
    )
);

-- Nota: faltarían las políticas específicas para familiares una vez que modelemos los accesos de "Padres/Tutores".
