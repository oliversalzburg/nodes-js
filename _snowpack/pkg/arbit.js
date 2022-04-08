function alea(s0, s1, c) {
  var f = function aleaStep() {
    var t = 2091639 * s0 + c * 23283064365386963e-26;
    s0 = s1;
    return s1 = t - (c = t | 0);
  };
  f.getState = function aleaGetState() {
    return [s0, s1, c];
  };
  f.nextFloat = aleaNextFloat;
  f.nextInt = aleaNextInt;
  return f;
}
function aleaNextFloat(opt_minOrMax, opt_max) {
  var value = this();
  var min, max;
  if (typeof opt_max == "number") {
    min = opt_minOrMax;
    max = opt_max;
  } else if (typeof opt_minOrMax == "number") {
    min = 0;
    max = opt_minOrMax;
  } else {
    return value;
  }
  return min + value * (max - min);
}
function aleaNextInt(minOrMax, opt_max) {
  return Math.floor(this.nextFloat(minOrMax, opt_max));
}
function aleaFromSeed(seed) {
  var s0, s1, h, n = 4022871197, v;
  seed = "X" + (seed || +new Date());
  for (var i = 0; i < 2; i++) {
    for (var j = 0; j < seed.length; j++) {
      n += seed.charCodeAt(j);
      h = 0.02519603282416938 * n;
      n = h >>> 0;
      h -= n;
      h *= n;
      n = h >>> 0;
      h -= n;
      n += h * 4294967296;
    }
    v = (n >>> 0) * 23283064365386963e-26;
    if (i === 0)
      s0 = v;
    else
      s1 = v;
  }
  return alea(s0, s1, 1);
}
aleaFromSeed.fromState = function aleaFromState(state) {
  return alea.apply(null, state);
};
var arbit = aleaFromSeed;
export default arbit;
