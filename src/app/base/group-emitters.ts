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

        if(emitter)
            emitter.create(text => message.channel.send(text), ...args)
        else
            console.log("No hay entidades emisoras")
    }

    read(message:Message){
        let args =  Bot.getArguments(message.content);
        let emitter = this.findEmitter(args);
        
        if(emitter)
            emitter.read(text => message.channel.send(text),args.shift())
        else
            console.log("No hay entidades emisoras")
    }

    update(message:Message){
        let args =  Bot.getArguments(message.content);
        let emitter = this.findEmitter(args);

        if(emitter)
            emitter.update(text => message.channel.send(text), ...args)
        else
            console.log("No hay entidades emisoras")
    }

    delete(message:Message){
        let args =  Bot.getArguments(message.content);
        let emitter = this.findEmitter(args);
        
        if(emitter)
            emitter.delete(text => message.channel.send(text),args.shift())
        else
            console.log("No hay entidades emisoras")
    }
}