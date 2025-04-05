import Topbar from "@/components/Topbar/topbar";
import TypingBox from "@/components/TypingBox/typingbox";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <title>Funky Type - Test and Improve your typing skills!</title>
      <Topbar />
      <TypingBox />
    </div>
  );
}
