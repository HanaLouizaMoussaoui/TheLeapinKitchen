import Colour from "../../enums/Colour.js";
import { context } from "../../globals.js";
import Pokemon from "../../entities/Pokemon.js";
import UserInterfaceElement from "../UserInterfaceElement.js";
import Panel from "../elements/Panel.js";
import ProgressBar from "../elements/ProgressBar.js";
import ProgressBarType from "../../enums/ProgressBarType.js";

export default class BattlePlayerPanel extends Panel {
	/**
	 * The Panel displayed beside the Player's Pokemon
	 * during battle that displays their name, health,
	 * level and experience.
	 *
	 * @param {number} x
	 * @param {number} y
	 * @param {number} width
	 * @param {number} height
	 * @param {Pokemon} pokemon
	 * @param {object} options Options for the super Panel.
	 */
	constructor(x, y, width, height, pokemon, options = {}) {
		super(x, y, width, height, options);
		this.healthBar = new ProgressBar(Panel.BATTLE_PLAYER.x, Panel.BATTLE_PLAYER.y, 5, 5, pokemon.health, pokemon.currentHealth, ProgressBarType.Health);
		this.experienceBar = new ProgressBar(Panel.BATTLE_PLAYER.x, Panel.BATTLE_PLAYER.y, 5, 5, pokemon.targetExperience, pokemon.currentExperience - pokemon.levelExperience,  ProgressBarType.Experience);
		this.pokemon = pokemon;
	}

	render() {
		super.render();

		this.renderStatistics();
	}

	/**
	 * All the magic number offsets here are to
	 * arrange all the pieces nicely in the space.
	 */
	renderStatistics() {
		context.save();
		context.textBaseline = 'top';
		context.fillStyle = Colour.Black;
		context.font = `${UserInterfaceElement.FONT_SIZE}px ${UserInterfaceElement.FONT_FAMILY}`;
		context.fillText(
			this.pokemon.name.toUpperCase(),
			this.position.x + 15,
			this.position.y + 12
		);
		context.textAlign = 'right';
		context.fillText(
			`Lv${this.pokemon.level}`,
			this.position.x + this.dimensions.x - 10,
			this.position.y + 12
		);

		this.healthBar.render(this.position.x + 20,
			this.position.y + 40);

			context.fillText(
				`${this.pokemon.getHealthMeter()}`,
				this.position.x + this.dimensions.x - 30,
				this.position.y + 55
			);

		this.experienceBar.render(this.position.x + 20,	this.position.y + 85);
	

		context.restore();
	}
	updateHealth(currentHealth) {
        this.healthBar.update(currentHealth);
    }
	updateExperience(currentExperience){
		this.experienceBar.update(currentExperience)
	}



}
