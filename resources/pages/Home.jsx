import { Head, Link } from "@inertiajs/react";
import { buttonVariants } from "@/components/ui/button"


export default function Home() {
    return (
        <div className="h-dvh w-dvw flex items-center justify-center">
            <Head title="Home" />
            <div className="w-full flex flex-row items-center justify-center gap-2 max-w-sm flex-wrap">
                <a className={`${buttonVariants({ variant: "outline", size: "lg" })} rounded-xs`}  href="/auth/register">
                    Register
                </a>
                <a className={`${buttonVariants({ variant: "outline", size: "lg" })} rounded-xs`}  href="/auth/register">
                    Login
                </a>
                <a className={`${buttonVariants({ variant: "outline", size: "lg" })} rounded-xs`}  href="/auth/register">
                    Admin Dashboard
                </a>
                <a className={`${buttonVariants({ variant: "outline", size: "lg" })} rounded-xs`}  href="/auth/register">
                    User Dashboard
                </a>
            </div>
        </div>
    );
}