// run promises in sequence one after another
const runSerial = (tasks) => {
  let result = Promise.resolve();
  tasks.forEach((task) => {
    result = result.then(task);
  });
  return result;
};

// run promises in sequence one after another
// then check if it's necessery to proceed if there is any checking function
// otherwise proceed anyway
const runSerialLoop = (tasks, needProceedFunc) => {
  return new Promise((resolve) => {
    runSerial(tasks).then(() => {
      if (typeof needProceedFunc !== 'function' || needProceedFunc()) {
        runSerialLoop(tasks, needProceedFunc);
        return;
      }
      resolve();
    });
  });
};

export {runSerial, runSerialLoop};
