import { z } from 'zod';

// MediaGalleryItem 스키마 (이미지/비디오 공용)
const mediaGalleryItemSchema = z.object({
    id: z.string().optional(), // UUID 검증 제거, optional로 변경
    src: z.string().min(1, "경로는 필수입니다."), // URL 검증 제거
    alt: z.string().min(1, "대체 텍스트는 필수입니다."),
    type: z.enum(['image', 'video']),
    description: z.string().optional(),
    caption: z.string().optional(),
});

// Document 스키마
const documentSchema = z.object({
    id: z.string().optional(), // UUID 검증 제거
    name: z.string().optional(), // name을 optional로 변경
    nameKo: z.string().optional(), // 다국어 필드는 optional 또는 min(1) 추가 가능
    nameEn: z.string().optional(),
    nameCn: z.string().optional(),
    description: z.string().optional(),
    url: z.string().optional(), // path와 중복 가능성, API 응답에 따라 조정
    filename: z.string().optional(),
    fileType: z.string().optional(),
    type: z.enum(['pdf', 'doc', 'docx', 'xlsx', 'pptx', 'zip', 'hwp', 'txt', 'etc', 'manual', 'certification', 'guide', 'datasheet']),
    fileSize: z.string().optional(),
    path: z.string().optional(), // path를 optional로 변경 (url이 있을 수 있음)
});

// Feature 스키마
const featureSchema = z.object({
    title: z.string().min(1, "특징 제목은 필수입니다."),
    description: z.string().min(1, "특징 설명은 필수입니다."),
    icon: z.string().optional(),
});

// SpecTableItem 스키마 (동적 키를 가지므로, 기본 구조만 정의)
const specTableItemSchema = z.object({
    title: z.string().min(1, "구분(항목명)은 필수입니다."),
}).catchall(z.string()); // 나머지 키들은 모두 string 값으로 허용

// AdditionalSection 스키마
const additionalSectionSchema = z.object({
    title: z.string().min(1, "섹션 제목은 필수입니다."),
    content: z.string().min(1, "섹션 내용은 필수입니다."),
});

// Specification Item 스키마 (키-값 쌍)
const specificationItemSchema = z.object({
    key: z.string().min(1, "항목명(Key)은 필수입니다."),
    value: z.string().min(1, "값(Value)은 필수입니다."),
});

// 제품 스타일 타입 정의
export const productStyleSchema = z.enum(['A', 'B'], {
    errorMap: () => ({ message: "제품 스타일은 A타입 또는 B타입을 선택해야 합니다." })
});

// Model3D 스키마 (B타입 전용)
const model3DSchema = z.object({
    modelName: z.string().optional(),
    modelNumber: z.string().optional(),
    series: z.string().optional(),
    modelImage: z.string().optional(),
    approvalNumber: z.string().optional(),
    applicableHeight: z.string().optional(),
    additionalOptions: z.string().optional(),
    glbFile: z.string().optional(),
    modelStyle: z.enum(['realistic', 'wireframe', 'cartoon']).default('realistic'),
});

// TechnicalData 스키마 (B타입 전용)
const technicalDataSchema = z.object({
    key: z.string().min(1, "기술 사양 항목명은 필수입니다."),
    value: z.string().min(1, "기술 사양 값은 필수입니다."),
});

// Certification 스키마 (B타입 전용)
const certificationSchema = z.object({
    title: z.string().min(1, "인증/특징 제목은 필수입니다."),
    description: z.string().min(1, "인증/특징 설명은 필수입니다."),
    icon: z.string().optional(),
});

