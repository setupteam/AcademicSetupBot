import { Bot } from "../base/bot";
import { GroupEmitters } from "../base/group-emitters";
import { environment } from "../../environment/environment.";
import { ProjectEmitter } from "./emitters/project.emiter";

export class AcademicSetupBot extends Bot{
    private emitters:GroupEmitters;

    constructor(){
        super(environment.prefix, environment.token);
        this.emitters = new GroupEmitters();
        this.emitters.add(new ProjectEmitter());
    }

    init(){
        this.setResponse(["crear", "c"], message => this.emitters.create(message))
        this.setResponse(["ver", "v"], message => this.emitters.read(message))
        this.setResponse(["modificar", "m"], message => this.emitters.update(message))
        this.setResponse(["eliminar", "e"], message => this.emitters.delete(message))
    }
}
