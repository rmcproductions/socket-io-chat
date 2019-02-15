module.exports.run = (args, msg, socket, chat, commands, io, users) => {
    let names = [];
    commands.forEach(c => {
        names.push(c.info.name);
    });
    socket.emit("broadcast", new chat.MESSAGE("LIST OF AVAILABLE COMMANDS:"));
    socket.emit("broadcast", new chat.MESSAGE(names.join(", ")));
};

module.exports.info = {
    name: "help"
};