export class Test {
  property:string;
  constructor() {
    this.property = "hello world";
  }
  getProperty = () => {
    console.log(this.property);
  }
  equals = (actual:any, expected:any, msg = '') => {
    if (actual == expected) {
      console.log(msg || "ok");
    } else {
      console.log(`expected actual to equal ${expected} but got ${actual}`);
    }
  }
};
