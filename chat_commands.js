module.exports = new Map();

module.exports.set("help", require("./commands/help.js"));
module.exports.set("shrug", require("./commands/shrug.js"));
module.exports.set("online", require("./commands/online.js"));
module.exports.set("color", require("./commands/color.js"));