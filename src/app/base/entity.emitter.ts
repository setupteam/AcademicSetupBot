import { EventEmitter } from 'events';

export abstract class EntityEmitter extends EventEmitter {
    names:string[];
    
    protected constructor(...names:string[]){
        super();
        this.names = names;
    }

    protected onCreate(listener:(response:(text:string)=>void, ...args:string[])=>void){
        this.on("create", listener)
    }

    protected onRead(listener:(response:(text:string)=>void, ...args:string[])=>void){
        this.on("read", listener)
    }

    protected onUpdate(listener:(response:(text:string)=>void, ...args:string[])=>void){
        this.on("update", listener)
    }

    protected onDelete(listener:(response:(text:string)=>void, ...args:string[])=>void){
        this.on("delete", listener)
    }

    create(response:(text:string)=>void, ...args:string[]){
        this.emit("create", response, ...args);
    }

    read(response:(text:string)=>void, name:string){
        this.emit("read", response, name);
    }

    update(response:(text:string)=>void, ...args:string[]){
        this.emit("update", response, ...args);
    }

    delete(response:(text:string)=>void, name:string){
        this.emit("delete", response, name);
    }
}