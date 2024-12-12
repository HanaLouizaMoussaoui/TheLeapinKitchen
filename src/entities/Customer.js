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
import CustomerEatingState from '../states/entity/CustomerEatingState.js';
import Order from '../objects/Order.js';
import Vector from '../../lib/Vector.js';
import Timer from '../../lib/Timer.js';
import OrderFactory from '../services/OrderFactory.js';
import ProgressBar from '../user-interface/elements/ProgressBar.js';

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

		this.position.x = 30;
		this.position.y = Restaurant.CENTER_Y - Restaurant.HEIGHT / 2;
		this.speed = Frog.MAX_SPEED;
		this.direction = Direction.DOWN;
		this.stateMachine = this.initializeStateMachine();
		this.table = null;
		this.isGivenTable = false
		this.isSat = false
		this.hasOrdered= false
		this.order = OrderFactory.createInstance()
		this.eatTimer = new Timer()
		this.patienceTimer = new Timer()
		this.patience = 30
		this.timeWaiting = 0
		this.patienceBar = new ProgressBar(5, 5, 20, 4, this.patience, this.timeWaiting);
		this.readyToGo = false;
		this.isEating = false
		this.pay = 5
		this.eatingTime = 5
	}

	initializeStateMachine() {
		const stateMachine = new StateMachine();
		stateMachine.add(CustomerStateName.Eating, new CustomerEatingState(this));
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

	render(){
		super.render()
		if (this.isSat && !this.isEating && !this.readyToGo){
			this.patienceBar.render(this.position.x - 2,this.position.y)
		}
		if (this.order != null){
			
			if (this.isEating)	{
				this.order.position.x = this.position.x
				this.order.position.y = this.position.y + 10
				this.order.render()
			}
			else if (this.order.isReady &&  !this.order.gotPickedUp){
				this.order.position.x = 320
				console.log(this.order.counterPos)
				this.order.position.y = this.order.counterPos
				this.order.render()
			}
			else if (this.hasOrdered && !this.order.gotPickedUp){
				this.order.position.x = this.position.x
				this.order.position.y = this.position.y - 10
				this.order.render()

			}
			
		}

			
	}

	goToTable(){
		this.isGivenTable = true;
		this.direction = Direction.Right
		this.stateMachine.change(CustomerStateName.Walking);
	
	}
	
	update(dt){
		super.update(dt)
		let didMove = false;
		this.eatTimer.update(dt)
		if (this.isSat && !this.isEating && !this.readyToGo){
			this.patienceTimer.update(dt)
			this.timeWaiting = Math.floor(Math.max(0, this.patience - this.patienceTimer.totalTime));
			this.patienceBar.update(this.timeWaiting)
		}
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
				this.startPatienceTimer()
				this.stateMachine.change(CustomerStateName.Idle)
			}
		}
		else if (this.readyToGo){
		    if (this.position.x > 30 ){
				didMove = true;
				this.position.x -= 1;
				this.hitbox.position.x -= 1;
			}
			if (!didMove){
				this.cleanUp = true
			}
		}
		

	}
	generateOrder(){
		let newOrder = new Order(new Vector(Order.WIDTH, Order.HEIGHT),
		new Vector(
			320,
			90
		))
		return newOrder;
	}

	eat(){
		this.stateMachine.change(CustomerStateName.Eating)
		this.startEatingTimer()
		this.isEating = true
	}
	async startEatingTimer(){
		await this.eatTimer.wait(this.eatingTime).then((value) => {
			this.isEating = false
			this.readyToGo = true;
			this.order = null
			this.direction = Direction.Left
			this.stateMachine.change(CustomerStateName.Walking)
		})
		
	}
	async startPatienceTimer(){
		await this.patienceTimer.wait(this.patience).then((value) => {
			this.pay = 0
			this.isEating = false
			this.readyToGo = true;
			this.order = null
			this.direction = Direction.Left
			this.stateMachine.change(CustomerStateName.Walking)
		})
		
	}

}
