const socket = io.connect('http://localhost:8080');

// Elementos del DOM
const nuevoTurnoBtn = document.getElementById('nuevoTurnoBtn');
const avanzarTurnoBtn = document.getElementById('avanzarTurnoBtn');
const turnoActualElemento = document.getElementById('turnoActual');
const proximosTurnosElemento = document.getElementById('proximosTurnos');

// Función para actualizar la pantalla de los próximos turnos
function actualizarTurnos({ actual, proximos }) {
  if (turnoActualElemento) {
    turnoActualElemento.textContent = actual;
  }

  if (proximosTurnosElemento) {
    proximosTurnosElemento.innerHTML = proximos.map(turno => `<li>Turno ${turno}</li>`).join('');
  }
}

// Escuchar el evento 'actualizarTurnos' del servidor
socket.on('actualizarTurnos', actualizarTurnos);

// Enviar evento 'nuevoTurno' al servidor al hacer clic en el botón
if (nuevoTurnoBtn) {
  nuevoTurnoBtn.addEventListener('click', () => {
    socket.emit('nuevoTurno');
  });
}

// Enviar evento 'avanzarTurno' al servidor al hacer clic en el botón
if (avanzarTurnoBtn) {
  avanzarTurnoBtn.addEventListener('click', () => {
    socket.emit('avanzarTurno');
  });
}