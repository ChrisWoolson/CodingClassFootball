import nanoid from "nanoid";
import { Schema, type, MapSchema } from "@colyseus/schema";

import { Entity } from "./Entity";
import { Player } from "./Player";
//import { Enemy } from "./Enemy";

const WORLD_SIZE = 2000;
export const DEFAULT_PLAYER_RADIUS = 30;

export class State extends Schema {
    playerId;
   
  width = WORLD_SIZE;
  height = WORLD_SIZE;
 sessionIDs = [6];
 space = false;

  @type({ map: Entity })
  entities = new MapSchema<Entity>();

  initialize () {
    // create some food entities
  /*  for (let i = 0; i < 500; i++) {
      this.createFood();
      const radius = Math.max(4, (Math.random() * (DEFAULT_PLAYER_RADIUS - 1)));
    const food = new Entity(Math.random() * this.width, Math.random() * this.height, radius);
    this.entities[nanoid(8)] = food;
    }
    */
  }

  createFood () {
    /*const radius = Math.max(4, (Math.random() * (DEFAULT_PLAYER_RADIUS - 1)));
    const food = new Entity(Math.random() * this.width, Math.random() * this.height, radius);
    this.entities[nanoid(8)] = food;
    
    */
  }

spacePressed(){
    if(this.space == false){
    this.space= true; }
    else{
        this.space= false;
    }
}
  



  createPlayer (sessionId: string) {
     this.playerId = sessionId;
    this.entities[sessionId] = new Player(
      1000,
      1100,
      
      
    ); 



  
//this.entities[] = food1;

const food0 = new Entity(1000, 800, 50, 1, 1);
this.sessionIDs[0] = nanoid(8);
this.entities[this.sessionIDs[0]] = food0;

const food1 = new Entity(1400, 800, 50, 1, 1);
this.sessionIDs[1] = nanoid(8);
this.entities[this.sessionIDs[1]] = food1;

const food2 = new Entity(600, 800, 50, 1,1 );
this.sessionIDs[2] = nanoid(8);
this.entities[this.sessionIDs[2]] = food2;

const food3 = new Entity(1000, 1000, 60, 1,0 );
this.sessionIDs[3] = nanoid(8);
this.entities[this.sessionIDs[3]] = food3;

const food4 = new Entity(1400, 1000, 60, 1,0 );
this.sessionIDs[4] = nanoid(8);
this.entities[this.sessionIDs[4]] = food4;

const food5 = new Entity(600, 1000, 60, 1, 0 );
this.sessionIDs[5] = nanoid(8);
this.entities[this.sessionIDs[5]] = food5;

const football = new Entity(1100, 1000, 10, 1, 3);
this.sessionIDs[6] = nanoid(8);
this.entities[this.sessionIDs[6]] = football;
/*
const food1 = new Entity(1000, 300, 50, 1, 1);
this.entities[nanoid(8)] = food1;

const food2 = new Entity(1400, 300, 50, 1, 1);
this.entities[nanoid(8)] = food2;


const food3 = new Entity(600, 300, 50, 1,1 );
this.entities[nanoid(8)] = food3;


const food4 = new Entity(1000, 800, 50, 1,0 );
this.entities[nanoid(8)] = food4;

const food5 = new Entity(1400, 800, 50, 1,0 );
this.entities[nanoid(8)] = food5;

const food6 = new Entity(600, 800, 50, 1, 0 );
this.entities[nanoid(8)] = food6;
*/

}

  /*createEnemy (sessionId: string) {
    this.entities[sessionId] = new Enemy(
      1000,
      1100
    );
  }   */
 
  update() {
    const deadEntities: string[] = [];
    for (const sessionId in this.entities) {
      const entity = this.entities[sessionId];

      if (entity.dead) {
        deadEntities.push(sessionId);
        continue;
      }

      if (1==1) {
        for (const collideSessionId in this.entities) {
          const collideTestEntity = this.entities[collideSessionId]

          // prevent collision with itself
          /*if (collideTestEntity === entity) {
            continue;
          }*/

          if (
            //entity.radius < collideTestEntity.radius 
            entity.team > collideTestEntity.team &&
            entity.team !=3 &&
            Entity.distance(entity, collideTestEntity) <= 50
            
            //    Entity.distance(entity, collideTestEntity) <= entity.radius - (collideTestEntity.radius / 2)
          ) {
            /*let winnerEntity: Entity = entity;
            let loserEntity: Entity = collideTestEntity;
            let loserEntityId: string = collideSessionId;

            winnerEntity.radius += loserEntity.radius / 5;
            loserEntity.dead = true;
            deadEntities.push(loserEntityId); */

            entity.y = entity.y-8;

            
          }
        }
      }
    
   /*
    if(entity.npc == 1 && entity.team == 1){
    //console.log("npc:  " + sessionId);
const randMove = Math.random()*6;
if(entity.x>this.entities[this.playerId].x){
entity.x = entity.x-randMove;
}else{
    entity.x = entity.x+randMove;
}
if(entity.y>this.entities[this.playerId].y){
entity.y = entity.y-randMove;
}else{
    entity.y = entity.y+randMove;
}
    } else if (entity.npc == 1 && entity.team == 0){

    }
    
    else{
console.log("player:  " + sessionId);
    }
*/



if(this.space == true){
for (let i = 0; i < 6; i++) {
    
//looks at only bad ones.
if(i<3){
    const randMove = Math.random();
if(this.entities[this.sessionIDs[i]].x>this.entities[this.playerId].x){
this.entities[this.sessionIDs[i]].x = this.entities[this.sessionIDs[i]].x-randMove;
}else{
    this.entities[this.sessionIDs[i]].x = this.entities[this.sessionIDs[i]].x+randMove;
}
if(this.entities[this.sessionIDs[i]].y>this.entities[this.playerId].y){
this.entities[this.sessionIDs[i]].y = this.entities[this.sessionIDs[i]].y-randMove;
}else{
    this.entities[this.sessionIDs[i]].y = this.entities[this.sessionIDs[i]].y+randMove;
}

//this.entities[this.sessionIDs[i]];
} else{  //looks at good ones
const randMove = Math.random()*.7;
    if(this.entities[this.sessionIDs[i]].x>this.entities[this.sessionIDs[i-3]].x){
this.entities[this.sessionIDs[i]].x = this.entities[this.sessionIDs[i]].x-randMove;
}else{
    this.entities[this.sessionIDs[i]].x = this.entities[this.sessionIDs[i]].x+randMove;
}
if(this.entities[this.sessionIDs[i]].y>this.entities[this.sessionIDs[i-3]].y){
this.entities[this.sessionIDs[i]].y = this.entities[this.sessionIDs[i]].y-randMove;
}else{
    this.entities[this.sessionIDs[i]].y = this.entities[this.sessionIDs[i]].y+randMove;
}
}
 
}








      if (entity.speed > 0) {
        entity.x -= (Math.cos(entity.angle)) * entity.speed*2;
        entity.y -= (Math.sin(entity.angle)) * entity.speed *2;

        // apply boundary limits
        if (entity.x < 0) { entity.x = 0; }
        if (entity.x > WORLD_SIZE) { entity.x = WORLD_SIZE; }
        if (entity.y < 0) { entity.y = 0; }
        if (entity.y > WORLD_SIZE) { entity.y = WORLD_SIZE; }
      }
    }
      
    }

   



    // delete all dead entities
    deadEntities.forEach(entityId => delete this.entities[entityId]);
  }
}
