"use client"

interface RegisterLayoutProps {
    children: React.ReactNode;
};

const RegisterLayout = ({ children }: RegisterLayoutProps) => {

    return (
        <div className="w-full h-screen bg-[#4e517a]">
            {children}
        </div>
    );
}
export default RegisterLayout;