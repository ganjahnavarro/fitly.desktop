import React from 'react'
import { Link } from 'react-router'

class Navigation extends React.Component {

    createLink(item) {
        const { to, label, icon } = item;
        return  <Link key={label.toLowerCase()} to={to} className="item">
            <img className="ui avatar image" src={"resources/images/" + icon + ".png"} />
            <div className="content">
                <div className="header">{label}</div>
                <div className="description">-</div>
            </div>
        </Link>;
    }

    render() {
        const items = [
            { to: "/trainers", label: "Trainers", icon: "icon_trainers" },
            { to: "/members", label: "Members", icon: "icon_members" },
            { to: "/programs", label: "Programs", icon: "icon_programs" },
            { to: "/packages", label: "Packages", icon: "icon_packages" },
            { to: "/training-sessions", label: "Training Sessions", icon: "icon_training_sessions" },
            { to: "/users", label: "Users", icon: "icon_users" },
            { to: "/settings", label: "Settings", icon: "icon_settings" },
        ];

        return <div className="navigation">
            <div className="ui aligned animated selection list">
                {items.map((item) => this.createLink(item))}
            </div>
        </div>;
    }

}

export default Navigation;
