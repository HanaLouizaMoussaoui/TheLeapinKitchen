
import {
	context,
	DEBUG
} from "../globals.js";
import UserInterface from "../services/UserInterface.js";

export default class Level {
	/**
	 * The Level contains all the pieces to play the game.
	 *
	 * @param {number} number The current level's number.
	 * @param {Fortress} fortress
	 * @param {BirdQueue} birdQueue
	 */
	constructor(number, player, restaurant) {
		this.number = number;
		this.player = player;
		this.restaurant = restaurant;
		this.userInterface = new UserInterface(player)
	}

	update(dt) {
		this.restaurant.update(dt);
	}

	render() {
		this.restaurant.render();
		this.userInterface.render()
	}

	renderStatistics() {
		context.fillStyle = 'navy';
		context.font = '60px AngryBirds';
		context.fillText(`Level: ${this.number}`, 50, 100);

		if (DEBUG) {
			context.fillText(`Birds: ${this.birdQueue.birds.length + (this.slingshot.bird === null ? 0 : 1)}`, 50, 190);
			context.fillText(`Blocks: ${this.fortress.blocks.length}`, 50, 280);
			context.fillText(`Pigs: ${this.fortress.pigs.length}`, 50, 370);
			context.fillText(`Bodies: ${matter.Composite.allBodies(world).length - 1}`, 50, 460);
		}
	}

	didWin() {
		return this.fortress.areNoPigsLeft();
	}

	didLose() {
		return this.birdQueue.areNoBirdsLeft() && this.slingshot.isEmpty();
	}
}
