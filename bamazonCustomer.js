// first display all of the items available for sale. Include the ids, names, and prices of products for sale.

// 6. The app should then prompt users with two messages.

//    * The first should ask them the ID of the product they would like to buy.
//    * The second message should ask how many units of the product they would like to buy.

// 7. Once the customer has placed the order, your application should check if your store has enough of the product to meet the customer's request.

//    * If not, the app should log a phrase like `Insufficient quantity!`, and then prevent the order from going through.

// 8. However, if your store _does_ have enough of the product, you should fulfill the customer's order.
//    * This means updating the SQL database to reflect the remaining quantity.
//    * Once the update goes through, show the customer the total cost of their purchase.
//    * 
//    * 
//    * 


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
  
  connection.connect(function(err) {
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
        message: "What would you like to do?",
        choices: [
          "View current inventory",
          "Make a purchase",
          "TBD"
        ]
      })
      .then(function(answer) {
        switch (answer.action) {
          case "View current inventory":
            showProducts();
            break;
  
          case "Make a purchase":
            buyProducts();
            break;
  
          case "TBD":
            rangeSearch();
            break;
        }
      });
  }

function showProducts() {
    console.log("Showing all products...\n");
    connection.query("SELECT * FROM products", function (err, res) {
      if (err) throw err;
    //-------------------------------------------------------------------------------------------
      //Show me all the products in inventory, please:
      var table = new Table({
        head: ['Item ID', 'Product Name', 'Dept. Name', 'Price', 'Quanitity in Stock']
      , colWidths: [10, 20, 20, 20, 20]
      });
      // table is an Array, so you can `push`, `unshift`, `splice` and friends 
      for (var i =0; i < res.length; i++){
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



// 6. The app should then prompt users with two messages.

//    * The first should ask them the ID of the product they would like to buy.
//    * The second message should ask how many units of the product they would like to buy.

function buyProducts() {
  //Here we'll purchase some quantity of some specific product:
  console.log("What will you purchase next? \n")
  inquirer
    .prompt([
      {
        name: "idBuy",
        type: "input",
        message: "Product would you like to purchase (Item ID): ",
        validate: function (value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      },
      {
        name: "quantBuy",
        type: "input",
        message: "Quantity desired: ",
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
      //HERE NEED TO SUBTRACT GOODS PURCHASED, OR REJECT OFFER

      //BAL_QTY = BAL_QTY - (SELECT   SUM(QTY)


      console.log("Updating inventory...\n");
      var query = connection.query("UPDATE products SET ? WHERE ?",
        [
          {
            stock_quantity: answers.quantBuy
          },
          {
            item_id: answers.idBuy
          }
        ],
        function(err, res) {
          console.log(res);
          // Call deleteProduct AFTER the UPDATE completes
          // deleteProduct();
        }
      );
    
      // logs the actual query being run
      console.log(query.sql);




      //-------------------------------------------------------------------------------------------

        startShop();
      });
};