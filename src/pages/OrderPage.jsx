// 주문 페이지 ("/") — 상단 / 메뉴 목록 / 주문서
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { menu } from "../data/menu";
import MenuCard from "../components/MenuCard";
import Header from "../components/Header";
import { useAuth } from "@/lib/AuthContext";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function OrderPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // cart: [{ id: 메뉴 id, quantity: 수량 }, ...]
  const [cart, setCart] = useState([]);
  const [pickupTime, setPickupTime] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 메뉴를 담는다 — 이미 담겨있으면 수량만 +1, 처음이면 새로 추가
  function addToCart(menuId) {
    setCart((prev) => {
      const existing = prev.find((line) => line.id === menuId);
      if (existing) {
        return prev.map((line) =>
          line.id === menuId ? { ...line, quantity: line.quantity + 1 } : line
        );
      }
      return [...prev, { id: menuId, quantity: 1 }];
    });
  }

  // 수량을 delta만큼 바꾼다 — 0 이하가 되면 목록에서 제거
  function changeQuantity(menuId, delta) {
    setCart((prev) =>
      prev
        .map((line) =>
          line.id === menuId
            ? { ...line, quantity: line.quantity + delta }
            : line
        )
        .filter((line) => line.quantity > 0)
    );
  }

  const totalCount = cart.reduce((sum, line) => sum + line.quantity, 0);

  const totalPrice = cart.reduce((sum, line) => {
    const menuItem = menu.find((item) => item.id === line.id);
    return sum + menuItem.price * line.quantity;
  }, 0);

  // 주문하기 — 픽업 희망 시간이 비어있으면 막고, 통과하면 orders 테이블에 저장한다
  async function handleOrder() {
    if (pickupTime.trim() === "") {
      setSuccessMessage("");
      setErrorMessage("픽업 희망 시간을 입력해주세요.");
      return;
    }

    // 장바구니를 '메뉴명 xN' 형태의 한 줄 텍스트로 합친다
    const itemsText = cart
      .map((line) => {
        const menuItem = menu.find((item) => item.id === line.id);
        return `${menuItem.name} x${line.quantity}`;
      })
      .join(", ");

    setErrorMessage("");
    setSuccessMessage("");
    setIsSubmitting(true);

    const { error } = await supabase.from("orders").insert({
      user_id: user.id,
      pickup_time: pickupTime,
      items: itemsText,
      total_price: totalPrice,
    });

    setIsSubmitting(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    setSuccessMessage("주문이 접수되었습니다.");
    setCart([]);
    setPickupTime("");
  }

  return (
    <div className="mx-auto max-w-4xl space-y-10 px-4 py-8">
      {/* 상단: 가게 이름 + 장바구니 배지 + 로그인/내 주문 버튼 영역 */}
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">핫한 디저트 가게</h1>
          <p className="text-sm text-muted-foreground">
            장바구니 {totalCount}개
          </p>
        </div>
        <Header />
      </header>

      {/* 중간: 오늘의 메뉴 카드 목록 */}
      <main className="space-y-4">
        <h2 className="text-xl font-semibold">오늘의 메뉴</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {menu.map((item) => (
            <MenuCard key={item.id} item={item} onAdd={addToCart} />
          ))}
        </div>
      </main>

      {/* 하단: 주문서 — 담은 품목, 합계, 픽업 희망 시간, 주문하기 버튼 */}
      <footer className="space-y-4 rounded-lg border bg-card p-6 shadow-sm">
        <h2 className="text-xl font-semibold">주문서</h2>
        {cart.length === 0 ? (
          <p className="text-sm text-muted-foreground">담은 메뉴가 없습니다.</p>
        ) : (
          <ul className="space-y-2">
            {cart.map((line) => {
              const menuItem = menu.find((item) => item.id === line.id);
              return (
                <li
                  key={line.id}
                  className="flex items-center justify-between gap-4 text-sm"
                >
                  <span>
                    {menuItem.name} - {menuItem.price.toLocaleString()}원 x{" "}
                    {line.quantity}
                  </span>
                  <span className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => changeQuantity(line.id, -1)}
                    >
                      −
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => changeQuantity(line.id, 1)}
                    >
                      +
                    </Button>
                  </span>
                </li>
              );
            })}
          </ul>
        )}
        <p className="font-semibold">합계: {totalPrice.toLocaleString()}원</p>

        <div className="space-y-2">
          <Label htmlFor="pickup-time">픽업 희망 시간</Label>
          <Input
            id="pickup-time"
            placeholder="예: 오후 3시"
            value={pickupTime}
            onChange={(e) => setPickupTime(e.target.value)}
          />
        </div>

        {errorMessage && <p className="text-sm text-destructive">{errorMessage}</p>}
        {successMessage && (
          <p className="text-sm text-emerald-600">{successMessage}</p>
        )}

        {user ? (
          <Button
            disabled={cart.length === 0 || isSubmitting}
            onClick={handleOrder}
          >
            {isSubmitting ? "주문 접수 중..." : "주문하기"}
          </Button>
        ) : (
          <Button onClick={() => navigate("/auth")}>로그인하고 주문하기</Button>
        )}
      </footer>
    </div>
  );
}

export default OrderPage;
