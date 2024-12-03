import State from '../../../lib/State.js';
import Player from '../../entities/Player.js';
import GameStateName from '../../enums/GameStateName.js';
import SoundName from '../../enums/SoundName.js';
import { debug, sounds, stateMachine, timer } from '../../globals.js';
import Restaurant from '../../objects/Restaurant.js';
//import UserInterface from '../../services/UserInterface.js';

export default class PlayState extends State {
	constructor(mapDefinition) {
		super();

		this.player = new Player();
		this.restaurant = new Restaurant(this.player);
		//this.userInterface = new UserInterface(this.player);
		this.map = new Map(mapDefinition);
	}

	enter() {
		this.player.reset();
		this.restaurant = new Restaurant(this.player);
		sounds.play(SoundName.Music);
	}

	update(dt) {
		debug.update();
		this.restaurant.update(dt);
	}

	render() {
		this.restaurant.render();
		//this.userInterface.render();
	}
}
