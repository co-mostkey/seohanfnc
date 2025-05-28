import { Metadata } from 'next';

export const metadata: Metadata = {
    title: '고객지원 - 서한에프앤씨',
    description: '서한에프앤씨 고객지원 센터입니다. 공지사항, 온라인 견적, 자료실 등 다양한 지원 정보를 확인하세요.',
    keywords: '서한에프앤씨, 고객지원, 공지사항, 온라인견적, 자료실, 문의',
    openGraph: {
        title: '고객지원 - 서한에프앤씨',
        description: '서한에프앤씨 고객지원 센터입니다. 공지사항, 온라인 견적, 자료실 등 다양한 지원 정보를 확인하세요.',
        type: 'website',
    },
};

export default function SupportLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
} 