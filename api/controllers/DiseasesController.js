class DiseasesController {
    constructor(diseasesRepository) {
        this._diseasesRepository = diseasesRepository
        this.list = this.list.bind(this);
        this.search = this.search.bind(this);
        this.getById = this.getById.bind(this);
    }

    async list(_req, res, _next) {
        this._diseasesRepository.get(
            (result) => res.status(200).json(result),
            (err) => res.status(500).send(err.message)
        );
    }

    async search(req, res, _next) {
        const searchstr = req.query.searchstr.toUpperCase();

        this._diseasesRepository.search(searchstr,
            (result) => res.status(200).json(result),
            (err) => res.status(500).send(err.message)
        );
    }

    async getById(req, res, _next) {
        const id = req.params.id;

        this._diseasesRepository.findById(
            id,
            (result) => res.status(200).json(result),
            (err) => res.status(500).send(err.message)
        );
    }
}

module.exports = DiseasesController;
