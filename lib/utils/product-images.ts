/**
 * 제품 이미지 관리를 위한 유틸리티 함수
 * 새로운 폴더 구조에 맞게 이미지 경로를 생성합니다.
 */

// 제품 메인 이미지 경로 생성
export function getProductMainImage(productId: string, type: 'main' | 'visual' = 'main'): string {
  const extension = type === 'main' ? 'png' : 'jpg';
  return `/images/products/${productId}/main/${type}.${extension}`;
}

// 제품 갤러리 이미지 경로 생성 (다수)
export function getProductGalleryImages(productId: string, count: number = 5): string[] {
  const images: string[] = [];
  
  // 실제 존재하는 갤러리 이미지 수를 확인하는 로직을 구현할 수 있습니다
  // 여기서는 간단히 요청받은 개수만큼 경로 생성
  for (let i = 1; i <= count; i++) {
    const index = i.toString().padStart(2, '0'); // 01, 02, 03... 형식
    images.push(`/images/products/${productId}/gallery/${index}.jpg`);
  }
  
  return images;
}

// 제품 세부 이미지 경로 생성
export function getProductDetailImage(productId: string, type: string): string {
  return `/images/products/${productId}/details/${type}.jpg`;
}

// 제품 비디오 경로 생성
export function getProductVideo(productId: string, type: 'main' | string = 'main'): string {
  return `/images/products/${productId}/videos/${type}.mp4`;
}

// 제품 이미지 데이터 가져오기 (통합)
export function getProductImageData(productId: string): {
  main: string;
  visual: string;
  gallery: string[];
  videos: string[];
} {
  // 갤러리 이미지는 서버에서 실제 파일 정보를 확인할 수 있지만
  // 클라이언트에서는 예상 경로를 생성하고 오류 처리를 통해 관리
  const galleryImages = getProductGalleryImages(productId, 5);
  
  // 비디오 파일 목록도 서버에서 관리하는 것이 좋지만
  // 여기서는 간단히 main.mp4만 있다고 가정
  const videos = [getProductVideo(productId)];
  
  return {
    main: getProductMainImage(productId, 'main'),
    visual: getProductMainImage(productId, 'visual'),
    gallery: galleryImages,
    videos: videos
  };
}
