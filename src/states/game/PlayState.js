import State from '../../../lib/State.js';
import Player from '../../entities/Player.js';
import GameStateName from '../../enums/GameStateName.js';
import SoundName from '../../enums/SoundName.js';
import {
	debug,
	sounds,
	CANVAS_HEIGHT,
	CANVAS_WIDTH,
	context,
	input,
	stateMachine,
	images
} from '../../globals.js';
import Restaurant from '../../objects/Restaurant.js';
import PlayerFrogFactory from '../../services/PlayerFrogFactory.js';
//import UserInterface from '../../services/UserInterface.js';
import FrogColor from '../../enums/FrogColor.js';
import UserInterface from '../../services/UserInterface.js';
import LevelMaker from '../../services/LevelMaker.js';
import ImageName from '../../enums/ImageName.js';
import LevelManager from '../../services/LevelManager.js';


export default class PlayState extends State {
	constructor(mapDefinition) {
		super();

	}

	enter(parameters = {}) {
		sounds.play(SoundName.Music);
		// LevelManager.resetLevel()
		this.level = LevelMaker.createLevel(LevelManager.loadCurrentLevel());
	}

	exit(){

	}

	update(dt) {
		this.level.update(dt);
		this.checkWinOrLose();
		debug.update();
	}

	render() {
		images.render(ImageName.Background2, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
		this.level.render();
	}
	checkWinOrLose() {
		if (this.level.didWin()) {
			sounds.play(SoundName.Victory)
			LevelManager.saveCurrentLevel(this.level.number + 1);
			stateMachine.change(GameStateName.Victory, {
				background: ImageName.Background,
				level: this.level.number,
			});
		} else if (this.level.didLose()) {
			stateMachine.change(GameStateName.GameOver, {
				background: ImageName.Background,
			});
		}
	}
}
