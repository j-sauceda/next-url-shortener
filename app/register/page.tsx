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

const Register = () => {
  const router = useRouter();
  const { signup } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { getIsAuthenticated, getAccessToken } = useContext(AuthContext);

  useEffect(() => {
    const accessToken = getAccessToken();
    const isAuthenticated = getIsAuthenticated();
    if (isAuthenticated === "true" && accessToken !== "") {
      router.push("/");
    }
  }, [getIsAuthenticated, getAccessToken, router]);

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    signup({ email, password })
      .then(() => router.push("/"))
      .catch((error) => {
        toast({
          title: "Registration error",
          description: error,
        });
      });
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <Card className="w-[380px]">
        <CardHeader>
          <CardTitle>Register</CardTitle>
          <CardDescription>
            Create your account and use the Dashboard
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleRegister}>
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
                <input type="submit" value="Signup" />
              </Button>
            </div>
          </form>
        </CardContent>

        <CardFooter className="flex justify-between">
          Already have an account?{" "}
          <Button
            variant="secondary"
            onClick={() => {
              router.push("/login");
            }}
          >
            Login
          </Button>
        </CardFooter>
      </Card>
      <Toaster />
    </div>
  );
};

export default Register;
