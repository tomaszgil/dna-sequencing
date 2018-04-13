class Member {
  constructor(data) {
    this.data = data;
    this.genes = [];
    this.sequence = '';
    this.fitness = 0;
  }

  toString() {
    return `${this.genes}: ${this.sequence}`;
  }

  initialize() {
    const genes = [];
    let index2;
    let index1 = Math.floor(Math.random() * this.data.words.length);
    genes.push(index1);
    let sequenceLength = this.data.words[index1].length;

    while (sequenceLength < this.data.sequenceLength) {
      index2 = Math.floor(Math.random() * this.data.words.length);
      let pairLength = this.data.pairLengths[index1][index2];

      if (sequenceLength + pairLength - this.data.words[index1].length <= this.data.sequenceLength) {
        sequenceLength += (pairLength - this.data.words[index1].length);
        genes.push(index2);
        index1 = index2;
      } else break;
    }

    this.genes = genes;
    this.buildSequence();
  }

  buildSequence() {
    let sequence = this.data.words[this.genes[0]];

    for (let i = 1; i < this.genes.length; i++) {
      let pairLength = this.data.pairLengths[this.genes[i - 1]][this.genes[i]];
      let word = this.data.words[this.genes[i]];
      sequence += word.substring(word.length - (pairLength - word.length));
    }

    this.sequence = sequence;
  }

  calculateFitness(exp) {
    // Taking into account just the density of words within the sequence
    this.fitness = Math.pow(new Set(this.genes).size, exp);
  }

  crossover(partner) {
    let index1;
    let index2;
    let i = 0;
    let sequenceLength = 0;
    let midPoint = Math.floor(Math.random() * this.genes.length);
    let child = new Member(this.data);

    // First part comes from one parent
    while (i < midPoint) {
      index2 = this.genes[i];

      if (typeof index1 !== 'undefined') {
        let pairLength = this.data.pairLengths[index1][index2];
        sequenceLength += (pairLength - this.data.words[index1].length);
      } else {
        sequenceLength += this.data.words[index2].length;
      }

      child.genes.push(index2);
      index1 = index2;
      i++;
    }

    // Second part comes from second parent
    while (sequenceLength < this.data.sequenceLength && i < partner.genes.length) {
      index2 = partner.genes[i];

      if (typeof index1 !== 'undefined') {
        let pairLength = this.data.pairLengths[index1][index2];
        if (sequenceLength + pairLength - this.data.words[index1].length <= this.data.sequenceLength) {
          sequenceLength += (pairLength - this.data.words[index1].length);
          child.genes.push(index2);
          index1 = index2;
          i++;
        } else break;
      } else {
        if (sequenceLength + this.data.words[index2].length <= this.data.sequenceLength) {
          sequenceLength += this.data.words[index2].length;
          child.genes.push(index2);
          index1 = index2;
          i++;
        } else break;
      }
    }

    // Fill rest of sequence randomly
    while (sequenceLength < this.data.sequenceLength) {
      index2 = Math.floor(Math.random() * this.data.words.length);
      let pairLength = this.data.pairLengths[index1][index2];

      if (sequenceLength + pairLength - this.data.words[index1].length <= this.data.sequenceLength) {
        sequenceLength += (pairLength - this.data.words[index1].length);
        child.genes.push(index2);
        index1 = index2;
      } else break;
    }

    child.buildSequence();
    return child;
  }

  mutate(rate) {
    for (let i = 0; i < this.genes.length; i++) {
      if (Math.random() < rate) {
        this.genes[i] = Math.floor(Math.random() * this.data.words.length);
      }
    }

    this.buildSequence();
  }
}

module.exports = Member;