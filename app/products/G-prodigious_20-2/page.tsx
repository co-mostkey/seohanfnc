import ProductDetailPage, { generateMetadata } from '../[id]/page';

export { generateMetadata };

export default function GProdigious20_2Page() {
    return <ProductDetailPage params={Promise.resolve({ id: 'G-prodigious_20-2' })} />;
} 