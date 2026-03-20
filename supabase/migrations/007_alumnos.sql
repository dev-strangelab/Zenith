-- Tabla de Alumnos
create table alumnos (
    id uuid primary key default uuid_generate_v4(),
    sede_id uuid references sedes(id) on delete cascade not null,
    organizacion_id uuid references organizaciones(id) on delete cascade not null,
    alumno_origen_id uuid references alumnos(id) on delete set null,
    nombre text not null,
    apellido text not null,
    dni text,
    fecha_nacimiento timestamp with time zone,
    estado alumno_estado default 'activo',
    obra_social_id uuid, -- se agrega FK en la sig. migración
    numero_afiliado text,
    cud_numero text,
    cud_vencimiento timestamp with time zone,
    diagnostico text,
    notas text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS
alter table alumnos enable row level security;

-- Index
create index idx_alumnos_sede on alumnos(sede_id);
create index idx_alumnos_organizacion on alumnos(organizacion_id);
create unique index idx_unique_dni_org on alumnos (dni, organizacion_id);

-- RLS Policy: Se accede a los alumnos de las sedes de las que soy miembro
create policy "Usuarios ven alumnos de su sede"
on alumnos for select
using (
    exists (
        select 1 from memberships
        where memberships.sede_id = alumnos.sede_id
        and memberships.user_id = auth.uid()
    )
);

create policy "Usuarios editan alumnos de su sede"
on alumnos for update
using (
    exists (
        select 1 from memberships
        where memberships.sede_id = alumnos.sede_id
        and memberships.user_id = auth.uid()
    )
);

create policy "Usuarios insertan alumnos en su sede"
on alumnos for insert
with check (
    exists (
        select 1 from memberships
        where memberships.sede_id = alumnos.sede_id
        and memberships.user_id = auth.uid()
    )
);
