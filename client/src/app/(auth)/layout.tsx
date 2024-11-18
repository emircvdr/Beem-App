"use client"

interface RegisterLayoutProps {
    children: React.ReactNode;
};

const RegisterLayout = ({ children }: RegisterLayoutProps) => {

    return (
        <div className="w-full h-screen bg-[#68b09c]">
            {children}
        </div>
    );
}
export default RegisterLayout;