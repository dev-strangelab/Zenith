-- Migración 024: Seguridad Integral y Vínculos Familiares
-- Este script define la tabla de relaciones y las políticas de RLS para alumnos, turnos y obras sociales.

-- 1. Tabla de Vínculos Familiares
-- Relaciona a un usuario (familiar) con un alumno específico.
CREATE TABLE IF NOT EXISTS familiares_alumnos (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    alumno_id uuid REFERENCES alumnos(id) ON DELETE CASCADE NOT NULL,
    parentesco text, -- Ej: 'Madre', 'Padre', 'Tutor Legal'
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    
    UNIQUE(user_id, alumno_id)
);

-- Habilitar RLS
ALTER TABLE familiares_alumnos ENABLE ROW LEVEL SECURITY;

-- 2. Refactorización de Políticas para la tabla ALUMNOS
-- Limpiamos políticas previas para evitar conflictos
DROP POLICY IF EXISTS "Usuarios ven alumnos de su sede" ON alumnos;
DROP POLICY IF EXISTS "Usuarios editan alumnos de su sede" ON alumnos;
DROP POLICY IF EXISTS "Usuarios insertan alumnos en su sede" ON alumnos;

-- Política de Lectura (SELECT)
CREATE POLICY "Lectura de alumnos"
ON alumnos FOR SELECT
USING (
    -- Caso A: Es personal administrativo/clínico de la organización/sede
    EXISTS (
        SELECT 1 FROM memberships
        WHERE memberships.user_id = auth.uid()
        AND memberships.organizacion_id = alumnos.organizacion_id
    )
    OR 
    -- Caso B: Es un familiar vinculado directamente a este alumno
    EXISTS (
        SELECT 1 FROM familiares_alumnos
        WHERE familiares_alumnos.user_id = auth.uid()
        AND familiares_alumnos.alumno_id = alumnos.id
    )
);

-- Política de Escritura (INSERT/UPDATE/DELETE) - Solo para Staff
CREATE POLICY "Escritura de alumnos (Staff)"
ON alumnos FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM memberships
        WHERE memberships.user_id = auth.uid()
        AND memberships.organizacion_id = alumnos.organizacion_id
        AND memberships.rol IN ('director_organizacion', 'director_sede', 'coordinador', 'administrativo')
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM memberships
        WHERE memberships.user_id = auth.uid()
        AND memberships.organizacion_id = alumnos.organizacion_id
        AND memberships.rol IN ('director_organizacion', 'director_sede', 'coordinador', 'administrativo')
    )
);

-- 3. Políticas para la tabla TURNOS
DROP POLICY IF EXISTS "Usuarios ven turnos de su sede" ON turnos;
DROP POLICY IF EXISTS "Usuarios editan turnos de su sede" ON turnos;
DROP POLICY IF EXISTS "Usuarios insertan turnos en su sede" ON turnos;

CREATE POLICY "Lectura de turnos"
ON turnos FOR SELECT
USING (
    -- Caso A: Staff de la organización
    EXISTS (
        SELECT 1 FROM memberships
        WHERE memberships.user_id = auth.uid()
        AND memberships.organizacion_id = turnos.organizacion_id
    )
    OR
    -- Caso B: Familiar del alumno vinculado al turno
    EXISTS (
        SELECT 1 FROM familiares_alumnos
        WHERE familiares_alumnos.user_id = auth.uid()
        AND familiares_alumnos.alumno_id = turnos.alumno_id
    )
);

-- Política de Escritura de Turnos (Staff)
CREATE POLICY "Escritura de turnos (Staff)"
ON turnos FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM memberships
        WHERE memberships.user_id = auth.uid()
        AND memberships.organizacion_id = turnos.organizacion_id
        AND memberships.rol IN ('director_organizacion', 'director_sede', 'coordinador', 'administrativo', 'profesional')
    )
);

-- 4. Políticas para la tabla OBRAS_SOCIALES
-- Bloquea acceso anónimo y segmenta por organización
ALTER TABLE obras_sociales ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Usuarios ven obras sociales de su organizacion" ON obras_sociales;

CREATE POLICY "Lectura de obras sociales"
ON obras_sociales FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.organizacion_id = obras_sociales.organizacion_id
    )
);

-- 5. Índices de Rendimiento para RLS
CREATE INDEX IF NOT EXISTS idx_familiares_alumnos_user ON familiares_alumnos(user_id);
CREATE INDEX IF NOT EXISTS idx_familiares_alumnos_alumno ON familiares_alumnos(alumno_id);
