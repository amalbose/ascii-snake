import { Map } from "rot-js/lib/index";

const CELL_BG = "#232323";
const WALL_BG = "#767676";
const CELL_CHAR = "";
export class Hub {

    _game = null;
    _width = 80;
    _height = 25;
    points = 0;
    life = 1;
    _availableLife = 1;
    map = {};
    _textBegin = 65;
    _valBegin = this._textBegin + 8;

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
            if(x==0 || y == 0 || x== (this._width - 1)) {
                dataVal = "#";
            }
            this.map[key] = dataVal;
        }
        map.create(mapCallback.bind(this));
    }

    setAvailableLife = (life) => {
        this.life = life;
        this._availableLife = life;
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
            this._game.drawHubCell(x, y, this.map[key], bg);
        }
        this._drawText();
    }

    update(points, life) {
        this.points = points;
        this.life = life;
        this.draw()
    }

    _drawText = () => {
        let titleBegin = 28;
        this._game.drawHubText(titleBegin, 1, "--------------------");
        this._game.drawHubText(titleBegin, 2, "| ASCII SNAKE GAME |");
        this._game.drawHubText(titleBegin, 3, "--------------------");
        this._drawPoints();
        this._drawLife();
    }

    _drawPoints = () => {
        this._game.drawHubText(this._textBegin, 1, "Points: ");
        this._game.drawHubText(this._valBegin, 1, this.points.toString());
    }

    _drawLife = () => {
        this._game.drawHubText(this._textBegin, 3, "Life: ");
        let cel = this._valBegin;
        for(let i = 0; i < this.life; i++) {
            this._game.drawHubCell(cel, 3, "❤ ", "red");
            cel = cel + 2;
        }
        for(let i = 0; i < this._availableLife - this.life; i++) {
            this._game.drawHubCell(cel, 3, "❤ ", "gray");
            cel = cel + 2;
        }
    }
}