function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Returns DOM element for door
 * @param {number} doorNumber 
 * @returns {[DOM, DOM]} DOM element for door
 */
function createDoorDOM(doorNumber) {
    doorTemplate = document.getElementById("door-template");
    const cloneDoorTemplate = doorTemplate.content.cloneNode(true);

    const door = cloneDoorTemplate.getElementById("door");
    door.id = `door${doorNumber}`;
    const doorLeaf = door.getElementById("doorLeaf");
    doorLeaf.id = `doorLeaf${doorNumber}`;
    const doorText = door.getElementById("doorText");
    doorText.textContent = `${doorNumber}`;

    door.addEventListener("click", () => {
        doorLeaf.classList.toggle("open");
    });

    return door;
}

function getDoorDOM(doorNumber) {
    // const container = document.getElementById("doorContainer");
    const door = document.getElementById(`door${doorNumber}`);
    return door;
}

// Very very bad practice, global variables!
let stopFlipDoors = false;

async function flipDoors() {
    for (let i = 1; i <= 30; i++) {
        for (let j = i; j <= 30; j += i) {
            if (stopFlipDoors) return;
            const door = getDoorDOM(j);
            door.dispatchEvent(new MouseEvent("click"));
            await sleep(500);
        }
    }
}

async function resetDoors() {
    stopFlipDoors = true;

    const container = document.getElementById("doorContainer");
    container.innerHTML = "";

    for (let i = 1; i <= 30; i++) {
        // Create a door
        door = createDoorDOM(i);
        container.appendChild(door);
    }

    await sleep(500);
    stopFlipDoors = false;
}

resetDoors();

const flipDoorButton = document.getElementById("flipDoorsBtn");
flipDoorButton.addEventListener("click", () => {
    flipDoors();
});

const resetDoorsBtn = document.getElementById("resetDoorsBtn");
resetDoorsBtn.addEventListener("click", () => {
    resetDoors();
});