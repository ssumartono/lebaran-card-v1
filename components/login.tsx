'use client';

import { useState } from 'react';

export function Login({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'lebaran' && password === 'mubarak') {
      onLogin();
    } else {
      setError('Username atau password salah.');
    }
  };

  return (
    <div className="studio-shell" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <form className="panel" onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '400px' }}>
        <div className="panel-header" style={{ textAlign: 'center' }}>
          <h2>Login</h2>
          <p>Silakan masuk menggunakan kredensial Anda.</p>
        </div>
        
        <div className="field-grid">
          <label>
            <span>Username</span>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              placeholder="Username"
            />
          </label>
          <label>
            <span>Password</span>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="Password"
            />
          </label>
        </div>

        <button className="primary-button" type="submit" style={{ marginTop: '16px' }}>
          Login
        </button>

        {error && <div className="error-box">{error}</div>}
      </form>
    </div>
  );
}
