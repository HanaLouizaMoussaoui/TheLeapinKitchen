
import { CANVAS_HEIGHT, CANVAS_WIDTH, images } from '../globals.js';
import Tile from './Tile.js';
import Vector from '../../lib/Vector.js';
import Sprite from '../../lib/Sprite.js';
import ImageName from '../enums/ImageName.js';

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
	static TILE_EMPTY = 18;
	static TILE_TOP_WALLS = [57, 58, 59];
	static TILE_BOTTOM_WALLS = [78, 79, 80];
	static TILE_LEFT_WALLS = [76, 95, 114];
	static TILE_RIGHT_WALLS = [77, 96, 115];
	static TILE_FLOORS = [
		6, 7, 8, 9, 10, 11, 12, 25, 26, 27, 28, 29, 30, 31, 44, 45, 46, 47, 48,
		49, 50, 63, 64, 65, 66, 67, 68, 69, 87, 88, 106, 107,
	];

	/**
	 * Represents one individual section of the dungeon complete
	 * with its own set of enemies and a switch that can open the doors.
	 *
	 * @param {Player} player
	 */
	constructor(player) {
		this.player = player;
		this.dimensions = new Vector(Restaurant.WIDTH, Restaurant.HEIGHT);
		this.sprites = Sprite.generateSpritesFromSpriteSheet(
			images.get(ImageName.Tiles),
			Tile.TILE_SIZE,
			Tile.TILE_SIZE
		);
		this.tiles = this.generateWallsAndFloors();
		//this.customers = this.generateCustomers();
		//this.tables = this.generateTables()
		//this.counter = Counter()
		//this.renderQueue = this.buildRenderQueue();

	}

	update(dt) {
        this.player.update(dt)
	}

	render() {
		this.renderTiles();
        this.player.render();
	}



	cleanUpEntities() {
		this.entities = this.entities.filter((entity) => !entity.isDead);
	}

	cleanUpObjects() {
		this.objects = this.objects.filter((obj) => !obj.cleanUp);
	}


	updateObjects(dt) {
		this.objects.forEach((object) => {
			object.update(dt);
		});
	}

	renderTiles() {
		this.tiles.forEach((tileRow) => {
			tileRow.forEach((tile) => {
				tile.render();
			});
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
					tileId = Restaurant.TILE_TOP_LEFT_CORNER;
				} else if (x === 0 && y === this.dimensions.y - 1) {
					tileId = Restaurant.TILE_BOTTOM_LEFT_CORNER;
				} else if (x === this.dimensions.x - 1 && y === 0) {
					tileId = Restaurant.TILE_TOP_RIGHT_CORNER;
				} else if (
					x === this.dimensions.x - 1 &&
					y === this.dimensions.y - 1
				) {
					tileId = Restaurant.TILE_BOTTOM_RIGHT_CORNER;
				}
				// Random left-hand walls, right walls, top, bottom, and floors.
				else if (x === 0) {
					if (
						y === Math.floor(this.dimensions.y / 2) ||
						y === Math.floor(this.dimensions.y / 2) + 1
					) {
						tileId = Restaurant.TILE_EMPTY;
					} else {
						tileId =
                        Restaurant.TILE_LEFT_WALLS[
								Math.floor(
									Math.random() * Restaurant.TILE_LEFT_WALLS.length
								)
							];
					}
				} else if (x === this.dimensions.x - 1) {
					if (
						y === Math.floor(this.dimensions.y / 2) ||
						y === Math.floor(this.dimensions.y / 2) + 1
					) {
						tileId = Restaurant.TILE_EMPTY;
					} else {
						tileId =
                        Restaurant.TILE_RIGHT_WALLS[
								Math.floor(
									Math.random() * Restaurant.TILE_RIGHT_WALLS.length
								)
							];
					}
				} else if (y === 0) {
					if (
						x === this.dimensions.x / 2 ||
						x === this.dimensions.x / 2 - 1
					) {
						tileId = Restaurant.TILE_EMPTY;
					} else {
						tileId =
                        Restaurant.TILE_TOP_WALLS[
								Math.floor(
									Math.random() * Restaurant.TILE_TOP_WALLS.length
								)
							];
					}
				} else if (y === this.dimensions.y - 1) {
					if (
						x === this.dimensions.x / 2 ||
						x === this.dimensions.x / 2 - 1
					) {
						tileId = Restaurant.TILE_EMPTY;
					} else {
						tileId =
                        Restaurant.TILE_BOTTOM_WALLS[
								Math.floor(
									Math.random() *
                                    Restaurant.TILE_BOTTOM_WALLS.length
								)
							];
					}
				} else {
					tileId =
                    Restaurant.TILE_FLOORS[
							Math.floor(Math.random() * Restaurant.TILE_FLOORS.length)
						];
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
	 * @returns An array of enemies for the player to fight.
	 */
	generateEntities() {
		const entities = new Array();
		const sprites = Sprite.generateSpritesFromSpriteSheet(
			images.get(ImageName.Enemies),
			Tile.TILE_SIZE,
			Tile.TILE_SIZE
		);

		/**
		 * Choose a random enemy type and fill the room with only that type.
		 * This is more to make each room feel like a different room.
		 */
		const enemyType = EnemyType[pickRandomElement(Object.keys(EnemyType))];

		for (let i = 0; i < 10; i++) {
			entities.push(EnemyFactory.createInstance(enemyType, sprites));
		}

		entities.push(this.player);

		return entities;
	}

	/**
	 * @returns An array of objects for the player to interact with.
	 */
	generateObjects() {
		const objects = [];

		objects.push(
			new Switch(
				new Vector(Switch.WIDTH, Switch.HEIGHT),
				new Vector(
					getRandomPositiveInteger(
						Room.LEFT_EDGE + Switch.WIDTH,
						Room.RIGHT_EDGE - Switch.WIDTH * 2
					),
					getRandomPositiveInteger(
						Room.TOP_EDGE + Switch.HEIGHT,
						Room.BOTTOM_EDGE - Switch.HEIGHT * 2
					)
				),
				this
			)
		);

		
		objects.push(...this.doorways);

		return objects;
	}

	/**
	 * @returns An array of the four directional doors.
	 */
	generateDoorways() {
		const doorways = [];

		doorways.push(
			new Doorway(
				Doorway.getDimensionsFromDirection(Direction.Up),
				Doorway.getPositionFromDirection(Direction.Up),
				Direction.Up,
				this
			)
		);
		doorways.push(
			new Doorway(
				Doorway.getDimensionsFromDirection(Direction.Down),
				Doorway.getPositionFromDirection(Direction.Down),
				Direction.Down,
				this
			)
		);
		doorways.push(
			new Doorway(
				Doorway.getDimensionsFromDirection(Direction.Left),
				Doorway.getPositionFromDirection(Direction.Left),
				Direction.Left,
				this
			)
		);
		doorways.push(
			new Doorway(
				Doorway.getDimensionsFromDirection(Direction.Right),
				Doorway.getPositionFromDirection(Direction.Right),
				Direction.Right,
				this
			)
		);

		return doorways;
	}

}
