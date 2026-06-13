import FallbackMessage from "@/components/common/FallbackMessage";
import Loading from "@/components/common/Loading";
import { DashboardTodayContact } from "@/types/dashboard";
import TodayContactCard from "./TodayContactCard";

type Props = {
  contacts: DashboardTodayContact[];
  isLoading: boolean;
};

export default function TodayContactsSection({ contacts, isLoading }: Props) {
  return (
    <section className="space-y-6">
      <h2 className="text-h2 font-bold">오늘 연락해야 할 업체</h2>

      <div className="space-y-4">
        {isLoading && <Loading />}

        {!isLoading && contacts.length === 0 && (
          <FallbackMessage message="오늘 연락해야 할 업체가 없습니다." />
        )}

        {contacts.map((contact) => (
          <TodayContactCard key={contact.id} contact={contact} />
        ))}
      </div>
    </section>
  );
}
