import axios from "axios";
import { toast } from "sonner";

export function useLogout() {
    const logout = () => {
        axios.post(route("logout"))
            .then(() => {
                localStorage.clear();
                toast.success("You have been logged out successfully. Please wait while we redirect you to the login page.");
                setTimeout(() => {
                    window.location.href = route("login");
                }, 2000);
            })
            .catch((error) => {
                toast.error("Something went wrong. We are unable to log you out. Please try again.");
            });
    };

    return { logout };
}