// types/content-block.ts
export interface ContentBlock {
  id: string;             // 슬러그 기반 고유 ID
  title: string;          // 블록 제목
  content: string;        // HTML 또는 Markdown 내용
  createdAt?: string;     // 생성일시
  updatedAt?: string;     // 수정일시
}
