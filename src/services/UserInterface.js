import Sprite from "../../lib/Sprite.js";
import Player from "../entities/Player.js";
import ImageName from "../enums/ImageName.js";
import { images, context, CANVAS_HEIGHT, CANVAS_WIDTH } from "../globals.js"; 
import Tile from "../objects/Tile.js";

export default class UserInterface {

	/**
	 * Displays the number of hearts in the top-left corner.
	 *
	 * @param {Player} player
	 */
	constructor(player) {
		this.player = player;
	}

	render() {
		context.save()
		context.font = '14px pixel';
		context.fillStyle = 'white';
		context.textBaseline = 'middle';
		context.textAlign = 'center';
		context.fillText("Money: " + this.player.money + "$", CANVAS_WIDTH / 2 - 140, CANVAS_HEIGHT / 2 - 70);
		context.restore()
	}
}
