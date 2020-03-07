const activeStatus = "active"

module.exports = {
    list: `select id, description 
        from diseases where status = '${activeStatus}' order by description`,
    findById: `select id, description, author, indication, followup, example, bibliography, observation, created_at, updated_at, treatment_description, status 
        from diseases
        where status = '${activeStatus}' and id = ?`,
    search: `SELECT id, description, indication 
        FROM diseases 
        WHERE status = '${activeStatus}' 
            and MATCH (description , indication) AGAINST (?  IN NATURAL LANGUAGE MODE) 
        LIMIT 50`
}
