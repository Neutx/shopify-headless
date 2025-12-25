'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface AccordionSection {
  title: string;
  content: string | React.ReactNode;
}

interface ProductAccordionProps {
  sections: AccordionSection[];
}

export default function ProductAccordion({ sections }: ProductAccordionProps) {
  return (
    <Accordion type="multiple" className="w-full">
      {sections.map((section, index) => (
        <AccordionItem key={index} value={`item-${index}`}>
          <AccordionTrigger className="text-left text-lg font-semibold">
            {section.title}
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground">
            {typeof section.content === 'string' ? (
              <div dangerouslySetInnerHTML={{ __html: section.content }} />
            ) : (
              section.content
            )}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

