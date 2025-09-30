import Logo from "../logo";

const Footer = () => {
  return (
    <footer className="w-full border-t border-gray-200 bg-gray-100">
      <div className="max-w-6xl mx-auto flex flex-col items-center justify-center gap-4 px-4 py-8 md:flex-row md:justify-between">
        {/* Left Section */}
        <div className="flex flex-col items-center md:items-start gap-3">
          <Logo />
        </div>

        {/* Right Section */}
        <p className="text-sm">
          © {new Date().getFullYear()} Support Desk. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
