// createjs typescript definition for TypeScript
/// <reference path="./../node_modules/@types/createjs/index.d.ts" />

// importing createjs framework
import "createjs";
// importing game constants
import { STAGE_WIDTH, STAGE_HEIGHT, FRAME_RATE, ASSET_MANIFEST, BUG_MAX, BUG_START_DELAY, BUG_DELAY_INCREASE } from "./Constants";
import { AssetManager } from "./AssetManager";
import { Snake } from "./Snake";
import { Bug } from "./Bug";

// game variables
let stage:createjs.StageGL;
let canvas:HTMLCanvasElement;
let assetManager:AssetManager;

let snake:Snake;
let bugPool:Bug[] = [];
let background:createjs.Sprite;

let bugTimer:number;
let bugDelay:number;
let bugsEaten:number;

// --------------------------------------------------- event handler
function onReady(e:createjs.Event):void {
    console.log(">> spritesheet loaded & ready to add sprites to game");

    background = assetManager.getSprite("sprites", "misc/backgroundGame");
    stage.addChild(background);

    // construct game objects here
    snake = new Snake(stage, assetManager);
    snake.showMe();
    snake.startSlowdown();

    // bug = new Bug(stage, assetManager, snake)
    // bug.showMe();
    for (let i:number = 0; i < BUG_MAX; i++){
        bugPool.push(new Bug(stage, assetManager, snake));
    }

    bugsEaten = 0;
    bugDelay = BUG_START_DELAY;
    bugTimer = window.setInterval(onAddBug, bugDelay);

    stage.on("mousedown", onMoveSnake);

    //listen for custom events
    stage.on("bugEaten", onGameEvent);
    stage.on("snakeKilled", onGameEvent);
    stage.on("snakeSpeedChange", onGameEvent);
    
    // startup the ticker
    createjs.Ticker.framerate = FRAME_RATE;
    createjs.Ticker.on("tick", onTick);        
    console.log(">> game ready");
}

function onAddBug():void {
    for (let newBug of bugPool){
        if (newBug.used == false){
            newBug.used = true;
            newBug.showMe();
            break;
        }
    }

}

function onGameEvent(e:createjs.Event):void {
    switch (e.type){
        case "bugEaten":
            bugsEaten++;
            snake.energizeMe();
            //decrease the # of bugs released
            if ((bugsEaten % 10) == 0){
                bugDelay = bugDelay + BUG_DELAY_INCREASE;
                if (bugDelay > 5000){
                    bugDelay = 5000;
                }
                window.clearInterval(bugTimer);
                bugTimer = window.setInterval(onAddBug, bugDelay);
            }
            break;

        case "snakeKilled":
            window.clearInterval(bugTimer);
            break;

        case "snakeSpeedChange":
        
            break;
    }
}

function onMoveSnake(e:createjs.Event):void {
    snake.rotateMe();
    snake.startMe();
}

function onTick(e:createjs.Event) {
    // console.log("TICK!");
    document.getElementById("fps").innerHTML = String(createjs.Ticker.getMeasuredFPS());

    // this is your game loop!
    snake.update();
    for (let bug of bugPool){
        if (bug.used) bug.update();
    }

    // update the stage
    stage.update();
}

// --------------------------------------------------- main method
function main():void {
    // get reference to canvas
    canvas = <HTMLCanvasElement> document.getElementById("game-canvas");
    // set canvas width and height - this will be the stage size
    canvas.width = STAGE_WIDTH;
    canvas.height = STAGE_HEIGHT;    

    // create stage object
    stage = new createjs.StageGL(canvas, { antialias: true });

    // AssetManager setup
    assetManager = new AssetManager(stage);
    stage.on("allAssetsLoaded", onReady, null, true);
    // load the assets
    assetManager.loadAssets(ASSET_MANIFEST);
}

main();