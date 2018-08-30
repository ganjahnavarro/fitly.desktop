import React from 'react'
import { Link } from 'react-router'

import { DASHBOARD_ITEMS } from '../core/Constants'

class Navigation extends React.Component {

    createLink(item) {
        const { to, label, icon } = item;
        return  <Link key={label.toLowerCase()} to={to} className="item">
            <h5 className="ui icon header">
								<img src={"resources/images/" + icon + ".png"} className="ui image" /> <br />
								{label}
						</h5>
        </Link>;
    }

    render() {
        return <div className="navigation">
            <div className="ui aligned animated selection list">
                {DASHBOARD_ITEMS.map((item) => this.createLink(item))}
            </div>
        </div>;
    }

}

export default Navigation;
