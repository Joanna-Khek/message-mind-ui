"use client";

import { useState } from 'react';
import {
  IconMenu2,
  IconX,
  IconBellRinging,
  IconLogout,
  IconReceipt2,
  IconSwitchHorizontal,
} from '@tabler/icons-react';
import { Group } from '@mantine/core';
import classes from './NavbarSimple.module.css';
import { useRouter } from 'next/navigation';
import { authClient } from "@/lib/auth-client";
import Image from 'next/image';

const data = [
  { link: '/dashboard', label: 'Dashboard', icon: IconBellRinging },
  { link: '', label: 'Completed', icon: IconReceipt2 },
];

export function NavbarSimple({
  isHidden,
  setIsHidden,
}: {
  isHidden: boolean;
  setIsHidden: (val: boolean) => void;
}) {
  const toggleNavbar = () => {
    setIsHidden(!isHidden);
  };
  const [active, setActive] = useState('Dashboard');

  const router = useRouter(); // Initialize router

  const handleLogout = async (event: React.MouseEvent) => {
    event.preventDefault();
    await authClient.signOut();
    router.push('/'); // redirect to home or login page after logout
  };


  const links = data.map((item) => (
    <a
      className={classes.link}
      data-active={item.label === active || undefined}
      href={item.link}
      key={item.label}
      onClick={(event) => {
        event.preventDefault();
        setActive(item.label);
        router.push(item.link); // Navigate to the link
      }}
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </a>
  ));

  return (
    <>
      <button
          className={classes.toggleButton}
          onClick={toggleNavbar}
          aria-label={isHidden ? 'Show navbar' : 'Hide navbar'}
      >
        {isHidden ? <IconMenu2 size={20} /> : <IconX size={20} />}
      </button>
      
      <nav className={`${classes.navbar} ${isHidden ? classes.contracted : ''}`}>
        <div className={classes.navbarMain}>
          <Group className={classes.header} justify="space-between">
            <Image 
              src="/message-mind-logo.svg" 
              alt="Logo"
              width={160} 
              height={40} 
              className={classes.logo}
            />
          </Group>
          {links}
        </div>

        <div className={classes.footer}>
          <a href="#" className={classes.link} onClick={(event) => event.preventDefault()}>
            <IconSwitchHorizontal className={classes.linkIcon} stroke={1.5} />
            <span>Change account</span>
          </a>

          <a href="#" className={classes.link} onClick={handleLogout}>
            <IconLogout className={classes.linkIcon} stroke={1.5} />
            <span>Logout</span>
          </a>
        </div>
      </nav>
    </>
  );
}