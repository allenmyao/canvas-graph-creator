class AlgorithmRunner {
  algorithm;

  constructor(algorithm) {
    this.algorithm = algorithm;
  }

  run() {
    let hasNextStep = true;
    while (hasNextStep) {
      hasNextStep = this.algorithm.step();
    }
  }

  getResult() {
    return this.algorithm.getResult();
  }
}

export { AlgorithmRunner };
export default AlgorithmRunner;
