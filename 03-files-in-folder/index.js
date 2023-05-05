const fs = require('fs');
const path = require('path');
const {stdout} = process;

const FOLDER_NAME = 'secret-folder';

fs.readdir(path.join(__dirname, FOLDER_NAME), { withFileTypes: true }, (err, files) => {
  files.forEach((file) => {
    if (file.isDirectory()) {
      return;
    }

    const [fileName, fileExt] = file.name.split('.');
    let info = `${fileName} - ${fileExt} - `;

    fs.stat(path.join(__dirname, FOLDER_NAME, file.name), (err, stats) => {
      info += `${stats.size}b`;
      stdout.write(info + '\n');
    });
  });
});
