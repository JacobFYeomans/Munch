import { AssetManager } from "./AssetManager";

export class ScreenManager {

    private stage:createjs.StageGL;

    private introScreen:createjs.Container;
    private gameScreen:createjs.Sprite;
    private gameOverScreen:createjs.Container;

    //custom events
    private startGameEvent:createjs.Event;
    private resetGameEvent:createjs.Event;
    
    constructor(stage:createjs.StageGL, assetManager:AssetManager) {
        this.stage = stage;

        // construct the containers for each screen
        this.introScreen = new createjs.Container();
        this.introScreen.addChild(assetManager.getSprite("sprites","misc/backgroundIntro",0,0));
        let snakeSprite:createjs.Sprite = assetManager.getSprite("sprites","snake/alive",250,320);
        snakeSprite.play();
        this.introScreen.addChild(snakeSprite);
        let bugSprite:createjs.Sprite = assetManager.getSprite("sprites","bug/alive",340,320);   
        bugSprite.rotation = -45;
        bugSprite.play();
        this.introScreen.addChild(bugSprite);
        
        this.gameOverScreen = new createjs.Container();
        this.gameOverScreen.addChild(assetManager.getSprite("sprites","misc/backgroundGame",0,0));
        let gameOverSprite:createjs.Sprite = assetManager.getSprite("sprites","misc/gameOver",70,240);
        this.gameOverScreen.addChild(gameOverSprite);

        this.gameScreen = assetManager.getSprite("sprites","misc/backgroundGame",0,0);
    
        this.startGameEvent = new createjs.Event("gameStart", true, false);
        this.resetGameEvent = new createjs.Event("gameReset", true, false);
    }

    // -------------------------------------------------- public methods
    public showIntro():void {        
        // show the intro screen
        this.hideAll();
        this.stage.addChildAt(this.introScreen, 0);

        // detect click on the stage to remove intro screen and start the game
        this.stage.on("click", (e) => {
            this.stage.dispatchEvent(this.startGameEvent);
        }, this, true);        
    }

    public showGame():void {
        // show the game screen
        this.hideAll();
        this.stage.addChildAt(this.gameScreen, 0);
    }

    public showGameOver():void {
        // show the gameover screen
        this.hideAll();
        this.stage.addChildAt(this.gameOverScreen, 0);

        // detect click on the stage to remove gameover screen and return to intro screen
        this.stage.on("click", (e) => {
            this.stage.dispatchEvent(this.resetGameEvent);
        }, this, true);        
    }
    
    // --------------------------------------------- private methods
    private hideAll():void {
        this.stage.removeChild(this.introScreen);
        this.stage.removeChild(this.gameOverScreen);
        this.stage.removeChild(this.gameScreen);
    }

}