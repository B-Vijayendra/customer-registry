import React from 'react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200/70 px-6 py-4 text-center text-xs text-slate-400 dark:border-white/10">
      © {new Date().getFullYear()} Customer Registry Management System. Built with the MERN stack.
    </footer>
  );
}
