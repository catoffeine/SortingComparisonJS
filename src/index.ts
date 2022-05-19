import './scss/styles.scss'
import { Synth } from 'tone'
// const Tone = require("tone");
// const Synth = require('./ToneModule');

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

let synth = new Synth().toDestination();
const velocitySynth = [100, 800];

const enum domClasses {
    Container = "containerSort",
    Line = "line",
    NodeCountInput = "nodeCount",
    randomizeBtn = "randomizeBtn",
    startBtn = "startBtn",
    resetBtn = "resetBtn",
    bottomLine = "lineBottom",
    topLine = "lineTop",
    containerLine = "containerLine",
    transitionInput = "transition",
    sortSelection = "sortSelection",
    sortOrder = "sortOrder",
    disabledAfter = "disabledAfter",
    sound = "sound",
};

function disableSelection() {
    const el1 = document.getElementById("sortType");
    const el2 = document.getElementById("sortOrder");
    if (!el1.classList.contains(domClasses.disabledAfter)) {
        document.getElementById("sortType").classList.toggle(domClasses.disabledAfter);
    }

    if (!el2.classList.contains(domClasses.disabledAfter)) {
        document.getElementById("sortOrder").classList.toggle(domClasses.disabledAfter);
    }

    document.querySelectorAll("select").forEach(item => { item.setAttribute("disabled", "");});
}

function disableInputCountOfLines() {
    const el = document.getElementById("nodeCount");
    if (!el.classList.contains(domClasses.disabledAfter)) el.classList.toggle(domClasses.disabledAfter);
    document.querySelector("." + domClasses.NodeCountInput).setAttribute("disabled", "");
}

function disableRandomizeButton() {
    const el = document.querySelector("." + domClasses.randomizeBtn);
    if (!el.classList.contains(domClasses.disabledAfter)) el.classList.toggle(domClasses.disabledAfter);
    document.querySelector("." + domClasses.randomizeBtn).setAttribute("disabled", "");
}

function disableStartButton() {
    const el = document.querySelector("." + domClasses.startBtn);
    if (!el.classList.contains(domClasses.disabledAfter)) el.classList.toggle(domClasses.disabledAfter);
    document.querySelector("." + domClasses.startBtn).setAttribute("disabled", "");
}

function enableSelection() {
    const el1 = document.getElementById("sortType");
    const el2 = document.getElementById("sortOrder"); 

    if (el1.classList.contains(domClasses.disabledAfter)) el1.classList.toggle(domClasses.disabledAfter);
    if (el2.classList.contains(domClasses.disabledAfter)) el2.classList.toggle(domClasses.disabledAfter);

    document.querySelectorAll("select").forEach(item => { item.removeAttribute("disabled");});
}

function enableInputCountOfLines() {
    const el = document.getElementById("nodeCount"); 
    if (el.classList.contains(domClasses.disabledAfter)) el.classList.toggle(domClasses.disabledAfter);
    document.querySelector("." + domClasses.NodeCountInput).removeAttribute("disabled");
}

function enableRandomizeButton() {
    const el = document.querySelector("." + domClasses.randomizeBtn);
    if (el.classList.contains(domClasses.disabledAfter)) el.classList.toggle(domClasses.disabledAfter);
    document.querySelector("." + domClasses.randomizeBtn).removeAttribute("disabled");
}

