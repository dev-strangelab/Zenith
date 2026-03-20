# ⚠️ REGLAS DE REFACTORIZACIÓN - ÓRBITA 2

**PRINCIPIO FUNDAMENTAL:** No romper nada. La app debe funcionar en todo momento.

---

## 🚨 REGLAS CRÍTICAS (NUNCA ROMPER)

### 1. ✅ TESTS ANTES Y DESPUÉS DE CADA FASE

**Regla:**
- Antes de empezar una fase: Verificar que todo funciona
- Después de cada task: Verificar que todo sigue funcionando
- Después de cada fase: Test completo de la funcionalidad afectada

**Tests Mínimos:**
```bash
# Antes de cada task
npm run dev       # Debe correr sin errores
npm run build     # Debe compilar sin errores
npm run lint      # Debe pasar sin errores

# Después de cada task
- Probar la funcionalidad manualmente en el navegador
- Verificar que no hay errores en consola
- Verificar que la UX es idéntica
```

**❌ NUNCA:**
- Hacer commit sin probar
- Pasar a la siguiente task si hay errores
- Asumir que funciona sin verificar

---

### 2. ✅ CHECKLIST ESTRICTO - NO SALTEAR PASOS

**Regla:**
Cada task tiene un checklist. TODOS los items deben estar marcados antes de continuar.

**Proceso:**
1. Leer el checklist completo ANTES de empezar
2. Ir marcando items uno por uno
3. Si un item no aplica, documentar por qué
4. Solo continuar cuando TODOS estén marcados

**❌ NUNCA:**
- Saltear items del checklist "porque no parecen importantes"
- Marcar items sin hacerlos realmente
- Continuar con items pendientes

---

### 3. ✅ NO AGREGAR FEATURES NUEVAS

**Regla:**
Este es un REFACTOR, no desarrollo de features.

**Permitido:**
- Mover código existente
- Reorganizar estructura
- Optimizar código existente
- Agregar utilities/helpers para código existente

**❌ PROHIBIDO:**
- Agregar funcionalidades que no existían
- Cambiar el comportamiento de la UI
- Modificar lógica de negocio (solo moverla)
- "Aprovechar" para agregar "mejoritas"

**Excepción:**
Si encuentras un bug obvio, documentarlo en un issue aparte. NO arreglarlo durante el refactor.

---

### 4. ✅ COMMITS PEQUEÑOS Y FRECUENTES

**Regla:**
Un commit por cada task completada. Commits descriptivos.

**Formato:**
```
<tipo>(<scope>): <descripción corta>

[Opcional: descripción larga]
```

**Tipos:**
- `feat:` - Nueva utility/servicio
- `refactor:` - Reorganización sin cambio funcional
- `chore:` - Tareas de mantenimiento
- `test:` - Agregar tests
- `docs:` - Documentación

**Ejemplos Correctos:**
```
feat(lib): add date utilities
refactor(dashboard): move CSV export to service
chore: create lib folder structure
```

**❌ NUNCA:**
- Commits gigantes con múltiples cambios
- Commits sin mensaje descriptivo
- Commits con código que no compila
- Commits con console.log olvidados

---

### 5. ✅ SINCRONIZAR DIARIAMENTE

**Regla:**
Al final de cada día de trabajo:

**Checklist Diario:**
- [ ] Todos los cambios del día commiteados
- [ ] Push al repositorio remoto
- [ ] Verificar que no hay conflictos
- [ ] Actualizar REFACTOR_PLAN.md con progreso
- [ ] Documentar blockers/problemas en REFACTOR_LOG.md

**❌ NUNCA:**
- Dejar código sin commitear overnight
- Ir varios días sin pushear
- Ignorar conflictos de merge

---

## 🛡️ PROTOCOLOS DE MITIGACIÓN DE RIESGOS

### PROTOCOLO 1: Si rompes algo

