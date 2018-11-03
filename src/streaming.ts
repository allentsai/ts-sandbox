import {Test} from './test';
import * as path from 'path';
import * as rp from 'request-promise';
const test = new Test();
test.getProperty();
test.equals(1,1, "one still equals one!");
test.equals(1,2);

async function main() {
  const resp = await rp.get("http://www.google.com");
  console.log(resp);
}

main();
