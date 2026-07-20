// 메뉴 한 개를 카드 형태로 보여주는 컴포넌트
// "담기" 버튼을 누르면 onAdd(item.id)를 호출해서 장바구니에 담습니다
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function MenuCard({ item, onAdd }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{item.name}</CardTitle>
        <CardDescription>{item.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{item.price.toLocaleString()}원</p>
      </CardContent>
      <CardFooter>
        <Button onClick={() => onAdd(item.id)}>담기</Button>
      </CardFooter>
    </Card>
  );
}

export default MenuCard;
