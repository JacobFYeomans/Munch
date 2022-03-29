import { Character } from "./Character";
import { AssetManager } from "./AssetManager";
import { STAGE_WIDTH, STAGE_HEIGHT } from "./Constants";
import { randomMe, radiusHit } from "./Toolkit";
import { Snake } from "./Snake";

export class Bug extends Character {

    private snake:Snake;
    private eventEaten:createjs.Event;

    private _used:boolean;

    constructor(stage:createjs.StageGL, assetManager:AssetManager, snake:Snake) {
        super(stage, assetManager, "bug/alive");

        this.snake = snake;
        this._used = false;

        this.eventEaten = new createjs.Event("bugEaten", true, false);
    }

    public get used(){
        return this._used;
    }

    public set used(value:boolean){
        this._used = value;
    }


    public override showMe():void {
        let width:number = this._sprite.getBounds().width;

        this._speed = randomMe(2,6);

        if(randomMe(1,2) == 1){
            this._sprite.x = -width;
            this._sprite.y = randomMe(50, 550);
            this._sprite.rotation = randomMe(45, -45);
        }
        else {
            this._sprite.x = STAGE_WIDTH + width;
            this._sprite.y = randomMe(50, 550);
            this._sprite.rotation = randomMe(135, 225);
        }

        this.startMe();

        this.stage.addChildAt(this._sprite, this.stage.getChildIndex(this.snake.sprite));

        this._used = true;
    }

    public hideMe():void{
        super.hideMe();

        this._sprite.gotoAndStop("bug/alive");
        this._used = false;
    }

    public killMe():void {
        this._state = Character.STATE_DEAD;
        this.stopMe();
        // play the bug's death animation
        this._sprite.gotoAndPlay("bug/dead");
        // listen for animation to be finished (and auto remove event listener after first occurrence)
        this._sprite.on("animationend", (e:createjs.Event) => {
            this.hideMe();
        }, this, true);

        this._sprite.dispatchEvent(this.eventEaten);
    }

    public override update(){
        super.update();

        if (this._state == Character.STATE_IDLE) return;

        if (this._sprite.x > STAGE_WIDTH + this._sprite.getBounds().width || this._sprite.x < -this._sprite.getBounds().width || this.sprite.y < -this._sprite.getBounds().height || this.sprite.y > STAGE_HEIGHT + this._sprite.getBounds().height){
            this.hideMe();
        }

        //collision detection
        if (this.snake.state == Character.STATE_DEAD || this._state == Character.STATE_DEAD) return;


        if (radiusHit(this.snake.sprite, 5, this._sprite, 20)){
            this.killMe();
        }
    }

}