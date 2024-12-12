import GameEntity from './GameEntity.js';
import { context, DEBUG, images, sounds, timer } from '../globals.js';
import StateMachine from '../../lib/StateMachine.js';
import Hitbox from '../../lib/Hitbox.js';
import ImageName from '../enums/ImageName.js';
import Sprite from '../../lib/Sprite.js';
import Restaurant from '../objects/Restaurant.js';
import Direction from '../enums/Direction.js';
import PlayerStateName from '../enums/PlayerStateName.js';
import SoundName from '../enums/SoundName.js';
import PlayerWalkingState from '../states/entity/PlayerWalkingState.js';
import PlayerInteractingState from '../states/entity/PlayerInteractingState.js';
import PlayerCarryingState from '../states/entity/PlayerCarryingState.js';
import Frog from './Frog.js';


export default class Player extends Frog {

	static MAX_SPEED = 150;
	/**
	 * The hero character the player controls in the map.
	 * Has the ability to swing a sword to kill enemies
	 * and will collide into objects that are collidable.
	 */
	constructor(sprites, frogColor) {
		super(sprites, frogColor);

		/**
		 * Since the regular sprite and sword-swinging sprite are different dimensions,
		 * we need a position offset to make it look like one smooth animation when rendering.
		 */
		this.positionOffset = { x: 0, y: 0 };

		/**
		 * Start the sword's hitbox as nothing for now. Later, in the
		 * PlayerSwordSwingingState, we'll define the actual dimensions.
		 */
		this.swordHitbox = new Hitbox(0, 0, 0, 0, 'blue');

		/**
		 * We don't want the hitbox for the player to be the size of the
		 * whole sprite. Instead, we want a much smaller area relative to
		 * the player's dimensions and position to be used to detect collisions.
		 */

		this.position.x = Restaurant.CENTER_X - Restaurant.WIDTH / 2;
		this.position.y = Restaurant.CENTER_Y - Restaurant.HEIGHT / 2;
		this.speed = Player.MAX_SPEED;
		this.direction = Direction.UP;
		this.stateMachine = this.initializeStateMachine();
		this.money = 0;
		this.orderCarrying = null

	}

	initializeStateMachine() {
		const stateMachine = new StateMachine();
		stateMachine.add(PlayerStateName.Walking, new PlayerWalkingState(this));
		stateMachine.add(PlayerStateName.Interacting, new PlayerInteractingState(this));
		stateMachine.add(PlayerStateName.Carrying, new PlayerCarryingState(this));
		stateMachine.change(PlayerStateName.Walking);
		return stateMachine;
	}

	
	reset() {
		this.position.x = Restaurant.CENTER_X - Player.WIDTH / 2;
		this.position.y = Restaurant.CENTER_Y - Player.HEIGHT / 2;
		this.alpha = 1;
		this.direction = Direction.Down;
		this.stateMachine.change(PlayerStateName.Walking);
	}

	render(scale = { x: 1, y: 1 }){
		super.render(scale)
		if (this.orderCarrying)
		{
			this.orderCarrying.position.x = this.position.x
			this.orderCarrying.position.y = this.position.y - 5
			this.orderCarrying.render()
		}
	}

	carryOrder(order){
		this.orderCarrying = order
		this.stateMachine.change(PlayerStateName.Carrying);
	}
	stopCarrying(){
		this.orderCarrying = null
		this.stateMachine.change(PlayerStateName.Walking);
	}


}
