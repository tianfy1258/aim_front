const softmax = (data) => {
  data = data.map(x => Math.exp(x));
  let sum = data.reduce((x, y) => x + y);
  data = data.map(x => {
    return x / sum;
  });
  return data;
};
export {softmax}
