import GameEntity from './GameEntity.js';
import { context, DEBUG, images, sounds, timer } from '../globals.js';
import StateMachine from '../../lib/StateMachine.js';
import PlayerWalkingState from '../states/entity/PlayerWalkingState.js';
import PlayerStateName from '../enums/PlayerStateName.js';
import Hitbox from '../../lib/Hitbox.js';
import ImageName from '../enums/ImageName.js';
import Sprite from '../../lib/Sprite.js';
import Direction from '../enums/Direction.js';
import SoundName from '../enums/SoundName.js';
import Restaurant from '../objects/Restaurant.js';
import Player from './Player.js';

export default class Frog extends GameEntity {
	static WIDTH = 16;
	static HEIGHT = 16;
	static WALKING_SPRITE_WIDTH = 16;
	static WALKING_SPRITE_HEIGHT = 32;
	static SWORD_SWINGING_SPRITE_WIDTH = 32;
	static SWORD_SWINGING_SPRITE_HEIGHT = 32;
	static POT_LIFTING_SPRITE_WIDTH = 16;
	static POT_LIFTING_SPRITE_HEIGHT = 32;
	static POT_CARRYING_SPRITE_WIDTH = 16;
	static POT_CARRYING_SPRITE_HEIGHT = 32;
	
	static INVULNERABLE_DURATION = 1.5;
	static INVULNERABLE_FLASH_INTERVAL = 0.1;
	static MAX_SPEED = 100;
	static MAX_HEALTH = 6;

	/**
	 * The hero character the player controls in the map.
	 * Has the ability to swing a sword to kill enemies
	 * and will collide into objects that are collidable.
	 */
	constructor(sprites, color) {
        super();

        this.color = color;
		this.sprites = sprites;
		this.position.x = Restaurant.CENTER_X - Restaurant.WIDTH / 2;
		this.position.y = Restaurant.CENTER_Y - Restaurant.HEIGHT / 2;
		this.hitboxOffsets = new Hitbox(
			3,
			Frog.HEIGHT -5,
			-6,
			-10
		);
		this.dimensions.x = Frog.WIDTH;
		this.dimensions.y = Frog.HEIGHT;
		this.alpha = 1;
	}



	render(){
		context.save();
		context.globalAlpha = this.alpha;
		if (this.direction == Direction.Left){	
			context.scale(-1, 1)
			context.translate(
				Math.floor(-this.position.x - this.dimensions.x),
				Math.floor(this.position.y)
			)
		}
		else{
			context.translate(
				Math.floor(this.position.x),
				Math.floor(this.position.y)
			)
		}
		this.sprites[this.currentAnimation.getCurrentFrame()].render(0,0);
		context.restore();
		if (DEBUG) {
			this.hitbox.render(context);
		}
	
	}


	initializeStateMachine() {
		const stateMachine = new StateMachine();
		stateMachine.add(PlayerStateName.Walking, new PlayerWalkingState(this));
		stateMachine.change(PlayerStateName.Walking);
		return stateMachine;
	}



}
