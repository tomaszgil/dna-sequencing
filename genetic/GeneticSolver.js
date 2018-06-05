const Population = require('./Population');

class GeneticSolver {
  constructor(params) {
    this.populationSize = params.populationSize;
    this.maxGeneration = params.maxGeneration;
    this.mutationRate = params.mutationRate;
      this.fitnessGrowth = params.fitnessGrowth;
      this.burningTime = params.burningTime;
    this.data = {};
  }

  solve(data) {
    this.data = data;
    this.initialize();

    while (this.population.generation < this.maxGeneration) {
      this.draw();
    }
  }

  initialize() {
    this.population = new Population(
      this.populationSize, this.data
    );
  }

  draw() {
    this.population.calculateFitness(this.fitnessGrowth);

    this.population.evaluate();

    this.population.naturalSelection();
      this.population.evolve(this.mutationRate, this.burningTime, this.maxGeneration);//Wydaje mi si ¿e to powinno tu byæ
  }
}

module.exports = GeneticSolver;