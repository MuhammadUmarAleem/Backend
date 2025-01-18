const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    productName: {
      type: String,
      required: true,
      maxlength: 100,
    },
    description: {
      type: String,
      maxlength: 500,
    },
    price: {
      type: Number,
      required: true,
      min: 0, // Ensure price is non-negative
    },
    dimensions: {
      type: String,
      maxlength: 50,
    },
    brand: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    notes: {
      type: String,
    },
    weight: {
      type: String,
    },
    warranty: {
      type: String,
    },
    warrantyType: {
      type: String,
    },
    taxExcludedPrice: {
      type: Number,
      min: 0,
    },
    taxIncludedPrice: {
      type: Number,
      min: 0,
    },
    taxRule: {
      type: String,
    },
    unitPrice: {
      type: Number,
      min: 0,
    },
    minimumOrder: {
      type: Number,
      min: 1,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true,
    },
    discount: {
      // New discount field with default value
      type: Number,
      default: 0,
      min: 0, // Ensure discount is non-negative
    },
    stock: {
      // New discount field with default value
      type: Number,
      default: 0,
      min: 0, // Ensure discount is non-negative
    },
    width: {
      // New discount field with default value
      type: Number,
      default: 0,
      min: 0, // Ensure discount is non-negative
    },
    height: {
      // New discount field with default value
      type: Number,
      default: 0,
      min: 0, // Ensure discount is non-negative
    },
    depth: {
      // New discount field with default value
      type: Number,
      default: 0,
      min: 0, // Ensure discount is non-negative
    },
    status: {
      // Added the status field with default value true
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Define virtuals for related data
productSchema.virtual("productImages", {
  ref: "ProductImages",
  localField: "_id",
  foreignField: "productId",
});

productSchema.virtual("productTags", {
  ref: "ProductTag",
  localField: "_id",
  foreignField: "productId",
});

productSchema.virtual("productCategories", {
  ref: "ProductCategories",
  localField: "_id",
  foreignField: "productId",
});

productSchema.virtual("productAvailability", {
  ref: "ProductAvailability",
  localField: "_id",
  foreignField: "productId",
});

// Enable virtuals in JSON and objects
productSchema.set("toObject", { virtuals: true });
productSchema.set("toJSON", { virtuals: true });

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
