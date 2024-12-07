import GameObject from "./GameObject.js";
import Sprite from "../../lib/Sprite.js";
import ImageName from "../enums/ImageName.js";
import { images } from "../globals.js";
import Vector from "../../lib/Vector.js";
import Player from "../entities/Player.js";

export default class Counter extends GameObject {
	static WIDTH = 16;
	static HEIGHT = 32;
	static HIT = 0;
	static NOT_HIT = 1;

	/**
	 * A toggle that the player can hit to open the dungeon doors.
	 *
	 * @param {Vector} dimensions
	 * @param {Vector} position
	 */
	constructor(dimensions, position, restaurant) {
		super(dimensions, position);

		this.isCollidable = true;
		this.isSolid = true;

        this.sprites.push(new Sprite(images.get(ImageName.RestaurantTiles),0, 8, 16, 32));

		this.restaurant = restaurant;
		this.isAvailable = true
	}

	onCollision(collider) {
		super.onCollision(collider);
		
		if (collider instanceof Player) {
			// 
		}
	}
}
