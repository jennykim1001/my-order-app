// 내 주문 페이지 ("/my") — 로그인한 사용자의 주문을 최신순으로 보여준다
import * as React from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "@/lib/AuthContext";
import { supabase } from "@/lib/supabase";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// 상태값에 따라 Badge 색상을 다르게 준다 (접수: 주황, 완료: 초록, 그 외: 회색)
function statusBadgeClassName(status) {
  if (status === "접수") {
    return "bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300";
  }
  if (status === "완료") {
    return "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300";
  }
  return "bg-muted text-muted-foreground";
}

function MyOrdersPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = React.useState([]);
  const [isLoadingOrders, setIsLoadingOrders] = React.useState(true);
  const [errorMessage, setErrorMessage] = React.useState("");

  // 비로그인 상태면 /auth로 보낸다 (세션 로딩이 끝난 뒤에 판단)
  React.useEffect(() => {
    if (!isAuthLoading && !user) {
      navigate("/auth");
    }
  }, [isAuthLoading, user, navigate]);

  // 로그인한 사용자의 주문을 최신순으로 불러온다
  // RLS가 이미 "본인 주문만" 걸러주므로 select에는 필터를 넣지 않는다
  React.useEffect(() => {
    if (!user) return;

    async function loadOrders() {
      setIsLoadingOrders(true);
      setErrorMessage("");

      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        setErrorMessage(error.message);
      } else {
        setOrders(data);
      }
      setIsLoadingOrders(false);
    }

    loadOrders();
  }, [user]);

  if (isAuthLoading || !user) {
    return null;
  }

  return (
    <div className="mx-auto max-w-2xl p-4">
      <h1 className="mb-4 text-lg font-medium">내 주문</h1>

      {isLoadingOrders && <p className="text-sm text-muted-foreground">불러오는 중...</p>}
      {errorMessage && <p className="text-sm text-destructive">{errorMessage}</p>}

      {!isLoadingOrders && !errorMessage && orders.length === 0 && (
        <p className="text-sm text-muted-foreground">아직 주문 내역이 없습니다.</p>
      )}

      <div className="flex flex-col gap-3">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardHeader>
              <div className="flex items-center justify-between gap-2">
                <CardTitle>{order.items}</CardTitle>
                <Badge className={statusBadgeClassName(order.status)}>
                  {order.status}
                </Badge>
              </div>
              <CardDescription>
                {new Date(order.created_at).toLocaleString("ko-KR")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{order.total_price.toLocaleString()}원</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default MyOrdersPage;
