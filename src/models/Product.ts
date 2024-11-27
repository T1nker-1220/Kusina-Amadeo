import mongoose from 'mongoose';

interface IAddon {
  name: string;
  price: number;
  maxQuantity?: number;
  category?: string;
}

interface IVariant {
  name: string;
  price?: number;
  isDefault?: boolean;
}

export interface IProduct {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: 'Budget Meals' | 'Silog Meals' | 'Ala Carte' | 'Beverages';
  image?: string;
  productId: string;
  isAvailable: boolean;
  addons?: IAddon[];
  variants?: IVariant[];
  variantGroups?: {
    name: string;
    required?: boolean;
    options: string[];
  }[];
  createdAt?: Date;
  updatedAt?: Date;
}

const productSchema = new mongoose.Schema<IProduct>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: {
    type: String,
    required: true,
    enum: ['Budget Meals', 'Silog Meals', 'Ala Carte', 'Beverages']
  },
  image: { type: String },
  productId: { type: String, required: true },
  isAvailable: { type: Boolean, default: true },
  addons: [{
    name: { type: String, required: true },
    price: { type: Number, required: true },
    maxQuantity: { type: Number },
    category: { type: String }
  }],
  variants: [{
    name: { type: String, required: true },
    price: { type: Number },
    isDefault: { type: Boolean }
  }],
  variantGroups: [{
    name: { type: String, required: true },
    required: { type: Boolean },
    options: [{ type: String }]
  }]
}, {
  timestamps: true
});

// Virtual for calculating final price with variants
productSchema.virtual('finalPrice').get(function() {
  let price = this.price;
  if (this.variants && this.variants.length > 0) {
    const defaultVariant = this.variants.find(v => v.isDefault);
    if (defaultVariant && defaultVariant.price) {
      price += defaultVariant.price;
    }
  }
  return price;
});

// Method to validate variant selection
productSchema.methods.validateVariants = function(selectedVariants: string[]) {
  if (!this.variantGroups) return true;
  
  return this.variantGroups.every((group: { required?: boolean; options: string[] }) => {
    if (!group.required) return true;
    return selectedVariants.some(variant => 
      group.options.includes(variant)
    );
  });
};

// Method to calculate price with selected variants and addons
productSchema.methods.calculatePrice = function(
  selectedVariants: string[] = [], 
  selectedAddons: { [key: string]: number } = {}
) {
  let total = this.price;

  // Add variant prices
  if (selectedVariants.length > 0 && this.variants) {
    selectedVariants.forEach(variantName => {
      const variant = this.variants.find((v: IVariant) => v.name === variantName);
      if (variant && variant.price) {
        total += variant.price;
      }
    });
  }

  // Add addon prices
  if (this.addons) {
    Object.entries(selectedAddons).forEach(([addonName, quantity]) => {
      const addon = this.addons.find((a: IAddon) => a.name === addonName);
      if (addon) {
        total += addon.price * quantity;
      }
    });
  }

  return total;
};

export default mongoose.models.Product || mongoose.model<IProduct>('Product', productSchema);
