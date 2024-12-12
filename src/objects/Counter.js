import GameObject from "./GameObject.js";
import Sprite from "../../lib/Sprite.js";
import ImageName from "../enums/ImageName.js";
import { images } from "../globals.js";
import Vector from "../../lib/Vector.js";
import Player from "../entities/Player.js";

export default class Counter extends GameObject {
	static WIDTH = 16;
	static HEIGHT = 56;
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
		this.orders = []
		this.isAvailable = true
	}

	onCollision(collider) {
		super.onCollision(collider);
		
		if (collider instanceof Player) {
			
		}
	}
	

	update(dt){
		this.orders.forEach((order)=>{
			order.update(dt)
		})
	}

	addOrder(order){
		order.startCooking()
		order.counterPos = 90 + (this.orders.length * 12)
		this.orders.push(order)
	}

	
	render(offset = { x: 0, y: 0 }) {
		const x = this.position.x + offset.x;
		const y = this.position.y + offset.y;

		this.sprites[this.currentFrame].render(Math.floor(x), Math.floor(y));
		this.sprites[this.currentFrame].render(Math.floor(x), Math.floor(y + 24));
	}

	
}
