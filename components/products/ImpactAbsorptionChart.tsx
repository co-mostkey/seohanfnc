'use client';

import Image from 'next/image';

interface ChartDataItem {
    name?: string | null;
    percentage?: number | null;
    color?: string | null;
}

// 보다 구체적인 타입 정의
interface TestResultItem {
    name?: string;
    voltage?: string;
    gForce?: string;
    chartImage?: string;
}

interface TestInfo {
    standard?: string;
    reference?: string;
    testSubject?: string;
    testDate?: string;
    testDummy?: string;
    testHeight?: string;
    note?: string;
    conversion?: string;
}

interface ComparisonChart {
    title?: string | null;
    data?: ChartDataItem[] | null;
    comparisonImages?: {
        groundImpact?: string | null;
        airMatImpact?: string | null;
    } | null;
}

interface ImpactAbsorptionData {
    title?: string | null;
    comparisonChart?: ComparisonChart | null;
    testInfo?: TestInfo | null;
    testResults?: TestResultItem[] | null;
    analysis?: string[] | null;
}

interface ImpactAbsorptionChartProps {
    data: ImpactAbsorptionData;
}

const Bar = ({ percentage, color }: { percentage: number; color: string; }) => (
    <div className="flex flex-col items-center w-full max-w-[60px]">
        <div className="flex items-end justify-center w-full h-64">
            <div
                className="w-full rounded-t-sm relative overflow-hidden"
                style={{ height: `${percentage}%`, backgroundColor: color }}
            >
                <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
            </div>
        </div>
    </div>
);

