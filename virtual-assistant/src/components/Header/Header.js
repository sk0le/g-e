import React from "react";
import { Link } from "react-router-dom";
import "./header.css";

export default function Header() {
  return (
    <header>
      <h1>G.E.</h1>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
      </ul>
    </header>
  );
}
