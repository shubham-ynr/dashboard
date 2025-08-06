import { Separator } from "@/components/ui/separator";

export default function NotFound() {
    return (
        <div className="flex items-center justify-center h-screen text-xl gap-4">
            404
            <Separator
                orientation="vertical"
                className="mr-0 max-h-6 bg-foreground"
            />
            Not Found
        </div>
    )
}