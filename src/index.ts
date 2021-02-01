import { AcademicSetupBot } from './app/academic-setupbot/academic-setup.bot';

let bot = new AcademicSetupBot();

bot.start().then(() => {
  console.log('Logged in!')
}).catch((error) => {
  console.log('Oh no! ', error)
});