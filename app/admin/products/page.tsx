"use client";

import React, { useState, useEffect, useCallback, useMemo, Suspense, Fragment } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Plus, Trash2, Edit, Eye, Filter, ChevronLeft, ChevronRight, MoreHorizontal, Layers, Power, PowerOff, Info, ArrowUpDown, ArrowUp, ArrowDown, Grid3X3, List, Calendar, Hash, Type, Tag, GripVertical, Move } from 'lucide-react';
import { Product } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableCell, TableHead, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { PlusCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ProductCategoryDisplayInfo } from '@/lib/constants';
import { toast } from 'sonner';
import { ADMIN_UI, ADMIN_FONT_STYLES, ADMIN_HEADING_STYLES, ADMIN_CARD_STYLES, ADMIN_BUTTON_SIZES } from '@/lib/admin-ui-constants';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

// 드래그 앤 드롭 관련 import
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const DEFAULT_ITEMS_PER_PAGE = 10;
const AVAILABLE_PAGE_LIMITS = [5, 10, 20, 50];

// 드래그 가능한 테이블 행 컴포넌트
interface SortableTableRowProps {
  product: Product;
  isSelected: boolean;
  onSelectItem: (id: string) => void;
  onDetailClick: (product: Product) => void;
  onDeleteClick: (product: Product) => void;
  onTogglePublish: (productId: string, currentPublishedState: boolean | undefined) => void;
  isDragMode: boolean;
}

function SortableTableRow({
  product,
  isSelected,
  onSelectItem,
  onDetailClick,
  onDeleteClick,
  onTogglePublish,
  isDragMode,
}: SortableTableRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: product.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const productCategoryName = product.productCategoryId ?
    ProductCategoryDisplayInfo[product.productCategoryId]?.name || product.productCategoryId :
    ProductCategoryDisplayInfo.default.name;
  const nameKo = product.nameKo || '';
  const nameEn = typeof product.name === 'string' ? product.name : '';

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      className={`${ADMIN_UI.BORDER_LIGHT} hover:${ADMIN_UI.BG_HOVER} ${isSelected ? ADMIN_UI.BG_ACCENT_HOVER : ''} ${isDragging ? 'z-50' : ''}`}
      onClick={() => !isDragMode && onSelectItem(product.id)}
    >
      <TableCell className="text-center p-2" onClick={(e) => e.stopPropagation()}>
        {isDragMode ? (
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-700 rounded"
          >
            <GripVertical className="h-4 w-4 text-gray-400" />
          </div>
        ) : (
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onSelectItem(product.id)}
            className={`form-checkbox h-4 w-4 ${ADMIN_UI.ACCENT_COLOR_FG} rounded border-gray-600 focus:ring-offset-gray-900 focus:ring-orange-500`}
          />
        )}
      </TableCell>
      <TableCell className="hidden sm:table-cell p-2">
        <Image
          alt={nameKo || nameEn || "제품 이미지"}
          className={`aspect-square rounded-md object-cover ${ADMIN_UI.BORDER_LIGHT}`}
          height="64"
          src={product.image || "/images/placeholder-product.png"}
          width="64"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/images/placeholder-product.png";
          }}
        />
      </TableCell>
      <TableCell className="p-2">
        <div className={`font-medium ${ADMIN_UI.TEXT_PRIMARY}`} style={ADMIN_FONT_STYLES.BODY_TEXT}>{nameKo || "N/A"}</div>
        <div className={`text-xs ${ADMIN_UI.TEXT_MUTED}`} style={ADMIN_FONT_STYLES.BODY_TEXT}>{nameEn || "N/A"}</div>
      </TableCell>
      <TableCell className={`hidden md:table-cell p-2 ${ADMIN_UI.TEXT_SECONDARY}`} style={ADMIN_FONT_STYLES.BODY_TEXT}>{product.id}</TableCell>
      <TableCell className="hidden lg:table-cell p-2">
        {productCategoryName && <Badge variant="outline" className={`${ADMIN_UI.BORDER_MEDIUM} ${ADMIN_UI.TEXT_SECONDARY}`} style={ADMIN_FONT_STYLES.BADGE}>{productCategoryName}</Badge>}
      </TableCell>
      <TableCell className="hidden xl:table-cell p-2">
        {product.productStyle ? <Badge variant="outline" className={`${ADMIN_UI.BORDER_MEDIUM} ${ADMIN_UI.TEXT_SECONDARY}`} style={ADMIN_FONT_STYLES.BADGE}>{product.productStyle}</Badge> : 'N/A'}
      </TableCell>
      <TableCell className="hidden xl:table-cell p-2">
        {product.approvalNumber ? <Badge variant="outline" className={`${ADMIN_UI.BORDER_MEDIUM} ${ADMIN_UI.TEXT_SECONDARY}`} style={ADMIN_FONT_STYLES.BADGE}>{product.approvalNumber}</Badge> : 'N/A'}
      </TableCell>
      <TableCell className="hidden 2xl:table-cell p-2">
        <div className={`text-xs ${ADMIN_UI.TEXT_SECONDARY} max-w-[200px] truncate`} style={ADMIN_FONT_STYLES.BODY_TEXT} title={product.descriptionKo || product.description || ''}>
          {product.descriptionKo || product.description || 'N/A'}
        </div>
      </TableCell>
      <TableCell className="hidden md:table-cell p-2">
        <Badge
          variant={product.isPublished ? "default" : "secondary"}
          className={product.isPublished ? `${ADMIN_UI.SUCCESS} hover:bg-green-700` : `${ADMIN_UI.WARNING} hover:bg-amber-700`}
          style={ADMIN_FONT_STYLES.BADGE}
        >
          {product.isPublished ? "게시 중" : "비공개"}
        </Badge>
      </TableCell>
      <TableCell className="text-right p-2" onClick={(e) => e.stopPropagation()}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button aria-haspopup="true" size="icon" variant="ghost" className={`hover:${ADMIN_UI.BG_ACCENT} group`}>
              <MoreHorizontal className={`h-4 w-4 ${ADMIN_UI.TEXT_MUTED} group-hover:${ADMIN_UI.TEXT_ACCENT}`} />
              <span className="sr-only">메뉴 토글</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className={`${ADMIN_UI.BG_SECONDARY} ${ADMIN_UI.BORDER_LIGHT}`}>
            <DropdownMenuLabel className={`${ADMIN_UI.TEXT_MUTED} text-xs px-2 pt-1.5`} style={ADMIN_FONT_STYLES.MENU_ITEM}>작업</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => onDetailClick(product)}
              className={`hover:${ADMIN_UI.BG_HOVER} ${ADMIN_UI.TEXT_SECONDARY} group`} style={ADMIN_FONT_STYLES.MENU_ITEM}
            >
              <Info className={`mr-2 h-4 w-4 ${ADMIN_UI.TEXT_MUTED} group-hover:${ADMIN_UI.TEXT_ACCENT}`} /> 상세 정보
            </DropdownMenuItem>
            <DropdownMenuItem asChild className={`hover:${ADMIN_UI.BG_HOVER} ${ADMIN_UI.TEXT_SECONDARY} group`} style={ADMIN_FONT_STYLES.MENU_ITEM}>
              <Link
                href={`/products/${product.id}`}
                className={`flex items-center w-full group-hover:${ADMIN_UI.TEXT_PRIMARY}`}
                target="_blank"
              >
                <Eye className={`mr-2 h-4 w-4 ${ADMIN_UI.TEXT_MUTED} group-hover:${ADMIN_UI.TEXT_ACCENT}`} /> 상세 보기 (사이트)
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className={`hover:${ADMIN_UI.BG_HOVER} ${ADMIN_UI.TEXT_SECONDARY} group`} style={ADMIN_FONT_STYLES.MENU_ITEM}>
              <Link
                href={`/admin/products/edit/${product.id}`}
                className={`flex items-center w-full group-hover:${ADMIN_UI.TEXT_PRIMARY}`}
              >
                <Edit className={`mr-2 h-4 w-4 ${ADMIN_UI.TEXT_MUTED} group-hover:${ADMIN_UI.TEXT_ACCENT}`} /> 수정
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDeleteClick(product)}
              className={`text-red-400 hover:bg-red-800/50 hover:!text-red-300 focus:text-red-300 group`} style={ADMIN_FONT_STYLES.MENU_ITEM}
            >
              <Trash2 className={`mr-2 h-4 w-4 text-red-500 group-hover:text-red-300`} /> 삭제
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onTogglePublish(product.id, product.isPublished)}
              className={`hover:${ADMIN_UI.BG_HOVER} ${ADMIN_UI.TEXT_SECONDARY} group`} style={ADMIN_FONT_STYLES.MENU_ITEM}
            >
              {product.isPublished
                ? <><PowerOff className={`mr-2 h-4 w-4 text-orange-500 group-hover:${ADMIN_UI.TEXT_ACCENT}`} /> 게시 중단</>
                : <><Power className={`mr-2 h-4 w-4 text-green-500 group-hover:${ADMIN_UI.TEXT_ACCENT}`} /> 게시하기</>}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}

