// 연관 파일:
// - page.tsx (데이터를 받아 ProductDetailClient에 전달)
// - client.tsx (getProductById 결과 사용)
// - types/product.ts (Product, Document, MediaGalleryItem 타입)

import { Product, Document, MediaGalleryItem } from '@/types/product';
import fs from 'fs'; // Node.js 파일 시스템 모듈
import path from 'path'; // Node.js 경로 모듈

// 제품 데이터 구조 인터페이스
interface ProductsData {
  categories: Array<{
    id: string;
    nameKo?: string;
    nameEn?: string;
    nameCn?: string;
    products: Product[];
  }>;
}

// 제품 데이터 JSON을 매번 동적으로 읽어 최신 상태 유지
function loadProductsData(): ProductsData {
  try {
    // 실제 제품 데이터 파일 경로
    const jsonPath = path.join(process.cwd(), 'content', 'data', 'products', 'products.json');

    // 파일 존재 여부 확인
    if (!fs.existsSync(jsonPath)) {
      console.warn('[data/products.ts] products.json 파일이 존재하지 않습니다. 기본 데이터를 사용합니다.');
      return {
        categories: [
          {
            id: 'safety-equipment',
            nameKo: '안전장비',
            nameEn: 'Safety Equipment',
            products: [
              {
                id: 'Cylinder-Type-SafetyAirMat',
                nameKo: '실린더형 공기안전매트',
                name: 'Cylinder Type Safety Air Mat',
                category: 'safety-equipment',
                productCategoryId: 'safety-equipment',
                showInProductList: true,
                description: '실린더형 공기안전매트입니다.',
                image: '/images/products/Cylinder-Type-SafetyAirMat.jpg'
              }
            ]
          }
        ]
      };
    }

    const raw = fs.readFileSync(jsonPath, 'utf-8');

    // 빈 파일 처리
    if (!raw || raw.trim() === '') {
      console.warn('[data/products.ts] products.json 파일이 비어있습니다.');
      return { categories: [] };
    }

    const parsed = JSON.parse(raw) as ProductsData;

    // 데이터 구조 검증
    if (!parsed || !parsed.categories || !Array.isArray(parsed.categories)) {
      console.warn('[data/products.ts] products.json 파일 구조가 올바르지 않습니다.');
      return { categories: [] };
    }

    console.log(`[data/products.ts] 성공적으로 ${parsed.categories.length}개 카테고리의 제품 데이터를 로드했습니다.`);
    return parsed;

  } catch (err) {
    console.error('[data/products.ts] products.json 로드 실패:', err);

    // 오류 발생 시 기본 데이터 반환
    return {
      categories: [
        {
          id: 'safety-equipment',
          nameKo: '안전장비',
          nameEn: 'Safety Equipment',
          products: [
            {
              id: 'Cylinder-Type-SafetyAirMat',
              nameKo: '실린더형 공기안전매트',
              name: 'Cylinder Type Safety Air Mat',
              category: 'safety-equipment',
              productCategoryId: 'safety-equipment',
              showInProductList: true,
              description: '실린더형 공기안전매트입니다.',
              image: '/images/products/Cylinder-Type-SafetyAirMat.jpg'
            }
          ]
        }
      ]
    };
  }
}

// 최초 로드 (SSR 빌드 단계에서도 빈 구조를 최소 보장)
let productsDataSource: ProductsData = loadProductsData();

// 개발 환경에서 파일 변동 시 자동으로 다시 읽도록 설정
if (process.env.NODE_ENV !== 'production') {
  const jsonPath = path.join(process.cwd(), 'content', 'data', 'products', 'products.json');
  if (fs.existsSync(jsonPath)) {
    fs.watchFile(jsonPath, { interval: 1000 }, () => {
      try {
        productsDataSource = loadProductsData();
        console.log('[data/products.ts] products.json 변경 감지 → 데이터 자동 리로드');
      } catch (err) {
        console.error('[data/products.ts] 데이터 리로드 실패:', err);
      }
    });
  }
}

