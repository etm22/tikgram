function shuffleArray(array) {
  return array.slice().sort(() => Math.random() - 0.5);
}

module.exports = { shuffleArray };
