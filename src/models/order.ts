import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IOrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  addons?: string[];
}

interface PickupInfo {
  pickupTime: string;
  contactNumber: string;
  specialInstructions?: string;
}

export interface IOrder extends Document {
  _id?: string;
  userId: Types.ObjectId | string;
  items: IOrderItem[];
  total: number;
  paymentMethod: 'gcash' | 'cod';
  paymentStatus: 'pending' | 'processing' | 'paid' | 'failed';
  orderStatus: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  pickupInfo: PickupInfo;
  paymentDetails?: {
    provider: string;
    accountNumber: string;
    accountName: string;
    amount: string;
    timestamp: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  image: {
    type: String,
    required: false,
  },
  addons: [{
    type: String,
  }],
});

const paymentDetailsSchema = new mongoose.Schema({
  provider: {
    type: String,
    required: true,
  },
  accountNumber: {
    type: String,
    required: true,
  },
  accountName: {
    type: String,
    required: true,
  },
  amount: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const pickupInfoSchema = new mongoose.Schema({
  pickupTime: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: String,
    required: true,
  },
  specialInstructions: {
    type: String,
    required: false,
  },
});

const orderSchema = new mongoose.Schema<IOrder>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: function(items: IOrderItem[]) {
          return items.length > 0;
        },
        message: 'Order must have at least one item',
      },
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentMethod: {
      type: String,
      enum: ['gcash', 'cod'],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'processing', 'paid', 'failed'],
      default: 'pending',
    },
    orderStatus: {
      type: String,
      enum: ['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'],
      default: 'pending',
    },
    pickupInfo: {
      type: pickupInfoSchema,
      required: true,
    },
    paymentDetails: {
      type: paymentDetailsSchema,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

orderSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.Order || mongoose.model<IOrder>('Order', orderSchema);
