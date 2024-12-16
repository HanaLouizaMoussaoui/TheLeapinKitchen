import SoundPool from "./SoundPool.js";

export default class Sounds {
	constructor() {
		this.sounds = {};
		this.muted = false;
	}

	load(soundDefinitions) {
		soundDefinitions.forEach((soundDefinition) => {
			this.sounds[soundDefinition.name] = new SoundPool(
				soundDefinition.path,
				soundDefinition.size,
				soundDefinition.volume,
				soundDefinition.loop,
			);
		});
	}

	get(name) {
		return this.sounds[name];
	
	}

	play(name) {
		if (this.muted) {return;}
		this.get(name).play();
	}

	pause(name) {
		this.get(name).pause();
	}

	stop(name) {
		this.get(name).stop()
	}

	
	mute() {
		this.muted = true;
	}
	
	unmute() {
		this.muted = false;
	}
	
}
