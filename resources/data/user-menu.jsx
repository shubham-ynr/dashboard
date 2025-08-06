const userMenu = [
    {
        name: "User Dashboard",
        icon: "Home",
        route: "dashboard",
        sort: 1,
    },
    {
        name: "Users",
        icon: "Users",
        href: "/dashboard/users",
        sort: 2,
    },
    {
        name: "Users",
        icon: "Users",
        href: "/dashboard/users",
        sort: 3,
        children: [
            {
                name: "Users",
                icon: "Users",
                href: "/dashboard/users",
                sort: 3.1,
            },
            {
                name: "Users",
                icon: "Users",
                href: "/dashboard/users",
                sort: 3.2,
            },
            {
                name: "Users",
                icon: "Users",
                href: "/dashboard/users",
                sort: 3.3,
            },
        ],
    },
    {
        name: "Users",
        icon: "Users",
        href: "/dashboard/users",
        sort: 4,
        children: [
            {
                name: "Users",
                icon: "Users",
                href: "/dashboard/users",
                sort: 4.1,
            },
            {
                name: "Users",
                icon: "Users",
                href: "/dashboard/users",
                sort: 4.2,
            },
            {
                name: "Users",
                icon: "Users",
                href: "/dashboard/users",
                sort: 4.3,
            },
        ],
    },
    {
        name: "Users",
        icon: "Users",
        href: "/dashboard/users",
        sort: 5,
        children: [
            {
                name: "Users",
                icon: "Users",
                href: "/dashboard/users",
                sort: 5.1,
            },
            {
                name: "Users",
                icon: "Users",
                href: "/dashboard/users",
                sort: 5.2,
            },
        ],
    },
];

export default userMenu;