
import { RNG, Engine, Display, Scheduler } from "rot-js/lib/index";
import { Player } from "./Player";
import createRandomItem from "./Items"
import { Board } from "./Board";

const WIDTH = 80;
const HEIGHT = 25;
export class Game {

    map = {};

    _display = null;
    _engine = null;
    _board = null;
    _snake = null;
    _itemsPositions = [];
    wallPositions = [];

    constructor() {
        this._display = new Display({
            width: WIDTH,
            height: HEIGHT,
            fontSize: 22,
            // bg: "pink"
        });
        document.body.appendChild(this._display.getContainer());
    }

    init = () => {
        this._initMap();
        this._initPlayer();
        this._initScheduler();
        this._initItems();
    }

    lockEngine = () => {
        this._engine.lock();
    }

    unLockEngine = () => {
        this._engine.unlock();
    }

    setMap = (map) => {
        this.map = map;
    }

    clearCell = (x, y) => {
        this._board.clearCell(x, y);
    }

    clearAll = () => {
        this._board.draw();
    }

    drawCell = (x, y, char, color) => {
        this._display.draw(x, y, char, color);
    }

    onPlayerPositionChange = (x, y) => {
        let key = this.getKey(x, y);
        let itms = this._itemsPositions.filter(i => i == key);
        if(itms.length > 0) {
           // hit item
           this._snake.onEvent({
               event : "ate"
           })
           this._itemsPositions.splice(this._itemsPositions.findIndex(i => i == key),1);
           this._createNewItem();
        } else {
            itms = this.wallPositions.filter(i => i == key);
            if(itms.length > 0) {
                // hit wall
                this._hitObstruction();
            } else {
                itms = this._snake._tail.filter(i => {
                    let ikey = this.getKey(i.x, i.y);
                    if(ikey == key) {
                       // hit self
                        this._hitObstruction();
                    }
                });

            }
        }
    }
    
    getKey = (x, y) => {
        return x+","+y;
    }

    _initMap = () => {
        this._board = new Board(this, WIDTH, HEIGHT);
        this._board.draw();
    }

    _initScheduler = () => {
        let scheduler = new Scheduler.Simple();
        scheduler.add(this._snake, true);
        this._engine = new Engine(scheduler);
        this._engine.start();
    }

    _initPlayer = () => {
        this._snake = new Player(this, 10, 10);
    }

    _initItems = () => {
        this._createNewItem();
    }

    _createNewItem = () => {
        let x = Math.floor(RNG.getUniformInt(1, WIDTH - 1));
        let y = Math.floor(RNG.getUniformInt(1, HEIGHT - 1));
        console.log(x, y)
        let item = createRandomItem(this, x, y);
        let key = this.getKey(x,y);
        this._itemsPositions.push(key);
    }

    _hitObstruction = () => {
        this._snake.onEvent({
            event : "die"
        }) 
        this._display.draw(WIDTH/2, HEIGHT/2, "You are DEAD!!!", "red");
    }
}