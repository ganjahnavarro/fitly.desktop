import React from 'react'
import { Link } from 'react-router'
import Select from 'react-select';

import { DASHBOARD_ITEMS } from '../core/Constants'

class Header extends React.Component {

		getPageTitle() {
				const { pathname } = this.props.location;
				const item = DASHBOARD_ITEMS.find(item => item.to === pathname);

				if (item) {
						return <h3 className="ui header">
								<img src={"resources/images/" + item.icon + ".png"} className="ui circular image" />
								{item.label}
						</h3>;
				}
				return undefined;
		}

		render() {
				return <div className="header-component">
						<div className="ui secondary menu">
								{this.getPageTitle()}

								<div className="right menu">
										<Link to="/" className="ui item">
												Logout
										</Link>
								</div>
						</div>
        </div>
		}

}

export default Header;
