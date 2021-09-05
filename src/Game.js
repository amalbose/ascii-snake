
import { RNG, KEYS, Engine, Display, Scheduler } from "rot-js/lib/index";
import { Player } from "./Player";
import createRandomItem from "./Items"
import { Board } from "./Board";
import { Hub } from "./Hub";

const WIDTH = 80;
const HEIGHT = 25;
const HUB_HEIGHT = 4;
const LIFE_COUNT = 2;
const NO_DEATH = false;

const GAME_STATE_RUNNING = 1;
const GAME_STATE_PAUSED = 2;
const GAME_STATE_ENDED = 3;
export class Game {

    map = {};
    state = GAME_STATE_RUNNING;
    _display = null;
    _hdisplay = null;
    _engine = null;
    _board = null;
    _hub = null;
    _snake = null;
    _items = [];
    _itemsPositions = [];
    wallPositions = [];

    constructor() {
        this._display = new Display({
            width: WIDTH,
            height: HEIGHT,
            fontSize: 25,
            // bg: "pink"
        });
        this._hdisplay = new Display({
            width: WIDTH,
            height: HUB_HEIGHT,
            fontSize: 25,
            // bg: "pink"
        });
        document.body.appendChild(this._hdisplay.getContainer());
        document.body.appendChild(this._display.getContainer());
    }

    init = () => {
        this._initBoard();
        this._initPlayer();
        this._initScheduler();
        this._initItems();
        this._initListeners();
    }

    _initListeners = () => {
        window.addEventListener("keydown", this);
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

    onNewPlayerLife = () => {
        this._items.forEach(i => i.die());
        this.clearAll();
        this._snake.draw();
        this._initItems();
        this._updateHub();
    }

    onPlayerDead = () => {
        this._items.forEach(i => i.die());
        this.wallPositions = [];
        this.clearAll();
        this._updateHub();
        this.state = GAME_STATE_ENDED;
        this._drawPanel(7, 30);
    }

    drawCell = (x, y, char, color) => {
        if(this.state == GAME_STATE_RUNNING) {
            this._display.draw(x, y, char, color);
        }
    }

    drawHubCell = (x, y, char, color) => {
        this._hdisplay.draw(x, y, char, color);
    }

    clearHubText = (x, y) => {
        this._hdisplay.draw(x, y, " ");
    }

    drawHubText = (x, y, char) => {
        this._hdisplay.drawText(x, y, char);
    }

    drawPlayer = (x, y, char, color) => {
        this._display.draw(x, y, char, color);
        let key = this.getKey(x, y);
        this._itemsPositions.forEach(i => {
            var parts = i.split(",");
            var ix = parseInt(parts[0]);
            var iy = parseInt(parts[1]);
            if(Math.abs(ix - x) > 0 && Math.abs(ix - x) < 2 && Math.abs(iy - y) > 0 && Math.abs(iy - y) < 2) {
                let itm = this._items.filter(i => i._x == ix && i._y == iy)[0];
                if(!itm._dead) {
                    itm.draw()
                }
            }
        })
    }

    onPlayerPositionChange = (x, y) => {
        let key = this.getKey(x, y);
        let itms = this._itemsPositions.filter(i => i == key);
        console.log(this._itemsPositions);
        if(itms.length > 0) {
            let itm = this._items.filter(i => i._x == x && i._y == y)[0];
            let gainedPoints = itm.getValue();
            itm.die();
            this._itemsPositions.splice(this._itemsPositions.findIndex(i => i == key),1);
            this._items.splice(this._items.findIndex(i => i._x == x && i._y == y), 1);
            this._board.clearSurrounding(x, y);
           // hit item
           this._snake.onEvent({
               event : "ate",
               points: gainedPoints
           })
           this._updateHub();
           console.log("ate");
           this._createNewItem();
        } else if(!NO_DEATH) {
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

    onItemExpiry = (x, y) => {
        if(this.state == GAME_STATE_RUNNING) {
            let key = this.getKey(x, y);
            let removed = this._itemsPositions.splice(this._itemsPositions.findIndex(i => i == key),1);
            this._board.clearSurrounding(x, y);
            if(removed) {
                this._createNewItem();
            }
        }
    }
    
    getKey = (x, y) => {
        return x+","+y;
    }

    
    handleEvent = (e) => {
        if(this.state == GAME_STATE_ENDED) {

            if(e.keyCode == KEYS.VK_R) {
                console.log("Restarting");
                this.state = GAME_STATE_RUNNING;
                this.init();
            }
        }
    }

    _initBoard = () => {
        this._board = new Board(this, WIDTH, HEIGHT);
        this._board.draw();
        this._hub = new Hub(this, WIDTH, HUB_HEIGHT);
        this._hub.setAvailableLife(2);
        this._hub.draw();
    }

    _initScheduler = () => {
        let scheduler = new Scheduler.Simple();
        scheduler.add(this._snake, true);
        this._engine = new Engine(scheduler);
        this._engine.start();
    }

    _initPlayer = () => {
        if(this._snake) {
            this._snake.resetPlayer(LIFE_COUNT, 10, 10);
        } else {
            this._snake = new Player(this, LIFE_COUNT, 10, 10);
        }
    }

    _initItems = () => {
        this._items = [];
        this._itemsPositions = [];
        this._createNewItem();
    }

    _updateHub = () => {
        let points = this._snake.points;
        let life = this._snake.life;
        this._hub.update(points, life);
    }

    _createNewItem = () => {
        console.log("creating new item")
        let x = Math.floor(RNG.getUniformInt(1, WIDTH - 1));
        let y = Math.floor(RNG.getUniformInt(1, HEIGHT - 1));
        x = Math.min(x, WIDTH - 2);
        x = Math.max(1, x);
        y = Math.min(y, HEIGHT - 2);
        y = Math.max(1, y);
        console.log(x, y)
        let item = createRandomItem(this, x, y);
        this._items.push(item);
        let key = this.getKey(x,y);
        this._itemsPositions.push(key);
    }

    _hitObstruction = () => {
        this._snake.onEvent({
            event : "lifeLost"
        }) 
    }

    _drawPanel = (row, col) => {
        let midw = WIDTH/2 - col/2;
        let midh = HEIGHT/2 - row/2;
        let fg = "#999999";
        let bg = "#343434";
        for(let i = 0; i < row; i++) {
            for(let j =0; j < col; j++) {
                if(i == 0) {
                    this._display.draw(midw+j, midh+i, " ", fg, "#505050");
                } else {
                    this._display.draw(midw+j, midh+i, " ", "#999999", bg);
                }
            }
        }
        this._display.draw(WIDTH/2, HEIGHT/2-1, "You are dead!", "red", bg);
        // this._display.draw(WIDTH/2, HEIGHT/2, "---------------", "red");

        this._display.draw(WIDTH/2, HEIGHT/2+2, "[R]etry        [C]lose", "#dedede", bg );

    }
}