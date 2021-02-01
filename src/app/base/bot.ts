import { Client, Message } from "discord.js";
import { EventEmitter } from 'events';
import { environment } from "../../environment/environment";

export abstract class Bot {
  private client: Client;
  private emitter:EventEmitter;

  constructor(prefix:string, token: string) {
    this.client = new Client();
    this.emitter = new EventEmitter();

    this.client.on('message', (message: Message) => {
      if (!message.content.startsWith(environment.prefix)) return;
      if (message.author.bot) return;
      this.emitter.emit(Bot.getArguments(message.content)[0], message);
    });

    this.init();
  }

  start(){
    return this.client.login(environment.token);
  }

  setResponse(events:string[], listener:(message:Message) => void){
    events.forEach(e=>{
      this.emitter.on(e, listener);
    })
  }

  static getArguments(message:string){
    return message.slice(environment.prefix.length).trim().split(/ +/g);
  }

  protected abstract init();
}