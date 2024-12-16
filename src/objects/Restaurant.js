
import { CANVAS_HEIGHT, CANVAS_WIDTH, images, sounds } from '../globals.js';
import Tile from './Tile.js';
import Vector from '../../lib/Vector.js';
import Sprite from '../../lib/Sprite.js';
import ImageName from '../enums/ImageName.js';
import Table from './Table.js'
import {
	getRandomPositiveInteger,
	pickRandomElement,
} from '../../lib/Random.js';
import Customer from '../entities/Customer.js';
import CustomerFrogFactory from '../services/CustomerFrogFactory.js';
import Frog from '../entities/Frog.js';
import FrogColor from '../enums/FrogColor.js';
import PlayerInteractingState from '../states/entity/PlayerInteractingState.js';
import Counter from './Counter.js';
import { timer } from '../globals.js';
import Timer from '../../lib/Timer.js';
import PlayerCarryingState from '../states/entity/PlayerCarryingState.js';
import CustomerStateName from '../enums/CustomerStateName.js';
import CustomerIdlingState from '../states/entity/CustomerIdlingState.js';
import CustomerWalkingState from '../states/entity/CustomerWalkingState.js';
import SoundName from '../enums/SoundName.js';
import Trash from './Trash.js';
import Tree from './tree.js';

export default class Restaurant {
	static WIDTH = CANVAS_WIDTH / Tile.TILE_SIZE - 2;
	static HEIGHT = Math.floor(CANVAS_HEIGHT / Tile.TILE_SIZE) - 2;
	static RENDER_OFFSET_X = (CANVAS_WIDTH - Restaurant.WIDTH * Tile.TILE_SIZE) / 2;
	static RENDER_OFFSET_Y = (CANVAS_HEIGHT - Restaurant.HEIGHT * Tile.TILE_SIZE) / 2;

	static TOP_EDGE = Restaurant.RENDER_OFFSET_Y + Tile.TILE_SIZE;
	static BOTTOM_EDGE =
		CANVAS_HEIGHT - Restaurant.RENDER_OFFSET_Y - Tile.TILE_SIZE - 5;
	static LEFT_EDGE = Restaurant.RENDER_OFFSET_X + Tile.TILE_SIZE - 5;
	static RIGHT_EDGE = CANVAS_WIDTH - Tile.TILE_SIZE * 2 + 5;
	static CENTER_X = Math.floor(
		Restaurant.LEFT_EDGE + (Restaurant.RIGHT_EDGE - Restaurant.LEFT_EDGE) / 2
	);
	static CENTER_Y = Math.floor(
		Restaurant.TOP_EDGE + (Restaurant.BOTTOM_EDGE - Restaurant.TOP_EDGE) / 2
	);

	static TILE_TOP_LEFT_CORNER = 3;
	static TILE_TOP_RIGHT_CORNER = 4;
	static TILE_BOTTOM_LEFT_CORNER = 22;
	static TILE_BOTTOM_RIGHT_CORNER = 23;
	static TILE_EMPTY = 2;
	static TILE_TOP_WALLS = [57, 58, 59];
	static TILE_BOTTOM_WALLS = [78, 79, 80];
	static TILE_LEFT_WALLS = [76, 95, 114];
	static TILE_RIGHT_WALLS = [77, 96, 115];
	static TILE_FLOORS = 0;
	static TILE_WALLS = 1
	static TABLE_POSITIONS = [
		{ x: 245, y: 100 },
		{ x: 245, y: 50 },
		{ x: 245, y: 150 },
		{ x: 145, y: 150 },
		{ x: 145, y: 50 },
		{ x: 145, y: 100 },
	];

	/**
	 * Represents one individual section of the dungeon complete
	 * with its own set of enemies and a switch that can open the doors.
	 *
	 * @param {Player} player
	 */
	constructor(player, customers, maxTime, moneyGoal, decorations = []) {
		this.player = player;
		this.dimensions = new Vector(Restaurant.WIDTH, Restaurant.HEIGHT);

		this.sprites =[]
		// floor
		this.sprites.push(new Sprite(images.get(ImageName.RestaurantTiles),48, 144, 16, 16));
		// back wall
		this.sprites.push(new Sprite(images.get(ImageName.RestaurantTiles),80, 128, 16, 16));
		// empty
		this.sprites.push(new Sprite(images.get(ImageName.RestaurantTiles),48, 0, 16, 16));
		this.tiles = this.generateWallsAndFloors();
		this.tables = this.generateTables()
		this.counter = this.generateCounter()
		this.decorations = decorations
		this.allCustomers = customers
		this.customerAtDoor = null
		this.currentCustomer = 0
		this.satCustomers = []
		this.ordersToServe = []
		this.trash = this.generateTrashCan()
		this.entities = this.generateEntities()
		this.renderQueue = this.buildRenderQueue();
		this.customerSpawnTimer = new Timer();
		this.maxTime = maxTime
		this.currentTime = maxTime
		this.levelTimer = new Timer();
		this.startLevelTimer()
		this.moneyGoal = moneyGoal
		this.canSpawnNewCustomer = true
		this.timeUp = false;
		this.timerSoundPlayed = false
	}

