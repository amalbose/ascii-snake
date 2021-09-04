
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

    constructor() {
        this._display = new Display({
            width: WIDTH,
            height: HEIGHT,
            fontSize: 22
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
        this._display.draw(x, y, this.map[x+","+y], CELL_BG);
    }

    drawCell = (x, y, char, color) => {
        this._display.draw(x, y, char, color);
    }

    onPlayerPositionChange = (x, y) => {
        let itms = this._itemsPositions.filter(i => i.x == x && i.y == y);
        if(itms.length > 0) {
            let itm = itms[0];
           this._snake.onEvent({
               event : "ate"
           })
           this._itemsPositions.splice(this._itemsPositions.findIndex(i => i.x == x && i.y == y),1);
           this._createNewItem();
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
        let x = Math.floor(RNG.getUniform() * WIDTH - 2) + 1;
        let y = Math.floor(RNG.getUniform() * HEIGHT - 2) + 1;
        console.log(x, y)
        let item = createRandomItem(this, x, y);
        this._itemsPositions.push({x, y});
    }

    _generateMap = () => {
        var map = new Map.Cellular(WIDTH,HEIGHT);
        var freeCells = [];
        var mapCallback = function(x, y, value) {
            let dataVal = CELL_CHAR;
            let key = x+","+y;
            if(x==0 || y == 0 || x== 79 || y == 24) {
                dataVal = "#";
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
}