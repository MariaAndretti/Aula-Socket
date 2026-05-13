let wsServer;
let meuUsuari = "";

function register() {
    wsServer = new WebSocket('ws://127.0.0.1:3001');

    wsServer.onopen = (evt) => {
        console.log("Conectado ao servidor para registro!");
        
        wsServer.send(JSON.stringify({
            action: 'register',
            user: document.getElementById('register-user').value,
            password: document.getElementById('register-password').value,
            
        }));
    };

    wsServer.onmessage = (evt) => {
        let data = JSON.parse(evt.data);
        if (data.success) {
            alert("Usuário cadastrado com sucesso!");
        } else {
            alert("Erro: " + data.message);
        }
    };
}

function login() {
    wsServer = new WebSocket('ws://127.0.0.1:3001');
    wsServer.onopen = () => {
        wsServer.send(JSON.stringify({
            action: 'login',
            user: document.getElementById('login-user').value,
            password: document.getElementById('login-password').value
        }));
    };
}
