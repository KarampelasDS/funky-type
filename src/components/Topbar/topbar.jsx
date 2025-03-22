import Image from "next/image";
import { FaCog } from "react-icons/fa";
import styles from "./topbar.module.css";

export default function Topbar() {
  return (
    <div className={styles.container}>
      <Image src="/logo.png" alt="logo" width={150} height={150} />
      <h1>Test</h1>
      <FaCog size={40} />
    </div>
  );
}
