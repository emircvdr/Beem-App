import Image from "next/image";

interface FriendsBoxProps {
    image: string;
    name: string;
}

export default function FriendsBox({ image, name }: FriendsBoxProps) {
    return (
        <div className="w-full h-[50px] rounded-sm flex gap-3 p-3 items-center  cursor-pointer">
            <div className="w-10 h-10 shadow-[#232445] shadow rounded-full flex items-center justify-center">
                {image ? (
                    <Image src={image} alt="avatar" width={50} height={50} />
                ) : (
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white  text-lg text-black">A</div> // Görsel yoksa bir placeholder göster
                )}
            </div>
            <div className="flex flex-col w-3/4">
                <div className="w-full  flex">
                    <h1 className="text-white text-[14px]">{name}</h1>
                </div>
            </div>

        </div>
    );
}
