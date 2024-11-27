import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { useCart } from '@/contexts/CartContext';
import type { IProduct } from '@/models/Product';

interface IVariant {
  name: string;
  price: number;
  isDefault: boolean;
}

interface IAddon {
  name: string;
  price: number;
  maxQuantity: number;
  category: string;
}

export interface ProductCustomizationProps {
  product: IProduct;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductCustomization({
  product,
  isOpen,
  onClose
}: ProductCustomizationProps) {
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [selectedVariants, setSelectedVariants] = useState<string[]>([]);
  const [selectedAddons, setSelectedAddons] = useState<{ [key: string]: number }>({});
  const { addItem } = useCart();
  const [isLoading, setIsLoading] = useState(false);

  const calculateTotalPrice = () => {
    let total = product.price * quantity;
    
    // Add variant prices
    if (product.variants) {
      selectedVariants.forEach(variantName => {
        const variant = product.variants?.find(v => v.name === variantName);
        if (variant) {
          total += variant.price * quantity;
        }
      });
    }

    // Add addon prices
    if (product.addons) {
      Object.entries(selectedAddons).forEach(([addonName, addonQty]) => {
        const addon = product.addons?.find(a => a.name === addonName);
        if (addon) {
          total += addon.price * addonQty * quantity;
        }
      });
    }

    return total;
  };

  const handleVariantChange = (groupName: string, variantName: string) => {
    setSelectedVariants(prev => {
      const filtered = prev.filter(v => !product.variants?.find(pv => pv.name === v));
      return [...filtered, variantName];
    });
  };

  const handleAddonChange = (addonName: string, value: number) => {
    setSelectedAddons(prev => ({
      ...prev,
      [addonName]: value
    }));
  };

  const handleAddToCart = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
      
      const selectedVariantsList = selectedVariants.map(variantName => {
        const variant = product.variants?.find(v => v.name === variantName);
        return variant ? `${variant.name} (+₱${variant.price})` : variantName;
      });

      const selectedAddonsList = Object.entries(selectedAddons)
        .filter(([_, qty]) => qty > 0)
        .map(([name, qty]) => {
          const addon = product.addons?.find(a => a.name === name);
          return addon ? `${qty}x ${name} (+₱${addon.price * qty})` : name;
        });

      addItem({
        id: product._id,
        name: product.name,
        price: calculateTotalPrice() / quantity, // Price per unit including variants and addons
        quantity,
        image: product.image,
        variants: selectedVariantsList,
        addons: selectedAddonsList,
        specialInstructions: specialInstructions || undefined,
      });
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95%] max-h-[90vh] sm:max-h-[85vh] sm:max-w-[425px] p-4 sm:p-6 overflow-y-auto rounded-t-xl sm:rounded-xl">
        <DialogHeader className="sticky top-0 bg-white dark:bg-brand-900 z-10 pb-4">
          <DialogTitle>Customize Your Order</DialogTitle>
          <div className="flex items-center justify-between">
            <h3 className="font-medium">{product.name}</h3>
            <span className="text-lg font-semibold">₱{calculateTotalPrice().toLocaleString()}</span>
          </div>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          {/* Product Description */}
          <p className="text-sm text-gray-500">{product.description}</p>

          {/* Variants Section */}
          {product.variantGroups && product.variantGroups.length > 0 && (
            <div className="space-y-4">
              {product.variantGroups.map((group, groupIndex) => (
                <div key={groupIndex} className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    {group.name}
                    {group.required && <span className="text-red-500 text-xs">Required</span>}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {group.options.map((option, optionIndex) => {
                      const variant = product.variants?.find(v => v.name === option);
                      const isSelected = selectedVariants.includes(option);
                      return (
                        <div key={optionIndex} className="flex items-center space-x-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
                          <input
                            type="radio"
                            name={group.name}
                            id={`${group.name}-${option}`}
                            value={option}
                            checked={isSelected}
                            onChange={() => handleVariantChange(group.name, option)}
                            className="text-brand-600 focus:ring-brand-500"
                          />
                          <label htmlFor={`${group.name}-${option}`} className="flex-1 text-sm">
                            {option}
                            {variant?.price ? ` (+₱${variant.price})` : ''}
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add-ons Section */}
          {product.addons && product.addons.length > 0 && (
            <div className="space-y-4">
              <label className="text-sm font-medium">Add-ons</label>
              <div className="grid gap-3">
                {product.addons.map((addon, index) => (
                  <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800 space-y-2 sm:space-y-0">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`addon-${index}`}
                        checked={selectedAddons[addon.name] > 0}
                        onChange={(e) => handleAddonChange(addon.name, e.target.checked ? 1 : 0)}
                        className="text-brand-600 focus:ring-brand-500"
                      />
                      <label htmlFor={`addon-${index}`} className="text-sm">
                        {addon.name} (+₱{addon.price})
                      </label>
                    </div>
                    {selectedAddons[addon.name] > 0 && (
                      <div className="flex items-center gap-2 justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddonChange(
                            addon.name,
                            Math.max(0, (selectedAddons[addon.name] || 0) - 1)
                          )}
                          className="h-8 w-8"
                        >
                          -
                        </Button>
                        <span className="w-8 text-center">{selectedAddons[addon.name]}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddonChange(
                            addon.name,
                            Math.min(addon.maxQuantity, (selectedAddons[addon.name] || 0) + 1)
                          )}
                          className="h-8 w-8"
                        >
                          +
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Special Instructions */}
          <div className="space-y-2">
            <label htmlFor="special-instructions" className="text-sm font-medium">
              Special Instructions
            </label>
            <textarea
              id="special-instructions"
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="Any special requests?"
              className="w-full min-h-[80px] p-2 text-sm border rounded-lg focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-800 dark:border-gray-700"
            />
          </div>

          {/* Quantity Section */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Quantity</label>
            <div className="flex items-center gap-4 p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="h-8 w-8"
              >
                -
              </Button>
              <span className="w-8 text-center">{quantity}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuantity(quantity + 1)}
                className="h-8 w-8"
              >
                +
              </Button>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white dark:bg-brand-900 pt-4 mt-4 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between font-medium mb-3">
            <span>Total Amount</span>
            <span>₱{calculateTotalPrice().toLocaleString()}</span>
          </div>
          <Button
            onClick={handleAddToCart}
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Adding to Cart..." : "Add to Cart"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
