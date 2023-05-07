const fs = require('fs');
const path = require('path');
const {stdin, stdout} = process;

const GREETING_MESSAGE = 'Hello! Enter some text into the console to write it to text.txt\n';
const FAREWELL_MESSAGE = 'Your data is saved to a file text.txt. Bye!\n';
const EXIT_CODE = 'exit';

const writeStream = fs.createWriteStream(path.join(__dirname, 'text.txt'));

stdout.write(GREETING_MESSAGE);


stdin.on('data', (data) => {
  const text = data.toString();

  if (text.trim() === EXIT_CODE) {
    process.exit();
  } else {
    writeStream.write(text);
  }
});

process.on('SIGINT', () => {
  process.exit();
});

process.on('exit', () => {
  stdout.write(FAREWELL_MESSAGE);
});
