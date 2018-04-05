const randomChoice = (arr, prob) => {
  if (arr.length !== prob.length) {
    console.error("Random choice: array and probability lengths should match");
    return;
  }

  let index = 0;
  let r = Math.random();

  while (r > 0 && index < arr.length) {
    r -= prob[index];
    index++;
  }
  index--;

  return arr[index];
};

module.exports = randomChoice;