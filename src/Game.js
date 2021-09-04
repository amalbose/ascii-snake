
import { RNG, Engine, Display, Map, Scheduler } from "rot-js/lib/index";
import { Player } from "./Player";
import createRandomItem from "./Items"

const CELL_BG = "#232323";
const WALL_BG = "#767676";
const CELL_CHAR = "0";
const WIDTH = 80;
const HEIGHT = 25;
export class Game {

    map = {};

    _display = null;
    _engine = null;
    _snake = null;
    _itemsPositions = [];
    _wallPositions = [];

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
        this._generateMap();
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

    clearCell = (x, y) => {
        let key = x+","+y;
        var isCell = this.map[key] === CELL_CHAR;
        let bg = CELL_BG;
        if(!isCell) {
            bg = WALL_BG;
        }
        this._display.draw(x, y, this.map[key], bg);
    }

    clearAll = () => {
        this._drawWholeMap();
    }

    drawCell = (x, y, char, color) => {
        this._display.draw(x, y, char, color);
    }

    onPlayerPositionChange = (x, y) => {
        let key = this._getKey(x, y);
        let itms = this._itemsPositions.filter(i => i == key);
        if(itms.length > 0) {
           // hit item
           this._snake.onEvent({
               event : "ate"
           })
           this._itemsPositions.splice(this._itemsPositions.findIndex(i => i == key),1);
           this._createNewItem();
        } else {
            itms = this._wallPositions.filter(i => i == key);
            if(itms.length > 0) {
                // hit wall
                this._hitObstruction();
            } else {
                itms = this._snake._tail.filter(i => {
                    let ikey = this._getKey(i.x, i.y);
                    if(ikey == key) {
                       // hit self
                        this._hitObstruction();
                    }
                });

            }
        }
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
        let key = this._getKey(x,y);
        this._itemsPositions.push(key);
    }

    _generateMap = () => {
        var map = new Map.Cellular(WIDTH,HEIGHT);
        var freeCells = [];
        var mapCallback = function(x, y, value) {
            let dataVal = CELL_CHAR;
            let key = this._getKey(x, y);
            if(x==0 || y == 0 || x== (WIDTH - 1) || y == (HEIGHT - 1) || (y == 12 && x > 12 && x < 33)) {
                dataVal = "#";
                this._wallPositions.push(key);
            } else {
                freeCells.push(key);
            }
            this.map[key] = dataVal;
        }
        map.create(mapCallback.bind(this));
        this._drawWholeMap()
    }

    _drawWholeMap = () => {
        for (var key in this.map) {
            var parts = key.split(",");
            var x = parseInt(parts[0]);
            var y = parseInt(parts[1]);
            var isCell = this.map[key] === CELL_CHAR;
            let bg = CELL_BG;
            if(!isCell) {
                bg = WALL_BG;
            }
            this._display.draw(x, y, this.map[key], bg);
        }
    }

    _getKey = (x, y) => {
        return x+","+y;
    }

    _hitObstruction = () => {
        this._snake.onEvent({
            event : "die"
        }) 
        this._display.draw(WIDTH/2, HEIGHT/2, "You are DEAD!!!", "red");
    }
}