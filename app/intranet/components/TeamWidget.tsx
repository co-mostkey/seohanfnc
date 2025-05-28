import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Users, ExternalLink, User as UserIconL, ChevronRight, LucideIcon } from 'lucide-react'; // UserIconL로 별칭, LucideIcon 추가
import type { TeamMember } from '@/data/intranetDashboardData';
import { getStatusStyle } from '@/lib/intranetUtils';

interface TeamWidgetProps {
    members: TeamMember[];
}

export const TeamWidget: React.FC<TeamWidgetProps> = ({ members }) => {
    const displayMembers = members.slice(0, 8); // 최대 8명 표시

    return (
        <div className="bg-black/30 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden shadow-lg">
            <div className="flex items-center justify-between p-4 border-b border-white/10">
                <h3 className="font-semibold text-white flex items-center">
                    <Users className="h-5 w-5 mr-2 text-blue-400" />
                    <span>팀원 목록</span>
                </h3>
                <Link
                    href="/intranet/members"
                    className="text-blue-400 hover:text-blue-300 text-sm flex items-center"
                >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    <span>전체보기</span>
                </Link>
            </div>
            <div className="p-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {displayMembers.map((member) => {
                        const statusMeta = getStatusStyle(member.status);
                        const IconC = statusMeta.icon as LucideIcon; // 타입 단언
                        const borderClass = statusMeta.bgColor ? statusMeta.bgColor.replace('bg-', 'border-') : 'border-gray-600';
                        return (
                            <Link
                                href={`/intranet/members/${member.id}`}
                                key={`team-member-${member.id}`}
                                className="group relative flex flex-col items-center text-center p-3 rounded-lg hover:bg-white/5 transition-colors"
                            >
                                <div className={`w-14 h-14 relative rounded-full mb-2 overflow-hidden border-2 ${borderClass}`}>
                                    <div className="w-full h-full rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                                        {member.avatar ? (
                                            <Image src={member.avatar} alt={member.name} width={56} height={56} className="rounded-full object-cover" />
                                        ) : (
                                            (<UserIconL className="h-7 w-7 text-gray-400" />) // lucide-react의 User 아이콘 사용
                                        )}
                                    </div>
                                    <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full flex items-center justify-center ${statusMeta.bgColor} border-2 border-gray-800`}>
                                        {IconC && React.createElement(IconC, { className: `h-2.5 w-2.5 ${statusMeta.color.replace('text-', 'text-white/')}` })}
                                    </div>
                                </div>
                                <p className="text-white text-sm font-medium group-hover:text-blue-200 transition-colors line-clamp-1">
                                    {member.name}
                                </p>
                                <p className="text-gray-400 text-xs line-clamp-1">
                                    {member.position}
                                </p>
                            </Link>
                        );
                    })}
                </div>

                {members.length > 8 && (
                    <div className="mt-4 text-center">
                        <Link
                            href="/intranet/members"
                            className="inline-flex items-center text-sm text-blue-400 hover:text-blue-300"
                        >
                            <span>전체 팀원 보기</span>
                            <ChevronRight className="h-4 w-4 ml-1" />
                        </Link>
                    </div>
                )}
                {displayMembers.length === 0 && members.length === 0 && (
                    <div className="text-center py-6 text-gray-400">
                        <Users className="h-10 w-10 mx-auto mb-2 text-gray-500" />
                        팀원이 없습니다.
                    </div>
                )}
            </div>
        </div>
    );
}; 