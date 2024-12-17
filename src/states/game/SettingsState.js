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
	images,
	sounds
} from '../../globals.js';
import ImageName from '../../enums/ImageName.js';
import LevelManager from '../../services/LevelManager.js';
import { roundedRectangle } from '../../../lib/Drawing.js';
import SoundPool from '../../../lib/SoundPool.js';
import SoundName from '../../enums/SoundName.js';

export default class SettingsState extends State {
	/**
	 * Displays a game over screen where the player
	 * can press enter to go back to the title screen.
	 */
	constructor() {
		super();
		this.selectedSection = 1
		this.muted = false
		this.gameReset = false
	}

	enter(parameters) {

	}

	update() {
		if (input.isKeyPressed(Input.KEYS.W)) {
			sounds.play(SoundName.Order)
			this.selectedSection = Math.min(this.selectedSection + 1, 2)
		}
		else if (input.isKeyPressed(Input.KEYS.S)) {
			sounds.play(SoundName.Order)
			this.selectedSection = Math.max(this.selectedSection - 1, 1)
		}
		else if (input.isKeyPressed(Input.KEYS.T)) {
			if (this.selectedSection == 1){
				this.muted = !this.muted;
				this.muted ? sounds.mute() : sounds.unmute();
			}
			else {
				this.gameReset = true
				LevelManager.resetLevel()
			}
		}
		if (input.isKeyPressed(Input.KEYS.ENTER)) {
			sounds.play(SoundName.New)
			stateMachine.change(GameStateName.TitleScreen);
		}
	}

	render() {
		images.render(ImageName.Background, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

		context.save();
		context.font = '40px cuteCat';
		context.fillStyle = 'white';
		context.textBaseline = 'middle';
		context.textAlign = 'center';
		context.fillText('Settings', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 60);
		context.font = '15px cuteCat';
		context.fillStyle = 'white';
		context.fillText(
			'Controls: WASD to move, T to interact',
			CANVAS_WIDTH / 2,
			CANVAS_HEIGHT - 130
		);

		context.fillStyle = '#77cf6d';
		roundedRectangle(
			context,
			125,
			95,
			135,
			65,
			5,
			true,
			false
		);


		context.fillStyle = 'white';
		context.fillText('▲', CANVAS_WIDTH / 2, CANVAS_HEIGHT - 100);
		if (this.selectedSection==1){
			if (!this.muted){
				context.fillText(
					'Mute game?',
					CANVAS_WIDTH / 2,
					CANVAS_HEIGHT - 80
				);
			}
			else{
				context.fillText(
					'Unmute game.',
					CANVAS_WIDTH / 2,
					CANVAS_HEIGHT - 80
				);
			}
		}
		else if (this.selectedSection==2){
			if (!this.gameReset){
				context.fillText(
					'Reset Game Progress?',
					CANVAS_WIDTH / 2,
					CANVAS_HEIGHT - 80
				);
			}
			else{
				context.fillText(
					'Progress reset.',
					CANVAS_WIDTH / 2,
					CANVAS_HEIGHT - 80
				);
			}
		}

		
		context.fillText('▼', CANVAS_WIDTH / 2, CANVAS_HEIGHT - 55);

		context.fillText(
			'Press Enter to return to title screen.',
			CANVAS_WIDTH / 2,
			CANVAS_HEIGHT - 30
		);

		context.restore();
	}
}