// 모든 제품을 단일 배열로 추출 (showInProductList 및 isPublished 필터링 적용)
export function getAllProducts(options?: { includeUnpublished?: boolean }): Product[] {
  try {
    // 개발 환경에서는 항상 최신 데이터를 로드
    if (process.env.NODE_ENV !== 'production') {
      productsDataSource = loadProductsData();
    }

    let allProductsList: Product[] = [];

    // 안전성 검사 강화
    if (!productsDataSource) {
      console.warn('[getAllProducts] productsDataSource가 없습니다. 다시 로드를 시도합니다.');
      try {
        productsDataSource = loadProductsData();
      } catch (reloadError) {
        console.error('[getAllProducts] 데이터 재로드 실패:', reloadError);
        return [];
      }
    }

    if (!productsDataSource || typeof productsDataSource !== 'object') {
      console.error('[getAllProducts] productsDataSource가 유효한 객체가 아닙니다.');
      return [];
    }

    if (!productsDataSource.categories) {
      console.error('[getAllProducts] productsDataSource.categories가 없습니다.');
      return [];
    }

    if (!Array.isArray(productsDataSource.categories)) {
      console.error('[getAllProducts] productsDataSource.categories가 배열이 아닙니다.');
      return [];
    }

    // categories 배열이 비어있는 경우 처리 - length 접근 전에 검사
    if (!productsDataSource.categories || productsDataSource.categories.length === 0) {
      console.warn('[getAllProducts] categories 배열이 비어있습니다.');
      return [];
    }

    // 각 카테고리를 안전하게 처리
    for (let categoryIndex = 0; categoryIndex < productsDataSource.categories.length; categoryIndex++) {
      const category = productsDataSource.categories[categoryIndex];

      // 카테고리와 제품 배열에 대한 안전성 검사 강화
      if (!category || typeof category !== 'object') {
        console.warn(`[getAllProducts] 카테고리 ${categoryIndex}가 유효하지 않습니다:`, category);
        continue;
      }

      if (!category.id || typeof category.id !== 'string') {
        console.warn(`[getAllProducts] 카테고리 ${categoryIndex}의 ID가 유효하지 않습니다:`, category);
        continue;
      }

      if (!category.products) {
        console.warn(`[getAllProducts] 카테고리 ${category.id}에 products 필드가 없습니다.`);
        continue;
      }

      if (!Array.isArray(category.products)) {
        console.warn(`[getAllProducts] 카테고리 ${category.id}의 products가 배열이 아닙니다:`, category.products);
        continue;
      }

      try {
        // products 배열의 length 접근 전에 안전성 검사
        if (category.products && category.products.length > 0) {
          const productsWithCategory = category.products
            .filter((p, productIndex) => {
              if (!p || typeof p !== 'object') {
                console.warn(`[getAllProducts] 카테고리 ${category.id}의 제품 ${productIndex}가 유효하지 않습니다:`, p);
                return false;
              }
              if (!p.id || typeof p.id !== 'string' || p.id.trim() === '') {
                console.warn(`[getAllProducts] 카테고리 ${category.id}의 제품 ${productIndex}에 유효한 ID가 없습니다:`, p);
                return false;
              }
              return true;
            })
            .map(p => ({ ...p, productCategoryId: category.id }));

          // concat 전에 배열 검사
          if (Array.isArray(productsWithCategory) && productsWithCategory.length > 0) {
            allProductsList = allProductsList.concat(productsWithCategory);
          }
        }
      } catch (categoryError) {
        console.error(`[getAllProducts] 카테고리 ${category.id} 처리 중 오류:`, categoryError);
      }
    }

    // showInProductList가 false인 항목과 isPublished가 false인 항목은 최종 목록에서 제외
    let filteredList: Product[] = [];
    try {
      if (Array.isArray(allProductsList) && allProductsList.length > 0) {
        filteredList = allProductsList.filter(p => {
          if (!p || typeof p !== 'object') {
            return false;
          }
          // showInProductList 필터링 (기존)
          if (p.showInProductList === false) {
            return false;
          }
          // isPublished 필터링 (관리자용에서는 건너뛰기)
          if (!options?.includeUnpublished && p.isPublished === false) {
            return false;
          }
          return true;
        });
      }
    } catch (filterError) {
      console.error('[getAllProducts] 필터링 중 오류:', filterError);
      filteredList = allProductsList; // 필터링 실패 시 원본 리스트 사용
    }

    // Vehicle-Disinfector를 강제로 포함 (문제 해결을 위한 임시 조치)
    try {
      if (Array.isArray(allProductsList) && allProductsList.length > 0) {
        const vehicleDisinfector = allProductsList.find(p => p && p.id === 'Vehicle-Disinfector');
        if (vehicleDisinfector && (!Array.isArray(filteredList) || !filteredList.some(p => p && p.id === 'Vehicle-Disinfector'))) {
          // Vehicle-Disinfector도 isPublished 체크 적용 (관리자용에서는 건너뛰기)
          if (options?.includeUnpublished || vehicleDisinfector.isPublished !== false) {
            if (!Array.isArray(filteredList)) {
              filteredList = [];
            }
            filteredList.push({ ...vehicleDisinfector, showInProductList: true });
          }
        }
      }
    } catch (vehicleError) {
      console.error('[getAllProducts] Vehicle-Disinfector 처리 중 오류:', vehicleError);
    }

    // sortOrder를 기준으로 정렬 (sortOrder가 없는 제품은 맨 뒤로)
    try {
      if (Array.isArray(filteredList) && filteredList.length > 0) {
        filteredList.sort((a, b) => {
          const aOrder = a.sortOrder ?? 999999;
          const bOrder = b.sortOrder ?? 999999;
          return aOrder - bOrder;
        });
      }
    } catch (sortError) {
      console.error('[getAllProducts] 정렬 중 오류:', sortError);
    }

    return Array.isArray(filteredList) ? filteredList : [];

  } catch (error) {
    console.error('[getAllProducts] 전체 함수 실행 중 오류 발생:', error);
    return [];
  }
}

