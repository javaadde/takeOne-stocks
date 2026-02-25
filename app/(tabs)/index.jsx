import DashboardScreen from "../../src/screens/DashboardScreen";
import { useRouter } from "expo-router";
import AnimatedPage from "../../src/components/AnimatedPage";

export default function DashboardRoute() {
  const router = useRouter();
  return (
    <AnimatedPage>
      <DashboardScreen
        onTabChange={(tab) => {
          const map = {
            Stocks: "/stocks",
            AddStock: "/add",
            History: "/history",
            Settings: "/settings",
          };
          if (map[tab]) router.push(map[tab]);
        }}
      />
    </AnimatedPage>
  );
}
