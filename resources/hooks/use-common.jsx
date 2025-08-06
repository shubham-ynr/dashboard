export const isVerified = (status = false) => {
    return status ? (
        <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-700 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-700"></span>
        </span>
    ) : (
        <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-700 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-700"></span>
        </span>
    );
};
export const isActive = (status = "active") => {
    const statusMap = {
        active: {
            label: "Active",
            borderColor: "border-green-700",
            textColor: "text-green-800",
            bgColor: "bg-green-100",
            pingColor: "bg-green-400",
            gradient: "from-green-200 to-green-100",
        },
        banned: {
            label: "Banned",
            borderColor: "border-red-700",
            textColor: "text-red-800",
            bgColor: "bg-red-100",
            pingColor: "bg-red-400",
            gradient: "from-red-200 to-red-100",
        },
        inactive: {
            label: "Inactive",
            borderColor: "border-yellow-700",
            textColor: "text-yellow-800",
            bgColor: "bg-yellow-100",
            pingColor: "bg-yellow-400",
            gradient: "from-yellow-200 to-yellow-100",
        },
    };

    const current = statusMap[status];
    if (!current) return null;

    return (
        <span className="relative flex items-center justify-center w-20 h-5">
            <span
                className={`absolute animate-ping rounded-sm ${current.pingColor} ${current.borderColor} border opacity-80 w-[70%] h-[90%]`}
            ></span>
            <div
                className={`relative z-10 flex items-center justify-center h-full w-full text-xs capitalize border rounded-sm px-2 py-0.5 ${current.borderColor} ${current.textColor} bg-gradient-to-br ${current.gradient} shadow-inner`}
            >
                <span className="absolute inset-0 rounded-sm bg-white/20 backdrop-blur-sm opacity-10 pointer-events-none"></span>
                {current.label}
            </div>
        </span>
    );
};