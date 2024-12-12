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
			case 2:
				return LevelMaker.levelTwo();
			default:
				return LevelMaker.levelOne();
		}
	}

	static levelOne() {
		const player = PlayerFrogFactory.createInstance(FrogColor.Green)

		const values = Object.values(FrogColor);
		const randomValue1 = values[Math.floor(Math.random() * values.length)];
		const randomValue2 = values[Math.floor(Math.random() * values.length)];
		const randomValue3 = values[Math.floor(Math.random() * values.length)];

		const customers = [
			CustomerFrogFactory.createInstance(randomValue1),
			CustomerFrogFactory.createInstance(randomValue2),
			CustomerFrogFactory.createInstance(randomValue3),
			CustomerFrogFactory.createInstance(randomValue3)
		];
		
		const maxTime = 51
		const moneyGoal = 10 

		return new Level(1, player, new Restaurant(player, customers, maxTime, moneyGoal));
	}

	static levelTwo() {
		const player = PlayerFrogFactory.createInstance(FrogColor.Green)

		const values = Object.values(FrogColor);
		const randomValue1 = values[Math.floor(Math.random() * values.length)];
		const randomValue2 = values[Math.floor(Math.random() * values.length)];
		const randomValue3 = values[Math.floor(Math.random() * values.length)];

		const customers = [
			CustomerFrogFactory.createInstance(randomValue1),
			CustomerFrogFactory.createInstance(randomValue2),
			CustomerFrogFactory.createInstance(randomValue3),
			CustomerFrogFactory.createInstance(randomValue3)
		];
		
		const maxTime = 60
		const moneyGoal = 20

		return new Level(2, player, new Restaurant(player, customers, maxTime, moneyGoal));
	}
	
}
