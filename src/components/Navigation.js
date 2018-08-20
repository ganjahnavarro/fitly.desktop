import React from 'react'
import { Link } from 'react-router'

import { DASHBOARD_ITEMS } from '../core/Constants'

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
        return <div className="navigation">
            <div className="ui aligned animated selection list">
                {DASHBOARD_ITEMS.map((item) => this.createLink(item))}
            </div>
        </div>;
    }

}

export default Navigation;
