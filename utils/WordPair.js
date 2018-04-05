class Pair {
  constructor(value1, value2) {
    this.elements = [value1, value2];
  }

  equals(value1, value2) {
    return this.elements[0] === value1 && this.elements[1] === value2;
  }

  getElements() {
    return this.elements;
  }

  getFirstElement() {
    return this.elements[0];
  }

  getSecondElement() {
    return this.elements[1];
  }
}

class WordPair extends Pair {
  constructor(index1, index2, word1, word2) {
    super(index1, index2);
    this.sequenceLength = WordPair.calculateSequenceLength(word1, word2);
  }

  static calculateSequenceLength(word1, word2) {
    let firstCompare, secondCompare;
    for (let i = 1; i < word1.length; i++) {
      firstCompare = word1.slice(i);
      secondCompare = word2.slice(0, i * -1);

      if (firstCompare === secondCompare)
        return word1.length + i;
    }

    return word1.length + word2.length;
  }
}

module.exports = WordPair;