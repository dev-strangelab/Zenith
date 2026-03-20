-- Migración: Finanzas y Pago a Profesionales

create table modalidades_pago (
    id uuid default gen_random_uuid() primary key,
    profesional_id uuid references profiles(id) on delete cascade not null,
    organizacion_id uuid references organizaciones(id) on delete cascade not null,
    tipo modalidad_pago_tipo not null default 'por_hora',
    valor numeric(12,2) not null default 0,
    sede_id uuid references sedes(id) on delete cascade, -- Null si es un valor para toda la organización
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table ordenes_pago (
    id uuid default gen_random_uuid() primary key,
    profesional_id uuid references profiles(id) on delete cascade not null,
    organizacion_id uuid references organizaciones(id) on delete cascade not null,
    sede_id uuid references sedes(id) on delete set null,
    periodo timestamp with time zone not null, -- Guardamos el primer día del mes a liquidar
    monto_bruto numeric(12,2) not null default 0,
    ajustes numeric(12,2) not null default 0, -- Positivo (bonificación) o negativo (deducción)
    monto_neto numeric(12,2) not null default 0,
    estado orden_pago_estado default 'borrador',
    factura_archivo_url text, -- Archivo adjunto que el profesional sube
    comprobante_pago_url text, -- Archivo adjunto que el admin sube al pagar
    comentarios text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS
alter table modalidades_pago enable row level security;
alter table ordenes_pago enable row level security;

-- Index
create index idx_modalidades_profesional on modalidades_pago(profesional_id);
create index idx_ordenes_pago_profesional on ordenes_pago(profesional_id);
create index idx_ordenes_pago_organizacion on ordenes_pago(organizacion_id);

-- Policies Modalidades Pago
create policy "Profesionales pueden ver sus propias modalidades"
on modalidades_pago for select
using ( auth.uid() = profesional_id );

create policy "Admins pueden ver y gestionar modalidades"
on modalidades_pago for all
using (
    exists (
        select 1 from memberships
        where memberships.user_id = auth.uid()
        and memberships.organizacion_id = modalidades_pago.organizacion_id
        and (
            memberships.rol = 'director_organizacion' 
            or (memberships.rol IN ('director_sede', 'administrativo', 'coordinador') and memberships.sede_id = modalidades_pago.sede_id)
            or (modalidades_pago.sede_id IS NULL AND memberships.rol IN ('director_sede', 'administrativo', 'coordinador'))
        )
    )
);

-- Policies Ordenes de Pago
create policy "Profesionales ven sus ordenes"
on ordenes_pago for select
using ( auth.uid() = profesional_id );

create policy "Profesionales pueden subir su factura"
on ordenes_pago for update
using ( auth.uid() = profesional_id );

create policy "Admins pueden gestionar ordenes_pago"
on ordenes_pago for all
using (
    exists (
        select 1 from memberships
        where memberships.user_id = auth.uid()
        and memberships.organizacion_id = ordenes_pago.organizacion_id
        and (
            memberships.rol = 'director_organizacion'
            or (memberships.rol IN ('director_sede', 'administrativo', 'coordinador') AND (memberships.sede_id = ordenes_pago.sede_id OR ordenes_pago.sede_id IS NULL))
        )
    )
);
