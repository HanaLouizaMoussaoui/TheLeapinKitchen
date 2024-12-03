import Input from '../../../lib/Input.js';
import State from '../../../lib/State.js';
import GameStateName from '../../enums/GameStateName.js';
import ImageName from '../../enums/ImageName.js';
import SoundName from '../../enums/SoundName.js';
import {
	CANVAS_HEIGHT,
	CANVAS_WIDTH,
	context,
	images,
	input,
	sounds,
	stateMachine,
	timer
} from '../../globals.js';

export default class TitleScreenState extends State {
	/**
	 * Displays a title screen where the player
	 * can press enter to start a new game.
	 */
	constructor() {
		super();
	}

	enter() {
		sounds.play(SoundName.Cash);
	}

	exit() {
		sounds.stop(SoundName.Cash);
	}

	update(dt) {
		timer.update(dt);

		if (input.isKeyPressed(Input.KEYS.ENTER)) {
			stateMachine.change(GameStateName.Play);
		}
	}

	render() {
		images.render(ImageName.GreenFrog, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
		context.font = '40px cuteCat';
		context.fillStyle = 'white';
		context.textBaseline = 'middle';
		context.textAlign = 'center';
		context.fillText('The Leapin Kitchen', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
		context.font = '15px pixel';
		context.fillText(
			'press enter to begin',
			CANVAS_WIDTH / 2,
			CANVAS_HEIGHT - 40
		);
	}
}
