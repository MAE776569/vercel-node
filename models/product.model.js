const mongoose = require("mongoose")

const ColorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
})

const Product = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    sizes: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Size",
      required: false,
      default: [],
    },
    colors: {
      type: [ColorSchema],
      required: false,
      default: [],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Collection",
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
    SKU: {
      type: String,
      required: true,
      unique: true,
    },
    tags: {
      type: [String],
      required: false,
      default: [],
    },
    thumbnail: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      required: false,
      default: [],
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: false,
    },
    deletedAt: {
      type: Date,
      required: false,
    },
  },
  {
    timestamps: true,
  },
)

Product.post("updateOne", async function () {
  const filter = this.getFilter()
  const update = this.getUpdate()

  const quantity = update?.$inc?.quantity
  if (typeof quantity === "number" && filter._id) {
    const productsRepo = require("../repositories/products.repo")
    const product = await productsRepo.getProductById(filter._id)
    if (product.quantity < 1) {
      await productsRepo.updateProductById({
        _id: filter._id,
        data: {
          inStock: false,
        },
      })
    }
  }
})

Product.index({ name: "text" })

module.exports = mongoose.model("Product", Product)
