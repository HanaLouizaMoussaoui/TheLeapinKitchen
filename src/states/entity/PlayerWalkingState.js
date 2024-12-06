import Animation from '../../../lib/Animation.js';
import Input from '../../../lib/Input.js';
import State from '../../../lib/State.js';
import Player from '../../entities/Player.js';
import Direction from '../../enums/Direction.js';
import PlayerStateName from '../../enums/PlayerStateName.js';
import { input } from '../../globals.js';
import Restaurant from '../../objects/Restaurant.js';

export default class PlayerWalkingState extends State {
	/**
	 * In this state, the player can move around using the
	 * directional keys. From here, the player can go idle
	 * if no keys are being pressed. The player can also swing
	 * their sword if they press the spacebar.
	 *
	 * @param {Player} player
	 */
	constructor(player) {
		super();

		this.player = player;
		this.animation = {
			[Direction.Up]: new Animation([20, 21, 22, 23], 0.1),
			[Direction.Down]: new Animation([12, 13, 14, 15], 0.1),
			[Direction.Left]: new Animation([16, 17, 18, 19], 0.1),
			[Direction.Right]: new Animation([16, 17, 18, 19], 0.1),
		};
	}

	enter() {
		this.player.currentAnimation = this.animation[this.player.direction];
	}

	update(dt) {
		this.handleMovement(dt);
		this.checkForInteraction();
	}

	handleMovement(dt) {
		this.player.currentAnimation = this.animation[this.player.direction];

		if (input.isKeyPressed(Input.KEYS.S)) {
			this.player.direction = Direction.Down;
			this.player.position.y += this.player.speed * dt;

			if (
				this.player.position.y + this.player.dimensions.y >=
				Restaurant.BOTTOM_EDGE
			) {
				this.player.position.y =
					Restaurant.BOTTOM_EDGE - this.player.dimensions.y;
			}
		} else if (input.isKeyPressed(Input.KEYS.D)) {
			this.player.direction = Direction.Right;
			this.player.position.x += this.player.speed * dt;

			if (
				this.player.position.x + this.player.dimensions.x >=
				Restaurant.RIGHT_EDGE
			) {
				this.player.position.x =
					Restaurant.RIGHT_EDGE - this.player.dimensions.x;
			}
		} else if (input.isKeyPressed(Input.KEYS.W)) {
			this.player.direction = Direction.Up;
			this.player.position.y -= this.player.speed * dt;

			if (
				this.player.position.y <=
				Restaurant.TOP_EDGE - this.player.dimensions.y
			) {
				this.player.position.y =
					Restaurant.TOP_EDGE - this.player.dimensions.y;
			}
		} else if (input.isKeyPressed(Input.KEYS.A)) {
			this.player.direction = Direction.Left;
			this.player.position.x -= this.player.speed * dt;

			if (this.player.position.x <= Restaurant.LEFT_EDGE) {
				this.player.position.x = Restaurant.LEFT_EDGE
			}
		} else {
			//this.player.changeState(PlayerStateName.Idle);
		}
	}

	checkForInteraction() {
		if (input.isKeyPressed(Input.KEYS.T)) {
			this.player.changeState(PlayerStateName.Interacting);
		}
	}


}
