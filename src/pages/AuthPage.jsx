import * as React from "react";
import { useNavigate } from "react-router-dom";

import { supabase } from "@/lib/supabase";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// 로그인/회원가입 폼 (이메일 + 비밀번호 공용)
function AuthForm({ submitLabel, onSubmit }) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    const { error } = await onSubmit({ email, password });

    setIsSubmitting(false);
    if (error) {
      setErrorMessage(error.message);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">이메일</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="password">비밀번호</Label>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          minLength={6}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </div>
      {errorMessage && (
        <p className="text-sm text-destructive">{errorMessage}</p>
      )}
      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "처리 중..." : submitLabel}
      </Button>
    </form>
  );
}

// 회원가입·로그인 페이지 ("/auth")
function AuthPage() {
  const navigate = useNavigate();

  // 로그인 성공 시 '/'로 이동
  async function handleSignIn({ email, password }) {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (!error) {
      navigate("/");
    }
    return { error };
  }

  // 회원가입 성공 시 '/'로 이동
  async function handleSignUp({ email, password }) {
    const { error } = await supabase.auth.signUp({ email, password });
    if (!error) {
      navigate("/");
    }
    return { error };
  }

  return (
    <div className="flex min-h-svh items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>오늘의 주문</CardTitle>
          <CardDescription>
            로그인하거나 새 계정을 만들어 주문을 확인해보세요.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login">
            <TabsList className="mb-4 w-full">
              <TabsTrigger value="login">로그인</TabsTrigger>
              <TabsTrigger value="signup">회원가입</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <AuthForm submitLabel="로그인" onSubmit={handleSignIn} />
            </TabsContent>
            <TabsContent value="signup">
              <AuthForm submitLabel="회원가입" onSubmit={handleSignUp} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

export default AuthPage;
