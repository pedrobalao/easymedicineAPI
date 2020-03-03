const controllers = [
    {
        id: 'controller.disease',
        class: global.require.use('Api/Controllers/DiseasesController'),
        argument: ['repository.disease']
    }
];

module.exports = (diContainer) => {
    controllers.forEach(controller => {
        const registeredService = diContainer.register(controller.id, controller.class);
        controller.argument.forEach(
            arg => registeredService.addArgument(diContainer.get(arg))
        )
    })

    return diContainer
}
