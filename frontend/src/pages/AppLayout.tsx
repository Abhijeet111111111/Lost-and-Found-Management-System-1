import type { ReactElement } from "react";
import styles from "./AppLayout.module.css";
import Sidebar from "../Components/Sidebar";
import Map from "../Components/Map";
// import User from "../components/User";

function AppLayout(): ReactElement {
  return (
    <div className={styles.app}>
      <Sidebar />
      <Map />
      {/* <Map />
      <User /> */}
    </div>
  );
}

export default AppLayout;
