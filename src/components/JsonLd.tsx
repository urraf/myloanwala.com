/** Renders structured data for Google (JSON-LD). Escapes "<" so content can't break out of the script tag. */
export default function JsonLd({ data }: { data: object | object[] }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
