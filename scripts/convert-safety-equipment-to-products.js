/**
 * 안전장비 그룹의 에어매트 제품들을 Product 형식으로 변환하여 교체하는 스크립트
 * 
 * 주의사항:
 * - 기존 제품 ID 유지
 * - 카테고리 연결 보존
 * - SEO 데이터 보존
 * - 관련 제품 연결 유지
 */

const fs = require('fs');
const path = require('path');

// 안전장비 데이터 로드 함수
function loadSafetyEquipmentData() {
    const safetyEquipmentDir = path.join(__dirname, '../content/data/b-type');

    const cylinderData = require(path.join(safetyEquipmentDir, 'cylinder-type-safety-mat.ts'));
    const fanData = require(path.join(safetyEquipmentDir, 'fan-type-air-safety-mat.ts'));
    const trainingData = require(path.join(safetyEquipmentDir, 'training-air-mattress.ts'));
    const lifesavingData = require(path.join(safetyEquipmentDir, 'lifesaving-mat.ts'));

    return {
        'Cylinder-Type-SafetyAirMat': cylinderData.default,
        'Fan-Type-Air-Safety-Mat': fanData.default,
        'Training-Air-Mattress-Fall-Prevention-Mat': trainingData.default,
        'Lifesaving-Mat': lifesavingData.default
    };
}

// SafetyEquipment를 Product 형식으로 변환
function convertSafetyEquipmentToProduct(safetyEquipment, existingProduct) {
    return {
        // 기본 정보 (기존 유지)
        id: existingProduct.id,
        nameKo: safetyEquipment.nameKo,
        nameEn: safetyEquipment.nameEn,
        nameCn: existingProduct.nameCn || '',
        isPublished: existingProduct.isPublished,
        category: existingProduct.category || 'b-type',

        // 설명
        descriptionKo: safetyEquipment.description,
        descriptionEn: safetyEquipment.description,
        descriptionCn: existingProduct.descriptionCn || '',

        // 이미지
        image: safetyEquipment.thumbnail,

        // 긴 설명 (기존 유지하되 업데이트)
        longDescription: existingProduct.longDescription || `<p>${safetyEquipment.description}</p>`,

        // 특징들을 Product 형식으로 변환
        features: safetyEquipment.features.map(feature => ({
            title: feature.title,
            description: feature.description
        })),

        // 사양을 Product 형식으로 변환
        specifications: safetyEquipment.specifications,

        // B타입 전용 필드들 추가
        modelName: safetyEquipment.specifications['모델'] || '',
        modelNumber: safetyEquipment.specifications['제품승인번호'] || safetyEquipment.specifications['승인번호'] || '',
        modelImage: safetyEquipment.images && safetyEquipment.images[0] ? safetyEquipment.images[0] : safetyEquipment.thumbnail,
        modelFile: safetyEquipment.modelPath || '',
        modelStyle: 'modern',
        series: safetyEquipment.specifications['모델'] || '',
        approvalNumber: safetyEquipment.specifications['제품승인번호'] || safetyEquipment.specifications['승인번호'] || '',
        applicableHeight: safetyEquipment.specifications['적용 높이'] || safetyEquipment.specifications['적용높이'] || '',

        // 기술 데이터 (B타입 전용)
        technicalData: Object.entries(safetyEquipment.specifications).map(([key, value]) => ({
            key,
            value: String(value)
        })),

        // 인증 및 특징 (B타입 전용)
        certificationsAndFeatures: [
            {
                title: '제품 인증',
                description: safetyEquipment.specifications['제품승인번호'] || safetyEquipment.specifications['승인번호'] || '한국소방산업기술원 승인'
            },
            {
                title: '품질 보증',
                description: safetyEquipment.additionalInfo?.warranty || '제조사 품질보증'
            },
            {
                title: '사용 환경',
                description: safetyEquipment.specifications['사용 환경'] || '실내외 사용 가능'
            }
        ],

        // 문서들을 Product 형식으로 변환
        documents: safetyEquipment.documents.map(doc => ({
            id: doc.id,
            nameKo: doc.nameKo,
            nameEn: doc.nameEn,
            type: doc.type,
            url: doc.filePath || `/documents/${doc.id}.pdf`
        })),

        // 갤러리 이미지 데이터
        gallery_images_data: safetyEquipment.images ? safetyEquipment.images.map((img, index) => ({
            id: `gallery_${index + 1}`,
            src: img,
            alt: `${safetyEquipment.nameKo} 이미지 ${index + 1}`,
            type: 'image'
        })) : [],

        // 기존 필드들 유지
        tags: existingProduct.tags || safetyEquipment.tags || ['안전장비', '에어매트'],
        relatedProductIds: existingProduct.relatedProductIds || [],
        cautions: existingProduct.cautions || [
            '사용 전 반드시 제품 상태를 점검하세요.',
            '사용 설명서를 숙지한 후 사용하세요.',
            '정기적인 유지보수를 실시하세요.'
        ],

        // B타입 스타일 유지
        productStyle: 'B',

        // 페이지 설정 (기존 유지)
        showInProductList: existingProduct.showInProductList !== false,
        isSummaryPage: existingProduct.isSummaryPage || false,
        pageHeroTitle: existingProduct.pageHeroTitle || safetyEquipment.nameKo,
        pageHeroSubtitles: existingProduct.pageHeroSubtitles || [],
        pageBackgroundImage: existingProduct.pageBackgroundImage || '',
        seoStructuredData: existingProduct.seoStructuredData || ''
    };
}

