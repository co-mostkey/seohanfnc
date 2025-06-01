"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function IntranetAdminPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const checkSession = async () => {
            setLoading(true);
            try {
                const res = await fetch("/api/intranet/user/current", { credentials: "include" });
                const data = await res.json();
                if (data.success && data.user) {
                    setUser(data.user.username || data.user.id);
                    // 실제 사용자 객체의 role 또는 permissions를 기반으로 isAdmin 설정
                    setIsAdmin(data.user.role === '인트라넷관리자'); // 가정: user 객체에 role 필드가 있고, 관리자는 '인트라넷관리자'
                } else {
                    setIsAdmin(false); // 세션 없거나 사용자 정보 없으면 isAdmin false
                }
            } catch {
                setIsAdmin(false);
            } finally {
                setLoading(false);
            }
        };
        checkSession();
    }, [router]);

    useEffect(() => {
        // 로딩이 끝난 후, 인증 상태 및 관리자 권한에 따라 리다이렉트 처리
        if (!loading) {
            if (!user) { // 세션이 아예 없는 경우 (checkSession에서 user가 null로 남음)
                router.replace("/intranet/login");
            } else if (!isAdmin) { // 세션은 있으나 관리자가 아닌 경우
                router.replace("/intranet");
            }
        }
    }, [loading, user, isAdmin, router]);

    const handleLogout = async () => {
        await fetch("/api/auth/intranet-logout", { method: "POST", credentials: "include" });
        router.replace("/intranet/login");
    };

    if (loading || !isAdmin) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
                {/* 로딩 중이거나 권한 없을 때 간단한 메시지 또는 스피너 표시 */}
                {/* <div className="text-white text-lg">권한 확인 중...</div> */}
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-4">
            <div className="w-full max-w-2xl bg-black/80 backdrop-blur-lg rounded-xl shadow-2xl p-8 border border-gray-700/60">
                <h1 className="text-2xl font-bold text-white mb-4">인트라넷 관리자 메뉴</h1>
                <p className="text-gray-300 mb-6">관리자 권한으로 접속하셨습니다. (사용자 ID: {user})</p>
                <div className="flex gap-4 mb-8">
                    <Button onClick={() => router.push("/intranet")}>인트라넷 대시보드</Button>
                    <Button onClick={handleLogout} variant="destructive">로그아웃</Button>
                </div>
                <div className="bg-gray-800 rounded-lg p-6 text-gray-200">
                    <h2 className="text-lg font-semibold mb-2">관리자 주요 기능 안내</h2>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>사내 계정/권한 관리</li>
                        <li>인트라넷 콘텐츠/자료 관리</li>
                        <li>시스템 설정, 로그, 통계 등</li>
                    </ul>
                </div>
            </div>
        </div>
    );
} 