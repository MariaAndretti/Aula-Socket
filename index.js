require('dotenv').config()

const database = require('./src/config/database')

database.authenticate();

const ws = require('ws')

let server = new ws.Server({ port: 3001 })

const User = require('./src/models.user')

server.on('connection', (client) => {
    
    client.on('message', (msg) => {
        let data = JSON.parse(msg)
        
        if (data.action == 'register') {
            let user = await User.create({ login: data.login })
            await user.save()
            
            client.send(JSON.stringify({ sucess: true, msg: 'User registred!'}));
        } else if (data.action == 'message_to') {
            
        } else if (data.action == 'login') {
            let user = await User.findOne({ Login})
            if (user == null) {
                client.send(JSON.stringify({sucess: false, msg: 'User not found'}))
            } else {
                logedUsers[user.login] = client;
                client['logRef'] = user.login;
            }
        }
    })
})