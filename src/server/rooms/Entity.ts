import { Schema, type } from "@colyseus/schema";
import { Football } from "./Football";
import {Tracker } from "./Tracker";
import { arrayCheck } from "@colyseus/schema/lib/encoding/decode";
export class Entity extends Schema {
    @type("float64") x: number;
    @type("float64") y: number;
    @type("float32") radius: number;

    dead: boolean = false;
    angle: number = 0;
    speed = 0;
    following = '';
team = 0;
defaultEnemy = '';

    constructor(x: number, y: number, radius: number, following: string, team: number, defaultEnemy: string, routes?, finishedRoute?: boolean) {
        super();
 
        this.x = x; 
        this.y = y;
        this.radius = radius;
        this.following = following;
        this.team= team;
        this.defaultEnemy = defaultEnemy;
    } 

    static distance(a: Entity, b: Entity) {
        return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
    }

    entityFollow(tracking: Tracker, tracked: Tracker, speed: number){
        var angle = Math.atan2(tracking.y - tracked.y, tracking.x - tracked.x);
        var resultTracker: Tracker = {x: tracking.x-=(Math.cos(angle)) * speed, y: tracking.y-=(Math.sin(angle))*speed}
        const trackerUpdated: Tracker={x: this.x, y: this.y}; 
        
   return  tracking; 
}

    checkRouteArrived(reciever: Tracker, destination: Tracker){
        if(Math.sqrt(Math.pow(reciever.x - destination.x, 2) + Math.pow(reciever.y - destination.y, 2))<20){return true;}else{return false;}
    }
   

   




}