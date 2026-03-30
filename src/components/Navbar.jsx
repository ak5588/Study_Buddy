import { Button } from './ui/Button';
import { Link } from 'react-router-dom';
import ThemeSwitcher from './ThemeSwitcher';

export function Navbar() {
  return (
    <nav className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 transition-colors duration-200">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/logo.svg" alt="Study Buddy Logo" className="w-12 h-12" />
          <div className="flex gap-8 ml-8">
            <Link
              to="/"
              className="font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Home
            </Link>

            <div className="relative group">
              <button className="font-medium flex items-center gap-1 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                Tools
                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>

            <Link
              to="/about"
              className="font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              About Us
            </Link>

            <Link
              to="/contact"
              className="font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/signin">
            <Button
              variant="outline"
              size="sm"
              className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Login
            </Button>
          </Link>

          <Link to="/signup">
            <Button
              variant="outline"
              size="sm"
              className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Sign Up
            </Button>
          </Link>

          {/* ✅ Independent theme switcher */}
          <ThemeSwitcher />
        </div>
      </div>
    </nav>
  );
}
