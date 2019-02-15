module.exports.run = (args, msg, socket, chat, commands, io, users) => {
    socket.emit("broadcast", new chat.MESSAGE("Online users: " + Array.from(users).map(u => u[1].name)));
};

module.exports.info = {
    name: "online"
};