function enableStartButton() {
    const el = document.querySelector("." + domClasses.startBtn);
    if (el.classList.contains(domClasses.disabledAfter)) el.classList.toggle(domClasses.disabledAfter);
    document.querySelector("." + domClasses.startBtn).removeAttribute("disabled");
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

function changeIterationsCount(newCount: number) {
    document.querySelector(".iterations span").innerHTML = newCount.toString();
}

function changePermutationsCount(newCount: number) {
    document.querySelector(".permutations span").innerHTML = newCount.toString();
}

class Generator {
    private countOfLines: number;
    private sortArray: Array<number>;
    private domArray: Array<number>;
    private timeOutTransition: number;
    private lineIndent: number;
    private soundOn: boolean;
    protected sort: Sort;

    constructor(_data: 
        {
            type: string,
            data?: Array<number>,
            countOfLines?: number,
            isAscending?: boolean,
            timeOut?: number,
            soundOn?: boolean
        }) {
        this.setSound(_data.soundOn);
        this.setSortType(_data.type);
        this.setSortOrder(_data.isAscending);
        this.setTimeOutTransition(_data.timeOut || 100);
        this.setArrayData(_data.data || _data.countOfLines || 50);
    }

    setSound(isOn: boolean): void {
        this.soundOn = isOn;
    }

    setSortType(_sortType: string): void {
        switch(_sortType) {
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

    setTimeOutTransition(timeOut: number) {
        this.timeOutTransition = timeOut;
    }

    setArrayData(data: number | Array<number>) {
        if (typeof data === 'number' && this.countOfLines != data) {
            this.countOfLines = data;
            this.sortArray = null;
            this.initializeArray();
            this.renderDOM();
        } else if (Array.isArray(data)) {
            this.sortArray = data;
            this.countOfLines = data.length;
            this.initializeArray();
            this.renderDOM();
        }
        
    }

    randomizeArray(passCount: number): void {
        if (this.sortArray == null || this.sortArray == undefined) this.initializeArray();
        const len: number = this.sortArray.length;
        while (passCount--) {
            for (let i: number = 0; i < len; ++i) {
                const randInd: number = Math.floor(Math.random() * len);

                const tmp1 = this.sortArray[randInd];
                const tmp2 = this.domArray[randInd];

                this.sortArray[randInd] = this.sortArray[i];
                this.domArray[randInd] = this.domArray[i];

                this.sortArray[i] = tmp1;
                this.domArray[i] = tmp2;
            }
        }
    }
    initializeDomArray(): void {
        if (this.sortArray == null || this.sortArray == undefined) return;
        this.domArray = [];
        let maxNode = this.sortArray[0];
        
        this.sortArray.forEach(item => {if (item > maxNode) maxNode = item;});
        this.sortArray.forEach(item => {
            this.domArray.push(item / maxNode * 100);
        });
    }
    initializeArray(): void {
        if (this.sortArray == null || this.sortArray == undefined) {
            this.sortArray = [];
            for (let i: number = 0; i < this.countOfLines; ++i) {
                this.sortArray.push(i + 1);
            }
        } 
        this.initializeDomArray();   
    }
    setLineIndent(newIndent?: number): void { 
        if (newIndent != undefined && newIndent != null) this.lineIndent = newIndent;
        else this.lineIndent = 1;
    }
    
    renderDOM(): void {
        changeIterationsCount(0);
        changePermutationsCount(0);
        this.initializeArray();
        this.setLineIndent();
        // this.randomizeArray(50);

        const domContainer: any = document.querySelector("." + domClasses.Container);
        const heightContainer: number = domContainer.getBoundingClientRect().height;

        const lineHeight: number = heightContainer / this.countOfLines - 0.2 * (heightContainer / this.countOfLines);
        // console.log(lineHeight);
        domContainer.innerHTML = "";

        this.domArray.forEach((percent) => {
            let containerLine = document.createElement("div");
            containerLine.classList.add(domClasses.containerLine);
            let newLine = document.createElement("div");
            newLine.classList.add("line" /* Line */);
            newLine.style.width = percent.toFixed(2) + "%";
            // newLine.style.opacity = (percent / 100).toFixed(2);
            newLine.style.height = lineHeight.toString()+ "px";
            containerLine.appendChild(newLine);
            domContainer.appendChild(containerLine);
        });
    }

    deleteElementBottomLine(index: number) {
        if (index != null && index != undefined && index < this.sortArray.length && index >= 0) {
            const domContainer: any = document.querySelector("." + domClasses.Container);
            const len: number = domContainer.querySelectorAll("." + domClasses.containerLine)[index].children.length;
            const child: any = domContainer.querySelectorAll("." + domClasses.containerLine)[index].children[len - 1];
            domContainer.querySelectorAll("." + domClasses.containerLine)[index].removeChild(child);
        }
    }
    setElementBottomLine(index: number, color?: string): void {
        if (index != null && index != undefined && index < this.sortArray.length && index >= 0) {
            const domContainer: any = document.querySelector("." + domClasses.Container);

            let lineBottom = document.createElement("div");
                lineBottom.classList.add(domClasses.bottomLine);
                // lineBottom.style.position = "absolute";
                // lineBottom.style.top = (lineHeight * index).toFixed(2) + "px";
            if (color != null && color != undefined) lineBottom.style.backgroundColor = color;

            domContainer.querySelectorAll("." + domClasses.containerLine)[index].appendChild(lineBottom);
            // domContainer.appendChild(lineBottom);
        }
    }

    setTopLine(index: number, color?: string) {
        if (index != null && index != undefined && index < this.sortArray.length && index >= 0) {
            const domContainer: any = document.querySelector("." + domClasses.Container);

            let lineTop = document.createElement("div");
            lineTop.classList.add(domClasses.topLine);
                // lineBottom.style.position = "absolute";
                // lineBottom.style.top = (lineHeight * index).toFixed(2) + "px";
            if (color != null && color != undefined) lineTop.style.backgroundColor = color;

            domContainer.querySelectorAll("." + domClasses.containerLine)[index].prepend(lineTop);
            // domContainer.appendChild(lineBottom);
        }
    }
    deleteTopLine(index: number) {
        if (index != null && index != undefined && index < this.sortArray.length && index >= 0) {
            const domContainer: any = document.querySelector("." + domClasses.Container);
            const child: any = domContainer.querySelectorAll("." + domClasses.containerLine)[index].children[0];
            domContainer.querySelectorAll("." + domClasses.containerLine)[index].removeChild(child);
        }
    }

    printArrays(): void {
        console.log("sortArray is " + this.sortArray);
        console.log("domArray is " + this.domArray);
    }
    getArrayToSort(): Array<number> {
        return this.sortArray;
    }

    swap(first: number, second: number): void {

        const temp1: number = this.sortArray[first];
        
        this.sortArray[first] = this.sortArray[second];
        this.sortArray[second] = temp1;
        
        const domContainer: any = document.querySelector("." + domClasses.Container);
        const firstElement = domContainer.querySelectorAll("." + domClasses.Line)[first];
        const secondElement = domContainer.querySelectorAll("." + domClasses.Line)[second];

        const temp2: number = this.domArray[first];
        this.domArray[first] = this.domArray[second];
        this.domArray[second] = temp2;

        firstElement.style.width = this.domArray[first] + "%";
        secondElement.style.width = this.domArray[second] + "%";
    }

    updateDomWidth() {
        this.initializeDomArray();
        const domContainer: any = document.querySelector("." + domClasses.Container);
        domContainer.querySelectorAll("." + domClasses.Line).forEach((item: HTMLDivElement, i: number) => {
            item.style.width = this.domArray[i].toString() + "%";
        })
    }

    getTimeOutTransition(): number {
        return this.timeOutTransition;
    }

    setSortOrder(_order: boolean): void {
        this.sort.setSortOrder(_order);
    }

    async selectAll(isAscending: boolean) {
        const domContainer: any = document.querySelector("." + domClasses.Container);
        const timout = 1 * 1000 / this.countOfLines;
        if (isAscending) {
            for (let i: number = 0; i < this.sortArray.length; ++i) {
                await delay(timout);
                this.sound(i);
                domContainer.querySelectorAll("." + domClasses.Line)[i].style.backgroundColor = "green"; 
            }
        } else {
            let copyDomArr: Array<HTMLDivElement> = [...domContainer.querySelectorAll("." + domClasses.Line)];
            copyDomArr = copyDomArr.reverse();
            for (let i: number = 0; i < this.sortArray.length; ++i) {
                await delay(timout);
                this.sound(i);
                copyDomArr[i].style.backgroundColor = "green"; 
            }
        }
    }

    select(index: number, color?: string) {
        if (index >= this.sortArray.length || index < 0) return;
        const domContainer: any = document.querySelector("." + domClasses.Container);
        domContainer.querySelectorAll("." + domClasses.Line)[index].style.backgroundColor = color || "green";
    }

    deselect(index: number) {
        if (index >= this.sortArray.length || index < 0) return;
        const domContainer: any = document.querySelector("." + domClasses.Container);
        domContainer.querySelectorAll("." + domClasses.Line)[index].style.backgroundColor = null;
    }

    stopSort() {
        let delay: number = this.timeOutTransition;
        if (this.sort.getIfStopped()) delay = 0;
        this.sort.setStopSort(true);
        
        setTimeout(() => {
            this.sortArray = null;
            this.renderDOM();
            enableAfterSort();
            this.sort.setStopSort(false);
        }, delay + 10);
    }

    async sound(index: number) {
        if (!this.soundOn || index >= this.sortArray.length || index < 0) return;
        let max: number = velocitySynth[1];
        let min: number = velocitySynth[0];
        let width: number = this.domArray[index];
        
        let velocityCurrent: number = (width / 100) * (max - min) + min;
        try {
            await synth.triggerAttackRelease(velocityCurrent + "hz", 0.0001, synth.now() + 0.05);
        } catch {
        }
    }
};

class App extends Generator {
    startSort(): void {
        changeIterationsCount(0);
        changePermutationsCount(0);
        disableWhileSort();
        this.sort.startSort();
    }
    randomize(passCount?: number) {
        this.randomizeArray(passCount || 10);
        this.renderDOM();
    }
    renderLines() {
        this.renderDOM();
    }
};

class Sort {
    protected permutations: number;
    protected iterations: number;
    protected stopSort: boolean;
    protected arrayToSort: Array<number>;
    protected generator: Generator;
    protected isAscending: boolean;
    constructor(generator: Generator) {
        this.generator = generator;
        this.stopSort = false;
    }

    setSortOrder(_isAscending: boolean): void {
        if (_isAscending === undefined || _isAscending === null) _isAscending = true;
        this.isAscending = _isAscending;
    }

    swap(first: number, second: number): void {
        this.generator.swap(first, second);
    }

    setElementBottomLine(_index: number) {
        this.generator.setElementBottomLine(_index);
    }
    deleteElementBottomLine(_index: number) {
        this.generator.deleteElementBottomLine(_index);
    }

    setElementTopLine(_index: number) {
    
        this.generator.setTopLine(_index);
    }
    deleteElementTopLine(_index: number) {
        this.generator.deleteTopLine(_index);
    }

    getTimeOutTransition(): number {
        return this.generator.getTimeOutTransition();
    }

    select(index: number, color?: string): void {
        this.generator.select(index, color);
    }
    
    async selectAll(isAscending: boolean) {
        await this.generator.selectAll(isAscending);
    }

    deselect(index: number): void {
        this.generator.deselect(index);
    }

    setStopSort(isStop: boolean): void {
        this.stopSort = isStop;
    }

    getIfStopped(): boolean {
        return this.stopSort;
    }

    updateDomWidth(): void {
        this.generator.updateDomWidth();
    }

    sound(index: number): void {
        this.generator.sound(index);
    }

    startSort(): void {};
}

class QuickSort extends Sort {
    async startSort() {
        this.permutations = 0;
        this.iterations = 0;
        this.arrayToSort = this.generator.getArrayToSort();

        await this.sort(0, this.arrayToSort.length - 1);
        if (this.stopSort) return;
        await this.selectAll(this.isAscending);
        enableAfterSort();
    }
    async partion(left: number, right: number): Promise<number> {
        await delay(this.getTimeOutTransition());
        if (this.stopSort) return;
        this.setElementTopLine(left);
        this.setElementBottomLine(right);
        let temp: number = this.arrayToSort[left];
        let count: number = 0;
        // this.select(left, "orange");
        // await delay(this.getTimeOutTransition());
        for (let i: number = left + 1; i <= right; ++i) {
            if (this.stopSort) return;
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
        let tempIndex: number = left + count;
        this.select(tempIndex, "cyan");
        this.sound(tempIndex);
        this.swap(tempIndex, left);
        this.permutations++;
        changePermutationsCount(this.permutations);

        let i: number = left;
        let j: number = right;

        this.select(i); this.select(j);
        while (i < tempIndex && j > tempIndex) {
            if (this.stopSort) return;
            await delay(this.getTimeOutTransition());
            while ((this.isAscending && this.arrayToSort[i] < temp) ||
                (!this.isAscending && this.arrayToSort[i] > temp)) {
                if (this.stopSort) return;
                await delay(this.getTimeOutTransition());
                i++;
                this.deselect(i - 1);
                this.select(i);
                this.sound(i);
                this.iterations++;
                changeIterationsCount(this.iterations);
            }
            while ((this.isAscending && this.arrayToSort[j] >= temp) ||
                (!this.isAscending && this.arrayToSort[j] <= temp)) {
                if (this.stopSort) return;
                await delay(this.getTimeOutTransition());
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

        return new Promise<number>(resolve => resolve(tempIndex));
    }
    async sort(left: number, right: number) {
        await delay(this.getTimeOutTransition());
        if (left >= right) return;
        let partionIndex: number = await this.partion(left, right);
        if (this.stopSort) return;

        await this.sort(left, partionIndex - 1);
        if (this.stopSort) return;
        await this.sort(partionIndex + 1, right);
        if (this.stopSort) return;
    }
};

class InsertionSort extends Sort {
    startSort() {
        this.permutations = 0;
        this.iterations = 0;
        this.arrayToSort = this.generator.getArrayToSort();
        this.sort();
    }

    findmaxminElement(start: number): number {
        let minmax: number = this.arrayToSort[start];
        let minmaxResult: number = start;
        for (let i: number = start; i < this.arrayToSort.length; ++i) {
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

    async sort() {
        this.select(0);
        let minmaxInd: number = this.findmaxminElement(0);
        let iteratorSorted: number = 0;

        for(let i: number = 1; i < this.arrayToSort.length; i++) {  
            if (this.stopSort) return;
            let temp: number = this.arrayToSort[i];
            let j:number = i - 1;
            
            
            for (let k: number = iteratorSorted; k < i; ++k) {
                this.deselect(k + 1);
                if (this.isAscending && temp < this.arrayToSort[k]) {
                    for (let f: number = k; f < i; ++f) this.select(f, "cyan");
                    break;
                }
                if (!this.isAscending && temp > this.arrayToSort[k]) {
                    for (let f: number = k; f < i; ++f) this.select(f, "cyan");
                    break;
                }
            }
            this.select(i);
            this.sound(i);
            while(j >= 0)  
            {
                if (this.stopSort) return;
                if (this.isAscending && temp > this.arrayToSort[j]) break;
                if (!this.isAscending && temp < this.arrayToSort[j]) break;
                await delay(this.getTimeOutTransition());
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
            await delay(this.getTimeOutTransition());
            if (this.stopSort) return;
        }  
        enableAfterSort();
    }
};

class BubbleSort extends Sort {
    startSort() {
        this.permutations = 0;
        this.iterations = 0;
        this.arrayToSort = this.generator.getArrayToSort();
        this.sort();
    }
    async sort() {
        for (let i: number = 0; i < this.arrayToSort.length; ++i) {
            for (let j: number = 0; j < this.arrayToSort.length - 1 - i; ++j) {
                if (this.stopSort) return;
                this.iterations++;
                changeIterationsCount(this.iterations);
                await delay(this.getTimeOutTransition());
                // wait(this.getTimeOutTransition())
                if (j == this.arrayToSort.length - 2) this.select(j + 1);
                if (j > 0) this.deselect(j - 1);
                // this.select(j + 1);
                this.select(j);
                this.sound(j);
                if (this.isAscending && this.arrayToSort[j] < this.arrayToSort[j + 1]) {
                    this.swap(j, j + 1);
                    this.permutations++;
                    changePermutationsCount(this.permutations);
                } else if (!this.isAscending && this.arrayToSort[j] > this.arrayToSort[j + 1]) {
                    this.swap(j, j + 1);
                    this.permutations++;
                    changePermutationsCount(this.permutations);
                }
            }
        }
        enableAfterSort();
    }
}

function getTypeOfSorting(): string {
    return (<HTMLDataElement>document.querySelector("." + domClasses.sortSelection)).value;
}

function getCountOfLines(): number {
    return +(<HTMLInputElement>document.querySelector("." + domClasses.NodeCountInput)).value;
}

function getSortOrder(): boolean {
    console.log((<HTMLDataElement>document.querySelector("." + domClasses.sortOrder)).value);
    return (<HTMLDataElement>document.querySelector("." + domClasses.sortOrder)).value == "ascending" ? true : false;
}

function getTimeOut(): number {
    return +(<HTMLInputElement>document.querySelector("." + domClasses.transitionInput)).value
}

const app: App = new App({
    type: "bubble",
    // data: [1, 2, 2, 3, 5, 4, 1, 7, 8, 9, 10],
    countOfLines: getCountOfLines(),
    isAscending: getSortOrder(),
    timeOut: getTimeOut(),
});

app.renderLines();

document.querySelector("." + domClasses.NodeCountInput).addEventListener("change", (e) => {
    const value: number = +(<HTMLInputElement>e.target).value;
    console.log("newCountOfNodes: " + value);
    app.setArrayData(value || 50);
});

document.querySelector("." + domClasses.randomizeBtn).addEventListener("click", () => {
    app.randomize()
});

document.querySelector("." + domClasses.startBtn).addEventListener("click", () => {
    app.renderDOM();
    app.startSort();
});

document.querySelector("." + domClasses.resetBtn).addEventListener("click", () => {
    synth = new Synth().toDestination();
    changeIterationsCount(0);
    changePermutationsCount(0);
    app.stopSort();
});

document.querySelector("." + domClasses.transitionInput).addEventListener("change", (e) => {
    let value: number = +(<HTMLInputElement>e.target).value;
    if (value < 0) value = 0;
    console.log("newTransition: " + value);
    setTimeout(() => {
        app.setTimeOutTransition(value); 
    }, 0);
    
});

document.querySelector("." + domClasses.sortOrder).addEventListener("change", () => {
    app.setSortOrder(getSortOrder());
});

document.querySelector("." + domClasses.sortSelection).addEventListener("change", (e) => {
    app.setSortType((<HTMLDataElement>e.target).value);
});

document.querySelector("." + domClasses.sound).addEventListener("change", (e) => {
    setTimeout(() => {
        app.setSound((<HTMLInputElement>e.target).checked)
    }, 0);
})