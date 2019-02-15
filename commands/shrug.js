module.exports.run = (args, msg, socket, chat, commands, io) => {
    msg.content = msg.content.replace("/shrug", "") + " ¯\\_(ツ)_/¯";
    io.emit("message", msg);
};

module.exports.info = {
    name: "shrug"
};