import React from "react";
import classes from "./NavBar.module.css"
import {Link} from "react-router-dom"
import { LuMessageSquare } from "react-icons/lu";
import Cookie from"js-cookie"

const NavBar = () => {
  const token = Cookie.get("jwt")


  const handleLogout = async () =>{
    const res = await fetch("/api/logout", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    })
  
  }
  return <header className={classes.header}>
    <div className={classes.logoContainer}>
    <LuMessageSquare /> <span>Chatting</span>
    </div>
    {!token &&
    <nav className={classes.nav}>
    <ul className={classes.navItems}>
      <li><Link to="/" className={classes.navLink}>Home</Link ></li>
      <li><Link to="/signup" className={classes.navLink}>Sign Up</Link></li>
      <li><Link to="/login" className={classes.navLink}>Login</Link></li>
    </ul>
  </nav>
    }
    
    <div>
      <Link to="/settings" className={classes.navLink}>Settings</Link>
{token && <Link to="/login" className={classes.navLink} onClick={handleLogout} style={{marginLeft: 25}}>Logout</Link>}
    </div>
  </header>;
};

export default NavBar;
