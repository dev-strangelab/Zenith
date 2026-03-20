-- Tabla de Evoluciones (Historia Clínica)
create table evoluciones (
    id uuid primary key default uuid_generate_v4(),
    sede_id uuid references sedes(id) on delete cascade not null,
    organizacion_id uuid references organizaciones(id) on delete cascade not null,
    alumno_id uuid references alumnos(id) on delete cascade not null,
    profesional_id uuid references profiles(id) on delete set null,
    turno_id uuid references turnos(id) on delete set null,
    fecha timestamp with time zone not null,
    contenido text not null,
    objetivos_trabajados text[],
    firma_profesional text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS
alter table evoluciones enable row level security;

-- Index
create index idx_evoluciones_sede on evoluciones(sede_id);
create index idx_evoluciones_alumno on evoluciones(alumno_id);
create index idx_evoluciones_profesional on evoluciones(profesional_id);

-- Policies
create policy "Usuarios ven evoluciones de su sede"
on evoluciones for select
using (
    exists (
        select 1 from memberships
        where memberships.sede_id = evoluciones.sede_id
        and memberships.user_id = auth.uid()
    )
);

create policy "Profesionales pueden crear evoluciones en su sede"
on evoluciones for insert
with check (
    exists (
        select 1 from memberships
        where memberships.sede_id = evoluciones.sede_id
        and memberships.user_id = auth.uid()
    )
);
