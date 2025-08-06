import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "@inertiajs/react";
import { Loader } from "lucide-react";

export default function ResetPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        username: "AU54FCDEF4562",
        email: "panelmaster.in@gmail.com",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("reset-password"));
    };

    return (
        <div className="relative flex flex-col items-center justify-center h-dvh w-dvw gap-3">
            <Logo className="h-7" />
            <div className="max-w-xl w-full border bg-sidebar">
                <div className="text-center py-3 px-4 space-y-2 border-b">
                    <h1 className="text-xl font-semibold uppercase leading-none">
                        Secure Login
                    </h1>
                    <p className="text-sm text-muted-foreground leading-none">
                        Please enter your email and password to login
                    </p>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="px-4 py-2 space-y-3 mt-2">
                        <div className="grid gap-2">
                            <Label htmlFor="username">Username or Email</Label>
                            <Input
                                id="username"
                                type="text"
                                placeholder="CU54FCDEF4562 or John@example.com"
                                className="rounded-xs"
                                onChange={(e) => setData("username", e.target.value)}
                                disabled={processing}
                                value={data.username}
                            />
                            {errors.username && <p className="text-red-500 text-xs">{errors.username}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Registered Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="John@example.com"
                                className="rounded-xs"
                                onChange={(e) => setData("email", e.target.value)}
                                disabled={processing}
                                value={data.email}
                            />
                            {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
                        </div>
                    </div>
                    <div className="border-t p-4">
                        <Button
                            type="submit"
                            className="w-full h-10 rounded-xs uppercase"
                            disabled={processing}
                        >
                            {processing && <Loader className="w-4 h-4 animate-spin" />}
                            {processing ? "Submitting..." : "Submit Request"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}   