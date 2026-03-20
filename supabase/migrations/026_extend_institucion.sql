-- Migración: Datos institucionales y estéticos para Organizaciones y Sedes
alter table organizaciones 
add column if not exists logo_url text,
add column if not exists telefono text,
add column if not exists direccion_legal text;

alter table sedes 
add column if not exists telefono text,
add column if not exists email_contacto text;

-- Comentarios para documentación
comment on column organizaciones.logo_url is 'URL del logo institucional alojado en Storage';
comment on column sedes.color_identidad is 'Color hexadecimal de la marca para la sede';
