export function scale(input, rmax=1, rmin=0) {
  let input_min = Math.min(...input);
  let input_max = Math.max(...input);
  let input_std = input.map(x => (x - input_min) / (input_max - input_min));
  return input_std.map(x => x * (rmax - rmin) + rmin);
}
