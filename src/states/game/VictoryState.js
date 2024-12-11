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

export default class VictoryState extends State {
	/**
	 * Displays a game over screen where the player
	 * can press enter to go back to the title screen.
	 */
	constructor() {
		super();
	}

	enter(parameters) {
		this.level = parameters.level;
	}

	update() {
		if (input.isKeyPressed(Input.KEYS.ENTER)) {
			stateMachine.change(GameStateName.Play, {
				background: this.background,
				level: LevelMaker.createLevel(this.level + 1),
			});
		}
	}

	render() {
		images.render(ImageName.Background, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

		context.save();
		context.font = '40px cuteCat';
		context.fillStyle = 'white';
		context.textBaseline = 'middle';
		context.textAlign = 'center';
		context.fillText('Victory!', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 50);
		context.font = '15px cuteCat';
		context.fillStyle = 'white';
		context.fillText(
			'Press Enter to Continue',
			CANVAS_WIDTH / 2,
			CANVAS_HEIGHT - 80
		);
		context.restore();
	}
}
