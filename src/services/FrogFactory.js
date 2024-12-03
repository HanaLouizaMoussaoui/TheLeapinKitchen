
import FrogColor from "../enums/FrogColor.js";
/**
 * Encapsulates all definitions for instantiating new enemies.
 */
export default class EnemyFactory {
	/**
	 * @param {string} type A string using the EnemyType enum.
	 * @param {array} sprites The sprites to be used for the enemy.
	 * @returns An instance of an enemy specified by EnemyType.
	 */
	static createInstance(type) {
        const sprites = {}
		switch (type) {
			case FrogColor.Pink:
                 sprites = Sprite.generateSpritesFromSpriteSheet(
                    images.get(ImageName.PinkFrog),
                    Tile.TILE_SIZE,
                    Tile.TILE_SIZE
                );        
				return new Frog(sprites, FrogColor.Pink);
                

			case FrogColor.Orange:
                sprites = Sprite.generateSpritesFromSpriteSheet(
                    images.get(ImageName.OrangeFrog),
                    Tile.TILE_SIZE,
                    Tile.TILE_SIZE
                );        
				return new Frog(sprites, FrogColor.Orange);

            case FrogColor.Green:
                sprites = Sprite.generateSpritesFromSpriteSheet(
                    images.get(ImageName.GreenFrog),
                    Tile.TILE_SIZE,
                    Tile.TILE_SIZE
                );        
                return new Frog(sprites, FrogColor.Green);

            case FrogColor.Brown:
                sprites = Sprite.generateSpritesFromSpriteSheet(
                    images.get(ImageName.BrownFrog),
                    Tile.TILE_SIZE,
                    Tile.TILE_SIZE
                );        
                return new Frog(sprites, FrogColor.Brown);
                
            case FrogColor.Rainbow:
                sprites = Sprite.generateSpritesFromSpriteSheet(
                            images.get(ImageName.RainbowFrog),
                            Tile.TILE_SIZE,
                            Tile.TILE_SIZE
                );        
                return new Frog(sprites, FrogColor.Rainbow);
		}
	}
}
