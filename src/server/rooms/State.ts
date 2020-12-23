import nanoid from "nanoid";
import { Schema, type, MapSchema } from "@colyseus/schema";
import { Entity } from "./Entity";
import { Player } from "./Player";
import { Football } from "./Football";
import { print } from "redis";
import {Tracker} from "./Tracker";
import { ArenaRoom } from "./ArenaRoom";
import routes from "@colyseus/social/express";
//import { Enemy } from "./Enemy";


const WORLD_SIZE = 6000;
export const DEFAULT_PLAYER_RADIUS = 30;

export class State extends Schema {
    lineOfScrimmage = 3800;
    //playerId;
    timer = 0;
  width = WORLD_SIZE;
  height = WORLD_SIZE;
 sessionIDs = [5];
 gameState = 0;
ballPosession = false;
throwLocation;
ballThrown = false;
  @type({ map: Entity })
  entities = new MapSchema<Entity>();
 @type(Football )
football = new Football(3200, 3950, 10);
playerMovement = ['w', 'a', 's', 'd'];
  playerIDs = ['', ''];
  
  

spacePressed(){ //0 is in between, 1 is set up, 2 is playing
this.gameState = this.gameState+1;
    if(this.gameState == 1){
     this.resetPlayers();
} else if(this.gameState == 3){
    this.gameState = 0;
}
}
throwBall(){
    console.log("ball thrown");
    //this.ballPosession = 25566;
    this.ballPosession = true;
} 



