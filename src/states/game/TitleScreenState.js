import Input from '../../../lib/Input.js';
import State from '../../../lib/State.js';
import FrogColor from '../../enums/FrogColor.js';
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
import LevelMaker from '../../services/LevelMaker.js';
import PlayerFrogFactory from '../../services/PlayerFrogFactory.js';
import { roundedRectangle } from '../../../lib/Drawing.js';

export default class TitleScreenState extends State {
	/**
	 * Displays a title screen where the player
	 * can press enter to start a new game.
	 */
	constructor() {
		super();
		this.colors = [FrogColor.Green,FrogColor.Orange, FrogColor.Brown,FrogColor.Pink]; 
		this.currentColorIndex = 0;
		this.frog = PlayerFrogFactory.createInstance(this.colors[this.currentColorIndex])
	}

	enter() {}

	exit() {}

	update(dt) {
		timer.update(dt);

		if (input.isKeyPressed(Input.KEYS.A)) {
			this.currentColorIndex =
				(this.currentColorIndex - 1 + this.colors.length) % this.colors.length;
				this.frog = PlayerFrogFactory.createInstance(this.colors[this.currentColorIndex])
		}

		if (input.isKeyPressed(Input.KEYS.D)) {
			this.currentColorIndex = (this.currentColorIndex + 1) % this.colors.length;
			this.frog = PlayerFrogFactory.createInstance(this.colors[this.currentColorIndex])
		}

		
		if (input.isKeyPressed(Input.KEYS.ENTER)) {
			LevelMaker.ChosenFrogColor = this.colors[this.currentColorIndex]
		    stateMachine.change(GameStateName.Play);
			
		}


	}

	render() {
	
		images.render(ImageName.Background, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
	

		context.save()
		context.font = '40px cuteCat';
		context.textBaseline = 'middle';
		context.textAlign = 'center';
		context.fillStyle = 'white';

		roundedRectangle(
			context,
			164,
			78,
			55,
			40,
			5,
			true,
			false
		);
	
		this.frog.position.x = 56;
		this.frog.position.y = 21;
		this.frog.render({ x: 3, y: 3 });


		context.fillStyle = 'white';
		context.fillText('The Leapin Kitchen', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 50);



		context.font = '12px pixel';

		context.fillStyle = 'white';
		context.fillText('Use A/D to select your avatar', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 35);
	
		
		context.fillText('Press Enter to Start', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 60);

		context.fillText('►', CANVAS_WIDTH / 2 + 50, CANVAS_HEIGHT / 2 - 5);
		context.fillText('◄', CANVAS_WIDTH / 2 - 50, CANVAS_HEIGHT / 2 - 5);


		context.restore()
	}
	
}
