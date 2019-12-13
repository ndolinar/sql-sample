const mysql = require('mysql');
const connectionProps = require('./config').database;

/**
 * SQL Syntax
 *
 * =====================
 * *** SELECT ***
 * =====================
 * SELECT: <column names> - columns that you wish to retrieve
 * -----------------------------------------------------------
 * SELECT column_name, column_price...
 * SELECT * ... - selects all columns
 *
 *
 * =====================
 * *** FROM ***
 * =====================
 * FROM: <table> - table in the DB you wish to retrieve data from
 * -----------------------------------------------------------
 * ... FROM table_name ...
 *
 *
 * =====================
 * *** INNER JOIN ***
 * =====================
 * INNER JOIN / ON - join two tables based on the join condition
 * -----------------------------------------------------------
 * ... FROM table_name INNER JOIN table_id ON join_condition
 *
 *
 * =====================
 * *** WHERE ***
 * =====================
 * WHERE: a condition to be met
 * -----------------------------------------------------------
 * ... WHERE column_id = 2 ...
 * ... WHERE column_name IN ('Jane', 'John') ...
 *
 *
 * =====================
 * *** AND ***
 * =====================
 * AND: adding more conditions
 * -----------------------------------------------------------
 * ... AND id = 5
 *
 *
 * =====================
 * *** ORDER_BY ***
 * =====================
 * ORDER BY: sorting: <column> [ASC|DESC]
 * -----------------------------------------------------------
 * ... ORDER BY name_column ASC
 *
 */

//
// -----------------------------------------------------------
//
// Our goal: to retrieve rows from the database, but only values from the following columns: key, id, languageCode, name
//
// Issue: data is not all in one table. We will have to select two tables, join them based on some property that they share, and retrieve data
// Sample response: { key: 'Bonus points', id: 1929, languageCode: 'no', name: 'Bonuspoeng' };

// Variables

// Tables we're interested in
const ID_TABLE = 'name_id';
const NAME_TABLE = 'name';

// Variables to reference the tables in our sql query; can be anything
const idTable = 'name_table_id_alias';
const nameTable = 'random_string_here';

// Values for the 'IN' condition
// To tell MYSQL which rows are we interested in -> we will want rows where the 'key' column equals one of the specified values
// Syntax: ...IN ('Value 1', 'Value 2')
const needles = ['Bonus points', '1st game'];
const inCondition = `('${needles.join("','")}')`;

// Step 2: const needlesJoined = needles.join("','"); // --> Bonus points', ', 1st Game
// Step 3: const inCondition = `('${needlesJoined}')`; // --> ('Bonus points', '1st game')

// MYSQL command
const MY_SQL_QUERY = `
  SELECT
    ${idTable}.key, ${idTable}.id, ${nameTable}.languageCode, ${nameTable}.name
  FROM
    ${ID_TABLE} ${idTable}
  INNER JOIN
    ${NAME_TABLE} ${nameTable}
  ON
    ${idTable}.id = ${nameTable}.id
  WHERE
    ${idTable}.key
  IN
    ${inCondition}
  AND
    ${nameTable}.typeid = 8
  ORDER BY
    ${idTable}.key, ${nameTable}.languageCode;
  `;

function connect() {
  const connection = mysql.createConnection(connectionProps);
  connection.connect();
  connection.query(MY_SQL_QUERY, (err, data) => {
    if (err) {
      console.log('Error: ', err);

      connection.destroy();
      throw err;
    }

    console.log('We got data!');
    console.log(data);

    connection.destroy();
  });
}

connect();
