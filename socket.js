const app   = require("express")();
const http  = require("http").Server(app);
const io    = require("socket.io")(http);
const chat  = require("./datatypes.js");
const chat_commands = require("./chat_commands.js");
let Welcome = require("./join_messages.js");

let l = console.log;

let servers = new Map();
let users = new Map();

let DEFAULT_SERVER = new chat.SERVER("Default Server");
servers.set("DEFAULT_SERVER", DEFAULT_SERVER);

// API (Webapp)
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/views/index.html");
});

// Socket
io.on("connection", socket => {
    l("[LOG][socket.js] New connection. Client ID " + socket.client.id + `(${socket.handshake.address})`);

    // LOGIN
    socket.on("login", data => {
        l("[LOG][socket.js] New login attempt: " + data.name + " from " + socket.client.id);

        // VALID LOGIN
        if(data.name != "") {
            let user;
            if(users.size == 0) {
                user = new chat.USER(data.name, ['admin']);
                user.color = "#ff0000";
            }
            else user = new chat.USER(data.name);
            users.set(socket.client.id, user);
            socket.emit("login", {response: "granted", name: data.name, account: user, servers: JSON.stringify(Array.from(servers)), users: JSON.stringify(Array.from(users))});
            io.emit("broadcast", new chat.MESSAGE(Welcome[Math.round(Math.random() * (Welcome.length - 1))].replace("{{name}}", data.name)));
            l("[LOG][socket.js] Login attempt granted: " + data.name + " for " + socket.client.id);
        }
        // INVALID LOGIN
        else {
            socket.emit("login", {response: "rejected", name: data.name, reason: "cannot use an empty nickname"});
            l("[LOG][socket.js] Login attempt rejected: " + data.name + " for " + socket.client.id);
        }
    });

    // MESSAGE
    socket.on("message", (message, server, channel) => {
        if(users.has(socket.client.id)){
            if(message.content.length < 2000){
                if(message.content == " " || message.content.length < 1){
                    let msg = new chat.MESSAGE(message, users.get(socket.client.id), server, channel);
                    if(msg.content.startsWith("/")){
                        let invoke = msg.content.substr(1).split(" ")[0];
                        let args = msg.content.substr(1).split(" ").shift();
                        if(chat_commands.has(invoke)){
                            chat_commands.get(invoke).run(args, msg, socket, chat, chat_commands, io, users);
                            l(msg.author)
                        }
                    }
                    else{
                        servers.get(server).channels.filter(c => c.name == channel)[0].messages.push(msg);
                        io.emit("message", msg);
                    }
                }
                else socket.emit("report", "Your message is too short");
            }
            else socket.emit("report", "Your message is too long (> 2000 characters)");
        }
        else socket.emit("report", "You're not logged in");
    });

    // DISCONNECTION
    socket.on("disconnect", () => {
        l("[LOG][socket.js] Client disconnected. Client ID " + socket.client.id);
        if(users.has(socket.client.id)) {
            io.emit("broadcast", new chat.MESSAGE(users.get(socket.client.id).name + " has left."));
            users.delete(socket.client.id);
        }
    });
});

// HTTP Web
http.listen(1337, function(){
    console.log('[socket.js] listening on *:1337');
});