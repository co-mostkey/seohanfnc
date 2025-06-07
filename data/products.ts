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

// [TRISID] 제품 데이터 로드 함수 - 단일 products.json만 사용, 중복 id 자동 제거, 기본형 제품 보호
function loadProductsData(): ProductsData {
  try {
    // 실제 서비스에서 사용하는 단일 경로만 참조
    const mainJsonPath = path.join(process.cwd(), 'content', 'data', 'products', 'products.json');
    let mainData: ProductsData = { categories: [] };

    if (fs.existsSync(mainJsonPath)) {
      const rawMain = fs.readFileSync(mainJsonPath, 'utf-8');
      if (rawMain && rawMain.trim() !== '') {
        mainData = JSON.parse(rawMain) as ProductsData;
      } else {
        console.warn('[data/products.ts] products.json 파일이 비어있습니다.');
      }
    } else {
      console.warn('[data/products.ts] products.json 파일이 존재하지 않습니다.');
    }

    // [TRISID] 중복 id 자동 제거 (최신 데이터 우선)
    // 1. 모든 제품을 단일 배열로 추출 (카테고리 정보 포함)
    const allProducts: Product[] = [];
    const categoryMap = new Map<string, { id: string; nameKo?: string; nameEn?: string; nameCn?: string; products: Product[] }>();
    for (const cat of mainData.categories) {
      if (!cat || !Array.isArray(cat.products)) continue;
      for (const p of cat.products) {
        if (p && typeof p.id === 'string') {
          allProducts.push({ ...p, productCategoryId: cat.id });
        }
      }
      // 카테고리 정보 저장 (제품은 나중에 다시 할당)
      categoryMap.set(cat.id, { ...cat, products: [] });
    }
    // 2. id 기준으로 최신 데이터만 남기기
    const uniqueProductsMap = new Map<string, Product>();
    for (const p of allProducts) {
      uniqueProductsMap.set(p.id, p); // 뒤에 있는(최신) 데이터가 남음
    }
    // 3. 카테고리별로 다시 묶기
    for (const product of uniqueProductsMap.values()) {
      const cat = categoryMap.get(product.productCategoryId || product.category);
      if (cat) {
        cat.products.push(product);
      }
    }
    // 4. 최종 카테고리 배열 생성 (기본형 제품 포함, 순서 보존)
    const uniqueCategories = Array.from(categoryMap.values());
    const mergedData = { categories: uniqueCategories };
    return mergedData;
  } catch (err) {
    console.error('[data/products.ts] products.json 로드 실패:', err);
    // 오류 발생 시 기본 데이터 반환 (기본형 제품만)
    return {
      categories: [
        {
          id: 'b-type',
          nameKo: '안전장비',
          nameEn: 'Safety Equipment',
          products: [
            {
              id: 'Cylinder-Type-SafetyAirMat',
              nameKo: '실린더형 공기안전매트',
              name: 'Cylinder Type Safety Air Mat',
              category: 'b-type',
              productCategoryId: 'b-type',
              showInProductList: true,
              description: '실린더형 공기안전매트입니다.',
              image: '/images/products/Cylinder-Type-SafetyAirMat.jpg'
            },
            {
              id: 'test-b-type-advanced',
              nameKo: '테스트 B타입 고급 제품',
              name: 'Test B-Type Advanced Product',
              category: 'b-type',
              productCategoryId: 'b-type',
              showInProductList: true,
              description: 'A타입 수준 디자인과 3D 모델링이 통합된 고급 B타입 제품입니다.',
              descriptionKo: 'A타입 수준 디자인과 3D 모델링이 통합된 고급 B타입 제품입니다.',
              image: '/images/products/test-b-type-advanced/thumbnail.jpg',
              pageBackgroundImage: '/images/products/test-b-type-advanced/main/visual.jpg',
              features: [
                { title: "고급 디자인", description: "A타입 수준의 세련된 인터페이스와 애니메이션" },
                { title: "3D 모델링", description: "실시간 3D 모델 뷰어로 제품을 360도 확인" },
                { title: "스크롤 네비게이션", description: "부드러운 스크롤 기반 섹션 네비게이션" },
                { title: "고급 갤러리", description: "이미지와 비디오를 분리한 탭형 갤러리" }
              ],
              model3D: {
                glbFile: '/models/products/test-b-type-advanced/test-b-type-advanced.glb',
                scale: 1.0,
                position: [0, 0, 0],
                rotation: [0, 0, 0]
              },
              specTable: [
                { title: "제품명", value: "테스트 B타입 고급 제품" },
                { title: "타입", value: "B타입 (고급 버전)" },
                { title: "디자인 수준", value: "A타입 수준 (5성급)" },
                { title: "3D 모델링", value: "지원" },
                { title: "개발 상태", value: "완료" }
              ],
              certifications: [
                { description: "테스트-승인-2024-001" }
              ],
              cautions: [
                "이 제품은 새로운 B타입 고급 템플릿 테스트용입니다.",
                "실제 제품이 아닌 시스템 검증 목적으로 생성되었습니다.",
                "모든 기능이 정상 작동하는지 확인 후 실제 제품에 적용하세요."
              ],
              gallery_images_data: [
                {
                  id: "test-b-1",
                  type: "image",
                  src: "/images/products/test-b-type-advanced/gallery/image1.jpg",
                  alt: "테스트 B타입 이미지 1"
                },
                {
                  id: "test-b-2",
                  type: "image",
                  src: "/images/products/test-b-type-advanced/gallery/image2.jpg",
                  alt: "테스트 B타입 이미지 2"
                }
              ],
              videos: [
                {
                  type: "video",
                  id: "test-video-1",
                  src: "/videos/products/test-b-type-advanced/demo.mp4",
                  alt: "테스트 B타입 데모 영상"
                }
              ],
              documents: [
                {
                  id: "test-doc-1",
                  nameKo: "테스트 B타입 카탈로그",
                  name: "Test B-Type Catalog",
                  path: "/documents/test-b-type-advanced-catalog.pdf",
                  url: "/documents/test-b-type-advanced-catalog.pdf",
                  type: "pdf"
                }
              ]
            }
          ]
        }
      ]
    };
  }
}

// [TRISID] 성능 최적화: 파일 감시 완전 제거
// Next.js 자체 Hot Reload에 의존하여 중복 감시 제거
let productsDataSource: ProductsData = loadProductsData();

// 모든 제품을 단일 배열로 추출 (showInProductList 및 isPublished 필터링 적용)
export function getAllProducts(options?: { includeUnpublished?: boolean }): Product[] {
  try {
    // [TRISID] 성능 최적화: 메모리 캐싱 활용
    // Next.js Hot Reload 시에만 데이터가 자동으로 새로 로드됨

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

    // [TRISID] B 타입 4개를 제외한 b-type 카테고리 제품은 A 타입으로 분류
    const bTypeIds = new Set([
      'Cylinder-Type-SafetyAirMat',
      'Fan-Type-Air-Safety-Mat',
      'Training-Air-Mattress-Fall-Prevention-Mat',
      'Lifesaving-Mat',
    ]);
    filteredList = filteredList.map(p => {
      if (p.productCategoryId === 'b-type') {
        (p as any).productStyle = bTypeIds.has(p.id) ? 'B' : 'A';
      }
      return p;
    });

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

// ID로 제품 검색 (getProductById 호출) - 빌드 오류 해결을 위해 복원
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