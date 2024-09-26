const Listing = require("../major/models/listing");
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require("path");
const methodOverride=require("method-override")

// use override
app.use(methodOverride("_method"));

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Set the views directory
app.set("views", path.join(__dirname, "views"));

// Middleware to parse incoming requests
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
main().then(() => {
    console.log("Connected to MongoDB successfully");
}).catch(err => {
    console.log("Error connecting to MongoDB: ", err);
});

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/airbnb");
}

// Root route
app.get("/", (req, res) => {
    res.send("Hi, I am the root route and currently working fine");
});

// Route to fetch and render listings
app.get("/listings", async (req, res) => {
    try {
        const list = await Listing.find({});
        res.render("listings/index.ejs", { list });
    } catch (err) {
        res.status(500).send("Error fetching listings");
    }
});

app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs")
 })
 // data from new
 app.post("/listings",async(req,res)=>{
     let {title,description,price,country,img,location}=req.body;
     let newListing= new Listing({
         title:title,
         description:description,
         price:price,
         country:country,
         location:location,
         img:img,
 
     });
    await newListing.save();
     res.redirect("/listings");
 })

// Show route to display a single listing
app.get("/listings/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const list = await Listing.findById(id);  // Use findById to get a single listing
        if (!list) {
            return res.status(404).send("Listing not found");
        }
        res.render("listings/show.ejs", { list });  
    } catch (err) {
        res.status(500).send("Error fetching the listing");
    }
});
// upate data get form

app.get("/listings/:id/edit",async(req,res)=>{
    const { id } = req.params;
  const list = await Listing.findById(id);
    res.render("listings/edit.ejs",{list})
})
// update
app.put("/listings/edit/:id", async (req, res) => {
    const { title, description, price, country, img, location } = req.body;
    const { id } = req.params;

    try {
        // Find and update the listing
        const list = await Listing.findByIdAndUpdate(
            id, 
            { title, description, price, country, img, location },
            { new: true, runValidators: true }  // Return the updated doc and validate inputs
        );
       // Check if the listing exists
        if (!list) {
            return res.status(404).send("Listing not found");
        }

        // Redirect after successful update
        res.redirect("/listings");
    } catch (error) {
        // Handle potential errors
        res.status(500).send("Error updating the listing");
    }
});
// delete
app.delete("/listings/:id", async (req, res) => {
    const { id } = req.params;

    try {
        // Find and delete the listing by ID
        const list = await Listing.findByIdAndDelete(id);

        // Check if the listing was found and deleted
        if (!list) {
            return res.status(404).send("Listing not found");
        }

        // Redirect after successful deletion
        res.redirect("/listings");
    } catch (error) {
        // Handle any potential errors
        res.status(500).send("Error deleting the listing");
    }
});
// app.delete("/listings/:id",async(req,res)=>{
//     let {id}=req.params;
//     let list= await Listing.findByIdAndDelete(id);
//     res.redirect("/listings");
// })

// Start the server
app.listen(8080, () => {
    console.log("Server running on port 8080");
});
