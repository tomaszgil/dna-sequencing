class IteratedSequence {
    constructor(sequence) {
    	this.sequence = sequence;
    	this.i = 0;
    }
	move() {
		this.i++;
	}
	canMove() {
		if (i >= this.sequence.length) {
			return false;
		}
		return true;
	}
	current() {
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
		while( this.canMove() && evaluator.canProceed(this.get()) ){
			child.genes.push(this.get());
			evaluator.add(this.get());
		}
	}
}

module.exports = IteratedSequence;