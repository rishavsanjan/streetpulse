import SiteHeader from "../../../components/header";
import RegistrationForm from "../../../components/registerationForm";

export default function RegisterPage() {
    return (
        <>
            {/* Subtle Background Elements */}
            <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary-container/10 blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] rounded-full bg-secondary-container/20 blur-[100px]" />
            </div>

            <SiteHeader />
            <RegistrationForm />
        </>
    );
}