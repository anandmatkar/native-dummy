const db_sql = {
    Q1: `SELECT * FROM users WHERE email = '{var1}' AND deleted_at IS NULL`,
    Q2: `INSERT INTO users(username, email, password,referral_id, transaction_id) VALUES('{var1}', '{var2}', '{var3}','{var4}', '{var5}') RETURNING *`,
    Q3: `SELECT * FROM users WHERE id = '{var1}' AND deleted_at IS NULL`
};

function dbScript(template, variables) {
    if (variables != null && Object.keys(variables).length > 0) {
        template = template.replace(
            new RegExp("{([^{]+)}", "g"),
            (_unused, varName) => {
                return variables[varName];
            }
        );
    }
    template = template.replace(/'null'/g, null);
    return template;
}

module.exports = { db_sql, dbScript };
