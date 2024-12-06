
import FrogColor from "../enums/FrogColor.js";
import Sprite from "../../lib/Sprite.js";
import Frog from "../entities/Frog.js";
import { images } from "../globals.js";
import ImageName from "../enums/ImageName.js";
import Tile from "../objects/Tile.js";
import Customer from "../entities/Customer.js";
/**
 * Encapsulates all definitions for instantiating new enemies.
 */
export default class CustomerFrogFactory {
	/**
	 * @param {string} type A string using the EnemyType enum.
	 * @param {array} sprites The sprites to be used for the enemy.
	 * @returns An instance of an enemy specified by EnemyType.
	 */
	static createInstance(type) {
        let sprites = {}
		switch (type) {
			case FrogColor.Pink:
                 sprites = Sprite.generateSpritesFromSpriteSheet(
                    images.get(ImageName.PinkFrog),
                    Tile.TILE_SIZE,
                    Tile.TILE_SIZE
                );        
				return new Customer(sprites, FrogColor.Pink);
                

			case FrogColor.Orange:
                sprites = Sprite.generateSpritesFromSpriteSheet(
                    images.get(ImageName.OrangeFrog),
                    Tile.TILE_SIZE,
                    Tile.TILE_SIZE
                );        
				return new Customer(sprites, FrogColor.Orange);

            case FrogColor.Green:
                sprites = Sprite.generateSpritesFromSpriteSheet(
                    images.get(ImageName.GreenFrog),
                    Tile.TILE_SIZE,
                    Tile.TILE_SIZE
                );
                return new Customer(sprites, FrogColor.Green);

            case FrogColor.Brown:
                sprites = Sprite.generateSpritesFromSpriteSheet(
                    images.get(ImageName.BrownFrog),
                    Tile.TILE_SIZE,
                    Tile.TILE_SIZE
                );        
                return new Customer(sprites, FrogColor.Brown);
                
            case FrogColor.Rainbow:
                sprites = Sprite.generateSpritesFromSpriteSheet(
                            images.get(ImageName.RainbowFrog),
                            Tile.TILE_SIZE,
                            Tile.TILE_SIZE
                );        
                return new Customer(sprites, FrogColor.Rainbow);
		}
	}
}