	update(dt) {
		this.updateEntities(dt)
		this.customerSpawnTimer.update(dt)
		this.levelTimer.update(dt)
		this.currentTime = Math.floor(Math.max(0, this.maxTime - this.levelTimer.totalTime));
		if (this.currentTime == 17 && !this.timerSoundPlayed)
		{
			sounds.play(SoundName.Timer)
			this.timerSoundPlayed = true
		}
		this.counter.update(dt)
		
		if (this.customerAtDoor === null && this.canSpawnNewCustomer){
			this.checkIfTableAvailable()
		}
		this.cleanUpEntities()
	}

	render() {
		this.renderTiles();
		this.renderQueue.forEach((elementToRender) => {
			elementToRender.render(this.adjacentOffset);
		});
	}

	cleanUpEntities(){
		this.entities.forEach((e)=>{
			if (e.cleanUp){
				if (e.pay != 0){
					sounds.play(SoundName.Cash)
					this.player.money += e.pay
				}
			}
		})
		this.entities = this.entities.filter((entity) =>!entity.cleanUp)
		this.renderQueue = this.buildRenderQueue()
	}

	checkIfOrdersReady(){
		this.counter.orders.forEach((order)=>{
			if (order.isReady){
				sounds.play(SoundName.Ready)
				this.ordersToServe.push(order)
			}
		})
		this.counter.orders = this.counter.orders.filter((order) => !order.isReady)
	}
	generateEntities() {
		const entities = []
		entities.push(this.player);
		entities.forEach((e)=>{
			e.reset()
		})
		return entities;
	}


	async checkIfTableAvailable() {
		if (this.customerAtDoor === null && this.currentCustomer < this.allCustomers.length) {
			for (let i = 0; i < this.tables.length; i++) {
				if (this.tables[i].isAvailable) {
					this.customerAtDoor = this.allCustomers[this.currentCustomer];
					this.customerAtDoor.reset();
					this.entities.push(this.customerAtDoor);
					this.customerAtDoor.table = this.tables[i];
					this.tables[i].isAvailable = false;  
					sounds.play(SoundName.New)
					this.renderQueue = this.buildRenderQueue();  
					this.currentCustomer += 1;
					break;  
				}
			}
			
		}
	}
	

	renderTiles() {
		this.tiles.forEach((tileRow) => {
			tileRow.forEach((tile) => {
				tile.render();
			});
		});
	}

	renderTables(){
		this.tables.forEach((table) => {
				table.render();
		});
	}

	buildRenderQueue() {
		return [...this.entities, ...this.tables, ...this.ordersToServe, ...this.decorations, this.counter, this.trash].sort((a, b) => {
			let order = 0;
			const bottomA = a.hitbox.position.y + a.hitbox.dimensions.y;
			const bottomB = b.hitbox.position.y + b.hitbox.dimensions.y;

			if (a.renderPriority < b.renderPriority) {
				order = -1;
			} else if (a.renderPriority > b.renderPriority) {
				order = 1;
			} else if (bottomA < bottomB) {
				order = -1;
			} else {
				order = 1;
			}

			return order;
		});
	}

