const Data = require('./utils/Data');
const GeneticSolver = require('./genetic/GeneticSolver');

const data = new Data('data/9.200-40.txt');
const gs = new GeneticSolver({
  populationSize: 300,
  maxGeneration: 200,
  mutationRate: 0.003,
  fitnessGrowth: 1,
    burningTime: .9
});

gs.solve(data);