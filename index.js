require('dotenv').config();

const ws = require('ws');
let server = new ws.Server({ port: 3001 });
const User = require('./src/models/user');
const connection = require('./src/config/database');

let logedUsers = {};
let rooms = { "Geral": [] };
       
server.on('connection', (client) => {
    
    client.on('message', async (msg) => {
        let data = JSON.parse(msg);
        
        // Rota de Registro
        if (data.action == 'register') {
            let user = await User.create({ name: data.user });
            client.send(JSON.stringify({ success: true, msg: 'User registered!' }));
            
            // Rota de Login
        } else if (data.action == 'login') {
            let user = await User.findOne({ where: { login: data.login } });
            if (!user) {
                client.send(JSON.stringify({ success: false, msg: 'User not found!' }));
            } else {
                logedUsers[user.login] = client;
                client.logRef = user.login;
                client.send(JSON.stringify({ success: true, msg: 'Logged in!', user: user.login }));
            }
            
            // Rota de Criar Sala
        } else if (data.action == 'create_room') {
            if (!rooms[data.roomName]) {
                rooms[data.roomName] = [];
                client.send(JSON.stringify({ success: true, msg: `Sala ${data.roomName} criada!` }));
            } else {
                client.send(JSON.stringify({ success: false, msg: 'Sala já existe!' }));
            }
            
            // Rota de Entrar na Sala
        } else if (data.action == 'join_room') {
            if (rooms[data.roomName]) {
                rooms[data.roomName].push(client.logRef);
                client.currentRoom = data.roomName;
                client.send(JSON.stringify({ success: true, msg: `Entrou na sala ${data.roomName}` }));
            } else {
                client.send(JSON.stringify({ success: false, msg: 'Sala não encontrada!' }));
            }
            
            // Rota de Mensagem
        } else if (data.action == 'message_to') {
            const sender = client.logRef;
            const room = client.currentRoom;
            if (!sender) return;
            
            const payload = JSON.stringify({ from: sender, content: data.content, timestamp: new Date() });
            
            if (data.to && Array.isArray(data.to)) {
                data.to.forEach(recipientName => {
                    if (logedUsers[recipientName]) logedUsers[recipientName].send(payload);
                });
            } else if (room && rooms[room]) {
                rooms[room].forEach(username => {
                    if (logedUsers[username]) logedUsers[username].send(payload);
                });
            }
        }
    });
    
    client.on('close', () => {
        if (client.logRef) {
            delete logedUsers[client.logRef];
            if (client.currentRoom && rooms[client.currentRoom]) {
                rooms[client.currentRoom] = rooms[client.currentRoom].filter(u => u !== client.logRef);
            }
        }
    });
});

console.log("Tá dando certo parceiro");