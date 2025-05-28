/**
 * 안전장비 제품 정보 관리 유틸리티
 * 
 * 안전장비 제품 데이터를 쉽게 조회하고 관리하기 위한 API 함수를 제공합니다.
 */

import { SafetyEquipment } from '@/types/safety-equipment';
import { safetyEquipmentProducts, getSafetyEquipmentById } from '@/content/data/safety-equipment';

/**
 * 특정 제품의 사양 정보를 객체로 반환
 * @param id 제품 ID
 * @returns 제품 사양 객체 또는 빈 객체
 */
export function getProductSpecifications(id: string): Record<string, string> {
  const product = getSafetyEquipmentById(id);
  return product?.specifications || {};
}

/**
 * 특정 제품의 문서 목록 반환
 * @param id 제품 ID
 * @returns 제품 관련 문서 배열
 */
export function getProductDocuments(id: string) {
  const product = getSafetyEquipmentById(id);
  return product?.documents || [];
}

/**
 * 특정 제품의 주요 특징 목록 반환
 * @param id 제품 ID 
 * @returns 제품 특징 배열
 */
export function getProductFeatures(id: string) {
  const product = getSafetyEquipmentById(id);
  return product?.features || [];
}

/**
 * 특정 카테고리의 안전장비 제품 목록 반환
 * @param category 제품 카테고리
 * @returns 해당 카테고리의 제품 배열
 */
export function getProductsByCategory(category: string): SafetyEquipment[] {
  return safetyEquipmentProducts.filter(product => product.category === category);
}

/**
 * 특정 제품과 관련된 (동일 카테고리) 다른 제품 반환
 * @param id 현재 제품 ID
 * @param limit 반환할 최대 제품 수
 * @returns 관련 제품 배열
 */
export function getRelatedProducts(id: string, limit: number = 3): SafetyEquipment[] {
  const currentProduct = getSafetyEquipmentById(id);
  if (!currentProduct) return [];
  
  return safetyEquipmentProducts
    .filter(product => 
      product.id !== id && product.category === currentProduct.category
    )
    .slice(0, limit);
}

/**
 * 특정 태그를 포함하는 제품 목록 반환
 * @param tag 검색할 태그
 * @returns 해당 태그를 가진 제품 배열
 */
export function getProductsByTag(tag: string): SafetyEquipment[] {
  return safetyEquipmentProducts.filter(product => 
    product.tags.includes(tag)
  );
}

export default {
  getProductSpecifications,
  getProductDocuments,
  getProductFeatures,
  getProductsByCategory,
  getRelatedProducts,
  getProductsByTag
};
