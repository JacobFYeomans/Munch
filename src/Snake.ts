import { Character } from "./Character";
import { AssetManager } from "./AssetManager";
import { SNAKE_SLOW_DELAY } from "./Constants";
import { SNAKE_MAXSPEED } from "./Constants";

export class Snake extends Character {

    private mouseX:number;
    private mouseY:number;

    // custom event for dispatching
    private eventKilled:createjs.Event;
    private eventSpeedChange:createjs.Event;

    private slowDownTimer:number;

    constructor(stage:createjs.StageGL, assetManager:AssetManager) {
        super(stage, assetManager, "snake/alive");
        
        // construct custom event objects
        this.eventKilled = new createjs.Event("snakeKilled", true, false);
        this.eventSpeedChange = new createjs.Event("snakeSpeedChange", true, false);
    }

    private onSlowDown():void{
        this._speed = this._speed - 1;
        this._sprite.dispatchEvent(this.eventSpeedChange);
        if (this._speed <= 0){
            this.killMe();
        }
    }

    startSlowdown():void {
        this.slowDownTimer = window.setInterval(() => this.onSlowDown(), SNAKE_SLOW_DELAY);

    }

    public energizeMe():void {
        // snake can only gain more energy if less than maximum
        if (this._speed < SNAKE_MAXSPEED) {
            this._speed++;
            this._sprite.dispatchEvent(this.eventSpeedChange);
        }
        console.log("Snake energized: " + this.speed);
        // reset slowdown timer so the interval starts again
        window.clearInterval(this.slowDownTimer);
        this.slowDownTimer = window.setInterval(() => this.onSlowDown(), SNAKE_SLOW_DELAY);
    }

    public override rotateMe(){
        this.mouseX = this.stage.mouseX;
        this.mouseY = this.stage.mouseY;

        let radians:number = Math.atan2((this.mouseY - this._sprite.y), (this.mouseX - this._sprite.x))

        super.rotateMe(this.toDegrees(radians));
    }
  
    public killMe():void {
        // snake is now killed!
        this._state = Character.STATE_DEAD;
        // stop the snake's sprite animation
        this.stopMe();
        // listen for animation to be finished (auto removes event listener)
        this._sprite.on("animationend", function() {
            // cleanup
            this._sprite.stop();
        }, this, true);
        // play the snake's death animation
        this._sprite.gotoAndPlay("snake/dead");
        //stop timer
        window.clearInterval(this.slowDownTimer);
        // dispatch event that snake has been killed!
        this._sprite.dispatchEvent(this.eventKilled);
    }

    public resetMe(){
        this._sprite.gotoAndStop("snake/alive");
        this._sprite.x = 300;
        this._sprite.y = 300;
        this._sprite.rotation = 0;
        this._speed = SNAKE_MAXSPEED;
        this._state = Character.STATE_IDLE;
    }

    public override update(){

        super.update();

        if (Math.abs(this._sprite.x - this.mouseX) < 15 && Math.abs(this._sprite.y - this.mouseY) < 15){
            this.stopMe();
        }
        


    }

}