const inquirer = require("inquirer");
const mysql = require("mysql");
const Table = require("cli-table");


const connection = mysql.createConnection({
    host: "localhost",
  
    // Your port; if not 3306
    port: 3306,
  
    // Your username
    user: "root",
  
    // Your password
    password: "password",
    database: "bamazon"
});
  
connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    promptUser();
});

const promptUser = () => {

    inquirer.prompt([
        {
            name: "action",
            type: "list",
            message: "\nWhat would you like to do?",
            choices: ["Purchase Items", "Quit"]
        }
    ]).then(function(response){

        switch(response.action){

            case "Purchase Items":
                purchaseItem();
                break;

            case "Quit":
                connection.end();
                process.exit();
        }
    })
}



const outputTable = (input) => {

    let table = new Table({
        head: ["ID", "Name", "Department", "Stock", "Price"],
        colWidths: [5, 50, 20, 10, 10]
    });

    input.forEach(e => {
        
        let tempArr = [e.item_id, e.product_name, e.department_name, e.stock_quantity, e.product_price];
        table.push(tempArr);
    });

    let newTable = table.toString();

    return newTable;
}

const purchaseItem = () => {

    connection.query("SELECT * FROM products", function(err, results){
        if (err) throw err;

        //console.log(outputTable(results));
        let productsTable = outputTable(results);
        
        inquirer.prompt([

            {
                name: "selection",
                type: "input",
                message: "\n" + productsTable + "\nPlease enter the ID of the item you wish to purchase",
            },

            {
                name: "quantity",
                type: "input",
                message: "\nPlease enter how many of this item you would like to buy"
            }

        ]).then(function(response){

            let selectedItem;
            results.forEach(e => {

                if(response.selection === e.item_id){
                    
                    selectedItem = e;
                }
            });

            if(!selectedItem){
                console.log("Please select a valid item");
                purchaseItem();
            } else if (selectedItem.stock_quantity < response.quantity){
                console.log("We don't have enough of that item, but it will be restocked soon!");
                purchaseItem();
            } else {
                checkout(selectedItem, response.quantity);
            }
        });
    });
}

const checkout = (selection, quantity) => {

    let newQuant = selection.stock_quantity - quantity
    let totPrice = selection.product_price * quantity;
    connection.query("UPDATE products SET ? WHERE ?",
    [
        {
            stock_quantity: newQuant
        },
        {
            item_id: selection.item_id
        }
    ])
    console.log("You have purchased " + qunatity + " of '" + selection.product_name + "' for $" + totPrice);
    promptUser();
    
}