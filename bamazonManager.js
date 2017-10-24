var inquirer = require("inquirer");
var mysql = require("mysql");
var Table = require('cli-table');

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  // Your username
  user: "root",
  // Your password
  password: "",
  database: "bamazon"
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  // createProduct();
  startShop();
});


function startShop() {
  inquirer
    .prompt({
      name: "action",
      type: "rawlist",
      message: "Finally, somebody that can manage this place!\n\n What's on the agenda?",
      choices: [
        "View current inventory",
        "Low inventory items",
        "Add to inventory",
        "Get up on outta here!"
      ]
    })
    .then(function (answer) {
      switch (answer.action) {
        case "View current inventory":
          showProducts();
          break;

        case "Low inventory items":
          lowInventory();
          break;

          case "Add to inventory":
          addInventory();
          break;
          
        case "Get up on outta here!":
          connection.end();
          break;
      }
    });
}

function showProducts() {
  console.log("\nShowing all products...\n");
  connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;
    //-------------------------------------------------------------------------------------------
    //Show me all the products in inventory, please:
    var table = new Table({
      head: ['Item ID', 'Product Name', 'Dept. Name', 'Price', 'Quanitity in Stock']
      , colWidths: [10, 20, 20, 20, 20]
    });
    // table is an Array, so you can `push`, `unshift`, `splice` and friends 
    for (var i = 0; i < res.length; i++) {
      table.push(
        [res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]
      );
    }
    console.log(table.toString());
    //-------------------------------------------------------------------------------------------
    // connection.end();
    startShop();
  });
}

function lowInventory() {
  console.log("\nLow inventory items listed below: \n\n")
  connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;
    //-------------------------------------------------------------------------------------------
    //Show me all the products in inventory, please:
    var table = new Table({
      head: ['Item ID', 'Product Name', 'Dept. Name', 'Price', 'Quanitity in Stock']
      , colWidths: [10, 20, 20, 20, 20]
    }); 
    for (var i = 0; i < res.length; i++) {
      if (res[i].stock_quantity < 5) {
        table.push(
          [res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]
        );
      }
    }
    console.log(table.toString());
    startShop();
  });
}


function addInventory() {
    //Here we'll purchase some quantity of some specific product:
    console.log("\nAdd inventory: \n");
    connection.query("SELECT * FROM products", function (err, results) {
  
      inquirer
        .prompt([
          {
            name: "idAdd",
            type: "input",
            message: "Product would you like to add (Item ID): ",
            validate: function (value) {
              if (isNaN(value) === false) {
                return true;
              }
              return false;
            }
          },
          {
            name: "quantAdd",
            type: "input",
            message: "Quantity to add: ",
            validate: function (value) {
              if (isNaN(value) === false) {
                return true;
              }
              return false;
            }
          }
        ])
        .then(function (answer) {
          //-------------------------------------------------------------------------------------------
          //HERE NEED TO ADD TO CURRENT INVENTORY
          var item = answer.idAdd;
          var amt = answer.quantAdd;
          var currInv = results[answer.idAdd - 1].stock_quantity;
          var newInventoryQuantity = parseInt(currInv) + parseInt(amt);

          console.log("Updating inventory...\n");
          console.log("Inventory updated.\n\n New total inventory: " + newInventoryQuantity + " units.\n\n");
  
            var query = connection.query("UPDATE products SET ? WHERE ?",
              [
                {
                  stock_quantity: newInventoryQuantity
                },
                {
                  item_id: item
                }
              ],
              function (err, res) {

              }
            );
          //-------------------------------------------------------------------------------------------
          startShop();
        });
  
    });
  };