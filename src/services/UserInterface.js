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
	constructor(levelNumber, player, restaurant) {
		this.levelNumber = levelNumber
		this.player = player;
		this.restaurant = restaurant
	}

	render() {
		context.save()
		context.font = '16px cuteCat';
		context.fillStyle = 'white';
		context.textBaseline = 'middle';
		context.textAlign = 'center';
		context.fillText("Level: " + this.levelNumber, CANVAS_WIDTH / 2 - 140, CANVAS_HEIGHT / 2 - 90);
		context.fillText("Money: " + this.player.money + " / " +  this.restaurant.moneyGoal + " $", CANVAS_WIDTH / 2 - 140, CANVAS_HEIGHT / 2 - 70);
		context.fillText("Time: " + this.restaurant.maxTime, CANVAS_WIDTH / 2 - 140, CANVAS_HEIGHT / 2 - 50);
		context.restore()
	}
}
