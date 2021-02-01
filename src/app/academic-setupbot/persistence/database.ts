import { Project } from "../entities/project";
import { writeFile, readFileSync } from 'fs';

export class Database{
    private pathDatabase:string = "./database.json";

    saveProject(project:Project):Promise<string>{
        const d = JSON.parse(readFileSync(this.pathDatabase, 'utf-8'))
    
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
        return JSON.parse(readFileSync(this.pathDatabase, 'utf-8')).projects.find(pp => pp.name == name);
    }

    
    updateProject(project: Project) {
        const d:{ projects:Project[] } = JSON.parse(readFileSync(this.pathDatabase, 'utf-8'))
    
        d.projects[d.projects.indexOf(d.projects.find(pp => pp.name == project.name))]= project;

        return this.saveDatabase(d, 
            `Actualizado el proyecto: ${project.name}`,
            `No se ha podido crear el proyecto : "${project.name}"`
        )
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