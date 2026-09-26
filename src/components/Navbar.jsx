import React, { useEffect, useState } from 'react';

const Navbar = () => {
  const [theme, setTheme] = useState({ skin: 'light', navbarColor: 'blue' });

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme-settings');
    if (storedTheme) {
      const parsed = JSON.parse(storedTheme);
      setTheme(parsed);
    }
  }, []);

  return (
    <nav className={`w-full p-4 ${theme.navbarColor === 'black' ? 'bg-black' : `bg-${theme.navbarColor}-500`} text-white`}>
      <div className="container mx-auto">Student Dashboard</div>
    </nav>
  );
};

export default Navbar;
