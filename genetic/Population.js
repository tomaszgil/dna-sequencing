const Member = require('./Member');
const randomChoice = require('../utils/randomChoice');

class Population {
  constructor(size, data) {
    this.size = size;
    this.data = data;
    this.generation = 0;
    this.members = this.createMembers();
    this.lastWinner = null;
    this.bestScore = 0;
  }

  createMembers() {
    const members = [];
    let member;

    for (let i = 0; i < this.size; i++) {
      member = new Member(this.data);
      member.initialize();
      members.push(member);
    }

    return members;
  }

  calculateFitness(fitnessGrowth) {
      this.members.forEach(member => member.calculateFitness(fitnessGrowth));
  }

  naturalSelection() {
    const sum = this.members.reduce((result, member) => result + member.fitness, 0);
    this.probabilities = this.members.map(m => m.fitness / sum);
  }

  evolve(mutationRate, burningTime, maxGeneration) {
    let newMembers = [];

    for (let i = 0; i < this.members.length; i++) {
      let parent1 = randomChoice(this.members, this.probabilities);
      let parent2 = randomChoice(this.members, this.probabilities);
      let child;
      if (this.generation < maxGeneration * burningTime) {
          child = parent1.crossover(parent2);
          child.mutate2(mutationRate);
      } else {
          child = parent1.crossover2(parent2);
          child.mutate2(mutationRate);
          child.fixHoles();
      }

      newMembers.push(child);
    }

    if (this.lastWinner !== null) {
        newMembers[0] = this.lastWinner;
    }

    this.members = newMembers;
    this.generation++;
  }

  evaluate() {
    const bestFitness = Math.max(...this.members.map(m => m.fitness));
    const bestMember = this.members.find(m => m.fitness === bestFitness);
    this.lastWinner = bestMember;
    const numElements = new Set(bestMember.genes).size;
    // console.log(`Generation ${this.generation}:`);
    // console.log(`Best score ${numElements}: ${bestMember.sequence}`);

    if (numElements > this.bestScore) {
      this.bestScore = numElements;
    }
  }
}

module.exports = Population;