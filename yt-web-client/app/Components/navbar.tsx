import Image from "next/image";
import Link from "next/link";

import styles from "./navbar.module.css";

export default function Navbar() {
  return (
    <nav className={styles.nav}>
      <Link href={"/"}>
        <Image
          height={20}
          width={90}
          src={"/youtube-logo.svg"} // Image looks at public folder
          alt="Youtube Logo"
        />
      </Link>
    </nav>
  );
}
