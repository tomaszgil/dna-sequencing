const fs = require('fs');
const WordPair = require('./WordPair');

const getFileName = (path) => {
  const splitted = path.split("/");
  return splitted[splitted.length - 1];
};

class Data {
  constructor(path) {
    this.fileName = getFileName(path);
    this.words = Data.getWords(path);
    this.pairLengths = this.getPairLengths();

    const instanceAttr = Data.getInstanceAttr(this.fileName, this.words[0]);
    this.sequenceLength = instanceAttr.n;
    this.wordLength = instanceAttr.l;
    this.faultNum = instanceAttr.faultNum;
    this.optimum = instanceAttr.optimum;
  }

  static getWords(path) {
    return fs.readFileSync(path, 'utf-8')
      .split('\n')
      .filter(Boolean)
      .map(word => word.trim());
  };

  static getInstanceAttr(fileName, exampleWord) {
    const info = fileName.split(/[-\.\+]/);
    const faultType = fileName.includes('+') ? 1 : -1;
    const l = exampleWord.length;
    const n = parseInt(info[1]) + l - 1;
    const faultNum = parseInt(info[2]) * faultType;

    let optimum = parseInt(info[1]);
    if (faultType === -1) {
      optimum += faultNum;
    }

    return { n, l, faultNum, optimum }
  };

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

  getPairLengths() {
    let matrix = [];

    for (let i = 0; i < this.words.length; i++) {
      let row = [];
      for (let j = 0; j < this.words.length; j++) {
        row.push(Data.calculateSequenceLength(this.words[i], this.words[j]));
      }
      matrix.push(row);
    }

    return matrix;
  }
}

module.exports = Data;