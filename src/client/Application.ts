import * as PIXI from "pixi.js";
import * as Viewport from "pixi-viewport";
import { Room, Client } from "colyseus.js";
import { State } from "../server/rooms/State";
import { Football } from "../server/rooms/Football";
const FootballField =  require("./images/Stadium.jpg");


const ENDPOINT = (process.env.NODE_ENV==="development")
    ? "ws://localhost:8080"
    : "wss://colyseus-pixijs-boilerplate.herokuapp.com";

const WORLD_SIZE = 6000;

export const lerp = (a: number, b: number, t: number) => (b - a) * t + a
 
export class Application extends PIXI.Application {
    entities: { [id: string]: PIXI.Graphics } = {};
    footballSprite: PIXI.Graphics;
    currentPlayerEntity: PIXI.Graphics;

    client = new Client(ENDPOINT);
    room: Room<State>;

    viewport: Viewport;
    _interpolation: boolean;
field: PIXI.Sprite;
    constructor () {
        
        super({
            width: window.innerWidth,
            height: window.innerHeight,
            backgroundColor: 0x0c0c0c
        });
this.footballSprite = new PIXI.Graphics;

        this.viewport = new Viewport({
            screenWidth: window.innerWidth,
            
            screenHeight: window.innerHeight+350,
            worldWidth: WORLD_SIZE,
            worldHeight: WORLD_SIZE,
        });

        // draw boundaries of the world
        const boundaries = new PIXI.Graphics();
        //boundaries.beginFill(0xffffff);
        this.field = PIXI.Sprite.from(FootballField);
        this.field.x=0;
        this.field.y=0;
        this.field.width= WORLD_SIZE;
        this.field.height = WORLD_SIZE;
       // console.log(FootballField);
        this.field.x = 0;
        this.field.y = 0;
        boundaries.addChild(this.field);

        
        this.viewport.addChild(this.field);
        this.viewport.addChild(this.footballSprite);
        //boundaries.fill(field);
        boundaries.drawRoundedRect(0, 0, WORLD_SIZE, WORLD_SIZE, 30);
        this.viewport.addChild(boundaries);

        // add viewport to stage
        this.stage.addChild(this.viewport);

        this.authenticate();

        this.interpolation = false;
        
        this.viewport.on("mousemove", (e) => {
            if (this.currentPlayerEntity) {
                const point = this.viewport.toLocal(e.data.global);
                this.room.send('mouse', { x: point.x, y: point.y});
            }
        });
        document.addEventListener("keydown", (e) => {
            if (e.key == " ") {
               // console.log("HIT SPACE BAR");
                //const point = this.viewport.toLocal(e.data.global);
                this.room.send("space");
            } else if (e.key == "1") {
                this.room.send("one");
            
            } 
            else if (e.key == "w") {
                this.room.send("W");
            
            } else if (e.key == "a") {
                this.room.send("A");
            } else if (e.key == "s") {
                this.room.send("S");
            } else if (e.key == "d") {
                this.room.send("D");
            } 
        }); 
        document.addEventListener("keyup", (e) => {
            if (e.key == "w") {
                this.room.send("w");
            
            } else if (e.key == "a") {
                this.room.send("a");
            } else if (e.key == "s") {
                this.room.send("s");
            } else if (e.key == "d") {
                this.room.send("d");
            } 
        });


       const colorf = 0x89531A; 
            this.footballSprite.lineStyle(0);
            this.footballSprite.beginFill(colorf, 1);
            this.footballSprite.drawCircle(0, 0, 10);
            this.footballSprite.endFill();

    }

    async authenticate() {
        // anonymous auth
     //  await this.client.auth.login();

        //console.log("Success!", this.client.auth);

        this.room = await this.client.joinOrCreate<State>("arena");


        this.room.state.entities.onAdd = (entity, sessionId: string) => {
            
            const color = (entity.radius == 45)
                ? 0x00ff000
                : 0xFFFF0B; 
  
            const graphics = new PIXI.Graphics();
            graphics.lineStyle(0);
            graphics.beginFill(color, 0.5);
            graphics.drawCircle(0, 0, entity.radius);
            graphics.endFill();

            graphics.x = entity.x;
            graphics.y = entity.y;
            this.viewport.addChild(graphics);

            this.entities[sessionId] = graphics;

            // detecting current user
            if (sessionId === this.room.sessionId) {
                this.currentPlayerEntity = graphics;
                this.viewport.follow(this.currentPlayerEntity);
                
            }
            

        };

        this.room.state.entities.onRemove = (_, sessionId: string) => {
            this.viewport.removeChild(this.entities[sessionId]);
            this.entities[sessionId].destroy();
            delete this.entities[sessionId];
        };
    }

    set interpolation (bool: boolean) {
        this._interpolation = bool;

        if (this._interpolation) {
            this.loop();
        }
    }

    loop () {

        for (let id in this.entities) {
            this.entities[id].x = lerp(this.entities[id].x, this.room.state.entities[id].x, 0.2);
            this.entities[id].y = lerp(this.entities[id].y, this.room.state.entities[id].y, 0.2);
        } 
        //this.footballSprite.x = lerp(this.footballSprite.x, this.room.state.football.x, .6);
        //this.footballSprite.y = lerp(this.footballSprite.y, this.room.state.football.y, .6);

        if(this.room && this.room.state){this.footballSprite.x = this.room.state.football.x;
this.footballSprite.y = this.room.state.football.y;} 

        // continue looping if interpolation is still enabled.
        if (this._interpolation) { 
            requestAnimationFrame(this.loop.bind(this)); 
        }
    }
}