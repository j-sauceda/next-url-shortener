import { Button } from "@/components/ui/button";

import useAuth from "@/hooks/useAuth";

const LogoutButton = () => {
  const { logout } = useAuth();

  return <Button onClick={logout}>Logout</Button>;
};

export default LogoutButton;
