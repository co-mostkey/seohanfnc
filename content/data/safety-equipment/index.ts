/**
 * 안전장비 제품 데이터 관리 모듈
 * 
 * 안전장비 관련 제품의 상세 정보, 기술 사양, 관련 문서 등을 관리합니다.
 * 각 제품별 데이터는 별도 파일로 분리하여 유지보수성을 높였습니다.
 */

// 각 안전장비 제품 데이터 가져오기
import cylinderTypeSafetyMat from './cylinder-type-safety-mat';
import fanTypeAirSafetyMat from './fan-type-air-safety-mat';
import lifesavingMat from './lifesaving-mat';
import trainingAirMattress from './training-air-mattress';

// 모든 안전장비 제품 데이터 통합
export const safetyEquipmentProducts = [
  cylinderTypeSafetyMat,
  fanTypeAirSafetyMat,
  lifesavingMat,
  trainingAirMattress
];

/**
 * ID로 안전장비 제품 정보 조회
 * @param id 제품 ID
 * @returns 제품 정보 객체 또는 undefined
 */
export function getSafetyEquipmentById(id: string) {
  return safetyEquipmentProducts.find(product => product.id === id);
}

/**
 * 모든 안전장비 제품 정보 가져오기
 * @returns 모든 안전장비 제품 배열
 */
export function getAllSafetyEquipment() {
  return safetyEquipmentProducts;
}

export default {
  getSafetyEquipmentById,
  getAllSafetyEquipment,
  safetyEquipmentProducts
};
