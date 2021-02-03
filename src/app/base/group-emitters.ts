import { Message } from "discord.js";
import { EntityEmitter } from "./entity.emitter";

export class GroupEmitters{
    prefix:string;
    emitters:EntityEmitter[];

    constructor(prefix:string){
        this.prefix = prefix;
        this.emitters = [];
    }

    getArguments(message) {
        return message.slice(this.prefix.length).trim().split(/ +/g);
    }

    add(emitter:EntityEmitter){
        this.emitters.push(emitter);
    }

    private findEmitter(args:string[]){
        args.shift();
        return this.emitters.find(ee => ee.names.includes(args.shift()));
    }

    create(message:Message){
        let args =  this.getArguments(message.content);
        let emitter = this.findEmitter(args);
        args.unshift(message.author.id)

        if(emitter)
            emitter.create(res => message.reply(res), ...args)
        else
            console.log("No hay entidades emisoras")
    }

    read(message:Message){
        let args =  this.getArguments(message.content);
        let emitter = this.findEmitter(args);
        
        if(emitter)
            emitter.read(res => message.reply(res),args.shift(), message.author.id)
        else
            console.log("No hay entidades emisoras")
    }

    update(message:Message){
        let args =  this.getArguments(message.content);
        let emitter = this.findEmitter(args);

        if(emitter)
            emitter.update(res => message.reply(res), ...args)
        else
            console.log("No hay entidades emisoras")
    }

    delete(message:Message){
        let args =  this.getArguments(message.content);
        let emitter = this.findEmitter(args);
        
        if(emitter)
            emitter.delete(res => message.reply(res),message.author.username, args.shift())
        else
            console.log("No hay entidades emisoras")
    }
}