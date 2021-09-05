import { RNG } from "rot-js";


class Item {
    _x = 0;
    _y = 0;
    _char = "";
    _color = "#000"

    _game = null;

    constructor(game, x, y, char, color) {
        this._x = x;
        this._y = y;
        this._char = char;
        this._color = color;
        this._game = game;
        this.draw();
    }

    draw = () => {
        this._game.drawCell(this._x, this._y, this._char, this._color);
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

export default function createRandomItem(game, x, y) {
    let itemProp = RNG.getItem(items);
    return new Item(game, x, y, itemProp.char, itemProp.color);
}