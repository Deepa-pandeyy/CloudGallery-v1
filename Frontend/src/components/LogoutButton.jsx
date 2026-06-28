import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const LogoutButton = ({ className, children = "Logout" }) => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();

    navigate("/auth", {
      replace: true,
      state: {
        clearForm: true,
      },
    });
  };

  return (
    <button
      type="button"
      className={className}
      onClick={handleLogout}
    >
      {children}
    </button>
  );
};

export default LogoutButton;