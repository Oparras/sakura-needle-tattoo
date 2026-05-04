# Telegram webhook para Sakura Needle Tattoo

Este proyecto usa Telegram no solo como aviso, sino también como canal de gestión rápida de solicitudes de cita.

## Variables necesarias

Configura estas variables en local y en Vercel:

- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`
- `TELEGRAM_WEBHOOK_SECRET`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Por qué se usa `SUPABASE_SERVICE_ROLE_KEY`

El flujo público de solicitud no puede leer `appointment_requests` porque la tabla mantiene RLS restrictivo para clientes anónimos.

Ahora necesitamos dos capacidades server-side:

1. Insertar una solicitud y recuperar su `id` para construir botones de Telegram con `callback_data`.
2. Permitir que el webhook de Telegram modifique `appointment_requests` y `availability_slots` sin depender de una sesión de usuario del navegador.

Por eso se usa `SUPABASE_SERVICE_ROLE_KEY` **solo** en:

- `src/app/api/appointment-request/route.ts`
- `src/app/api/telegram/webhook/route.ts`

No debe exponerse al cliente ni usar `NEXT_PUBLIC_`.

## Configurar el webhook en producción

Usa esta llamada reemplazando los placeholders:

```text
https://api.telegram.org/bot<BOT_TOKEN>/setWebhook?url=https://TU_DOMINIO.vercel.app/api/telegram/webhook&secret_token=TU_SECRET
```

## Comprobar el webhook

Para revisar si Telegram lo ha guardado correctamente:

```text
https://api.telegram.org/bot<BOT_TOKEN>/getWebhookInfo
```

## Qué hacen los botones inline

Cada nueva solicitud llega a Telegram con:

- datos de la persona
- disponibilidad seleccionada
- comentario
- enlace directo para abrir WhatsApp
- botones inline para actuar sobre Supabase

Botones disponibles:

- `Marcar contactado`
- `Cancelar solicitud`
- `Reservar DD/MM mañana|tarde`
- `Reabrir DD/MM mañana|tarde`

## Efecto real sobre Supabase

### Marcar contactado

- `appointment_requests.status = 'contacted'`

### Cancelar solicitud

- `appointment_requests.status = 'cancelled'`
- no cambia `availability_slots`

### Reservar franja

- `appointment_requests.status = 'confirmed'`
- la franja elegida pasa a `false` en `availability_slots`
- deja de verse en el calendario público

### Reabrir franja

- `appointment_requests.status = 'cancelled'`
- la franja elegida vuelve a `true` en `availability_slots`
- vuelve a verse en la web pública

## Seguridad aplicada

- El webhook valida `X-Telegram-Bot-Api-Secret-Token` si `TELEGRAM_WEBHOOK_SECRET` está configurado.
- El webhook solo acepta callbacks del `TELEGRAM_CHAT_ID` configurado.
- El `callback_data` se parsea con formato estricto.
- La `service role key` no se expone al cliente.
