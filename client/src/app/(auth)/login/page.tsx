/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaArrowDown, FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation";

const Login = () => {
    const router = useRouter();
    const [form, setForm] = useState({
        email: "",
        password: ""
    });
    const [error, setError] = useState("");
    const [deneme, setDeneme] = useState([]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };



    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8000/api/login', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify(form),
            });

            const data = await response.json();

            if (response.ok) {
                console.log("Login successful:", data.message);
                router.push('/');
            } else {
                console.error("Login failed:", data.message);
            }
        } catch (error) { // Hata mesajını state'e ata
            console.error("Login error:", error);
        }

        // Formu sıfırla
        setForm({
            email: "",
            password: ""
        });
    };

    // useEffect(() => {
    //     if (token) {
    //         router.push('/');
    //     }
    // }, []);

    return (
        <div className="flex justify-center items-center w-full h-full px-4">
            <Card className="w-full max-w-[450px] h-auto py-5">
                <CardHeader>
                    <CardTitle className="text-center text-2xl mb-2">Welcome Back!</CardTitle>
                    <CardDescription className="text-center">
                        Please enter your credentials to access your account.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <Input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={form.email}
                            onChange={handleChange}
                        />
                        <Input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={form.password}
                            onChange={handleChange}
                        />
                        <Button size="lg" className="w-full" variant="special">Login</Button>
                    </form>
                </CardContent>
                <div className="flex justify-evenly items-center">
                    <Separator orientation="horizontal" className="w-[150px]" />
                    <FaArrowDown color="#c4c3c3d5" />
                    <Separator orientation="horizontal" className="w-[150px]" />
                </div>
                <div className="flex flex-col gap-5 items-center mt-5 w-full p-3">
                    <Button variant="secondary" className="w-full max-w-[300px]">
                        <FcGoogle size={20} />
                        &nbsp;
                        <p className="font-bold">Login with Google</p>
                    </Button>
                    <Button variant="secondary" className="w-full max-w-[300px]">
                        <FaGithub size={20} />
                        &nbsp;
                        <p className="font-bold">Login with Github</p>
                    </Button>
                    <p className="text-sm">
                        Don&apos;t have an account?{" "}
                        <Link href="/register" className="text-blue-600">Register</Link>
                    </p>
                </div>
            </Card>
        </div>
    );
};

export default Login;