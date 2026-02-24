import { ThemeProvider } from "@/contexts/ThemeContext";
import { MindMapClient } from "./MindMapClient";

export default function Home() {
  return (
    <ThemeProvider>
      <MindMapClient />
    </ThemeProvider>
  );
}
