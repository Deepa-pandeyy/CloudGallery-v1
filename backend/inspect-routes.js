const app = require('./src/app');
console.log(app._router && app._router.stack ? app._router.stack.map((x) => x.route && x.route.path).filter(Boolean) : []);
