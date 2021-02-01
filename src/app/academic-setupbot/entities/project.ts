import { Alarm } from "./alarm";
import { Task } from "./task";

export class Project{
    name:string;
    description?:string;
    creator:string;
    createdAt:Date;
    category?:string;
    repository?:string;
    members?:string[]=[];
    tasks?: Task[]=[];
    alarms?:Alarm[]=[];
}