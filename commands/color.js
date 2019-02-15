module.exports.run = (args, msg, socket, chat, commands, io, users) => {
    if(args[0].match(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)){
        msg.author.color = args[0];
        socket.emit("broadcast", new chat.MESSAGE("Your color is now"));
    }
};

module.exports.info = {
    name: "online"
};