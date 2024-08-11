"use client";
import { User } from "firebase/auth";
import styles from "./signin.module.css";
import { signInWithGoogle, signOut } from "../utils/firebase/app";

interface signInProps {
  user: User | null;
}
export default function SignIn({ user }: signInProps) {
  return (
    <div>
      {user ? (
        <button className={styles.signIn} onClick={signOut}>
          Sign Out
        </button>
      ) : (
        <button className={styles.signIn} onClick={signInWithGoogle}>
          Sign In
        </button>
      )}
    </div>
  );
}
