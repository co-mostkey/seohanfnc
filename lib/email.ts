/**
 * 이메일 발송 기능을 담당하는 모듈
 * nodemailer 라이브러리를 사용하여 SMTP를 통한 이메일 발송 지원
 */
import 'server-only';
import nodemailer from 'nodemailer';
import { createHash } from 'crypto';

// 이메일 발송 설정 타입
interface EmailConfig {
    host: string;
    port: number;
    secure: boolean;
    auth: {
        user: string;
        pass: string;
    };
}

// 이메일 내용 타입
export interface EmailContent {
    to: string | string[];
    subject: string;
    text?: string;
    html?: string;
    from?: string;
    replyTo?: string;
    attachments?: Array<{
        filename: string;
        content: Buffer | string;
        path?: string;
        contentType?: string;
    }>;
}

// 이메일 발송 결과 타입
export interface EmailResult {
    success: boolean;
    messageId?: string;
    error?: Error | string;
}

// 환경 변수에서 이메일 설정 로드
const getEmailConfig = (): EmailConfig => {
    // 환경 변수에서 설정 로드 (기본값 제공)
    return {
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.EMAIL_PORT || '587', 10),
        secure: process.env.EMAIL_SECURE === 'true',
        auth: {
            user: process.env.EMAIL_USER || '',
            pass: process.env.EMAIL_PASSWORD || ''
        }
    };
};

// 트랜스포터 캐싱
let cachedTransporter: nodemailer.Transporter | null = null;

// 트랜스포터 생성 또는 캐시에서 가져오기
const getTransporter = async (): Promise<nodemailer.Transporter> => {
    if (cachedTransporter) {
        return cachedTransporter;
    }

    const config = getEmailConfig();

    // 테스트 계정을 사용하는 경우
    if (!config.auth.user || !config.auth.pass) {
        console.warn('이메일 인증 정보가 없어 테스트 계정을 사용합니다.');
        const testAccount = await nodemailer.createTestAccount();
        config.host = 'smtp.ethereal.email';
        config.port = 587;
        config.secure = false;
        config.auth.user = testAccount.user;
        config.auth.pass = testAccount.pass;
    }

    const transporter = nodemailer.createTransport(config);
    cachedTransporter = transporter;
    return transporter;
};

/**
 * 이메일 발송 함수
 * @param content 이메일 내용
 * @returns 발송 결과
 */
export async function sendEmail(content: EmailContent): Promise<EmailResult> {
    try {
        // 발신자 이메일이 없으면 환경 변수에서 가져오기
        const from = content.from || `${process.env.EMAIL_FROM_NAME || '서한F&C'} <${process.env.EMAIL_FROM || 'noreply@shfnc.com'}>`;

        const transporter = await getTransporter();

        const emailOptions = {
            from,
            to: content.to,
            subject: content.subject,
            text: content.text,
            html: content.html,
            replyTo: content.replyTo,
            attachments: content.attachments,
        };

        const info = await transporter.sendMail(emailOptions);

        // 테스트 계정을 사용하는 경우 미리보기 URL 출력
        if (process.env.NODE_ENV !== 'production' && info.messageId) {
            console.log('이메일 미리보기:', nodemailer.getTestMessageUrl(info));
        }

        return {
            success: true,
            messageId: info.messageId
        };
    } catch (error) {
        console.error('이메일 발송 실패:', error);
        return {
            success: false,
            error: error instanceof Error ? error : new Error(String(error))
        };
    }
}

/**
 * 문의 접수 알림 이메일 발송
 * @param inquiryData 문의 데이터
 * @returns 발송 결과
 */
