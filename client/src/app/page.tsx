"use client"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const [data, setData] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/user', {
          credentials: "include",
        });

        const data = await response.json();

        if (response.ok) {
          setData(data);
        } else {
          console.error("Login failed:", data.message);
          router.push('/login');
        }
      } catch (error) {
        console.error("Login error:", error);

      }
    }
    fetchData();

  }, [router]);

  const handleLogout = async () => {
    await fetch('http://localhost:8000/api/logout', {
      method: 'POST',
      credentials: "include",
    });

    await router.push('/login');
  }

  return (
    <div>
      <h1>Home</h1>
      <p>Welcome {data.fullname}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
