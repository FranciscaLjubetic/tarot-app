# Tarot App Frontend

Cascaron v1 en React Native + Expo para conversar con el backend de Tarot App. La app permite elegir una tirada visual, abrir una sesion y chatear con el tarotista via `POST /sessions/:id/messages`.

## Prerequisitos

- Backend levantado en `http://localhost:3000`.
- Ollama corriendo para que el backend pueda responder.
- Node.js y npm disponibles en la terminal.

## Levantar

```powershell
cd C:\Users\DELL\Documents\tarot-app\tarot-app-frontend
npm install
npm run start
```

Luego elige en Expo:

- `w` para web.
- `a` para Android.
- escanear QR para Expo Go en telefono.

## Backend URL

La app muestra un campo editable `Backend`.

Usa:

```text
http://localhost:3000
```

para web o iOS simulator.

Usa:

```text
http://10.0.2.2:3000
```

para Android emulator.

Para Expo Go en telefono fisico, usa la IP LAN de tu PC:

```text
http://TU_IP_LOCAL:3000
```

Ejemplo:

```text
http://192.168.1.45:3000
```

## Flujo Manual

1. Levanta backend.
2. Levanta frontend.
3. Revisa o edita el campo `Backend`.
4. Elige una tirada.
5. Pulsa `Abrir sesion`.
6. Escribe un mensaje y pulsa `Enviar`.

## Assets

La v1 copia una seleccion de cartas cyberpunk desde:

```text
../Arcanes/cyberpunk/clean/arcanos mayores
```

hacia:

```text
assets/cards/cyberpunk/major
```

Las tres opciones de tirada usan estos mismos assets por ahora. Cuando existan mazos mejores, se pueden reemplazar las imagenes o agregar carpetas por deck. Mantener extensiones en minuscula, por ejemplo `.png`, para que Metro/Expo las resuelva sin problemas.

## Nota De V1

Aunque la UI muestra Rapida, Circular y Cruz Celta, por debajo todas abren una sesion `rapid` para no bloquear la conversacion con limites de tier del backend local. La seleccion visual queda lista para mapear a tiradas reales en la siguiente iteracion.
