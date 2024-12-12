import UserInterfaceElement from '../UserInterfaceElement.js';
import Colour from '../../enums/Colour.js';
import { roundedRectangle } from '../../../lib/Drawing.js';
import { context, timer } from '../../globals.js';
import Easing from '../../../lib/Easing.js';


export default class ProgressBar extends UserInterfaceElement {
	static BOTTOM_DIALOGUE = { x: 0, y: 8, width: 15, height: 3 };
	static TOP_DIALOGUE = { x: 0, y: 0, width: 15, height: 3 };
	static POKEMON_STATS = { x: 7.5, y: 3.5, width: 7, height: 7 };
	static BATTLE_PLAYER = { x: 8, y: 5, width: 6.5, height: 2.5 };
	static BATTLE_OPPONENT = { x: 1, y: 1, width: 6.5, height: 2 };
	static BATTLE_EXPERIENCE = { x: 9, y: 7, width: 6, height: 4 };
	static DEFAULT_PADDING = 20;
	static BORDER_WIDTH = 10;

	/**
	 * A UI element that shows progress based on a current value and a max.
	 *
	 * @param {number} x
	 * @param {number} y
	 * @param {number} width
	 * @param {number} height
	 * @param {object} options
	 */
	constructor(x, y, width, height, maxValue, currentValue) {
		super(x, y, width, height);
		this.maxValue = maxValue;
		this.currentValue = currentValue;
		this.filledWidth = 0
		this.barColor = Colour.Red;
		this.isVisible = true;
	}

	render(x, y) {

		// Calculating how much to fill out
		const percentage = Math.max(0, this.currentValue / this.maxValue);
		this.filledWidth = this.dimensions.x * percentage;




		if (percentage <= 0.25) {
			this.barColor = Colour.Red;
		} else if (percentage <= 0.5) {
			this.barColor = Colour.Yellow;
		} else {
			this.barColor = Colour.Green;
		}
		
		
		context.save();

		// Print out the background of the progress bar
		context.fillStyle = Colour.White;
		roundedRectangle(
			context,
			x,
			y,
			this.dimensions.x,
			this.dimensions.y,
			2,
			true,
			true
		);
		// If it's not zero, print the foreground
		if (this.filledWidth > 0){
			context.fillStyle = this.barColor;
			roundedRectangle(
				context,
				x,
				y,
				this.filledWidth,
				this.dimensions.y,
				2,
				true,
				true
			);
	
		}

		context.restore();


	}

	update(newValue) {
		this.currentValue = newValue
	}

}

