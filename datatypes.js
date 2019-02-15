class USER {
    constructor(name, role){
        this.name = name;
        this.createdAt = new Date();
        this.roles = ['user'];
        if(role) this.roles.push(role); 
    }
}

class CHANNEL{
    constructor(name){
        this.name = name || "general";
        this.messages = [];
    }
}

class SERVER {
    constructor(name){
        this.name = name;
        this.createdAt = new Date();
        this.channels = [new CHANNEL(), new CHANNEL("test1")];
    }
}

class MESSAGE {
    constructor(content, author, server, channel){
        this.content = content || "New message";
        this.author = author || "Unknown";
        this.server = server || null;
        this.channel = channel || null;
        this.createdAt = new Date();
    }
}

module.exports = {
    USER, CHANNEL, SERVER, MESSAGE
};