"use client";
import { useState } from 'react';
import { NavbarSimple } from "@/components/Navbar/NavbarSimple";
import styles from './layout.module.css';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isNavbarHidden, setIsNavbarHidden] = useState(false);

  return (
    <div className={styles.layoutWrapper}>
      <NavbarSimple isHidden={isNavbarHidden} setIsHidden={setIsNavbarHidden} />
      <main className={`${styles.mainContent} ${isNavbarHidden ? styles.fullWidth : ''}`}>
        {children}
      </main>
    </div>
  );
}
