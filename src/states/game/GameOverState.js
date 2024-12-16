import State from '../../../lib/State.js';
import Input from '../../../lib/Input.js';
import GameStateName from '../../enums/GameStateName.js';
import LevelMaker from '../../services/LevelMaker.js';
import {
	CANVAS_HEIGHT,
	CANVAS_WIDTH,
	context,
	input,
	stateMachine,
	images
} from '../../globals.js';
import ImageName from '../../enums/ImageName.js';

export default class GameOverState extends State {
	/**
	 * Displays a game over screen where the player
	 * can press enter to go back to level 1.
	 */
	constructor() {
		super();
	}

	enter(parameters) {
		this.background = parameters.background;
	}

	update() {
		if (input.isKeyPressed(Input.KEYS.ENTER)) {
			stateMachine.change(GameStateName.Play, {
				background: this.background,
				level: LevelMaker.createLevel(),
			});
		}
	}

	render() {
		images.render(ImageName.Background3, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

		context.save();
		context.font = '40px cuteCat';
		context.fillStyle = 'white';
		context.textBaseline = 'middle';
		context.textAlign = 'center';
		context.fillText('Game Over!', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 30);
		context.font = '15px cuteCat';
		context.fillStyle = 'white';
		context.fillText(
			'Press Enter to Try Again',
			CANVAS_WIDTH / 2,
			CANVAS_HEIGHT - 80
		);
		context.restore();
	}
}
