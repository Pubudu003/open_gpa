import { Link } from "react-router-dom";

import { GraduationCap, User, LogOut, LayoutDashboard } from "lucide-react";

import { Button } from "../ui/Button";

const NavBar = () => {
  return (
    <nav>
      <div className="mx-auto max-w-6xl px-6 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 py-2 transition-transform duration-300 sm:h-16 sm:flex-row">
          <Link to={"/"} className="flex items-center space-x-2">
            <div className="rounded-lg bg-gradient-to-br from-sky-500 to-violet-600 p-2">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-300">OPEN GPA</span>
          </Link>

          <div className="flex w-full items-center justify-around space-x-2 transition-transform duration-300 sm:w-auto">
            <Link to={"/signin"}>
              <Button
                variant="ghost"
                className="sm:text-md border border-gray-400/50 px-6 text-sm sm:border-none"
              >
                Sign In
              </Button>
            </Link>
            <Link to={"/signup"}>
              <Button variant="primary" className="sm:text-md text-sm">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
