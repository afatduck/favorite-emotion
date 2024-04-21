import { getCells } from "./generateCells";
import { emotionsToDefault, getEmotions, regerateColors } from "./generateEmotions";
import { gsSelectedEmotion, getRunning, storeEmotions, start, pause, getFirstStart, reset } from "./stateManagement";

const emotionDetails = document.querySelector(".emotion-details") as HTMLDivElement;
const emotionName = emotionDetails.querySelector("h3") as HTMLHeadingElement;
const [ powerSpan, defenceSpan, frequencySpan, growthSpan ] = Array.from(emotionDetails.querySelectorAll("span")) as HTMLSpanElement[];
const [ powerBar, defenceBar, frequencyBar, growthBar ] = Array.from(emotionDetails.querySelectorAll("input")) as HTMLInputElement[];

const emotionList = document.querySelector(".emotion-list") as HTMLDivElement;
const emotionListInner = emotionList.querySelector(".list") as HTMLDivElement;

const addRemove = document.querySelector(".add-remove") as HTMLDivElement;
const newEmotionInput = addRemove.querySelector("input") as HTMLInputElement;
const addEmotionButton = addRemove.querySelector("#add-emotion") as HTMLButtonElement;
const removeEmotionButton = addRemove.querySelector("#remove-emotion") as HTMLButtonElement;

const playPauseButton = document.querySelector("#play-pause") as HTMLButtonElement;
const resetButton = document.querySelector("#reset") as HTMLButtonElement;
const defaultEmotionsButton = document.querySelector("#default-emotions") as HTMLButtonElement;
const hideGuiButton = document.querySelector("#hide-gui") as HTMLButtonElement;

const simulationStats = document.querySelector(".simulation-stats") as HTMLDivElement;

const phoneOverlay = document.querySelector(".phone-overlay") as HTMLDivElement;

let guiHidden = window.innerWidth < 786;
hideGuiButton.textContent = guiHidden ? 'Edit Emotions' : 'Close';

const updateEmotionDetails = () => {
    if (guiHidden) { 
        emotionDetails.classList.add('hidden');
        return;
    }
    emotionDetails.classList.remove('hidden');

    const emotion = gsSelectedEmotion.get();
    emotionName.textContent = emotion.name;
    emotionName.style.color = emotion.colour;

    document.documentElement.style.setProperty('--slider-color', emotion.colour);

    powerSpan.textContent = emotion.power.toString() + '/5'
    defenceSpan.textContent = emotion.defence.toString() + '/5'
    frequencySpan.textContent = emotion.frquency.toString() + '/5'
    growthSpan.textContent = emotion.growth.toString() + '/5'

    powerBar.value = emotion.power.toString();
    defenceBar.value = emotion.defence.toString();
    frequencyBar.value = emotion.frquency.toString();
    growthBar.value = emotion.growth.toString();

    const firstStart = getFirstStart();
    if (!firstStart) emotionDetails.classList.add('blocked');
    else emotionDetails.classList.remove('blocked');
}

const updateEmotionList = () => {
    if (guiHidden) {
        emotionList.classList.add('hidden');
        return;
    }
    emotionList.classList.remove('hidden');

    const emotions = getEmotions();
    emotionListInner.innerHTML = '';
    emotions.forEach(emotion => {
        const p = document.createElement('p');
        p.textContent = emotion.name;
        if (emotion.id === gsSelectedEmotion.get().id) p.classList.add('selected');
        p.addEventListener('click', () => {
            gsSelectedEmotion.set(emotion);
            updateDOM();
        });
        emotionListInner.appendChild(p);
    });
}

const addEmotion = () => {
    if (!newEmotionInput.value) return;
    const name = newEmotionInput.value;
    newEmotionInput.value = '';
    const emotions = getEmotions();
    emotions.push({
        id: new Date().getTime(),
        name,
        colour: '#000000',
        power: 1,
        defence: 1,
        frquency: 1,
        growth: 1,
        realPower: 1,
        realDefence: 1,
        realFrequency: 1,
        realGrowth: 1
    });
    regerateColors();
    storeEmotions();
    updateDOM();
}

