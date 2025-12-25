'use client';

import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { ShopifyProductVariant } from '@/types/shopify';

interface VariantOption {
  name: string;
  values: string[];
}

interface VariantSelectorProps {
  options: VariantOption[];
  selectedOptions: Record<string, string>;
  onChange: (optionName: string, value: string) => void;
  variants: ShopifyProductVariant[];
}

export default function VariantSelector({
  options,
  selectedOptions,
  onChange,
  variants,
}: VariantSelectorProps) {
  // Check if a specific option value is available based on other selections
  const isOptionAvailable = (optionName: string, optionValue: string): boolean => {
    const testSelection = { ...selectedOptions, [optionName]: optionValue };
    
    return variants.some((variant) => {
      if (!variant.availableForSale) return false;
      
      return variant.selectedOptions.every(
        (opt) => testSelection[opt.name] === opt.value
      );
    });
  };

  return (
    <div className="space-y-6">
      {options.map((option) => {
        // For color options, show color swatches
        const isColorOption = option.name.toLowerCase() === 'color';

        return (
          <div key={option.name}>
            <Label className="text-base font-semibold mb-3 block">
              {option.name}: {selectedOptions[option.name] || 'Select'}
            </Label>

            {isColorOption ? (
              // Color Swatches
              <div className="flex flex-wrap gap-2">
                {option.values.map((value) => {
                  const available = isOptionAvailable(option.name, value);
                  const selected = selectedOptions[option.name] === value;

                  return (
                    <button
                      key={value}
                      onClick={() => available && onChange(option.name, value)}
                      disabled={!available}
                      className={`relative h-12 w-12 rounded-full border-2 transition-all ${
                        selected
                          ? 'border-primary scale-110'
                          : available
                          ? 'border-muted-foreground hover:scale-105'
                          : 'border-muted opacity-50 cursor-not-allowed'
                      }`}
                      title={value}
                    >
                      {/* This would ideally use actual color values from a color map */}
                      <div
                        className="absolute inset-1 rounded-full"
                        style={{
                          backgroundColor: value.toLowerCase().replace(/\s/g, ''),
                        }}
                      />
                      {!available && (
                        <div className="absolute inset-0 bg-background/50 rounded-full" />
                      )}
                    </button>
                  );
                })}
              </div>
            ) : (
              // Dropdown for other options
              <Select
                value={selectedOptions[option.name] || ''}
                onValueChange={(value) => onChange(option.name, value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={`Select ${option.name}`} />
                </SelectTrigger>
                <SelectContent>
                  {option.values.map((value) => {
                    const available = isOptionAvailable(option.name, value);
                    
                    return (
                      <SelectItem
                        key={value}
                        value={value}
                        disabled={!available}
                      >
                        {value}
                        {!available && ' (Out of stock)'}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            )}
          </div>
        );
      })}
    </div>
  );
}

