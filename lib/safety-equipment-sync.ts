import fs from 'fs/promises';
import path from 'path';
import { Product } from '@/types/product';
import { SafetyEquipment } from '@/types/b-type';

const SAFETY_EQUIPMENT_DIR = path.join(process.cwd(), 'content', 'data', 'b-type');

/**
 * Product 데이터를 SafetyEquipment TypeScript 파일로 변환하여 저장
 */
export async function syncProductToSafetyEquipment(product: Product): Promise<void> {
    // b-type 카테고리가 아니면 무시
    if (product.category !== 'b-type' && product.categoryId !== 'b-type') {
        return;
    }

    // 파일명 생성 (예: Fan-Type-Air-Safety-Mat -> fan-type-air-safety-mat.ts)
    const fileName = product.id.toLowerCase().replace(/_/g, '-') + '.ts';
    const filePath = path.join(SAFETY_EQUIPMENT_DIR, fileName);

    // 기존 파일이 있는지 확인
    try {
        await fs.access(filePath);
    } catch {
        // 파일이 없으면 무시 (새로운 b-type 파일은 생성하지 않음)
        console.log(`[b-type Sync] File not found: ${fileName}, skipping...`);
        return;
    }

    // TypeScript 파일 내용 생성
    const tsContent = generateSafetyEquipmentTS(product);

    // 파일 저장
    await fs.writeFile(filePath, tsContent, 'utf-8');
    console.log(`[b-type Sync] Updated: ${fileName}`);
}

/**
 * Product 데이터를 SafetyEquipment TypeScript 코드로 변환
 */
function generateSafetyEquipmentTS(product: Product): string {
    // 기본값 설정
    const nameKo = product.nameKo || product.name || '';
    const nameEn = product.nameEn || product.name || '';
    const description = product.descriptionKo || product.description || '';
    const slug = product.id.toLowerCase().replace(/_/g, '-');

    // specifications 변환
    const specifications: Record<string, string> = {};
    if (product.specifications) {
        if (Array.isArray(product.specifications)) {
            // 배열 형태인 경우
            product.specifications.forEach((spec: any) => {
                if (spec.key && spec.value) {
                    specifications[spec.key] = spec.value;
                }
            });
        } else if (typeof product.specifications === 'object') {
            // 객체 형태인 경우
            Object.assign(specifications, product.specifications);
        }
    }

    // features 변환
    const features = (product.features || []).map(feature => ({
        title: feature.title || '',
        description: feature.description || '',
        icon: feature.icon || 'Info'
    }));

    // documents 변환
    const documents = (product.documents || []).map(doc => ({
        id: doc.id || '',
        nameKo: doc.nameKo || doc.name || '',
        nameEn: doc.nameEn || doc.name || '',
        type: doc.type || 'other',
        filePath: doc.path || doc.url || ''
    }));

    // 이미지 배열 생성
    const images: string[] = [];
    if (product.image) {
        images.push(product.image);
    }
    if (product.gallery_images_data) {
        product.gallery_images_data.forEach(img => {
            if (img.src) images.push(img.src);
        });
    }

    // 3D 모델 경로
    const modelPath = product.modelFile || `/models/products/${product.id}/${product.id}.glb`;

    // TypeScript 코드 생성
    return `/**
 * ${nameKo} 상세 정보
 * 
 * 제품의 기본 정보, 기술 사양, 특징, 관련 문서 등의 정보를 포함합니다.
 */

import { SafetyEquipment } from '../../../types/b-type';

const ${toCamelCase(product.id)}: SafetyEquipment = {
  id: '${product.id}',
  nameKo: '${escapeString(nameKo)}',
  nameEn: '${escapeString(nameEn)}',
  slug: '${slug}',
  description: '${escapeString(description)}',

  // 제품 이미지 경로
  thumbnail: '${product.image || `/images/products/${product.id}/thumbnail.jpg`}',
  images: ${JSON.stringify(images, null, 4).replace(/"/g, "'")},

  // 3D 모델 정보
  modelPath: '${modelPath}',

  // 제품 사양
  specifications: ${JSON.stringify(specifications, null, 4).replace(/"/g, "'")},

  // 주요 특징
  features: ${JSON.stringify(features, null, 4).replace(/"/g, "'")},

  // 관련 문서
  documents: ${JSON.stringify(documents, null, 4).replace(/"/g, "'")},

  // 카테고리 및 태그
  category: 'b-type',
  tags: ${JSON.stringify(product.tags || [], null, 4).replace(/"/g, "'")},

  // 추가 정보
  additionalInfo: {
    manufacturer: '서한에프앤씨',
    warranty: '2년 제한 보증',
    installation: '전문 설치 권장',
    maintenanceCycle: '3개월마다 정기 점검 권장',
    powerRequirement: 'AC 220V, 60Hz',
    certification: 'KFI 인증'
  }
};

export default ${toCamelCase(product.id)};
`;
}

/**
 * 문자열을 camelCase로 변환
 */
function toCamelCase(str: string): string {
    return str
        .split(/[-_]/)
        .map((word, index) => {
            if (index === 0) {
                return word.toLowerCase();
            }
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        })
        .join('');
}

/**
 * 문자열 이스케이프 처리
 */
function escapeString(str: string): string {
    return str
        .replace(/\\/g, '\\\\')
        .replace(/'/g, "\\'")
        .replace(/"/g, '\\"')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r');
} 