// 관리자 전용: 모든 제품을 단일 배열로 추출 (isPublished 필터링 없음)
export function getAllProductsForAdmin(): Product[] {
  return getAllProducts({ includeUnpublished: true });
}

// 파일 이름에서 확장자 제거하고 공백 처리하는 함수
function formatNameFromFilename(filename: string): string {
  return path.basename(filename, path.extname(filename))
    .replace(/[-_]/g, ' '); // 하이픈, 언더스코어를 공백으로
}

// === 최종 복원된 getProductById 함수 ===
export function getProductById(id: string): Product | undefined {
  // 안전성 검사 강화
  if (!productsDataSource || !Array.isArray(productsDataSource.categories)) {
    console.warn('[getProductById] productsDataSource.categories가 유효하지 않음');
    return undefined;
  }

  let productFromOriginalJson: Product | undefined;
  for (const category of productsDataSource.categories) {
    // 카테고리 및 제품 배열 안전성 검사
    if (!category || !Array.isArray(category.products)) {
      continue;
    }

    const found = category.products.find(p => p && p.id === id);
    if (found) {
      // 원본 제품 객체를 복사하고 category.id를 productCategoryId로 명시적으로 추가
      productFromOriginalJson = { ...found, productCategoryId: category.id };
      break;
    }
  }

  if (!productFromOriginalJson) {
    return undefined;
  }

  // 기본 데이터로 시작 (파일 시스템 접근 없이도 작동하도록)
  let dynamicDocuments: Document[] = productFromOriginalJson.documents || [];
  let loadedGalleryImages: MediaGalleryItem[] = [];
  let loadedVideos: MediaGalleryItem[] = [];

  // 파일 시스템 접근을 안전하게 시도 (모든 단계를 개별 try-catch로 보호)
  try {
    // fs 모듈 사용 가능 여부 확인
    if (typeof process !== 'undefined' && process.cwd && fs && fs.existsSync) {
      // 문서 로드 시도
      try {
        const documentsPath = path.join(process.cwd(), 'public', 'documents', 'products', id);
        if (fs.existsSync(documentsPath)) {
          const docFiles = fs.readdirSync(documentsPath);
          if (Array.isArray(docFiles) && docFiles.length > 0) {
            const filteredDocs = docFiles.filter(file => {
              try {
                const fullPath = path.join(documentsPath, file);
                return fs.existsSync(fullPath) && !fs.statSync(fullPath).isDirectory();
              } catch {
                return false;
              }
            });

            dynamicDocuments = filteredDocs.map(file => {
              const ext = path.extname(file).substring(1).toLowerCase();
              let fileType: 'pdf' | 'doc' | 'etc' = 'etc';
              if (ext === 'pdf') fileType = 'pdf';
              else if (ext === 'doc' || ext === 'docx') fileType = 'doc';

              return {
                id: file,
                name: formatNameFromFilename(file),
                nameKo: formatNameFromFilename(file),
                url: `/documents/products/${id}/${file}`,
                path: `/documents/products/${id}/${file}`,
                type: fileType
              };
            });
          }
        }
      } catch (docError) {
        console.warn(`[getProductById] 문서 로드 실패 (ID: ${id}):`, docError);
      }

      // 갤러리 이미지 로드 시도
      try {
        const imageGalleryPath = path.join(process.cwd(), 'public', 'images', 'products', id, 'gallery');
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

        if (fs.existsSync(imageGalleryPath)) {
          const imgFiles = fs.readdirSync(imageGalleryPath);
          if (Array.isArray(imgFiles)) {
            const filteredImages = imgFiles.filter(file => {
              try {
                const fullPath = path.join(imageGalleryPath, file);
                return fs.existsSync(fullPath) &&
                  !fs.statSync(fullPath).isDirectory() &&
                  imageExtensions.includes(path.extname(file).toLowerCase());
              } catch {
                return false;
              }
            });

            filteredImages.forEach(file => {
              loadedGalleryImages.push({
                id: `img-${file}`,
                src: `/images/products/${id}/gallery/${file}`,
                alt: `${productFromOriginalJson!.nameKo || productFromOriginalJson!.nameEn} 갤러리 이미지 - ${formatNameFromFilename(file)}`,
                type: 'image',
                description: '',
                caption: formatNameFromFilename(file)
              });
            });
          }
        }
      } catch (imgError) {
        console.warn(`[getProductById] 갤러리 이미지 로드 실패 (ID: ${id}):`, imgError);
      }

      // 갤러리 비디오 로드 시도
      try {
        const videoGalleryPath = path.join(process.cwd(), 'public', 'videos', 'products', id, 'gallery');
        const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.wmv'];

        if (fs.existsSync(videoGalleryPath)) {
          const videoFiles = fs.readdirSync(videoGalleryPath);
          if (Array.isArray(videoFiles)) {
            const filteredVideos = videoFiles.filter(file => {
              try {
                const fullPath = path.join(videoGalleryPath, file);
                return fs.existsSync(fullPath) &&
                  !fs.statSync(fullPath).isDirectory() &&
                  videoExtensions.includes(path.extname(file).toLowerCase());
              } catch {
                return false;
              }
            });

            filteredVideos.forEach(file => {
              loadedVideos.push({
                id: `vid-${file}`,
                src: `/videos/products/${id}/gallery/${file}`,
                alt: `${productFromOriginalJson!.nameKo || productFromOriginalJson!.nameEn} 갤러리 비디오 - ${formatNameFromFilename(file)}`,
                type: 'video',
                description: '',
                caption: formatNameFromFilename(file)
              });
            });
          }
        }
      } catch (videoError) {
        console.warn(`[getProductById] 갤러리 비디오 로드 실패 (ID: ${id}):`, videoError);
      }
    }
  } catch (fsError) {
    console.warn(`[getProductById] 파일 시스템 접근 실패 (ID: ${id}):`, fsError);
  }

  // 기존 gallery_images_data가 있으면 우선 사용, 없으면 파일 시스템에서 로드한 것 사용
  const existingGalleryImages = productFromOriginalJson.gallery_images_data || [];
  const finalGalleryImages = existingGalleryImages.length > 0 ? existingGalleryImages : loadedGalleryImages;

  // 기존 videos가 있으면 우선 사용, 없으면 파일 시스템에서 로드한 것 사용
  const existingVideos = productFromOriginalJson.videos || [];
  const finalVideos = existingVideos.length > 0 ? existingVideos : loadedVideos;

  const finalProduct: Product = {
    ...productFromOriginalJson,
    documents: dynamicDocuments,
    gallery_images_data: finalGalleryImages,
    videos: finalVideos,
  };

  return finalProduct;
}

