"use client";
import Image from "next/image";
import Link from "next/link";

import styles from "./navbar.module.css";
import { useEffect, useState } from "react";
import { getAuthStateChangeHelper } from "../utils/firebase/app";
import { User } from "firebase/auth";
import SignIn from "./signin";

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null); // setUser is the onClick function

  // set up on mount. Set up getAuthStateChangeHelper.
  useEffect(() => {
    const unsubscribe = getAuthStateChangeHelper((user) => {
      setUser(user); // either signOut or signIn with user. This is used by getAuthChange and will be stored in the server.
    });

    return () => unsubscribe(); // if only unsubscribe, it will execute unsub in the first place
  }, []); /* No dependencies */

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
      <SignIn user={user} />
    </nav>
  );
}
