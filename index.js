const ws = require('ws');

let server = new ws.Server({ port: 3001 });

let users = {}

server.on("connection", (client) => {
    client.on("close", () => { });
    client.on("message", (message) => {
        console.log (message.toString())
        let msgObject = JSON.parse(message.toString())
        
        if(msgObject.action == 'confirm_connection') {
            users[msgObject.user] = client
            
        } else if(msgObject.action == 'disconnet') {
            delete users[msgObject.user];
            
        } else if (msgObject.action == 'message') {
            const { sender, receiver, message } =msgObject;
            
            if(users[receiver] !== undefined){
                users[receiver].send(JSON.stringify({
                    
                    action: "message",
                    sender: sender,
                    message: message,
                }))
            }
        }
    });
    
    client.send(JSON.stringify({ connection: true, action: 'who_is'}))
    console.log("connectado!");
});