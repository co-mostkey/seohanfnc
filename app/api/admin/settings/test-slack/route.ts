import { NextRequest, NextResponse } from 'next/server';
import { sendSlackNotification } from '@/lib/slack-notification';

/**
 * [TRISID] 슬랙 웹훅 테스트 API
 * POST /api/admin/settings/test-slack
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { webhookUrl } = body;

        if (!webhookUrl) {
            return NextResponse.json(
                {
                    success: false,
                    error: '슬랙 웹훅 URL이 필요합니다.'
                },
                { status: 400 }
            );
        }

        // 테스트 메시지 전송
        const result = await sendSlackNotification(webhookUrl, {
            title: '슬랙 알림 테스트',
            content: '서한F&C 관리자 시스템에서 보내는 테스트 메시지입니다.\n설정이 올바르게 구성되었습니다.',
            type: 'success'
        });

        if (result.success) {
            return NextResponse.json({
                success: true,
                message: '슬랙 테스트 메시지가 성공적으로 전송되었습니다.'
            });
        } else {
            return NextResponse.json(
                {
                    success: false,
                    error: result.error || '슬랙 메시지 전송에 실패했습니다.'
                },
                { status: 400 }
            );
        }
    } catch (error) {
        console.error('슬랙 테스트 API 오류:', error);
        return NextResponse.json(
            {
                success: false,
                error: '슬랙 테스트 중 오류가 발생했습니다.',
                details: error instanceof Error ? error.message : String(error)
            },
            { status: 500 }
        );
    }
} 