import { Map } from "rot-js/lib/index";

const CELL_BG = "#232323";
const WALL_BG = "#767676";
const CELL_CHAR = "0";

export class Board {
    _game = null;
    _width = 80;
    _height = 25;
    map = {};

    constructor(game, width, height) {
        this._width = width;
        this._height = height;
        this._game = game;
        this._generateMap();
    }

    _generateMap = () => {
        var map = new Map.Cellular(this._width,this._height);
        var freeCells = [];
        var mapCallback = function(x, y, value) {
            let dataVal = CELL_CHAR;
            let key = this._game.getKey(x, y);
            if(x==0 || y == 0 || x== (this._width - 1) || y == (this._height - 1) || (y == 12 && x > 12 && x < 33)) {
                dataVal = "#";
                this._game.wallPositions.push(key);
            } else {
                freeCells.push(key);
            }
            this.map[key] = dataVal;
        }
        map.create(mapCallback.bind(this));
        this._game.setMap(this.map);
    }

    draw = () => {
        for (var key in this.map) {
            var parts = key.split(",");
            var x = parseInt(parts[0]);
            var y = parseInt(parts[1]);
            var isCell = this.map[key] === CELL_CHAR;
            let bg = CELL_BG;
            if(!isCell) {
                bg = WALL_BG;
            }
            this._game.drawCell(x, y, this.map[key], bg);
        }
    }

    clearSurrounding = (x, y) => {
        this.clearCell(x, y - 1)
        this.clearCell(x, y + 1)
        this.clearCell(x + 1, y)
        this.clearCell(x - 1, y)
        this.clearCell(x - 1, y - 1)
        this.clearCell(x - 1, y + 1)
        this.clearCell(x + 1, y - 1)
        this.clearCell(x + 1, y + 1)
        this.clearCell(x, y)
    }

    clearCell = (x, y) => {
        let key = this._game.getKey(x, y);
        var isCell = this.map[key] === CELL_CHAR;
        let bg = CELL_BG;
        if(!isCell) {
            bg = WALL_BG;
        }
        let val = this.map[key];
        let nextX = this._game._snake._x + this._game._snake._dir.x;
        let nextY = this._game._snake._y + this._game._snake._dir.y;
        if((x == this._game._snake._x && y == this._game._snake._y) || (x == nextX && y == nextY)) {
            return
        } else {
            let itms = this._game._snake._tail.filter(i => i.x == x && i.y == y);
            if(itms.length > 0) {
                return
            }
        }
        this._game.drawCell(x, y, val, bg);
    }
}