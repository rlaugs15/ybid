"use client";

import CompanyTable from "@/components/common/CompanyTable";
import Loading from "@/components/common/Loading";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useCompanies from "@/hooks/companies/useCompanies";
import useUser from "@/hooks/user/useUser";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

/* const SALES_STATUS_LABELS: Record<string, string> = {
  new: "진행 중",
  contracted: "계약 완료",
}; */

export default function MyCompaniesClient() {
  const { data: user, isPending: isUserPending } = useUser();

  const [keyword, setKeyword] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [interestLevel, setInterestLevel] = useState("all");
  const [salesStatus, setSalesStatus] = useState("all");
  const [region, setRegion] = useState("all");

  const params = useMemo(
    () => ({
      ownerId: user?.id,
      keyword: searchKeyword,
      interestLevel: interestLevel === "all" ? undefined : interestLevel,
      salesStatus: salesStatus === "all" ? undefined : salesStatus,
      region: region === "all" ? undefined : region,
    }),
    [user?.id, searchKeyword, interestLevel, salesStatus, region],
  );

  const { data: companies = [], isPending: isCompaniesPending } = useCompanies(params);

  const resetFilters = () => {
    setKeyword("");
    setInterestLevel("all");
    setSalesStatus("all");
    setRegion("all");
  };

  useEffect(() => {
    resetFilters();
  }, []);

  if (isUserPending || isCompaniesPending) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      <Card className="rounded-2xl border border-gray-100 shadow-sm">
        <CardContent className="space-y-4 p-6">
          <div className="flex gap-3">
            <Input
              className="max-w-md"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setSearchKeyword(keyword);
                }
              }}
              placeholder="업체명, 대표자, 담당자, 연락처, 지역 검색"
            />

            <Button onClick={() => setSearchKeyword(keyword)}>검색</Button>
          </div>

          <div className="flex items-center gap-3">
            <Select value={interestLevel} onValueChange={setInterestLevel}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="관심도 전체" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">관심도 전체</SelectItem>
                <SelectItem value="high">상</SelectItem>
                <SelectItem value="medium">중</SelectItem>
                <SelectItem value="low">하</SelectItem>
              </SelectContent>
            </Select>

            <Select value={salesStatus} onValueChange={setSalesStatus}>
              <SelectTrigger className="w-44">
                <SelectValue placeholder="영업 상태 전체" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">영업 상태 전체</SelectItem>
                <SelectItem value="new">진행 중</SelectItem>
                <SelectItem value="contracted">계약 완료</SelectItem>
              </SelectContent>
            </Select>

            {/* <Select value={region} onValueChange={setRegion}>
              <SelectTrigger className="w-44">
                <SelectValue placeholder="지역 전체" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">지역 전체</SelectItem>
                <SelectItem value="서울특별시 강남구">서울특별시 강남구</SelectItem>
                <SelectItem value="서울특별시 서초구">서울특별시 서초구</SelectItem>
                <SelectItem value="경기도 성남시">경기도 성남시</SelectItem>
              </SelectContent>
            </Select> */}

            <Button variant="outline" onClick={resetFilters}>
              초기화
            </Button>

            <Button asChild className="ml-auto">
              <Link href="/companies/new">업체 등록</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <CompanyTable companies={companies} />
    </div>
  );
}
