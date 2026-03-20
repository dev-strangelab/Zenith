-- Migración: Extensión de perfiles para profesionales y miembros del equipo
alter table profiles 
add column if not exists nombre text,
add column if not exists apellido text,
add column if not exists especialidad text,
add column if not exists matricula text,
add column if not exists firma_url text,
add column if not exists preferencias_notificacion jsonb default '{"buzon_email": true}'::jsonb;

-- Comentario: Mantuvimos full_name por compatibilidad, pero priorizamos nombre/apellido para contratos.
comment on column profiles.nombre is 'Nombre de pila del usuario';
comment on column profiles.apellido is 'Apellido del usuario';
comment on column profiles.especialidad is 'Especialidad médica o profesional';
comment on column profiles.matricula is 'Matrícula profesional para firmas legales';
