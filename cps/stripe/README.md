# Step 1
Throughout this interview, we'll pretend we're building a new analytical
database. Don't worry about actually building a database though – these will
all be toy problems.

Here's how the database works: all records are represented as maps, with string
keys and integer values. The records are contained in an array, in no
particular order.

To begin with, the database will support just one function: min_by_key. This
function scans the array of records and returns the record that has the minimum
value for a specified key. Records that do not contain the specified key are
considered to have value 0 for the key. Note that keys may map to negative values!

Here's an example use case: each of your records contains data about a school
student. You can use min_by_key to answer questions such as "who is the youngest
student?" and "who is the student with the lowest grade-point average?"

Implementation notes:
* You should handle an empty array of records in an idiomatic way in your
  language of choice.
* If several records share the same minimum value for the chosen key, you
  may return any of them.
