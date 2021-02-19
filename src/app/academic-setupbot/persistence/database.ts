import { Project } from "../entities/project";
import { writeFile, readFileSync } from 'fs';
const sqlite3 = require('sqlite3').verbose();
const Database = sqlite3.Database;

export class BotDatabase extends Database{
    constructor(){
        super('./db/academic.db', err=>{
            if(err)
                console.log(err.message);
            else
                console.log("Connected DB")
        })

        let drop = false;

        if(drop){
            this.run("DROP TABLE IF EXISTS projects")
            this.run("DROP TABLE IF EXISTS members")
        }else{
            this.run(`CREATE TABLE IF NOT EXISTS projects(
                name text not null unique, 
                creator text not null, 
                createdAt text not null, 
                description text, 
                category text, 
                repository text)`)
    
            this.run(`CREATE TABLE IF NOT EXISTS members(
                project_id integer not null, 
                member_id text not null)`)
        }
    }

    saveProject(p:Project){
        return new Promise((resolve, reject)=>{
            this.run(
            `INSERT INTO projects (name, creator, createdAt) VALUES 
            ('${p.name}', '${p.creator}', datetime('now'))`, 
            function (err){
                if(err){
                    if(err.message.includes("UNIQUE constraint failed: projects.name"))
                        reject("Ese nombre de proyecto ya existe")
                    else
                        console.error(err);
                }

                resolve(this.lastID)
            });
        }).then(id=>{
            this.run(`INSERT INTO members (project_id, member_id) VALUES 
            ('${id}', '${p.creator}')`)
            return "Guardado correcto"
        }).catch(err=>{
            if(err)
                return err;
        })
    }

    getProject(name:string):Promise<Project>{
        return new Promise((resolve, reject)=>{
            this.get(`SELECT rowid, name, creator, createdAt, description, category, repository FROM projects WHERE name = ?`, [name], (err, project)=>{
                if (err) 
                    reject("Hubo un error en la lectura, intenta de nuevo");
                else if(!project)
                    reject(`No existe el proyecto ${name}`);
                else{
                    new Promise((resolve, reject)=>{
                        console.log(project);
                        this.all(`SELECT member_id FROM members WHERE project_id = ?`,[project.rowid], (err, rows)=>{
                            if(err)
                                reject("Hubo un error en la lectura, intenta de nuevo");
                            else{
                                resolve(rows)
                            }
                        })
                    }).then((membersO:{member_id}[])=>{
                        project.members =[];
                        membersO.forEach(mo=>{
                            project.members.push(mo.member_id)
                        })

                        resolve(project)
                    }).catch(err=>{
                        reject(err);
                    })
                }
            })
        });
    }

    deleteProject(name:string, creator:string){
        return new Promise((resolve, reject)=>{
            this.get("SELECT rowid FROM projects WHERE name = ? AND creator = ?",[name, creator], (err, project)=>{

                if(err){
                    console.log("A", err)
                    if(err.message.includes("no such column"))
                        reject("No existe ese proyecto");
                }

                if(project)
                    resolve(project.rowid);
                else
                    reject("No existe ese proyecto o no te pertenece.")
            });
        }).then(id =>{
            this.run(`DELETE FROM members WHERE project_id = ?`, [id],(err)=>{
                if(err) return "No se pudo eliminar el proyecto";
            })

            this.run(`DELETE FROM projects WHERE rowid = ?`, [id], (err)=>{
                if(err) return "No se pudieron eliminar los miembros del proyecto";
            })

            return `Eliminado exitosamente ${name}`;
        }).catch((err:string)=>{
            return err;
        })
    }
}