import { Message } from "discord.js";
import { Bot } from "./bot";
import { EntityEmitter } from "./entity.emitter";

export class GroupEmitters{
    emitters:EntityEmitter[];

    constructor(){
        this.emitters = [];
    }

    add(emitter:EntityEmitter){
        this.emitters.push(emitter);
    }

    private findEmitter(args:string[]){
        args.shift();
        return this.emitters.find(ee => ee.names.includes(args.shift()));
    }

    create(message:Message){
        let args =  Bot.getArguments(message.content);
        let emitter = this.findEmitter(args);
        args.unshift(message.author.username)

        if(emitter)
            emitter.create(res => message.reply(res), ...args)
        else
            console.log("No hay entidades emisoras")
    }

    read(message:Message){
        let args =  Bot.getArguments(message.content);
        let emitter = this.findEmitter(args);
        
        if(emitter)
            emitter.read(res => message.reply(res),args.shift())
        else
            console.log("No hay entidades emisoras")
    }

    update(message:Message){
        let args =  Bot.getArguments(message.content);
        let emitter = this.findEmitter(args);

        if(emitter)
            emitter.update(res => message.reply(res), ...args)
        else
            console.log("No hay entidades emisoras")
    }

    delete(message:Message){
        let args =  Bot.getArguments(message.content);
        let emitter = this.findEmitter(args);
        
        if(emitter)
            emitter.delete(res => message.reply(res),message.author.username, args.shift())
        else
            console.log("No hay entidades emisoras")
    }
}