var axios = require('axios');

function harperSaveMessage(message, username, room) {
    const dbUrl = process.env.HARPER_DB_URL;
    const dbPw = process.env.HARPER_DB_PW;
    if(!dbUrl || !dbPw) return null;

    var data = JSON.stringift({
        operation: 'insert', 
        schema: 'realtime_chat_app', 
        table: 'messages', 
        records: [
            {
                message, 
                username, 
                room,
            },
        ],
    });

    var config = {
        method: 'post',
        url: dbUrl,
        headers: {
            'Content-Type': 'application/json',
            Authorization: dbPw,
        },
        data: data,
    };

    return new Promise((resolve, reject) => {
        axios(config)
        .then(function (response) {
            resolve(JSON.stringify(response.data));
        })
        .catch(function (error) {
            reject(error);
        });
    });
}

module.exports = harperSaveMessage;
