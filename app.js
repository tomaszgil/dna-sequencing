const Data = require('./utils/Data');
const GeneticSolver = require('./genetic/GeneticSolver');

const data = new Data('data/9.200-40.txt');
const gs = new GeneticSolver({
    populationSize: 500,
    maxGeneration: 2000,
    mutationRate: 0.0001,
    fitnessGrowth: 3,
    burningTime: .7
});

gs.solve(data);