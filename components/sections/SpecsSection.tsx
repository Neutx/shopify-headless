'use client';

import * as Icons from 'lucide-react';
import type { Section } from '@/types/sections';

interface SpecsSectionProps {
  section: Section;
  productId?: string;
}

interface Spec {
  label: string;
  value: string;
  icon?: string;
}

export default function SpecsSection({ section }: SpecsSectionProps) {
  const settings = section.settings;

  // Parse specs from JSON string
  let specs: Spec[] = [];
  try {
    specs = typeof settings.specs === 'string' 
      ? JSON.parse(settings.specs) 
      : settings.specs || [];
  } catch (error) {
    console.error('Error parsing specs:', error);
    specs = [];
  }

  const getIcon = (iconName?: string) => {
    if (!iconName || !settings.showIcons) return null;
    const IconComponent = (Icons as any)[iconName];
    return IconComponent ? <IconComponent className="h-5 w-5" /> : null;
  };

  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">{settings.title}</h2>

        {settings.layout === 'table' && (
          <div className="max-w-4xl mx-auto border rounded-lg overflow-hidden">
            <table className="w-full">
              <tbody>
                {specs.map((spec, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? 'bg-muted/50' : 'bg-background'}
                  >
                    <td className="p-4 font-semibold border-r">
                      <div className="flex items-center gap-3">
                        {getIcon(spec.icon)}
                        <span>{spec.label}</span>
                      </div>
                    </td>
                    <td className="p-4">{spec.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {settings.layout === 'list' && (
          <div className="max-w-3xl mx-auto space-y-4">
            {specs.map((spec, index) => (
              <div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
                {getIcon(spec.icon)}
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{spec.label}</h3>
                  <p className="text-muted-foreground">{spec.value}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {settings.layout === 'cards' && (
          <div
            className="grid gap-6"
            style={{
              gridTemplateColumns: `repeat(${settings.columns}, minmax(0, 1fr))`,
            }}
          >
            {specs.map((spec, index) => (
              <div
                key={index}
                className="border rounded-lg p-6 text-center hover:shadow-lg transition-shadow"
              >
                {getIcon(spec.icon) && (
                  <div className="flex justify-center mb-4 text-primary">
                    {getIcon(spec.icon)}
                  </div>
                )}
                <h3 className="font-semibold mb-2">{spec.label}</h3>
                <p className="text-muted-foreground">{spec.value}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

