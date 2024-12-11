
import FrogColor from "../enums/FrogColor.js";
import Sprite from "../../lib/Sprite.js";
import Frog from "../entities/Frog.js";
import { images } from "../globals.js";
import ImageName from "../enums/ImageName.js";
import Tile from "../objects/Tile.js";
import Customer from "../entities/Customer.js";
import Order from "../objects/Order.js";
import Vector from "../../lib/Vector.js";
/**
 * Encapsulates all definitions for instantiating new enemies.
 */
export default class OrderFactory {
	/**
	 * @returns An instance of an order
	 */
	static createInstance() {
        let sprites = []
		const allFoods = [0, 1, 2, 3, 5, 7, 8, 9, 10, 11]
		const randomValue1 = Math.floor(Math.random() * allFoods.length)
        sprites.push(new Sprite(images.get(ImageName.Foods),allFoods[randomValue1] * 16, 0, 16, 16))

        let newOrder = new Order(new Vector(Order.WIDTH, Order.HEIGHT), new Vector(	320,
			90
		), sprites )
        return newOrder;
	}
}
