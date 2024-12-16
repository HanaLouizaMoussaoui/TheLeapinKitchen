import Sprite from "../../lib/Sprite.js";
import Player from "../entities/Player.js";
import ImageName from "../enums/ImageName.js";
import { images, context, CANVAS_HEIGHT, CANVAS_WIDTH } from "../globals.js"; 
import Tile from "../objects/Tile.js";
import ProgressBar from "../user-interface/elements/ProgressBar.js";
import { roundedRectangle } from "../../lib/Drawing.js";

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
		this.timeBar = new ProgressBar(5, 5, 50, 7, restaurant.maxTime, restaurant.currentTime);
	}

	render() {
		context.save()
		
	
	
		context.font = '16px cuteCat';
		context.fillStyle = '#5071e6';
		roundedRectangle(
			context,
			18,
			22,
			70,
			40,
			5,
			true,
			false
		);
		context.fillStyle = '#77cf6d';
		roundedRectangle(
			context,
			260,
			22,
			105,
			20,
			5,
			true,
			false
		);
		context.fillStyle = 'white';
		context.textBaseline = 'middle';
		context.textAlign = 'center';
		context.fillText("Level: " + this.levelNumber, CANVAS_WIDTH / 2 - 140, CANVAS_HEIGHT / 2 - 70);
		context.fillText("Money: " + this.player.money + " / " +  this.restaurant.moneyGoal + " $", CANVAS_WIDTH / 2 + 120, CANVAS_HEIGHT / 2 - 70);
		context.fillText("Time: " + this.restaurant.currentTime, CANVAS_WIDTH / 2 - 140,  CANVAS_HEIGHT / 2 - 50);
		this.timeBar.render(CANVAS_WIDTH / 2 - 165, CANVAS_HEIGHT / 2 - 35)
		context.restore()
	}

	update(){
		this.timeBar.update(this.restaurant.currentTime)
	}
}
