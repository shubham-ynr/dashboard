import Logo from "@/components/LogoIcon";
import LogoIcon from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useForm } from "@inertiajs/react";
import { Loader, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        email: 'panelmaster.dev@gmail.com',
        password: 'Panelmaster.dev@gmail.com1',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("login"), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success("Welcome back! Please wait while we redirect you to your dashboard...");
                reset();
            },
            onError: (errors) => {
                if (errors.message) {
                    toast.error(errors.message);
                }
            }
        });
    };
    return (
        <div className="relative flex flex-col items-center justify-center h-dvh w-dvw gap-3 min-h-fit p-3">
            <LogoIcon className="h-6" />
            <div className="max-w-xl w-full border bg-sidebar">
                <div className="text-center py-3 px-4 space-y-2 border-b">
                    <h1 className="text-xl font-semibold uppercase leading-none">
                        Secure Login
                    </h1>
                    <p className="text-sm text-muted-foreground leading-none">
                        Please enter your email and password to login
                    </p>
                </div>
                <form onSubmit={submit}>
                    <div className="px-4 py-2 space-y-3 mt-2">
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
                        <div className="grid gap-2">
                            <Label htmlFor="password">Secured Password</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="********"
                                    className="rounded-xs pr-10"
                                    onChange={(e) => setData("password", e.target.value)}
                                    disabled={processing}
                                    value={data.password}
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    onClick={() => setShowPassword(!showPassword)}
                                    disabled={processing}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                            {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Checkbox id="remember" checked={data.remember} onChange={(e) => setData("remember", e.target.checked)} />
                                <Label
                                    htmlFor="remember"
                                    className="text-muted-foreground text-sm"
                                >
                                    Remember me
                                </Label>
                            </div>
                            <Link
                                href={route("reset-password")}
                                className="text-muted-foreground hover:underline underline-offset-4 text-sm"
                            >
                                Forgot password?
                            </Link>
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
            <div className="flex items-center gap-2">
                <p className="text-muted-foreground text-sm">
                    Don't have an account?
                </p>
                <Link
                    href="/auth/register"
                    className="text-muted-foreground hover:underline underline-offset-4 text-sm"
                >
                    Register
                </Link>
            </div>
        </div>
    );
}
