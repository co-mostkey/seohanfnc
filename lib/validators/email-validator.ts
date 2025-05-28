/**
 * 이메일 유효성 검사 함수
 * @param email 검사할 이메일 주소
 * @returns 유효성 검사 결과
 */
export function validateEmail(email: string): { valid: boolean; message?: string } {
  if (!email || email.trim() === '') {
    return { valid: false, message: '이메일 주소를 입력해주세요.' };
  }

  // RFC 5322 표준을 준수하는 이메일 정규식
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  
  if (!emailRegex.test(email)) {
    return { valid: false, message: '유효한 이메일 주소 형식이 아닙니다.' };
  }

  return { valid: true };
}

/**
 * 전화번호 유효성 검사 함수
 * @param phone 검사할 전화번호
 * @returns 유효성 검사 결과
 */
export function validatePhone(phone: string): { valid: boolean; message?: string } {
  if (!phone || phone.trim() === '') {
    return { valid: false, message: '전화번호를 입력해주세요.' };
  }

  // 국내 전화번호 정규식 (02-1234-5678, 010-1234-5678, 032-123-4567 등 다양한 형식 지원)
  const phoneRegex = /^(0[0-9]{1,2})-?([0-9]{3,4})-?([0-9]{4})$/;
  
  // 전화번호에서 공백 제거
  const cleanedPhone = phone.replace(/\s+/g, '');
  
  if (!phoneRegex.test(cleanedPhone)) {
    return { valid: false, message: '유효한 전화번호 형식이 아닙니다.' };
  }

  return { valid: true };
}

/**
 * 알림 설정 유효성 검사 함수
 * @param settings 알림 설정 객체
 * @returns 유효성 검사 결과
 */
export function validateNotificationSettings(settings: {
  email: string;
  phone: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  messageNotifications: boolean;
}): { valid: boolean; field?: string; message?: string } {
  // 이메일 유효성 검사
  if (settings.email) {
    const emailResult = validateEmail(settings.email);
    if (!emailResult.valid) {
      return { valid: false, field: 'email', message: emailResult.message };
    }
  }

  // 전화번호 유효성 검사
  if (settings.phone) {
    const phoneResult = validatePhone(settings.phone);
    if (!phoneResult.valid) {
      return { valid: false, field: 'phone', message: phoneResult.message };
    }
  }

  return { valid: true };
} 