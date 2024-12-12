import Vector from "../../lib/Vector.js";
import Tile from "../objects/Tile.js";

export default class UserInterfaceElement {
	static FONT_SIZE = Tile.TILE_SIZE * 0.65;

	/**
	 * The base UI element that all interface elements should extend.
	 *
	 * @param {number} x
	 * @param {number} y
	 * @param {number} width
	 * @param {number} height
	 */
	constructor(x, y, width, height) {
		this.position = new Vector(x, y);
		this.dimensions = new Vector(width, height);
	}
}
