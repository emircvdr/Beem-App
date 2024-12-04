"use client"


interface RegisterLayoutProps {
    children: React.ReactNode;
};

const RegisterLayout = ({ children }: RegisterLayoutProps) => {

    return (
        <div className="w-full h-screen">
            {children}
        </div>
    );
}
export default RegisterLayout;