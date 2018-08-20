export const SERVER_URL = "http://localhost:8080/";
export const DEPLOYMENT_URL = SERVER_URL + "fitly/";

export const VIEWER_PATH = "web/viewer.html?file=";
export const PDFS_DIRECTORY = "pdfs/";

export const DEFAULT_DISPLAYED_ITEM_COUNT = 10;

export const DASHBOARD_ITEMS = [
    { to: "/trainers", label: "Trainers", icon: "icon_trainers" },
    { to: "/members", label: "Members", icon: "icon_members" },
    { to: "/programs", label: "Programs", icon: "icon_programs" },
    { to: "/packages", label: "Packages", icon: "icon_packages" },
    { to: "/training-sessions", label: "Training Sessions", icon: "icon_training_sessions" },
    { to: "/users", label: "Users", icon: "icon_users" },
    { to: "/settings", label: "Settings", icon: "icon_settings" },
];
