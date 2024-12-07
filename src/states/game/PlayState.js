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

export default class PlayState extends State {
	constructor(mapDefinition) {
		super();

		this.map = new Map(mapDefinition);
	}

	enter(parameters = {}) {
		sounds.play(SoundName.Music);
		this.level = parameters.level ?? LevelMaker.createLevel();
	}

	update(dt) {
		this.level.update(dt);
		debug.update();
	}

	render() {
		this.level.render();
	}
}
