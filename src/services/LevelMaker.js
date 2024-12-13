import CustomerFrogFactory from "./CustomerFrogFactory.js";
import { CANVAS_HEIGHT } from "../globals.js";
import PlayerFrogFactory from "./PlayerFrogFactory.js";
import FrogColor from "../enums/FrogColor.js";
import Level from "../objects/Level.js";
import Restaurant from "../objects/Restaurant.js";
import Tree from "../objects/tree.js";
import Vector from "../../lib/Vector.js";
import Rug from "../objects/Rug.js";
import Flowers from "../objects/Flowers.js";

/**
 * Encapsulates all logic to create a level
 * that contains pigs, blocks, and birds.
 */
export default class LevelMaker {
	static START_X = 1500;
	static ChosenFrogColor = FrogColor.Green

	static createLevel(level = 1) {
		switch (level) {
			case 1:
				return LevelMaker.levelOne();
			case 2:
				return LevelMaker.levelTwo();
			case 3:
				return LevelMaker.levelThree();
			default:
				return LevelMaker.levelOne();
		}
	}

	static levelOne() {
		const player = PlayerFrogFactory.createInstance(LevelMaker.ChosenFrogColor)

		const values = Object.values(FrogColor);
		const randomValue1 = values[Math.floor(Math.random() * values.length)];
		const randomValue2 = values[Math.floor(Math.random() * values.length)];
		const randomValue3 = values[Math.floor(Math.random() * values.length)];

		const customers = [
			CustomerFrogFactory.createInstance(randomValue1),
			CustomerFrogFactory.createInstance(randomValue2),
			CustomerFrogFactory.createInstance(randomValue3)
		];
		
		const maxTime = 51
		const moneyGoal = 10 

		let decorations = []
		decorations.push(new Tree(
			new Vector(Tree.WIDTH, Tree.HEIGHT),
			new Vector(
				100,
				150
			)
		))
		decorations.push(new Tree(
			new Vector(Tree.WIDTH, Tree.HEIGHT),
			new Vector(
				100,
				20
			)
		))


		return new Level(1, player, new Restaurant(player, customers, maxTime, moneyGoal, decorations));
	}

	static levelTwo() {
		const player = PlayerFrogFactory.createInstance(LevelMaker.ChosenFrogColor)

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

		
		let decorations = []
		decorations.push(new Tree(
			new Vector(Rug.WIDTH, Rug.HEIGHT),
			new Vector(
				100,
				150
			)
		))
		decorations.push(new Tree(
			new Vector(Rug.WIDTH, Rug.HEIGHT),
			new Vector(
				100,
				20
			)
		))
		decorations.push(new Rug(
			new Vector(Rug.WIDTH, Rug.HEIGHT),
			new Vector(
				25,
				85
			)
		))


		
		const maxTime = 61
		const moneyGoal = 15

		return new Level(2, player, new Restaurant(player, customers, maxTime, moneyGoal, decorations));
	}
	
	static levelThree() {
		const player = PlayerFrogFactory.createInstance(LevelMaker.ChosenFrogColor)

		const values = Object.values(FrogColor);
		const randomValue1 = values[Math.floor(Math.random() * values.length)];
		const randomValue2 = values[Math.floor(Math.random() * values.length)];
		const randomValue3 = values[Math.floor(Math.random() * values.length)];

		const customers = [
			CustomerFrogFactory.createInstance(randomValue1),
			CustomerFrogFactory.createInstance(randomValue2),
			CustomerFrogFactory.createInstance(randomValue3),
			CustomerFrogFactory.createInstance(randomValue1)
		];

		
		let decorations = []
		decorations.push(new Tree(
			new Vector(Rug.WIDTH, Rug.HEIGHT),
			new Vector(
				100,
				150
			)
		))
		decorations.push(new Tree(
			new Vector(Rug.WIDTH, Rug.HEIGHT),
			new Vector(
				100,
				20
			)
		))
		decorations.push(new Rug(
			new Vector(Rug.WIDTH, Rug.HEIGHT),
			new Vector(
				25,
				85
			)
		))
		decorations.push(new Flowers(
			new Vector(Flowers.WIDTH, Flowers.HEIGHT),
			new Vector(
				200,
				30
			)
		))

		
		const maxTime = 71
		const moneyGoal = 25

		return new Level(2, player, new Restaurant(player, customers, maxTime, moneyGoal, decorations));
	}
	
}
