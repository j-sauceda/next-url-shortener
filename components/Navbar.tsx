import LogoutButton from "./LogoutButton";

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between bg-gray-300 rounded-md p-4 mt-2 mb-7">
      <div className="font-bold">URL Shortener</div>
      <ul className="flex space-x-4">
        <li>
          <LogoutButton />
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
