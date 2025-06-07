'use client';

import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { ProductFormData } from '@/lib/validators/product-validator';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2 } from 'lucide-react';
import { FileUpload } from '@/components/admin/FileUpload';
import { toast } from 'sonner';

export const ProductFormGallery = () => {
  const { control, register, setValue, watch } = useFormContext<ProductFormData>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "gallery_images_data"
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>갤러리 이미지</CardTitle>
          <Button
            type="button"
            onClick={() => append({ src: '', alt: '', type: 'image' })}
          >
            이미지 추가
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {fields.map((field, index) => (
          <div key={field.id} className="p-4 border rounded-md space-y-2 relative">
            <div className="absolute top-2 right-2">
              <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <div>
              <Label>갤러리 이미지</Label>
              {watch(`gallery_images_data.${index}.src`) ? (
                <div className="flex items-center space-x-2">
                  <img src={watch(`gallery_images_data.${index}.src`)} alt={watch(`gallery_images_data.${index}.alt`) || ''} className="w-16 h-16 object-cover rounded" />
                  <Button type="button" variant="destructive" size="sm" onClick={async () => {
                    const path = watch(`gallery_images_data.${index}.src`)!;
                    const res = await fetch(`/api/admin/upload?path=${path}`, { method: 'DELETE' });
                    if (res.ok) {
                      setValue(`gallery_images_data.${index}.src`, '', { shouldValidate: true });
                      toast.success('갤러리 이미지를 삭제했습니다.');
                    } else {
                      toast.error('갤러리 이미지 삭제에 실패했습니다.');
                    }
                  }}>
                    삭제
                  </Button>
                </div>
              ) : (
                <FileUpload
                  endpoint="/api/admin/upload"
                  accept="image/*"
                  fileType="gallery"
                  idSuffix={`gallery-${index}`}
                  onUploadSuccess={({ url }) => {
                    setValue(`gallery_images_data.${index}.src`, url, { shouldValidate: true });
                    toast.success('이미지를 업로드했습니다.');
                  }}
                />
              )}
            </div>
            <div>
              <Label>대체 텍스트 (Alt Text)</Label>
              <Input {...register(`gallery_images_data.${index}.alt`)} />
            </div>
          </div>
        ))}
        {fields.length === 0 && (
          <p className="text-sm text-center text-muted-foreground">추가된 이미지가 없습니다.</p>
        )}
      </CardContent>
    </Card>
  );
}; 