import React from "react";

interface NavbarProps {
  title: string;
}

const Navbar: React.FC<NavbarProps> = ({ title }) => {
  return (
    <nav className="dark:bg-slate-700 dark:text-neutral-200 p-1">
      <h1 className="capitalize ">{title}</h1>
    </nav>
  );
};

export default Navbar;
