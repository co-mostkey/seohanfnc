import React from 'react';
import { type CompanyInfo } from '@/types/company';
import { type PromotionItem } from '@/types/promotion';
import { type DeliveryRecord } from '@/types/promotion';
import HomeClient from '@/components/home/HomeClient';

// 서버에서 데이터 가져오기
async function getServerData() {
  try {
    // 서버사이드에서는 초기 데이터를 가져오지 않고 클라이언트에서 처리
    // 이렇게 하면 activeSection과 동적 로딩이 더 안정적으로 작동
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
