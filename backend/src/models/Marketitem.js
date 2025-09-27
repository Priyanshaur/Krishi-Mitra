import mongoose from 'mongoose';

const marketItemSchema = new mongoose.Schema({
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    maxlength: 1000
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0
  },
  unit: {
    type: String,
    required: [true, 'Unit is required'],
    enum: ['kg', 'quintal', 'ton', 'bag', 'piece'],
    default: 'kg'
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: ['cereals', 'pulses', 'vegetables', 'fruits', 'spices', 'others']
  },
  images: [{
    url: String,
    publicId: String
  }],
  qualityGrade: {
    type: String,
    enum: ['premium', 'grade-a', 'grade-b', 'standard'],
    default: 'standard'
  },
  organic: {
    type: Boolean,
    default: false
  },
  harvestDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['active', 'sold', 'inactive'],
    default: 'active'
  },
  location: {
    city: String,
    state: String,
    pincode: String
  },
  tags: [String],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

marketItemSchema.index({ sellerId: 1, status: 1 });
marketItemSchema.index({ category: 1, status: 1 });
marketItemSchema.index({ location: 'text', title: 'text', description: 'text' });

export default mongoose.model('MarketItem', marketItemSchema);