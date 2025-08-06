import { AppSidebar } from "@/components/app-sidebar";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
    useSidebar,
} from "@/components/ui/sidebar";
import { UserDropdown } from "@/components/UserDropdown";
import React from "react";
import { ModeToggle } from "./theme-toggle";
import { Head } from "@inertiajs/react";
import LogoIcon from "./LogoIcon";

export default function Layout({ children, breadcrumb = [], heading = { title: "Users Dashboard" } }) {
    const breadcrumbItems = breadcrumb.map((item, index) => {
        const isLast = index === breadcrumb.length - 1;
        const shouldHide = item.hidden === true;

        const resolveIcon = (iconName) => {
            const Icon = Icons[iconName];
            return Icon ? <Icon className="w-4 h-4 mr-2" /> : null;
        };

        return (
            <React.Fragment key={index}>
                <BreadcrumbItem className={shouldHide ? "hidden md:inline-flex" : ""}>
                    {isLast ? (
                        <BreadcrumbPage>{item.label}</BreadcrumbPage>
                    ) : (
                        <BreadcrumbLink href={item.href}>
                            {item.label}
                        </BreadcrumbLink>
                    )}
                </BreadcrumbItem>
                {!isLast && <BreadcrumbSeparator className={shouldHide ? "hidden md:inline-flex" : ""} />}
            </React.Fragment>
        );
    });

    function LayoutHeader() {
        const { isMobile } = useSidebar();
        return (
            <header className={`flex h-12 items-center gap-2 transition-all ease-linear backdrop-blur-sm sticky top-0 z-10 border-b w-full`}>
                <div className="flex items-center gap-2 px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator
                        orientation="vertical"
                        className="mr-0 min-h-6"
                    />
                    {isMobile && (
                        <>
                            <LogoIcon className="w-8 h-8" />
                            <Separator
                                orientation="vertical"
                                className="mr-0 min-h-6 xs:block hidden"
                            />
                        </>
                    )}
                    <span className="xs:block hidden">
                    <Breadcrumb>
                        <BreadcrumbList>{breadcrumbItems}</BreadcrumbList>
                    </Breadcrumb>
                    </span>
                </div>
                <div className="mr-4 flex items-center gap-2 ml-auto">
                    <ModeToggle type="icon" />
                    <Separator
                        orientation="vertical"
                        className="mr-0 min-h-6"
                    />
                    
                    <UserDropdown />
                </div>
            </header>
        );
    }

    return (
        <SidebarProvider>
            <Head title={heading.title} />
            <AppSidebar />
            <SidebarInset>
                <div className="flex flex-col w-full">
                    <LayoutHeader />
                    <main className="p-6 overflow-auto w-full">
                        {children}
                    </main>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
