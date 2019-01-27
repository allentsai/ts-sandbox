import * as request from 'request';
import {Writable} from 'stream';

const url = 'https://enigmatic-plains-7414.herokuapp.com';

const writeable = new Writable();
writeable._write = (chunk, enc, next) => {
  console.log("write", chunk.toString());
  next();
};

interface Password {
  [index:number]: string;
}

class Decoder {
  url: string;
  password: Password;
  writeStream: Writable;
  constructor(url:string) {
    this.url = url
    this.password = {};
    this.writeStream = new Writable();
    this.initializeWrite();
  }

  initializeWrite() {
    this.writeStream._write = (chunk, enc, next) => {
      const string = chunk.toString();
      
      //could refactor out to parse method
      const parts = string.split('\n');
      const pwIndex = parts[0];
      const charIndexArray = JSON.parse(parts[1]);
      const x = charIndexArray[0];
      const y = charIndexArray[1];
      
      const charArray = [];
      // Order the array
      for(let i = parts.length - 1; i >= 2; i--) {
        if (parts[i] != '') {
          charArray.push(parts[i].split(''));
        }
      }
      //defined, we have the full password and can exit
      if (this.password[pwIndex]) {
        console.log(Object.keys(this.password).map((key:any) => (this.password[key])).join(''));
        this.writeStream.end();
        process.exit();
      }

      //else add to password
      this.password[pwIndex] = charArray[y][x];
      next();
    }
  }

  // come back and figure out how to return after writestream.  probably has to do with buffer.
  // We only console.log the answer atm.
  decode() {
    request.get(this.url).pipe(this.writeStream);
  }
}

const decoder = new Decoder(url);
decoder.decode();
