let WEIGHT_OF_REPEAT = 1;

class OccurencesEvaluator {
    constructor(starter_element, data) {
		//UWAGA! Prawdopodobnie zwiêksza z³o¿onoœæ obliczeniow¹
		//Dobrze by by³o zamieniæ na coœ o pewnej liniowoœci
        this.history = { starter_element: 1 };
        this.last_element = starter_element;
        this.data = data;
        this.totalLen = this.data.words[starter_element].length;
	}
	count(index) {
		if (this.history[index] == undefined) {
			return 0;
		}
		else {
            return this.history[index];
		}
	}
    add(index) {
        if (index == undefined) {
            throw Error("undefined index");
        }
		if (this.history[index] == undefined) {
			this.history[index] = 1;
		}
		else {
			this.history[index]+=1;
        }

        this.totalLen += this.data.pairLengths[this.last_element][index];
        //console.log(this.data.words[index], index);
        this.totalLen -= this.data.words[index].length;

        this.last_element = index;
    }
    eval(index) {
        return this.data.pairLengths[this.last_element][index] - this.count(index) * WEIGHT_OF_REPEAT;
    }
    choose(index1, index2) {
        //Je¿eli mo¿e wybiera drógi
        if (this.eval(index1) > this.eval(index2)) {
            return index1;
        }
        else {
            return index2;
        }
    }
    betterThan(index1, index2) {
        //Je¿eli mo¿e wybiera drógi
        if (this.eval(index1) > this.eval(index2)) {
            return true;
        }
        else {
            return false;
        }
    }
    canProceed(index) {
        let l = this.totalLen + this.data.pairLengths[this.last_element][index] - this.data.words[index].length;
        return l <= this.data.sequenceLength;
    }
    getRate(rate, index) {
        return Math.min(1, rate * ( 1 + this.count(index) ) );
    }
}

module.exports = OccurencesEvaluator;