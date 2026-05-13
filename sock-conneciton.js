let server = null


function register() {
    server = new WebSocket('ws://127.0.0.1:3001');
    
    server.onopen = (evt) => {
        connect.classList.add("hidden");
        disconnect.classList.remove('hidden');
    }
    
    server.onclose = () => {
        connect.classList.remove("hidden");
        disconnect.classList.add('hidden');
        
    }
    server.onmessage = (sock) => {
        let data = JSON.parse(sock.data)
        
        
        let sender = user.value
        let send_to = receiver.value
        
        console.log(user.value);
        console.log(receiver.value);
        console.log(message.value);
        
        if(data.action== "who_is") {
            let json = {
                user: user.value,
                action:'confirm_connection',
            };
            server.send(JSON.stringify(json))
        } else if (data.action == 'message') {
            chatBox.innerHTML = `<div class="received"><small><label>${data.sender}</small></label><p>${data.message}</p></div>`
        }
    };
}


function serverDisconnect(){
    if (server != null) {
        
        server.send(JSON.stringify({
            action: 'disconnect',
            user: user.value,
        })
    );
    
    server.close();
}
}
function serverSend() {
    if (server != null) {
        let obj= {
            action: 'message',
            sender:user.value,
            receiver: receiver.value,
            message: message.value
            
        };
        
        server.send(JSON.stringify(obj));
    }
}