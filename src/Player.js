import { DIRS } from "rot-js/lib/index";

const PLAYER_COLOR = "pink";
const HEAD_CHAR = "0";
const BODY_CHAR = "o";

export class Player {
    _x = 0;
    _y = 0;
    _dir = DIRS[8][0];
    _tail = [];
    _alive = true;
    _grow = false;
    _headChar = HEAD_CHAR;
    _bodyChar = BODY_CHAR;
    _color = PLAYER_COLOR;
    _noGoList

    _game = null;

    constructor(game, x, y) {
        this._x = x;
        this._y = y;
        this._game = game;
        this._tail.push({x: x, y: y + 1}, {x: x, y: y + 2}, {x: x+1, y: y + 2})
        this.draw();
        this._startTicker();
    }

    _startTicker = () => {
        var that = this;
        setInterval(function(){that.move(that._dir);}, 500);
    }

    draw = () => {
        if(this._alive) {
            this._game.drawCell(this._x, this._y, HEAD_CHAR, PLAYER_COLOR);
            this._tail.forEach(i => {
                this._game.drawCell(i.x, i.y, BODY_CHAR, PLAYER_COLOR);
            })
        }
    }

    onEvent = (eventOptions) => {
        if(eventOptions.event == "ate") {
            this._eat();
        } else if(eventOptions.event == "die") {
            this._die();
        }
    }

    move = (diff) => {
        var newX = this._x + diff[0];
        var newY = this._y + diff[1];
    
        var newKey = newX + "," + newY;
        if (!(newKey in this._game.map)) { return; } /* cannot move in this direction */
    
        // this._game.clearCell(this._x, this._y);
        this._moveTail(diff)
        this._x = newX;
        this._y = newY;
        this.draw();
        this._game.onPlayerPositionChange(this._x, this._y);
    }

    _eat = () => {
        this._grow = true;
        document.getElementById("beepSound").play();
    }

    _die = () => {
        this._alive = false;
        this._game.clearAll();
        // document.getElementById("dieSound").play();
    }

    _moveTail = (diff) => {
        let prevx = this._x; 
        let prevy = this._y;
        for(let i in this._tail) {
            let curx = this._tail[i].x;
            let cury = this._tail[i].y;
            this._tail[i].x = prevx;
            this._tail[i].y = prevy;
            prevx = curx;
            prevy = cury;
            if(!this._grow) {
                this._game.clearCell(curx, cury);
            }
        }
        if(this._grow) {
            this._grow = false;
            this._tail.push({
                x: prevx,
                y: prevy
            })
        }
    }

    act = () => {
        this._game.lockEngine();
        window.addEventListener("keydown", this);
    }

    handleEvent = (e) => {
        var keyMap = {};
        keyMap[38] = 0; // up
        keyMap[33] = 1;
        keyMap[39] = 2; // right
        keyMap[34] = 3;
        keyMap[40] = 4; // down 
        keyMap[35] = 5;
        keyMap[37] = 6; // left
        keyMap[36] = 7;
    
        var code = e.keyCode;
    
        if(code == 38 && DIRS[8][4] == this._dir ||
            code == 40 && DIRS[8][0] == this._dir ||
            code == 39 && DIRS[8][6] == this._dir ||
            code == 37 && DIRS[8][2] == this._dir) {
            return
        }

        if (!(code in keyMap)) { return; }
    
        var diff = DIRS[8][keyMap[code]];
        this._dir = diff;
        this.move(diff);
        window.removeEventListener("keydown", this);
        this._game.unLockEngine();
    }
}