const DeleteConfirmationDialog = ({
  open,
  onOpenChange,
  onConfirm,
  productName,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  productName: string | undefined;
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`${ADMIN_UI.BG_SECONDARY} ${ADMIN_UI.BORDER_LIGHT} ${ADMIN_UI.TEXT_PRIMARY}`}>
        <DialogHeader>
          <DialogTitle className={`${ADMIN_UI.TEXT_PRIMARY}`} style={ADMIN_FONT_STYLES.DIALOG_TITLE}>제품 삭제 확인</DialogTitle>
          <DialogDescription className={`${ADMIN_UI.TEXT_MUTED}`} style={ADMIN_FONT_STYLES.DIALOG_DESCRIPTION}>
            정말로 "{productName}" 제품을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end space-x-2 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)} className={`${ADMIN_UI.BUTTON_OUTLINE}`} style={ADMIN_FONT_STYLES.BUTTON}>
            취소
          </Button>
          <Button variant="destructive" onClick={onConfirm} className="bg-red-600 hover:bg-red-700" style={ADMIN_FONT_STYLES.BUTTON}>
            삭제
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// 제품 상세 정보 모달 컴포넌트
const ProductDetailModal = ({
  product,
  open,
  onOpenChange,
}: {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`${ADMIN_UI.BG_SECONDARY} ${ADMIN_UI.BORDER_LIGHT} ${ADMIN_UI.TEXT_PRIMARY} max-w-4xl max-h-[80vh]`}>
        <DialogHeader>
          <DialogTitle className={`${ADMIN_UI.TEXT_PRIMARY}`} style={ADMIN_FONT_STYLES.DIALOG_TITLE}>
            제품 상세 정보: {product.nameKo || (typeof product.name === 'string' ? product.name : '제품명 없음')}
          </DialogTitle>
          <DialogDescription className={`${ADMIN_UI.TEXT_MUTED}`} style={ADMIN_FONT_STYLES.DIALOG_DESCRIPTION}>
            제품 ID: {product.id}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6">
            {/* 기본 정보 */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-orange-400">기본 정보</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-400">제품명 (한글)</label>
                  <p className="text-white">{product.nameKo || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-400">제품명 (영문)</label>
                  <p className="text-white">{product.nameEn || (typeof product.name === 'string' ? product.name : 'N/A')}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-400">카테고리</label>
                  <p className="text-white">{product.category || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-400">제품 스타일</label>
                  <p className="text-white">{product.productStyle || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-400">승인번호</label>
                  <p className="text-white">{product.approvalNumber || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-400">게시 상태</label>
                  <p className="text-white">{product.isPublished ? '게시 중' : '비공개'}</p>
                </div>
              </div>
            </div>

            <Separator className="bg-gray-700" />

            {/* 설명 */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-orange-400">제품 설명</h3>
              <div className="space-y-2">
                <div>
                  <label className="text-sm font-medium text-gray-400">한글 설명</label>
                  <p className="text-white text-sm">{product.descriptionKo || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-400">영문 설명</label>
                  <p className="text-white text-sm">{product.descriptionEn || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* 기술 사양 (B타입인 경우) */}
            {product.productStyle === 'B' && product.technicalData && (
              <>
                <Separator className="bg-gray-700" />
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-orange-400">기술 사양</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {product.technicalData.map((item: any, index: number) => (
                      <div key={index} className="flex justify-between p-2 bg-gray-800 rounded">
                        <span className="text-gray-400">{item.key}</span>
                        <span className="text-white">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* 주요 특징 */}
            {product.features && product.features.length > 0 && (
              <>
                <Separator className="bg-gray-700" />
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-orange-400">주요 특징</h3>
                  <div className="space-y-2">
                    {product.features.map((feature, index) => (
                      <div key={index} className="p-3 bg-gray-800 rounded">
                        <h4 className="font-medium text-white">{feature.title}</h4>
                        <p className="text-sm text-gray-300">{feature.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* 문서 자료 */}
            {product.documents && product.documents.length > 0 && (
              <>
                <Separator className="bg-gray-700" />
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-orange-400">문서 자료</h3>
                  <div className="space-y-2">
                    {product.documents.map((doc, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-gray-800 rounded">
                        <span className="text-white">{doc.nameKo}</span>
                        <span className="text-gray-400 text-sm">{doc.type}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

// useSearchParams를 사용하는 컴포넌트를 별도로 분리
function AdminProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);

  const [currentPage, setCurrentPage] = useState(Number(searchParams?.get('page')) || 1);
  const [itemsPerPage, setItemsPerPage] = useState(Number(searchParams?.get('limit')) || DEFAULT_ITEMS_PER_PAGE);

  const [searchTerm, setSearchTerm] = useState(searchParams?.get('search') || '');
  const [selectedProductCategoryId, setSelectedProductCategoryId] = useState(searchParams?.get('category') || '');

  // 정렬 및 그룹화 상태
  const [sortField, setSortField] = useState<string>(searchParams?.get('sort') || 'sortOrder');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>((searchParams?.get('direction') as 'asc' | 'desc') || 'asc');
  const [groupBy, setGroupBy] = useState<string>(searchParams?.get('group') || '');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>((searchParams?.get('view') as 'table' | 'grid') || 'table');

  // 드래그 앤 드롭 상태
  const [isDragMode, setIsDragMode] = useState(false);
  const [isSavingOrder, setIsSavingOrder] = useState(false);

  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedProductForDetail, setSelectedProductForDetail] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isBatchDeleting, setIsBatchDeleting] = useState(false);
  const [isBatchPublishing, setIsBatchPublishing] = useState(false);

  const updateQueryParams = useCallback((paramsToUpdate: Record<string, string | number | null>) => {
    const current = new URLSearchParams(Array.from(searchParams?.entries() || []));
    Object.entries(paramsToUpdate).forEach(([key, value]) => {
      if (value === null || value === '') {
        current.delete(key);
      } else {
        current.set(key, String(value));
      }
    });
    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.push(`/admin/products${query}`);
  }, [searchParams, router]);

  // 드래그 앤 드롭 센서 설정
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    setCurrentPage(Number(searchParams?.get('page')) || 1);
    setItemsPerPage(Number(searchParams?.get('limit')) || DEFAULT_ITEMS_PER_PAGE);
    setSearchTerm(searchParams?.get('search') || '');
    setSelectedProductCategoryId(searchParams?.get('category') || '');
    setSortField(searchParams?.get('sort') || 'sortOrder');
    setSortDirection((searchParams?.get('direction') as 'asc' | 'desc') || 'asc');
    setGroupBy(searchParams?.get('group') || '');
    setViewMode((searchParams?.get('view') as 'table' | 'grid') || 'table');
  }, [searchParams]);

  const filteredAndSortedProducts = useMemo(() => {
    // 필터링
    let filtered = products.filter(product => {
      const nameKo = product.nameKo || '';
      const nameEn = typeof product.name === 'string' ? product.name : '';
      const matchesSearch =
        (nameKo || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (nameEn || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedProductCategoryId
        ? product.productCategoryId === selectedProductCategoryId
        : true;
      return matchesSearch && matchesCategory;
    });

    // 정렬
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortField) {
        case 'sortOrder':
          aValue = a.sortOrder ?? 999999;
          bValue = b.sortOrder ?? 999999;
          break;
        case 'nameKo':
          aValue = a.nameKo || '';
          bValue = b.nameKo || '';
          break;
        case 'nameEn':
          aValue = typeof a.name === 'string' ? a.name : '';
          bValue = typeof b.name === 'string' ? b.name : '';
          break;
        case 'id':
          aValue = a.id;
          bValue = b.id;
          break;
        case 'category':
          aValue = a.productCategoryId || '';
          bValue = b.productCategoryId || '';
          break;
        case 'productStyle':
          aValue = a.productStyle || '';
          bValue = b.productStyle || '';
          break;
        case 'approvalNumber':
          aValue = a.approvalNumber || '';
          bValue = b.approvalNumber || '';
          break;
        case 'isPublished':
          aValue = a.isPublished ? 1 : 0;
          bValue = b.isPublished ? 1 : 0;
          break;
        case 'createdAt':
          aValue = a.createdAt || '';
          bValue = b.createdAt || '';
          break;
        default:
          aValue = a.sortOrder ?? 999999;
          bValue = b.sortOrder ?? 999999;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const comparison = aValue.localeCompare(bValue, 'ko');
        return sortDirection === 'asc' ? comparison : -comparison;
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [products, searchTerm, selectedProductCategoryId, sortField, sortDirection]);

  // 그룹화 로직
  const groupedProducts = useMemo(() => {
    if (!groupBy) {
      return { '전체': filteredAndSortedProducts };
    }

    const groups: { [key: string]: Product[] } = {};

    filteredAndSortedProducts.forEach(product => {
      let groupKey = '';

      switch (groupBy) {
        case 'category':
          groupKey = product.productCategoryId ?
            (ProductCategoryDisplayInfo[product.productCategoryId]?.name || product.productCategoryId) :
            '미분류';
          break;
        case 'productStyle':
          groupKey = product.productStyle || '미설정';
          break;
        case 'isPublished':
          groupKey = product.isPublished ? '게시 중' : '비공개';
          break;
        case 'approvalNumber':
          groupKey = product.approvalNumber ? '승인 완료' : '승인 대기';
          break;
        default:
          groupKey = '전체';
      }

      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(product);
    });

    return groups;
  }, [filteredAndSortedProducts, groupBy]);

  const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage);
  const paginatedProducts = useMemo(() => {
    // 그룹화가 활성화된 경우 페이지네이션 비활성화
    if (groupBy) {
      return filteredAndSortedProducts;
    }
    return filteredAndSortedProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  }, [filteredAndSortedProducts, currentPage, itemsPerPage, groupBy]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = event.target.value;
    setSearchTerm(newSearchTerm);
    updateQueryParams({ search: newSearchTerm, page: 1 });
  };

  const handleCategoryFilter = (categoryId: string) => {
    const newCategoryId = categoryId === selectedProductCategoryId ? '' : categoryId;
    setSelectedProductCategoryId(newCategoryId);
    updateQueryParams({ category: newCategoryId, page: 1 });
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    updateQueryParams({ page: newPage });
  };

  const handleLimitChange = (newLimit: string) => {
    const limitNumber = parseInt(newLimit, 10);
    if (AVAILABLE_PAGE_LIMITS.includes(limitNumber)) {
      setItemsPerPage(limitNumber);
      updateQueryParams({ limit: limitNumber, page: 1 });
    }
  };

  // 정렬 핸들러
  const handleSort = (field: string) => {
    const newDirection = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(newDirection);
    updateQueryParams({ sort: field, direction: newDirection, page: 1 });
  };

  // 그룹화 핸들러
  const handleGroupBy = (groupField: string) => {
    const newGroupBy = groupBy === groupField ? '' : groupField;
    setGroupBy(newGroupBy);
    updateQueryParams({ group: newGroupBy, page: 1 });
  };

  // 뷰 모드 핸들러
  const handleViewModeChange = (mode: 'table' | 'grid') => {
    setViewMode(mode);
    updateQueryParams({ view: mode });
  };

  // 드래그 앤 드롭 핸들러
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = filteredAndSortedProducts.findIndex((product) => product.id === active.id);
      const newIndex = filteredAndSortedProducts.findIndex((product) => product.id === over?.id);

      const newProducts = arrayMove(filteredAndSortedProducts, oldIndex, newIndex);

      // 새로운 sortOrder 값 계산
      const updatedProducts = newProducts.map((product, index) => ({
        ...product,
        sortOrder: index + 1
      }));

      // 로컬 상태 즉시 업데이트
      setProducts(prevProducts => {
        const updatedProductsMap = new Map(updatedProducts.map(p => [p.id, p]));
        return prevProducts.map(p => updatedProductsMap.get(p.id) || p);
      });

      // 서버에 순서 저장
      await saveSortOrder(updatedProducts);
    }
  };

  // 정렬 순서 서버에 저장
  const saveSortOrder = async (sortedProducts: Product[]) => {
    setIsSavingOrder(true);
    try {
      const response = await fetch('/api/admin/products/sort-order', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          products: sortedProducts.map(p => ({ id: p.id, sortOrder: p.sortOrder }))
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '정렬 순서 저장에 실패했습니다.');
      }

      toast.success('제품 정렬 순서가 저장되었습니다.');
    } catch (err: any) {
      console.error('Failed to save sort order:', err);
      toast.error(`정렬 순서 저장 실패: ${err.message}`);
      // 실패 시 원래 데이터로 복원
      const response = await fetch('/api/admin/products');
      if (response.ok) {
        const data: Product[] = await response.json();
        setProducts(data);
      }
    } finally {
      setIsSavingOrder(false);
    }
  };

  // 드래그 모드 토글
  const toggleDragMode = () => {
    if (isDragMode) {
      setSelectedItems([]);
    }
    setIsDragMode(!isDragMode);

    // 드래그 모드 활성화 시 sortOrder로 정렬
    if (!isDragMode) {
      setSortField('sortOrder');
      setSortDirection('asc');
      setGroupBy('');
      updateQueryParams({ sort: 'sortOrder', direction: 'asc', group: '' });
    }
  };

  // 정렬 아이콘 렌더링 헬퍼
  const renderSortIcon = (field: string) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-4 w-4 text-gray-500" />;
    }
    return sortDirection === 'asc' ?
      <ArrowUp className="h-4 w-4 text-orange-400" /> :
      <ArrowDown className="h-4 w-4 text-orange-400" />;
  };

  const handleSelectItem = (id: string) => {
    setSelectedItems(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedItems.length === paginatedProducts.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(paginatedProducts.map(product => product.id));
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedItems.length === 0) {
      toast.info("삭제할 제품을 선택해주세요.");
      return;
    }

    if (confirm(`선택한 ${selectedItems.length}개의 제품을 정말로 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`)) {
      setIsBatchDeleting(true);
      setError(null);
      let successCount = 0;
      let errorCount = 0;
      let lastError: string | null = null;

      for (const productId of selectedItems) {
        try {
          const response = await fetch(`/api/admin/products/${productId}`, {
            method: 'DELETE',
          });
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `제품(ID: ${productId}) 삭제 실패`);
          }
          successCount++;
        } catch (err: any) {
          console.error(`Failed to delete product ${productId}:`, err);
          errorCount++;
          lastError = err.message;
        }
      }
      setIsBatchDeleting(false);

      if (errorCount > 0) {
        toast.error(`${errorCount}개 제품 삭제 실패 (마지막 오류: ${lastError}). ${successCount}개 성공.`);
      }
      if (successCount > 0 && errorCount === 0) {
        toast.success(`${successCount}개 제품이 성공적으로 삭제되었습니다.`);
      }
      setProducts(prevProducts => prevProducts.filter(product => !selectedItems.includes(product.id)));
      setSelectedItems([]);
    }
  };

  const handleDeleteItem = (id: string) => {
    if (confirm('이 제품을 삭제하시겠습니까?')) {
      setProducts(products.filter(product => product.id !== id));
      setSelectedItems(selectedItems.filter(item => item !== id));
    }
  };

  const handleTogglePublish = async (productId: string, currentPublishedState: boolean | undefined) => {
    const productToUpdate = products.find(p => p.id === productId);
    if (!productToUpdate) {
      setError("상태를 변경할 제품을 찾지 못했습니다.");
      return;
    }
    const newPublishState = !(currentPublishedState ?? false);
    const originalProducts = [...products];

    setProducts(prev => prev.map(p =>
      p.id === productId ? { ...p, isPublished: newPublishState } : p
    ));

    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...productToUpdate,
          isPublished: newPublishState,
          categoryId: productToUpdate.productCategoryId
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setProducts(originalProducts);
        throw new Error(errorData.message || '게시 상태 변경에 실패했습니다.');
      }
      toast.success(`제품(ID: ${productId}) 게시 상태가 성공적으로 변경되었습니다.`);
    } catch (err: any) {
      setProducts(originalProducts);
      setError(err.message);
      toast.error(`게시 상태 변경 실패: ${err.message}`);
      console.error("Failed to toggle publish state:", err);
    }
  };

  const handleBatchPublishToggle = async (publishState: boolean) => {
    if (selectedItems.length === 0) {
      toast.info(`상태를 변경할 제품을 선택해주세요.`);
      return;
    }
    setIsBatchPublishing(true);
    const actionText = publishState ? "게시" : "게시 중단";
    let successCount = 0;
    let errorCount = 0;
    let lastError: string | null = null;
    const originalProducts = [...products];

    setProducts(prev => prev.map(p => selectedItems.includes(p.id) ? { ...p, isPublished: publishState } : p));

    for (const productId of selectedItems) {
      const productToUpdate = originalProducts.find(p => p.id === productId);
      if (!productToUpdate) continue;
      try {
        const response = await fetch(`/api/admin/products/${productId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...productToUpdate,
            isPublished: publishState,
            categoryId: productToUpdate.productCategoryId
          }),
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `제품(ID: ${productId}) ${actionText} 처리 실패`);
        }
        successCount++;
      } catch (err: any) {
        console.error(`Failed to ${actionText} product ${productId}:`, err);
        errorCount++;
        lastError = err.message;
        setProducts(prev => prev.map(p => p.id === productId ? { ...p, isPublished: !publishState } : p));
      }
    }
    setIsBatchPublishing(false);

    if (errorCount > 0) {
      toast.error(`${errorCount}개 제품 ${actionText} 처리 실패 (마지막 오류: ${lastError}). ${successCount}개 성공.`);
    }
    if (successCount > 0 && errorCount === 0) {
      toast.success(`${successCount}개 제품이 성공적으로 ${actionText} 처리되었습니다.`);
    }
    setSelectedItems([]);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/admin/products');
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || '제품 목록을 불러오는데 실패했습니다.');
        }
        const data: Product[] = await response.json();
        setProducts(data);
      } catch (err: any) {
        console.error("Failed to fetch products from API:", err);
        setError(err.message);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleDeleteClick = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteDialogOpen(true);
  };

  const handleDetailClick = (product: Product) => {
    setSelectedProductForDetail(product);
    setIsDetailModalOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedProduct) {
      setError(null);
      const originalProducts = [...products];
      setProducts(prevProducts => prevProducts.filter(p => p.id !== selectedProduct.id));

      try {
        const response = await fetch(`/api/admin/products/${selectedProduct.id}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          const errorData = await response.json();
          setProducts(originalProducts);
          throw new Error(errorData.message || '제품 삭제에 실패했습니다.');
        }
        toast.success(`제품(ID: ${selectedProduct.id})이 성공적으로 삭제되었습니다.`);
      } catch (err: any) {
        setProducts(originalProducts);
        console.error("Failed to delete product:", err);
        setError(err.message);
        toast.error(`제품 삭제 오류: ${err.message}`);
      } finally {
        setIsDeleteDialogOpen(false);
        setSelectedProduct(null);
      }
    }
  };

  if (loading && products.length === 0) {
    return (
      <div className={`${ADMIN_UI.PADDING_CONTAINER} min-h-screen`}>
        <div className="flex items-center justify-between mb-6">
          <h1 className={`${ADMIN_HEADING_STYLES.PAGE_TITLE} ${ADMIN_UI.TEXT_PRIMARY}`} style={ADMIN_FONT_STYLES.PAGE_TITLE}>제품 관리</h1>
          <Link href="/admin/products/create" >
            <Button className={`${ADMIN_UI.BUTTON_PRIMARY} ${ADMIN_BUTTON_SIZES.DEFAULT}`} style={ADMIN_FONT_STYLES.BUTTON}>
              <PlusCircle className="h-4 w-4 mr-2" />
              새 제품 추가
            </Button>
          </Link>
        </div>
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <Input
            type="text"
            placeholder="제품명 또는 ID 검색..."
            value={searchTerm}
            onChange={handleSearchChange}
            className={`w-full md:flex-grow ${ADMIN_UI.BG_INPUT} ${ADMIN_UI.TEXT_PRIMARY} ${ADMIN_UI.BORDER_MEDIUM} placeholder-${ADMIN_UI.TEXT_MUTED}`}
            disabled
          />
          <Button variant="outline" className={`${ADMIN_UI.BUTTON_OUTLINE} w-full md:w-auto`} disabled style={ADMIN_FONT_STYLES.BUTTON}>
            <Filter className="h-4 w-4 mr-2" />
            카테고리 필터
          </Button>
        </div>
        <div className={`${ADMIN_CARD_STYLES.DEFAULT} ${ADMIN_UI.PADDING_CARD}`}>
          <div className="flex items-center justify-center h-64 flex-col">
            <div className={`inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid ${ADMIN_UI.BORDER_ACCENT} border-r-transparent mb-4`}></div>
            <p className={`${ADMIN_UI.TEXT_MUTED}`} style={ADMIN_FONT_STYLES.BODY_TEXT}>제품 데이터를 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && products.length === 0) {
    return (
      <div className={`${ADMIN_UI.PADDING_CONTAINER} text-center`}>
        <h1 className={`${ADMIN_HEADING_STYLES.PAGE_TITLE} ${ADMIN_UI.TEXT_PRIMARY} mb-4`} style={ADMIN_FONT_STYLES.PAGE_TITLE}>제품 관리</h1>
        <p className={`text-red-400`} style={ADMIN_FONT_STYLES.BODY_TEXT}>오류: {error}</p>
        <Button onClick={() => window.location.reload()} className={`mt-4 ${ADMIN_UI.BUTTON_PRIMARY} ${ADMIN_BUTTON_SIZES.DEFAULT}`} style={ADMIN_FONT_STYLES.BUTTON}>다시 시도</Button>
      </div>
    );
  }

  return (
    <div className={`${ADMIN_UI.PADDING_CONTAINER} min-h-screen`}>
      <div className="flex items-center justify-between mb-6">
        <h1 className={`${ADMIN_HEADING_STYLES.PAGE_TITLE} ${ADMIN_UI.TEXT_PRIMARY}`} style={ADMIN_FONT_STYLES.PAGE_TITLE}>제품 관리</h1>
        <div className="flex items-center space-x-2">
          {selectedItems.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className={`${ADMIN_BUTTON_SIZES.DEFAULT}`} style={ADMIN_FONT_STYLES.BUTTON} disabled={isBatchDeleting || isBatchPublishing}>
                  <Layers className="h-4 w-4 mr-2" />
                  일괄 작업 ({selectedItems.length})
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className={`${ADMIN_UI.BG_SECONDARY} ${ADMIN_UI.BORDER_LIGHT}`}>
                <DropdownMenuItem
                  onClick={() => handleBatchPublishToggle(true)}
                  disabled={isBatchPublishing}
                  className={`hover:${ADMIN_UI.BG_HOVER} ${ADMIN_UI.TEXT_SECONDARY} group`} style={ADMIN_FONT_STYLES.MENU_ITEM}
                >
                  <Power className={`mr-2 h-4 w-4 text-green-500 group-hover:${ADMIN_UI.TEXT_ACCENT}`} /> 선택 게시
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleBatchPublishToggle(false)}
                  disabled={isBatchPublishing}
                  className={`hover:${ADMIN_UI.BG_HOVER} ${ADMIN_UI.TEXT_SECONDARY} group`} style={ADMIN_FONT_STYLES.MENU_ITEM}
                >
                  <PowerOff className={`mr-2 h-4 w-4 text-orange-500 group-hover:${ADMIN_UI.TEXT_ACCENT}`} /> 선택 게시 중단
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleDeleteSelected}
                  disabled={isBatchDeleting}
                  className={`text-red-400 hover:!bg-red-800/50 hover:!text-red-300 focus:text-red-300 group`} style={ADMIN_FONT_STYLES.MENU_ITEM}
                >
                  <Trash2 className={`mr-2 h-4 w-4 text-red-500 group-hover:text-red-300`} /> 선택 삭제
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <Link href="/admin/products/create" >
            <Button className={`${ADMIN_UI.BUTTON_PRIMARY} ${ADMIN_BUTTON_SIZES.DEFAULT}`} style={ADMIN_FONT_STYLES.BUTTON}>
              <PlusCircle className="h-4 w-4 mr-2" />
              새 제품 추가
            </Button>
          </Link>
        </div>
      </div>
      <div className="flex flex-col gap-4 mb-6">
        {/* 첫 번째 줄: 검색 및 기본 필터 */}
        <div className="flex flex-col md:flex-row gap-4">
          <Input
            type="text"
            placeholder="제품명 또는 ID 검색..."
            value={searchTerm}
            onChange={handleSearchChange}
            className={`w-full md:flex-grow ${ADMIN_UI.BG_INPUT} ${ADMIN_UI.TEXT_PRIMARY} ${ADMIN_UI.BORDER_MEDIUM} placeholder-${ADMIN_UI.TEXT_MUTED}`}
          />
          <div className="flex gap-2 w-full md:w-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className={`${ADMIN_UI.BUTTON_OUTLINE} w-full md:w-auto flex-grow md:flex-grow-0`} style={ADMIN_FONT_STYLES.BUTTON}>
                  <Filter className="h-4 w-4 mr-2" />
                  {selectedProductCategoryId ? ProductCategoryDisplayInfo[selectedProductCategoryId]?.name || selectedProductCategoryId : '카테고리'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className={`${ADMIN_UI.BG_SECONDARY} ${ADMIN_UI.BORDER_LIGHT}`}>
                <DropdownMenuItem onClick={() => handleCategoryFilter('')} className={`hover:${ADMIN_UI.BG_HOVER} ${ADMIN_UI.TEXT_SECONDARY}`} style={ADMIN_FONT_STYLES.MENU_ITEM}>모든 카테고리</DropdownMenuItem>
                {Object.entries(ProductCategoryDisplayInfo).filter(([id]) => id !== 'default').map(([id, { name }]) => (
                  <DropdownMenuItem key={id} onClick={() => handleCategoryFilter(id)} className={`hover:${ADMIN_UI.BG_HOVER} ${ADMIN_UI.TEXT_SECONDARY}`} style={ADMIN_FONT_STYLES.MENU_ITEM}>
                    {name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Select value={String(itemsPerPage)} onValueChange={handleLimitChange}>
              <SelectTrigger className={`${ADMIN_UI.BUTTON_OUTLINE} w-full md:w-[100px] flex-grow md:flex-grow-0`} style={ADMIN_FONT_STYLES.BUTTON}>
                <SelectValue placeholder={`${itemsPerPage}개씩 보기`} />
              </SelectTrigger>
              <SelectContent className={`${ADMIN_UI.BG_SECONDARY} ${ADMIN_UI.BORDER_LIGHT}`}>
                {AVAILABLE_PAGE_LIMITS.map(limit => (
                  <SelectItem key={limit} value={String(limit)} className={`hover:${ADMIN_UI.BG_HOVER} ${ADMIN_UI.TEXT_SECONDARY}`} style={ADMIN_FONT_STYLES.MENU_ITEM}>
                    {limit}개씩
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* 두 번째 줄: 정렬, 그룹화, 뷰 모드 */}
        <div className="flex flex-col sm:flex-row gap-2 justify-between items-start sm:items-center">
          <div className="flex flex-wrap gap-2">
            {/* 정렬 드롭다운 */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isDragMode}
                  className={`${ADMIN_UI.BUTTON_OUTLINE} ${isDragMode ? 'opacity-50 cursor-not-allowed' : ''}`}
                  style={ADMIN_FONT_STYLES.BUTTON}
                >
                  {renderSortIcon(sortField)}
                  <span className="ml-2">정렬: {
                    sortField === 'sortOrder' ? '사용자 정의 순서' :
                      sortField === 'nameKo' ? '제품명(한글)' :
                        sortField === 'nameEn' ? '제품명(영문)' :
                          sortField === 'id' ? 'ID' :
                            sortField === 'category' ? '카테고리' :
                              sortField === 'productStyle' ? '제품 스타일' :
                                sortField === 'approvalNumber' ? '승인번호' :
                                  sortField === 'isPublished' ? '게시 상태' :
                                    sortField === 'createdAt' ? '생성일' : '사용자 정의 순서'
                  }</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className={`${ADMIN_UI.BG_SECONDARY} ${ADMIN_UI.BORDER_LIGHT}`}>
                <DropdownMenuLabel style={ADMIN_FONT_STYLES.MENU_LABEL}>정렬 기준</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleSort('sortOrder')} className={`hover:${ADMIN_UI.BG_HOVER} ${ADMIN_UI.TEXT_SECONDARY}`} style={ADMIN_FONT_STYLES.MENU_ITEM}>
                  <Move className="mr-2 h-4 w-4" /> 사용자 정의 순서
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSort('nameKo')} className={`hover:${ADMIN_UI.BG_HOVER} ${ADMIN_UI.TEXT_SECONDARY}`} style={ADMIN_FONT_STYLES.MENU_ITEM}>
                  <Type className="mr-2 h-4 w-4" /> 제품명 (한글)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSort('nameEn')} className={`hover:${ADMIN_UI.BG_HOVER} ${ADMIN_UI.TEXT_SECONDARY}`} style={ADMIN_FONT_STYLES.MENU_ITEM}>
                  <Type className="mr-2 h-4 w-4" /> 제품명 (영문)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSort('id')} className={`hover:${ADMIN_UI.BG_HOVER} ${ADMIN_UI.TEXT_SECONDARY}`} style={ADMIN_FONT_STYLES.MENU_ITEM}>
                  <Hash className="mr-2 h-4 w-4" /> 제품 ID
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSort('category')} className={`hover:${ADMIN_UI.BG_HOVER} ${ADMIN_UI.TEXT_SECONDARY}`} style={ADMIN_FONT_STYLES.MENU_ITEM}>
                  <Tag className="mr-2 h-4 w-4" /> 카테고리
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSort('productStyle')} className={`hover:${ADMIN_UI.BG_HOVER} ${ADMIN_UI.TEXT_SECONDARY}`} style={ADMIN_FONT_STYLES.MENU_ITEM}>
                  <Grid3X3 className="mr-2 h-4 w-4" /> 제품 스타일
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSort('isPublished')} className={`hover:${ADMIN_UI.BG_HOVER} ${ADMIN_UI.TEXT_SECONDARY}`} style={ADMIN_FONT_STYLES.MENU_ITEM}>
                  <Power className="mr-2 h-4 w-4" /> 게시 상태
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* 그룹화 드롭다운 */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isDragMode}
                  className={`${ADMIN_UI.BUTTON_OUTLINE} ${groupBy ? 'bg-orange-500/20 border-orange-500/50' : ''} ${isDragMode ? 'opacity-50 cursor-not-allowed' : ''}`}
                  style={ADMIN_FONT_STYLES.BUTTON}
                >
                  <Layers className="h-4 w-4 mr-2" />
                  그룹화: {
                    groupBy === 'category' ? '카테고리' :
                      groupBy === 'productStyle' ? '제품 스타일' :
                        groupBy === 'isPublished' ? '게시 상태' :
                          groupBy === 'approvalNumber' ? '승인 상태' : '없음'
                  }
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className={`${ADMIN_UI.BG_SECONDARY} ${ADMIN_UI.BORDER_LIGHT}`}>
                <DropdownMenuLabel style={ADMIN_FONT_STYLES.MENU_LABEL}>그룹화 기준</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleGroupBy('')} className={`hover:${ADMIN_UI.BG_HOVER} ${ADMIN_UI.TEXT_SECONDARY}`} style={ADMIN_FONT_STYLES.MENU_ITEM}>
                  그룹화 해제
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleGroupBy('category')} className={`hover:${ADMIN_UI.BG_HOVER} ${ADMIN_UI.TEXT_SECONDARY}`} style={ADMIN_FONT_STYLES.MENU_ITEM}>
                  <Tag className="mr-2 h-4 w-4" /> 카테고리별
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleGroupBy('productStyle')} className={`hover:${ADMIN_UI.BG_HOVER} ${ADMIN_UI.TEXT_SECONDARY}`} style={ADMIN_FONT_STYLES.MENU_ITEM}>
                  <Grid3X3 className="mr-2 h-4 w-4" /> 제품 스타일별
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleGroupBy('isPublished')} className={`hover:${ADMIN_UI.BG_HOVER} ${ADMIN_UI.TEXT_SECONDARY}`} style={ADMIN_FONT_STYLES.MENU_ITEM}>
                  <Power className="mr-2 h-4 w-4" /> 게시 상태별
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleGroupBy('approvalNumber')} className={`hover:${ADMIN_UI.BG_HOVER} ${ADMIN_UI.TEXT_SECONDARY}`} style={ADMIN_FONT_STYLES.MENU_ITEM}>
                  <Info className="mr-2 h-4 w-4" /> 승인 상태별
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* 드래그 모드 토글 및 뷰 모드 토글 */}
          <div className="flex gap-2">
            <Button
              variant={isDragMode ? 'default' : 'outline'}
              size="sm"
              onClick={toggleDragMode}
              disabled={groupBy !== '' || isSavingOrder}
              className={`${isDragMode ? 'bg-orange-500 text-white' : 'text-gray-400 hover:text-white'} ${groupBy !== '' ? 'opacity-50 cursor-not-allowed' : ''}`}
              style={ADMIN_FONT_STYLES.BUTTON}
            >
              <GripVertical className="h-4 w-4 mr-1" />
              {isDragMode ? '정렬 완료' : '순서 변경'}
              {isSavingOrder && <div className="ml-2 h-3 w-3 animate-spin rounded-full border-2 border-white border-r-transparent" />}
            </Button>
            <div className="flex gap-1 bg-gray-800 rounded-md p-1">
              <Button
                variant={viewMode === 'table' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => handleViewModeChange('table')}
                className={`px-3 py-1 ${viewMode === 'table' ? 'bg-orange-500 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => handleViewModeChange('grid')}
                className={`px-3 py-1 ${viewMode === 'grid' ? 'bg-orange-500 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* 현재 필터 상태 표시 */}
        {(searchTerm || selectedProductCategoryId || groupBy || isDragMode) && (
          <div className="flex flex-wrap gap-2 text-sm">
            <span className="text-gray-400">
              {isDragMode ? '드래그 모드:' : '활성 필터:'}
            </span>
            {isDragMode && (
              <Badge variant="secondary" className="bg-orange-500/20 text-orange-300 border-orange-500/50">
                제품을 드래그하여 순서를 변경하세요
              </Badge>
            )}
            {!isDragMode && searchTerm && (
              <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/50">
                검색: {searchTerm}
              </Badge>
            )}
            {!isDragMode && selectedProductCategoryId && (
              <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/50">
                카테고리: {ProductCategoryDisplayInfo[selectedProductCategoryId]?.name || selectedProductCategoryId}
              </Badge>
            )}
            {!isDragMode && groupBy && (
              <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/50">
                그룹화: {
                  groupBy === 'category' ? '카테고리' :
                    groupBy === 'productStyle' ? '제품 스타일' :
                      groupBy === 'isPublished' ? '게시 상태' :
                        groupBy === 'approvalNumber' ? '승인 상태' : groupBy
                }
              </Badge>
            )}
          </div>
        )}
      </div>
      {error && !loading && <p className={`text-red-400 mb-4 p-3 bg-red-900/20 border border-red-700/50 rounded-md`} style={ADMIN_FONT_STYLES.BODY_TEXT}>오류: {error}</p>}
      {loading && products.length === 0 ? (
        <div className={`${ADMIN_CARD_STYLES.DEFAULT} ${ADMIN_UI.PADDING_CARD}`}>
          <div className="flex items-center justify-center h-64 flex-col">
            <div className={`inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid ${ADMIN_UI.BORDER_ACCENT} border-r-transparent mb-4`}></div>
            <p className={`${ADMIN_UI.TEXT_MUTED}`} style={ADMIN_FONT_STYLES.BODY_TEXT}>제품 데이터를 불러오는 중...</p>
          </div>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <Table className={`${ADMIN_UI.BORDER_LIGHT} rounded-lg shadow-sm`}>
            <TableHeader>
              <TableRow className={`${ADMIN_UI.BG_SECONDARY} ${ADMIN_UI.BORDER_LIGHT}`}>
                <TableHead className="w-[50px] text-center">
                  {isDragMode ? (
                    <div className="flex items-center justify-center">
                      <GripVertical className="h-4 w-4 text-gray-400" />
                    </div>
                  ) : (
                    <input
                      type="checkbox"
                      checked={selectedItems.length === paginatedProducts.length && paginatedProducts.length > 0}
                      onChange={handleSelectAll}
                      className={`form-checkbox h-4 w-4 ${ADMIN_UI.ACCENT_COLOR_FG} rounded border-gray-600 focus:ring-offset-gray-900 focus:ring-orange-500`}
                    />
                  )}
                </TableHead>
                <TableHead className="w-[80px] hidden sm:table-cell" style={ADMIN_FONT_STYLES.TABLE_HEADER}>이미지</TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-gray-700/50 transition-colors"
                  style={ADMIN_FONT_STYLES.TABLE_HEADER}
                  onClick={() => handleSort('nameKo')}
                >
                  <div className="flex items-center gap-2">
                    제품명 (한글/영문)
                    {renderSortIcon('nameKo')}
                  </div>
                </TableHead>
                <TableHead
                  className="hidden md:table-cell cursor-pointer hover:bg-gray-700/50 transition-colors"
                  style={ADMIN_FONT_STYLES.TABLE_HEADER}
                  onClick={() => handleSort('id')}
                >
                  <div className="flex items-center gap-2">
                    제품 ID
                    {renderSortIcon('id')}
                  </div>
                </TableHead>
                <TableHead
                  className="hidden lg:table-cell cursor-pointer hover:bg-gray-700/50 transition-colors"
                  style={ADMIN_FONT_STYLES.TABLE_HEADER}
                  onClick={() => handleSort('category')}
                >
                  <div className="flex items-center gap-2">
                    카테고리
                    {renderSortIcon('category')}
                  </div>
                </TableHead>
                <TableHead
                  className="hidden xl:table-cell cursor-pointer hover:bg-gray-700/50 transition-colors"
                  style={ADMIN_FONT_STYLES.TABLE_HEADER}
                  onClick={() => handleSort('productStyle')}
                >
                  <div className="flex items-center gap-2">
                    제품 스타일
                    {renderSortIcon('productStyle')}
                  </div>
                </TableHead>
                <TableHead className="hidden xl:table-cell" style={ADMIN_FONT_STYLES.TABLE_HEADER}>승인번호</TableHead>
                <TableHead className="hidden 2xl:table-cell max-w-[200px]" style={ADMIN_FONT_STYLES.TABLE_HEADER}>설명</TableHead>
                <TableHead
                  className="hidden md:table-cell cursor-pointer hover:bg-gray-700/50 transition-colors"
                  style={ADMIN_FONT_STYLES.TABLE_HEADER}
                  onClick={() => handleSort('isPublished')}
                >
                  <div className="flex items-center gap-2">
                    상태
                    {renderSortIcon('isPublished')}
                  </div>
                </TableHead>
                <TableHead className="text-right" style={ADMIN_FONT_STYLES.TABLE_HEADER}>관리</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <SortableContext
                items={isDragMode && !groupBy ? paginatedProducts.map(p => p.id) : []}
                strategy={verticalListSortingStrategy}
              >
                {groupBy ? (
                  // 그룹화된 렌더링
                  Object.entries(groupedProducts).map(([groupName, groupProducts]) => (
                    <React.Fragment key={groupName}>
                      {/* 그룹 헤더 */}
                      <TableRow className="bg-gray-800/50 border-gray-600">
                        <TableCell colSpan={10} className="p-3">
                          <div className="flex items-center gap-2">
                            <Layers className="h-4 w-4 text-orange-400" />
                            <span className="font-semibold text-orange-400" style={ADMIN_FONT_STYLES.BODY_TEXT}>
                              {groupName} ({groupProducts.length}개)
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                      {/* 그룹 내 제품들 */}
                      {groupProducts.map((product) => {
                        const isSelected = selectedItems.includes(product.id);
                        return (
                          <SortableTableRow
                            key={product.id}
                            product={product}
                            isSelected={isSelected}
                            onSelectItem={handleSelectItem}
                            onDetailClick={handleDetailClick}
                            onDeleteClick={handleDeleteClick}
                            onTogglePublish={handleTogglePublish}
                            isDragMode={false} // 그룹화 시에는 드래그 비활성화
                          />
                        );
                      })}
                    </React.Fragment>
                  ))
                ) : (
                  // 일반 렌더링 (그룹화 없음)
                  paginatedProducts.length > 0 ? (
                    paginatedProducts.map((product) => {
                      const isSelected = selectedItems.includes(product.id);
                      return (
                        <SortableTableRow
                          key={product.id}
                          product={product}
                          isSelected={isSelected}
                          onSelectItem={handleSelectItem}
                          onDetailClick={handleDetailClick}
                          onDeleteClick={handleDeleteClick}
                          onTogglePublish={handleTogglePublish}
                          isDragMode={isDragMode}
                        />
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={10} className={`h-24 text-center ${ADMIN_UI.TEXT_MUTED}`} style={ADMIN_FONT_STYLES.BODY_TEXT}>
                        {searchTerm || selectedProductCategoryId ? '검색/필터 결과가 없습니다.' : '등록된 제품이 없습니다.'}
                      </TableCell>
                    </TableRow>
                  )
                )}
              </SortableContext>
            </TableBody>
          </Table>
        </DndContext>
      )}
      {totalPages > 1 && !groupBy && !isDragMode && (
        <div className="flex items-center justify-between mt-6 text-sm">
          <div className={`${ADMIN_UI.TEXT_MUTED}`} style={ADMIN_FONT_STYLES.BODY_TEXT}>
            총 {filteredAndSortedProducts.length}개 중 {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredAndSortedProducts.length)} 표시
          </div>
          <div className="flex items-center space-x-1">
            <Button variant="outline" size="icon" onClick={() => handlePageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1}
              className={`${ADMIN_UI.BUTTON_OUTLINE} h-8 w-8`} style={ADMIN_FONT_STYLES.BUTTON}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {[...Array(totalPages).keys()].map(num => (
              <Button
                key={num + 1}
                variant={currentPage === num + 1 ? "default" : "outline"}
                size="icon"
                onClick={() => handlePageChange(num + 1)}
                className={`h-8 w-8 ${currentPage === num + 1 ? ADMIN_UI.BUTTON_PRIMARY : ADMIN_UI.BUTTON_OUTLINE}`}
                style={ADMIN_FONT_STYLES.BUTTON}
              >
                {num + 1}
              </Button>
            ))}
            <Button variant="outline" size="icon" onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages}
              className={`${ADMIN_UI.BUTTON_OUTLINE} h-8 w-8`} style={ADMIN_FONT_STYLES.BUTTON}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={confirmDelete}
        productName={selectedProduct?.nameKo || selectedProduct?.name as string}
      />

      <ProductDetailModal
        product={selectedProductForDetail}
        open={isDetailModalOpen}
        onOpenChange={setIsDetailModalOpen}
      />
    </div>
  );
}

// Loading fallback 컴포넌트
function AdminProductsLoading() {
  return (
    <div className={`${ADMIN_UI.PADDING_CONTAINER} min-h-screen`}>
      <div className="flex items-center justify-between mb-6">
        <h1 className={`${ADMIN_HEADING_STYLES.PAGE_TITLE} ${ADMIN_UI.TEXT_PRIMARY}`} style={ADMIN_FONT_STYLES.PAGE_TITLE}>제품 관리</h1>
        <Button disabled className={`${ADMIN_UI.BUTTON_PRIMARY} ${ADMIN_BUTTON_SIZES.DEFAULT}`} style={ADMIN_FONT_STYLES.BUTTON}>
          <PlusCircle className="h-4 w-4 mr-2" />
          새 제품 추가
        </Button>
      </div>
      <div className={`${ADMIN_CARD_STYLES.DEFAULT} ${ADMIN_UI.PADDING_CARD}`}>
        <div className="flex items-center justify-center h-64 flex-col">
          <div className={`inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid ${ADMIN_UI.BORDER_ACCENT} border-r-transparent mb-4`}></div>
          <p className={`${ADMIN_UI.TEXT_MUTED}`} style={ADMIN_FONT_STYLES.BODY_TEXT}>제품 데이터를 불러오는 중...</p>
        </div>
      </div>
    </div>
  );
}

// 메인 컴포넌트 - Suspense로 감싸기
export default function AdminProductsPage() {
  return (
    <Suspense fallback={<AdminProductsLoading />}>
      <AdminProductsContent />
    </Suspense>
  );
} 