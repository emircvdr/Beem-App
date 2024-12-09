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
import Image from "next/image";
import logo from "../../../../public/mainPageLogo.svg";

const Register = () => {
    const router = useRouter();


    const [form, setForm] = useState({
        fullname: "",
        email: "",
        password: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {

            const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(form)
            });

            if (!result.ok) {
                throw new Error("An error occurred while registering");
            }

            router.push("/login");

        } catch (error) {
            console.error("Register error:", error);
        }
        // Reset the form after submission
        setForm({
            fullname: "",
            email: "",
            password: ""
        });
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
                    credentials: "include",
                });
                if (response.ok) {
                    router.push('/');
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchData();

    }, [router]);

    return (
        <div className="flex flex-col justify-center items-center w-full h-full px-4">
            <div className="flex gap-2 items-center justify-center mb-2">
                <Image src={logo} width={50} height={50} alt="Logo" />
            </div>
            <Card className="w-full max-w-[450px] h-auto py-5 border-none shadow-none">
                <CardHeader>
                    <CardTitle className="text-center text-2xl font-newCustom">Join Us Today!</CardTitle>
                    <CardDescription className="text-center text-[14px] font-newCustom">
                        By signing up, you acknowledge that you have read and accepted our{" "}
                        <Link href="" className="text-blue-600">Privacy Policy</Link> and{" "}
                        <Link href="" className="text-blue-600">Terms of Service</Link>.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <Input
                            type="text"
                            name="fullname"
                            placeholder="Fullname"
                            value={form.fullname}
                            onChange={handleChange}
                        />
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
                        <Button size="lg" className="w-full" variant="default">Register</Button>
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
                        <p className="font-bold">Register with Google</p>
                    </Button>
                    <Button variant="secondary" className="w-full max-w-[300px] hover:">
                        <FaGithub size={20} />
                        &nbsp;
                        <p className="font-bold">Register with Github</p>
                    </Button>
                    <p className="text-sm font-newCustom">
                        Already have an account?{" "}
                        <Link href="/login" className="text-blue-600">Login</Link>
                    </p>
                </div>
            </Card>
        </div>
    );
};

export default Register;