export async function sendInquiryNotification(inquiryData: {
    id: string;
    title: string;
    customerName: string;
    customerEmail: string;
    type: string;
    content: string;
    createdAt: string | Date;
}, adminEmail: string): Promise<EmailResult> {
    const subject = `[서한F&C] 새로운 문의가 접수되었습니다: ${inquiryData.title}`;

    // 기본 HTML 템플릿
    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
      <h2 style="color: #333; border-bottom: 2px solid #f0f0f0; padding-bottom: 10px;">새로운 문의가 접수되었습니다</h2>
      
      <div style="background: #f9f9f9; padding: 15px; border-radius: 4px; margin: 15px 0;">
        <p><strong>제목:</strong> ${inquiryData.title}</p>
        <p><strong>고객명:</strong> ${inquiryData.customerName}</p>
        <p><strong>고객 이메일:</strong> ${inquiryData.customerEmail}</p>
        <p><strong>문의 유형:</strong> ${inquiryData.type}</p>
        <p><strong>접수 일시:</strong> ${new Date(inquiryData.createdAt).toLocaleString('ko-KR')}</p>
      </div>
      
      <div style="margin: 20px 0;">
        <h3 style="color: #444;">문의 내용</h3>
        <div style="background: #fff; border: 1px solid #eee; padding: 15px; border-radius: 4px;">
          <p>${inquiryData.content.replace(/\n/g, '<br/>')}</p>
        </div>
      </div>
      
      <div style="margin-top: 30px; text-align: center;">
        <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://seohanfnc.com'}/admin/inquiries/${inquiryData.id}" 
           style="display: inline-block; background-color: #e65100; color: white; padding: 10px 20px; 
                  text-decoration: none; border-radius: 4px; font-weight: bold;">
          관리자 페이지에서 확인하기
        </a>
      </div>
      
      <p style="color: #888; font-size: 12px; margin-top: 30px; text-align: center;">
        이 이메일은 자동으로 발송되었습니다. 회신하지 마세요.
      </p>
    </div>
  `;

    return await sendEmail({
        to: adminEmail,
        subject,
        html
    });
}

/**
 * 문의 응답 알림 이메일 발송
 * @param inquiryData 문의 데이터
 * @param responseData 응답 데이터
 * @returns 발송 결과
 */
export async function sendInquiryResponseNotification(
    inquiryData: {
        id: string;
        title: string;
        customerName: string;
        customerEmail: string;
    },
    responseData: {
        content: string;
        author: string;
        createdAt: string | Date;
    }
): Promise<EmailResult> {
    const subject = `[서한F&C] 문의에 대한 답변이 등록되었습니다: ${inquiryData.title}`;

    // 기본 HTML 템플릿
    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
      <h2 style="color: #333; border-bottom: 2px solid #f0f0f0; padding-bottom: 10px;">문의에 대한 답변이 등록되었습니다</h2>
      
      <p style="margin-top: 20px;">안녕하세요, ${inquiryData.customerName}님.</p>
      <p>문의하신 내용에 대한 답변이 등록되었습니다.</p>
      
      <div style="background: #f9f9f9; padding: 15px; border-radius: 4px; margin: 15px 0;">
        <p><strong>문의 제목:</strong> ${inquiryData.title}</p>
        <p><strong>답변 작성자:</strong> ${responseData.author}</p>
        <p><strong>답변 일시:</strong> ${new Date(responseData.createdAt).toLocaleString('ko-KR')}</p>
      </div>
      
      <div style="margin: 20px 0;">
        <h3 style="color: #444;">답변 내용</h3>
        <div style="background: #fff; border: 1px solid #eee; padding: 15px; border-radius: 4px;">
          <p>${responseData.content.replace(/\n/g, '<br/>')}</p>
        </div>
      </div>
      
      <p style="margin-top: 20px;">추가 문의사항이 있으시면 언제든지 연락주시기 바랍니다.</p>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
        <p style="font-size: 13px; color: #666;">
          감사합니다.<br>
          서한F&C 고객지원팀
        </p>
      </div>
    </div>
  `;

    return await sendEmail({
        to: inquiryData.customerEmail,
        subject,
        html
    });
} 