import Image from "next/image";
import { HiMiniQuestionMarkCircle } from "react-icons/hi2";

import styles from "./topbar.module.css";
import ModeBar from "../ModeBar/modebar";

export default function Topbar() {
  return (
    <div className={styles.container}>
      <Image
        className={styles.logo}
        src="/Logo.png"
        alt="logo"
        width={150}
        height={150}
        onClick={() => window.location.reload()}
        style={{ cursor: "pointer" }}
      />
      <HiMiniQuestionMarkCircle
        style={{ cursor: "pointer" }}
        size={40}
        onClick={() =>
          window
            .open(
              "https://typingcom.helpscoutdocs.com/article/205-how-wpm-words-per-minute-and-accuracy-are-calculated-teacher-student#:~:text=WPM%20is%20all%20about%20speed,numbers%2C%20letters%2C%20punctuation).",
              "_blank"
            )
            .focus()
        }
      />
    </div>
  );
}
