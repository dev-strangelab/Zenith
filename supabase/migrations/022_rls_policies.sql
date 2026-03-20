-- Políticas de seguridad básicas

-- Perfiles: Cualquiera puede ver su propio perfil
create policy "Usuarios pueden ver su propio perfil"
on profiles for select
using ( auth.uid() = id );

create policy "Usuarios pueden actualizar su propio perfil"
on profiles for update
using ( auth.uid() = id );

-- Memberships: Usuarios pueden ver sus propias membresías
create policy "Usuarios pueden ver sus membresías"
on memberships for select
using ( auth.uid() = user_id );

-- Sedes: Usuarios pueden ver las sedes donde tienen membresía
create policy "Usuarios pueden ver sus sedes"
on sedes for select
using (
    exists (
        select 1 from memberships
        where memberships.sede_id = sedes.id
        and memberships.user_id = auth.uid()
    )
);

-- Organizaciones: Usuarios pueden ver su organización
create policy "Usuarios pueden ver su organización"
on organizaciones for select
using (
    exists (
        select 1 from memberships
        where memberships.organizacion_id = organizaciones.id
        and memberships.user_id = auth.uid()
    )
);
