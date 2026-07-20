import * as React from "react";

import { supabase } from "@/lib/supabase";

// 앱 전체에서 로그인 세션을 공유하기 위한 Context
const AuthContext = React.createContext(undefined);

function AuthProvider({ children }) {
  const [session, setSession] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // 처음 앱이 뜰 때 현재 세션을 한 번 가져온다
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setIsLoading(false);
    });

    // 로그인/로그아웃/토큰 갱신 등 세션이 바뀔 때마다 반영한다
    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => {
        setSession(nextSession);
      }
    );

    return () => {
      subscription.subscription.unsubscribe();
    };
  }, []);

  const value = {
    session,
    user: session?.user ?? null,
    isLoading,
    signOut: () => supabase.auth.signOut(),
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

// 컴포넌트에서 로그인 세션 상태를 꺼내 쓰기 위한 훅
function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth는 AuthProvider 안에서만 사용할 수 있습니다.");
  }
  return context;
}

export { AuthProvider, useAuth };
