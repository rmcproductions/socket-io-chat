const app   = require("express")();
const http  = require("http").Server(app);
const io    = require("socket.io")(http);
const chat  = require("./datatypes.js");

let l = console.log;

let servers = new Map();
let users = new Map();

let DEFAULT_SERVER = new chat.SERVER("Default Server");
servers.set("DEFAULT_SERVER", DEFAULT_SERVER);
l(DEFAULT_SERVER)

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
            let user = new chat.USER(data.name);
            users.set(socket.client.id, user);
            socket.emit("login", {response: "granted", name: data.name, account: user, servers});
            l("[LOG][socket.js] Login attempt granted: " + data.name + " for " + socket.client.id);
        }
        // INVALID LOGIN
        else {
            socket.emit("login", {response: "rejected", name: data.name, reason: "cannot use an empty nickname"});
            l("[LOG][socket.js] Login attempt rejected: " + data.name + " for " + socket.client.id);
        }
    });

    // DISCONNECTION
    socket.on("disconnect", () => {
        l("[LOG][socket.js] Client disconnected. Client ID " + socket.client.id);
        if(users.has(socket.client.id)) users.delete(socket.client.id);
    });
});

// HTTP Web
http.listen(1337, function(){
    console.log('[socket.js] listening on *:1337');
});