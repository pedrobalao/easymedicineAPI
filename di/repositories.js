const repositories = [
    {
        id: 'repository.disease',
        class: global.require.use('Api/Repositories/DiseasesRepository')
    }
];

module.exports = (diContainer) => {
    repositories.forEach(repos => diContainer.register(repos.id, repos.class))

    return diContainer
}
