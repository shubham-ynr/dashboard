import HeaderCard from "@/components/header-card";
import Layout from "../../components/Layout";


export default function Dashboard() {
    return (
        <Layout
            breadcrumb={[
                { href: "/", label: "Dashboard" },
            ]}
        >
            <div className="flex items-center justify-between mb-7">
                <h1 className="text-2xl font-semibold meedori">
                    User Management
                    <p className="text-sm text-muted-foreground montserrat">Manage user accounts and permissions</p>
                </h1>
            </div>
            <HeaderCard
                cards={[
                    { title: "Active Users", value: "1,200", change: -5.2 },
                    { title: "Active Users", value: "1,200", change: -5.2 },
                    { title: "Active Users", value: "1,200", change: -5.2 },
                    { title: "Active Users", value: "1,200", change: -5.2 },
                ]}
            />
            <div className="h-[200dvh]">
                <h1>This is a dashboard</h1>
            </div>
        </Layout>
    );
}
