'use client';

import Image from 'next/image';

interface ProductTestDataProps {
  productId: string;
}

/**
 * 실린더식 공기안전매트용 충격흡수 비교 데이터를 표시하는 컴포넌트
 * 충격흡수 테스트 결과와 비교 차트를 표시합니다.
 */
const ProductTestData = ({ productId }: ProductTestDataProps) => {
  // 실린더식 공기안전매트인 경우에만 데이터 표시
  if (productId !== 'Cylinder-Type-SafetyAirMat') {
    return null;
  }

  return (
    <div className="mt-8 bg-gray-800/30 rounded-xl p-6 border border-red-900/30">
      <h3 className="text-lg font-semibold mb-4 text-red-400">피난안전장비 충격흡수 비교 데이터</h3>

      <div className="space-y-6">
        {/* 시험 배경 정보 */}
        <div className="bg-gray-800/40 rounded-lg p-4 border border-gray-700/30">
          <h4 className="font-medium text-white mb-3 text-sm">충격흡수 비교 데이터 (DIN-14151-3)</h4>
          <div className="space-y-2 text-sm text-gray-300">
            <p>관련근거 : 독일 구조용 에어매트 기준 (DIN-14151-3)</p>
            <p>시험비교대상 : 공기안전매트(5층형)</p>
            <p>시험일자 : 2017년 5월 18일</p>
            <p>사용더미 : 75kg (DIN 14151-3 기준)</p>
            <p>시험높이 : 16 (m) 시험법 (DIN 14151-3 기준)</p>
            <p className="text-amber-400/90">본 시험은 독일 DIN 14151-3의 기준에 의한 낙하 충격흡수량(충격가속도의 배수[g]로 표기) 단위 (g)</p>
            <p>1g : 9.81 m/s<sup>2</sup> 기준으로서 시험하였으며, 일반 충격량의 단위 (kg⋅m/s)와는 상이함을 알려드립니다.</p>
            <p>※ 충격흡수량 환산 : 0.01 (V)=1 (g) [사용센서 : SAE-J211준용 센서]</p>
          </div>
        </div>

        {/* 파형 그래프 비교 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 지면 충돌시 파형 그래프 */}
          <div className="bg-gray-800/40 rounded-lg p-4 border border-gray-700/30 flex flex-col">
            <h5 className="text-sm font-medium text-white mb-2">지면 충돌시</h5>
            <div className="relative h-64 flex-grow bg-gray-900/50 rounded overflow-hidden">
              <Image 
                src="/images/products/Cylinder-Type-SafetyAirMat/data/Cylinder-Type-SafetyAirMat-test1.jpg"
                alt="지면 충돌시 충격흡수력 그래프"
                fill
                className="object-contain p-2"
              />
            </div>
            <p className="text-center text-amber-400 text-sm mt-2 font-medium">충격흡수량 : 33.620 (V) = 3,362 (g)</p>
          </div>
          
          {/* 공기안전매트 파형 그래프 */}
          <div className="bg-gray-800/40 rounded-lg p-4 border border-gray-700/30 flex flex-col">
            <h5 className="text-sm font-medium text-white mb-2">공기안전매트</h5>
            <div className="relative h-64 flex-grow bg-gray-900/50 rounded overflow-hidden">
              <Image 
                src="/images/products/Cylinder-Type-SafetyAirMat/data/Cylinder-Type-SafetyAirMat-test2.jpg" 
                alt="공기안전매트 충격흡수력 그래프"
                fill
                className="object-contain p-2"
              />
            </div>
            <p className="text-center text-green-400 text-sm mt-2 font-medium">충격흡수량 : 220 (mV) = 22 (g)</p>
          </div>
        </div>

        {/* 충격흡수량 비교 차트 */}
        <div className="bg-gray-800/40 rounded-lg p-5 border border-gray-700/30">
          <h5 className="text-sm font-medium text-white mb-4">충격흡수량 비교 그래프</h5>
          
          <div className="relative">
            <div className="h-72 w-full bg-gray-900/30 rounded-lg p-4">
              <div className="flex h-full">
                {/* Y축 */}
                <div className="flex flex-col justify-between pr-2 text-xs text-gray-400">
                  <span>100.0%</span>
                  <span>80.0%</span>
                  <span>60.0%</span>
                  <span>40.0%</span>
                  <span>20.0%</span>
                  <span>0.0%</span>
                </div>
                
                {/* 차트 영역 */}
                <div className="flex-1">
                  <div className="flex h-full">
                    {/* 차트 보더라인 */}
                    <div className="absolute left-12 top-4 right-4 bottom-8 border-l border-b border-gray-600/50"></div>
                    
                    {/* 가로 구분선 */}
                    <div className="absolute left-12 right-4 h-px bg-gray-600/30" style={{ top: 'calc(20% + 4px)' }}></div>
                    <div className="absolute left-12 right-4 h-px bg-gray-600/30" style={{ top: 'calc(40% + 4px)' }}></div>
                    <div className="absolute left-12 right-4 h-px bg-gray-600/30" style={{ top: 'calc(60% + 4px)' }}></div>
                    <div className="absolute left-12 right-4 h-px bg-gray-600/30" style={{ top: 'calc(80% + 4px)' }}></div>
                    

                    {/* 데이터 바 */}
                    <div className="absolute bottom-8 flex justify-around w-full left-12 right-4">
                      <div className="flex flex-col items-center">
                        <div className="flex items-end justify-center w-12 h-64">
                          <div className="w-full bg-gradient-to-t from-red-500/80 to-red-500/60 rounded-t-sm h-full">
                            <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
                          </div>
                        </div>
                        <span className="text-xs text-gray-300 mt-2">지면</span>
                        <span className="text-[10px] text-red-400">100%</span>
                      </div>
                      
                      <div className="flex flex-col items-center">
                        <div className="flex items-end justify-center w-12 h-64">
                          <div className="w-full bg-gradient-to-t from-red-500/80 to-red-500/60 rounded-t-sm h-[32%]">
                            <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
                          </div>
                        </div>
                        <span className="text-xs text-gray-300 mt-2">스펀지</span>
                        <span className="text-[10px] text-red-400"></span>
                      </div>
                      
                      <div className="flex flex-col items-center">
                        <div className="flex items-end justify-center w-12 h-64">
                          <div className="w-full bg-gradient-to-t from-red-500/80 to-red-500/60 rounded-t-sm h-[1.2%]">
                            <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
                          </div>
                        </div>
                        <span className="text-xs text-gray-300 mt-2">인명구조매트</span>
                        <span className="text-[10px] text-red-400"></span>
                      </div>
                      
                      <div className="flex flex-col items-center">
                        <div className="flex items-end justify-center w-12 h-64">
                          <div className="w-full bg-gradient-to-t from-green-500/80 to-green-400/60 rounded-t-sm h-[0.6%]">
                            <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
                          </div>
                        </div>
                        <span className="text-xs text-gray-300 mt-2">공기안전매트</span>
                        <span className="text-[10px] text-green-400">0.6%</span>
                      </div>
                    </div>
                    

                  </div>
                </div>
              </div>
            </div>
            
            {/* 레전드 */}
            <div className="mt-3 flex justify-center">
              <div className="flex items-center px-3 py-1.5 bg-gray-800/40 rounded-full border border-gray-700/30">
                <span className="w-3 h-3 bg-red-500/80 rounded-sm mr-1.5"></span>
                <span className="text-xs text-gray-300">충격흡수량</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductTestData;
