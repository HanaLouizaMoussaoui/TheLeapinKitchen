import CustomerFrogFactory from "./CustomerFrogFactory.js";
import { CANVAS_HEIGHT } from "../globals.js";
import PlayerFrogFactory from "./PlayerFrogFactory.js";
import FrogColor from "../enums/FrogColor.js";
import Level from "../objects/Level.js";
import Restaurant from "../objects/Restaurant.js";

/**
 * Encapsulates all logic to create a level
 * that contains pigs, blocks, and birds.
 */
export default class LevelMaker {
	static START_X = 1500;

	static createLevel(level = 1) {
		switch (level) {
			case 1:
				return LevelMaker.levelOne();
	
			default:
				return LevelMaker.levelOne();
		}
	}

	static levelOne() {
		const player = PlayerFrogFactory.createInstance(FrogColor.Green)

		const values = Object.values(FrogColor);
		const randomValue = values[Math.floor(Math.random() * values.length)];

		const customers = [
			CustomerFrogFactory.createInstance(randomValue),
			CustomerFrogFactory.createInstance(randomValue),
			CustomerFrogFactory.createInstance(randomValue)
		];

		return new Level(1, player, new Restaurant(player, customers));
	}

	
}
