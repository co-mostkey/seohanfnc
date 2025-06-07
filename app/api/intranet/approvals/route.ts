import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';

// [TRISID] 데이터 파일 경로 설정
const dataDir = path.join(process.cwd(), 'data', 'db');
const approvalsFilePath = path.join(dataDir, 'approvals.json');
const usersFilePath = path.join(dataDir, 'intranet-users.json');

// [TRISID] 타입 정의
interface ApprovalStep {
    id: string;
    order: number;
    approverId: string;
    approverName: string;
    approverDepartment: string;
    approverRole: string;
    status: 'pending' | 'approved' | 'rejected' | 'skipped';
    comment?: string;
    processedAt?: string;
}

interface Approval {
    id: string;
    title: string;
    description: string;
    category: string;
    status: 'pending' | 'in_progress' | 'approved' | 'rejected' | 'cancelled';
    priority: 'normal' | 'high';
    requesterId: string;
    requesterName: string;
    requesterDepartment: string;
    createdAt: string;
    dueDate: string;
    approvalLine: ApprovalStep[];
    amount?: number;
}

interface User {
    id: string;
    role: 'user' | 'team_lead' | 'executive' | 'admin';
    name: string;
    department: string;
    position: string;
}

// [TRISID] 클러스터 환경을 고려한 안전한 파일 쓰기 함수
async function safeWriteFile(filePath: string, data: any) {
    const tempFilePath = `${filePath}.${uuidv4()}.tmp`;
    try {
        await fs.writeFile(tempFilePath, JSON.stringify(data, null, 2), 'utf8');
        await fs.rename(tempFilePath, filePath);
    } catch (error) {
        console.error(`[TRISID] 파일 쓰기 오류 (${filePath}):`, error);
        // 임시 파일이 남아있을 경우 삭제
        try {
            await fs.unlink(tempFilePath);
        } catch (unlinkError) {
            // 무시
        }
        throw new Error('파일을 쓰는 도중 오류가 발생했습니다.');
    }
}

// [TRISID] GET: 특정 결재 건 조회
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        const approvalsData = await fs.readFile(approvalsFilePath, 'utf8');
        const approvals: Approval[] = JSON.parse(approvalsData);
        const approval = approvals.find((a) => a.id === id);

        if (!approval) {
            return NextResponse.json({ success: false, error: '결재 건을 찾을 수 없습니다.' }, { status: 404 });
        }

        return NextResponse.json({ success: true, approval });
    } catch (error) {
        console.error('[TRISID] API 오류 (GET /api/intranet/approvals/[id]):', error);
        return NextResponse.json({ success: false, error: '서버 오류가 발생했습니다.' }, { status: 500 });
    }
}

