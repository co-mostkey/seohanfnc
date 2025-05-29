'use client';

import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productSchema, ProductFormData } from '@/lib/validators/product-validator';
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { Product } from '@/types/product';

import { ProductFormBasicInfo } from './form-sections/ProductFormBasicInfo';
import { ProductFormDocuments } from './form-sections/ProductFormDocuments';
import { ProductFormGallery } from './form-sections/ProductFormGallery';
import { ProductFormFeatures } from './form-sections/ProductFormFeatures';
import { ProductFormSpecifications } from './form-sections/ProductFormSpecifications';
import { ProductFormModel3D } from './form-sections/ProductFormModel3D';
import { ProductFormTechnicalData } from './form-sections/ProductFormTechnicalData';
import { ProductFormSettings } from './form-sections/ProductFormSettings';

interface ProductFormProps {
    initialData?: Product | null;
    onSubmit: (data: Product) => void;
    isSubmitting?: boolean;
}

export const ProductForm: React.FC<ProductFormProps> = ({
    initialData,
    onSubmit,
    isSubmitting = false
}) => {
    // Product 데이터를 ProductFormData 형식으로 변환하는 함수
    const transformToFormData = (product: Product | null | undefined): Partial<ProductFormData> => {
        if (!product) {
            return {
                id: '',
                nameKo: '',
                name: '',
                descriptionKo: '',
                description: '',
                categoryId: '',
                productStyle: 'A', // 기본값 설정
                image: '',
                gallery_images_data: [],
                documents: [],
                features: [],
                pageHeroTitle: '',
                pageHeroSubtitles: [],
                seoStructuredData: '',
                specifications: [],
                technicalData: [],
                certifications: [],
                model3D: {
                    modelName: '',
                    modelNumber: '',
                    series: '',
                    modelImage: '',
                    approvalNumber: '',
                    applicableHeight: '',
                    additionalOptions: '',
                    glbFile: '',
                    modelStyle: 'realistic'
                }
            };
        }

        console.log('Transforming product data:', product); // 디버깅용

        return {
            id: product.id || '',
            nameKo: product.nameKo || '',
            nameEn: product.nameEn || '',
            name: typeof product.name === 'string' ? product.name : (product.name?.ko || product.name?.en || ''),
            descriptionKo: product.descriptionKo || '',
            descriptionEn: product.descriptionEn || '',
            description: typeof product.description === 'string' ? product.description : (product.description?.ko || product.description?.en || ''),
            categoryId: product.categoryId || product.category || '',
            productStyle: product.productStyle || 'A',
            approvalNumber: product.approvalNumber || '',
            image: product.image || '',
            gallery_images_data: product.gallery_images_data || [],
            documents: (product.documents || []).map(doc => {
                console.log('Processing document:', doc); // 디버깅용
                // path가 없으면 url을 사용
                const path = doc.path || doc.url || '';
                return {
                    ...doc,
                    name: doc.name || doc.nameKo || doc.nameEn || 'Unknown Document',
                    path: path,
                    url: doc.url || path, // url이 없으면 path를 사용
                    type: doc.type || 'pdf', // 기본값 설정
                };
            }),
            features: product.features || [],
            pageHeroTitle: product.pageHeroTitle || '',
            pageHeroSubtitles: product.pageHeroSubtitles || [],
            seoStructuredData: product.seoStructuredData || '',

            // B타입 전용 필드들 - 실제 데이터 구조에 맞게 수정
            specifications: product.specifications
                ? Object.entries(product.specifications).map(([key, value]) => ({ key, value: String(value) }))
                : [],

            // 3D 모델 관련 필드들 (개별 필드로 처리)
            modelName: product.modelName || '',
            modelNumber: product.modelNumber || '',
            series: product.series || '',
            modelImage: product.modelImage || '',
            modelFile: product.modelFile || '',
            modelStyle: product.modelStyle || 'realistic',
            applicableHeight: product.applicableHeight || '',

            // model3D 객체 형태로도 제공 (폼 컴포넌트 호환성을 위해)
            model3D: {
                modelName: product.modelName || '',
                modelNumber: product.modelNumber || '',
                series: product.series || '',
                modelImage: product.modelImage || '',
                approvalNumber: product.approvalNumber || '',
                applicableHeight: product.applicableHeight || '',
                additionalOptions: product.otherOptions || '',
                glbFile: product.modelFile || '',
                modelStyle: (product.modelStyle === 'modern' ? 'realistic' : product.modelStyle as 'realistic' | 'wireframe' | 'cartoon') || 'realistic'
            },

            technicalData: product.technicalData || [],
            certifications: product.certificationsAndFeatures || product.certifications || [],
            detailedSpecTable: product.detailedSpecTable || [],
            impactAbsorptionData: product.impactAbsorptionData || {
                title: "",
                subtitle: "",
                testInfo: {
                    standard: "",
                    testDate: "",
                    testSubject: "",
                    testDummy: "",
                    testHeight: "",
                    note: "",
                    reference: "",
                    conversion: ""
                },
                testResults: [],
                comparisonChart: {
                    title: "",
                    data: [],
                    comparisonImages: {
                        groundImpact: "",
                        airMatImpact: ""
                    }
                },
                analysis: []
            },
            isPublished: product.isPublished ?? true
        };
    };

    const {
        register,
        control,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors, isSubmitting: formIsSubmitting, isValid }
    } = useForm<ProductFormData>({
        resolver: zodResolver(productSchema),
        defaultValues: transformToFormData(initialData),
        mode: 'onChange' // 실시간 검증 활성화
    });

    // useFieldArray 훅들
    const { fields: documentFields, append: appendDocument, remove: removeDocument } =
        useFieldArray({ control, name: "documents" });

    const { fields: galleryImageFields, append: appendGalleryImage, remove: removeGalleryImage } =
        useFieldArray({ control, name: "gallery_images_data" });

    const { fields: featureFields, append: appendFeature, remove: removeFeature } =
        useFieldArray({ control, name: "features" });

    // B타입 전용 useFieldArray 훅들
    const { fields: specificationFields, append: appendSpecification, remove: removeSpecification } =
        useFieldArray({ control, name: "specifications" });

    const { fields: technicalDataFields, append: appendTechnicalData, remove: removeTechnicalData } =
        useFieldArray({ control, name: "technicalData" });

    const { fields: certificationFields, append: appendCertification, remove: removeCertification } =
        useFieldArray({ control, name: "certifications" });

    const { fields: detailedSpecTableFields, append: appendDetailedSpecTable, remove: removeDetailedSpecTable } =
        useFieldArray({ control, name: "detailedSpecTable" });

    // productStyle 값을 watch하여 조건부 렌더링에 사용
    const watchedProductStyle = watch('productStyle');

    // initialData가 변경될 때 폼 데이터 다시 설정
    React.useEffect(() => {
        if (initialData) {
            console.log('Setting form data from initialData:', initialData);
            const formData = transformToFormData(initialData);
            console.log('Transformed form data:', formData);
            // reset을 사용하여 모든 필드(배열 필드 포함) 완전 재설정
            reset(formData);
        }
    }, [initialData, reset]);

    const handleFileDelete = async (
        filePathToDelete: string,
        fieldName: keyof ProductFormData,
        listIndex?: number,
        subFieldName?: 'src' | 'path'
    ) => {
        if (!filePathToDelete) {
            toast.error("삭제할 파일 경로가 없습니다.");
            return;
        }

        if (!confirm(`정말로 이 파일을 서버에서 삭제하시겠습니까?\n경로: ${filePathToDelete}\n이 작업은 되돌릴 수 없습니다.`)) return;

        try {
            const response = await fetch(`/api/admin/upload?path=${encodeURIComponent(filePathToDelete)}`, {
                method: 'DELETE',
            });
            const result = await response.json();

            if (response.ok && result.success) {
                toast.success('파일이 성공적으로 서버에서 삭제되었습니다.');

                if (listIndex !== undefined && subFieldName) {
                    setValue(`${fieldName}.${listIndex}.${subFieldName}` as any, '', { shouldValidate: true });
                } else {
                    setValue(fieldName as any, '', { shouldValidate: true });
                }
            } else {
                toast.error(`서버 파일 삭제 실패: ${result.message || result.error || '알 수 없는 오류'}`);
            }
        } catch (err: any) {
            toast.error(`파일 삭제 중 클라이언트 오류 발생: ${err.message}`);
            console.error("File delete error:", err);
        }
    };

    const onFormSubmit = (data: ProductFormData) => {
        // 유효성 검사 오류가 있는지 확인
        if (Object.keys(errors).length > 0) {
            toast.error('폼에 오류가 있습니다. 모든 필수 필드를 확인해주세요.');
            return;
        }

        try {
            console.log('=== Converting Form Data to Product Data ===');

            // ProductFormData를 Product 형식으로 변환
            const productData: Product = {
                ...data,
                // gallery_images_data의 id 필드 보장
                gallery_images_data: data.gallery_images_data?.map(item => ({
                    ...item,
                    id: item.id || `gallery-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
                })) || [],

                // videos의 id 필드 보장
                videos: data.videos?.map(item => ({
                    ...item,
                    id: item.id || `video-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
                })) || [],

                // documents의 id 필드 보장
                documents: data.documents?.map(item => {
                    // type 필드를 Document 타입에 맞게 변환
                    let documentType: 'pdf' | 'doc' | 'etc' = 'etc';
                    if (item.type === 'pdf') documentType = 'pdf';
                    else if (item.type === 'doc' || item.type === 'docx') documentType = 'doc';
                    else documentType = 'etc';

                    return {
                        ...item,
                        id: item.id || `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                        name: item.name || 'Untitled Document',
                        nameKo: item.nameKo || item.name || '제목 없는 문서',
                        url: item.url || item.path || '',
                        path: item.path || item.url || '',
                        type: documentType
                    };
                }) || [],

                // specifications 배열을 객체로 변환
                specifications: data.specifications?.reduce((acc, spec) => {
                    if (spec.key && spec.value) {
                        acc[spec.key] = spec.value;
                    }
                    return acc;
                }, {} as Record<string, string>) || {},

                // model3D 객체에서 개별 필드로 분해
                modelName: data.model3D?.modelName || data.modelName || '',
                modelNumber: data.model3D?.modelNumber || data.modelNumber || '',
                series: data.model3D?.series || data.series || '',
                modelImage: data.model3D?.modelImage || data.modelImage || '',
                modelFile: data.model3D?.glbFile || data.modelFile || '',
                modelStyle: data.model3D?.modelStyle || data.modelStyle || 'realistic',
                applicableHeight: data.model3D?.applicableHeight || data.applicableHeight || '',

                // certifications를 certificationsAndFeatures로 매핑
                certificationsAndFeatures: data.certifications || [],

                // detailedSpecTable 추가
                detailedSpecTable: data.detailedSpecTable || [],

                // 기타 필드들
                category: data.categoryId,
                productCategoryId: data.categoryId,
            };

            console.log('Converted product data:', productData);
            console.log('=== Calling onSubmit ===');
            console.log('onSubmit function:', onSubmit);

            if (typeof onSubmit !== 'function') {
                console.error('onSubmit is not a function!', typeof onSubmit);
                toast.error('제출 함수가 올바르게 설정되지 않았습니다.');
                return;
            }

            onSubmit(productData);
        } catch (error) {
            console.error('Error converting form data:', error);
            toast.error('데이터 변환 중 오류가 발생했습니다.');
        }
    };

    return (
        <form
            onSubmit={handleSubmit(
                onFormSubmit,
                (validationErrors) => {
                    console.error('=== Form Validation Failed ===');
                    console.error('Validation errors:', validationErrors);
                    console.error('Error details:', JSON.stringify(validationErrors, null, 2));
                    toast.error('폼 검증에 실패했습니다. 콘솔을 확인해주세요.');
                }
            )}
            className="space-y-6"
        >
            {/* 폼 검증 상태 표시 */}
            {Object.keys(errors).length > 0 && (
                <div className="p-4 bg-red-900/20 border border-red-700/50 rounded-md">
                    <h3 className="text-red-400 font-semibold mb-2">폼 검증 오류:</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm text-red-300">
                        {Object.entries(errors).map(([field, error]) => (
                            <li key={field}>
                                <span className="font-medium">{field}:</span> {error?.message || '알 수 없는 오류'}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* 기본 정보 */}
            <ProductFormBasicInfo
                control={control}
                register={register}
                errors={errors}
                setValue={setValue}
                watch={watch}
                handleFileDelete={handleFileDelete}
                initialData={initialData}
            />

            {/* 문서 자료 */}
            <ProductFormDocuments
                control={control}
                register={register}
                errors={errors}
                setValue={setValue}
                watch={watch}
                handleFileDelete={handleFileDelete}
                documentFields={documentFields}
                appendDocument={appendDocument}
                removeDocument={removeDocument}
                initialData={initialData}
            />

            {/* 갤러리 이미지 */}
            <ProductFormGallery
                control={control}
                register={register}
                errors={errors}
                setValue={setValue}
                watch={watch}
                handleFileDelete={handleFileDelete}
                galleryImageFields={galleryImageFields}
                appendGalleryImage={appendGalleryImage}
                removeGalleryImage={removeGalleryImage}
                initialData={initialData}
            />

            {/* 주요 특징 */}
            <ProductFormFeatures
                control={control}
                register={register}
                errors={errors}
                setValue={setValue}
                watch={watch}
                featureFields={featureFields}
                appendFeature={appendFeature}
                removeFeature={removeFeature}
            />

            {/* B타입(에어매트 스타일)일 때만 표시되는 추가 섹션들 */}
            {watchedProductStyle === 'B' && (
                <>
                    {/* 상세 사양표 섹션 */}
                    <ProductFormSpecifications
                        control={control}
                        register={register}
                        errors={errors}
                        setValue={setValue}
                        watch={watch}
                    />

                    {/* 3D 모델 섹션 */}
                    <ProductFormModel3D
                        control={control}
                        register={register}
                        errors={errors}
                        setValue={setValue}
                        watch={watch}
                        handleFileDelete={handleFileDelete}
                        initialData={initialData}
                    />

                    {/* 추가 기술 데이터 섹션 */}
                    <ProductFormTechnicalData
                        control={control}
                        register={register}
                        errors={errors}
                        setValue={setValue}
                        watch={watch}
                        handleFileDelete={handleFileDelete}
                        initialData={initialData}
                    />
                </>
            )}

            {/* 기타 설정 */}
            <ProductFormSettings
                control={control}
                register={register}
                errors={errors}
                setValue={setValue}
                watch={watch}
            />

            {/* 제출 버튼 */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-700">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => window.history.back()}
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                    취소
                </Button>
                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-orange-600 hover:bg-orange-700 text-white"
                >
                    {isSubmitting ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            저장 중...
                        </>
                    ) : (
                        initialData ? '수정' : '생성'
                    )}
                </Button>
            </div>

            {/* 참고 사항 */}
            <div className="mt-8 p-4 border-t border-gray-700">
                <h4 className="text-sm font-semibold text-gray-400 mb-2">참고 사항:</h4>
                <ul className="list-disc list-inside space-y-1 text-xs text-gray-500">
                    <li>제품 스타일: A타입(기본 업로드 스타일), B타입(확장 스타일)</li>
                    <li>B타입 선택 시 상세 사양표, 3D 모델, 기술 데이터 섹션이 추가로 표시됩니다.</li>
                    <li>제품 ID는 한 번 저장 후 변경할 수 없습니다. (신규 등록 시에만 입력 가능)</li>
                    <li>제품 정보 저장 시, 최근 20개의 백업 파일이 서버에 자동 유지됩니다.</li>
                    <li>20개 초과 시 가장 오래된 백업부터 순차적으로 자동 삭제됩니다.</li>
                </ul>
            </div>
        </form>
    );
};

export default ProductForm; 