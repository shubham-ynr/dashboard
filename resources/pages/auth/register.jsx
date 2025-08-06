import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useForm } from "@inertiajs/react";
import { Eye, EyeOff, Loader } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { useState } from "react";

const schema = z.object({
    first_name: z.string().min(1, { message: "First name is required" }),
    last_name: z.string().nullable(),
    email: z.string().email().min(4, { message: "Please enter a valid email" }),
    password: z
        .string()
        .min(1, { message: "Password is required" })
        .min(8, { message: "Password must be at least 8 characters long" })
        .regex(/[A-Z]/, {
            message: "Password must contain at least one uppercase letter",
        })
        .regex(/[a-z]/, {
            message: "Password must contain at least one lowercase letter",
        })
        .regex(/[0-9]/, {
            message: "Password must contain at least one number",
        })
        .regex(/[!@#$%^&*]/, {
            message: "Password must contain at least one special character",
        }),
    password_confirmation: z
        .string()
        .refine((data) => data.password === data.password_confirmation, {
            message: "Repeat password need to be same as password",
        }),
});

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        first_name: "Shubham",
        last_name: "Upadhyay",
        email: "panelmaster.in@gmail.com",
        password: "Panelmaster.in@gmail.com1",
        password_confirmation: "Panelmaster.in@gmail.com1",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("register"), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success(
                    "Registration successful! Please check your email for verification."
                );
                reset();
            },
        });
    };
    return (
        <div className="relative flex flex-col items-center justify-center h-dvh w-dvw gap-3 min-h-fit p-3">
            <Logo className="h-6" />
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
                        <div className="grid sm:grid-cols-2 grid-cols-1 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="first_name">First Name</Label>
                                <Input
                                    id="first_name"
                                    type="text"
                                    placeholder="John"
                                    className="rounded-xs"
                                    autoComplete="given-name"
                                    autoFocus
                                    onChange={(e) =>
                                        setData("first_name", e.target.value)
                                    }
                                    value={data.first_name}
                                    disabled={processing}
                                />
                                {errors.first_name && (
                                    <p className="text-red-500 text-xs">
                                        {errors.first_name}
                                    </p>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="last_name">Last Name</Label>
                                <Input
                                    id="last_name"
                                    type="text"
                                    placeholder="Doe"
                                    className="rounded-xs"
                                    autoComplete="nick-name"
                                    onChange={(e) =>
                                        setData("last_name", e.target.value)
                                    }
                                    value={data.last_name}
                                    disabled={processing}
                                />
                                {errors.last_name && (
                                    <p className="text-red-500 text-xs">
                                        {errors.last_name}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Registered Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="John@example.com"
                                className="rounded-xs"
                                autoComplete="email"
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                                value={data.email}
                                disabled={processing}
                            />
                            {errors.email && (
                                <p className="text-red-500 text-xs">
                                    {errors.email}
                                </p>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Secured Password</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="********"
                                    className="rounded-xs pr-10"
                                    onChange={(e) =>
                                        setData("password", e.target.value)
                                    }
                                    disabled={processing}
                                    value={data.password}
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    disabled={processing}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-red-500 text-xs">
                                    {errors.password}
                                </p>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password_confirmation">
                                Repeat Password
                            </Label>
                            <Input
                                id="password_confirmation"
                                type={showPassword ? "text" : "password"}
                                placeholder="********"
                                className="rounded-xs"
                                autoComplete="new-password"
                                onChange={(e) =>
                                    setData(
                                        "password_confirmation",
                                        e.target.value
                                    )
                                }
                                value={data.password_confirmation}
                                disabled={processing}
                            />
                            {errors.password_confirmation && (
                                <p className="text-red-500 text-xs">
                                    {errors.password_confirmation}
                                </p>
                            )}
                        </div>
                    </div>
                    {errors.message && (
                        <p className="text-red-500 text-xs text-center">
                            {errors.message}
                        </p>
                    )}
                    <div className="border-t p-4">
                        <Button
                            type="submit"
                            className="w-full h-10 rounded-xs uppercase"
                            disabled={processing}
                        >
                            {processing && (
                                <Loader className="w-4 h-4 animate-spin" />
                            )}
                            {processing ? "Submitting..." : "Submit Request"}
                        </Button>
                    </div>
                </form>
            </div>
            <div className="flex items-center gap-2">
                <p className="text-muted-foreground text-sm">
                    Already have an account?
                </p>
                <Link
                    href="/auth/login"
                    className="text-muted-foreground hover:underline underline-offset-4 text-sm"
                >
                    Login
                </Link>
            </div>
        </div>
    );
}
