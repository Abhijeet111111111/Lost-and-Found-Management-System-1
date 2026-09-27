import styles from "./ButtonRelative.module.css";

function ButtonRelative({ children, fn, styleClass }) {
  return (
    <button
      onClick={fn}
      className={`${styles.btn} ${styles.primary} ${styles[styleClass]}`}
    >
      {children}
    </button>
  );
}

export default ButtonRelative;
