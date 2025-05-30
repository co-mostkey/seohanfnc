"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const COOKIE_KEY = "cookie_consent";

export default function GatePage() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (localStorage.getItem(COOKIE_KEY) === "agree") {
        router.replace("/");
      }
    }
  }, [router]);

  const handleConsent = () => {
    localStorage.setItem(COOKIE_KEY, "agree");
    router.replace("/");
  };

  const handleDeny = () => {
    localStorage.setItem(COOKIE_KEY, "deny");
    alert("쿠키 동의가 필요합니다. 동의하지 않으면 홈페이지의 모든 기능을 이용하실 수 없습니다. 다시 동의하실 수 있습니다.");
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-black via-gray-900 to-green-950 text-white px-4">
      {/* 메인 타이틀 비주얼 강화 - 한 줄, 더 크게 */}
      <div className="mb-8 flex flex-col items-center select-none w-full">
        <div className="text-4xl md:text-6xl font-extrabold tracking-tight text-green-400 drop-shadow-lg mb-2 w-full text-center" style={{letterSpacing: '0.05em', wordBreak: 'keep-all'}}>
          서한에프앤씨
        </div>
        <div className="w-20 h-1 rounded-full bg-green-500 mb-2 animate-pulse" />
        <div className="text-2xl md:text-3xl font-bold text-white/90 tracking-wide text-center drop-shadow-sm">
          쿠키 동의 안내
        </div>
      </div>
      {/* 안내문구 - 한 줄, 반응형, 잘림 방지 */}
      <div className="text-base md:text-lg text-gray-200 mb-8 text-center max-w-md font-medium shadow-sm bg-black/30 rounded-xl px-4 py-3">
        <span className="block w-full text-center" style={{wordBreak: 'keep-all'}}>
          서한에프앤씨는 고객의 안전과 신뢰를 최우선으로 생각합니다.
        </span>
      </div>
      {/* 버튼 영역 */}
      <div className="flex flex-col md:flex-row gap-3 w-full max-w-xs mb-4">
        <button
          className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg shadow-lg text-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
          onClick={handleConsent}
        >
          쿠키 동의하고 입장
        </button>
        <button
          className="flex-1 bg-gray-700 hover:bg-gray-800 text-gray-200 font-semibold py-3 rounded-lg shadow-lg text-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
          onClick={handleDeny}
        >
          거부
        </button>
      </div>
      {/* 버튼 아래 안내문구 - 초소형, 반응형, 잘림 방지 */}
      <div className="mt-2 mb-8 flex flex-col items-center gap-1 w-full max-w-md">
        <span className="block w-full text-center text-xs md:text-sm text-gray-400" style={{wordBreak: 'keep-all'}}>
          본 홈페이지는 개인정보 보호와 서비스 품질 향상을 위해 쿠키를 사용합니다.
        </span>
        <span className="block w-full text-center text-xs md:text-sm text-gray-500" style={{wordBreak: 'keep-all'}}>
          동의하셔야 홈페이지를 이용하실 수 있습니다.
        </span>
      </div>
      {/* 하단 안내: 개인정보처리방침 + 다크모드/친환경 */}
      <div className="mt-8 flex flex-col items-center gap-2 w-full">
        <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-400 underline hover:text-green-400 transition-colors mb-1">개인정보처리방침 보기</a>
        <div className="text-xs text-green-900/80 italic text-center">
          본 사이트는 다크모드 기반으로, 친환경적이고 에너지 효율적인 웹 경험을 제공합니다.
        </div>
      </div>
    </div>
  );
}
