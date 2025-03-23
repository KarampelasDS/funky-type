import { useState } from "react";
import styles from "./subbar.module.css";

export default function Subbar(props) {
  const [selected, setSelected] = useState(props.option1);
  return (
    <div className={styles.subbar}>
      <ul>
        <li
          className={selected == props.option1 ? styles.selected : ""}
          onClick={() => setSelected(props.option1)}
        >
          {props.option1}
        </li>
        <li
          className={selected == props.option2 ? styles.selected : ""}
          onClick={() => setSelected(props.option2)}
        >
          {props.option2}
        </li>
        <li
          className={selected == props.option3 ? styles.selected : ""}
          onClick={() => setSelected(props.option3)}
        >
          {props.option3}
        </li>
        <li
          className={selected == props.option4 ? styles.selected : ""}
          onClick={() => setSelected(props.option4)}
        >
          {props.option4}
        </li>
      </ul>
    </div>
  );
}
