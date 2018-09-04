import React from 'react'
import { Link } from 'react-router'

import Auth from '../core/Auth'
import { DASHBOARD_ITEMS } from '../core/Constants'

class Navigation extends React.Component {

    createLink(item) {
        const { to, label, icon, forAdminOnly } = item;
        const linkComponent = <Link key={label.toLowerCase()} to={to} className="item">
            <h5 className="ui icon header">
								<img src={"resources/images/" + icon + ".png"} className="ui image" /> <br />
								{label}
						</h5>
        </Link>;

        return !forAdminOnly || Auth.isAdmin() ? linkComponent : null;
    }

    render() {
        const { pathname } = this.props.location;
        const hideNavigation = ["/", "/logout"].includes(pathname);
        const navigationComponent = <div className="navigation">
            <div className="ui aligned animated selection list">
                {DASHBOARD_ITEMS.map((item) => this.createLink(item))}
            </div>
        </div>;
        return hideNavigation ? null : navigationComponent;
    }

}

export default Navigation;