// [TRISID] PUT: 결재 승인/반려 처리
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        const { action, comment, approverId } = await request.json();

        if (!action || !approverId) {
            return NextResponse.json({ success: false, error: '필수 정보가 누락되었습니다.' }, { status: 400 });
        }

        // 모든 데이터 읽기
        const approvalsData = await fs.readFile(approvalsFilePath, 'utf8');
        const approvals: Approval[] = JSON.parse(approvalsData);
        const usersData = await fs.readFile(usersFilePath, 'utf8');
        const users: User[] = JSON.parse(usersData);

        const approvalIndex = approvals.findIndex((a) => a.id === id);
        if (approvalIndex === -1) {
            return NextResponse.json({ success: false, error: '결재 건을 찾을 수 없습니다.' }, { status: 404 });
        }

        const approval = approvals[approvalIndex];
        const approver = users.find(u => u.id === approverId);

        if (!approver) {
            return NextResponse.json({ success: false, error: '승인자 정보를 찾을 수 없습니다.' }, { status: 404 });
        }

        // [TRISID] 관리자 권한 확인
        const isAdmin = approver.role === 'admin';

        const currentStepIndex = approval.approvalLine.findIndex(step => step.status === 'pending');

        // 이미 모든 처리가 완료된 경우
        if (currentStepIndex === -1) {
            return NextResponse.json({ success: false, error: '이미 처리되었거나 진행할 승인 단계가 없습니다.' }, { status: 400 });
        }

        const currentStep = approval.approvalLine[currentStepIndex];

        // [TRISID] 권한 검사: 관리자이거나, 현재 승인 순서가 맞는 사용자인지 확인
        if (!isAdmin && currentStep.approverId !== approverId) {
            return NextResponse.json({ success: false, error: '이 결재를 처리할 권한이 없습니다.' }, { status: 403 });
        }

        // 결재 단계 업데이트
        currentStep.status = action === 'approve' ? 'approved' : 'rejected';
        currentStep.comment = comment;
        currentStep.processedAt = new Date().toISOString();

        // [TRISID] 관리자가 승인 시, 현재 단계의 승인자 정보를 관리자로 덮어쓰기
        if (isAdmin) {
            currentStep.approverId = approver.id;
            currentStep.approverName = approver.name;
            currentStep.approverDepartment = approver.department;
            currentStep.approverRole = approver.position;
        }

        if (action === 'approve') {
            const nextStepIndex = currentStepIndex + 1;
            if (nextStepIndex < approval.approvalLine.length) {
                // 다음 승인 단계가 있으면 '진행중'
                approval.status = 'in_progress';
                approval.approvalLine[nextStepIndex].status = 'pending';
            } else {
                // 마지막 승인이면 '승인됨'
                approval.status = 'approved';
            }
        } else {
            // 반려 시 즉시 '반려됨'으로 상태 변경
            approval.status = 'rejected';
        }

        approvals[approvalIndex] = approval;
        await safeWriteFile(approvalsFilePath, approvals);

        return NextResponse.json({ success: true, message: `결재가 성공적으로 ${action === 'approve' ? '승인' : '반려'}되었습니다.` });
    } catch (error) {
        console.error('[TRISID] API 오류 (PUT /api/intranet/approvals/[id]):', error);
        return NextResponse.json({ success: false, error: '서버 오류가 발생했습니다.' }, { status: 500 });
    }
}

// [TRISID] DELETE: 결재 취소 (요청자만 가능)
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        // 실제 운영에서는 세션/토큰에서 사용자 ID를 추출해야 합니다.
        // const { userId: requesterId } = await getSession();
        // 데모를 위해 임시로 요청 본문에서 ID를 받습니다.
        const { requesterId } = await request.json();
        if (!requesterId) {
            return NextResponse.json({ success: false, error: '요청자 ID가 필요합니다.' }, { status: 401 });
        }

        const { id } = params;
        const approvalsData = await fs.readFile(approvalsFilePath, 'utf8');
        const approvals: Approval[] = JSON.parse(approvalsData);

        const approvalIndex = approvals.findIndex((a) => a.id === id);
        if (approvalIndex === -1) {
            return NextResponse.json({ success: false, error: '결재 건을 찾을 수 없습니다.' }, { status: 404 });
        }

        const approval = approvals[approvalIndex];

        // 요청자 본인만 취소 가능
        if (approval.requesterId !== requesterId) {
            return NextResponse.json({ success: false, error: '결재를 취소할 권한이 없습니다.' }, { status: 403 });
        }

        if (approval.status !== 'pending' && approval.status !== 'in_progress') {
            return NextResponse.json({ success: false, error: '이미 처리 완료된 결재는 취소할 수 없습니다.' }, { status: 400 });
        }

        // 결재 건을 배열에서 삭제
        approvals.splice(approvalIndex, 1);

        await safeWriteFile(approvalsFilePath, approvals);

        return NextResponse.json({ success: true, message: '결재가 성공적으로 취소되었습니다.' });
    } catch (error) {
        console.error('[TRISID] API 오류 (DELETE /api/intranet/approvals/[id]):', error);
        return NextResponse.json({ success: false, error: '서버 오류가 발생했습니다.' }, { status: 500 });
    }
}