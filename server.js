const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/foodDelivery", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const RestaurantSchema = new mongoose.Schema({
  name: String,
  menu: [{ item: String, price: Number }],
});

const Restaurant = mongoose.model("Restaurant", RestaurantSchema);

const OrderSchema = new mongoose.Schema({
  customerName: String,
  restaurantName: String,
  items: [{ item: String, price: Number }],
  totalPrice: Number,
  orderDate: { type: Date, default: Date.now },
});

const Order = mongoose.model("Order", OrderSchema);

app.get("/restaurants", async (req, res) => {
  const restaurants = await Restaurant.find();
  res.json(restaurants);
});


app.post("/order", async (req, res) => {
  const { customerName, restaurantName, items } = req.body;
  const totalPrice = items.reduce((sum, item) => sum + item.price, 0);

  const newOrder = new Order({ customerName, restaurantName, items, totalPrice });
  await newOrder.save(); 

  console.log("New Order Saved:", newOrder); 

  res.json({ message: "Order placed successfully!", order: newOrder });
});


app.get("/order", async (req, res) => {
    try {
        const orders = await Order.find();
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch orders" });
    }
});


app.listen(5000, () => console.log("Server running on port 5000"));
