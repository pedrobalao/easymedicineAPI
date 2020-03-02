const { ContainerBuilder } = require('node-dependency-injection');
module.exports = () => {
    let diContainer = new ContainerBuilder();
    diContainer.register('repository.disease', global.require.use('Api/Repositories/DiseasesRepository'));

    diContainer.register('controller.disease',
        global.require.use('Api/Controllers/DiseasesController'))
        .addArgument(diContainer.get('repository.disease'));

    return diContainer;
}
