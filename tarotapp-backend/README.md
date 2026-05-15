# Tarot App Backend

Backend NestJS para el MVP local de Tarot App. Esta version usa arquitectura DDD por contextos y corre sin Supabase/Gemini/RevenueCat: guarda datos en memoria y conversa con Ollama local.

## Prerequisitos

- Node.js y npm disponibles en la terminal.
- Ollama instalado y corriendo.
- Modelo local disponible:

```powershell
ollama list
```

Para este MVP se usa por defecto:

```text
llama3.1:latest
```

Si no esta instalado:

```powershell
ollama pull llama3.1
```

## Variables Opcionales

El backend funciona con defaults, pero puedes configurar Ollama asi:

```powershell
$env:OLLAMA_BASE_URL = "http://localhost:11434"
$env:OLLAMA_MODEL = "llama3.1:latest"
```

## Instalacion

Desde la carpeta del backend:

```powershell
cd C:\Users\DELL\Documents\tarot-app\tarotapp-backend
npm install
```

## Levantar En Desarrollo

```powershell
npm run start:dev
```

El servidor queda en:

```text
http://localhost:3000
```

Al arrancar, Nest debe mapear rutas como:

```text
Mapped {/health, GET} route
Mapped {/sessions, POST} route
Mapped {/sessions/:id/messages, POST} route
Mapped {/sessions/:id/stream, GET} route
```

Si una ruta nueva devuelve `Cannot POST ...`, detiene el servidor con `Ctrl+C` y vuelve a correr `npm run start:dev`.

## Comandos De Verificacion

```powershell
npm run build
npm test
npm run test:e2e
```

Scripts disponibles:

```powershell
npm run start
npm run start:dev
npm run start:prod
npm run build
npm test
npm run test:e2e
npm run test:cov
npm run lint
```

Nota: `npm run lint` actualmente usa `--fix`, por lo que puede modificar archivos.

## Probar Health

```powershell
Invoke-RestMethod -Method Get -Uri "http://localhost:3000/health"
```

Respuesta esperada:

```json
{
  "status": "ok",
  "interpretationProvider": "ollama",
  "ollama": {
    "baseUrl": "http://localhost:11434",
    "model": "llama3.1:latest"
  }
}
```

## Crear Una Sesion

```powershell
$body = @{
  spreadType = "rapid"
  deckId = "marsella"
} | ConvertTo-Json

$response = Invoke-RestMethod `
  -Method Post `
  -Uri "http://localhost:3000/sessions" `
  -ContentType "application/json" `
  -Body $body

$response
$sessionId = $response.session_id
```

Importante: las sesiones viven en memoria. Si reinicias el servidor, debes crear una sesion nueva.

## Conversar Con El Tarotista

```powershell
$chatBody = @{
  content = "Hola, quiero conversar sobre un cambio que estoy viviendo."
} | ConvertTo-Json

Invoke-RestMethod `
  -Method Post `
  -Uri "http://localhost:3000/sessions/$sessionId/messages" `
  -ContentType "application/json" `
  -Body $chatBody
```

Esto guarda el mensaje del usuario, llama a Ollama y devuelve:

```json
{
  "message": {
    "role": "assistant",
    "content": "..."
  },
  "session": {
    "session_id": "...",
    "current_status": "AWAITING_BIO",
    "messages": []
  }
}
```

## Barajar Cartas

```powershell
Invoke-RestMethod `
  -Method Get `
  -Uri "http://localhost:3000/tarot/deck/shuffle?deckId=marsella&spreadType=rapid"
```

Para `rapid`, el backend devuelve solo los 22 arcanos mayores.

## Seleccionar Cartas

Para una tirada `rapid` se requieren exactamente 6 cartas y posiciones 1 a 6:

```powershell
$pickBody = @{
  cardIds = @(0, 1, 2, 3, 4, 5)
  positions = @(1, 2, 3, 4, 5, 6)
} | ConvertTo-Json

Invoke-RestMethod `
  -Method Post `
  -Uri "http://localhost:3000/sessions/$sessionId/pick-cards" `
  -ContentType "application/json" `
  -Body $pickBody
```

La sesion pasa a:

```text
INTERPRETING
```

## Interpretacion Final Por SSE

Abre esta URL en el navegador:

```text
http://localhost:3000/sessions/TU_SESSION_ID/stream
```

O usa PowerShell:

```powershell
Invoke-WebRequest `
  -UseBasicParsing `
  -Method Get `
  -Uri "http://localhost:3000/sessions/$sessionId/stream"
```

El stream emite primero un evento de estado:

```json
{ "token": "Iniciando conexion con el oraculo...", "type": "status" }
```

Luego tokens de contenido y finalmente:

```text
[DONE]
```

## Usuario Local

Por defecto se usa:

```text
local-user
```

Para simular otro usuario, agrega el header `x-user-id`.

Ejemplo:

```powershell
Invoke-RestMethod `
  -Method Get `
  -Uri "http://localhost:3000/user/profile" `
  -Headers @{ "x-user-id" = "user-123" }
```

## Troubleshooting

### PowerShell: curl no acepta -H

En PowerShell, `curl` suele ser alias de `Invoke-WebRequest`. Usa `curl.exe` o los comandos `Invoke-RestMethod` de este README.

Ejemplo con curl real:

```powershell
curl.exe -X POST http://localhost:3000/sessions `
  -H "Content-Type: application/json" `
  -d '{ "spreadType": "rapid", "deckId": "marsella" }'
```

### Cannot POST /sessions/:id/messages

El servidor no tiene cargada la version nueva del codigo.

1. Corta `npm run start:dev` con `Ctrl+C`.
2. Corre `npm run build`.
3. Vuelve a levantar `npm run start:dev`.
4. Crea una sesion nueva.

### Session not found

Las sesiones estan en memoria. Si reiniciaste el backend, el `session_id` anterior ya no existe.

### Ollama request failed

Verifica que Ollama este vivo:

```powershell
ollama list
```

Verifica que el backend apunte al host correcto:

```powershell
$env:OLLAMA_BASE_URL
$env:OLLAMA_MODEL
```

### node o npm no se reconoce

Node.js no esta en el PATH de esa terminal. Abre una terminal nueva o reinstala Node.js marcando la opcion de agregarlo al PATH.
