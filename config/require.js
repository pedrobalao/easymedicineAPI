const appRoot = require('app-root-path');

class Require {
    constructor() {
        this.appRoot = appRoot;
    }

    use(path) {
        const pathFromAppRoot = path.toLowerCase();
        return require(`${appRoot}/${pathFromAppRoot}`);
    }
}

module.exports = new Require();
