import { stat } from "fs";

export class Task{
    name:string;
    description?:string;
    date?:Date;
    status?:string;
    member?:string;

    static getEmoji(status:string){
        switch(status){
            case 'todo':
                return ":red_circle:";
            case "inprogress":
                return ":arrow_forward:";

            case "test":
                return ":ballot_box_with_check:";

            case "finished":
                return ":white_check_mark:";

            default:
                return null;
        }
    }
}