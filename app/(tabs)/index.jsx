import DashboardScreen from "../../src/screens/DashboardScreen";
import { useRouter } from "expo-router";

export default function DashboardRoute() {
  const router = useRouter();
  return (
    <DashboardScreen
      onTabChange={(tab) => {
        const map = {
          Stocks: "/stocks",
          AddStock: "/add",
          Analytics: "/analytics",
          Settings: "/settings",
        };
        if (map[tab]) router.push(map[tab]);
      }}
    />
  );
}
