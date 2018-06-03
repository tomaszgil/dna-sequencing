class IteratedSequence {
    constructor(sequence) {
    	this.sequence = sequence;
    	this.i = 0;
    }
	move() {
		this.i++;
	}
	canMove() {
		if (this.i >= this.sequence.length) {
			return false;
		}
		return true;
	}
	current() {
	    while (this.sequence[this.i] == undefined) {
	        //console.log("i=", this.i, " len=", this.sequence.length);
	        this.i++;
	    }
		return this.sequence[this.i];
	}
	swapWith(otherSequence) {
		let tmps = this.sequence;
		let tmpi = this.i;
		this.sequence = otherSequence.sequence;
		this.i = otherSequence.i;
		otherSequence.sequence = tmps;
		otherSequence.i = tmpi;
	}
	dropToWith(child, evaluator) {
	    while (this.canMove() && evaluator.canProceed(this.current())) {
	        child.genes.push(this.current());
	        evaluator.add(this.current());
		}
	}
}

module.exports = IteratedSequence;