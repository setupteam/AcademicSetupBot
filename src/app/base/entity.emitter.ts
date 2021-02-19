import { EventEmitter } from 'events';

export abstract class EntityEmitter extends EventEmitter {
    names:string[];
    
    protected constructor(...names:string[]){
        super();
        this.names = names;
    }

    protected onCreate(listener:(response:(res:any)=>void, ...args:string[])=>void){
        this.on("create", listener)
    }

    protected onRead(listener:(response:(res:any)=>void, ...args:string[])=>void){
        this.on("read", listener)
    }

    protected onUpdate(listener:(response:(res:any)=>void, ...args:string[])=>void){
        this.on("update", listener)
    }

    protected onDelete(listener:(response:(res:any)=>void, ...args:string[])=>void){
        this.on("delete", listener)
    }

    protected onAll(listener:(response:(res:any)=>void, ...args:string[])=>void){
        this.on("all", listener)
    }

    create(response:(res:any)=>void, ...args:string[]){
        this.emit("create", response, ...args);
    }

    read(response:(res:any)=>void, name:string, user:string){
        this.emit("read", response, name, user);
    }

    update(response:(res:any)=>void, ...args:string[]){
        this.emit("update", response, ...args);
    }

    delete(response:(res:any)=>void,creator:string, name:string){
        this.emit("delete", response,creator, name);
    }

    all(response:(res:any)=>void, user:string){
        this.emit("all", response, user);
    }
}