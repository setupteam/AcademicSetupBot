import { EntityEmitter } from "../../base/entity.emitter";
import { database } from '../../constants';

export class ProjectEmitter extends EntityEmitter{

    constructor(){
        super("proyecto", "pj");

        this.onCreate((response, name)=>{
            database.saveProject({name}).then(res=>{
                response(res);
            })
        })

        this.onRead((response, name)=>{
            let p = database.getProject(name);
            response(`Mostrar proyecto "${JSON.stringify(p)}"`);
        })

        this.onUpdate((response, name)=>{
            response(`Modificar proyecto "${name}"`);
        })

        this.onDelete((response, name)=>{
            response(`Eliminar proyecto "${name}"`);
        })
    }

    create(response:(text:string)=>void, name:string){
        super.create(response, name)
    }

    read(response:(text:string)=>void, name:string){
        super.read(response, name)
    }

    update(response:(text:string)=>void, name:string){
        super.update(response, name)
    }

    delete(response:(text:string)=>void, name:string){
        super.delete(response, name)
    }
}