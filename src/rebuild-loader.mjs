let runs = 0;

export default function (source) {
  this.cacheable(false);
  runs += 1;
  return runs === 2 ? source.replace('blue', 'red') : source.replace('blue', 'green');
}
