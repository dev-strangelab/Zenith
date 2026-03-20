-- Tabla de Turnos (Agenda)
create table turnos (
    id uuid primary key default uuid_generate_v4(),
    sede_id uuid references sedes(id) on delete cascade not null,
    organizacion_id uuid references organizaciones(id) on delete cascade not null,
    alumno_id uuid references alumnos(id) on delete cascade not null,
    profesional_id uuid references profiles(id) on delete set null,
    fecha timestamp with time zone not null,
    hora_inicio time not null,
    hora_fin time not null,
    estado asistencia_estado default 'programado',
    notas text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS
alter table turnos enable row level security;

-- Index
create index idx_turnos_sede on turnos(sede_id);
create index idx_turnos_profesional on turnos(profesional_id);
create index idx_turnos_alumno on turnos(alumno_id);
create index idx_turnos_fecha on turnos(fecha);

-- RLS Policy: Se accede a los turnos de las sedes de las que soy miembro
create policy "Usuarios ven turnos de su sede"
on turnos for select
using (
    exists (
        select 1 from memberships
        where memberships.sede_id = turnos.sede_id
        and memberships.user_id = auth.uid()
    )
);

create policy "Usuarios editan turnos de su sede"
on turnos for update
using (
    exists (
        select 1 from memberships
        where memberships.sede_id = turnos.sede_id
        and memberships.user_id = auth.uid()
    )
);

create policy "Usuarios insertan turnos en su sede"
on turnos for insert
with check (
    exists (
        select 1 from memberships
        where memberships.sede_id = turnos.sede_id
        and memberships.user_id = auth.uid()
    )
);
