if (process.env.NODE_ENV === 'production') {
    module.exports = require('./hooks.esm.production.js');
} else {
    module.exports = require('./hooks.esm.development.js');
}
