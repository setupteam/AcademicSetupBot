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
        new Promise((resolve, reject)=>{
            let id = this.run(
            `INSERT INTO projects (name, creator, createdAt) VALUES 
                ('${p.name}', '${p.creator}', datetime('now'))`, 
            function (err){
                    if(err)
                     reject(err.message)

                    resolve(this.lastID)
            });
        }).then(id=>{
            this.run(`INSERT INTO members (project_id, member_id) VALUES 
            ('${id}', '${p.creator}')`)
        }).catch(err=>{
            console.error(err)
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

    deleteProject(name:String){
        new Promise((resolve, reject)=>{
            let id = this.run(
            `SELECT project_id FROM projects WHERE name = ${name}`, 
            function (err){
                    if(err)
                     reject(err.message)
            });
        }).then(id=>{
            this.run(`DELETE FROM members WHERE project_id = ${id}`)
            this.run(`DELETE FROM projects WHERE project_id = ${id}`)
        }).catch(err=>{
            console.error(err)
        })
    }
}