export const productSchema = z.object({
    id: z.string().min(1, "제품 ID는 필수입니다.").regex(/^[a-zA-Z0-9-]+$/, "ID는 영문, 숫자, 하이픈만 사용 가능합니다."),
    name: z.string().optional(), // 기본 영문명
    nameKo: z.string().min(1, "한글 제품명은 필수입니다."),
    nameEn: z.string().optional(),
    nameCn: z.string().optional(),

    categoryId: z.string().min(1, "카테고리 ID는 필수입니다."),
    // productCategoryId는 API 응답용이므로 폼 유효성 검사에서는 제외

    description: z.string().optional(),
    descriptionKo: z.string().min(1, "한글 제품 설명은 필수입니다."),
    descriptionEn: z.string().optional(),
    descriptionCn: z.string().optional(),

    // 제품 스타일 타입 추가
    productStyle: productStyleSchema.default('A'),

    image: z.string().min(1, "대표 이미지는 필수입니다."), // 경로 검증 제거

    gallery_images_data: z.array(mediaGalleryItemSchema).optional(),
    videos: z.array(mediaGalleryItemSchema.extend({ type: z.literal('video') })).optional(), // 비디오 타입 명시

    features: z.array(featureSchema).optional(),
    documents: z.array(documentSchema).optional(),
    specTable: z.array(specTableItemSchema).optional(),
    detailedSpecTable: z.array(specTableItemSchema).optional(),
    impactAbsorptionData: z.object({
        title: z.string().optional(),
        subtitle: z.string().optional(),
        testInfo: z.object({
            standard: z.string().optional(),
            testDate: z.string().optional(),
            testSubject: z.string().optional(),
            testDummy: z.string().optional(),
            testHeight: z.string().optional(),
            note: z.string().optional(),
            reference: z.string().optional(),
            conversion: z.string().optional(),
        }).optional(),
        testResults: z.array(z.object({
            name: z.string().optional(),
            voltage: z.string().optional(),
            gForce: z.string().optional(),
            percentage: z.number().optional(),
            chartImage: z.string().optional(),
        })).optional(),
        comparisonChart: z.object({
            title: z.string().optional(),
            data: z.array(z.object({
                name: z.string().optional(),
                percentage: z.number().optional(),
                color: z.string().optional(),
            })).optional(),
            comparisonImages: z.object({
                groundImpact: z.string().optional(),
                airMatImpact: z.string().optional(),
            }).optional(),
        }).optional(),
        analysis: z.array(z.string()).optional(),
    }).optional(),
    cautions: z.array(z.string().min(1, "주의사항 내용은 비워둘 수 없습니다.")).optional(),
    additionalSections: z.array(additionalSectionSchema).optional(),

    modelName: z.string().optional(),
    modelNumber: z.string().optional(),
    modelImage: z.string().optional(), // 경로 검증 제거
    modelFile: z.string().optional(), // 경로 검증 제거
    modelStyle: z.string().optional(),
    series: z.string().optional(),
    tags: z.array(z.string()).optional(), // 문자열 배열로 처리 (쉼표 구분은 UI에서)
    relatedProductIds: z.array(z.string()).optional(),
    showInProductList: z.boolean().optional().default(true),
    isSummaryPage: z.boolean().optional().default(false),
    pageBackgroundImage: z.string().optional(), // 경로 검증 제거
    pageHeroTitle: z.string().optional(),
    pageHeroSubtitles: z
        .array(
            z.object({
                text: z.string().min(1, '서브타이틀 텍스트는 필수입니다.'),
                color: z.string().optional(),
                size: z
                    .number()
                    .int()
                    .positive()
                    .max(120)
                    .optional(), // 120px 이하 제한
            }),
        )
        .max(2, '서브타이틀은 최대 2개까지 입력할 수 있습니다.')
        .optional(),
    seoStructuredData: z.string().optional(),
    specifications: z.array(specificationItemSchema).optional(), // Record 대신 배열로 변경
    certificationsAndFeatures: z.array(featureSchema).optional(), // features와 동일 구조 사용
    approvalNumber: z.string().optional(),
    applicableHeight: z.string().optional(),
    otherOptions: z.string().optional(),

    // B타입 전용 필드들 추가
    model3D: model3DSchema.optional(),
    technicalData: z.array(technicalDataSchema).optional(),
    certifications: z.array(certificationSchema).optional(),
    isPublished: z.boolean().optional().default(true),

    // Product 타입의 [key: string]: any; 와 충돌하지 않도록 주의
    // category 필드는 API 저장 시 categoryId를 기반으로 생성되므로 스키마에는 불필요
});

export type ProductFormData = z.infer<typeof productSchema>;

// 개별 섹션을 위한 타입들 export
export type DocumentFormData = z.infer<typeof documentSchema>;
export type FeatureFormData = z.infer<typeof featureSchema>;
export type MediaGalleryItemFormData = z.infer<typeof mediaGalleryItemSchema>;
export type SpecTableItemFormData = z.infer<typeof specTableItemSchema>;
export type AdditionalSectionFormData = z.infer<typeof additionalSectionSchema>;
export type SpecificationItemFormData = z.infer<typeof specificationItemSchema>;
export type Model3DFormData = z.infer<typeof model3DSchema>;
export type TechnicalDataFormData = z.infer<typeof technicalDataSchema>;
export type CertificationFormData = z.infer<typeof certificationSchema>; 