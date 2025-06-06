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

const transformToFormData = (product: Product | null | undefined): Partial<ProductFormData> => {
    if (!product) return {};
    return product as unknown as Partial<ProductFormData>;
};

const transformToProduct = (formData: ProductFormData): Product => {
    return formData as unknown as Product;
}

interface ProductFormProps {
    initialData?: Product | null;
    onSubmit: (data: Product) => Promise<void>;
    isSubmitting?: boolean;
}

export const ProductForm: React.FC<ProductFormProps> = ({
    initialData,
    onSubmit,
    isSubmitting: isParentSubmitting = false,
}) => {
    const methods = useForm<ProductFormData>({
        resolver: zodResolver(productFormSchema),
        defaultValues: transformToFormData(initialData),
    });

    const { handleSubmit, watch, formState: { isSubmitting } } = methods;

    const watchedProductStyle = watch('productStyle', initialData?.productStyle || 'A');

    const handleFormSubmit = async (data: ProductFormData) => {
        try {
            const productData = transformToProduct(data);
            await onSubmit(productData);
        } catch (error) {
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

                {watchedProductStyle === 'B' && (
                    <>
                        <ProductFormModel3D />
                        <ProductFormTechnicalData />
                        <ProductFormSpecifications />
                        <ProductFormImpactData />
                    </>
                )}

                <ProductFormSettings />

                <div className="flex justify-end">
                    <Button type="submit" disabled={isCurrentlySubmitting} size="lg">
                        {isCurrentlySubmitting ? '저장 중...' : (initialData ? '변경사항 저장' : '제품 생성')}
                    </Button>
                </div>
            </form>
        </FormProvider>
    );
};

export default ProductForm; 