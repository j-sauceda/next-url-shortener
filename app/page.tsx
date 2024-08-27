"use client";

import { useRouter } from "next/navigation";
import {
  ChangeEvent,
  FC,
  FormEvent,
  useContext,
  useEffect,
  useState,
} from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";

import useAuth from "@/hooks/useAuth";
import { AuthContext } from "@/context/AuthContext";

const Login = () => {
  const router = useRouter();
  const { login } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { getIsAuthenticated, getAccessToken } = useContext(AuthContext);

  useEffect(() => {
    const accessToken = getAccessToken();
    const isAuthenticated = getIsAuthenticated();
    if (isAuthenticated === "true" && accessToken !== "") {
      router.push("/dashboard");
    }
  }, [getIsAuthenticated, getAccessToken, router]);

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    login({ email, password })
      .then(() => router.push("/dashboard"))
      .catch((error) => {
        toast({
          title: "Authentication error",
          description: error,
        });
      });
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <Card className="w-[380px]">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>
            Use your credentials and use the Dashboard
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email:</Label>
                <Input
                  type="email"
                  id="email"
                  value={email}
                  onChange={handleEmailChange}
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password:</Label>
                <Input
                  type="password"
                  id="password"
                  value={password}
                  onChange={handlePasswordChange}
                />
              </div>

              <Button>
                <input type="submit" value="Login" />
              </Button>
            </div>
          </form>
        </CardContent>

        <CardFooter className="flex justify-between">
          Don&apos;t have an account?{" "}
          <Button
            variant="secondary"
            onClick={() => {
              router.push("/register");
            }}
          >
            Signup
          </Button>
        </CardFooter>
      </Card>
      <Toaster />
    </div>
  );
};

export default Login;
