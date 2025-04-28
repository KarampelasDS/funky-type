import { useState, useRef, useEffect } from "react";
import { IoReload } from "react-icons/io5";
import styles from "./typingbox.module.css";
import Image from "next/image";

export default function TypingBox() {
  const [totalText, setTotalText] = useState("Loading...");
  const [author, setAuthor] = useState("Unknown Author");
  const [authorImg, setAuthorImg] = useState(
    "https://i.imgur.com/ZvQJPOy.jpeg"
  );
  const words = totalText.split(" ");
  const [activeWord, setActiveWord] = useState(0);
  const [activeChar, setActiveChar] = useState(0);
  const [typedWords, setTypedWords] = useState(
    words.map((word) => Array(word.length).fill(null))
  );
  const [startTime, setStartTime] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef(null);

  const normalizeText = (text) => {
    return text
      .replace(/’/g, "'")
      .replace(/\s+/g, " ")
      .replace(/“/g, '"')
      .replace(/”/g, '"')
      .replace(/–/g, "-")
      .replace(/—/g, "-")
      .replace(/…/g, "...");
  };

  const getQuote = async () => {
    const url = "https://corsproxy.io/?url=https://api.hamatim.com/quote";
    const response = await fetch(url);
    const myJson = await response.json();
    const normalizedText = normalizeText(myJson.text);
    setTotalText(normalizedText);
    setAuthor(myJson.author);
    setAuthorImg(myJson.author_img);
    const newWords = normalizedText.split(" ");
    setTypedWords(newWords.map((word) => Array(word.length).fill(null)));
    setActiveWord(0);
    setActiveChar(0);
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
    getQuote();
  }, []);

  const handleInputChange = (e) => {
    const newValue = normalizeText(e.target.value);
    const currentWord = words[activeWord];
    const currentChar =
      activeChar < currentWord.length ? currentWord[activeChar] : " ";
    if (!startTime && newValue.length > 0) {
      setStartTime(Date.now());
    }
    if (newValue.length < inputValue.length) {
      if (activeChar > 0) {
        setTypedWords((prev) => {
          const updated = [...prev];
          updated[activeWord][activeChar - 1] = null;
          return updated;
        });
        setActiveChar((prev) => prev - 1);
      } else if (activeWord > 0) {
        setActiveWord((prev) => prev - 1);
        setActiveChar(words[activeWord - 1].length);
      }
    } else if (newValue[newValue.length - 1] === currentChar) {
      setTypedWords((prev) => {
        const updated = [...prev];
        if (activeChar < currentWord.length) {
          updated[activeWord][activeChar] = true;
        }
        return updated;
      });
      if (activeChar < currentWord.length) {
        setActiveChar((prev) => prev + 1);
      } else if (newValue[newValue.length - 1] === " ") {
        if (activeWord + 1 < words.length) {
          setActiveWord((prev) => prev + 1);
          setActiveChar(0);
        }
      }
      if (
        activeChar + 1 === currentWord.length &&
        activeWord + 1 === words.length
      ) {
        setIsCompleted(true);
        calculateResults();
      }
    } else {
      setMistakes((prev) => prev + 1);
      setTypedWords((prev) => {
        const updated = [...prev];
        if (activeChar < currentWord.length) {
          updated[activeWord][activeChar] = false;
        }
        return updated;
      });
      if (activeChar < currentWord.length) {
        setActiveChar((prev) => prev + 1);
      }
    }
    setInputValue(newValue);
  };

  const calculateResults = () => {
    const endTime = Date.now();
    const timeInMinutes = (endTime - startTime) / 60000;
    const totalWordsTyped = words.slice(0, activeWord + 1).length;
    const calculatedWpm = Math.round(totalWordsTyped / timeInMinutes);
    setWpm(calculatedWpm);
    let totalTypedChars = 0;
    typedWords.forEach((word) => {
      word.forEach((char) => {
        if (char !== null) {
          totalTypedChars++;
        }
      });
    });
    const correctChars = totalTypedChars - mistakes;
    const calculatedAccuracy = Math.max(
      Math.round((correctChars / totalTypedChars) * 100),
      0
    );
    setAccuracy(calculatedAccuracy);
  };

  const retryTest = () => {
    setActiveWord(0);
    setActiveChar(0);
    setTypedWords(words.map((word) => Array(word.length).fill(null)));
    setStartTime(null);
    setIsCompleted(false);
    setWpm(0);
    setAccuracy(0);
    setMistakes(0);
    setInputValue("");
    getQuote();
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 0);
  };

  return (
    <div className={styles.container}>
      {!isCompleted ? (
        <div className={styles.typingboxContainer}>
          <div className={styles.typingbox}>
            <div className={styles.staticText}>
              {words.map((word, wordIndex) => (
                <span
                  key={wordIndex}
                  className={
                    !isCompleted && activeWord === wordIndex
                      ? styles.activeWord
                      : ""
                  }
                >
                  {word.split("").map((letter, charIndex) => {
                    let charClass = "";
                    if (typedWords[wordIndex][charIndex] === true) {
                      charClass = styles.correctChar;
                    } else if (typedWords[wordIndex][charIndex] === false) {
                      charClass = styles.incorrectChar;
                    }
                    return (
                      <span key={charIndex} className={charClass}>
                        {!isCompleted &&
                          isFocused &&
                          activeWord === wordIndex &&
                          activeChar === charIndex && (
                            <span className={styles.cursor}></span>
                          )}
                        {letter}
                      </span>
                    );
                  })}
                  {!isCompleted &&
                    isFocused &&
                    activeWord === wordIndex &&
                    activeChar === word.length && (
                      <span className={styles.cursor}></span>
                    )}{" "}
                </span>
              ))}
            </div>
            <input
              ref={inputRef}
              className={styles.inputArea}
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              spellCheck="false"
              autoComplete="off"
            />
          </div>
          <button className={styles.retryButton} onClick={retryTest}>
            <IoReload size={40} />
            <span className={styles.retryTooltip}>Refresh</span>
          </button>
        </div>
      ) : (
        <div className={styles.results}>
          <h1>You just typed a quote by {author}</h1>
          <Image
            src={authorImg}
            width={100}
            height={100}
            alt="Author's image"
          />
          <h1>WPM: {wpm}</h1>
          <h1>Accuracy: {accuracy}%</h1>
          <button className={styles.retryButton} onClick={retryTest}>
            <IoReload size={40} />
            <span className={styles.retryTooltip}>Play Again</span>
          </button>
        </div>
      )}
    </div>
  );
}
