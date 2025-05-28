import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '공지사항 | 서한에프앤씨',
  description: '서한에프앤씨의 최신 소식과 중요 공지사항을 확인하세요.'
};

export default function NoticesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 