export default class LevelManager {
    static loadCurrentLevel() {
        const currentLevel = JSON.parse(localStorage.getItem('currentLevel'));

        if (currentLevel === null) {
            LevelManager.saveCurrentLevel(1);
            return 1;
        }

        return currentLevel;
    }

    static saveCurrentLevel(level) {
        localStorage.setItem('currentLevel', JSON.stringify(level));
    }

    static resetLevel() {
        LevelManager.saveCurrentLevel(1);
    }
}
