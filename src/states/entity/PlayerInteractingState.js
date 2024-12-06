import Animation from '../../../lib/Animation.js';
import Input from '../../../lib/Input.js';
import State from '../../../lib/State.js';
import Player from '../../entities/Player.js';
import Direction from '../../enums/Direction.js';
import PlayerStateName from '../../enums/PlayerStateName.js';
import { input } from '../../globals.js';
import Restaurant from '../../objects/Restaurant.js';

export default class PlayerInteractingState extends State {
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
			[Direction.Up]: new Animation([0,1,2,3], 0.3,2),
			[Direction.Down]: new Animation([0,1,2,3], 0.3,2),
			[Direction.Left]: new Animation([0,1,2,3], 0.3,2),
			[Direction.Right]: new Animation([0,1,2,3], 0.3,2),
		};
	}

	enter() {
		this.player.currentAnimation = this.animation[this.player.direction];
	}

	update(dt) {
		// Idle carry once one lift animation cycle has been played.
		if (this.player.currentAnimation.isDone()) {
			this.player.currentAnimation.refresh();
			this.player.changeState(PlayerStateName.Walking);
		}
	}


}
