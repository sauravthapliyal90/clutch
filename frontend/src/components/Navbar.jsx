import { useState } from "react";
import {
  SteeringWheelIcon,
  ListIcon,
  XIcon,
} from "@phosphor-icons/react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";

function Navbar() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const links = [
    {
      to: "/",
      label: "Home",
    },
    {
      to: "/meets",
      label: "Meets",
    },
    {
      to: user ? "/garage" : "/request-otp",
      label: "My Garage",
    },
  ];

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsMenuOpen(false);
    navigate("/");
  };

  const handleJoin = () => {
    setIsMenuOpen(false);
    navigate("/request-otp");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/70 backdrop-blur-2xl">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* LOGO  */}
        <Link
          to="/"
          onClick={closeMenu}
          className="flex shrink-0 items-center"
        >
          <SteeringWheelIcon
            size={32}
            weight="fill"
            className="mr-2 text-[#E21D48]"
          />

          <span className="text-lg font-bold text-white">
            SUPER
          </span>

          <span className="text-lg font-bold text-[#E21D48]">
            MEET
          </span>
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden items-center gap-8 md:flex lg:gap-10">
          {links.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className="cursor-pointer font-light text-white transition-colors duration-200 hover:text-[#E21D48]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* DESKTOP AUTH  */}
        <div className="hidden items-center md:flex">
          {user ? (
            <div className="flex items-center gap-3 lg:gap-4">
              <p className="px-2 py-2 text-xs uppercase text-white lg:px-3">
                {user.name} - {user.role}
              </p>

              <button
                type="button"
                onClick={handleLogout}
                className="cursor-pointer border border-white/30 px-3 py-2 text-xs uppercase text-white transition-colors duration-200 hover:border-yellow-200 hover:bg-yellow-200 hover:text-black"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleJoin}
              className="mr-1 cursor-pointer bg-[#E21D48] px-5 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-[#E21D48]/90 lg:px-6"
            >
              Join
            </button>
          )}
        </div>

        {/*  MOBILE MENU BUTTON  */}
        <button
          type="button"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="flex items-center justify-center p-2 text-white transition-colors hover:text-[#E21D48] md:hidden"
          aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? (
            <XIcon size={30} weight="bold" />
          ) : (
            <ListIcon size={30} weight="bold" />
          )}
        </button>
      </div>

      {/*  MOBILE MENU */}
      <div
        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out md:hidden ${
          isMenuOpen
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="border-t border-white/10 bg-black px-4 py-2 sm:px-6">

            {/* Mobile Links */}
            <nav className="flex flex-col">
              {links.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  onClick={closeMenu}
                  className="border-b border-white/10 py-4 text-base font-light text-white transition-colors duration-200 hover:text-[#E21D48]"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Mobile Auth */}
            {user ? (
              <div className="flex flex-col gap-4 py-5">
                <p className="text-xs uppercase text-white/80">
                  {user.name} - {user.role}
                </p>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full border border-white/30 px-4 py-3 text-left text-sm uppercase text-white transition-colors duration-200 hover:border-yellow-200 hover:bg-yellow-200 hover:text-black"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleJoin}
                className="my-4 w-full bg-[#E21D48] px-6 py-3 text-center text-sm font-medium text-white transition-colors duration-200 hover:bg-[#E21D48]/90"
              >
                Join
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;