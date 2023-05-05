const fs = require('fs');
const path = require('path');

const FOLDER_NAME = 'files';
const CLONE_FOLDER_NAME = 'files-copy';

function copyDir() {
  let sourceFiles = [];

  fs.mkdir(path.join(__dirname, CLONE_FOLDER_NAME), { recursive: true }, (err) => {
    if (err) throw err;
  });

  fs.readdir(path.join(__dirname, FOLDER_NAME), (err, files) => {
    sourceFiles = files;

    files.forEach((file) => {
      fs.readFile(path.join(__dirname, FOLDER_NAME, file), 'utf-8', (err, data) => {
        fs.writeFile(path.join(__dirname, CLONE_FOLDER_NAME, file), data, (err) => {
          if (err) throw err;
        });
      });
    });
  });

  fs.readdir(path.join(__dirname, CLONE_FOLDER_NAME), (err, files) => {
    files.forEach((file) => {
      if (!sourceFiles.includes(file)) {
        fs.unlink(path.join(__dirname, CLONE_FOLDER_NAME, file), (err) => {
          if (err) throw err;
        });
      }
    });
  });
}

copyDir();
