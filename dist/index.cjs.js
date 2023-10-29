if (process.env.NODE_ENV === 'production') {
    module.exports = require('./hooks.cjs.production.js');
} else {
    module.exports = require('./hooks.cjs.development.js');
}
