const crypto = require("./crypto.js");
const V = 0,
  M = 1e5,
  S = 5;
const P = [4294967296, 16777216, 65536, 256, 1];
const O = [0, 5, 10, 15, 20, 25];

const h = async (d, k, n) => {
  let c = Buffer.from(d);
  const b = Buffer.from(k);
  for (let i = 0; i < n; i++) c = crypto.hash(Buffer.concat([c, b]));
  return c;
};

const e = (s, o) =>
  ((s[o] * P[0] +
    s[o + 1] * P[1] +
    s[o + 2] * P[2] +
    s[o + 3] * P[3] +
    s[o + 4]) %
    M) +
  "";

const g = async (i, k, n) => {
  const r = await h(
    Buffer.concat([
      Buffer.from(new Uint16Array([V]).buffer),
      Buffer.from(k),
      Buffer.from(i),
    ]),
    Buffer.from(k),
    n
  );
  return O.map((o) => e(r, o).padStart(S, "0")).join("");
};

class FingerprintGenerator {
  constructor(iterations) {
    this.iterations = iterations;
  }
  createFor(l, lk, r, rk) {
    if (
      typeof l !== "string" ||
      typeof r !== "string" ||
      !(lk instanceof ArrayBuffer) ||
      !(rk instanceof ArrayBuffer)
    )
      throw new Error("Invalid arguments");
    return Promise.all([
      g(l, lk, this.iterations),
      g(r, rk, this.iterations),
    ]).then((f) => f.sort().join(""));
  }
}

exports.FingerprintGenerator = FingerprintGenerator;
