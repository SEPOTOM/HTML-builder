const fs = require('fs');
const path = require('path');

const REG_EXP = /{{|}}/;
const LOWER_THAN = '<';
const HTML_EXT = '.html';
const CSS_EXT = 'css';

const OUTPUT_FOLDER = 'project-dist';
const OUTPUT_HTML_FILE = 'index.html';
const OUTPUT_CSS_FILE = 'style.css';
const OUTPUT_ASSETS_FOLDER = 'assets';

const INPUT_HTML_FILE = 'template.html';
const INPUT_COMPONENTS_FOLDER = 'components';
const INPUT_ASSETS_FOLDER = 'assets';
const INPUT_STYLES_FOLDER = 'styles';

makeProject();

function makeProject() {
  createFolder();
  createHtmlBundle();
  copyAssets(path.join(__dirname, INPUT_ASSETS_FOLDER), path.join(__dirname, OUTPUT_FOLDER, OUTPUT_ASSETS_FOLDER));
  createCssBundle();
}

function createFolder() {
  fs.mkdir(path.join(__dirname, OUTPUT_FOLDER), { recursive: true }, (err) => {
    if (err) return console.error(err.message);
  });
}
function createHtmlBundle() {
  fs.readFile(path.join(__dirname, INPUT_HTML_FILE), 'utf-8', (err, data) => {
    if (err) return console.error(err.message);

    let counter;

    const dataArray = data.split(REG_EXP);
    dataArray.forEach((dataPart, index) => {
      if (!dataPart.includes(LOWER_THAN) && dataPart.trim()) {
        counter = counter ? counter + 1 : 1;

        const fileName = `${dataPart}${HTML_EXT}`;

        fs.readFile(path.join(__dirname, INPUT_COMPONENTS_FOLDER, fileName), 'utf-8', (err, data) => {
          if (err) return console.error(err.message);

          dataArray[index] = data;

          counter--;

          if (counter === 0) {
            const htmlString = dataArray.join('');

            fs.writeFile(path.join(__dirname, OUTPUT_FOLDER, OUTPUT_HTML_FILE), htmlString, (err) => {
              if (err) return console.error(err.message);
            });
          }
        });
      }
    });
  });
}
function copyAssets(inputFolder, outputFolder) {
  let sourceFiles = [];

  fs.mkdir(outputFolder, { recursive: true }, (err) => {
    if (err) return console.error(err.message);
  });

  fs.readdir(inputFolder, { withFileTypes: true, recursive: true }, (err, files) => {
    if (err) return console.error(err.message);

    sourceFiles = files;

    files.forEach((file) => {
      if (file.isDirectory()) {
        copyAssets(path.join(inputFolder, file.name), path.join(outputFolder, file.name));
      } else {
        fs.readFile(path.join(inputFolder, file.name), 'utf-8', (err, data) => {
          if (err) return console.error(err.message);

          fs.writeFile(path.join(outputFolder, file.name), data, (err) => {
            if (err) return console.error(err.message);
          });
        });
      }
    });
  });

  fs.readdir(outputFolder, { withFileTypes: true }, (err, files) => {
    if (err) return console.error(err.message);

    files.forEach((file) => {
      if (!sourceFiles.includes(file) && !file.isDirectory()) {
        fs.unlink(path.join(outputFolder, file.name), (err) => {
          if (err) return console.error(err.message);
        });
      }
    });
  });
}
function createCssBundle() {
  const filesContent = [];

  let styleFilesInFilesFolder = 0;

  fs.mkdir(path.join(__dirname, OUTPUT_FOLDER), { recursive: true }, (err) => {
    if (err) return console.error(err.message);
  });

  fs.readdir(path.join(__dirname, INPUT_STYLES_FOLDER), (err, files) => {
    if (err) return console.error(err.message);

    files.forEach((file) => {
      const fileArray = file.split('.');
      const fileExt = fileArray[fileArray.length - 1];

      if (fileExt === CSS_EXT) {
        styleFilesInFilesFolder++;

        fs.readFile(path.join(__dirname, INPUT_STYLES_FOLDER, file), 'utf-8', (err, data) => {
          if (err) return console.error(err.message);

          filesContent.push(data);

          if (styleFilesInFilesFolder === filesContent.length) {
            const bundleContent = filesContent.join('\n');

            fs.writeFile(path.join(__dirname, OUTPUT_FOLDER, OUTPUT_CSS_FILE), bundleContent, (err) => {
              if (err) return console.error(err.message);
            });
          }
        });
      }
    });
  });
}
