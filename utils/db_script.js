const db_sql = {
    Q1: `SELECT * FROM users WHERE email = '{var1}' AND deleted_at IS NULL`,
    Q2: `INSERT INTO users(username, email, password,referral_id, transaction_id, otp) VALUES('{var1}', '{var2}', '{var3}','{var4}', '{var5}', '{var6}') RETURNING *`,
    Q3: `SELECT * FROM users WHERE id = '{var1}' AND deleted_at IS NULL`,
    Q4: `UPDATE users SET is_verified = true WHERE email = '{var1}' AND deleted_at IS NULL RETURNING *`
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
