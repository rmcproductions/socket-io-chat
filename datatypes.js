class USER {
    constructor(name){
        this.name = name;
        this.createdAt = new Date();
    }
};

class CHANNEL{
    constructor(name){
        this.name = "general" || name;
        this.messages = [];
    }
}

class SERVER {
    constructor(name){
        this.name = name;
        this.createdAt = new Date();
        this.channels = new Map();
        this.channels.set("general", new CHANNEL())
        this.channels.set("test1", new CHANNEL("test1"))
    }
};

class MESSAGE {
    constructor(content, author){
        this.content = content;
        this.author = author;
        this.createdAt = new Date();
    }
}

module.exports = {
    USER, CHANNEL, SERVER, MESSAGE
}