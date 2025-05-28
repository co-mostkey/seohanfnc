import ProductDetailPage, { generateMetadata } from '../[id]/page';

export { generateMetadata };

export default function AirSlidePage() {
    return <ProductDetailPage params={Promise.resolve({ id: 'Air-Slide' })} />;
} 