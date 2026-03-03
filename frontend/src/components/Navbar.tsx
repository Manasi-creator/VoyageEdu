import { Button } from "@/components/ui/button";
import { Menu, X, LogOut } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useAuthDialog } from "@/contexts/AuthDialogContext";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const { openDialog } = useAuthDialog();

  const isActive = (path: string) => location.pathname === path;
  const firstName = user?.name?.split(" ")[0] ?? "";

  const handleGetStarted = () => {
    openDialog(user ? "signin" : "signup");
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-b border-primary/20 shadow-lg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="text-2xl font-bold text-foreground">
              Voyage<span className="text-accent">Edu</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-8">
              <Link 
                to="/" 
                className={`transition-colors font-medium ${
                  isActive('/') ? 'text-primary' : 'text-foreground/80 hover:text-foreground'
                }`}
              >
                Home
              </Link>
              <Link 
                to="/map" 
                className={`transition-colors font-medium ${
                  isActive('/map') ? 'text-primary' : 'text-foreground/80 hover:text-foreground'
                }`}
              >
                Map
              </Link>
              <Link 
                to="/institutions" 
                className={`transition-colors font-medium ${
                  isActive('/institutions') ? 'text-primary' : 'text-foreground/80 hover:text-foreground'
                }`}
              >
                Institutions
              </Link>
              <Link 
                to="/comparison" 
                className={`transition-colors font-medium ${
                  isActive('/comparison') ? 'text-primary' : 'text-foreground/80 hover:text-foreground'
                }`}
              >
                AISHE Verifier
              </Link>
              <Link 
                to="/about" 
                className={`transition-colors font-medium ${
                  isActive('/about') ? 'text-primary' : 'text-foreground/80 hover:text-foreground'
                }`}
              >
                About
              </Link>
              <Link 
                to="/contact" 
                className={`transition-colors font-medium ${
                  isActive('/contact') ? 'text-primary' : 'text-foreground/80 hover:text-foreground'
                }`}
              >
                Contact
              </Link>
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-sm font-medium text-foreground/80">Hi, <span className="text-foreground font-semibold">{firstName}</span></span>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={logout}
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openDialog("signin")}
                >
                  Sign In
                </Button>
                <Button
                  size="sm"
                  className="bg-accent hover:bg-accent-light text-accent-foreground"
                  onClick={handleGetStarted}
                >
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-foreground hover:bg-primary/10 hover:text-primary"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-primary/20">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className={`block px-3 py-2 rounded-md transition-colors font-medium ${
                isActive('/') ? 'text-primary bg-primary/10' : 'text-foreground/80 hover:text-foreground hover:bg-primary/10'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/map"
              className={`block px-3 py-2 rounded-md transition-colors font-medium ${
                isActive('/map') ? 'text-primary bg-primary/10' : 'text-foreground/80 hover:text-foreground hover:bg-primary/10'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Map
            </Link>
            <Link
              to="/institutions"
              className={`block px-3 py-2 rounded-md transition-colors font-medium ${
                isActive('/institutions') ? 'text-primary bg-primary/10' : 'text-foreground/80 hover:text-foreground hover:bg-primary/10'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Institutions
            </Link>
            <Link
              to="/comparison"
              className={`block px-3 py-2 rounded-md transition-colors font-medium ${
                isActive('/comparison') ? 'text-primary bg-primary/10' : 'text-foreground/80 hover:text-foreground hover:bg-primary/10'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Compare
            </Link>
            <Link
              to="/aishe-verifier"
              className={`block px-3 py-2 rounded-md transition-colors font-medium ${
                isActive('/aishe-verifier') ? 'text-primary bg-primary/10' : 'text-foreground/80 hover:text-foreground hover:bg-primary/10'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              AISHE Verifier
            </Link>
            <Link
              to="/about"
              className={`block px-3 py-2 rounded-md transition-colors font-medium ${
                isActive('/about') ? 'text-primary bg-primary/10' : 'text-foreground/80 hover:text-foreground hover:bg-primary/10'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              to="/contact"
              className={`block px-3 py-2 rounded-md transition-colors font-medium ${
                isActive('/contact') ? 'text-primary bg-primary/10' : 'text-foreground/80 hover:text-foreground hover:bg-primary/10'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </Link>
            <div className="flex flex-col space-y-2 px-3 pt-2">
              <div className="flex flex-col space-y-2">
                {user ? (
                  <>
                    <div className="text-sm font-medium text-foreground/80">Hi, {firstName}</div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2 justify-center"
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        openDialog("signin");
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      Sign In
                    </Button>
                    <Button
                      size="sm"
                      className="bg-accent hover:bg-accent-light text-accent-foreground"
                      onClick={handleGetStarted}
                    >
                      Get Started
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;