// ID로 제품 검색 (getProductById 호출)
export function findProductById(id: string): Product | undefined {
  return getProductById(id);
}

// 카테고리별 제품 검색 (showInProductList 필터링 적용)
export function findProductsByCategory(categoryId: string): Product[] {
  const allProds = getAllProducts(); // 이제 필터링된 목록을 사용

  let filteredProducts;
  if (categoryId === "descender-hangers") {
    // descender-hangers 카테고리인 경우, getAllProducts에서 이미 showInProductList:false가 필터링되었으므로
    // G-prodigious 제품들만 남게 됨 (descender-hanger-summary가 showInProductList:false라면)
    filteredProducts = allProds.filter(p => p.productCategoryId === categoryId);
  } else {
    filteredProducts = allProds.filter(product => product.productCategoryId === categoryId);
  }

  // sortOrder를 기준으로 정렬 (sortOrder가 없는 제품은 맨 뒤로)
  try {
    if (Array.isArray(filteredProducts) && filteredProducts.length > 0) {
      filteredProducts.sort((a, b) => {
        const aOrder = a.sortOrder ?? 999999;
        const bOrder = b.sortOrder ?? 999999;
        return aOrder - bOrder;
      });
    }
  } catch (sortError) {
    console.error('[findProductsByCategory] 정렬 중 오류:', sortError);
  }

  return filteredProducts;
}

