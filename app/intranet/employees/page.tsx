"use client";

import React, { useState } from "react";
import IntranetLayout from "@/components/intranet/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  PlusCircle,
  Download,
  Upload,
  Filter,
  ChevronDown,
  MoreHorizontal,
  Mail,
  Phone,
  Clock,
  ArrowUpDown,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

// 임시 데이터 - 실제 구현에서는 API에서 가져옵니다
const employees = [
  {
    id: 1,
    name: "김민수",
    employeeId: "EMP001",
    position: "부장",
    department: "영업팀",
    email: "minsu.kim@seohanfnc.com",
    phone: "010-1234-5678",
    status: "재직",
    hireDate: "2010-03-15",
    image: "",
  },
  {
    id: 2,
    name: "이지영",
    employeeId: "EMP002",
    position: "과장",
    department: "마케팅팀",
    email: "jiyoung.lee@seohanfnc.com",
    phone: "010-2345-6789",
    status: "재직",
    hireDate: "2015-08-01",
    image: "",
  },
  {
    id: 3,
    name: "박준호",
    employeeId: "EMP003",
    position: "차장",
    department: "제품개발팀",
    email: "junho.park@seohanfnc.com",
    phone: "010-3456-7890",
    status: "재직",
    hireDate: "2012-05-20",
    image: "",
  },
  {
    id: 4,
    name: "정수진",
    employeeId: "EMP004",
    position: "대리",
    department: "인사팀",
    email: "sujin.jung@seohanfnc.com",
    phone: "010-4567-8901",
    status: "재직",
    hireDate: "2018-02-10",
    image: "",
  },
  {
    id: 5,
    name: "최동욱",
    employeeId: "EMP005",
    position: "사원",
    department: "총무팀",
    email: "dongwook.choi@seohanfnc.com",
    phone: "010-5678-9012",
    status: "휴직",
    hireDate: "2020-11-05",
    image: "",
  },
  {
    id: 6,
    name: "한미연",
    employeeId: "EMP006",
    position: "인턴",
    department: "마케팅팀",
    email: "miyeon.han@seohanfnc.com",
    phone: "010-6789-0123",
    status: "수습",
    hireDate: "2023-01-16",
    image: "",
  },
  {
    id: 7,
    name: "송태준",
    employeeId: "EMP007",
    position: "이사",
    department: "경영지원팀",
    email: "taejoon.song@seohanfnc.com",
    phone: "010-7890-1234",
    status: "재직",
    hireDate: "2008-06-30",
    image: "",
  },
  {
    id: 8,
    name: "임세라",
    employeeId: "EMP008",
    position: "과장",
    department: "영업팀",
    email: "sera.lim@seohanfnc.com",
    phone: "010-8901-2345",
    status: "재직",
    hireDate: "2015-04-12",
    image: "",
  },
  {
    id: 9,
    name: "고준영",
    employeeId: "EMP009",
    position: "부장",
    department: "생산팀",
    email: "joonyoung.ko@seohanfnc.com",
    phone: "010-9012-3456",
    status: "재직",
    hireDate: "2011-09-22",
    image: "",
  },
  {
    id: 10,
    name: "윤지원",
    employeeId: "EMP010",
    position: "대리",
    department: "재고관리팀",
    email: "jiwon.yoon@seohanfnc.com",
    phone: "010-0123-4567",
    status: "재직",
    hireDate: "2017-07-11",
    image: "",
  },
];

// 부서 목록
const departments = [
  "전체",
  "영업팀",
  "마케팅팀",
  "제품개발팀",
  "인사팀",
  "총무팀",
  "경영지원팀",
  "생산팀",
  "재고관리팀",
];

// 직급 목록
const positions = [
  "전체",
  "사원",
  "대리",
  "과장",
  "차장",
  "부장",
  "이사",
  "인턴",
  "수습",
];

// 상태 목록
const statuses = ["전체", "재직", "휴직", "수습", "퇴사"];

