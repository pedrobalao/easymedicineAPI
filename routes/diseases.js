module.exports = (router) => {
    const diseasesController = global.diContainer.get('controller.disease');

    router.get('/', diseasesController.list);
    router.get('/search', diseasesController.search);
    router.get('/:id', diseasesController.getById);

    return router
};
