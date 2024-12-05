import foodModel from "../models/foodModel.js";
import fs from "fs"; // Module này làm việc với hệ thống file

// add food item
const addFood = async (req, res) => {
  try {
    let image_filename = `${req.file.filename}`;
    if (!image_filename) {
      return res.json({ message: "Image files are required." });
    }

    const existingFood = await foodModel.findOne({ name: req.body.name });
    if (existingFood) {
      return res.json({ message: "The dish already exists in the database." });
    }

    const food = new foodModel({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      image: image_filename,
      category: req.body.category,
    });
    await food.save();
    res.json({ success: true, message: "Food Added" });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: "Error" });
  }
};

// all food list
const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find({});
    res.json({ success: true, data: foods });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: "Error" });
  }
};

// update food item
const updateFood = async (req, res) => {
  const { id } = req.params;
  try {
    const existingFood = await foodModel.findById(id);
    if (!existingFood) {
      return res.json({ message: "Food item not found" });
    }

    const updatedData = {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      image: req.file ? req.file.filename : existingFood.image,
    };

    if (req.file) {
      fs.unlink(`uploads/${existingFood.image}`, () => {});
    }

    const foodUpdated = await foodModel.findByIdAndUpdate(id, updatedData, {
      new: true,
    });
    res.json({ success: true, message: "Updated" });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: "Error" });
  }
};

// remove food item
const removeFood = async (req, res) => {
  const { id } = req.params;
  try {
    const food = await foodModel.findByIdAndDelete(id);
    fs.unlink(`uploads/${food.image}`, () => {});
    res.json({ success: true, message: "Food removed" });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: "Error" });
  }
};

export { addFood, listFood, removeFood, updateFood };
