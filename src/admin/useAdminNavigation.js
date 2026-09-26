import { useState } from 'react';

export const useAdminNavigation = (initialItem = 'Dashboard') => {
  const [activeMenuItem, setActiveMenuItem] = useState(initialItem);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleMenuItemClick = (itemLabel) => {
    setActiveMenuItem(itemLabel);
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return {
    activeMenuItem,
    sidebarCollapsed,
    handleMenuItemClick,
    toggleSidebar
  };
};