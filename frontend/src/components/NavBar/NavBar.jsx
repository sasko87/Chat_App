import React, { useEffect, useState } from "react";
import classes from "./NavBar.module.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LuMessageSquare } from "react-icons/lu";
import Cookie from "js-cookie";
import AlertMessage from "../AlertMessage/AlertMessage";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoMdClose } from "react-icons/io";
import { disconnectSocket } from "../../lib/socket";

const NavBar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [message, setMessage] = useState("");
  const [activeMobileNav, setActiveMobileNav] = useState(false);
  const token = Cookie.get("jwt");
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    const checkToken = () => {
      const token = Cookie.get("jwt");
      setIsLoggedIn(!!token);
    };

    checkToken();

    const interval = setInterval(checkToken, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    const res = await fetch("/api/logout", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (res.ok) {
      const data = await res.json();
      setMessage(data.message);
    }
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
      }, 2000); // 2 seconds

      return () => clearTimeout(timer); // cleanup
    }
  }, [message]);

  const handleMobileNav = () => {
    setActiveMobileNav((prevNav) => !prevNav);
  };

  useEffect(() => {
    setActiveMobileNav(false);
  }, [location]);
  return (
    <header className={classes.header}>
      <div className={classes.logoContainer} onClick={() => navigate("/")}>
        <LuMessageSquare /> <span>Chatting</span>
      </div>

      {!isLoggedIn && (
        <div>
          <nav className={classes.nav}>
            <ul className={classes.navItems}>
              <li>
                <Link to="/login" className={classes.navLink}>
                  Login
                </Link>
              </li>
              <li>
                <Link to="/signup" className={classes.navLink}>
                  Sign Up
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      )}

      {isLoggedIn && (
        <div>
          <nav className={classes.nav}>
            <ul className={classes.navItems}>
              <li>
                <Link to="/" className={classes.navLink}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/profile" className={classes.navLink}>
                  Profile
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className={classes.navLink}
                  onClick={handleLogout}
                >
                  Logout
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      )}

      {activeMobileNav ? (
        <IoMdClose
          className={classes.hamburgerMenu}
          onClick={handleMobileNav}
        />
      ) : (
        <GiHamburgerMenu
          className={classes.hamburgerMenu}
          onClick={handleMobileNav}
        />
      )}

      {activeMobileNav && isLoggedIn && (
        <div>
          <nav className={classes.mobileNav}>
            <ul className={classes.mobileNavItems}>
              <li>
                <Link to="/" className={classes.mobileNavLink}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/profile" className={classes.mobileNavLink}>
                  Profile
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className={classes.mobileNavLink}
                  onClick={handleLogout}
                >
                  Logout
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      )}
      {activeMobileNav && !isLoggedIn && (
        <div>
          <nav className={classes.mobileNav}>
            <ul className={classes.mobileNavItems}>
              <li>
                <Link to="/login" className={classes.mobileNavLink}>
                  Login
                </Link>
              </li>
              <li>
                <Link to="/sign-up" className={classes.mobileNavLink}>
                  Sign Up
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      )}
      {message && <AlertMessage>{message}</AlertMessage>}
    </header>
  );
};

export default NavBar;