**Pasos:**
1. **DETENER** inmediatamente
2. **NO** seguir adelante "a ver si se arregla solo"
3. Identificar qué se rompió exactamente
4. Revisar el último commit funcional
5. Opciones:
   - Revertir cambios: `git checkout -- <archivo>`
   - Hacer `git reset --soft HEAD~1` si el commit es reciente
   - Arreglar el problema antes de continuar
6. Documentar qué pasó y cómo se arregló
7. Agregar un checkpoint en el checklist para evitarlo en el futuro

**❌ NUNCA:**
- Seguir adelante con algo roto
- Hacer más commits sobre código roto
- "Lo arreglo después"

---

### PROTOCOLO 2: Si te pierdes en el camino

**Síntomas:**
- No sabes en qué task estás
- Modificaste archivos que no debías
- No recuerdas qué cambios hiciste

**Pasos:**
1. Abrir `REFACTOR_PLAN.md`
2. Buscar la última task marcada como completada
3. Ver `git status` para ver archivos modificados
4. Ver `git diff` para ver qué cambiaste
5. Decidir:
   - Commitear si está completo
   - Revertir si no corresponde
   - Completar la task actual
6. Marcar claramente dónde estás en el plan

**❌ NUNCA:**
- Seguir modificando archivos sin saber por qué
- Commitear "a ver qué pasa"

---

### PROTOCOLO 3: Si encuentras scope creep

**Síntoma:**
Encuentras código que "ya que estás" podrías mejorar/arreglar.

**Regla:**
**NO LO HAGAS**

**Pasos:**
1. Crear un issue en GitHub: "Mejora potencial: [descripción]"
2. Etiquetar como `future-improvement`
3. Continuar con el refactor planeado
4. Después del refactor completo, evaluar si vale la pena

**❌ NUNCA:**
- "Ya que estoy, agrego esto rapidito"
- Desviar del plan sin documentar

---

### PROTOCOLO 4: Manejo de conflictos

**Si aparecen conflictos de merge:**

**Pasos:**
1. No entrar en pánico
2. Ver qué archivos tienen conflictos: `git status`
3. Para cada archivo:
   - Abrir el archivo
   - Buscar marcadores `<<<<<<<`, `=======`, `>>>>>>>`
   - Decidir qué código mantener
   - Eliminar los marcadores
4. Probar que todo funciona
5. Commitear la resolución
6. Documentar el conflicto y cómo se resolvió

**❌ NUNCA:**
- Resolver conflictos sin entender qué hace cada parte del código
- Aceptar cambios automáticamente sin revisar
- Ignorar conflictos

---

## 📝 CHECKLIST DE VALIDACIÓN UNIVERSAL

**Usar ANTES de cada commit:**

### ✅ Código
- [ ] Sin errores de TypeScript: `tsc --noEmit`
- [ ] Sin errores de ESLint: `npm run lint`
- [ ] Sin errores de build: `npm run build`
- [ ] Sin `console.log` olvidados
- [ ] Sin `any` innecesarios en TypeScript
- [ ] Sin imports sin usar
- [ ] Sin código comentado (eliminar o documentar por qué)

### ✅ Funcionalidad
- [ ] App corre: `npm run dev`
- [ ] Funcionalidad afectada probada manualmente
- [ ] UX es idéntica a la versión anterior
- [ ] No hay errores en consola del navegador
- [ ] No hay warnings críticos

### ✅ Git
- [ ] Todos los archivos relevantes staged
- [ ] Mensaje de commit descriptivo
- [ ] Commit pequeño y atómico
- [ ] Cambios relacionados al mensaje del commit

### ✅ Documentación
- [ ] REFACTOR_PLAN.md actualizado (checkboxes marcados)
- [ ] REFACTOR_LOG.md actualizado si hubo problemas
- [ ] Comentarios en código si es necesario

---

## 🚦 SEÑALES DE ALERTA

### 🔴 DETENER TODO si ves esto:

