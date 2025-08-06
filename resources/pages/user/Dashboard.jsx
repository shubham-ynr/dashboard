import UserLayout from "../../components/Layout";

export default function Dashboard() {
    return (
        <UserLayout
        breadcrumb={[
            { label: "Dashboard", href: "/dashboard" },
        ]}
        >
            <div className="h-[200dvh]">
                <h1>This is a dashboard</h1>
            </div>
        </UserLayout>
    );
}
