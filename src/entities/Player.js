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


export default class Player extends GameEntity {
	static WIDTH = 16;
	static HEIGHT = 16;
	static WALKING_SPRITE_WIDTH = 16;
	static WALKING_SPRITE_HEIGHT = 16;

	
	static INVULNERABLE_DURATION = 1.5;
	static INVULNERABLE_FLASH_INTERVAL = 0.1;
	static MAX_SPEED = 120;
	static MAX_HEALTH = 6;

	/**
	 * The hero character the player controls in the map.
	 * Has the ability to swing a sword to kill enemies
	 * and will collide into objects that are collidable.
	 */
	constructor() {
		super();

		this.walkingSprites = Sprite.generateSpritesFromSpriteSheet(
			images.get(ImageName.GreenFrog),
			Player.WALKING_SPRITE_WIDTH,
			Player.WALKING_SPRITE_HEIGHT
		);

		this.sprites = this.walkingSprites

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
		this.hitboxOffsets = new Hitbox(
			3,
			Player.HEIGHT -5,
			-6,
			-Player.HEIGHT + 6
		);
		this.position.x = Restaurant.CENTER_X - Restaurant.WIDTH / 2;
		this.position.y = Restaurant.CENTER_Y - Restaurant.HEIGHT / 2;
		this.dimensions.x = Player.WIDTH;
		this.dimensions.y = Player.HEIGHT;
		this.speed = Player.MAX_SPEED;
		this.totalHealth = Player.MAX_HEALTH;
		this.health = Player.MAX_HEALTH;
		this.isInvulnerable = false;
		this.alpha = 1;
		this.invulnerabilityTimer = null;
		this.direction = Direction.UP;
		this.stateMachine = this.initializeStateMachine();
	}

	render() {
		context.save();

		context.globalAlpha = this.alpha;

		super.render(this.positionOffset);
		console.log(this.position)

		context.restore();

		if (DEBUG) {
			this.swordHitbox.render(context);
		}
	}


	initializeStateMachine() {
		const stateMachine = new StateMachine();

		stateMachine.add(PlayerStateName.Walking, new PlayerWalkingState(this));

		

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

	receiveDamage(damage) {
		this.health -= damage;
		sounds.play(SoundName.HitPlayer);
	}

	becomeInvulnerable() {
		this.isInvulnerable = true;
		this.invulnerabilityTimer = this.startInvulnerabilityTimer();
	}

	startInvulnerabilityTimer() {
		const action = () => {
			this.alpha = this.alpha === 1 ? 0.5 : 1;
		};
		const interval = Player.INVULNERABLE_FLASH_INTERVAL;
		const duration = Player.INVULNERABLE_DURATION;
		const callback = () => {
			this.alpha = 1;
			this.isInvulnerable = false;
		};

		return timer.addTask(action, interval, duration, callback);
	}
		// Adds one full health to the player making sure it doesn't go over the total health.
	addHealth(){
		this.health = Math.min(this.health+2, this.totalHealth)
	}
}