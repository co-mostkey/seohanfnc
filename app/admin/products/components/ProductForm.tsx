'use client';

import React from 'react';
import { useForm, useFieldArray, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productFormSchema, ProductFormData } from '@/lib/validators/product-validator';
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
import { ProductFormImpactData } from './form-sections/ProductFormImpactData';
import { ProductFormCautions } from './form-sections/ProductFormCautions';
import { ProductFormVideos } from './form-sections/ProductFormVideos';
import { ProductFormPageSettings } from './form-sections/ProductFormPageSettings';
import { ProductFormSpecTable } from './form-sections/ProductFormSpecTable';
import { ProductFormCertifications } from './form-sections/ProductFormCertifications';

const transformToFormData = (product: Product | null | undefined): any => {
    if (!product) return {
        productStyle: 'A',
        isPublished: true,
        sortOrder: 0,
        id: '',  // 빈 문자열로 초기화
        nameKo: '',
        categoryId: '',
        mainImage: ''
    };

    return {
        ...product,
        mainImage: product.image,
        productStyle: product.productStyle || 'A',
        isPublished: product.isPublished ?? true,
        sortOrder: product.sortOrder ?? 0,
    };
};

const transformToProduct = (formData: any): Product => {
    const { mainImage, gallery_images_data, ...rest } = formData;

    // 빈 갤러리 항목 제거
    const cleanedGallery = gallery_images_data?.filter((item: any) =>
        item.src && item.src.trim() !== '' && item.alt && item.alt.trim() !== ''
    ) || [];

    return {
        ...rest,
        image: mainImage || formData.image, // mainImage가 없으면 image 필드 사용
        gallery_images_data: cleanedGallery,
    } as Product;
}

interface ProductFormProps {
    initialData?: Product | null;
    onSubmitAction: (data: Product) => Promise<void>;
    isSubmitting?: boolean;
}

export const ProductForm: React.FC<ProductFormProps> = ({
    initialData,
    onSubmitAction,
    isSubmitting: isParentSubmitting = false,
}) => {
    const methods = useForm<ProductFormData>({
        resolver: zodResolver(productFormSchema),
        defaultValues: transformToFormData(initialData),
    });

    const { handleSubmit, watch, formState: { isSubmitting } } = methods;

    const watchedProductStyle = watch('productStyle', initialData?.productStyle || 'A');

    const handleFormSubmit = async (data: ProductFormData) => {
        console.log('[TRISID] 폼 제출 핸들러 시작');
        console.log('[TRISID] 받은 폼 데이터:', JSON.stringify(data, null, 2));
        console.log('[TRISID] 폼 검증 상태:', methods.formState.errors);

        // 필수 필드 확인 (mainImage 또는 image 확인)
        const imageField = (data as any).mainImage || (data as any).image;
        if (!data.id || !data.nameKo || !data.categoryId || !imageField) {
            console.error('[TRISID] 필수 필드 누락:', {
                id: data.id,
                nameKo: data.nameKo,
                categoryId: data.categoryId,
                image: imageField
            });
            toast.error("필수 필드를 모두 입력해주세요.");
            return;
        }

        try {
            console.log('[TRISID] 데이터 변환 시작');

            // B타입 제품 특별 처리 - 빈 배열들 정리
            if (data.productStyle === 'B') {
                console.log('[TRISID] B타입 제품 데이터 처리');

                // 빈 배열 필드들을 정리 (transformToProduct 호출 전에)
                data = {
                    ...data,
                    videos: data.videos?.filter((video: any) => video && video.src && video.src.trim() !== '') || [],
                    technicalData: data.technicalData?.filter((tech: any) => tech && tech.key && tech.value) || [],
                    certifications: data.certifications?.filter((cert: any) => cert && cert.title && cert.description) || [],
                    specifications: data.specifications?.filter((spec: any) => spec && spec.key && spec.value) || [],
                    specTable: data.specTable?.filter((item: any) => item && item.title) || [],
                    cautions: data.cautions?.filter((caution: string) => caution && caution.trim() !== '') || [],
                };

                console.log('[TRISID] B타입 데이터 정리 완료');
            }

            // 클라이언트 측에서도 검증해보기
            const { productFormSchema } = await import('@/lib/validators/product-validator');
            const clientValidation = productFormSchema.safeParse(data); // 변환 전 데이터로 검증
            if (!clientValidation.success) {
                console.error('[TRISID] 클라이언트 검증 실패:', clientValidation.error.errors);
                toast.error(`검증 오류: ${clientValidation.error.errors.map(e => e.message).join(', ')}`);
                return;
            }

            console.log('[TRISID] 클라이언트 검증 통과, 서버로 원본 폼 데이터 전송');
            console.log('[TRISID] 서버로 전송할 데이터:', JSON.stringify(data, null, 2));

            console.log('[TRISID] onSubmitAction 호출 시작');
            // 서버로는 원본 폼 데이터를 전송 (서버에서 변환 처리)
            await onSubmitAction(data as any);
            console.log('[TRISID] onSubmitAction 완료');
        } catch (error) {
            console.error('[TRISID] 폼 제출 중 오류:', error);
            toast.error("데이터 변환 또는 제출 중 오류가 발생했습니다.");
            console.error(error);
        }
    };

    const isCurrentlySubmitting = isParentSubmitting || isSubmitting;

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
                <ProductFormBasicInfo />
                <ProductFormDocuments />
                <ProductFormGallery />
                <ProductFormFeatures />

                {/* A타입 전용 섹션들 */}
                {watchedProductStyle === 'A' && (
                    <>
                        <ProductFormSpecTable />
                        <ProductFormCautions />
                        <ProductFormSettings />
                    </>
                )}

                {/* B타입 전용 섹션들 */}
                {watchedProductStyle === 'B' && (
                    <>
                        <ProductFormPageSettings />
                        <ProductFormModel3D />
                        <ProductFormSpecTable />
                        <ProductFormTechnicalData />
                        <ProductFormCertifications />
                        <ProductFormSpecifications />
                        <ProductFormImpactData />
                        <ProductFormCautions />
                        <ProductFormVideos />
                        <ProductFormSettings />
                    </>
                )}

                <div className="flex justify-end relative z-50 mt-8 pt-6 border-t border-gray-700">
                    <Button
                        type="button"
                        disabled={isCurrentlySubmitting}
                        size="lg"
                        className="relative z-50 bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 font-semibold"
                        onClick={async (e) => {
                            e.preventDefault();
                            console.log('[TRISID] =========================');
                            console.log('[TRISID] 버튼 클릭됨');
                            console.log('[TRISID] 현재 폼 값들:', methods.getValues());
                            console.log('[TRISID] 폼 검증 오류:', methods.formState.errors);
                            console.log('[TRISID] isValid:', methods.formState.isValid);
                            console.log('[TRISID] isDirty:', methods.formState.isDirty);

                            // 수동으로 폼 검증 수행
                            const isValid = await methods.trigger();
                            console.log('[TRISID] 수동 검증 결과:', isValid);

                            if (isValid) {
                                console.log('[TRISID] 검증 통과, handleSubmit 호출');
                                methods.handleSubmit(handleFormSubmit)();
                            } else {
                                console.log('[TRISID] 검증 실패:', methods.formState.errors);
                            }
                            console.log('[TRISID] =========================');
                        }}
                    >
                        {isCurrentlySubmitting ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                저장 중...
                            </>
                        ) : (
                            initialData ? '변경사항 저장' : '제품 생성'
                        )}
                    </Button>
                </div>
            </form>
        </FormProvider>
    );
};

export default ProductForm; 