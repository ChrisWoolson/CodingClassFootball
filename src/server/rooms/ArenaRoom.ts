import { Room, Client } from "colyseus";
import { Entity } from "./Entity";
import { State } from "./State";

interface MouseMessage {
  x: number;
  y: number;
}

export class ArenaRoom extends Room<State> {

  onCreate() {
    this.setState(new State());

    this.onMessage("mouse", (client, message: MouseMessage) => {
      const entity = this.state.entities[client.sessionId];

      // skip dead players
      if (!entity) {
        console.log("DEAD PLAYER ACTING...");
        return;
      }

      // change angle
      const dst = Entity.distance(entity, message as Entity);
      entity.speed = (dst < 20) ? 0 : Math.min(dst / 15, 4);
      entity.angle = Math.atan2(entity.y - message.y, entity.x - message.x);
    });
this.onMessage("space", ()=>{
this.state.spacePressed();
  });
this.onMessage("one", ()=>{
this.state.throwBall();
  });

  this.onMessage("w", ()=>{
this.state.playerMovement[0] = 'w';
  });
  this.onMessage("a", ()=>{
this.state.playerMovement[1] = 'a';
  });
  this.onMessage("s", ()=>{
this.state.playerMovement[2] = 's';
  });
  this.onMessage("d", ()=>{
this.state.playerMovement[3] = 'd';
  });
  this.onMessage("W", ()=>{
this.state.playerMovement[0] = 'W';
  });
  this.onMessage("A", ()=>{
this.state.playerMovement[1] = 'A';
  });
  this.onMessage("S", ()=>{
this.state.playerMovement[2] = 'S';
  });
  this.onMessage("D", ()=>{
this.state.playerMovement[3] = 'D';
  });
  
  /*this.onMessage("two", ()=>{
this.state.throwBall(2);
  });
  this.onMessage("three", ()=>{
this.state.throwBall(3);
  });
*/
    this.setSimulationInterval(() => this.state.update());
  }

    

  onJoin(client: Client, options: any) {
    console.log(client.sessionId, "JOINED");
    if(this.state.playerIDs[0] == ''){this.state.createOffencePlayer(client.sessionId);
    }
    else{this.state.createDefencePlayer(client.sessionId);}
  }

  onLeave(client: Client) {
    console.log(client.sessionId, "LEFT!");
    const entity = this.state.entities[client.sessionId];

    // entity may be already dead.
    if (entity) { entity.dead = true; }
  }

}
