"use client";

import React from "react";
import NavLink from "./NavLink";

type NavLinksProps = {
  links: { name: string; href: string }[];
};

const NavLinks: React.FC<NavLinksProps> = ({ links }) => {
  return (
    <div className="ml-10 flex items-baseline space-x-4 space-x-reverse">
      {links.map((link, i) => (
        <NavLink
          key={link.name}
          href={link.href}
          label={link.name}
          delay={i * 0.06}
        />
      ))}
    </div>
  );
};

export default React.memo(NavLinks);
