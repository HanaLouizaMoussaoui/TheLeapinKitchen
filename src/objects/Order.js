import GameObject from "./GameObject.js";
import Sprite from "../../lib/Sprite.js";
import ImageName from "../enums/ImageName.js";
import { images } from "../globals.js";
import Vector from "../../lib/Vector.js";
import Player from "../entities/Player.js";
import Timer from "../../lib/Timer.js";

export default class Order extends GameObject {
	static WIDTH = 14;
	static HEIGHT = 16;
	static HIT = 0;
	static NOT_HIT = 1;

	/**
	 * A toggle that the player can hit to open the dungeon doors.
	 *
	 * @param {Vector} dimensions
	 * @param {Vector} position
	 */
	constructor(dimensions, position) {
		super(dimensions, position);

		this.isCollidable = true;
		this.isSolid = true;

        this.sprites.push(new Sprite(images.get(ImageName.Burger),0, 0, 14, 16));

	//	this.restaurant = restaurant;
		this.cookingTime = 5
        this.timer = new Timer();
        this.isReady = false
        this.renderPriority = 3
        this.gotPickedUp = false
        

	}

	onCollision(collider) {
		super.onCollision(collider);
		
		if (collider instanceof Player) {
			// 
		}
	}

    update(dt){
        this.timer.update(dt)
    }

    async startCooking(){
		await this.timer.wait(this.cookingTime).then((value) => {this.isReady = true;})
		
	}
}
