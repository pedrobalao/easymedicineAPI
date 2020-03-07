const { ContainerBuilder } = require('node-dependency-injection');
const repositoriesDILoad = require('./repositories');
const controllersDILoad = require('./controllers');

module.exports = () => {
    let diContainer = new ContainerBuilder();

    diContainer = repositoriesDILoad(diContainer);
    diContainer = controllersDILoad(diContainer);

    return diContainer;
}
