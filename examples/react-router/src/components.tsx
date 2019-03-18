import React from 'react';
import { Link } from 'react-router-dom';

export function Index() {
  return <h2>Home</h2>;
}

export function About() {
  return <h2>About</h2>;
}

export function Header() {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
        <li>
          <Link to="/luis/">Luis</Link>
        </li>
      </ul>
    </nav>
  );
}
