const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your product name."],
  },
  description: {
    type: String,
    required: [true, "Please enter your product description."],
  },
  specifications: {
    type: String,
  },
  yearMfg: {
    type: Number,
  },
  hsnCode: {
    type: String,
  },
  category: {
    type: String,
    required: [true, "Please enter your product category."],
  },
  tags: {
    type: String,
  },
  originalPrice: {
    type: Number,
  },
  discountPrice: {
    type: Number,
    required: [true, "Please enter your product price."],
  },
  discount: {
    type: Number,
  },
  gstCategory: {
    type: Number,
    default: 18,
  },
  priceIncludingGst: {
    type: Number,
  },
  stock: {
    type: Number,
    required: [true, "Please enter your product stock."],
  },
  qty: {
    type: Number,
  },
  packing: {
    type: String,
  },
  images: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
  boxImage: {
    public_id: {
      type: String,
    },
    url: {
      type: String,
    },
  },
  reviews: [
    {
      user: {
        type: Object,
      },
      rating: {
        type: Number,
      },
      comment: {
        type: String,
      },
      productId: {
        type: String,
      },
      createdAt: {
        type: Date,
        default: Date.now(),
      },
    },
  ],
  ratings: {
    type: Number,
  },
  sellerId: {
    type: String,
    required: true,
  },
  seller: {
    type: Object,
    required: true,
  },
  soldOut: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Product", productSchema);
