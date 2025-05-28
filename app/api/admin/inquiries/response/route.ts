import { NextRequest, NextResponse } from 'next/server';
import { addResponseToInquiry, getInquiryById, updateInquiryStatus } from '@/data/inquiry-data';
import { sendInquiryResponseNotification } from '@/lib/email';

/**
 * 문의 응답 추가 API
 * POST /api/admin/inquiries/response
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // 필수 필드 검증
        if (!body.inquiryId || !body.content || !body.author || !body.authorId) {
            return NextResponse.json({
                success: false,
                error: '문의 ID, 응답 내용, 작성자 정보는 필수입니다.'
            }, { status: 400 });
        }

        // 문의 존재 확인
        const inquiry = await getInquiryById(body.inquiryId);
        if (!inquiry) {
            return NextResponse.json({
                success: false,
                error: '문의를 찾을 수 없습니다.'
            }, { status: 404 });
        }

        // 응답 추가
        const newResponse = await addResponseToInquiry(body.inquiryId, {
            inquiryId: body.inquiryId,
            content: body.content,
            isPublic: body.isPublic !== undefined ? body.isPublic : true,
            author: body.author,
            authorId: body.authorId,
            authorRole: body.authorRole || '관리자',
            attachments: body.attachments || []
        });

        if (!newResponse) {
            return NextResponse.json({
                success: false,
                error: '응답 추가 중 오류가 발생했습니다.'
            }, { status: 500 });
        }

        // 응답이 공개이고 문의가 대기 중이면 자동으로 처리 중으로 변경
        if (inquiry.status === 'pending' && body.isPublic === true) {
            await updateInquiryStatus(body.inquiryId, 'in_progress');
        }

        // 업데이트된 문의 정보 가져오기
        const updatedInquiry = await getInquiryById(body.inquiryId);

        // 공개 응답이면 고객에게 이메일 알림 발송
        if (body.isPublic && inquiry.customerEmail) {
            try {
                await sendInquiryResponseNotification(
                    {
                        id: inquiry.id,
                        title: inquiry.title,
                        customerName: inquiry.customerName,
                        customerEmail: inquiry.customerEmail
                    },
                    {
                        content: body.content,
                        author: body.author,
                        createdAt: newResponse.createdAt
                    }
                );
                console.log('응답 알림 이메일이 발송되었습니다:', inquiry.customerEmail);
            } catch (emailError) {
                // 이메일 발송 실패해도 응답 추가는 성공으로 처리
                console.error('응답 알림 이메일 발송 실패:', emailError);
            }
        }

        return NextResponse.json({
            success: true,
            response: newResponse,
            inquiry: updatedInquiry,
            message: '응답이 성공적으로 추가되었습니다.'
        }, { status: 201 });
    } catch (error) {
        console.error('응답 추가 중 오류 발생:', error);
        return NextResponse.json({
            success: false,
            error: '응답 추가 중 오류가 발생했습니다.'
        }, { status: 500 });
    }
} 