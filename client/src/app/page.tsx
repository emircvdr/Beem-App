import Image from "next/image";
import noWorkplaceLogo from "../../public/noWorkPlaceLogo.svg"
import CreateWorkplaceDialog from "./workspaces/_components/CreateWorkplaceDialog";

export default function Home() {

  return (
    <div className="w-full h-screen flex items-center  bg-slate-100 flex-col">
      <Image src={noWorkplaceLogo} alt="logo" width={500} height={500} />
      <h1 className="text-black font-newCustom text-2xl mt-6">
        No Workplace Found !
      </h1>
      <p className="text-muted-foreground font-newCustom text-gray-300">
        You have not created any workplace yet. Please create a workplace to continue.
      </p>
      <CreateWorkplaceDialog />
    </div>
  );
}
