import { usePage } from "@inertiajs/react";
import {
    IconBooks,
    IconBox,
    IconCategory,
    IconChartArrowsVertical,
    IconChartBar,
    IconChartBarPopular,
    IconChartInfographic,
    IconCirclePlus,
    IconClockHour6,
    IconClipboardCheck,
    IconCreditCard,
    IconCrown,
    IconFileCertificate,
    IconFileDescription,
    IconFolder,
    IconGift,
    IconLayout2,
    IconBuilding,
    IconSchool,
    IconShoppingCart,
    IconTable,
    IconStethoscope,
    IconUserBolt,
    IconUserShield,
    IconUserSquare,
    IconUsers,
    IconUsersPlus,
    IconFileInvoice,
    IconBuildingWarehouse,
    IconCurrencyDollar,
    IconWallet,
    IconFileSearch,
    IconTruckDelivery,
    IconTruckReturn,
    IconSpeakerphone,
} from "@tabler/icons-react";
import useHasAnyPermission from "./Permission";
import React from "react";

export default function useMenu() {
    // define use page
    const { url } = usePage();

    const canDashboard = useHasAnyPermission(["dashboard-access"]);
    const canPermissions = useHasAnyPermission(["permissions-access"]);
    const canRoles = useHasAnyPermission(["roles-access"]);
    const canRolesCreate = useHasAnyPermission(["roles-create"]);
    const canUsers = useHasAnyPermission(["users-access"]);
    const canUsersCreate = useHasAnyPermission(["users-create"]);
    const canUnits = useHasAnyPermission(["units-access"]);

    // define menu navigations
    const menuNavigation = [
        {
            title: "Overview",
            details: [
                {
                    title: "Dashboard",
                    href: route("dashboard"),
                    active: url === "/dashboard" ? true : false,
                    icon: <IconLayout2 size={20} strokeWidth={1.5} />,
                    permissions: canDashboard,
                },
            ],
        },
        {
            title: "User Management",
            details: [
                {
                    title: "Pengguna",
                    icon: <IconUsers size={20} strokeWidth={1.5} />,
                    permissions: canUsers,
                    subdetails: [
                        {
                            title: "Data Pengguna",
                            href: route("users.index"),
                            icon: <IconTable size={20} strokeWidth={1.5} />,
                            active: url === "/dashboard/users" ? true : false,
                            permissions: canUsers,
                        },
                        {
                            title: "Tambah Data Pengguna",
                            href: route("users.create"),
                            icon: (
                                <IconCirclePlus size={20} strokeWidth={1.5} />
                            ),
                            active:
                                url === "/dashboard/users/create"
                                    ? true
                                    : false,
                            permissions: canUsersCreate,
                        },
                    ],
                },
                {
                    title: "Akses Group",
                    href: route("roles.index"),
                    active: url === "/dashboard/roles" ? true : false,
                    icon: <IconUserShield size={20} strokeWidth={1.5} />,
                    permissions: canRoles,
                },
                {
                    title: "Departemen",
                    href: route("units.index"),
                    active: url === "/dashboard/units",
                    icon: <IconBuilding size={20} strokeWidth={1.5} />,
                    permissions: canUnits,
                },
            ],
        },
    ];

    return menuNavigation;
}
