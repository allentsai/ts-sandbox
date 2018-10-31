import {readFileSync} from 'fs';
import * as path from 'path';

function min_by_key(key, array) {
    return first_by_key(key, "asc", array);
}

function first_by_key(key, order, array) {
    const comparator = new RecordComparator(key, order);
    let bestObject = array[0];
    
    //logic
    for(let i = 1; i < array.length; i++) {
        const testObject = array[i];
        if (comparator.compare(bestObject, testObject) == 1) {
            bestObject = testObject;
        }
    }
    
    return bestObject;
}

function assert_equal(actual, expected) {
    if (JSON.stringify(actual) != JSON.stringify(expected)) {
        console.log(`Assertion failed: ${JSON.stringify(actual)} does not match expected ${JSON.stringify(expected)}`)
        console.trace()
    }
}
  
function test_min_by_key() {
    let example1 = [{ a: 1, b: 2 }, { a: 2 }],
        example2 = [{ a: 2 }, { a: 1, b: 2 }],
        example3 = [{}],
        example4 = [{ a: -1 }, { b: -1 }]
    console.log("test_min_by_key started");
    assert_equal(min_by_key("a", example1), example1[0])
    assert_equal(min_by_key("a", example2), example2[1])
    assert_equal(min_by_key("b", example1), example1[1])
    assert_equal(min_by_key("a", example3), example3[0])
    assert_equal(min_by_key("b", example4), example4[1])
    console.log("test_min_by_key finished");
}

function test_first_by_key() {
    let example1 = [{ a: 1 }],
        example2 = [{ b: 1 }, { b: -2 }, { a: 10 }],
        example3 = [{}, { a: 10, b: -10 }, {}, { a: 3, c: 3 }]
    console.log("test_first_by_key started");
    assert_equal(first_by_key("a", "asc", example1), example1[0])
    // example2[1] is also okay!
    assert_equal(first_by_key("a", "asc", example2), example2[0])
    assert_equal(first_by_key("a", "desc", example2), example2[2])
    assert_equal(first_by_key("b", "asc", example2), example2[1])
    assert_equal(first_by_key("b", "desc", example2), example2[0])
    assert_equal(first_by_key("a", "desc", example3), example3[1])
    console.log("test_first_by_key finished");
}

class RecordComparator {
    key;
    order;
    constructor(key, order) {
        this.key = key;
        this.order = order;
    }

    compare(first, second) {
        const firstValue = first[this.key] == undefined ? 0 : first[this.key];
        const secondValue = second[this.key] == undefined ? 0 : second[this.key];
        if (firstValue == secondValue) {
            return 0;
        } else if (firstValue < secondValue) {
            if (this.order == "asc") {
                return -1;
            }
            return 1;
        }
        //secondValue > firstValue
        if (this.order == "asc") {
            return 1;
        }

        return -1;
    }
}

function first_by_sort_order(orderArray, objects) {
    const comparators = [];
    for (let i = 0; i < orderArray.length; i++) {
        const order = orderArray[i];
        comparators.push(new RecordComparator(order[0], order[1]));
    }

    let bestObject = objects[0];
    for (let i = 1; i< objects.length; i++) {
        let comparatorIndex = 0;
        const testObject = objects[i];
        let value = comparators[comparatorIndex].compare(bestObject, testObject);
        while ( value == 0 && comparatorIndex < comparators.length) {
            comparatorIndex += 1;
            value = comparators[comparatorIndex].compare(bestObject, testObject);
        }
        if (value == 1) {
            bestObject = testObject;
        }
    }

    return bestObject;
}

// This method should return -1 if the first record comes before the second record (according to key and direction),
// zero if neither record comes before the other, or 1 if the first record comes after the second.
function test_record_comparator() {
    let cmp = new RecordComparator("a", "asc")
    console.log("test_record_comparator started");
    assert_equal(cmp.compare({ a: 1 }, { a: 2 }), -1)
    assert_equal(cmp.compare({ a: 2 }, { a: 1 }), 1)
    assert_equal(cmp.compare({ a: 1 }, { a: 1 }), 0)
    console.log("test_record_comparator finished");
}

function test_first_by_sort_order() {
    console.log("test_first_by_sort_order started");
    assert_equal(
      first_by_sort_order(
        [["a", "desc"]],
        [{ "a": 5 }, { "a": 6 }]
      ),
      { "a": 6 }
    )
  
    assert_equal(
      first_by_sort_order(
        [["b", "asc"], ["a", "desc"]],
        [{ "a": -5, "b": 10 }, { "a": -4, "b": 10 }]
      ),
      { "a": -4, "b": 10 }
    )
  
    assert_equal(
      first_by_sort_order(
        [["a", "asc"], ["b", "asc"]],
        [{ "a": -5, "b": 10 }, { "a": -4, "b": 10 }]
      ),
      { "a": -5, "b": 10 }
    )
    console.log("test_first_by_sort_order finished");
  }
test_first_by_sort_order();
test_record_comparator();
test_first_by_key();
test_min_by_key();


