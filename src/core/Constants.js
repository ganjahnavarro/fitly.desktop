export const COMPANY_NAME = "VALIANT";
export const COMPANY_DESCRIPTION = "MMA & Fitness Gym";

export const SERVER_URL = "http://localhost:8080/";
export const DEPLOYMENT_URL = SERVER_URL + "fitly/";

export const VIEWER_PATH = "web/viewer.html?file=";
export const PDFS_DIRECTORY = "pdfs/";

export const DEFAULT_DISPLAYED_ITEM_COUNT = 20;

export const DASHBOARD_ITEMS = [
    { to: "/home", label: "Home", icon: "icon_home_page" },
    { to: "/walkins", label: "Walk-Ins", icon: "icon_walk_ins" },
    { to: "/members", label: "Members", icon: "icon_members" },
    { to: "/timeentries", label: "Time Entries", icon: "icon_records" },
    { to: "/coaches", label: "Coaches", icon: "icon_coaches" },
    { to: "/programs", label: "Programs", icon: "icon_programs" },
    { to: "/packages", label: "Packages", icon: "icon_packages" },
    { to: "/users", label: "Users", icon: "icon_users", forAdminOnly: true },
    { to: "/settings", label: "Settings", icon: "icon_settings" },
    { to: "/logout", label: "Logout", icon: "icon_logout" }
];

export const MEMBER_AVAILMENT_TYPES = [
    { value: "REGULAR", label: "Regular" },
    { value: "REGULAR_WITH_COACH", label: "Regular (With Coach)" },
    { value: "UNLIMITED", label: "Unlimited for 1 Month" }
];

export const getAvailmentTypeLabel = (type) => {
    const item = MEMBER_AVAILMENT_TYPES.find(i => i.value === type);
    return item ? item.label : undefined;
};

export const GENDERS = [
    { value: "MALE", label: "Male" },
    { value: "FEMALE", label: "Female" }
];

export const PACKAGE_DURATIONS = [
    { value: "ENDLESS", label: "No duration" },
    { value: "DAYS", label: "Days" },
    { value: "WEEKS", label: "Weeks" },
    { value: "MONTHS", label: "Months" },
];

export const USER_TYPES = [
    { value: "DEFAULT", label: "Default" },
    { value: "ADMIN", label: "Admin" }
];
