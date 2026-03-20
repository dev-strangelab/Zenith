-- CERTIFICACIÓN DE CALIDAD SQL - ÓRBITA 2
-- Proyecto: Iter-softco CRM
-- Estado: Listo para Supabase
-- Versión: 1.0 (Consolidado)

-- ==========================================
-- 0. EXTENSIONES Y ENUMS
-- ==========================================
create extension if not exists "uuid-ossp";

create type app_role as enum ('director_organizacion', 'director_sede', 'coordinador', 'profesional', 'administrativo', 'familiar');
create type alumno_estado as enum ('activo', 'pausado', 'finalizado', 'lista_espera');
create type asistencia_estado as enum ('programado', 'presente', 'ausente_con_aviso', 'ausente_sin_aviso', 'cancelado');
create type modalidad_pago_tipo as enum ('por_hora', 'mensual', 'por_sesion');
create type orden_pago_estado as enum ('borrador', 'pendiente_facturacion', 'pago_pendiente', 'liquidado');
create type buzon_remitente_tipo as enum ('familia', 'equipo_clinico', 'administracion');
create type lead_estado as enum ('pendiente', 'en_revision', 'contactado', 'aceptado', 'rechazado');

-- ==========================================
-- 1. ESTRUCTURA CORE (ORGANIZACIÓN / SEDES)
-- ==========================================
create table organizaciones (
    id uuid primary key default uuid_generate_v4(),
    nombre text not null,
    cuit text unique,
    email_contacto text,
    logo_url text,
    telefono text,
    direccion_legal text,
    configuracion_global jsonb default '{}'::jsonb,
    plan_tipo text default 'basico',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table sedes (
    id uuid primary key default uuid_generate_v4(),
    organizacion_id uuid references organizaciones(id) on delete cascade not null,
    nombre text not null,
    direccion text,
    ciudad text,
    telefono text,
    email_contacto text,
    cuit_prestador text,
    matricula_andis text,
    color_identidad text default '#3b82f6',
    configuracion jsonb default '{}'::jsonb,
    is_active boolean default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index idx_sedes_organizacion on sedes(organizacion_id);

-- ==========================================
-- 2. USUARIOS Y ROLES (PROFILES / MEMBERSHIPS)
-- ==========================================
create table profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    organizacion_id uuid references organizaciones(id),
    full_name text,
    nombre text,
    apellido text,
    especialidad text,
    matricula text,
    avatar_url text,
    phone text,
    firma_url text,
    preferencias_notificacion jsonb default '{"buzon_email": true}'::jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index idx_profiles_organizacion on profiles(organizacion_id);

create table memberships (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users(id) on delete cascade not null,
    sede_id uuid references sedes(id) on delete cascade not null,
    organizacion_id uuid references organizaciones(id) on delete cascade not null,
    rol app_role not null default 'profesional',
    configuracion_personal jsonb default '{}'::jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(user_id, sede_id)
);

create index idx_memberships_user on memberships(user_id);
create index idx_memberships_sede on memberships(sede_id);

-- ==========================================
-- 3. CLÍNICA (OBRAS SOCIALES / ALUMNOS / AGENDA)
-- ==========================================
create table obras_sociales (
    id uuid primary key default uuid_generate_v4(),
    organizacion_id uuid references organizaciones(id) on delete cascade not null,
    nombre text not null,
    sigla text,
    cuit text,
    direccion_facturacion text,
    email_glp text,
    requiere_autorizacion boolean default true,
    is_active boolean default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

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
    obra_social_id uuid references obras_sociales(id) on delete set null,
    numero_afiliado text,
    cud_numero text,
    cud_vencimiento timestamp with time zone,
    diagnostico text,
    notas text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

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

-- ==========================================
-- 4. FINANZAS Y LIQUIDACIONES
-- ==========================================
create table prestaciones (
    id uuid primary key default uuid_generate_v4(),
    organizacion_id uuid references organizaciones(id) on delete cascade not null,
    obra_social_id uuid references obras_sociales(id) on delete cascade not null,
    codigo text not null,
    descripcion text not null,
    valor_sesion numeric(12, 2) not null default 0,
    is_active boolean default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table liquidaciones (
    id uuid primary key default uuid_generate_v4(),
    sede_id uuid references sedes(id) on delete cascade not null,
    organizacion_id uuid references organizaciones(id) on delete cascade not null,
    obra_social_id uuid references obras_sociales(id) on delete cascade not null,
    periodo text not null, -- format 'YYYY-MM'
    estado text default 'borrador' check (estado in ('borrador', 'generada', 'presentada', 'aprobada', 'cobrada', 'rechazada')),
    fecha_emision timestamp with time zone,
    fecha_presentacion timestamp with time zone,
    monto_total numeric(12, 2) default 0,
    notas text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table modalidades_pago (
    id uuid default gen_random_uuid() primary key,
    profesional_id uuid references profiles(id) on delete cascade not null,
    organizacion_id uuid references organizaciones(id) on delete cascade not null,
    sede_id uuid references sedes(id) on delete cascade, -- Null para tarifario global
    tipo modalidad_pago_tipo not null default 'por_hora',
    valor numeric(12,2) not null default 0,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table ordenes_pago (
    id uuid default gen_random_uuid() primary key,
    profesional_id uuid references profiles(id) on delete cascade not null,
    organizacion_id uuid references organizaciones(id) on delete cascade not null,
    sede_id uuid references sedes(id) on delete set null,
    periodo timestamp with time zone not null,
    monto_bruto numeric(12,2) not null default 0,
    ajustes numeric(12,2) not null default 0,
    monto_neto numeric(12,2) not null default 0,
    estado orden_pago_estado default 'borrador',
    factura_archivo_url text,
    comprobante_pago_url text,
    comentarios text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table cuentas_bancarias (
    id uuid primary key default uuid_generate_v4(),
    organizacion_id uuid references organizaciones(id) on delete cascade not null,
    sede_id uuid references sedes(id) on delete cascade,
    banco text not null,
    titular text not null,
    cbu_cvu text not null unique,
    alias text,
    tipo_cuenta text default 'corriente',
    moneda text default 'ARS',
    is_active boolean default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==========================================
-- 5. MENSAJERÍA Y LEADS
-- ==========================================
create table buzon_mensajes (
    id uuid default gen_random_uuid() primary key,
    organizacion_id uuid references organizaciones(id) on delete cascade not null,
    sede_id uuid references sedes(id) on delete cascade not null,
    alumno_id uuid references alumnos(id) on delete cascade not null,
    remitente_tipo buzon_remitente_tipo not null,
    remitente_id uuid not null,
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

create table leads_preinscripciones (
    id uuid default gen_random_uuid() primary key,
    organizacion_id uuid references organizaciones(id) on delete cascade not null,
    sede_id uuid references sedes(id) on delete cascade,
    datos_json jsonb not null default '{}'::jsonb,
    estado lead_estado not null default 'pendiente',
    observaciones_admin text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table leads_postulaciones (
    id uuid default gen_random_uuid() primary key,
    organizacion_id uuid references organizaciones(id) on delete cascade not null,
    sede_id uuid references sedes(id) on delete cascade,
    datos_json jsonb not null default '{}'::jsonb,
    cv_url text,
    estado lead_estado not null default 'pendiente',
    observaciones_admin text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==========================================
-- 6. METADATA Y HERRAMIENTAS
-- ==========================================
create table plantillas_evolucion (
    id uuid primary key default uuid_generate_v4(),
    organizacion_id uuid references organizaciones(id) on delete cascade not null,
    profesional_id uuid references profiles(id) on delete set null,
    sede_id uuid references sedes(id) on delete cascade, -- Null para plantillas generales
    titulo text not null,
    contenido text not null,
    categoria text default 'general',
    is_shared boolean default false,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==========================================
-- 7. SEGURIDAD (RLS)
-- ==========================================

-- Habilitar RLS en todas las tablas
alter table organizaciones enable row level security;
alter table sedes enable row level security;
alter table profiles enable row level security;
alter table memberships enable row level security;
alter table alumnos enable row level security;
alter table obras_sociales enable row level security;
alter table turnos enable row level security;
alter table evoluciones enable row level security;
alter table prestaciones enable row level security;
alter table liquidaciones enable row level security;
alter table modalidades_pago enable row level security;
alter table ordenes_pago enable row level security;
alter table cuentas_bancarias enable row level security;
alter table buzon_mensajes enable row level security;
alter table buzon_adjuntos enable row level security;
alter table leads_preinscripciones enable row level security;
alter table leads_postulaciones enable row level security;
alter table plantillas_evolucion enable row level security;

-- POLÍTICAS INTEGRALES (AISLAMIENTO ÓRBITA)

-- ORGANIZACIONES
create policy "Usuarios ven su organización" on organizaciones for select
using ( exists ( select 1 from memberships where memberships.organizacion_id = organizaciones.id and memberships.user_id = auth.uid() ) );

-- SEDES
create policy "Usuarios ven sus sedes" on sedes for select
using ( exists ( select 1 from memberships where memberships.sede_id = sedes.id and memberships.user_id = auth.uid() ) );

-- PERFILES
create policy "Usuarios ven perfiles de su organizacion" on profiles for select
using ( exists ( select 1 from memberships where memberships.organizacion_id = profiles.organizacion_id and memberships.user_id = auth.uid() ) );
create policy "Usuarios editan su propio perfil" on profiles for update
using ( auth.uid() = id );

-- MEMBERSHIPS
create policy "Usuarios ven sus membresías" on memberships for select
using ( auth.uid() = user_id );

-- ALUMNOS (Incluye familiar_id en versiones futuras, por ahora segmentado por Sede/Org)
create policy "Lectura de alumnos" on alumnos for select
using ( exists ( select 1 from memberships where memberships.organizacion_id = alumnos.organizacion_id and memberships.user_id = auth.uid() ) );
create policy "Escritura de alumnos (Staff)" on alumnos for all
using ( exists ( select 1 from memberships where memberships.user_id = auth.uid() and memberships.organizacion_id = alumnos.organizacion_id and memberships.rol IN ('director_organizacion', 'director_sede', 'coordinador', 'administrativo') ) );

-- OBRAS SOCIALES
create policy "Lectura de obras sociales" on obras_sociales for select
using ( exists ( select 1 from memberships where memberships.organizacion_id = obras_sociales.organizacion_id and memberships.user_id = auth.uid() ) );

-- TURNOS
create policy "Lectura de turnos" on turnos for select
using ( exists ( select 1 from memberships where memberships.organizacion_id = turnos.organizacion_id and memberships.user_id = auth.uid() ) );
create policy "Escritura de turnos (Staff)" on turnos for all
using ( exists ( select 1 from memberships where memberships.user_id = auth.uid() and memberships.organizacion_id = turnos.organizacion_id and memberships.rol IN ('director_organizacion', 'director_sede', 'coordinador', 'administrativo', 'profesional') ) );

-- EVOLUCIONES
create policy "Usuarios ven evoluciones de su sede" on evoluciones for select
using ( exists ( select 1 from memberships where memberships.sede_id = evoluciones.sede_id and memberships.user_id = auth.uid() ) );
create policy "Profesionales crean evoluciones" on evoluciones for insert
with check ( exists ( select 1 from memberships where memberships.sede_id = evoluciones.sede_id and memberships.user_id = auth.uid() and memberships.rol IN ('profesional', 'coordinador') ) );

-- FINANZAS (LIQUIDACIONES Y PRESTACIONES)
create policy "Lectura de prestaciones" on prestaciones for select
using ( exists ( select 1 from memberships where memberships.organizacion_id = prestaciones.organizacion_id and memberships.user_id = auth.uid() ) );
create policy "Gestion de liquidaciones por sede" on liquidaciones for all
using ( exists ( select 1 from memberships where memberships.sede_id = liquidaciones.sede_id and memberships.user_id = auth.uid() and memberships.rol IN ('director_organizacion', 'director_sede', 'administrativo') ) );

-- HONORARIOS (ORDENES Y MODALIDADES)
create policy "Profesionales ven sus ordenes" on ordenes_pago for select
using ( auth.uid() = profesional_id );
create policy "Admins gestionan ordenes_pago" on ordenes_pago for all
using ( exists ( select 1 from memberships where memberships.user_id = auth.uid() and memberships.organizacion_id = ordenes_pago.organizacion_id and (memberships.rol = 'director_organizacion' or (memberships.rol IN ('director_sede', 'administrativo') and (memberships.sede_id = ordenes_pago.sede_id or ordenes_pago.sede_id IS NULL))) ) );

create policy "Profesionales ven sus modalidades" on modalidades_pago for select
using ( auth.uid() = profesional_id );
create policy "Admins gestionan modalidades" on modalidades_pago for all
using ( exists ( select 1 from memberships where memberships.user_id = auth.uid() and memberships.organizacion_id = modalidades_pago.organizacion_id and (memberships.rol = 'director_organizacion' or (memberships.rol IN ('director_sede', 'administrativo') and (memberships.sede_id = modalidades_pago.sede_id or modalidades_pago.sede_id IS NULL))) ) );

-- CUENTAS BANCARIAS
create policy "Usuarios ven cuentas de su organizacion" on cuentas_bancarias for select
using ( exists ( select 1 from memberships where memberships.organizacion_id = cuentas_bancarias.organizacion_id and memberships.user_id = auth.uid() ) );

-- MENSAJERÍA (BUZÓN)
create policy "Admins gestionan buzon" on buzon_mensajes for all
using ( exists ( select 1 from memberships where memberships.user_id = auth.uid() and memberships.organizacion_id = buzon_mensajes.organizacion_id and memberships.rol IN ('director_organizacion', 'director_sede', 'administrativo', 'coordinador') ) );
create policy "Admins gestionan adjuntos" on buzon_adjuntos for all
using ( exists ( select 1 from buzon_mensajes join memberships on memberships.organizacion_id = buzon_mensajes.organizacion_id where buzon_mensajes.id = buzon_adjuntos.mensaje_id and memberships.user_id = auth.uid() and memberships.rol IN ('director_organizacion', 'director_sede', 'administrativo', 'coordinador') ) );

-- FORMULARIOS (LEADS)
create policy "Insercion publica de leads" on leads_preinscripciones for insert with check (true);
create policy "Insercion publica de postulaciones" on leads_postulaciones for insert with check (true);
create policy "Admins gestionan leads" on leads_preinscripciones for all
using ( exists ( select 1 from memberships where memberships.user_id = auth.uid() and memberships.organizacion_id = leads_preinscripciones.organizacion_id and memberships.rol IN ('director_organizacion', 'director_sede', 'administrativo') ) );

-- PLANTILLAS
create policy "Usuarios ven sus plantillas o compartidas" on plantillas_evolucion for select
using ( (profesional_id = auth.uid()) or (is_shared = true and organizacion_id in ( select organizacion_id from memberships where user_id = auth.uid() )) );
create policy "Usuarios gestionan sus plantillas" on plantillas_evolucion for all
using ( profesional_id = auth.uid() or exists ( select 1 from memberships where memberships.user_id = auth.uid() and memberships.organizacion_id = plantillas_evolucion.organizacion_id and (memberships.rol = 'director_organizacion' or (memberships.rol IN ('director_sede', 'coordinador') and memberships.sede_id = plantillas_evolucion.sede_id)) ) );
