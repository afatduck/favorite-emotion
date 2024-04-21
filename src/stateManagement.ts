import { generateCells } from "./generateCells";
import { getEmotions } from "./generateEmotions";
import { mapDefence, mapFrequency, mapGrowth, mapPower } from "./mapValues";
import { updateDOM } from "./renderHTML";
import { initSimulation } from "./simulation";

const emotions = getEmotions();

let selectedEmotion = emotions[0];
const gsSelectedEmotion: getSet<Emotion> = { get: () => selectedEmotion, set: (e) => selectedEmotion = e };

const storeEmotions = () => {
    localStorage.setItem('emotions', JSON.stringify(emotions));
}

let firstStart = true;
let running = false;

const getRunning = () => running;
const getFirstStart = () => firstStart;

const start = () => {
    running = true;

    if (firstStart) {
        firstStart = false;
        const emotions = getEmotions();
        emotions.forEach(e => {
            e.realPower = mapPower(e.power);
            e.realFrequency = mapFrequency(e.frquency);
            e.realDefence = mapDefence(e.defence);
            e.realGrowth = mapGrowth(e.growth);
        });
        initSimulation();
        updateDOM();
    }
}

const pause = () => {
    running = false;
}

const reset = () => {
    running = false;
    firstStart = true;
    generateCells();
    updateDOM();
}

export { gsSelectedEmotion, getRunning, start, pause, storeEmotions, getFirstStart, reset };