import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Login from './Auth/Login';
import RequestAccess from './Auth/RequestAccess';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/"><h2>Definites</h2></Link>
      </div>
      
      <ul className="nav-links">
        <li><a href="#about">About</a></li>
        <li><a href="#services">Services</a></li>
        <li><a href="#why-us">Why Us</a></li>
        <li><a href="#expertise">Expertise</a></li>
        <li><a href="#insights">Insights</a></li>
        <li><a href="#testimonials">Testimonials</a></li>
        <li><a href="#team">Team</a></li>
      </ul>

      <div className="nav-cta">
        {!user ? (
          <>
            <Link to="/login" className="btn-secondary">Login</Link>
            <Link to="/request-access" className="btn-primary">Request Access</Link>
          </>
        ) : (
          <>
            <Link to={user.role === 'admin' ? "/admin-dashboard" : "/dashboard"} className="btn-secondary">Dashboard</Link>
            <button onClick={logout} className="btn-primary">Logout</button>
          </>
        )}
      </div>
    </nav>
  );
};


export default Navbar;