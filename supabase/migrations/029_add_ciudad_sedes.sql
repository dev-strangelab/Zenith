-- Migración: Añadir Ciudad a Sedes
alter table sedes 
add column if not exists ciudad text;

-- Comentario para documentación
comment on column sedes.ciudad is 'Ciudad o localidad donde se encuentra la sede';
