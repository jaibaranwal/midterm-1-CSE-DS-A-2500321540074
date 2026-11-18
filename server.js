
const express = require("express");
const fs = require("fs");

const app = express();
app.use(express.json());
let inventory = JSON.parse(fs.readFileSync("inventory.json"));
function saveData() {
    fs.writeFileSync("inventory.json", JSON.stringify(inventory, null, 2));
}
app.get("/", (req, res) => {
    res.send("Product Inventory Management System");
});
app.get("/products", (req, res) => {
    res.json(inventory);
});
app.get("/products/:id", (req, res) => {
    let product = inventory.find(p => p.id == req.params.id);

    if (product) {
        res.json(product);
    } else {
        res.send("Product not found");
    }
});
app.post("/products", (req, res) => {
    let newProduct = {
        id: inventory.length ? inventory[inventory.length - 1].id + 1 : 201,
        name: req.body.name,
        price: req.body.price,
        category: req.body.category
    };
    inventory.push(newProduct);
    saveData();
    res.send("Product added successfully");
});
app.put("/products/:id", (req, res) => {
    let product = inventory.find(p => p.id == req.params.id);

    if (product) {
        product.name = req.body.name;
        product.price = req.body.price;
        product.category = req.body.category;

        saveData();
        res.send("Product updated successfully");
    } else {
        res.send("Product not found");
    }
});
app.delete("/products/:id", (req, res) => {
    let id = req.params.id;

    inventory = inventory.filter(p => p.id != id);
    saveData();

    res.send("Product deleted successfully");
});
// Start server
app.listen(3000, () => {
    console.log("Server running on port 3000");
});
