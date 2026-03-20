-- Tabla de Obras Sociales (Globales por Organización)
create table obras_sociales (
    id uuid primary key default uuid_generate_v4(),
    organizacion_id uuid references organizaciones(id) on delete cascade not null,
    nombre text not null,
    sigla text,
    requiere_autorizacion boolean default true,
    is_active boolean default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- FK de Alumnos a Obras Sociales
alter table alumnos add constraint fk_alumnos_obra_social 
foreign key (obra_social_id) references obras_sociales(id) on delete set null;

-- RLS
alter table obras_sociales enable row level security;

-- Index
create index idx_obras_sociales_organizacion on obras_sociales(organizacion_id);

-- Policies: Se ven obras sociales de mi organización
create policy "Usuarios ven obras sociales de su organizacion"
on obras_sociales for select
using (
    exists (
        select 1 from memberships
        where memberships.organizacion_id = obras_sociales.organizacion_id
        and memberships.user_id = auth.uid()
    )
);