// 메인 실행 함수
async function main() {
    try {
        console.log('🔄 안전장비 그룹 에어매트 제품 교체 작업 시작...\n');

        // 1. 현재 products.json 로드
        const productsPath = path.join(__dirname, '../content/data/products/products.json');
        const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

        console.log('📂 현재 제품 데이터 로드 완료');

        // 2. 안전장비 데이터 로드 (실제로는 직접 데이터를 정의해야 함 - TypeScript 파일이므로)
        const safetyEquipmentData = {
            'Cylinder-Type-SafetyAirMat': {
                id: 'Cylinder-Type-SafetyAirMat',
                nameKo: '실린더형 안전 에어매트',
                nameEn: 'Cylinder Type Safety Air Mat',
                description: '실린더형 공기안전매트는 고층 건물, 공사 현장 등에서 추락 사고 발생 시 충격을 완화하여 인명 피해를 최소화하는 장비입니다.',
                thumbnail: '/images/products/Cylinder-Type-SafetyAirMat/thumbnail.jpg',
                images: [
                    '/images/products/Cylinder-Type-SafetyAirMat/Cylinder-Type-SafetyAirMat02.jpg',
                    '/images/products/Cylinder-Type-SafetyAirMat/Cylinder-Type-SafetyAirMat-main-ex.png',
                    '/images/products/Cylinder-Type-SafetyAirMat/thumbnail.jpg',
                ],
                modelPath: '/models/products/Cylinder-Type-SafetyAirMat/Cylinder-Type-SafetyAirMat.glb',
                specifications: {
                    '모델': '10형, 20형, 30형',
                    '규격(m)': '5×5×2.5 / 5×7×3.5 / 5×10×3.5',
                    '제품승인번호': '공매 22-3',
                    '내충격성': 'KFI인정기준(공기안전매트의 성능인정 및 제품검사 기술기준) 적합',
                    '팽창시간': '약 90초 이내',
                    '충진방식': '자동 실린더 방식',
                    '적용 높이': '10~25m 이하',
                    '재질': '내구성 폴리에스테르 원단 (1500데니어)',
                    '무게': '45kg ~ 120kg (모델별 상이)',
                    '사용 환경': '-20℃ ~ 70℃',
                },
                features: [
                    {
                        title: '빠른 전개 방식',
                        description: '실린더 자동 충전 방식으로 약 90초 이내에 신속 전개 가능'
                    },
                    {
                        title: '내구성 있는 소재',
                        description: '고강도 폴리에스테르 원단으로 제작되어 내구성과 안전성이 우수'
                    },
                    {
                        title: '다양한 규격',
                        description: '건물 높이 및 설치 공간에 따라 다양한 규격 선택 가능'
                    },
                    {
                        title: '편리한 운반',
                        description: '접이식 구조로 운반 및 보관이 용이하며 재사용 가능'
                    },
                    {
                        title: '강화된 내충격성',
                        description: '소방청 안전기준에 적합한 내충격성으로 안전하게 추락 충격 흡수'
                    }
                ],
                documents: [
                    {
                        id: 'cylinder-safety-mat-manual',
                        nameKo: '사용자 매뉴얼',
                        nameEn: 'User Manual',
                        type: 'manual',
                        filePath: '/documents/b-type/cylinder-type-safety-mat-manual.pdf'
                    },
                    {
                        id: 'cylinder-safety-mat-certification',
                        nameKo: '제품 인증서',
                        nameEn: 'Product Certification',
                        type: 'certification',
                        filePath: '/documents/b-type/cylinder-type-safety-mat-certification.pdf'
                    }
                ],
                tags: ['안전매트', '추락방지', '구조장비', '소방장비'],
                additionalInfo: {
                    warranty: '3년 제한 보증'
                }
            },
            'Fan-Type-Air-Safety-Mat': {
                id: 'Fan-Type-Air-Safety-Mat',
                nameKo: '팬형 공기안전매트',
                nameEn: 'Fan Type Air Safety Mat',
                description: '팬형 공기안전매트는 전기 모터로 구동되는 송풍기를 통해 에어매트에 공기를 주입하여 사용하는 추락 안전장비입니다. 고층 건물 화재 및 재난 현장에서 효과적으로 활용됩니다.',
                thumbnail: '/images/products/Fan-Type-Air-Safety-Mat/thumbnail.jpg',
                images: [
                    '/images/products/Fan-Type-Air-Safety-Mat/Fan-Type-Air-Safety-Mat.png',
                    '/images/products/Fan-Type-Air-Safety-Mat/thumbnail.jpg',
                ],
                modelPath: '/models/products/Fan-Type-Air-Safety-Mat/Fan-Type-Air-Safety-Mat.glb',
                specifications: {
                    '모델': '5F 형, 10F 형, 15F 형, 20F 형',
                    '규격(m)': '3.5×3.5×1.5 / 4.5×4.5×2.0 / 5.5×5.5×2.5 / 6.5×6.5×3.0',
                    '제품승인번호': '공매 23-1',
                    '내충격성': 'KFI인정기준(공기안전매트의 성능인정 및 제품검사 기술기준) 적합',
                    '송풍기': '220V, 1.5HP ~ 2.5HP (모델별 상이)',
                    '팽창시간': '약 60~120초 (모델별 상이)',
                    '충진방식': '전기 모터 팬 방식',
                    '적용 높이': '5~20m 이하',
                    '재질': '내구성 폴리에스테르 원단 (1000데니어)',
                    '무게': '35kg ~ 90kg (모델별 상이)',
                    '사용 환경': '-20℃ ~ 70℃',
                },
                features: [
                    {
                        title: '안정적인 전력 사용',
                        description: '전기 모터 송풍기로 지속적인 공기 공급이 가능하여 장시간 사용에 유리'
                    },
                    {
                        title: '대형 크기 가능',
                        description: '다양한 규격으로 제작 가능하여 넓은 공간 커버 가능'
                    },
                    {
                        title: '간편한 유지보수',
                        description: '전기 모터 시스템으로 유지보수가 용이하고 반복 사용이 가능'
                    },
                    {
                        title: '견고한 내구성',
                        description: '고강도 폴리에스테르 원단으로 제작되어 장기간 사용이 가능'
                    },
                    {
                        title: '비상 백업 시스템',
                        description: '정전 시 비상 전원 연결이 가능한 시스템 장착'
                    }
                ],
                documents: [
                    {
                        id: 'fan-type-air-safety-mat-manual',
                        nameKo: '사용자 매뉴얼',
                        nameEn: 'User Manual',
                        type: 'manual',
                        filePath: '/documents/b-type/fan-type-air-safety-mat-manual.pdf'
                    },
                    {
                        id: 'fan-type-air-safety-mat-certification',
                        nameKo: '제품 인증서',
                        nameEn: 'Product Certification',
                        type: 'certification',
                        filePath: '/documents/b-type/fan-type-air-safety-mat-certification.pdf'
                    }
                ],
                tags: ['안전매트', '추락방지', '구조장비', '소방장비', '팬형'],
                additionalInfo: {
                    warranty: '2년 제한 보증'
                }
            },
            'Training-Air-Mattress-Fall-Prevention-Mat': {
                id: 'Training-Air-Mattress-Fall-Prevention-Mat',
                nameKo: '훈련용 에어매트리스 추락방지 매트',
                nameEn: 'Training Air Mattress Fall Prevention Mat',
                description: '훈련용 에어매트리스 추락방지 매트는 소방, 구조대, 군사 훈련 등 다양한 안전 훈련 환경에서 사용할 수 있는 특수 설계된 매트입니다. 반복적인 사용에도 내구성이 뛰어나며 효과적인 훈련을 지원합니다.',
                thumbnail: '/images/products/Training-Air-Mattress-Fall-Prevention-Mat/thumbnail.jpg',
                images: [
                    '/images/products/Training-Air-Mattress-Fall-Prevention-Mat/Training-Air-Mattress-Fall-Prevention-Mat.png',
                    '/images/products/Training-Air-Mattress-Fall-Prevention-Mat/thumbnail.jpg',
                ],
                modelPath: '/models/products/Training-Air-Mattress-Fall-Prevention-Mat/Training-Air-Mattress-Fall-Prevention-Mat.glb',
                specifications: {
                    '모델': 'TAM-100, TAM-200, TAM-300',
                    '규격(m)': '3×2×0.5 / 4×3×0.6 / 5×4×0.7',
                    '인증번호': '훈련장비 22-5',
                    '내구성': '10,000회 이상 반복 사용 가능',
                    '충격흡수력': '최대 120kg 충격 흡수',
                    '충진방식': '전기 송풍기 포함',
                    '팽창시간': '약 2분 이내',
                    '재질': '고강도 PVC 코팅 폴리에스테르 (2000데니어)',
                    '무게': '20kg ~ 45kg (모델별 상이)',
                    '사용 환경': '-10℃ ~ 60℃',
                },
                features: [
                    {
                        title: '뛰어난 내구성',
                        description: '최대 10,000회 이상의 반복 사용이 가능한 특수 소재 적용'
                    },
                    {
                        title: '간편한 세척',
                        description: '방수 처리된 표면으로 쉽게 세척이 가능하며 위생적으로 관리'
                    },
                    {
                        title: '최적화된 충격 흡수',
                        description: '이중 에어 챔버 구조로 효과적인 충격 분산 및 흡수'
                    },
                    {
                        title: '휴대성',
                        description: '휴대용 캐리백 제공으로 이동 및 보관이 편리함'
                    },
                    {
                        title: '안정적인 착지면',
                        description: '미끄럼 방지 바닥면 처리로 안정적인 위치 유지'
                    }
                ],
                documents: [
                    {
                        id: 'training-air-mattress-manual',
                        nameKo: '사용자 매뉴얼',
                        nameEn: 'User Manual',
                        type: 'manual',
                        filePath: '/documents/b-type/training-air-mattress-manual.pdf'
                    },
                    {
                        id: 'training-air-mattress-guide',
                        nameKo: '훈련 가이드',
                        nameEn: 'Training Guide',
                        type: 'guide',
                        filePath: '/documents/b-type/training-air-mattress-guide.pdf'
                    }
                ],
                tags: ['훈련용', '안전매트', '추락방지', '교육장비', '에어매트리스'],
                additionalInfo: {
                    warranty: '5년 제한 보증'
                }
            },
            'Lifesaving-Mat': {
                id: 'Lifesaving-Mat',
                nameKo: '인명구조 매트',
                nameEn: 'Lifesaving Mat',
                description: '인명구조 매트는 화재 및 재난 현장에서 신속한 인명 구조를 위한 필수 장비입니다. 고강도 내열성 소재를 사용하여 안전하고 효과적인 구조 작업을 지원합니다.',
                thumbnail: '/images/products/Lifesaving-Mat/thumbnail.jpg',
                images: [
                    '/images/products/Lifesaving-Mat/Lifesaving-Mat.png',
                    '/images/products/Lifesaving-Mat/thumbnail.jpg',
                ],
                modelPath: '/models/products/Lifesaving-Mat/Lifesaving-Mat.glb',
                specifications: {
                    '모델': 'LSM-110, LSM-220, LSM-330',
                    '규격(m)': '3×3 / 4×4 / 5×5',
                    '제품승인번호': '구매 21-7',
                    '내열성': '200°C까지 내열 가능',
                    '충격흡수력': '최대 100kg 충격 흡수',
                    '최대 적재량': '500kg',
                    '재질': '내열성 특수 폴리머 소재',
                    '무게': '15kg ~ 30kg (모델별 상이)',
                    '사용 환경': '-30℃ ~ 200℃',
                },
                features: [
                    {
                        title: '우수한 내열성',
                        description: '200°C까지 견딜 수 있는 특수 소재로 화재 현장에서도 안전하게 사용'
                    },
                    {
                        title: '가벼운 무게',
                        description: '휴대성이 뛰어나 신속한 배치와 이동이 용이함'
                    },
                    {
                        title: '고강도 내구성',
                        description: '반복적인 사용에도 내구성이 유지되어 장기간 사용 가능'
                    },
                    {
                        title: '신속한 배치',
                        description: '15초 이내에 완전 전개 가능하여 긴급 상황에 신속 대응'
                    },
                    {
                        title: '다용도 활용',
                        description: '추락 방지, 화재 대피, 수색 구조 등 다양한 재난 상황에서 활용 가능'
                    }
                ],
                documents: [
                    {
                        id: 'lifesaving-mat-manual',
                        nameKo: '사용자 매뉴얼',
                        nameEn: 'User Manual',
                        type: 'manual',
                        filePath: '/documents/b-type/lifesaving-mat-manual.pdf'
                    },
                    {
                        id: 'lifesaving-mat-certification',
                        nameKo: '제품 인증서',
                        nameEn: 'Product Certification',
                        type: 'certification',
                        filePath: '/documents/b-type/lifesaving-mat-certification.pdf'
                    }
                ],
                tags: ['인명구조', '안전매트', '화재대응', '내열성', '구조장비'],
                additionalInfo: {
                    warranty: '3년 제한 보증'
                }
            }
        };

        console.log('📂 안전장비 데이터 로드 완료');

        // 3. 에어매트 제품들 찾기 및 교체
        const airmatProductIds = [
            'Cylinder-Type-SafetyAirMat',
            'Fan-Type-Air-Safety-Mat',
            'Training-Air-Mattress-Fall-Prevention-Mat',
            'Lifesaving-Mat'
        ];

        let replacedCount = 0;

        for (let i = 0; i < productsData.length; i++) {
            const product = productsData[i];

            if (airmatProductIds.includes(product.id)) {
                const safetyEquipment = safetyEquipmentData[product.id];

                if (safetyEquipment) {
                    console.log(`🔄 교체 중: ${product.nameKo} (${product.id})`);

                    // 기존 제품을 새로운 형식으로 교체
                    productsData[i] = convertSafetyEquipmentToProduct(safetyEquipment, product);

                    console.log(`✅ 교체 완료: ${productsData[i].nameKo}`);
                    replacedCount++;
                } else {
                    console.log(`⚠️  안전장비 데이터를 찾을 수 없음: ${product.id}`);
                }
            }
        }

        // 4. 백업 생성 및 저장
        const timestamp = Date.now();
        const backupPath = path.join(__dirname, `../content/data/products/backups/products_before_replacement_${timestamp}.json`);

        // 원본 백업
        fs.writeFileSync(backupPath, JSON.stringify(JSON.parse(fs.readFileSync(productsPath, 'utf8')), null, 2));
        console.log(`💾 백업 생성: ${backupPath}`);

        // 새로운 데이터 저장
        fs.writeFileSync(productsPath, JSON.stringify(productsData, null, 2));
        console.log(`💾 새로운 제품 데이터 저장 완료`);

        console.log(`\n✅ 교체 작업 완료!`);
        console.log(`📊 총 ${replacedCount}개의 에어매트 제품이 교체되었습니다.`);
        console.log(`\n교체된 제품들:`);
        airmatProductIds.forEach(id => {
            const product = productsData.find(p => p.id === id);
            if (product) {
                console.log(`   - ${product.nameKo} (${id})`);
            }
        });

        console.log(`\n🔍 B타입 업로드 기능 검증을 위해 개발 서버를 실행하세요:`);
        console.log(`   pnpm dev`);

    } catch (error) {
        console.error('❌ 오류 발생:', error);
        console.log('\n🔄 백업에서 복원하려면 다음 명령어를 실행하세요:');
        console.log('   Copy-Item "content/data/products/backups/products_backup_before_airmat_replacement.json" "content/data/products/products.json"');
    }
}

// 스크립트 실행
main(); 