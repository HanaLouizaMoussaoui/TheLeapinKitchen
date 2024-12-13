import GameObject from "./GameObject.js";
import Sprite from "../../lib/Sprite.js";
import ImageName from "../enums/ImageName.js";
import { images } from "../globals.js";
import Vector from "../../lib/Vector.js";
import Player from "../entities/Player.js";
import Hitbox from "../../lib/Hitbox.js";
import PlayerInteractingState from "../states/entity/PlayerInteractingState.js";

export default class Tree extends GameObject {
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
	constructor(dimensions, position) {
		super(dimensions, position);

		this.isCollidable = true;
		this.isSolid = true;
		this.hitbox = new Hitbox(
			this.position.x + 3,
			this.position.y + 5,
			this.dimensions.x - 4,
			this.dimensions.y - 5,
		);

        this.sprites.push(new Sprite(images.get(ImageName.RestaurantTiles),112, 64, 16, 32));

	}

	onCollision(collider) {
		super.onCollision(collider);
	}
}
