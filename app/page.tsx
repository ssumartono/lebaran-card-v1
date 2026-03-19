'use client';

import { useState, useEffect } from 'react';
import { EidCardForm } from '@/components/eid-card-form';
import { Login } from '@/components/login';

export default function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const handleLogin = () => {
    localStorage.setItem('isAuthenticated', 'true');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
  };

  if (isAuthenticated === null) {
    return null;
  }

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <>
      <div style={{ position: 'absolute', top: '24px', right: '24px', zIndex: 50 }}>
        <button 
          className="secondary-button" 
          onClick={handleLogout} 
          style={{ margin: 0, padding: '8px 16px', fontSize: '14px' }}
        >
          Logout
        </button>
      </div>
      <EidCardForm />
    </>
  );
}
