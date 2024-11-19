"use client"
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import noWorkplaceLogo from "../../public/noWorkPlaceLogo.svg"
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import User from "./interfaces/UserInterface";
import Workplace from "./interfaces/WorkplaceInterface";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);

  const [error, setError] = useState<any>(null);

  const [form, setForm] = useState<Workplace>({
    name: "",
    admin_id: 0,
    private: false
  });

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/user', {
          credentials: "include",
        });

        const data = await response.json();

        if (response.ok) {
          setUser(data); // User verisini güncelle
          setForm((prevForm) => ({
            ...prevForm,
            admin_id: data.id, // formu güncellerken admin_id'yi de ekle
          }));
        } else {
          router.push('/login');
        }
      } catch (error) {
        setError(error);
      }
    };

    const getWorkspaces = async (adminId: number) => { // admin_id parametre olarak al
      try {
        const response = await fetch(`http://localhost:8000/api/workplaces/${adminId}`, {
          credentials: "include",
        });

        const data = await response.json();

        if (response.ok) {
          if (data.length > 0) {
            router.push(`/workspaces`);
          }
        } else {
          router.push("/");
          setError(await response.json());
        }
      } catch (error) {
        setError(error);
      }
    };

    fetchData(); // fetchData'yı çağırıyoruz

    // `user` güncellendikten sonra `getWorkspaces` fonksiyonunu çağırıyoruz
    if (user?.id) {
      getWorkspaces(user.id); // user.id'yi doğrudan kullanıyoruz
    }

  }, [user?.id, router]); // user.id değiştiğinde effect yeniden çalışacak


  const handleCreateWorkplace = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/createWorkplace', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      if (response.ok) {
        router.push(`/workspaces/${data.id}`);
      } else {
        setError(await response.json());
      }
    } catch (error) {
      setError(error);
    }
  }

  return (
    <div className="w-full h-screen flex items-center  bg-[#8286cf] flex-col">
      <Image src={noWorkplaceLogo} alt="logo" width={500} height={500} />
      <h1 className="text-white font-bold text-2xl mt-6">
        No Workplace Found !
      </h1>
      <p className="text-white-200 text-xs">
        You have not created any workplace yet. Please create a workplace to continue.
      </p>
      <Dialog>
        <DialogTrigger asChild>
          <Button size="lg" className="mt-6" variant="homePage">Create a Workplace</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create a Workplace</DialogTitle>
            <DialogDescription>
              Create a workplace to start managing your tasks and communicate with your team.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name">
                Workplace Name
              </Label>
              <Input
                id="workplace Name"
                className="col-span-3"
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="flex flex-row justify-between items-center gap-4">
              <Label htmlFor="private">
                Private Workplace ?
              </Label>
              <Switch id="private"
                checked={form.private}
                onCheckedChange={(checked) => setForm({ ...form, private: checked })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" variant="special" onClick={handleCreateWorkplace}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
