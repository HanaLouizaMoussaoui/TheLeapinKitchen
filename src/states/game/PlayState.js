import State from '../../../lib/State.js';
import Player from '../../entities/Player.js';
import GameStateName from '../../enums/GameStateName.js';
import SoundName from '../../enums/SoundName.js';
import { debug, sounds, stateMachine, timer } from '../../globals.js';
import Restaurant from '../../objects/Restaurant.js';
import PlayerFrogFactory from '../../services/PlayerFrogFactory.js';
//import UserInterface from '../../services/UserInterface.js';
import FrogColor from '../../enums/FrogColor.js';
import UserInterface from '../../services/UserInterface.js';
import LevelMaker from '../../services/LevelMaker.js';
import ImageName from '../../enums/ImageName.js';

export default class PlayState extends State {
	constructor(mapDefinition) {
		super();

	}

	enter(parameters = {}) {
		sounds.play(SoundName.Music);
		this.level = parameters.level ?? LevelMaker.createLevel();
	}

	exit(){

	}

	update(dt) {
		this.level.update(dt);
		this.checkWinOrLose();
		debug.update();
	}

	render() {
		this.level.render();
	}
	checkWinOrLose() {
		if (this.level.didWin()) {
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