export const ImpactAbsorptionChart = ({ data }: ImpactAbsorptionChartProps) => {
    if (!data) return null;

    const {
        title: mainTitle,
        testInfo,
        testResults,
        comparisonChart,
        analysis
    } = data;

    const chartTitle = comparisonChart?.title;
    const chartData = comparisonChart?.data;
    const comparisonImages = comparisonChart?.comparisonImages;

    if (!chartData || chartData.length === 0) return null;

    const legendItems = Array.from(new Set(chartData.map((d: ChartDataItem) => d.color).filter((c): c is string => !!c)));

    return (
        <div className="mt-12 bg-gray-800/30 rounded-xl p-6 border border-red-900/30">
            <h3 className="text-lg font-semibold mb-4 text-red-400">{mainTitle || '피난안전장비 충격흡수 비교 데이터'}</h3>

            <div className="space-y-6">
                {/* 시험 배경 정보 */}
                {testInfo && (
                    <div className="bg-gray-800/40 rounded-lg p-4 border border-gray-700/30">
                        <h4 className="font-medium text-white mb-3 text-sm">{testInfo.standard || '충격흡수 비교 데이터 (DIN-14151-3)'}</h4>
                        <div className="space-y-2 text-sm text-gray-300">
                            <p>관련근거 : {testInfo.reference || '독일 구조용 에어매트 기준 (DIN-14151-3)'}</p>
                            <p>시험비교대상 : {testInfo.testSubject || '공기안전매트(5층형)'}</p>
                            <p>시험일자 : {testInfo.testDate || '2017년 5월 18일'}</p>
                            <p>사용더미 : {testInfo.testDummy || '75kg (DIN 14151-3 기준)'}</p>
                            <p>시험높이 : {testInfo.testHeight || '16 (m) 시험법 (DIN 14151-3 기준)'}</p>
                            <p className="text-amber-400/90">{testInfo.note || '본 시험은 독일 DIN 14151-3의 기준에 의한 낙하 충격흡수량(충격가속도의 배수[g]로 표기) 단위 (g)'}</p>
                            <p>{testInfo.reference || '1g : 9.81 m/s2 기준으로서 시험하였으며, 일반 충격량의 단위 (kg⋅m/s)와는 상이함을 알려드립니다.'}</p>
                            <p>※ 충격흡수량 환산 : {testInfo.conversion || '0.01 (V)=1 (g) [사용센서 : SAE-J211준용 센서]'}</p>
                        </div>
                    </div>
                )}

                {/* 파형 그래프 */}
                {(comparisonImages?.groundImpact || (testResults && testResults.length > 0)) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gray-800/40 rounded-lg p-4 border border-gray-700/30 flex flex-col">
                            <h5 className="text-sm font-medium text-white mb-2">{testResults?.[0]?.name || '지면 충돌시'}</h5>
                            <div className="relative h-64 flex-grow bg-gray-900/50 rounded overflow-hidden">
                                <Image
                                    src={comparisonImages?.groundImpact || testResults?.[0]?.chartImage || ''}
                                    alt="지면 충돌시 충격흡수력 그래프"
                                    fill
                                    className="object-contain p-2"
                                />
                            </div>
                            <p className="text-center text-amber-400 text-sm mt-2 font-medium">충격흡수량 : {testResults?.[0]?.voltage} = {testResults?.[0]?.gForce}</p>
                        </div>
                        <div className="bg-gray-800/40 rounded-lg p-4 border border-gray-700/30 flex flex-col">
                            <h5 className="text-sm font-medium text-white mb-2">{testResults?.[1]?.name || '공기안전매트'}</h5>
                            <div className="relative h-64 flex-grow bg-gray-900/50 rounded overflow-hidden">
                                <Image
                                    src={comparisonImages?.airMatImpact || testResults?.[1]?.chartImage || ''}
                                    alt="공기안전매트 충격흡수력 그래프"
                                    fill
                                    className="object-contain p-2"
                                />
                            </div>
                            <p className="text-center text-green-400 text-sm mt-2 font-medium">충격흡수량 : {testResults?.[1]?.voltage} = {testResults?.[1]?.gForce}</p>
                        </div>
                    </div>
                )}

                {/* 충격흡수량 비교 차트 */}
                <div className="bg-gray-800/40 rounded-lg p-5 border border-gray-700/30">
                    <h5 className="text-sm font-medium text-white mb-4">{chartTitle || '충격흡수량 비교 그래프'}</h5>
                    <div className="relative">
                        <div className="h-72 w-full bg-gray-900/30 rounded-lg p-4">
                            <div className="flex h-full">
                                {/* Y축 */}
                                <div className="flex flex-col justify-between pr-2 text-xs text-gray-400">
                                    {[100, 80, 60, 40, 20, 0].map(v => <span key={v}>{v.toFixed(1)}%</span>)}
                                </div>
                                <div className="flex-1 relative">
                                    {/* 차트 영역 */}
                                    <div className="absolute inset-0 border-l border-b border-gray-600/50" style={{ left: '-1px', bottom: '0px', top: '-1px' }}></div>
                                    {[20, 40, 60, 80].map(v =>
                                        <div key={v} className="absolute left-0 right-0 h-px bg-gray-600/30" style={{ bottom: `${v}%` }}></div>
                                    )}
                                    {/* 데이터 바 */}
                                    <div className="absolute bottom-0 flex justify-around items-end w-full h-full px-2">
                                        {chartData.map((item: ChartDataItem, index: number) => (
                                            <Bar
                                                key={index}
                                                percentage={item.percentage || 0}
                                                color={item.color || '#ccc'}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* 레전드 */}
                        {legendItems.length > 0 && (
                            <div className="mt-3 flex justify-center flex-wrap gap-2">
                                {legendItems.map((color: string, index: number) => (
                                    <div key={index} className="flex items-center px-3 py-1.5 bg-gray-800/40 rounded-full border border-gray-700/30">
                                        <span className="w-3 h-3 rounded-sm mr-1.5" style={{ backgroundColor: color }}></span>
                                        <span className="text-xs text-gray-300">
                                            {chartData?.find((d: ChartDataItem) => d.color === color)?.name || '데이터'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* 분석 결과 */}
                {analysis && analysis.length > 0 && (
                    <div className="mt-4 p-3 bg-red-900/20 rounded-md border border-red-900/30 text-sm">
                        <p className="text-white font-medium mb-2">※ 분석결과</p>
                        <ul className="text-gray-300 space-y-1.5 text-sm">
                            {analysis.map((item: string, index: number) => (
                                <li key={index} className="flex">
                                    <span className="text-amber-400 mr-1.5">•</span>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}; 