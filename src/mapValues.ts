const mapPower = (power: Points) => {
    switch (power) {
        case 1: return 25;
        case 2: return 29;
        case 3: return 33;
        case 4: return 37;
        case 5: return 41;
    }
}

const mapDefence = (defence: Points) => {
    switch (defence) {
        case 1: return 30;
        case 2: return 34;
        case 3: return 38;
        case 4: return 42;
        case 5: return 46;
    }
}

const mapFrequency = (frequency: Points) => {
    switch (frequency) {
        case 1: return 15;
        case 2: return 14;
        case 3: return 13;
        case 4: return 12;
        case 5: return 11;
    }
}

const mapGrowth = (growth: Points) => {
    switch (growth) {
        case 1: return .12;
        case 2: return .26;
        case 3: return .24;
        case 4: return .30;
        case 5: return .36;
    }
}

export { mapPower, mapDefence, mapFrequency, mapGrowth };