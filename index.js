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

	switch(command){
		case "crear":
			switch(args.shift().toLowerCase()){
				case "proyecto":
					if(args.length > 0){
						message.channel.send(createProject(args.join(" ")));
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
			switch(args.shift().toLowerCase()){
				case "proyecto":
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
	}
})

client.login(config.token);

function createProject(name){
	const file = require('./persistence.json');
    
	/*file.key = "new value";
	    
	fs.writeFile(fileName, JSON.stringify(file), function writeJSON(err) {
	  if (err) return console.log(err);
	  console.log(JSON.stringify(file));
	  console.log('writing to ' + fileName);
	});*/

	return `No se ha podido crear el proyecto : "${name}"`;
}

function consultProject(name){
	const database = require('./persistence.json');
	let project = database.projects.find(pp => pp.name == name);
	if(project){
		return JSON.stringify(project);
	}else{
		return `No existe el proyecto: "${name}"`;
	}

	return `No se ha podido consultar el proyecto : "${name}"`;
}

class Project{
	id;
	name;
	team;
	tasks;
	creator;
	subject;
	createdAt;
}

class Team{
	id;
	people;
}

class Subject{
	id;
	name;
}

class Task{
	name;
	description;
	status;
}