// ID로 카테고리 이름 가져오기
export function getCategoryName(categoryId: string, locale: string = 'ko'): string {
  const category = (productsDataSource.categories || []).find(cat => cat.id === categoryId);
  if (!category) return '';

  switch (locale) {
    case 'en':
      return category.nameEn || '';
    case 'cn':
      return category.nameCn || category.nameEn || '';
    default:
      return category.nameKo || '';
  }
}

// Get related products for a given product
export function getRelatedProducts(productId: string, limit: number = 4): Product[] {
  const currentProduct = getProductById(productId);
  if (!currentProduct) return [];

  const allProds = getAllProducts(); // 필터링된 목록 사용

  // 같은 카테고리 제품들을 sortOrder로 정렬
  const sameCategory = allProds
    .filter(p => p.productCategoryId === currentProduct.productCategoryId && p.id !== productId)
    .sort((a, b) => {
      const aOrder = a.sortOrder ?? 999999;
      const bOrder = b.sortOrder ?? 999999;
      return aOrder - bOrder;
    })
    .slice(0, limit);

  if (sameCategory.length >= limit) {
    return sameCategory;
  }

  // 다른 카테고리 제품들도 sortOrder로 정렬
  const otherProducts = allProds
    .filter(p => p.productCategoryId !== currentProduct.productCategoryId && p.id !== productId)
    .sort((a, b) => {
      const aOrder = a.sortOrder ?? 999999;
      const bOrder = b.sortOrder ?? 999999;
      return aOrder - bOrder;
    })
    .slice(0, limit - sameCategory.length);

  return [...sameCategory, ...otherProducts];
} 