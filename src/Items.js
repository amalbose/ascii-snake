import { RNG } from "rot-js";


class Item {
    _x = 0;
    _y = 0;
    _char = "";
    _color = "#000";
    _expiry = -1;
    _timeout = null;
    _dead = false;

    _game = null;

    constructor(game, x, y, char, color, expiry) {
        this._x = x;
        this._y = y;
        console.log("Creating ", this._x, this._y)
        this._char = char;
        this._color = color;
        this._game = game;
        this._expiry = expiry;
        this.draw();
        this._setExpiry();
    }

    draw = () => {
        console.log("Drawing ", this._x, this._y)
        this._game.drawCell(this._x, this._y, this._char, this._color);
    }

    _setExpiry =  () => {
        let that = this;
        this._timeout = setTimeout(function () {
            console.log("Item expired");
            that._game.onItemExpiry(that._x, that._y);
        }, this._expiry * 1000)
    }
}

const items = [
    {
        "name" : "Apple",
        "char" : "🍎",
        "color" : "red"
    },
    {
        "name" : "Orange",
        "char" : "🍊",
        "color" : "orange",
        "expiry": 10
    },
    {
        "name" : "Pear",
        "char" : "🍐",
        "color" : "green",
        "expiry": 10
    },
    {
        "name" : "Banana",
        "char" : "🍌",
        "color" : "yellow",
        "expiry": 10
    },
    {
        "name" : "Pineapple",
        "char" : "🍍",
        "color" : "yellow",
        "expiry": 10
    },
    {
        "name" : "Lemon",
        "char" : "🍋",
        "color" : "yellow",
        "expiry": 10
    }
]

export default function createRandomItem(game, x, y) {
    let itemProp = RNG.getItem(items);
    return new Item(game, x, y, itemProp.char, itemProp.color, itemProp.expiry);
}