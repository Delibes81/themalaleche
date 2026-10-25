# The Mala Leche — sitio y dashboard (V2)

Sitio público de la agencia y centro de operación privado en `/admin`.

## Stack
Next.js 16 (App Router) · React 19 · Tailwind 3 · Supabase (Auth + Postgres + Storage) · Vercel · pnpm

## Rutas
| Ruta | Quién | Qué |
|---|---|---|
| `/` | Público | Sitio de la agencia |
| `/propuesta/[id]` | Quien tenga el enlace | Propuesta para el cliente |
| `/cuestionario/[token]` | Quien tenga el enlace | Cuestionario A/B del cliente |
| `/admin` | Solo administradores | Resumen, proyectos, clientes, propuestas, precios, agentes |

`/cotizador` redirige a `/admin/cotizador`.

## Puesta en marcha
1. **Base de datos:** ejecuta `supabase/migrations/20261025000000_v2_dashboard.sql` en Supabase → SQL Editor.
   - Crea las tablas nuevas, activa RLS solo-admin en todas y **cierra la lectura anónima de `proposals`** (las propuestas se leen ahora con la función `get_proposal`).
   - Al final, descomenta y ejecuta el `insert into public.admins ...` con tu correo para darte acceso.
2. **Variables:** copia `.env.example` a `.env.local` (y las mismas en Vercel): URL y anon key de Supabase, y `NEXT_PUBLIC_SITE_URL`.
3. **Local:** `pnpm install` · `pnpm dev` · abre `http://localhost:3000/admin`.
4. **Verificación:** `pnpm check` (lint, tipos y build).

## Despliegue en Vercel
1. Importa el repo en Vercel (framework Next.js, gestor pnpm detectado por `packageManager`).
2. Agrega las tres variables de entorno.
3. Cuando el preview funcione, apunta el dominio `themalaleche.com` a Vercel y desactiva el sitio en Netlify.

## Conexión de los agentes
Los agentes de `tml-agencia` leen y escriben este mismo Supabase con `node herramientas/tml.mjs` (service role key solo en la Mac del fundador).

## Seguridad
- Ningún visitante anónimo puede listar tablas; solo abrir una propuesta o un cuestionario con su enlace.
- Toda escritura del dashboard pasa por Server Actions con sesión de administrador y RLS.
- Pendiente recomendado: limitar la subida al bucket `mockups` solo a administradores (políticas de Storage).
