// const mm = require('../node_modules/music-metadata');
// const util = require('../node_modules/util');
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// (async () => {
//     try {
//         const mm = require("../node_modules/music-metadata");
//         const metadata = await mm.parseFile('../node_modules/music-metadata/test/samples/MusicBrainz - Beth Hart - Sinner\'s Prayer [id3v2.3].V2.mp3');
//     //   console.log(util.inspect(metadata, { showHidden: false, depth: null }));
//     } catch (error) {
//         console.error(error.message);
//     }
//     })();
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
let synth = new Tone.Synth().toMaster();
const velocitySynth = [100, 800];
;
function disableSelection() {
    const el1 = document.getElementById("sortType");
    const el2 = document.getElementById("sortOrder");
    if (!el1.classList.contains("disabledAfter" /* disabledAfter */)) {
        document.getElementById("sortType").classList.toggle("disabledAfter" /* disabledAfter */);
    }
    if (!el2.classList.contains("disabledAfter" /* disabledAfter */)) {
        document.getElementById("sortOrder").classList.toggle("disabledAfter" /* disabledAfter */);
    }
    document.querySelectorAll("select").forEach(item => { item.setAttribute("disabled", ""); });
}
function disableInputCountOfLines() {
    const el = document.getElementById("nodeCount");
    if (!el.classList.contains("disabledAfter" /* disabledAfter */))
        el.classList.toggle("disabledAfter" /* disabledAfter */);
    document.querySelector("." + "nodeCount" /* NodeCountInput */).setAttribute("disabled", "");
}
function disableRandomizeButton() {
    const el = document.querySelector("." + "randomizeBtn" /* randomizeBtn */);
    if (!el.classList.contains("disabledAfter" /* disabledAfter */))
        el.classList.toggle("disabledAfter" /* disabledAfter */);
    document.querySelector("." + "randomizeBtn" /* randomizeBtn */).setAttribute("disabled", "");
}
function disableStartButton() {
    const el = document.querySelector("." + "startBtn" /* startBtn */);
    if (!el.classList.contains("disabledAfter" /* disabledAfter */))
        el.classList.toggle("disabledAfter" /* disabledAfter */);
    document.querySelector("." + "startBtn" /* startBtn */).setAttribute("disabled", "");
}
function enableSelection() {
    const el1 = document.getElementById("sortType");
    const el2 = document.getElementById("sortOrder");
    if (el1.classList.contains("disabledAfter" /* disabledAfter */))
        el1.classList.toggle("disabledAfter" /* disabledAfter */);
    if (el2.classList.contains("disabledAfter" /* disabledAfter */))
        el2.classList.toggle("disabledAfter" /* disabledAfter */);
    document.querySelectorAll("select").forEach(item => { item.removeAttribute("disabled"); });
}
function enableInputCountOfLines() {
    const el = document.getElementById("nodeCount");
    if (el.classList.contains("disabledAfter" /* disabledAfter */))
        el.classList.toggle("disabledAfter" /* disabledAfter */);
    document.querySelector("." + "nodeCount" /* NodeCountInput */).removeAttribute("disabled");
}
function enableRandomizeButton() {
    const el = document.querySelector("." + "randomizeBtn" /* randomizeBtn */);
    if (el.classList.contains("disabledAfter" /* disabledAfter */))
        el.classList.toggle("disabledAfter" /* disabledAfter */);
    document.querySelector("." + "randomizeBtn" /* randomizeBtn */).removeAttribute("disabled");
}
function enableStartButton() {
    const el = document.querySelector("." + "startBtn" /* startBtn */);
    if (el.classList.contains("disabledAfter" /* disabledAfter */))
        el.classList.toggle("disabledAfter" /* disabledAfter */);
    document.querySelector("." + "startBtn" /* startBtn */).removeAttribute("disabled");
}
function disableWhileSort() {
    disableSelection();
    disableInputCountOfLines();
    disableRandomizeButton();
    disableStartButton();
}
function enableAfterSort() {
    enableSelection();
    enableInputCountOfLines();
    enableRandomizeButton();
    enableStartButton();
}
function changeIterationsCount(newCount) {
    document.querySelector(".iterations span").innerHTML = newCount.toString();
}
function changePermutationsCount(newCount) {
    document.querySelector(".permutations span").innerHTML = newCount.toString();
}
class Generator {
    constructor(_data) {
        this.setSound(_data.soundOn);
        this.setSortType(_data.type);
        this.setSortOrder(_data.isAscending);
        this.setTimeOutTransition(_data.timeOut || 100);
        this.setArrayData(_data.data || _data.countOfLines || 50);
    }
    setSound(isOn) {
        this.soundOn = isOn;
    }
    setSortType(_sortType) {
        switch (_sortType) {
            case "bubble": {
                this.sort = new BubbleSort(this);
                break;
            }
            case "insertion": {
                this.sort = new InsertionSort(this);
                break;
            }
            case "quick": {
                this.sort = new QuickSort(this);
                break;
            }
            default: {
                this.sort = new BubbleSort(this);
            }
        }
        this.setSortOrder(getSortOrder());
    }
    setTimeOutTransition(timeOut) {
        this.timeOutTransition = timeOut;
    }
    setArrayData(data) {
        if (typeof data === 'number' && this.countOfLines != data) {
            this.countOfLines = data;
            this.sortArray = null;
            this.initializeArray();
            this.renderDOM();
        }
        else if (Array.isArray(data)) {
            this.sortArray = data;
            this.countOfLines = data.length;
            this.initializeArray();
            this.renderDOM();
        }
    }
    randomizeArray(passCount) {
        if (this.sortArray == null || this.sortArray == undefined)
            this.initializeArray();
        const len = this.sortArray.length;
        while (passCount--) {
            for (let i = 0; i < len; ++i) {
                const randInd = Math.floor(Math.random() * len);
                const tmp1 = this.sortArray[randInd];
                const tmp2 = this.domArray[randInd];
                this.sortArray[randInd] = this.sortArray[i];
                this.domArray[randInd] = this.domArray[i];
                this.sortArray[i] = tmp1;
                this.domArray[i] = tmp2;
            }
        }
    }
    initializeDomArray() {
        if (this.sortArray == null || this.sortArray == undefined)
            return;
        this.domArray = [];
        let maxNode = this.sortArray[0];
        this.sortArray.forEach(item => { if (item > maxNode)
            maxNode = item; });
        this.sortArray.forEach(item => {
            this.domArray.push(item / maxNode * 100);
        });
    }
    initializeArray() {
        if (this.sortArray == null || this.sortArray == undefined) {
            this.sortArray = [];
            for (let i = 0; i < this.countOfLines; ++i) {
                this.sortArray.push(i + 1);
            }
        }
        this.initializeDomArray();
    }
    setLineIndent(newIndent) {
        if (newIndent != undefined && newIndent != null)
            this.lineIndent = newIndent;
        else
            this.lineIndent = 1;
    }
    renderDOM() {
        changeIterationsCount(0);
        changePermutationsCount(0);
        this.initializeArray();
        this.setLineIndent();
        // this.randomizeArray(50);
        const domContainer = document.querySelector("." + "containerSort" /* Container */);
        const heightContainer = domContainer.getBoundingClientRect().height;
        const lineHeight = heightContainer / this.countOfLines - 0.2 * (heightContainer / this.countOfLines);
        // console.log(lineHeight);
        domContainer.innerHTML = "";
        this.domArray.forEach((percent) => {
            let containerLine = document.createElement("div");
            containerLine.classList.add("containerLine" /* containerLine */);
            let newLine = document.createElement("div");
            newLine.classList.add("line" /* Line */);
            newLine.style.width = percent.toFixed(2) + "%";
            // newLine.style.opacity = (percent / 100).toFixed(2);
            newLine.style.height = lineHeight.toString() + "px";
            containerLine.appendChild(newLine);
            domContainer.appendChild(containerLine);
        });
    }
    deleteElementBottomLine(index) {
        if (index != null && index != undefined && index < this.sortArray.length && index >= 0) {
            const domContainer = document.querySelector("." + "containerSort" /* Container */);
            const len = domContainer.querySelectorAll("." + "containerLine" /* containerLine */)[index].children.length;
            const child = domContainer.querySelectorAll("." + "containerLine" /* containerLine */)[index].children[len - 1];
            domContainer.querySelectorAll("." + "containerLine" /* containerLine */)[index].removeChild(child);
        }
    }
    setElementBottomLine(index, color) {
        if (index != null && index != undefined && index < this.sortArray.length && index >= 0) {
            const domContainer = document.querySelector("." + "containerSort" /* Container */);
            let lineBottom = document.createElement("div");
            lineBottom.classList.add("lineBottom" /* bottomLine */);
            // lineBottom.style.position = "absolute";
            // lineBottom.style.top = (lineHeight * index).toFixed(2) + "px";
            if (color != null && color != undefined)
                lineBottom.style.backgroundColor = color;
            domContainer.querySelectorAll("." + "containerLine" /* containerLine */)[index].appendChild(lineBottom);
            // domContainer.appendChild(lineBottom);
        }
    }
    setTopLine(index, color) {
        if (index != null && index != undefined && index < this.sortArray.length && index >= 0) {
            const domContainer = document.querySelector("." + "containerSort" /* Container */);
            let lineTop = document.createElement("div");
            lineTop.classList.add("lineTop" /* topLine */);
            // lineBottom.style.position = "absolute";
            // lineBottom.style.top = (lineHeight * index).toFixed(2) + "px";
            if (color != null && color != undefined)
                lineTop.style.backgroundColor = color;
            domContainer.querySelectorAll("." + "containerLine" /* containerLine */)[index].prepend(lineTop);
            // domContainer.appendChild(lineBottom);
        }
    }
    deleteTopLine(index) {
        if (index != null && index != undefined && index < this.sortArray.length && index >= 0) {
            const domContainer = document.querySelector("." + "containerSort" /* Container */);
            const child = domContainer.querySelectorAll("." + "containerLine" /* containerLine */)[index].children[0];
            domContainer.querySelectorAll("." + "containerLine" /* containerLine */)[index].removeChild(child);
        }
    }
    printArrays() {
        console.log("sortArray is " + this.sortArray);
        console.log("domArray is " + this.domArray);
    }
    getArrayToSort() {
        return this.sortArray;
    }
    swap(first, second) {
        const temp1 = this.sortArray[first];
        this.sortArray[first] = this.sortArray[second];
        this.sortArray[second] = temp1;
        const domContainer = document.querySelector("." + "containerSort" /* Container */);
        const firstElement = domContainer.querySelectorAll("." + "line" /* Line */)[first];
        const secondElement = domContainer.querySelectorAll("." + "line" /* Line */)[second];
        const temp2 = this.domArray[first];
        this.domArray[first] = this.domArray[second];
        this.domArray[second] = temp2;
        firstElement.style.width = this.domArray[first] + "%";
        secondElement.style.width = this.domArray[second] + "%";
    }
    updateDomWidth() {
        this.initializeDomArray();
        const domContainer = document.querySelector("." + "containerSort" /* Container */);
        domContainer.querySelectorAll("." + "line" /* Line */).forEach((item, i) => {
            item.style.width = this.domArray[i].toString() + "%";
        });
    }
    getTimeOutTransition() {
        return this.timeOutTransition;
    }
    setSortOrder(_order) {
        this.sort.setSortOrder(_order);
    }
    selectAll(isAscending) {
        return __awaiter(this, void 0, void 0, function* () {
            const domContainer = document.querySelector("." + "containerSort" /* Container */);
            const timout = 1 * 1000 / this.countOfLines;
            if (isAscending) {
                for (let i = 0; i < this.sortArray.length; ++i) {
                    yield delay(timout);
                    this.sound(i);
                    domContainer.querySelectorAll("." + "line" /* Line */)[i].style.backgroundColor = "green";
                }
            }
            else {
                let copyDomArr = [...domContainer.querySelectorAll("." + "line" /* Line */)];
                copyDomArr = copyDomArr.reverse();
                for (let i = 0; i < this.sortArray.length; ++i) {
                    yield delay(timout);
                    this.sound(i);
                    copyDomArr[i].style.backgroundColor = "green";
                }
            }
        });
    }
    select(index, color) {
        if (index >= this.sortArray.length || index < 0)
            return;
        const domContainer = document.querySelector("." + "containerSort" /* Container */);
        domContainer.querySelectorAll("." + "line" /* Line */)[index].style.backgroundColor = color || "green";
    }
    deselect(index) {
        if (index >= this.sortArray.length || index < 0)
            return;
        const domContainer = document.querySelector("." + "containerSort" /* Container */);
        domContainer.querySelectorAll("." + "line" /* Line */)[index].style.backgroundColor = null;
    }
    stopSort() {
        let delay = this.timeOutTransition;
        if (this.sort.getIfStopped())
            delay = 0;
        this.sort.setStopSort(true);
        setTimeout(() => {
            this.sortArray = null;
            this.renderDOM();
            enableAfterSort();
            this.sort.setStopSort(false);
        }, delay + 10);
    }
    sound(index) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.soundOn || index >= this.sortArray.length || index < 0)
                return;
            let max = velocitySynth[1];
            let min = velocitySynth[0];
            let width = this.domArray[index];
            let velocityCurrent = (width / 100) * (max - min) + min;
            try {
                yield synth.triggerAttackRelease(velocityCurrent + "hz", 0.0001, Tone.now() + 0.05);
            }
            catch (_a) {
            }
        });
    }
}
;
class App extends Generator {
    startSort() {
        changeIterationsCount(0);
        changePermutationsCount(0);
        disableWhileSort();
        this.sort.startSort();
    }
    randomize(passCount) {
        this.randomizeArray(passCount || 10);
        this.renderDOM();
    }
    renderLines() {
        this.renderDOM();
    }
}
;
class Sort {
    constructor(generator) {
        this.generator = generator;
        this.stopSort = false;
    }
    setSortOrder(_isAscending) {
        if (_isAscending === undefined || _isAscending === null)
            _isAscending = true;
        this.isAscending = _isAscending;
    }
    swap(first, second) {
        this.generator.swap(first, second);
    }
    setElementBottomLine(_index) {
        this.generator.setElementBottomLine(_index);
    }
    deleteElementBottomLine(_index) {
        this.generator.deleteElementBottomLine(_index);
    }
    setElementTopLine(_index) {
        this.generator.setTopLine(_index);
    }
    deleteElementTopLine(_index) {
        this.generator.deleteTopLine(_index);
    }
    getTimeOutTransition() {
        return this.generator.getTimeOutTransition();
    }
    select(index, color) {
        this.generator.select(index, color);
    }
    selectAll(isAscending) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.generator.selectAll(isAscending);
        });
    }
    deselect(index) {
        this.generator.deselect(index);
    }
    setStopSort(isStop) {
        this.stopSort = isStop;
    }
    getIfStopped() {
        return this.stopSort;
    }
    updateDomWidth() {
        this.generator.updateDomWidth();
    }
    sound(index) {
        this.generator.sound(index);
    }
    startSort() { }
    ;
}
class QuickSort extends Sort {
    startSort() {
        return __awaiter(this, void 0, void 0, function* () {
            this.permutations = 0;
            this.iterations = 0;
            this.arrayToSort = this.generator.getArrayToSort();
            yield this.sort(0, this.arrayToSort.length - 1);
            if (this.stopSort)
                return;
            yield this.selectAll(this.isAscending);
            enableAfterSort();
        });
    }
    partion(left, right) {
        return __awaiter(this, void 0, void 0, function* () {
            yield delay(this.getTimeOutTransition());
            if (this.stopSort)
                return;
            this.setElementTopLine(left);
            this.setElementBottomLine(right);
            let temp = this.arrayToSort[left];
            let count = 0;
            // this.select(left, "orange");
            // await delay(this.getTimeOutTransition());
            for (let i = left + 1; i <= right; ++i) {
                if (this.stopSort)
                    return;
                this.iterations++;
                changeIterationsCount(this.iterations);
                // this.select(i, "orange");
                // this.deselect(i - 1);
                if ((this.isAscending && this.arrayToSort[i] < temp) ||
                    (!this.isAscending && this.arrayToSort[i] > temp)) {
                    count++;
                }
                // await delay(this.getTimeOutTransition());
            }
            // this.deselect(right);
            // this.deselect(left);
            // this.deselect(left);
            let tempIndex = left + count;
            this.select(tempIndex, "cyan");
            this.sound(tempIndex);
            this.swap(tempIndex, left);
            this.permutations++;
            changePermutationsCount(this.permutations);
            let i = left;
            let j = right;
            this.select(i);
            this.select(j);
            while (i < tempIndex && j > tempIndex) {
                if (this.stopSort)
                    return;
                yield delay(this.getTimeOutTransition());
                while ((this.isAscending && this.arrayToSort[i] < temp) ||
                    (!this.isAscending && this.arrayToSort[i] > temp)) {
                    if (this.stopSort)
                        return;
                    yield delay(this.getTimeOutTransition());
                    i++;
                    this.deselect(i - 1);
                    this.select(i);
                    this.sound(i);
                    this.iterations++;
                    changeIterationsCount(this.iterations);
                }
                while ((this.isAscending && this.arrayToSort[j] >= temp) ||
                    (!this.isAscending && this.arrayToSort[j] <= temp)) {
                    if (this.stopSort)
                        return;
                    yield delay(this.getTimeOutTransition());
                    j--;
                    this.select(j);
                    this.sound(j);
                    this.deselect(j + 1);
                    this.iterations++;
                    changeIterationsCount(this.iterations);
                }
                if (i < tempIndex && j > tempIndex) {
                    this.swap(i, j);
                    this.permutations++;
                    changePermutationsCount(this.permutations);
                }
            }
            this.deselect(left);
            this.deselect(right);
            this.deselect(i - 1);
            this.deselect(j + 1);
            this.deselect(tempIndex);
            this.deleteElementTopLine(left);
            this.deleteElementBottomLine(right);
            return new Promise(resolve => resolve(tempIndex));
        });
    }
    sort(left, right) {
        return __awaiter(this, void 0, void 0, function* () {
            yield delay(this.getTimeOutTransition());
            if (left >= right)
                return;
            let partionIndex = yield this.partion(left, right);
            if (this.stopSort)
                return;
            yield this.sort(left, partionIndex - 1);
            if (this.stopSort)
                return;
            yield this.sort(partionIndex + 1, right);
            if (this.stopSort)
                return;
        });
    }
}
;
class InsertionSort extends Sort {
    startSort() {
        this.permutations = 0;
        this.iterations = 0;
        this.arrayToSort = this.generator.getArrayToSort();
        this.sort();
    }
    findmaxminElement(start) {
        let minmax = this.arrayToSort[start];
        let minmaxResult = start;
        for (let i = start; i < this.arrayToSort.length; ++i) {
            if (this.isAscending && this.arrayToSort[i] < minmax) {
                minmax = this.arrayToSort[i];
                minmaxResult = i;
            }
            if (!this.isAscending && this.arrayToSort[i] > minmax) {
                minmax = this.arrayToSort[i];
                minmaxResult = i;
            }
        }
        return minmaxResult;
    }
    sort() {
        return __awaiter(this, void 0, void 0, function* () {
            this.select(0);
            let minmaxInd = this.findmaxminElement(0);
            let iteratorSorted = 0;
            for (let i = 1; i < this.arrayToSort.length; i++) {
                if (this.stopSort)
                    return;
                let temp = this.arrayToSort[i];
                let j = i - 1;
                for (let k = iteratorSorted; k < i; ++k) {
                    this.deselect(k + 1);
                    if (this.isAscending && temp < this.arrayToSort[k]) {
                        for (let f = k; f < i; ++f)
                            this.select(f, "cyan");
                        break;
                    }
                    if (!this.isAscending && temp > this.arrayToSort[k]) {
                        for (let f = k; f < i; ++f)
                            this.select(f, "cyan");
                        break;
                    }
                }
                this.select(i);
                this.sound(i);
                while (j >= 0) {
                    if (this.stopSort)
                        return;
                    if (this.isAscending && temp > this.arrayToSort[j])
                        break;
                    if (!this.isAscending && temp < this.arrayToSort[j])
                        break;
                    yield delay(this.getTimeOutTransition());
                    this.sound(j);
                    this.select(j);
                    this.deselect(j + 1);
                    this.arrayToSort[j + 1] = this.arrayToSort[j];
                    this.updateDomWidth();
                    --j;
                    this.permutations++;
                    changePermutationsCount(this.permutations);
                    this.iterations++;
                    changeIterationsCount(this.iterations);
                }
                this.deselect(j + 1);
                this.arrayToSort[j + 1] = temp;
                this.updateDomWidth();
                minmaxInd = this.findmaxminElement(iteratorSorted);
                while (minmaxInd <= i && iteratorSorted == minmaxInd) {
                    this.select(iteratorSorted);
                    iteratorSorted++;
                    minmaxInd = this.findmaxminElement(iteratorSorted);
                }
                yield delay(this.getTimeOutTransition());
                if (this.stopSort)
                    return;
            }
            enableAfterSort();
        });
    }
}
;
class BubbleSort extends Sort {
    startSort() {
        this.permutations = 0;
        this.iterations = 0;
        this.arrayToSort = this.generator.getArrayToSort();
        this.sort();
    }
    sort() {
        return __awaiter(this, void 0, void 0, function* () {
            for (let i = 0; i < this.arrayToSort.length; ++i) {
                for (let j = 0; j < this.arrayToSort.length - 1 - i; ++j) {
                    if (this.stopSort)
                        return;
                    this.iterations++;
                    changeIterationsCount(this.iterations);
                    yield delay(this.getTimeOutTransition());
                    // wait(this.getTimeOutTransition())
                    if (j == this.arrayToSort.length - 2)
                        this.select(j + 1);
                    if (j > 0)
                        this.deselect(j - 1);
                    // this.select(j + 1);
                    this.select(j);
                    this.sound(j);
                    if (this.isAscending && this.arrayToSort[j] < this.arrayToSort[j + 1]) {
                        this.swap(j, j + 1);
                        this.permutations++;
                        changePermutationsCount(this.permutations);
                    }
                    else if (!this.isAscending && this.arrayToSort[j] > this.arrayToSort[j + 1]) {
                        this.swap(j, j + 1);
                        this.permutations++;
                        changePermutationsCount(this.permutations);
                    }
                }
            }
            enableAfterSort();
        });
    }
}
function getTypeOfSorting() {
    return document.querySelector("." + "sortSelection" /* sortSelection */).value;
}
function getCountOfLines() {
    return +document.querySelector("." + "nodeCount" /* NodeCountInput */).value;
}
function getSortOrder() {
    console.log(document.querySelector("." + "sortOrder" /* sortOrder */).value);
    return document.querySelector("." + "sortOrder" /* sortOrder */).value == "ascending" ? true : false;
}
function getTimeOut() {
    return +document.querySelector("." + "transition" /* transitionInput */).value;
}
const app = new App({
    type: "bubble",
    // data: [1, 2, 2, 3, 5, 4, 1, 7, 8, 9, 10],
    countOfLines: getCountOfLines(),
    isAscending: getSortOrder(),
    timeOut: getTimeOut(),
});
app.renderLines();
document.querySelector("." + "nodeCount" /* NodeCountInput */).addEventListener("change", (e) => {
    const value = +e.target.value;
    console.log("newCountOfNodes: " + value);
    app.setArrayData(value || 50);
});
document.querySelector("." + "randomizeBtn" /* randomizeBtn */).addEventListener("click", () => {
    app.randomize();
});
document.querySelector("." + "startBtn" /* startBtn */).addEventListener("click", () => {
    app.renderDOM();
    app.startSort();
});
document.querySelector("." + "resetBtn" /* resetBtn */).addEventListener("click", () => {
    synth = new Tone.Synth().toMaster();
    changeIterationsCount(0);
    changePermutationsCount(0);
    app.stopSort();
});
document.querySelector("." + "transition" /* transitionInput */).addEventListener("change", (e) => {
    let value = +e.target.value;
    if (value < 0)
        value = 0;
    console.log("newTransition: " + value);
    setTimeout(() => {
        app.setTimeOutTransition(value);
    }, 0);
});
document.querySelector("." + "sortOrder" /* sortOrder */).addEventListener("change", () => {
    app.setSortOrder(getSortOrder());
});
document.querySelector("." + "sortSelection" /* sortSelection */).addEventListener("change", (e) => {
    app.setSortType(e.target.value);
});
document.querySelector("." + "sound" /* sound */).addEventListener("change", (e) => {
    setTimeout(() => {
        app.setSound(e.target.checked);
    }, 0);
});
