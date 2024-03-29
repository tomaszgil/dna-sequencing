const OccurencesEvaluator = require('./OccurencesEvaluator');
const IteratedSequence = require('./IteratedSequence');

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
      let row = this.data.pairLengths[index1];
      index2 = row.indexOf(Math.min(...row));
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



    crossover2(partner) {
        function swap(o1, o2) {
            let tmp = o1.genes;
            o1.genes = o2.genes;
            o2.genes = tmp;
            tmp = o1.i;
            o1.i = o2.i;
            o2.i = tmp;
        }
        //sequenceLength jest sprawdzana w OccurencesEvaluator
        let child = new Member(this.data);
        //let i = 0;
        //let midPoint = Math.floor(Math.random() * this.genes.length);
        child.genes.push(this.genes[0]);
        let prefered = new IteratedSequence(partner.genes);
        prefered.shuffle();
        let worse = new IteratedSequence(this.genes);
        worse.move();
        
        let evaluator = new OccurencesEvaluator(this.genes[0], this.data);
        while (worse.canMove() && prefered.canMove()) {
            if (!evaluator.betterThan(prefered.current(), worse.current())) {
                if (evaluator.count(worse.current()) > 0) {
                    worse.move();
                    if (!worse.canMove()) {
                        prefered.dropToWith(child, evaluator);
                        break;
                    }
                }
                let didntMove = false;

                if (evaluator.canProceed(prefered.current())) {
                    child.genes.push(prefered.current());
                    evaluator.add(prefered.current());
                    prefered.move();
                }
                else {
                    didntMove = true;
                }

                if (!prefered.canMove() || didntMove) {
                    worse.dropToWith(child, evaluator);
                    break;
                }

                prefered.swapWith(worse);
            }
            else {
                if (evaluator.count(prefered.current()) > 0) {
                    prefered.move();
                    if (!prefered.canMove()) {
                        worse.dropToWith(child, evaluator);
                        break;
                    }
                }
                let didntMove = false;

                if (evaluator.canProceed(worse.current())) {
                    child.genes.push(worse.current());
                    evaluator.add(worse.current());
                    worse.move();
                }
                else {
                    didntMove = true;
                }

                if (!worse.canMove() || didntMove) {
                    prefered.dropToWith(child, evaluator);
                    break;
                }
                worse.swapWith(prefered);
            }
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

    mutate2(rate) {
        if (Math.random() < rate) {
            this.genes[0] = Math.floor(Math.random() * this.data.words.length);
        }
        let evaluator = new OccurencesEvaluator(this.genes[0], this.data);
        for (let i = 0; i < this.genes.length; i++) {
            if (Math.random() < evaluator.getRate(rate, this.genes[i]) ){
                this.genes[i] = Math.floor(Math.random() * this.data.words.length);
            }
        }

        this.buildSequence();
    }

    fixHoles() {
        //rem start
        /*
        let idx = this.genes[0];
        console.log(idx, this.data.words[idx]);
        for (let i = 0; i < this.data.choiceStructure[idx].length; i++) {
            console.log("Depth = ", i);
            if (this.data.choiceStructure[idx][i] != undefined) {
                for (let j = 0; j < this.data.choiceStructure[idx][i].length; j++) {
                    let idx2 = this.data.choiceStructure[idx][i][j];
                    console.log(j, idx2, this.data.words[idx2]);
                }
            }
        }
        exit();
        */
        //rem end
        for (let i = 0; i < this.genes.length - 2; i++) {
            let g0 = this.genes[i];
            let g1 = this.genes[i + 1];
            let g2 = this.genes[i + 2];
            let l0 = this.data.words[g0].length;
            let l1 = this.data.words[g1].length;
            let l2 = this.data.words[g2].length;
            let M = this.data.pairLengths;
            let diff = l0 + l1 - M[g0][g1] + l1 + l2 - M[g1][g2];
            if (diff > this.data.maxDiff) {
                let newOverlay = Math.min(l0 - 1, l0 - diff + 1);
                let arr = this.data.choiceStructure[g0][newOverlay];
                if (arr == undefined) {
                    let cslen = this.data.choiceStructure[g0].length;
                    for (let j = 0; j < newOverlay; j++) {
                        if (this.data.choiceStructure[g0][j] != undefined) {
                            arr = this.data.choiceStructure[g0][j];
                            break;
                        }
                    }
                }
                if (arr != undefined) {
                    let tmp = arr[Math.floor(Math.random() * arr.length)];
                    if (tmp != undefined) this.genes[i] = tmp;
                }
            }
        }
    }
}

module.exports = Member;