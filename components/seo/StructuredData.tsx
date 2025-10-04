import { FC } from 'react';

/**
 * StructuredData component for JSON-LD
 * 
 * Provides reusable component for embedding structured data:
 * - Schema.org JSON-LD markup
 * - Type-safe schema generation
 * - Multiple schema support
 * - SEO optimization for search engines
 */

export interface StructuredDataProps {
  schema: object | object[];
  id?: string;
}

export const StructuredData: FC<StructuredDataProps> = ({ schema, id }) => {
  const jsonLdString = JSON.stringify(schema, null, 2);

  return (
    <script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: jsonLdString,
      }}
    />
  );
};

/**
 * Multiple StructuredData schemas component
 */
export interface MultipleStructuredDataProps {
  schemas: object[];
  idPrefix?: string;
}

export const MultipleStructuredData: FC<MultipleStructuredDataProps> = ({
  schemas,
  idPrefix = 'schema',
}) => {
  return (
    <>
      {schemas.map((schema, index) => (
        <StructuredData
          key={index}
          schema={schema}
          id={`${idPrefix}-${index}`}
        />
      ))}
    </>
  );
};

export default StructuredData;