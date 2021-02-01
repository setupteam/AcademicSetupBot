import { EntityEmitter } from "../../base/entity.emitter";
import { database } from '../../constants';

export class ProjectEmitter extends EntityEmitter{

    constructor(){
        super("proyecto", "pj");

        this.onCreate((response, creator, name, category)=>{
            database.saveProject({creator,name, createdAt:new Date(), category}).then(res=>{
                response(res);
            })
        })

        this.onRead((response, name)=>{
            let p = database.getProject(name);
            if(p)
                response({embed:{
                    color: 3447003,
                    title: p.name,
                    description: p.description,
                    fields:[
                        {
                            name:"Creador",
                            value: p.creator
                        },
                        {
                            name:"Creación",
                            value: p.createdAt
                        }
                    ]
                }});
            else
                response(`No existe el proyecto "${name}"`);
        })

        this.onUpdate((response, name, context, entity, eName, date, description)=>{
            let p = database.getProject(name);
            let ok:boolean = true;
            
            switch(context){
                case 'agregar':
                case 'a':
                    switch(entity){
                        case 'miembro':
                        case'm':
                            if(eName)
                                p.members.push(eName)
                            else{
                                ok = false;
                                response("Debes escribir la referencia de alguien");
                            }
                            break;
                        default:
                            ok = false;
                            response("Debes escribir una entidad válida");
                            break;
                    }
                    break;
                    default:
                        ok = false;
                        response("Debes escribir una acción válida");
                        break;
            }

            if(ok)
                database.updateProject(p).then(res=>{
                    response(res);
                })
        })

        this.onDelete((response, creator, name)=>{
            response(`Eliminar proyecto "${name}"`);
        })
    }

    create(response:(text:string)=>void,creator:string,  name:string, description, category){
        super.create(response, creator, name, description, category)
    }

    read(response:(text:string)=>void, name:string){
        super.read(response, name)
    }

    update(response:(text:string)=>void, name:string, context:string, entity:string, eName:string, date:string, description:string){
        super.update(response, name, context, entity, eName, date, description)
    }
}