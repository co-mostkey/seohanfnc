"use client";

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface ColorPickerInputProps {
    value: string;
    onColorChange: (value: string) => void;
    className?: string;
}

export const ColorPickerInput: React.FC<ColorPickerInputProps> = ({
    value,
    onColorChange,
    className = ''
}) => {
    const [pickerValue, setPickerValue] = useState<string>(value);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setPickerValue(newValue);
        onColorChange(newValue);
    };

    const handleColorPickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setPickerValue(newValue);
        onColorChange(newValue);
    };

    // 입력값이 바뀔 때 상태 업데이트
    React.useEffect(() => {
        setPickerValue(value);
    }, [value]);

    return (
        <div className={`relative flex items-center ${className}`}>
            <input
                type="color"
                value={pickerValue}
                onChange={handleColorPickerChange}
                className="h-10 w-16 border border-gray-300 rounded-l-md cursor-pointer"
            />
            <input
                type="text"
                value={pickerValue}
                onChange={handleInputChange}
                className="flex-1 px-3 py-2 border-t border-r border-b border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="#FFFFFF"
            />
        </div>
    );
}; 