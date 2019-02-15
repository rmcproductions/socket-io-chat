const app   = require("express")();
const http  = require("http").Server(app);
const io    = require("socket.io")(http);
const chat  = require("./datatypes.js");
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
    l("[LOG][socket.js] New connection. Client ID " + socket.client.id);

    // LOGIN
    socket.on("login", data => {
        l("[LOG][socket.js] New login attempt: " + data.name + " from " + socket.client.id);

        // VALID LOGIN
        if(data.name != "") {
            let user;
            if(users.size == 0) user = new chat.USER(data.name, ['admin']);
            else user = new chat.USER(data.name);
            users.set(socket.client.id, user);
            socket.emit("login", {response: "granted", name: data.name, account: user, servers: JSON.stringify(Array.from(servers)), users: Object.values(users)});
            io.emit("broadcast", new chat.MESSAGE(Welcome[Math.round(Math.random() * Welcome.length - 1)].replace("{{name}}", data.name)));
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
            let msg = new chat.MESSAGE(message, users.get(socket.client.id), server, channel);
            if(msg.content.startsWith("/")){
                socket.emit("broadcast", new chat.MESSAGE("your roles are " + users.get(socket.client.id).roles.join(", ")));
            }
            else{
                servers.get(server).channels.filter(c => c.name == channel)[0].messages.push(msg);
                io.emit("message", msg);
            }
        }
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