	generateWallsAndFloors() {
		const tiles = new Array();

		for (let y = 0; y < this.dimensions.y; y++) {
			tiles.push([]);

			for (let x = 0; x < this.dimensions.x; x++) {
				let tileId = Restaurant.TILE_EMPTY;

				if (x === 0 && y === 0) {
					tileId = Restaurant.TILE_WALLS;
				} else if (x === 0 && y === this.dimensions.y - 1) {
					tileId = Restaurant.TILE_FLOORS;
				} else if (x === this.dimensions.x - 1 && y === 0) {
					tileId = Restaurant.TILE_WALLS;
				} else if (
					x === this.dimensions.x - 1 &&
					y === this.dimensions.y - 1
				) {
					tileId = Restaurant.TILE_FLOORS;
				}
				else if (y === 0) {
					tileId = Restaurant.TILE_WALLS
					
				} else if (y === this.dimensions.y - 1) {
	
					tileId = Restaurant.TILE_FLOORS
					
				} else {
					tileId = Restaurant.TILE_FLOORS
				}

				tiles[y].push(
					new Tile(
						x,
						y,
						Restaurant.RENDER_OFFSET_X,
						Restaurant.RENDER_OFFSET_Y,
						this.sprites[tileId]
					)
				);
			}
		}

		return tiles;
	}


		generateCounter() {
			return new Counter(
						new Vector(Counter.WIDTH, Counter.HEIGHT),
						new Vector(
							320,
							90
						), 
						this
					)
				
		}
		
		generateTables() {
			const tables = [];
		
			Restaurant.TABLE_POSITIONS.forEach((position) => {
				tables.push(
					new Table(
						new Vector(Table.WIDTH, Table.HEIGHT),
						new Vector(position.x, position.y),
						this
					)
				);
			});
		
			return tables;
		}
	

	generateTrashCan(){
		return 	new Trash(
			new Vector(Trash.WIDTH, Trash.HEIGHT),
			new Vector(
				319,
				140
			),
			this
		)
	}


	updateEntities(dt) {
		this.entities.forEach((entity) => {
			entity.update(dt);
			this.tables.forEach((object) => {
				if (object.didCollideWithEntity(entity.hitbox)) {
					if (entity instanceof Customer){
						if (!(entity.stateMachine.currentState instanceof CustomerWalkingState))
						{
							object.onCollision(entity);
						}
					}
					else if (entity === this.player && object instanceof Table){
						let customer = this.satCustomers.find((customer) => customer.table == object)
						if (customer){
							if (this.player.stateMachine.currentState instanceof(PlayerInteractingState)){
								if (!customer.hasOrdered){
									sounds.play(SoundName.Order)
									this.counter.addOrder(customer.order)
									customer.hasOrdered = true
								}
							}
							else if(this.player.stateMachine.currentState instanceof(PlayerCarryingState)){
		
								if (customer.hasOrdered && this.player.orderCarrying == customer.order){
									sounds.play(SoundName.Eat)
									customer.eat()
									this.player.stopCarrying()
									
								}
							}
						}
						object.onCollision(entity);
					}
					
					else if (object.isCollidable) {
							object.onCollision(entity);}
				}
			})

			if (this.trash.didCollideWithEntity(this.player.hitbox)){
				this.trash.onCollision(this.player);
				if (this.player.stateMachine.currentState instanceof(PlayerCarryingState) && this.player.orderCarrying){
					this.player.stopCarrying()
				}
				
			}

			if (this.counter.didCollideWithEntity(entity.hitbox)) {
					this.counter.onCollision(entity);
					if (entity === this.player && this.player.stateMachine.currentState instanceof(PlayerInteractingState)){
						for (let i = 0; i < this.counter.orders.length; i++) {
							if (this.counter.orders[i].isReady){
								this.counter.orders[i].gotPickedUp = true;
								this.player.carryOrder(this.counter.orders[i])
								break;
							}
						}
						this.counter.orders = this.counter.orders.filter((order) => !order.gotPickedUp)
						this.renderQueue = this.buildRenderQueue()
					
					}
			}
			
			if (entity === this.player) {
				return;
			}

			if (entity.didCollideWithEntity(this.player) && this.player.stateMachine.currentState instanceof(PlayerInteractingState)) {
				if (entity instanceof Customer){
					if (!entity.isGivenTable && !entity.isSat){
						this.satCustomers.push(entity)
						this.customerAtDoor = null
						entity.goToTable()
						this.canSpawnNewCustomer = false
						this.startCustomerSpawnTimer()
				
					}
				}
			}
		});
			
	};
	

	async startCustomerSpawnTimer(){
		await this.customerSpawnTimer.wait(3).then((value) => {this.canSpawnNewCustomer = true;})
		
	}
	async startLevelTimer(){
		await this.levelTimer.wait(this.maxTime).then((value) => {this.timeUp = true})	
	}

	noTimeLeft(){
		return this.timeUp
	}

	moneyGoalAchieved(){
		return this.player.money >= this.moneyGoal
	}
}
