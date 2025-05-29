import { NextRequest, NextResponse } from 'next/server';
import { getInquiryById } from '@/data/inquiry-data';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { password } = await request.json();
        const { id } = await params;

        if (!password) {
            return NextResponse.json({
                success: false,
                error: '비밀번호가 제공되지 않았습니다.'
            }, { status: 400 });
        }

        const inquiry = await getInquiryById(id);

        if (!inquiry) {
            return NextResponse.json({
                success: false,
                error: '문의를 찾을 수 없습니다.'
            }, { status: 404 });
        }

        // 비밀번호 확인
        if (inquiry.password && inquiry.password === password) {
            return NextResponse.json({
                success: true,
                message: '비밀번호가 확인되었습니다.'
            });
        } else {
            return NextResponse.json({
                success: false,
                error: '비밀번호가 올바르지 않습니다.'
            }, { status: 401 });
        }
    } catch (error) {
        console.error('비밀번호 확인 중 오류:', error);
        return NextResponse.json({
            success: false,
            error: '비밀번호 확인 중 오류가 발생했습니다.'
        }, { status: 500 });
    }
} 