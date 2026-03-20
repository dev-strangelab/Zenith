-- Common enumerations
create type app_role as enum ('director_organizacion', 'director_sede', 'coordinador', 'profesional', 'administrativo', 'familiar');
create type alumno_estado as enum ('activo', 'pausado', 'finalizado', 'lista_espera');
create type asistencia_estado as enum ('programado', 'presente', 'ausente_con_aviso', 'ausente_sin_aviso', 'cancelado');
create type modalidad_pago_tipo as enum ('por_hora', 'mensual', 'por_sesion');
create type orden_pago_estado as enum ('borrador', 'pendiente_facturacion', 'pago_pendiente', 'liquidado');
create type buzon_remitente_tipo as enum ('familia', 'equipo_clinico', 'administracion');
create type lead_estado as enum ('pendiente', 'en_revision', 'contactado', 'aceptado', 'rechazado');
