import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import {
    getAllInquiries, getInquiryById, getFilteredInquiries,
    addResponseToInquiry, updateInquiryStatus, markInquiryAsRead,
    createInquiry, getUnreadInquiriesCount, deleteInquiry, updateInquiry
} from '@/data/inquiry-data';
import { Inquiry, InquiryResponse, InquiryStatus, InquiryPriority } from '@/types/inquiry';
import { sendInquiryNotification } from '@/lib/email';

/**
 * GET 요청 처리 (문의 목록 또는 특정 문의 조회)
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams?.get('id');
        const type = searchParams?.get('type');
        const status = searchParams?.get('status');
        const priority = searchParams?.get('priority');
        const isRead = searchParams?.get('isRead');
        const search = searchParams?.get('search');
        const page = parseInt(searchParams?.get('page') || '1');
        const limit = parseInt(searchParams?.get('limit') || '10');
        const countOnly = searchParams?.get('countOnly');

        // 미읽은 문의 수만 요청하는 경우
        if (countOnly === 'unread') {
            const unreadCount = await getUnreadInquiriesCount();
            return NextResponse.json({
                success: true,
                unreadCount
            });
        }

        // 특정 문의 조회
        if (id) {
            const inquiry = await getInquiryById(id);
            if (!inquiry) {
                return NextResponse.json({
                    success: false,
                    error: '문의를 찾을 수 없습니다.'
                }, { status: 404 });
            }

            // 조회 시 읽음 상태로 변경
            if (!inquiry.isRead) {
                await markInquiryAsRead(id);
            }

            return NextResponse.json({
                success: true,
                inquiry
            });
        }

        // 필터링된 문의 목록 조회
        const result = await getFilteredInquiries(
            page,
            limit,
            status as InquiryStatus || undefined,
            type as any || undefined,
            priority as any || undefined,
            isRead === 'true' ? true : isRead === 'false' ? false : undefined,
            search || undefined
        );

        return NextResponse.json({
            success: true,
            ...result
        });
    } catch (error) {
        console.error('문의 조회 중 오류 발생:', error);
        return NextResponse.json({
            success: false,
            error: '문의 조회 중 오류가 발생했습니다.'
        }, { status: 500 });
    }
}

/**
 * POST 요청 처리 (새 문의 생성)
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // 필수 필드 검증
        if (!body.title || !body.content || !body.customerName || !body.customerEmail) {
            return NextResponse.json({
                success: false,
                error: '제목, 내용, 고객명, 이메일은 필수입니다.'
            }, { status: 400 });
        }

        // 기본값 설정
        const newInquiryData = {
            ...body,
            status: body.status || 'pending',
            priority: body.priority || 'medium',
            isFeatured: body.isFeatured || false,
            attachments: body.attachments || []
        };

        // 새 문의 생성
        const newInquiry = await createInquiry(newInquiryData);

        // 관리자 알림 이메일 전송
        try {
            // 관리자 이메일 주소 가져오기 (파일에서 읽거나 환경 변수에서 가져올 수 있음)
            // 여기서는 설정 파일에서 가져온다고 가정
            const adminEmail = process.env.ADMIN_EMAIL || 'admin@shfnc.com';

            await sendInquiryNotification(
                {
                    id: newInquiry.id,
                    title: newInquiry.title,
                    customerName: newInquiry.customerName,
                    customerEmail: newInquiry.customerEmail,
                    type: newInquiry.type || '일반 문의',
                    content: newInquiry.content,
                    createdAt: newInquiry.createdAt
                },
                adminEmail
            );
            console.log('문의 알림 이메일이 관리자에게 발송되었습니다:', adminEmail);
        } catch (emailError) {
            // 이메일 발송 실패해도 문의 생성은 성공으로 처리
            console.error('문의 알림 이메일 발송 실패:', emailError);
        }

        return NextResponse.json({
            success: true,
            inquiry: newInquiry,
            message: '문의가 성공적으로 생성되었습니다.'
        }, { status: 201 });
    } catch (error) {
        console.error('문의 생성 중 오류 발생:', error);
        return NextResponse.json({
            success: false,
            error: '문의 생성 중 오류가 발생했습니다.'
        }, { status: 500 });
    }
}

/**
 * PATCH 요청 처리 (문의 정보 업데이트)
 */
export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();

        // ID 확인
        if (!body.id) {
            return NextResponse.json({
                success: false,
                error: '문의 ID가 필요합니다.'
            }, { status: 400 });
        }

        // 문의 존재 확인
        const inquiry = await getInquiryById(body.id);
        if (!inquiry) {
            return NextResponse.json({
                success: false,
                error: '문의를 찾을 수 없습니다.'
            }, { status: 404 });
        }

        // 업데이트할 필드 선택
        const updateData: Partial<Inquiry> = {};
        let message = '';

        // 상태 변경
        if (body.status) {
            updateData.status = body.status;
            message = '문의 상태가 변경되었습니다.';
        }

        // 우선순위 변경
        if (body.priority) {
            updateData.priority = body.priority;
            message = message || '우선순위가 변경되었습니다.';
        }

        // 읽음 상태 변경
        if (body.isRead !== undefined) {
            updateData.isRead = body.isRead;
            message = message || `문의가 ${body.isRead ? '읽음' : '읽지 않음'} 상태로 변경되었습니다.`;
        }

        // 중요 표시 토글
        if (body.isFeatured !== undefined) {
            updateData.isFeatured = body.isFeatured;
            message = message || `문의가 ${body.isFeatured ? '중요' : '일반'} 상태로 변경되었습니다.`;
        }

        // 관리자 메모 업데이트
        if (body.adminNotes !== undefined) {
            updateData.adminNotes = body.adminNotes;
            message = message || '관리자 메모가 업데이트되었습니다.';
        }

        if (Object.keys(updateData).length === 0) {
            return NextResponse.json({
                success: false,
                error: '변경할 속성이 지정되지 않았습니다.'
            }, { status: 400 });
        }

        // 문의 업데이트
        const updatedInquiry = await updateInquiry(body.id, updateData);

        if (!updatedInquiry) {
            return NextResponse.json({
                success: false,
                error: '문의 업데이트 중 오류가 발생했습니다.'
            }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            inquiry: updatedInquiry,
            message
        });
    } catch (error) {
        console.error('문의 수정 중 오류 발생:', error);
        return NextResponse.json({
            success: false,
            error: '문의 수정 중 오류가 발생했습니다.'
        }, { status: 500 });
    }
}

/**
 * DELETE 요청 처리 (문의 삭제)
 */
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams?.get('id');

        if (!id) {
            return NextResponse.json({
                success: false,
                error: '문의 ID가 필요합니다.'
            }, { status: 400 });
        }

        // 문의 존재 확인
        const inquiry = await getInquiryById(id);
        if (!inquiry) {
            return NextResponse.json({
                success: false,
                error: '문의를 찾을 수 없습니다.'
            }, { status: 404 });
        }

        // 문의 삭제
        const result = await deleteInquiry(id);
        if (!result) {
            return NextResponse.json({
                success: false,
                error: '문의 삭제 중 오류가 발생했습니다.'
            }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: '문의가 성공적으로 삭제되었습니다.'
        });
    } catch (error) {
        console.error('문의 삭제 중 오류 발생:', error);
        return NextResponse.json({
            success: false,
            error: '문의 삭제 중 오류가 발생했습니다.'
        }, { status: 500 });
    }
} 