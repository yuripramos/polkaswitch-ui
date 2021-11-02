import React from 'react';
import {Link, NavLink} from "react-router-dom";

export default function NavMenu(props) {
  return (
    <div className="nav-menu">
      <NavLink exact className="nav-link" activeClassName="active" to="/swap">Trade</NavLink>
      <NavLink className="nav-link" activeClassName="active" to="/bridge">Bridge</NavLink>
    </div>
  );
}

