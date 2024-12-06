import Animation from '../../../lib/Animation.js';
import Input from '../../../lib/Input.js';
import State from '../../../lib/State.js';
import Player from '../../entities/Player.js';
import Direction from '../../enums/Direction.js';
import PlayerStateName from '../../enums/PlayerStateName.js';
import { input } from '../../globals.js';
import Restaurant from '../../objects/Restaurant.js';

export default class CustomerWalkingState extends State {
	/**
	 * In this state, the player can move around using the
	 * directional keys. From here, the player can go idle
	 * if no keys are being pressed. The player can also swing
	 * their sword if they press the spacebar.
	 *
	 * @param {Player} player
	 */
	constructor(customer) {
		super();

		this.customer = customer;
		this.animation = {
			[Direction.Up]: new Animation([20, 21, 22, 23], 0.1),
			[Direction.Down]: new Animation([12, 13, 14, 15], 0.1),
			[Direction.Left]: new Animation([16, 17, 18, 19], 0.1),
			[Direction.Right]: new Animation([16, 17, 18, 19], 0.1),
		};
	}

	enter() {
		this.customer.currentAnimation = this.animation[this.customer.direction];
	}

	update(dt) {
		this.handleMovement(dt);
	}

	handleMovement(dt) {
		this.customer.currentAnimation = this.animation[this.customer.direction];
	}


}
