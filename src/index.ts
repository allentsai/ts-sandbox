import {Test} from './test';
import {readFileSync} from 'fs';
import * as path from 'path';
const test = new Test();
test.getProperty();
test.equals(1,1, "one still equals one!");
test.equals(1,2);

const file = readFileSync(path.resolve(__dirname, '../package.json'));
console.log(JSON.parse(file.toString()));