  createOffencePlayer (sessionId: string) {
     this.playerIDs[0] = sessionId;
    this.entities[sessionId] = new Player(3160, 3950); 
/*
const food0 = new Entity(2600, 3750, 45, '', 1, 'enemy');
this.sessionIDs[0] = nanoid(8);
this.entities[this.sessionIDs[0]] = food0;

const food1 = new Entity(3160, 3750, 45, '', 1, 'enemy');
this.sessionIDs[1] = nanoid(8);
this.entities[this.sessionIDs[1]] = food1;

const food2 = new Entity(3720, 3750, 45, '',1 ,'ememy');
this.sessionIDs[2] = nanoid(8);
this.entities[this.sessionIDs[2]] = food2;
*/
const food3 = new Entity(2600, 3850, 50, '',0, 'tm', null, false);
this.sessionIDs[3] = nanoid(8);
this.entities[this.sessionIDs[3]] = food3;

const food4 = new Entity(3160, 3850, 50, '',0, 'tm', null, false);
this.sessionIDs[4] = nanoid(8);
this.entities[this.sessionIDs[4]] = food4;

const food5 = new Entity(3720, 3850, 50, '', 0, 'tm', null, false);
this.sessionIDs[5] = nanoid(8);
this.entities[this.sessionIDs[5]] = food5;

const football = new Football(3200, 3950, 15);


/*for (let i = 0; i < 3; i++){
this.entities[this.sessionIDs[i]].defaultEnemy = this.sessionIDs[i+3];
} 
for (let i = 3; i < 6; i++){
this.entities[this.sessionIDs[i]].defaultEnemy = this.sessionIDs[i-3];
} */
this.entities[this.sessionIDs[3]].routes = [1, {x: 0, y: 200}, {x: 1000, y: 800}];
this.entities[this.sessionIDs[5]].routes = [1, {x: 0, y: 200}, {x: -1000, y: 800}];

} 
createDefencePlayer (sessionId: string) {
     this.playerIDs[1] = sessionId;
    this.entities[sessionId] = new Player(3160, 3500); 
    const food0 = new Entity(2600, 3750, 45, '', 1, 'enemy');
this.sessionIDs[0] = nanoid(8);
this.entities[this.sessionIDs[0]] = food0;

const food1 = new Entity(3160, 3750, 45, '', 1, 'enemy');
this.sessionIDs[1] = nanoid(8);
this.entities[this.sessionIDs[1]] = food1;

const food2 = new Entity(3720, 3750, 45, '',1 ,'ememy');
this.sessionIDs[2] = nanoid(8);
this.entities[this.sessionIDs[2]] = food2;

for (let i = 0; i < 3; i++){
this.entities[this.sessionIDs[i]].defaultEnemy = this.sessionIDs[i+3];
}
for (let i = 3; i < 6; i++){
this.entities[this.sessionIDs[i]].defaultEnemy = this.sessionIDs[i-3];
} 
    }
  update() {
       
      this.timer = this.timer+1;
    const deadEntities: string[] = [];
    for (const sessionId in this.entities) {
      const entity = this.entities[sessionId];       

      if (entity.dead) {
        deadEntities.push(sessionId);
        continue;
      }

    //this for loop has the collide tests
        for (const collideSessionId in this.entities) {
          const collideTestEntity = this.entities[collideSessionId]

          if ( 
            //entity.radius < collideTestEntity.radius 
            entity.team > collideTestEntity.team &&
            entity.team !=3 &&
            Entity.distance(entity, collideTestEntity) <= 50
            
            //    Entity.distance(entity, collideTestEntity) <= entity.radius - (collideTestEntity.radius / 2)
          ) { 
            
            entity.y = entity.y-7;
            if(this.football.footballFollow == sessionId){
                this.spacePressed();
                this.lineOfScrimmage = this.entities[sessionId].y;
            }

          }
 
          if(this.ballPosession == false){this.proximitySearchMode(entity, sessionId);} else if(this.ballThrown == false){
            
        this.throwLocation = {x: this.entities[this.playerIDs[0]].x- (Math.cos(this.entities[this.playerIDs[0]].angle)*1500), y:this.entities[this.playerIDs[0]].y- (Math.sin(this.entities[this.playerIDs[0]].angle)*1500)};
            this.ballInAirMode(this.throwLocation);
              this.ballThrown = true;
          } else{this.ballInAirMode(this.throwLocation);
            
                
                if(Football.distanceF(this.football.x, this.football.y, this.entities[sessionId].x, this.entities[sessionId].y)<80 && sessionId != this.playerIDs[0]){
                    this.football.footballFollow =sessionId;
                    this.ballThrown= false; 
                    this.ballPosession = false;
                }
            
          } 

        }
      
if(this.gameState == 2){

   for (let i = 0; i < 3; i++) {
   
   const random = Math.random();
   //'tracking' is the one looking for 'tracked' and changing its position towards 'tracked'     THIS NEEDS TO BE EDITED TO WORK WITH THE CLASS AND EACH ENTITY BETTER
    const tracking: Tracker = {x: this.entities[this.sessionIDs[i]].x, y:this.entities[this.sessionIDs[i]].y};
    const tracked: Tracker = {x: this.entities[this.sessionIDs[i+3]].x, y:this.entities[this.sessionIDs[i+3]].y};
    const newCoords:Tracker= this.entities[this.sessionIDs[i]].entityFollow(tracking, tracked, random);
   
    this.entities[this.sessionIDs[i]].x = newCoords.x;
    this.entities[this.sessionIDs[i]].y = newCoords.y; 
    
    //route running code
   } for (let i = 3; i < 6; i++) {
    if(this.entities[this.sessionIDs[i]].routes != null){
    const random = Math.random();
    const tracking: Tracker = {x: this.entities[this.sessionIDs[i]].x, y:this.entities[this.sessionIDs[i]].y};
    const tracked: Tracker = this.entities[this.sessionIDs[i]].routes[this.entities[this.sessionIDs[i]].routes[0]];
    tracked.x += ((i-3)*560)+2600;
    tracked.y = this.lineOfScrimmage-tracked.y;
   
    const newCoords:Tracker= this.entities[this.sessionIDs[i]].entityFollow(tracking, tracked, random);
    tracked.x -= ((i-3)*560)+2600;
    tracked.y = this.lineOfScrimmage-tracked.y;

    //console.log(i+ "    "+tracked.x+" "+tracked.y);

    this.entities[this.sessionIDs[i]].x = newCoords.x;
    this.entities[this.sessionIDs[i]].y = newCoords.y;

   
    const reciever: Tracker= {x: this.entities[this.sessionIDs[i]].x-((i-3)*560+2600), y: this.lineOfScrimmage-this.entities[this.sessionIDs[i]].y}
    
    if(this.entities[this.sessionIDs[i]].checkRouteArrived(reciever, this.entities[this.sessionIDs[i]].routes[this.entities[this.sessionIDs[i]].routes[0]]) == true){
        console.log("route arrived");
        this.entities[this.sessionIDs[i]].routes[0]++;
    }
 }
}

 this.movePlayer(.5);

      if (entity.speed > 0) {
        //entity.x -= (Math.cos(entity.angle)) * entity.speed*2;
        //entity.y -= (Math.sin(entity.angle)) * entity.speed *2;

        // apply boundary limits
        if (entity.x < 2210) { entity.x = 2210; }
        if (entity.x > 4100) { entity.x = 4100; }
        if (entity.y < 1370) { entity.y = 1370; }
        if (entity.y > 4620) { entity.y = 4620; }
        if(this.football.y<1627){console.log("score");}
        if(this.entities[this.playerIDs[0]].y<this.lineOfScrimmage){this.entities[this.playerIDs[0]].y = this.lineOfScrimmage}
      }
    }
      
    }

    // delete all dead entities
    deadEntities.forEach(entityId => delete this.entities[entityId]);
  }

proximitySearchMode(entity, sessionId){
        if((Football.distanceF(this.football.x, this.football.y, entity.x, entity.y) <= 50)&& this.football.footballFollow != undefined){
            
            this.football.footballFollow = sessionId;
          }

          if(this.football.footballFollow != undefined && this.football.footballFollow != ""){    
        const trackingF: Tracker = {x: this.football.x, y:this.football.y};
        const trackedF: Tracker = {x: this.entities[this.football.footballFollow].x, y:this.entities[this.football.footballFollow].y};
        const newCoords:Tracker= this.football.entityFollow(trackingF, trackedF, 1.5);
   
        this.football.x = newCoords.x;
        this.football.y = newCoords.y;
}
  }

ballInAirMode(location: Tracker){
        
        const trackingF: Tracker = {x: this.football.x, y:this.football.y};
        const newCoords:Tracker= this.football.entityFollow(trackingF, location, .5);
   
        this.football.x = newCoords.x;
        this.football.y = newCoords.y;
}

resetPlayers(){
    for(var i = 0; i<3; i++){
        this.entities[this.sessionIDs[i]].x = (i*560)+2600;
        this.entities[this.sessionIDs[i]].y = this.lineOfScrimmage-100;
    }
    for(var i = 3; i<6; i++){
        this.entities[this.sessionIDs[i]].x = ((i-3)*560)+2600;
        this.entities[this.sessionIDs[i]].y = this.lineOfScrimmage+50;
        if(this.entities[this.sessionIDs[i]].routes != null){this.entities[this.sessionIDs[i]].routes[0] = 1;}
        
/*
       for(var j = 1; j<this.entities[this.sessionIDs[i]].routes.length; j++){
        this.entities[this.sessionIDs[i]].routes[j].x += ((i-3)*560)+2600;
        this.entities[this.sessionIDs[i]].routes[j].y = this.lineOfScrimmage-this.entities[this.sessionIDs[i]].routes[j].y;
       } */
    }
    this.entities[this.playerIDs[0]].x = 3160;
    this.entities[this.playerIDs[0]].y = this.lineOfScrimmage+100;
    this.football.x = 3160+50;
    this.football.y = this.lineOfScrimmage+100;

    
}

movePlayer(speed: number){
   
for(var i = 0; i<4; i++){
    
if(this.playerMovement[i].toUpperCase()== this.playerMovement[i]){
         if(i==0){this.entities[this.playerIDs[0]].y -= speed;}
    else if(i==1){this.entities[this.playerIDs[0]].x -= speed;}
    else if(i==2){this.entities[this.playerIDs[0]].y += speed;}
    else if(i==3){this.entities[this.playerIDs[0]].x += speed;}
} 
}
}

}
