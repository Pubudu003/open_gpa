import { Link } from "react-router-dom";

import { GraduationCap, User, LogOut, LayoutDashboard } from "lucide-react";

import { Button } from "../ui/Button";

const NavBar = () => {
  const user = true;
  const userName = "Pubudu";
  const isAdmin = true;

  const handleLogout = async () => {
    console.log("logout successfully!");
  };

  return (
    <nav>
      <div className="mx-auto max-w-6xl px-6 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to={"/"} className="flex items-center space-x-2">
            <div className="rounded-lg bg-gradient-to-br from-sky-500 to-violet-600 p-2">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-300">OPEN GPA</span>
          </Link>

          <div className="flex items-center space-x-2">
            <Link to={"/signin"}>
              <Button variant="ghost" className="sm:text-md text-sm">
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
