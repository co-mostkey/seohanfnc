import ProductDetailPage, { generateMetadata } from '../[id]/page';

export { generateMetadata };

export default function GProdigiousHandyHangerPage() {
    return <ProductDetailPage params={Promise.resolve({ id: 'G-prodigious_Handy-Hanger' })} />;
} 