import React from 'react';
import { type CompanyInfo } from '@/types/company';
import { type PromotionItem } from '@/types/promotion';
import { type DeliveryRecord } from '@/types/promotion';
import HomeClient from '@/components/home/HomeClient';

// 서버에서 데이터 가져오기
async function getServerData() {
  try {
    // 기본 데이터 구조 반환 (서버에서는 실제 API 호출 대신 기본값 사용)
    return {
      companyData: null,
      promotionsData: [],
      deliveryData: []
    };
  } catch (error) {
    console.error('서버 데이터 가져오기 실패:', error);
    return {
      companyData: null,
      promotionsData: [],
      deliveryData: []
    };
  }
}

export default async function Home() {
  const { companyData, promotionsData, deliveryData } = await getServerData();

  return (
    <HomeClient
      initialCompanyData={companyData}
      initialPromotionsData={promotionsData}
      initialDeliveryData={deliveryData}
    />
  );
}
