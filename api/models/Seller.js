const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const sellerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your seller account name."],
  },
  email: {
    type: String,
    required: [true, "Please enter your seller account email address."],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please enter your password."],
    minLength: [6, "Password should be greater than 6 characters."],
    select: false,
  },
  description: {
    type: String,
  },
  address: {
    type: String,
    required: [true, "Please enter your address."],
  },
  phoneNumber: {
    type: Number,
    required: [true, "Please enter your mobile number."],
  },
  age: {
    type: Number,
    required: [true, "Please enter your age."],
  },
  gender: {
    type: String,
    required: [true, "Please select your gender."],
    enum: ["Male", "Female", "Other"],
  },
  companyName: {
    type: String,
    required: [true, "Please enter your company name."],
  },
  officeAddress: {
    type: String,
    required: [true, "Please enter your office address."],
  },
  godownAddress: {
    type: String,
    required: [true, "Please enter your godown address."],
  },
  state: {
    type: String,
    required: [true, "Please enter your state."],
  },
  town: {
    type: String,
    required: [true, "Please enter your town."],
  },
  zipCode: {
    type: Number,
    required: [true, "Please enter your pin code."],
  },
  aadhaarNo: {
    type: String,
    required: [true, "Please enter your Aadhaar number."],
  },
  panNo: {
    type: String,
    required: [true, "Please enter your PAN number."],
  },
  gstNo: {
    type: String,
    required: [true, "Please enter your GST number."],
  },
  role: {
    type: String,
    default: "Seller",
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  withdrawMethod: {
    type: Object,
  },
  availableBalance: {
    type: Number,
    default: 0,
  },
  transactions: [
    {
      amount: {
        type: Number,
        required: true,
      },
      status: {
        type: String,
        default: "Processing",
      },
      createdAt: {
        type: Date,
        default: Date.now(),
      },
      updatedAt: {
        type: Date,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  resetPasswordToken: String,
  resetPasswordTime: Date,
});

sellerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

sellerSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

sellerSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("Seller", sellerSchema);
