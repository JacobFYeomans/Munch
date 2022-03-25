import { Character } from "./Character";
import { AssetManager } from "./AssetManager";
import { STAGE_WIDTH, STAGE_HEIGHT } from "./Constants";
import { randomMe } from "./Toolkit";
import { Snake } from "./Snake";

export class Bug extends Character {

    private snake:Snake;

    constructor(stage:createjs.StageGL, assetManager:AssetManager, snake:Snake) {
        super(stage, assetManager, "bug/alive");
        this.snake = snake;
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

    }

    public override update(){
        super.update();
        if (this._state == Character.STATE_IDLE) return;

        if (this._sprite.x > STAGE_WIDTH + this._sprite.getBounds().width || this._sprite.x < -this._sprite.getBounds().width || this.sprite.y < -this._sprite.getBounds().height || this.sprite.y > STAGE_HEIGHT + this._sprite.getBounds().height){
            this.hideMe();
        }
    }

}