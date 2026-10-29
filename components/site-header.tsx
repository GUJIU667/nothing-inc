"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/", label: "HOME" },
  { href: "/about", label: "ABOUT" },
  { href: "/careers", label: "CAREERS" },
  { href: "/careers#join", label: "JOIN US" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <a className="brand" href="/" aria-label="Nothing Inc. home">
        <span className="brand-symbol">NØ</span>
        <span className="brand-name">NOTHING INC.<small>无事集团</small></span>
      </a>
      <button
        className="menu-toggle"
        type="button"
        aria-expanded={open}
        aria-controls="primary-navigation"
        onClick={() => setOpen((value) => !value)}
      >
        <span>{open ? "CLOSE" : "MENU"}</span>
        <i aria-hidden="true" />
      </button>
      <nav id="primary-navigation" className={open ? "primary-nav is-open" : "primary-nav"} aria-label="Primary navigation">
        {links.map((link) => {
          const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href.split("#")[0]);
          return <a key={link.label} href={link.href} aria-current={active ? "page" : undefined} onClick={() => setOpen(false)}>{link.label}</a>;
        })}
      </nav>
    </header>
  );
}
