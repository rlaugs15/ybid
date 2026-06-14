import { Button } from "@/components/ui/button";
import useArchiveCompany from "@/hooks/companies/useArchiveCompany";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

type Props = {
  companyId: string;
};

export default function ArchiveCompanyButton({ companyId }: Props) {
  const router = useRouter();
  const { mutate, isPending } = useArchiveCompany();

  const handleDelete = () => {
    const confirmed = window.confirm("업체를 삭제하시겠습니까?\n삭제된 업체는 보관 처리됩니다.");

    if (!confirmed) return;

    mutate(companyId, {
      onSuccess: () => {
        router.push("/companies");
      },
    });
  };

  return (
    <Button
      onClick={handleDelete}
      disabled={isPending}
      variant="outline"
      className="h-12 rounded-2xl border-red-200 px-6 text-red-500 hover:bg-red-50"
    >
      <Trash2 size={16} />
      {isPending ? "삭제 중..." : "삭제"}
    </Button>
  );
}
