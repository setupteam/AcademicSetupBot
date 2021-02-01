import { Project } from "../entities/project";
import { writeFile } from 'fs';

export class Database{
    private pathDatabase:string = "./database.json";

    saveProject(project:Project):Promise<string>{
        const d = require(this.pathDatabase);
    
        if(d.projects.find(pp => pp.name == project.name))
            return new Promise((resolve, reject)=>{
			    resolve(`El proyecto ${project.name} ya existe.`)
		    })

	    d.projects.push(project);

        return this.saveDatabase(d, 
            `Creado el proyecto: ${project.name} por ${project.creator}`,
            `No se ha podido crear el proyecto : "${project.name}"`
        )
    }

    getProject(name:string):Project{
        return require(this.pathDatabase).projects.find(pp => pp.name == name);
    }

    private saveDatabase(d, res:string, rej:string):Promise<string>{
        return new Promise<string>((resolve, reject)=>{
            writeFile(this.pathDatabase, JSON.stringify(d), err => {
                if (err) console.log(err.message);
                else resolve(res)
            });
        })
    }
}