1. **Build falla y no sabes por qué**
   - No sigas, arreglalo primero

2. **App no corre en dev**
   - No sigas, arreglalo primero

3. **Modificaste > 5 archivos en una task**
   - Probablemente te desviaste, revisar

4. **No recuerdas qué cambios hiciste**
   - `git diff` y documentar

5. **Llevas > 2 horas en una task de 1 hora**
   - Probablemente hay un problema, pedir ayuda

6. **Estás "arreglando" cosas que no estaban en el plan**
   - Scope creep, documentar en issue y continuar con el plan

---

## 📊 LOGS REQUERIDOS

### REFACTOR_LOG.md

Crear archivo `.claude/REFACTOR_LOG.md` y actualizar diariamente:

```markdown
# REFACTOR LOG

## [FECHA] - Día X

### ✅ Completado
- Task X.X: [descripción]
- Task X.X: [descripción]

### ⚠️ Problemas Encontrados
- [Descripción del problema]
  - Solución: [cómo se resolvió]
  - Tiempo perdido: [X horas]

### 🔄 En Progreso
- Task X.X: [descripción] - [% completado]

### 📝 Notas
- [Cualquier nota importante]

### ⏱️ Tiempo
- Estimado: X horas
- Real: X horas
- Diferencia: [explicación si hay desviación]
```

---

## 🎯 FILOSOFÍA DEL REFACTOR

### Mantras a repetir:

1. **"Primero que funcione, después que sea bonito"**
   - No optimices prematuramente
   - Primero hacer que funcione igual
   - Después mejorar

2. **"Un paso a la vez"**
   - No apurarse
   - Cada task completa antes de la siguiente
   - Probar después de cada cambio

3. **"Si no está roto, no lo arregles (todavía)"**
   - Seguir el plan
   - Issues para mejoras futuras
   - Enfoque en el objetivo

4. **"Documenta todo"**
   - Checkboxes en el plan
   - Logs diarios
   - Commits descriptivos

5. **"Cuando dudes, pregunta"**
   - Mejor perder 5 min preguntando
   - Que perder 2 horas arreglando

---

## ✅ CHECKLIST PRE-INICIO

**ANTES de empezar CUALQUIER fase:**

- [ ] He leído el plan completo de la fase
- [ ] Entiendo qué archivos voy a modificar
- [ ] Tengo tiempo dedicado sin interrupciones
- [ ] App está funcionando correctamente AHORA
- [ ] Último commit está pusheado
- [ ] No hay cambios sin commitear
- [ ] Branch correcto: `refactor/[nombre-fase]`
- [ ] REFACTOR_PLAN.md abierto en otra ventana
- [ ] REFACTOR_RULES.md leído (este archivo)
- [ ] Timer/reloj para trackear tiempo

---

## 🎯 SALIDA DE EMERGENCIA

**Si necesitas parar el refactor urgentemente:**

### Pasos:
1. `git status` → capturar estado actual
2. Si hay cambios valiosos: `git stash save "WIP: [descripción]"`
3. Documentar en REFACTOR_LOG.md dónde quedaste
4. Marcar en REFACTOR_PLAN.md última task completada
5. Push de commits existentes
6. Crear nota con pasos para retomar

**Para retomar:**
1. `git stash list` → ver cambios guardados
2. Leer REFACTOR_LOG.md → recordar dónde estabas
3. Leer REFACTOR_PLAN.md → ver siguiente task
4. `git stash pop` → recuperar cambios (si aplica)
5. Continuar

---

## 📞 CUANDO PEDIR AYUDA

**Pedir ayuda SI:**
- Llevas > 30 min bloqueado en un error
- No entiendes por qué algo se rompió
- La estimación de tiempo se duplicó
- Aparecen errores que no entiendes
- No sabes cómo continuar

**NO es debilidad pedir ayuda, es eficiencia.**

---

**Última actualización:** 20 de Marzo, 2026
**Versión:** 1.0
