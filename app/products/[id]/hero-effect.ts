/**
 * 제품 상세 페이지 히어로 섹션에 마우스 움직임 효과를 적용하는 유틸리티 함수
 */

export const initHeroEffect = (): (() => void) | null => {
  // DOM 요소 가져오기
  const heroSection = document.querySelector('.hero-section') as HTMLElement;
  if (!heroSection) return null;
  
  const mouseGlow = document.getElementById('mouseGlow') as HTMLElement;
  const heroImage = heroSection.querySelector('img') as HTMLElement;
  
  if (!mouseGlow || !heroImage) return null;
  
  // 마우스 이동 이벤트 핸들러
  const handleMouseMove = (e: MouseEvent) => {
    const rect = heroSection.getBoundingClientRect();
    
    // 요소 내에서의 마우스 상대 위치 계산
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // 마우스 위치에 따른 발광 효과 이동
    mouseGlow.style.transform = `translate(${x}px, ${y}px)`;
    mouseGlow.style.opacity = '0.7';
    
    // 이미지에 미세한 시차 효과 적용
    const moveX = (x - rect.width / 2) / 30;
    const moveY = (y - rect.height / 2) / 30;
    heroImage.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.05)`;
    
    // 그라데이션 색상 변경을 위한 CSS 변수 업데이트
    const gradientStrength = Math.min(100, (x / rect.width) * 100);
    heroSection.style.setProperty('--gradient-position', `${gradientStrength}%`);
  };
  
  // 마우스가 영역을 떠날 때 효과 초기화
  const handleMouseLeave = () => {
    mouseGlow.style.opacity = '0';
    heroImage.style.transform = 'scale(1.05)';
  };
  
  // 이벤트 리스너 등록
  heroSection.addEventListener('mousemove', handleMouseMove);
  heroSection.addEventListener('mouseleave', handleMouseLeave);
  
  // 물결 효과 파티클 생성
  createWaveEffect(heroSection);
  
  return () => {
    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    heroSection.removeEventListener('mousemove', handleMouseMove);
    heroSection.removeEventListener('mouseleave', handleMouseLeave);
  };
};

// 물결 효과를 위한 파티클 생성 함수
const createWaveEffect = (container: HTMLElement) => {
  // 기존 파티클 제거
  const existingParticles = container.querySelectorAll('.wave-particle');
  existingParticles.forEach(particle => particle.remove());
  
  // 새 파티클 컨테이너 생성
  const particleContainer = window.document.createElement('div');
  particleContainer.className = 'absolute inset-0 overflow-hidden pointer-events-none z-20';
  
  // 20개의 랜덤 파티클 생성
  for (let i = 0; i < 20; i++) {
    const particle = window.document.createElement('div');
    particle.className = 'wave-particle absolute rounded-full bg-white/10 blur-md';
    
    // 랜덤 크기 및 위치 설정
    const size = Math.random() * 100 + 50;
    const left = Math.random() * 100;
    const top = Math.random() * 100;
    const delay = Math.random() * 5;
    const duration = 5 + Math.random() * 10;
    
    // 스타일 적용
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${left}%`;
    particle.style.top = `${top}%`;
    particle.style.opacity = '0';
    particle.style.transform = 'scale(0)';
    particle.style.animation = `waveFloat ${duration}s ease-in-out ${delay}s infinite alternate`;
    
    particleContainer.appendChild(particle);
  }
  
  // 스타일 요소 생성 및 추가
  const styleElement = window.document.createElement('style');
  styleElement.textContent = `
    @keyframes waveFloat {
      0% {
        transform: translate(0, 0) scale(0);
        opacity: 0;
      }
      50% {
        opacity: 0.3;
      }
      100% {
        transform: translate(20px, -20px) scale(1);
        opacity: 0;
      }
    }
  `;
  
  document.head.appendChild(styleElement);
  container.appendChild(particleContainer);
};
