import { RNG } from "rot-js";


class Item {
    _x = 0;
    _y = 0;
    _char = "";
    _color = "#000";
    _expiry = -1;
    _value = 0;
    _timeout = null;
    _lifeCompleted = 0;
    _dead = false;

    _game = null;

    constructor(game, x, y, char, color, expiry, value) {
        this._x = x;
        this._y = y;
        console.log("Creating ", this._x, this._y)
        this._char = char;
        this._color = color;
        this._game = game;
        this._expiry = expiry;
        this._value = value;
        this.draw();
        this._setTicker();
    }

    draw = () => {
        console.log("Drawing ", this._x, this._y)
        this._game.drawCell(this._x, this._y, this._char, this._color);
    }

    getValue = () => {
        return Math.max(0, this._value - this._lifeCompleted);
    }

    die = () => {
        this._dead = true;
        clearInterval(this._timeout);
    }

    _setTicker =  () => {
        let that = this;
        this._timeout = setInterval(function () {
            that._lifeCompleted++;
            if(that._lifeCompleted > 9) {
                that.die();
                that._game.onItemExpiry(that._x, that._y);
            }
        }, 1000)
    }
}

const fruits = [
    {
        "name" : "Apple",
        "char" : "🍎",
        "color" : "red"
    },
    {
        "name" : "Orange",
        "char" : "🍊",
        "color" : "orange"
    },
    {
        "name" : "Pear",
        "char" : "🍐",
        "color" : "green"
    },
    {
        "name" : "Banana",
        "char" : "🍌",
        "color" : "yellow"
    },
    {
        "name" : "Pineapple",
        "char" : "🍍",
        "color" : "yellow"
    },
    {
        "name" : "Lemon",
        "char" : "🍋",
        "color" : "yellow"
    }
]
function createRandomFruitItem(game, x, y) {
    let itemProp = RNG.getItem(fruits);
    if(!itemProp.expiry) {
        itemProp.expiry = 10;
    }
    if(!itemProp.value) {
        itemProp.value = 10;
    }
    return new Item(game, x, y, itemProp.char, itemProp.color, itemProp.expiry, itemProp.value);
}

export { createRandomFruitItem }