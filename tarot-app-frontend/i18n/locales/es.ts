export default {
  app: {
    title: 'Tarot App',
    subtitle: 'Oraculo Cyberpunk',
    status: {
      noSession: 'SIN SESION',
    },
    backendLabel: 'Backend',
    backendPlaceholder: 'http://localhost:3000',
    openSession: 'Abrir sesion',
    resetSession: 'Reiniciar sesion',
  },
  welcome: {
    prompt: 'Inicia una sesion y cuentame que se esta moviendo bajo la superficie.',
  },
  chat: {
    you: 'Tu',
    reader: 'Tarotista',
    typing: 'Consultando a Ollama...',
    inputPlaceholder: 'Escribe lo que quieres explorar...',
    inputDisabled: 'Abre una sesion para conversar',
    send: 'Enviar',
  },
  spread: {
    active: 'Tirada activa',
    shuffle: 'Barajar mazo',
    deck: 'Mazo',
    tapHint: 'Toca una posicion para sacar carta.',
    noCards: 'No quedan cartas en el mazo.',
    rapid: {
      title: 'Rapida',
      subtitle: 'Seis cartas para una pregunta viva.',
      description:
        'Se toman solo Arcanos Mayores. Dos filas de tres cartas: las primeras 3 muestran el futuro proximo y las cartas 4 a 6 el futuro mas lejano. Las cartas 1 y 4 son favorables, 3 y 6 muestran obstaculos, y 2 y 5 sintetizan el resultado.',
      positions: '6 cartas',
    },
    circular: {
      title: 'Circular',
      subtitle: 'Doce casas para mirar el ciclo completo.',
      description:
        'Doce cartas en circulo. Las cartas 8, 9 y 10 hablan del pasado, 11, 12 y 1 describen el presente, y 2, 3 y 4 anuncian el futuro. Las cartas 5, 6 y 7 se dejan boca abajo como el misterio del mas alla.',
      positions: '12 cartas',
    },
    celtic: {
      title: 'Cruz Celta',
      subtitle: 'Una lectura amplia para decisiones con capas.',
      description:
        'Diez cartas en forma de cruz y columna. La cruz central habla del presente, influencias, pasado reciente y origenes. La columna derecha muestra temores, opiniones externas, deseos y la resolucion final de la consulta.',
      positions: '10 cartas',
    },
  },
  actions: {
    close: 'Cerrar',
  },
  language: {
    switchTo: 'Cambiar a {{locale}}',
    spanish: 'Espanol',
    english: 'Ingles',
  },
};
