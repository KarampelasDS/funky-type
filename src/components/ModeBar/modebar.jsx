import Image from "next/image";
import styles from "./modebar.module.css";

// Icons
import { TbClockHour3Filled } from "react-icons/tb";
import { LuBookA } from "react-icons/lu";
import { HiCalculator } from "react-icons/hi";
import { FaQuoteRight } from "react-icons/fa6";
import { FaWrench } from "react-icons/fa";

// React
import { useState } from "react";
import Subbar from "../SubBar/subbar";

export default function ModeBar() {
  const [selected, setSelected] = useState("Time");
  return (
    <div className={styles.container}>
      <div className={styles.modebar}>
        <ul>
          <li
            className={selected === "Time" ? styles.selected : ""}
            onClick={() => setSelected("Time")}
          >
            <TbClockHour3Filled />
            Time
          </li>
          <li
            className={selected === "Words" ? styles.selected : ""}
            onClick={() => setSelected("Words")}
          >
            <LuBookA />
            Words
          </li>
          <li
            className={selected === "Numbers" ? styles.selected : ""}
            onClick={() => setSelected("Numbers")}
          >
            <HiCalculator />
            Numbers
          </li>
          <li
            className={selected === "Quotes" ? styles.selected : ""}
            onClick={() => setSelected("Quotes")}
          >
            <FaQuoteRight />
            Quotes
          </li>
          <li
            className={selected === "Custom" ? styles.selected : ""}
            onClick={() => setSelected("Custom")}
          >
            <FaWrench />
            Custom
          </li>
        </ul>
      </div>
      <div>
        {(() => {
          switch (selected) {
            case "Time":
              return (
                <Subbar
                  key="Time"
                  option1="15"
                  option2="30"
                  option3="60"
                  option4="120"
                />
              );
            case "Words":
              return (
                <Subbar
                  key="Words"
                  option1="10"
                  option2="25"
                  option3="50"
                  option4="100"
                />
              );
            case "Numbers":
              return (
                <Subbar
                  key="Numbers"
                  option1="25"
                  option2="50"
                  option3="75"
                  option4="100"
                />
              );
            case "Quotes":
              return (
                <Subbar
                  key="Quotes"
                  option1="Famous"
                  option2="Movies"
                  option3="Books"
                  option4="Songs"
                />
              );
            case "Custom":
              return <Subbar key="Custom" option1="Configure" />;
            default:
              return null;
          }
        })()}
      </div>
    </div>
  );
}
