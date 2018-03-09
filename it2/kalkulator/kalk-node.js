// @ts-check
const m = Math;
const π = m.PI;
const sin = m.sin;
const cos = m.cos;
const tan = m.tan;
const sqrt = m.sqrt;

const _number = (Object.getOwnPropertyNames(Number).map(e => 'Number.' + e)).concat(
    Object.getOwnPropertyNames(Math).map(e => 'Math.' + e)
);

function solvequad(a, b, c) {
    // exp assumed to be on the form "axx+bx+c"
    // solve roots if possible
    let d = b * b - 4 * a * c;
    if (d >= 0) {
        let sd = Math.sqrt(d);
        return { solvable: true, x1: (-b + sd) / (2 * a), x2: (-b - sd) / (2 * a) }
    }
    return { solvable: false }
}

function completer(line) {
  const _num = _number.filter( c => c.startsWith(line));
  if (_num.length) {
      return [_num,line];
  }
  const completions = 'solve integrate derive quit'.split(' ');
  const hits = completions.filter((c) => c.startsWith(line));
  // show all completions if none found
  return [hits.length ? hits : completions, line];
}


const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'Kalk: ',
  completer,
  removeHistoryDuplicates:true
});

rl.prompt();

let t;

rl.on('line', (line) => {
  let s = line.trim();
  let p = s.substr(0,5);
  switch (p) {
    case 'quit':
      process.exit(0);
      break;  
    default:
      try {
         t = eval(s);
         console.log(t);
      } catch(err) {
          console.log(s," gave error ", err.message);
      }
      break;
  }
  rl.prompt();
}).on('close', () => {
  console.log('Have a great day!');
  process.exit(0);
});
