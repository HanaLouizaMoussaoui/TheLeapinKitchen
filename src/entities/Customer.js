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
import CustomerWalkingState from '../states/entity/CustomerWalkingState.js';
import CustomerStateName from '../enums/CustomerStateName.js';
import Frog from './Frog.js';
import CustomerIdlingState from '../states/entity/CustomerIdlingState.js';


export default class Customer extends Frog {


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

		this.position.x = 30;
		this.position.y = Restaurant.CENTER_Y - Restaurant.HEIGHT / 2;
		this.speed = Frog.MAX_SPEED;
		this.direction = Direction.DOWN;
		this.stateMachine = this.initializeStateMachine();
		this.table = null;
		this.isGivenTable = false
		this.isSat = false
	}

	initializeStateMachine() {
		const stateMachine = new StateMachine();
		stateMachine.add(CustomerStateName.Walking, new CustomerWalkingState(this));
		stateMachine.add(CustomerStateName.Idle, new CustomerIdlingState(this));
		stateMachine.change(CustomerStateName.Idle);
		return stateMachine;
	}

    reset() {
		this.position.x = 30 + Math.floor(Math.random() * 20)
		this.position.y = (Restaurant.CENTER_Y - Customer.HEIGHT / 2) + Math.floor(Math.random() * 20);
		this.alpha = 1;
		this.direction = Direction.Down;
		this.stateMachine.change(CustomerStateName.Idle);
	}

	goToTable(){
		this.isGivenTable = true;
		this.direction = Direction.Right
		this.stateMachine.change(CustomerStateName.Walking);
	
	}
	
	update(dt){
		super.update(dt)
		let didMove = false;
		if (this.isGivenTable){
		
			if (this.position.y != this.table.position.y - 10){
				didMove = true
				if (this.position.y > this.table.position.y - 10 ){
					this.position.y -= 1;
					this.hitbox.position.y -= 1;
				}
				else{
					this.position.y += 1;
					this.hitbox.position.y += 1;
				}
			}
		    if (this.position.x < this.table.position.x ){
				didMove = true;
				this.position.x += 1;
				this.hitbox.position.x += 1;
			}
			if (!didMove){
				this.isGivenTable = false
				this.isSat = true
				this.stateMachine.change(CustomerStateName.Idle)
			}
		}
		

	}

}
