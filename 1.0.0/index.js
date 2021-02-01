const Discord = require('discord.js')
const client = new Discord.Client();
const config = require("./config.json");
const fs = require('fs');
const prefix = "st ";

client.on("ready", () => {
	console.log("Conectado.");
});

client.on("message", message=>{
	if (!message.content.startsWith(prefix)) return;
	if (message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();
	let entity;
	console.log(message.content)

	switch(command){
		case "crear":
		case "c":
			switch(args.shift().toLowerCase()){
				case "proyecto":
				case "pj":
					if(args.length > 0){
						createProject(args.join(" "),message.author.username).then(res=>{
							message.channel.send(res);
						})
						
					}else{
						message.channel.send("Por favor, digita el nombre del proyecto. st crear proyecto nombre");
					}
				break;
				default:
					message.channel.send("Esa entidad no existe. Prueba con proyecto, equipo, tarea o materia");
				break;
			}
			break;
		case "mostrar":
		case "m":
			switch(args.shift().toLowerCase()){
				case "proyecto":
				case "pj":
					if(args.length > 0){
						message.channel.send(consultProject(args.join(" ")));
					}else{
						message.channel.send("Por favor, digita el nombre del proyecto. st mostrar proyecto nombre");
					}
				break;
				default:
					message.channel.send("Esa entidad no existe. Prueba con proyecto, equipo, tarea o materia");
				break;
			}
			break;
		case "actualizar":
		case "a":
			break;
		case "eliminar":
		case "e":
			switch(args.shift().toLowerCase()){
				case "proyecto":
				case "pj":
					if(args.length > 0){
						removeProject(args.join(" ")).then(res=>{
							message.channel.send(res);
						})
						
					}else{
						message.channel.send("Por favor, digita el nombre del proyecto. st crear proyecto nombre");
					}
				break;
				default:
					message.channel.send("Esa entidad no existe. Prueba con proyecto, equipo, tarea o materia");
				break;
			}
			break;
		case "proyectos":
		case "pjs":
			message.channel.send(consultProjects());
			break;
	}
})

client.login(config.token);

function createProject(name, creator){
	const d = require('./persistence.json');
	
	if(d.projects.find(pp => pp.name == name))
		return new Promise((resolve, reject)=>{
			resolve(`El proyecto ${name} ya existe.`)
		})

	d.projects.push({name, creator, date: new Date()});

	return saveDatabase(d, 
		`Creado el proyecto: ${name} por ${creator}`,
		`No se ha podido crear el proyecto : "${name}"`
	)
}

function consultProject(name){
	const d = require('./persistence.json');
	let project = d.projects.find(pp => pp.name == name);
	if(project){
		return JSON.stringify(project);
	}else{
		return `No existe el proyecto: "${name}"`;
	}

	return `No se ha podido consultar el proyecto : "${name}"`;
}

function consultProjects(){
	const d = require('./persistence.json');
	return JSON.stringify(d.projects);
}

function removeProject(name){
	const d = require('./persistence.json');
	let pj = d.projects.find(pp => pp.name == name);
	
	if(pj) d.projects.splice(d.projects.indexOf(pj), 1);
	else return new Promise((resolve, reject)=>{
			resolve(`El proyecto ${name} no existe.`)
	})
	return saveDatabase(d, 
		`Eliminado el proyecto: ${pj.name} de ${pj.creator}`,
		`No se ha podido eliminar el proyecto : "${pj.name}"`
	)
}

function saveDatabase(d, res, rej){
	return new Promise((resolve, reject)=>{
		fs.writeFile('./persistence.json', JSON.stringify(d), (err) => {
			if (err) 
				reject(rej);
			
			resolve(res)
		});
	})
}