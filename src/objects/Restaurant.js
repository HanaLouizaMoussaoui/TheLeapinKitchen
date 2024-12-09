
import { CANVAS_HEIGHT, CANVAS_WIDTH, images } from '../globals.js';
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

	/**
	 * Represents one individual section of the dungeon complete
	 * with its own set of enemies and a switch that can open the doors.
	 *
	 * @param {Player} player
	 */
	constructor(player, customers, maxTime, moneyGoal) {
		this.player = player;
		this.dimensions = new Vector(Restaurant.WIDTH, Restaurant.HEIGHT);

		this.sprites =[]
		// floor
		this.sprites.push(new Sprite(images.get(ImageName.RestaurantTiles),48, 144, 16, 16));
		// back wall
		this.sprites.push(new Sprite(images.get(ImageName.RestaurantTiles),80, 128, 16, 16));
		// empty
		this.sprites.push(new Sprite(images.get(ImageName.RestaurantTiles),48, 0, 16, 16));

		//this.sprites = Sprite.generateSpritesFromSpriteSheet(
		//	images.get(ImageName.Tiles),
		//	Tile.TILE_SIZE,
		//	Tile.TILE_SIZE
		//);
		this.tiles = this.generateWallsAndFloors();
		
		//this.customers = this.generateCustomers();
		this.tables = this.generateTables()
		this.counter = this.generateCounter()
		//this.renderQueue = this.buildRenderQueue();
		this.allCustomers = customers
		this.customerAtDoor = null
		this.currentCustomer = 0
		this.satCustomers = []
		this.ordersToServe = []
		this.entities = this.generateEntities()
		this.renderQueue = this.buildRenderQueue();
		this.customerSpawnTimer = new Timer();
		this.maxTime = maxTime
		this.levelTimer = new Timer();
		this.startLevelTimer()
		this.moneyGoal = moneyGoal
		this.canSpawnNewCustomer = true
		this.timeUp = false;

		
		

	}

	update(dt) {
		this.updateEntities(dt)
		this.customerSpawnTimer.update(dt)
		this.levelTimer.update(dt)
		this.counter.update(dt)
		this.checkIfOrdersReady()
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
		let entitiesBefore = this.entities.length
		this.entities = this.entities.filter((entity) =>!entity.cleanUp)
		let entitiesAfter = this.entities.length
		if (entitiesAfter < entitiesBefore){
			this.player.money += 5
			this.renderQueue = this.buildRenderQueue()
		}

	}

	checkIfOrdersReady(){
		this.counter.orders.forEach((order)=>{
			if (order.isReady){
				this.ordersToServe.push(order)
				this.renderQueue = this.buildRenderQueue(); 
			}
		})
		this.counter.orders = this.counter.orders.filter((order) => !order.isReady)
	}
	generateEntities() {
		const entities = []

		entities.push(this.player);


	
	

		//this.tables.forEach((table) =>{
		//	if (table.isAvailable){
			//	let newFrog = CustomerFrogFactory.createInstance(FrogColor.Pink)
			//	newFrog.reset()
			//	newFrog.position.y = Restaurant.CENTER_Y - Customer.HEIGHT / 2 + Math.floor(Math.random() * 20)
			//	newFrog.table = table
			//	table.isAvailable = false
			//	entities.push(newFrog)
			//}
		//}	
		//);

		entities.forEach((e)=>{
			e.reset()
		})

		//


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
		return [...this.entities, ...this.tables, ...this.ordersToServe, this.counter].sort((a, b) => {
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
	/**
	 * Uses the constants defined at the top of the class and determines which
	 * sprites to use for the walls and floor. Since there are several potential
	 * tiles to use for a piece of wall or floor, we can have a slightly different
	 * look each time we create a new room.
	 *
	 * @returns An array containing the walls and floors of the room, randomizing the tiles for visual variety.
	 */
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


		/**
	 * @returns An array of objects for the player to interact with.
	 */
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
	

	/**
	 * @returns An array of objects for the player to interact with.
	 */
	generateTables() {
		const tables = [];


			tables.push(
				new Table(
					new Vector(Table.WIDTH, Table.HEIGHT),
					new Vector(
						245,
						100
					), 
					this
				)
			);
	
			
			tables.push(
				new Table(
					new Vector(Table.WIDTH, Table.HEIGHT),
					new Vector(
						245,
						50
					),
					this
				)
			);

			
			tables.push(
				new Table(
					new Vector(Table.WIDTH, Table.HEIGHT),
					new Vector(
						245,
						150
					),
					this
				)
			);

			tables.push(
				new Table(
					new Vector(Table.WIDTH, Table.HEIGHT),
					new Vector(
						145,
						150
					),
					this
				)
			);
		
		
			
			tables.push(
				new Table(
					new Vector(Table.WIDTH, Table.HEIGHT),
					new Vector(
						145,
						50
					),
					this
				)
			);
		
		

			
			tables.push(
				new Table(
					new Vector(Table.WIDTH, Table.HEIGHT),
					new Vector(
						145,
						100
					),
					this
				)
			);
		
		

			
		


		return tables;
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
									this.counter.addOrder(customer.order)
									customer.hasOrdered = true
								}
							}
							else if(this.player.stateMachine.currentState instanceof(PlayerCarryingState)){
		
								if (customer.hasOrdered && this.player.orderCarrying == customer.order){
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

			if (this.counter.didCollideWithEntity(entity.hitbox)) {
					this.counter.onCollision(entity);
					if (entity === this.player && this.player.stateMachine.currentState instanceof(PlayerInteractingState)){
						if (this.ordersToServe[0]){
							this.ordersToServe[0].gotPickedUp = true;
							this.player.carryOrder(this.ordersToServe[0])
							this.ordersToServe = this.ordersToServe.filter((order) => !order.gotPickedUp)
							this.renderQueue = this.buildRenderQueue()
						}
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
		await this.levelTimer.wait(this.maxTime).then((value) => {this.timeUp = true
			console.log("done")
		})
		
	}

	noTimeLeft(){
		return this.timeUp
	}

	moneyGoalAchieved(){
		return this.player.money >= this.moneyGoal
	}



}
