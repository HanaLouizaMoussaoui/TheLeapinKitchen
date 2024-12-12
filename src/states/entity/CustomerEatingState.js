import Animation from '../../../lib/Animation.js';
import Input from '../../../lib/Input.js';
import State from '../../../lib/State.js';
import Player from '../../entities/Player.js';
import Direction from '../../enums/Direction.js';
import PlayerStateName from '../../enums/PlayerStateName.js';
import { input } from '../../globals.js';
import Restaurant from '../../objects/Restaurant.js';

export default class CustomerEatingState extends State {
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
			[Direction.Down]: new Animation([1, 2], 0.1)
		};
	}

	enter() {
		this.customer.currentAnimation = this.animation[Direction.Down];
	}

	update(dt) {
		this.handleMovement(dt);
	}

	handleMovement(dt) {
		this.customer.currentAnimation = this.animation[Direction.Down];
	}


}