import Image from "next/image";
import { FaCog } from "react-icons/fa";
import styles from "./topbar.module.css";
import ModeBar from "../ModeBar/modebar";

export default function Topbar() {
  return (
    <div className={styles.container}>
      <Image
        className={styles.logo}
        src="/logo.png"
        alt="logo"
        width={150}
        height={150}
      />
      <FaCog size={40} />
    </div>
  );
}
