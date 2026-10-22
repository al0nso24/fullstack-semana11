//Devuelve (hace eco) cada mensaje que recibe del navegador.
//Importar los módulos que vamos a usar
const http = require('http'); //servidor web de Node
const fs = require('fs'); //leer archivos del disco
const path = require('path'); //armar rutas de archivos
const { WebSocketServer } = require('ws'); //librería de conexiones WebSocket

//Puerto libre automáticamente para evitar conflictos con otros procesos.
const PUERTO = 0;

//Crear el servidor HTTP que entrega la página index.html
const servidor = http.createServer((req, res) => {
    const html = fs.readFileSync(path.join(__dirname, 'index.html'));
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(html);
});

//Montar el servidor WebSocket sobre el servidor HTTP
const wss = new WebSocketServer({ server: servidor });

//Atender cada conexión nueva
wss.on('connection', (socket) => {
    console.log('✅ Cliente conectado');
    socket.send('Bienvenido al servidor ECO ');

    //Responder cada mensaje con un eco
    socket.on('message', (datos) => {
        const texto = datos.toString();
        console.log(' Recibido:', texto);
        socket.send('ECO: ' + texto);
    });

    //Detectar cuando el cliente se desconecta
    socket.on('close', () => console.log('❌ Cliente desconectado'));
});

//Encender el servidor
servidor.listen(PUERTO, () => {
    console.log(` Servidor ECO en http://localhost:${servidor.address().port}`);
})