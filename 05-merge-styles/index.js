const fs = require('fs');
const path = require('path');

const STYLES_FOLDER = 'styles';
const OUTPUT = 'project-dist/bundle.css';
const EXT = 'css';

const filesContent = [];

let styleFilesInFilesFolder = 0;

fs.readdir(path.join(__dirname, STYLES_FOLDER), (err, files) => {
  files.forEach((file) => {
    const fileArray = file.split('.');
    const fileExt = fileArray[fileArray.length - 1];

    if (fileExt === EXT) {
      styleFilesInFilesFolder++;

      fs.readFile(path.join(__dirname, STYLES_FOLDER, file), 'utf-8', (err, data) => {
        filesContent.push(data);

        if (styleFilesInFilesFolder === filesContent.length) {
          const bundleContent = filesContent.join('\n');

          fs.writeFile(path.join(__dirname, OUTPUT), bundleContent, (err) => {
            if (err) return console.error(err.message);
          });
        }
      });
    }
  });
});
