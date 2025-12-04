function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

class Door {
    constructor(doorNumber) {
        this.doorNumber = doorNumber;

        // Create door DOM from template in HTML
        const doorTemplate = document.getElementById("door-template");
        const cloneDoorTemplate = doorTemplate.content.cloneNode(true);

        const door = cloneDoorTemplate.getElementById("door");
        door.id = `door${doorNumber}`;
        const doorLeaf = door.getElementById("doorLeaf");
        doorLeaf.id = `doorLeaf${doorNumber}`;
        const doorText = door.getElementById("doorText");
        doorText.textContent = `${doorNumber}`;

        // On click, open/close door
        door.addEventListener("click", () => {
            doorLeaf.classList.toggle("open");
        });

        this._doorDOM = door;
        this._doorState = "closed"; // can be open or closed
    }

    get doorDOM() {
        return this._doorDOM;
    }

    get doorState() {
        return this._doorState;
    }

    toggle() {
        if (this.doorState === "open") {
            this._doorState = "closed";
        }
        else if (this.doorState === "closed") {
            this._doorState = "open";
        }
        else {
            throw "Door state is something other than open and closed!"
        }
        this.doorDOM.dispatchEvent(new MouseEvent("click"));
    }
}

class DoorContainer {
    #doorContainerDOM = document.getElementById("doorContainer");

    constructor(numberOfDoors) {
        this._numberOfDoors = numberOfDoors;
        this._doors = []
        for (let i = 1; i <= this.numberOfDoors; i++) {
            this._doors.push(new Door(i));
        }
    }

    get doors() {
        return this._doors;
    }

    get numberOfDoors() {
        return this._numberOfDoors;
    }

    buildDoorsInDOM() {
        // Remove any old doors
        this.#doorContainerDOM.innerHTML = "";

        for (let i = 1; i <= this.numberOfDoors; i++) {
            this.#doorContainerDOM.appendChild(this.doors[i - 1].doorDOM);
        }
    }

    toggleDoor(doorIndex) {
        this.doors[doorIndex - 1].toggle();
    }
}

class DoorMediaController {
    constructor(doorController) {
        this._doorContainer = doorController;
        this.#setDoorCounts();
        this._isPauseState = true;
    }

    #setDoorCounts() {
        this._skipDoors = 1;
        this._currentDoor = 1;
    }

    get doorContainer() {
        return this._doorContainer;
    }

    // set doorContainer(doorContainer) {
    //     this._doorContainer = doorContainer;
    //     this.#setDoorCounts();
    // }

    async play() {
        this._isPauseState = false;
        while (this._isPauseState === false) {
            let isStepForwardNotTerminated = this.stepForward();
            if (!isStepForwardNotTerminated) {
                break;
            }
            await sleep(500);
        }
    }

    pause() {
        this._isPauseState = true;
    }

    stepForward() {
        if (this._skipDoors > this.doorContainer.numberOfDoors) {
            return false;
        }

        this.doorContainer.toggleDoor(this._currentDoor);
        this._currentDoor += this._skipDoors;

        if (this._currentDoor > this.doorContainer.numberOfDoors) {
            this._skipDoors += 1;
            this._currentDoor = this._skipDoors;
        }
        return true;
    }

    stepBack() {
        if (this._currentDoor === 1 && this._skipDoors === 1) {
            return false;
        }

        this._currentDoor -= this._skipDoors;

        if (this._currentDoor < 1) {
            this._skipDoors -= 1;
            this._currentDoor = Math.floor(this.doorContainer.numberOfDoors / this._skipDoors) * this._skipDoors;
        }

        this.doorContainer.toggleDoor(this._currentDoor);

        return true;
    }

    resetAll() {
        this._isPauseState = true;
        let numberOfDoors = this.doorContainer.numberOfDoors;
        this._doorContainer = new DoorContainer(numberOfDoors);
        this.doorContainer.buildDoorsInDOM();
        this.#setDoorCounts();
    }
}

// By default add 10 doors
// All functions will edit the single global variable doorMediaController
let doorContainer = new DoorContainer(10);
let doorMediaController = new DoorMediaController(doorContainer);
doorContainer.buildDoorsInDOM();


function handleSubmit() {
    const numberOfDoors = document.getElementById("noOfDoors").value;
    doorContainer = new DoorContainer(numberOfDoors);
    doorMediaController = new DoorMediaController(doorContainer);
    doorMediaController.resetAll();
}

async function handlePlay() {
    doorMediaController.play();
}

function handlePause() {
    doorMediaController.pause();
}

function handleStepForward() {
    doorMediaController.stepForward();
}

function handleStepBack() {
    doorMediaController.stepBack();
}

function handleResetAll() {
    doorMediaController.resetAll();
}