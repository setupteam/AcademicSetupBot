import { MessageEmbed } from "discord.js";
import { EntityEmitter } from "../../base/entity.emitter";
import { database } from '../../constants';
import { Task } from "../entities/task";

export class ProjectEmitter extends EntityEmitter{

    constructor(){
        super("proyecto", "pj");

        this.onCreate((response, creator, name, category)=>{
            database.saveProject({creator,name, createdAt:new Date(), category, members:[creator]}).then(res=>{
                response(res);
            })
        })

        this.onRead((response, name, user)=>{
            let p = database.getProject(name);
            if(p){
                let mm = p.members;
                
                if(mm.includes(user)){
                    for(let i =0;i < mm.length;i++)
                        mm[i] = `<@${mm[i]}>`;
    
                    let embed = new MessageEmbed()
                    .setTitle(p.name)
                    .setColor(0x00AE86)
                    .addField("Miembros", mm.join(", "))
                    .setTimestamp(p.createdAt)
                    //.setFooter(`<@!${p.creator}>`)
    
                    embed.description = p.description;
    
                    if(p.tasks && p.tasks.length > 0){
                        let tks = "";
    
                        p.tasks.forEach(t => {
                            tks+='**' + t.name + '** ';
                            
                            if(t.status)
                                tks+= Task.getEmoji(t.status);
                            
                            tks+= '\n';
    
                            if(t.description)
                                tks+= t.description + '\n';
    
                            if(t.date)
                                tks+= t.date + '\n';
    
                            tks+= '\n';
                        });
    
                        embed.fields.push({name:"Tareas", value:tks, inline:false});
                    }
    
                    response({embed});
                }else{
                    response({embed:{description:`Lo siento <@${user}>, no perteneces a este proyecto`}});
                }
                
            } else
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
                            if(eName){
                                let id=eName.slice(2, eName.length - 1);

                                if(p.members.includes(id))
                                    p.members.push(id)
                                else{
                                    ok = false;
                                    response(`${eName} ya está en el proyecto`);
                                }
                            } else{
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

    read(response:(text:string)=>void, name:string, user:string){
        super.read(response, name, user)
    }

    update(response:(text:string)=>void, name:string, context:string, entity:string, eName:string, date:string, description:string){
        super.update(response, name, context, entity, eName, date, description)
    }
}