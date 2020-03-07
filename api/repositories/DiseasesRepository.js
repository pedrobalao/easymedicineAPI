const db = global.require.use('Utils/Db')
const queries = global.require.use("Api/Repositories/Diseases_queries");

class DiseasesRepository {
    async get(successCallback, errCallback) {
        db.query(queries.list, (err, result, _fields) => {
            if (err) {
                global.logger.error(err);
                return errCallback(err);
            }
            return successCallback(result)
        });
    }

    async findById(id, successCallback, errCallback) {
        db.query(queries.findById, [id], (err, result, _fields) => {
            if (err) {
                global.logger.error(err);
                return errCallback(err)
            }
            return successCallback(result)
        });
    }

    async search(searchQuery, successCallback, errCallback) {
        db.query(queries.search, [searchQuery], (err, result, _fields) => {
            if (err) {
                global.logger.error(err);
                return errCallback(err);
            }
            return successCallback(result);
        });
    }
}

module.exports = DiseasesRepository;
