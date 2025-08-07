import HeaderCard from "@/components/header-card";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useUsers, userUtils } from "@/hooks/use-users";
import { usePage } from "@inertiajs/react";
import {
    MoreVertical,
    Plus,
    Search,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    Edit,
    Trash2,
    UserCheck,
    UserX,
    Shield,
    ShieldOff,
    Columns,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { isVerified, isActive } from "@/hooks/use-common";
import { useState, useEffect } from "react";

export default function UserManager() {
    const { stats } = usePage().props;
    const breadcrumbs = [
        { href: "/", label: "Admin Dashboard" },
        { href: "/admin/users", label: "User Management" },
    ];
    const cards = [
        {
            title: "Total Users",
            value: stats.total_users.toLocaleString(),
            icon: "Users",
        },
        {
            title: "Active Users",
            value: stats.active_users.toLocaleString(),
            icon: "UserRoundCheck",
            iconClass: "text-green-500 border-green-700",
        },
        {
            title: "Inactive Users",
            value: stats.inactive_users.toLocaleString(),
            icon: "UserRoundMinus",
            iconClass: "text-yellow-500 border-yellow-700",
        },
        {
            title: "Banned Users",
            value: stats.banned_users.toLocaleString(),
            icon: "UserRoundX",
            iconClass: "text-red-500 border-red-700",
        },
    ];

    return (
        <Layout breadcrumb={breadcrumbs}>
            <div className="flex items-center justify-between mb-7">
                <h1 className="text-2xl font-semibold meedori">
                    User Management
                    <p className="text-sm text-muted-foreground montserrat">
                        Manage user accounts and permissions
                    </p>
                </h1>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="outline"
                            size="icon"
                            className="text-sm group hover:bg-muted"
                        >
                            <Plus
                                size={20}
                                className="transition-transform duration-300 group-hover:rotate-90"
                            />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="left">
                        <p>Add new User</p>
                    </TooltipContent>
                </Tooltip>
            </div>
            <HeaderCard cards={cards} />
            <div className="mt-4">
                <UserTableContainer />
            </div>
        </Layout>
    );
}

function UserTableContainer() {
    const [activeTab, setActiveTab] = useState("all");
    const {
        users,
        loading,
        error,
        pagination,
        filters,
        fetchUsers,
        updateUserStatus,
        verifyUser,
        deleteUser,
        updateFilters,
        clearError,
    } = useUsers();

    const [searchTerm, setSearchTerm] = useState(filters.search || "");
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(
        filters.search || ""
    );

    // Column visibility state with localStorage persistence
    const [columnVisibility, setColumnVisibility] = useState(() => {
        const saved = localStorage.getItem("userTableColumns");
        return saved
            ? JSON.parse(saved)
            : {
                  id: true,
                  uid: false,
                  username: true,
                  email: true,
                  name: true,
                  role: true,
                  status: true,
                  verified: true,
                  created: true,
                  actions: true,
              };
    });

    useEffect(() => {
        localStorage.setItem(
            "userTableColumns",
            JSON.stringify(columnVisibility)
        );
    }, [columnVisibility]);

    // Apply status filter based on active tab
    useEffect(() => {
        if (activeTab === "all") {
            updateFilters({ status: "" });
        } else {
            updateFilters({ status: activeTab });
        }
    }, [activeTab, updateFilters]);

    // Handle search with debounce
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchTerm]);

    // Update filters when debounced search term changes
    useEffect(() => {
        updateFilters({ search: debouncedSearchTerm });
    }, [debouncedSearchTerm, updateFilters]);

    const handleStatusChange = async (userId, newStatus) => {
        const result = await updateUserStatus(userId, newStatus);
        if (result.success) {
            // Status updated successfully
        }
    };

    const handleVerificationChange = async (userId, isVerified) => {
        const result = await verifyUser(userId, isVerified);
        if (result.success) {
            // Verification status updated successfully
        }
    };

    const handleDeleteUser = async (userId) => {
        if (confirm("Are you sure you want to delete this user?")) {
            const result = await deleteUser(userId);
            if (result.success) {
                // User deleted successfully
            }
        }
    };

    const handlePageChange = (page) => {
        fetchUsers({ page });
    };

    const handleSort = (sortBy) => {
        const newSortOrder =
            filters.sort_by === sortBy && filters.sort_order === "asc"
                ? "desc"
                : "asc";
        updateFilters({ sort_by: sortBy, sort_order: newSortOrder });
    };

    const handleSelectAll = (checked) => {
        if (checked) {
            setSelectedUsers(users.map((user) => user.id));
        } else {
            setSelectedUsers([]);
        }
    };

    const handleSelectUser = (userId, checked) => {
        if (checked) {
            setSelectedUsers((prev) => [...prev, userId]);
        } else {
            setSelectedUsers((prev) => prev.filter((id) => id !== userId));
        }
    };

    const toggleColumn = (columnKey) => {
        setColumnVisibility((prev) => ({
            ...prev,
            [columnKey]: !prev[columnKey],
        }));
    };

    if (loading && users.length === 0) {
        return (
            <div className="space-y-4">
                {/* Tabs Search Section Skeleton */}
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <div className="flex flex-1 items-center space-x-2 max-w-sm">
                        <div className="relative flex-1">
                            <div className="h-8 bg-muted rounded-md animate-pulse"></div>
                        </div>
                    </div>
                </div>

                {/* Table Search and Filters Skeleton */}
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <div className="flex flex-1 items-center space-x-2 max-w-sm">
                        <div className="relative flex-1">
                            <div className="h-10 bg-muted rounded-md animate-pulse"></div>
                        </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                        <div className="h-10 w-[140px] bg-muted rounded-md animate-pulse"></div>
                        <div className="h-10 w-[140px] bg-muted rounded-md animate-pulse"></div>
                        <div className="h-10 w-10 bg-muted rounded-md animate-pulse"></div>
                    </div>
                </div>

                {/* Table Skeleton */}
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                {columnVisibility.id && (
                                    <TableHead className="h-10">
                                        <div className="h-4 bg-muted rounded animate-pulse"></div>
                                    </TableHead>
                                )}
                                {columnVisibility.uid && (
                                    <TableHead className="h-10">
                                        <div className="h-4 bg-muted rounded animate-pulse"></div>
                                    </TableHead>
                                )}
                                {columnVisibility.username && (
                                    <TableHead className="h-10">
                                        <div className="h-4 bg-muted rounded animate-pulse"></div>
                                    </TableHead>
                                )}
                                {columnVisibility.email && (
                                    <TableHead className="h-10">
                                        <div className="h-4 bg-muted rounded animate-pulse"></div>
                                    </TableHead>
                                )}
                                {columnVisibility.name && (
                                    <TableHead className="h-10">
                                        <div className="h-4 bg-muted rounded animate-pulse"></div>
                                    </TableHead>
                                )}
                                {columnVisibility.role && (
                                    <TableHead className="h-10">
                                        <div className="h-4 bg-muted rounded animate-pulse"></div>
                                    </TableHead>
                                )}
                                {columnVisibility.status && (
                                    <TableHead className="h-10">
                                        <div className="h-4 bg-muted rounded animate-pulse"></div>
                                    </TableHead>
                                )}
                                {columnVisibility.verified && (
                                    <TableHead className="h-10">
                                        <div className="h-4 bg-muted rounded animate-pulse"></div>
                                    </TableHead>
                                )}
                                {columnVisibility.created && (
                                    <TableHead className="h-10">
                                        <div className="h-4 bg-muted rounded animate-pulse"></div>
                                    </TableHead>
                                )}
                                {columnVisibility.actions && (
                                    <TableHead className="h-10 w-12">
                                        <div className="h-4 bg-muted rounded animate-pulse"></div>
                                    </TableHead>
                                )}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {[...Array(10)].map((_, index) => (
                                <TableRow key={index} className="h-10">
                                    {columnVisibility.id && (
                                        <TableCell>
                                            <div className="h-4 bg-muted rounded animate-pulse w-6"></div>
                                        </TableCell>
                                    )}
                                    {columnVisibility.uid && (
                                        <TableCell>
                                            <div className="h-4 bg-muted rounded animate-pulse w-32"></div>
                                        </TableCell>
                                    )}
                                    {columnVisibility.username && (
                                        <TableCell>
                                            <div className="h-4 bg-muted rounded animate-pulse w-24"></div>
                                        </TableCell>
                                    )}
                                    {columnVisibility.email && (
                                        <TableCell>
                                            <div className="h-4 bg-muted rounded animate-pulse w-40"></div>
                                        </TableCell>
                                    )}
                                    {columnVisibility.name && (
                                        <TableCell>
                                            <div className="h-4 bg-muted rounded animate-pulse w-28"></div>
                                        </TableCell>
                                    )}
                                    {columnVisibility.role && (
                                        <TableCell>
                                            <div className="h-6 bg-muted rounded-full animate-pulse w-16"></div>
                                        </TableCell>
                                    )}
                                    {columnVisibility.status && (
                                        <TableCell>
                                            <div className="h-6 bg-muted rounded-full animate-pulse w-20"></div>
                                        </TableCell>
                                    )}
                                    {columnVisibility.verified && (
                                        <TableCell>
                                            <div className="h-6 bg-muted rounded-full animate-pulse w-24"></div>
                                        </TableCell>
                                    )}
                                    {columnVisibility.created && (
                                        <TableCell>
                                            <div className="h-4 bg-muted rounded animate-pulse w-32"></div>
                                        </TableCell>
                                    )}
                                    {columnVisibility.actions && (
                                        <TableCell className="w-12">
                                            <div className="h-8 w-8 bg-muted rounded animate-pulse"></div>
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination Skeleton */}
                <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                        <div className="h-4 bg-muted rounded animate-pulse w-48"></div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                        <div className="h-8 w-8 bg-muted rounded animate-pulse"></div>
                        <div className="h-8 w-8 bg-muted rounded animate-pulse"></div>
                        <div className="h-4 bg-muted rounded animate-pulse w-20"></div>
                        <div className="h-8 w-8 bg-muted rounded animate-pulse"></div>
                        <div className="h-8 w-8 bg-muted rounded animate-pulse"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <p className="text-red-500 mb-4">{error}</p>
                    <Button onClick={clearError} variant="outline">
                        Try Again
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
                <TabsTrigger value="all">All Users</TabsTrigger>
                <TabsTrigger value="active">Active Users</TabsTrigger>
                <TabsTrigger value="inactive">Inactive Users</TabsTrigger>
                <TabsTrigger value="banned">Banned Users</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
                <UserTableContent
                    users={users}
                    loading={loading}
                    error={error}
                    pagination={pagination}
                    filters={filters}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    selectedUsers={selectedUsers}
                    setSelectedUsers={setSelectedUsers}
                    handleStatusChange={handleStatusChange}
                    handleVerificationChange={handleVerificationChange}
                    handleDeleteUser={handleDeleteUser}
                    handlePageChange={handlePageChange}
                    handleSort={handleSort}
                    handleSelectAll={handleSelectAll}
                    handleSelectUser={handleSelectUser}
                    updateFilters={updateFilters}
                    columnVisibility={columnVisibility}
                    toggleColumn={toggleColumn}
                />
            </TabsContent>
            <TabsContent value="active">
                <UserTableContent
                    users={users}
                    loading={loading}
                    error={error}
                    pagination={pagination}
                    filters={filters}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    selectedUsers={selectedUsers}
                    setSelectedUsers={setSelectedUsers}
                    handleStatusChange={handleStatusChange}
                    handleVerificationChange={handleVerificationChange}
                    handleDeleteUser={handleDeleteUser}
                    handlePageChange={handlePageChange}
                    handleSort={handleSort}
                    handleSelectAll={handleSelectAll}
                    handleSelectUser={handleSelectUser}
                    updateFilters={updateFilters}
                    columnVisibility={columnVisibility}
                    toggleColumn={toggleColumn}
                />
            </TabsContent>
            <TabsContent value="inactive">
                <UserTableContent
                    users={users}
                    loading={loading}
                    error={error}
                    pagination={pagination}
                    filters={filters}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    selectedUsers={selectedUsers}
                    setSelectedUsers={setSelectedUsers}
                    handleStatusChange={handleStatusChange}
                    handleVerificationChange={handleVerificationChange}
                    handleDeleteUser={handleDeleteUser}
                    handlePageChange={handlePageChange}
                    handleSort={handleSort}
                    handleSelectAll={handleSelectAll}
                    handleSelectUser={handleSelectUser}
                    updateFilters={updateFilters}
                    columnVisibility={columnVisibility}
                    toggleColumn={toggleColumn}
                />
            </TabsContent>
            <TabsContent value="banned">
                <UserTableContent
                    users={users}
                    loading={loading}
                    error={error}
                    pagination={pagination}
                    filters={filters}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    selectedUsers={selectedUsers}
                    setSelectedUsers={setSelectedUsers}
                    handleStatusChange={handleStatusChange}
                    handleVerificationChange={handleVerificationChange}
                    handleDeleteUser={handleDeleteUser}
                    handlePageChange={handlePageChange}
                    handleSort={handleSort}
                    handleSelectAll={handleSelectAll}
                    handleSelectUser={handleSelectUser}
                    updateFilters={updateFilters}
                    columnVisibility={columnVisibility}
                    toggleColumn={toggleColumn}
                />
            </TabsContent>
        </Tabs>
    );
}

function UserTableContent({
    users,
    pagination,
    filters,
    searchTerm,
    setSearchTerm,
    selectedUsers,
    handleStatusChange,
    handleVerificationChange,
    handleDeleteUser,
    handlePageChange,
    handleSort,
    updateFilters,
    columnVisibility,
    toggleColumn,
}) {
    return (
        <div className="space-y-4">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex flex-1 items-center space-x-2 max-w-sm">
                    <div className="relative flex-1">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-8"
                        />
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <Select
                        value={filters.role || "all"}
                        onValueChange={(value) =>
                            updateFilters({
                                role: value === "all" ? "" : value,
                            })
                        }
                    >
                        <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Roles</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="user">User</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select
                        value={filters.verified || "all"}
                        onValueChange={(value) =>
                            updateFilters({
                                verified: value === "all" ? "" : value,
                            })
                        }
                    >
                        <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Verified" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="true">Verified</SelectItem>
                            <SelectItem value="false">Unverified</SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Column Visibility Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon">
                                <Columns size={16} />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuLabel>
                                Toggle Columns
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuCheckboxItem
                                checked={columnVisibility.id}
                                onCheckedChange={() => toggleColumn("id")}
                            >
                                ID
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem
                                checked={columnVisibility.uid}
                                onCheckedChange={() => toggleColumn("uid")}
                            >
                                UID
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem
                                checked={columnVisibility.username}
                                onCheckedChange={() => toggleColumn("username")}
                            >
                                Username
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem
                                checked={columnVisibility.email}
                                onCheckedChange={() => toggleColumn("email")}
                            >
                                Email
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem
                                checked={columnVisibility.name}
                                onCheckedChange={() => toggleColumn("name")}
                            >
                                Name
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem
                                checked={columnVisibility.role}
                                onCheckedChange={() => toggleColumn("role")}
                            >
                                Role
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem
                                checked={columnVisibility.status}
                                onCheckedChange={() => toggleColumn("status")}
                            >
                                Status
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem
                                checked={columnVisibility.verified}
                                onCheckedChange={() => toggleColumn("verified")}
                            >
                                Verified
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem
                                checked={columnVisibility.created}
                                onCheckedChange={() => toggleColumn("created")}
                            >
                                Created
                            </DropdownMenuCheckboxItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Table */}
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {columnVisibility.id && (
                                <TableHead
                                    className="cursor-pointer hover:bg-muted/50"
                                    onClick={() => handleSort("id")}
                                >
                                    ID
                                    {filters.sort_by === "id" && (
                                        <span className="ml-1">
                                            {filters.sort_order === "asc"
                                                ? "↑"
                                                : "↓"}
                                        </span>
                                    )}
                                </TableHead>
                            )}
                            {columnVisibility.uid && <TableHead>UID</TableHead>}
                            {columnVisibility.username && (
                                <TableHead
                                    className="cursor-pointer hover:bg-muted/50"
                                    onClick={() => handleSort("username")}
                                >
                                    Username
                                    {filters.sort_by === "username" && (
                                        <span className="ml-1">
                                            {filters.sort_order === "asc"
                                                ? "↑"
                                                : "↓"}
                                        </span>
                                    )}
                                </TableHead>
                            )}
                            {columnVisibility.email && (
                                <TableHead
                                    className="cursor-pointer hover:bg-muted/50"
                                    onClick={() => handleSort("email")}
                                >
                                    Email
                                    {filters.sort_by === "email" && (
                                        <span className="ml-1">
                                            {filters.sort_order === "asc"
                                                ? "↑"
                                                : "↓"}
                                        </span>
                                    )}
                                </TableHead>
                            )}
                            {columnVisibility.name && (
                                <TableHead>Name</TableHead>
                            )}
                            {columnVisibility.role && (
                                <TableHead>Role</TableHead>
                            )}
                            {columnVisibility.status && (
                                <TableHead>Status</TableHead>
                            )}
                            {columnVisibility.verified && (
                                <TableHead>Verified</TableHead>
                            )}
                            {columnVisibility.created && (
                                <TableHead>Created</TableHead>
                            )}
                            {columnVisibility.actions && (
                                <TableHead className="w-12">Actions</TableHead>
                            )}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={
                                        Object.values(columnVisibility).filter(
                                            Boolean
                                        ).length
                                    }
                                    className="text-center py-8"
                                >
                                    <p className="text-muted-foreground">
                                        No users found
                                    </p>
                                </TableCell>
                            </TableRow>
                        ) : (
                            users.map((user, index) => (
                                <TableRow key={user.id}>
                                    {columnVisibility.id && (
                                        <TableCell className="font-mono text-sm">
                                            {user.id}
                                        </TableCell>
                                    )}
                                    {columnVisibility.uid && (
                                        <TableCell className="font-mono text-sm">
                                            {user.uid}
                                        </TableCell>
                                    )}
                                    {columnVisibility.username && (
                                        <TableCell className="font-mono text-sm">
                                            {user.username}
                                        </TableCell>
                                    )}
                                    {columnVisibility.email && (
                                        <TableCell>{user.email}</TableCell>
                                    )}
                                    {columnVisibility.name && (
                                        <TableCell>
                                            {userUtils.formatUserName(user)}
                                        </TableCell>
                                    )}
                                    {columnVisibility.role && (
                                        <TableCell>
                                            <Badge
                                                className={userUtils.getRoleColor(
                                                    user.role
                                                )}
                                            >
                                                {user.role}
                                            </Badge>
                                        </TableCell>
                                    )}
                                    {columnVisibility.status && (
                                        <TableCell>
                                            <Badge
                                                className={userUtils.getStatusColor(
                                                    user.status
                                                )}
                                            >
                                                {user.status}
                                            </Badge>
                                        </TableCell>
                                    )}
                                    {columnVisibility.verified && (
                                        <TableCell>
                                            <Badge
                                                className={userUtils.getVerificationColor(
                                                    user.isVerified
                                                )}
                                            >
                                                {userUtils.getVerificationText(
                                                    user.isVerified
                                                )}
                                            </Badge>
                                        </TableCell>
                                    )}
                                    {columnVisibility.created && (
                                        <TableCell className="text-sm text-muted-foreground">
                                            {userUtils.formatDate(
                                                user.created_at
                                            )}
                                        </TableCell>
                                    )}
                                    {columnVisibility.actions && (
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                    >
                                                        <MoreVertical
                                                            size={16}
                                                        />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>
                                                        Actions
                                                    </DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem>
                                                        <Edit
                                                            size={16}
                                                            className="mr-2"
                                                        />
                                                        Edit User
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            handleStatusChange(
                                                                user.id,
                                                                user.status ===
                                                                    "active"
                                                                    ? "inactive"
                                                                    : "active"
                                                            )
                                                        }
                                                    >
                                                        {user.status ===
                                                        "active" ? (
                                                            <>
                                                                <UserX
                                                                    size={16}
                                                                    className="mr-2"
                                                                />
                                                                Deactivate
                                                            </>
                                                        ) : (
                                                            <>
                                                                <UserCheck
                                                                    size={16}
                                                                    className="mr-2"
                                                                />
                                                                Activate
                                                            </>
                                                        )}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            handleVerificationChange(
                                                                user.id,
                                                                !user.isVerified
                                                            )
                                                        }
                                                    >
                                                        {user.isVerified ? (
                                                            <>
                                                                <ShieldOff
                                                                    size={16}
                                                                    className="mr-2"
                                                                />
                                                                Unverify
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Shield
                                                                    size={16}
                                                                    className="mr-2"
                                                                />
                                                                Verify
                                                            </>
                                                        )}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            handleDeleteUser(
                                                                user.id
                                                            )
                                                        }
                                                        className="text-red-600"
                                                    >
                                                        <Trash2
                                                            size={16}
                                                            className="mr-2"
                                                        />
                                                        Delete User
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            {pagination.total > 0 && (
                <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                        Showing {pagination.from} to {pagination.to} of{" "}
                        {pagination.total} results
                        {selectedUsers.length > 0 && (
                            <span className="ml-4">
                                ({selectedUsers.length} selected)
                            </span>
                        )}
                    </div>

                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handlePageChange(1)}
                            disabled={pagination.current_page === 1}
                        >
                            <ChevronsLeft size={16} />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                                handlePageChange(pagination.current_page - 1)
                            }
                            disabled={pagination.current_page === 1}
                        >
                            <ChevronLeft size={16} />
                        </Button>

                        <span className="text-sm">
                            Page {pagination.current_page} of{" "}
                            {pagination.last_page}
                        </span>

                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                                handlePageChange(pagination.current_page + 1)
                            }
                            disabled={
                                pagination.current_page === pagination.last_page
                            }
                        >
                            <ChevronRight size={16} />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                                handlePageChange(pagination.last_page)
                            }
                            disabled={
                                pagination.current_page === pagination.last_page
                            }
                        >
                            <ChevronsRight size={16} />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
