import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';
import { validateEmail } from '@/lib/validators/email-validator';

/**
 * 테스트 이메일 발송 엔드포인트
 * POST /api/admin/settings/test-email
 */
export async function POST(request: NextRequest) {
    try {
        const data = await request.json();
        const { email } = data;

        // 이메일 주소 유효성 검사
        if (!email) {
            return NextResponse.json({ error: '이메일 주소는 필수입니다.' }, { status: 400 });
        }

        const emailValidation = validateEmail(email);
        if (!emailValidation.valid) {
            return NextResponse.json({ error: emailValidation.message }, { status: 400 });
        }

        // 테스트 이메일 발송
        const result = await sendEmail({
            to: email,
            subject: '[서한F&C] 테스트 이메일입니다',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
          <h2 style="color: #333; border-bottom: 2px solid #f0f0f0; padding-bottom: 10px;">서한F&C 테스트 이메일</h2>
          
          <p style="margin-top: 20px;">안녕하세요,</p>
          <p>이 이메일은 서한F&C 관리자 시스템에서 발송된 테스트 이메일입니다.</p>
          
          <div style="margin: 20px 0; padding: 15px; background-color: #f9f9f9; border-radius: 4px;">
            <p>이메일 알림 기능이 정상적으로 작동하고 있습니다.</p>
            <p>이 이메일을 받으셨다면, 서한F&C 알림 시스템이 올바르게 설정되어 있음을 의미합니다.</p>
          </div>
          
          <p>추가 설정이 필요하시면 관리자 페이지에서 진행해 주세요.</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="font-size: 13px; color: #666;">
              감사합니다.<br>
              서한F&C 관리자 시스템
            </p>
            <p style="font-size: 11px; color: #999; margin-top: 10px;">
              이 이메일은 ${new Date().toLocaleString('ko-KR')}에 발송되었습니다.<br>
              이 이메일은 자동 발송되었으므로 회신하지 마세요.
            </p>
          </div>
        </div>
      `
        });

        if (!result.success) {
            console.error('테스트 이메일 발송 실패:', result.error);
            return NextResponse.json({ error: '이메일 발송에 실패했습니다. 관리자에게 문의하세요.' }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: '테스트 이메일이 발송되었습니다.' });
    } catch (error) {
        console.error('테스트 이메일 처리 중 오류:', error);
        return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
    }
} 