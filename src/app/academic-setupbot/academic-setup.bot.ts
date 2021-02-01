import { Bot } from "../base/bot";
import { GroupEmitters } from "../base/group-emitters";
import { environment } from "../../environment/environment";
import { ProjectEmitter } from "./emitters/project.emiter";

export class AcademicSetupBot extends Bot{
    private emitters:GroupEmitters;

    constructor(){
        super(environment.prefix, environment.token);
        this.emitters = new GroupEmitters();
        this.emitters.add(new ProjectEmitter());
    }

    init(){
        return [
            { names: ["crear", "c"], listener: message => this.emitters.create(message)},
            { names: ["ver", "v"], listener: message => this.emitters.read(message)},
            { names: ["modificar", "m"], listener: message => this.emitters.update(message)},
            { names: ["eliminar", "e"], listener: message => this.emitters.delete(message)}
        ]
    }
}