const updateAddRemove = () => {
    const firstStart = getFirstStart();

    addEmotionButton.disabled = !newEmotionInput.value || !firstStart;
    removeEmotionButton.disabled = getEmotions().length === 3 || !firstStart;
    defaultEmotionsButton.disabled = !firstStart;
}

export const updateSimulationStats = () => {
    const cells = getCells();
    const cellNum = cells.length;

    const emotions = getEmotions();
    const emotionStats = emotions.map(emotion => {
        return {
            num: cells.filter(cell => cell.emotion?.id === emotion.id).length,
            emotion
        }
    }).sort((a, b) => b.num - a.num);

    simulationStats.innerHTML = '';

    for (const { num, emotion } of emotionStats) {
        const p = document.createElement('p');
        const span = document.createElement('span');
        span.textContent = num.toString();
        span.style.backgroundColor = emotion.colour + '88';

        const selected = gsSelectedEmotion.get();
        if (emotion == selected) p.style.fontWeight = 'bold';

        p.textContent = emotion.name + ': ';
        p.appendChild(span);
        p.appendChild(document.createTextNode(` (${(num / cellNum * 100).toFixed(2)}%)`));

        simulationStats.appendChild(p);
    }
}

export const updateDOM = () => {
    updateEmotionDetails();
    updateEmotionList();
    updateAddRemove();
    updateSimulationStats();
}

powerBar.addEventListener('change', () => {
    const emotion = gsSelectedEmotion.get();
    emotion.power = parseInt(powerBar.value) as Points;
    gsSelectedEmotion.set(emotion);
    updateEmotionDetails()
    storeEmotions();
});

defenceBar.addEventListener('change', () => {
    const emotion = gsSelectedEmotion.get();
    emotion.defence = parseInt(defenceBar.value) as Points;
    gsSelectedEmotion.set(emotion);
    updateEmotionDetails()
    storeEmotions();
});

frequencyBar.addEventListener('change', () => {
    const emotion = gsSelectedEmotion.get();
    emotion.frquency = parseInt(frequencyBar.value) as Points;
    gsSelectedEmotion.set(emotion);
    updateEmotionDetails()
    storeEmotions();
});

growthBar.addEventListener('change', () => {
    const emotion = gsSelectedEmotion.get();
    emotion.growth = parseInt(growthBar.value) as Points;
    gsSelectedEmotion.set(emotion);
    updateEmotionDetails()
    storeEmotions();
});

newEmotionInput.addEventListener('input', updateAddRemove);
newEmotionInput.addEventListener('keydown', (e) => {
    if (!getFirstStart()) return;
    if (e.key === 'Enter') addEmotion();
});

addEmotionButton.addEventListener('click', addEmotion);
removeEmotionButton.addEventListener('click', () => {
    const emotions = getEmotions();
    const index = emotions.findIndex(e => e.id === gsSelectedEmotion.get().id);
    emotions.splice(index, 1);
    gsSelectedEmotion.set(emotions[0]);
    regerateColors();
    storeEmotions();
    updateDOM();
});

playPauseButton.addEventListener('click', () => {
    if (getRunning()) pause();
    else start();
    playPauseButton.textContent = getRunning() ? 'Pause' : 'Resume';
});

resetButton.addEventListener('click', () => {
    reset();
    playPauseButton.textContent = 'Start';
});

defaultEmotionsButton.addEventListener('click', () => {
    emotionsToDefault();
    updateDOM();
});

hideGuiButton.addEventListener('click', () => {
    guiHidden = !guiHidden;
    hideGuiButton.textContent = guiHidden ? 'Edit Emotions' : 'Close';
    phoneOverlay.classList.toggle('hidden');
    updateDOM();
});