export default function EmployeesPage() {
  // 필터링 상태
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("전체");
  const [positionFilter, setPositionFilter] = useState("전체");
  const [statusFilter, setStatusFilter] = useState("전체");

  // 정렬 상태
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // 정렬 함수
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // 필터링된 직원 목록
  const filteredEmployees = employees
    .filter((employee) => {
      // 검색어 필터링
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          employee.name.toLowerCase().includes(query) ||
          employee.employeeId.toLowerCase().includes(query) ||
          employee.email.toLowerCase().includes(query) ||
          employee.phone.includes(query)
        );
      }
      return true;
    })
    .filter((employee) => {
      // 부서 필터링
      if (departmentFilter === "전체") return true;
      return employee.department === departmentFilter;
    })
    .filter((employee) => {
      // 직급 필터링
      if (positionFilter === "전체") return true;
      return employee.position === positionFilter;
    })
    .filter((employee) => {
      // 상태 필터링
      if (statusFilter === "전체") return true;
      return employee.status === statusFilter;
    })
    .sort((a, b) => {
      // 정렬 로직
      if (!sortField) return 0;

      // 정렬 필드에 따라 비교
      const aValue = a[sortField as keyof typeof a];
      const bValue = b[sortField as keyof typeof b];

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      // 숫자형 경우
      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });

  const renderSortIcon = (field: string) => {
    if (sortField !== field) return <ArrowUpDown className="ml-2 h-4 w-4" />;
    return sortDirection === "asc" ? (
      <ChevronDown className="ml-2 h-4 w-4 rotate-180" />
    ) : (
      <ChevronDown className="ml-2 h-4 w-4" />
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "재직":
        return "bg-green-100 text-green-800";
      case "휴직":
        return "bg-amber-100 text-amber-800";
      case "수습":
        return "bg-blue-100 text-blue-800";
      case "퇴사":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // 초기 이름
  const getInitials = (name: string) => {
    return name.charAt(0);
  };

  return (
    <IntranetLayout>
      <div className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">직원 관리</h1>
            <p className="text-muted-foreground">
              직원 목록을 확인하고 관리할 수 있습니다.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Upload className="mr-2 h-4 w-4" />
              가져오기
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              내보내기
            </Button>
            <Button size="sm">
              <PlusCircle className="mr-2 h-4 w-4" />
              직원 추가
            </Button>
          </div>
        </div>

        {/* 필터 영역 */}
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
            <Input
              type="search"
              placeholder="이름, 사번, 이메일, 전화번호로 검색"
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <Select
              value={departmentFilter}
              onValueChange={setDepartmentFilter}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="부서" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={positionFilter} onValueChange={setPositionFilter}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="직급" />
              </SelectTrigger>
              <SelectContent>
                {positions.map((pos) => (
                  <SelectItem key={pos} value={pos}>
                    {pos}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="상태" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* 테이블 영역 */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">#</TableHead>
                <TableHead className="min-w-[150px]">
                  <div
                    className="flex items-center cursor-pointer"
                    onClick={() => handleSort("name")}
                  >
                    직원 정보
                    {renderSortIcon("name")}
                  </div>
                </TableHead>
                <TableHead>
                  <div
                    className="flex items-center cursor-pointer"
                    onClick={() => handleSort("department")}
                  >
                    부서
                    {renderSortIcon("department")}
                  </div>
                </TableHead>
                <TableHead>
                  <div
                    className="flex items-center cursor-pointer"
                    onClick={() => handleSort("position")}
                  >
                    직급
                    {renderSortIcon("position")}
                  </div>
                </TableHead>
                <TableHead className="hidden md:table-cell">연락처</TableHead>
                <TableHead>
                  <div
                    className="flex items-center cursor-pointer"
                    onClick={() => handleSort("status")}
                  >
                    상태
                    {renderSortIcon("status")}
                  </div>
                </TableHead>
                <TableHead className="hidden md:table-cell">
                  <div
                    className="flex items-center cursor-pointer"
                    onClick={() => handleSort("hireDate")}
                  >
                    입사일
                    {renderSortIcon("hireDate")}
                  </div>
                </TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center py-10 text-muted-foreground"
                  >
                    검색 결과가 없습니다.
                  </TableCell>
                </TableRow>
              ) : (
                filteredEmployees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell className="font-medium">{employee.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          {employee.image ? (
                            <AvatarImage
                              src={employee.image}
                              alt={employee.name}
                            />
                          ) : (
                            <AvatarFallback className="bg-primary text-primary-foreground">
                              {getInitials(employee.name)}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div>
                          <div className="font-medium">{employee.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {employee.employeeId}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{employee.department}</TableCell>
                    <TableCell>{employee.position}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center text-xs">
                          <Mail className="mr-1 h-3 w-3" /> {employee.email}
                        </div>
                        <div className="flex items-center text-xs">
                          <Phone className="mr-1 h-3 w-3" /> {employee.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(employee.status)}`}>
                        {employee.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex items-center text-xs">
                        <Clock className="mr-1 h-3 w-3" /> {employee.hireDate}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">더보기</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>작업</DropdownMenuLabel>
                          <DropdownMenuItem>상세 정보</DropdownMenuItem>
                          <DropdownMenuItem>정보 수정</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>이메일 보내기</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            퇴사 처리
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* 페이지네이션 영역 (실제 구현에서는 서버 데이터 기반으로 구현) */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            총 {filteredEmployees.length}명의 직원
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" disabled>
              이전
            </Button>
            <Button variant="outline" size="sm" className="px-4">
              1
            </Button>
            <Button variant="outline" size="sm" disabled>
              다음
            </Button>
          </div>
        </div>
      </div>
    </IntranetLayout>
  );
}

