const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

// Inicializa la aplicación Express
const app = express();

// Crea un servidor HTTP
const servidor = http.createServer(app);

// Inicializa Socket.IO con el servidor HTTP
const io = socketIo(servidor);

// Middleware para servir archivos estáticos
app.use(express.static('public'));

// Rutas
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/turnos', (req, res) => {
  res.sendFile(__dirname + '/public/turnos.html');
});

// Lógica de Socket.IO
let turnoActual = 0;
let contador = 0;
let proximosTurnos = [];

// Escuchar conexión de nuevos clientes
io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado');

  // Enviar el turno actual y los próximos turnos al nuevo cliente
  socket.emit('actualizarTurno', { actual: turnoActual, proximos: proximosTurnos });

  // Escuchar cuando se solicita un nuevo turno
  socket.on('nuevoTurno', () => {
    proximosTurnos.push(contador + 1);

    // Emitir la actualización a todos los clientes
    io.emit('actualizarTurnos', { actual: turnoActual, proximos: proximosTurnos });
    contador++
  });

  // Escuchar cuando se solicita avanzar al siguiente turno
  socket.on('avanzarTurno', () => {
    if (proximosTurnos.length > 0) {
      turnoActual = proximosTurnos.shift();

      // Emitir la actualización a todos los clientes
      io.emit('actualizarTurnos', { actual: turnoActual, proximos: proximosTurnos });
    }
  });

  // Manejar desconexión del cliente
  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});

// Iniciar el servidor en el puerto 8080
servidor.listen(8080, () => {
  console.log('Servidor corriendo en el puerto 8080');
});