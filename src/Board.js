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

    clearCell = (x, y) => {
        let key = this._game.getKey(x, y);
        var isCell = this.map[key] === CELL_CHAR;
        let bg = CELL_BG;
        if(!isCell) {
            bg = WALL_BG;
        }
        this._game.drawCell(x, y, this.map[key], bg);
    }
}