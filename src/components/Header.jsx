import { Link } from "react-router-dom";

import { useAuth } from "@/lib/AuthContext";
import { Button } from "@/components/ui/button";

// 상단 바 — 로그인 여부에 따라 다른 메뉴를 보여준다
function Header() {
  const { user, signOut } = useAuth();

  if (!user) {
    return (
      <nav>
        <Link to="/auth">
          <Button variant="outline" size="sm">
            로그인
          </Button>
        </Link>
      </nav>
    );
  }

  return (
    <nav className="flex items-center gap-3 text-sm">
      <span className="text-muted-foreground">{user.email}</span>
      <Link to="/my" className="underline underline-offset-4">
        내 주문
      </Link>
      <Button variant="outline" size="sm" onClick={() => signOut()}>
        로그아웃
      </Button>
    </nav>
  );
}

export default Header;
