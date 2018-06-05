const Member = require('./Member');
const randomChoice = require('../utils/randomChoice');

class Population {
  constructor(size, data) {
    this.size = size;
    this.data = data;
    this.generation = 0;
    this.members = this.createMembers();
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
        if (maxGeneration * burningTime > this.generation) {
            child = parent1.crossover2(parent2);
            child.mutate2(mutationRate);
        }
        else {
            child = parent1.crossover2(parent2);
            //child.mutate2(mutationRate);
            child.fixHoles();
        }
        //console.log("MR: ",mutationRate == undefined);
        //exit();
      newMembers.push(child);
    }
    this.members = newMembers;
    this.generation++;
  }

  evaluate() {
    const bestFitness = Math.max(...this.members.map(m => m.fitness));
    const bestMember = this.members.find(m => m.fitness === bestFitness);
    console.log(`Generation ${this.generation}:`);
    console.log(`Best score ${bestMember.fitness}: ${bestMember.sequence}`);
  }
}

module.exports = Population;