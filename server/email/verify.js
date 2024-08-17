const https = require("https");

function verifyEmail(email) {
    return new Promise((resolve, reject) => {
        const user_json_url = "URL_OF_YOUR_JSON_FILE";

        https
            .get(user_json_url, (res) => {
                let data = "";

                res.on("data", (chunk) => {
                    data += chunk;
                });

                res.on("end", () => {
                    try {
                        const jsonData = JSON.parse(data);
                        const user_email_id = jsonData.user_email_id;

                        if (user_email_id === email) {
                            resolve(true);
                        } else {
                            resolve(false);
                        }
                    } catch (error) {
                        reject(error);
                    }
                });
            })
            .on("error", (err) => {
                reject(err);
            });
    });
}

module.exports = { verifyEmail };
