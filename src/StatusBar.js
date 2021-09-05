import { Map } from "rot-js/lib/index";

const CELL_BG = "#232323";
const WALL_BG = "#767676";
const CELL_CHAR = "";

export class StatusBar {
    
    _game = null;
    _width = 80;
    _height = 25;
    _text = "";
    map = {};

    constructor(game, width, height) {
        this._width = width;
        this._height = height;
        this._game = game;
        this._generateMap();
    }

    _generateMap = () => {
        var map = new Map.Cellular(this._width,this._height);
        var mapCallback = function(x, y, value) {
            let dataVal = CELL_CHAR;
            let key = this._game.getKey(x, y);
            if(x==0 || x == (this._width - 1) || y == (this._height - 1)) {
                dataVal = "#";
            }
            this.map[key] = dataVal;
        }
        map.create(mapCallback.bind(this));
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
            this._game.drawStatusCell(x, y, this.map[key], bg);
        }
        this._game.drawStatusText(2, 0, this._text);
    }

    setText = (text) => {
        this._text = text;
        this._game.drawStatusText(2, 0, text);
    }

}