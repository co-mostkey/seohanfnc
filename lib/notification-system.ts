/**
 * 통합 알림 시스템
 * [TRISID] 2024-12-19: 이메일, 슬랙, 로그 통합 알림 처리
 */

import { sendEmail } from '@/lib/email';
import { sendSlackNotification } from '@/lib/slack-notification';
import fs from 'fs/promises';
import path from 'path';

export interface NotificationData {
    id?: string;
    type: 'inquiry' | 'system' | 'error' | 'backup' | 'user';
    title: string;
    content: string;
    data?: any;
    createdAt?: string;
    status?: 'pending' | 'sent' | 'failed';
    error?: string;
}

const QUEUE_FILE = path.join(process.cwd(), 'data/db/notification-queue.json');
const SETTINGS_FILE = path.join(process.cwd(), 'data/settings.json');

// 간단한 ID 생성기
function generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// 설정 파일 읽기
async function getSettings() {
    try {
        const content = await fs.readFile(SETTINGS_FILE, 'utf8');
        return JSON.parse(content);
    } catch (error) {
        console.error('설정 파일 읽기 실패:', error);
        return null;
    }
}

// 큐 파일 읽기
async function readQueue(): Promise<NotificationData[]> {
    try {
        const content = await fs.readFile(QUEUE_FILE, 'utf8');
        return JSON.parse(content);
    } catch (error) {
        console.log('큐 파일이 없거나 읽기 실패, 빈 배열 반환');
        return [];
    }
}

// 큐 파일 저장
async function writeQueue(queue: NotificationData[]): Promise<void> {
    try {
        await fs.writeFile(QUEUE_FILE, JSON.stringify(queue, null, 2), 'utf8');
    } catch (error) {
        console.error('큐 파일 저장 실패:', error);
        throw error;
    }
}

/**
 * 알림을 큐에 추가
 * @param notification 알림 데이터
 */
export async function addNotificationToQueue(notification: NotificationData): Promise<void> {
    try {
        const queue = await readQueue();

        const newNotification: NotificationData = {
            ...notification,
            id: generateId(),
            createdAt: new Date().toISOString(),
            status: 'pending'
        };

        queue.push(newNotification);
        await writeQueue(queue);

        console.log('알림이 큐에 추가되었습니다:', newNotification.id);
    } catch (error) {
        console.error('알림 큐 추가 실패:', error);
        throw error;
    }
}

/**
 * 즉시 알림 전송 (큐를 거치지 않음)
 * @param notification 알림 데이터
 */
export async function sendNotificationNow(notification: NotificationData): Promise<boolean> {
    const settings = await getSettings();

    if (!settings) {
        console.error('설정을 불러올 수 없어 알림을 전송할 수 없습니다.');
        return false;
    }

    let emailSent = false;
    let slackSent = false;

    try {
        // 이메일 알림
        if (settings.notifications.emailNotifications && settings.notifications.notificationEmail) {
            const emailResult = await sendEmail({
                to: settings.notifications.notificationEmail,
                subject: `[서한F&C] ${notification.title}`,
                html: generateEmailTemplate(notification)
            });

            emailSent = emailResult.success;
            if (emailSent) {
                console.log('이메일 알림 전송 성공');
            } else {
                console.error('이메일 알림 전송 실패:', emailResult.error);
            }
        }

        // 슬랙 알림
        if (settings.notifications.slackWebhook) {
            const slackResult = await sendSlackNotification(settings.notifications.slackWebhook, {
                title: notification.title,
                content: notification.content,
                type: notification.type === 'error' ? 'error' : 'info'
            });

            slackSent = slackResult.success;
            if (slackSent) {
                console.log('슬랙 알림 전송 성공');
            } else {
                console.error('슬랙 알림 전송 실패:', slackResult.error);
            }
        }

        // 로그 저장
        await saveNotificationLog(notification);

        return emailSent || slackSent;
    } catch (error) {
        console.error('알림 전송 중 오류:', error);
        return false;
    }
}

/**
 * 문의 접수 알림
 * @param inquiryData 문의 데이터
 */
export async function sendInquiryNotification(inquiryData: {
    id: string;
    title: string;
    customerName: string;
    customerEmail: string;
    type: string;
}): Promise<void> {
    const notification: NotificationData = {
        type: 'inquiry',
        title: '새로운 문의가 접수되었습니다',
        content: `제목: ${inquiryData.title}\n고객명: ${inquiryData.customerName}\n이메일: ${inquiryData.customerEmail}\n유형: ${inquiryData.type}`,
        data: inquiryData
    };

    await addNotificationToQueue(notification);
    // 문의는 즉시 전송도 함
    await sendNotificationNow(notification);
}

/**
 * 시스템 알림
 * @param title 제목
 * @param content 내용
 * @param level 레벨
 */
export async function sendSystemNotification(
    title: string,
    content: string,
    level: 'info' | 'warning' | 'error' = 'info'
): Promise<void> {
    const notification: NotificationData = {
        type: 'system',
        title: `[시스템] ${title}`,
        content
    };

    if (level === 'error') {
        // 에러는 즉시 전송
        await sendNotificationNow(notification);
    } else {
        // 일반 시스템 알림은 큐에 추가
        await addNotificationToQueue(notification);
    }
}

/**
 * 이메일 템플릿 생성
 * @param notification 알림 데이터
 * @returns HTML 템플릿
 */
function generateEmailTemplate(notification: NotificationData): string {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://seohanfc.com';

    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
      <h2 style="color: #333; border-bottom: 2px solid #f0f0f0; padding-bottom: 10px;">${notification.title}</h2>
      
      <div style="background: #f9f9f9; padding: 15px; border-radius: 4px; margin: 15px 0;">
        <p><strong>알림 유형:</strong> ${notification.type.toUpperCase()}</p>
        <p><strong>발생 시간:</strong> ${new Date(notification.createdAt || new Date()).toLocaleString('ko-KR')}</p>
      </div>
      
      <div style="margin: 20px 0;">
        <h3 style="color: #444;">내용</h3>
        <div style="background: #fff; border: 1px solid #eee; padding: 15px; border-radius: 4px;">
          <p>${notification.content.replace(/\n/g, '<br/>')}</p>
        </div>
      </div>
      
      <div style="margin-top: 30px; text-align: center;">
        <a href="${baseUrl}/admin" 
           style="display: inline-block; background-color: #e65100; color: white; padding: 10px 20px; 
                  text-decoration: none; border-radius: 4px; font-weight: bold;">
          관리자 페이지로 이동
        </a>
      </div>
      
      <p style="color: #888; font-size: 12px; margin-top: 30px; text-align: center;">
        이 이메일은 자동으로 발송되었습니다.
      </p>
    </div>
  `;
}

/**
 * 알림 로그 저장
 * @param notification 알림 데이터
 */
async function saveNotificationLog(notification: NotificationData): Promise<void> {
    try {
        const logFile = path.join(process.cwd(), 'data/db/notification-logs.json');
        let logs: any[] = [];

        try {
            const content = await fs.readFile(logFile, 'utf8');
            logs = JSON.parse(content);
        } catch {
            // 파일이 없으면 빈 배열로 시작
        }

        logs.push({
            ...notification,
            loggedAt: new Date().toISOString()
        });

        // 최근 1000개 로그만 유지
        if (logs.length > 1000) {
            logs = logs.slice(-1000);
        }

        await fs.writeFile(logFile, JSON.stringify(logs, null, 2), 'utf8');
    } catch (error) {
        console.error('알림 로그 저장 실패:', error);
    }
} 