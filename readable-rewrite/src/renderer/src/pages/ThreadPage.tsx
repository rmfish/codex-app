import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppStore } from "@/app/store";
import { DashboardPage } from "@/pages/DashboardPage";

export function ThreadPage() {
  const { threadId } = useParams();
  const selectThread = useAppStore((state) => state.selectThread);

  useEffect(() => {
    if (!threadId) {
      return;
    }

    void selectThread(threadId);
  }, [selectThread, threadId]);

  return <DashboardPage />;
}
