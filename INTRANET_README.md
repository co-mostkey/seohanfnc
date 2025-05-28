# 서한F&C 인트라넷 시스템 사용 설명서

## 개요

서한F&C 인트라넷은 직원 전용 내부 업무 시스템입니다. 홈페이지와 연동되어 있지만 별도의 인증 체계를 사용합니다.

## 접속 정보

### 인트라넷 관리자 계정
- **URL**: `/intranet/login`
- **사용자명**: `intranet_admin`
- **비밀번호**: `admin123!@#`
- **권한**: 인트라넷 전체 관리, 사용자 계정 승인/거절

### 일반 직원 계정
- 인트라넷 관리자의 승인을 받아야 사용 가능
- 계정 신청: `/intranet/register`

## 주요 기능

### 1. 인트라넷 대시보드 (`/intranet`)
- 공지사항 확인
- 일정 관리
- 할 일 목록
- 팀원 현황
- 최근 문서

### 2. 인트라넷 관리자 기능 (`/intranet/admin/users`)
- 계정 신청 승인/거절
- 사용자 활성화/비활성화
- 전체 사용자 관리

### 3. 계정 신청 프로세스
1. 직원이 `/intranet/register`에서 계정 신청
2. 인트라넷 관리자가 신청 내용 검토
3. 승인 시 직원은 로그인 가능
4. 거절 시 거절 사유와 함께 통보

### 4. 주요 메뉴
- **공지사항**: `/intranet/notices` - 사내 공지 확인
- **임직원 목록**: `/intranet/members` - 직원 정보 및 연락처
- **문서함**: `/intranet/documents` - 사내 문서 관리
- **일정 관리**: `/intranet/calendar` - 회의 및 일정 확인
- **프로젝트**: `/intranet/projects` - 프로젝트 현황
- **메시지**: `/intranet/messages` - 직원 간 메시지

## 보안 및 접근 제어

### 인증 체계
- 인트라넷은 홈페이지와 별도의 인증 시스템 사용
- 세션 기반 인증 (7일 유지)
- 쿠키: `intranetSessionId`, `isIntranetAuthenticated`

### 권한 레벨
1. **인트라넷관리자**: 전체 시스템 관리 권한
2. **팀장**: 팀 관리 권한
3. **직원**: 기본 접근 권한

## 데이터 관리

### 파일 기반 시스템
- 모든 데이터는 파일 시스템 기반으로 관리
- 데이터 위치: `/data/db/intranet-users.json`
- 자동 백업 기능 포함

### 더미 데이터 제거
- 실제 운영 시작 전 `/data/intranetDashboardData.ts`의 샘플 데이터 삭제 또는 수정 필요

## API 엔드포인트

### 인증 관련
- `POST /api/auth/intranet-login` - 로그인
- `POST /api/auth/intranet-register` - 계정 신청
- `POST /api/auth/intranet-logout` - 로그아웃

### 관리자 API
- `GET /api/intranet/admin/users` - 사용자 목록 조회
- `POST /api/intranet/admin/users/approve` - 계정 승인
- `POST /api/intranet/admin/users/reject` - 계정 거절
- `PUT /api/intranet/admin/users/{id}/toggle-status` - 사용자 상태 변경

## 배포 전 체크리스트

- [x] 인트라넷 인증 시스템 구축
- [x] 계정 신청/승인 시스템 구축
- [x] 인트라넷 관리자 페이지 구축
- [x] 접근 제어 미들웨어 설정
- [ ] 실제 비밀번호로 변경 (현재 테스트용)
- [ ] 더미 데이터 제거 또는 실제 데이터로 교체
- [ ] 환경 변수 설정 (production 모드)
- [ ] SSL/HTTPS 설정
- [ ] 로그 시스템 구축

## 문제 해결

### 로그인이 안 되는 경우
1. 쿠키 삭제 후 재시도
2. 계정 활성화 상태 확인
3. 올바른 사용자명/비밀번호 확인

### 접근 권한 오류
1. 세션 만료 확인 (7일)
2. 사용자 권한 레벨 확인
3. 인트라넷 관리자에게 문의

## 기술 지원

문제 발생 시 IT팀 또는 인트라넷 관리자에게 문의하세요. 