import React from 'react'
import { Link } from 'react-router'

import View from './abstract/View'
import ListView from './abstract/ListView'
import DetailView from './abstract/DetailView'

import Input from '../components/Input'
import Audit from '../components/Audit'
import Header from '../components/Header'
import Textarea from '../components/Textarea'
import Checkbox from '../components/Checkbox'


class Programs extends ListView {

		constructor(props) {
		    super(props);
        this.endpoint = "program/";
		}

		render() {
				let items = [];
				let selectedItem = this.state.selectedItem;

				if (this.state.items) {
						items = this.state.items.map(this.renderItem.bind(this));
				}

		    return <div>
						<Header location={this.props.location} />
						<div className="ui grid">
								<div className="five wide column ui form">
										<Input label="Search" value={this.state.filter} name="filter"
													onChange={this.onFilter.bind(this)} placeholder="Type here to search" />

										<div className="ui divider"></div>
										<div className="files">
													<ul className="ui list">{items}</ul>
										</div>
								</div>

								<div className="eleven wide column">
										<Program value={selectedItem} onFetch={this.onFetch}/>
								</div>
				    </div>
				</div>;
		}
}

class Program extends DetailView {

		constructor(props) {
		    super(props);
        this.endpoint = "program/";
    }

		render() {
				let { value, updateMode } = this.state;

		    return <div>
						<div className="ui form">
								<Input ref={(input) => {this.initialInput = input}} autoFocus="true" label="Name"
										name="name" value={value.name} disabled={!updateMode}
										onChange={super.onChange.bind(this)} />

								<Textarea name="description" label="Description" value={value.description} disabled={!updateMode}
										onChange={super.onChange.bind(this)} />

								<div className="fields">
										<Input name="guestPrice" label="Guest Price" value={value.guestPrice} disabled={!updateMode}
												onChange={super.onChange.bind(this)}
												fieldClassName="eight" />

										<Input name="memberPrice" label="Member Price" value={value.memberPrice} disabled={!updateMode}
												onChange={super.onChange.bind(this)}
												fieldClassName="eight" />
								</div>

								<div className="fields">
										<Input name="monthlyPrice" label="Unlimited Price" value={value.monthlyPrice} disabled={!updateMode}
												onChange={super.onChange.bind(this)}
												fieldClassName="eight" />

										<Input name="coachPrice" label="Coach Price"
												value={value.coachPrice} disabled={!updateMode} onChange={super.onChange.bind(this)}
												fieldClassName="eight" />
								</div>

								<div className="fields">
										<Input name="commission" label="Commission" value={value.commission} disabled={!updateMode}
												onChange={super.onChange.bind(this)}
												fieldClassName="eight" />
								</div>
						</div>

						<div>
								<Audit value={value} />
								{super.getAdminOnlyActions()}
						</div>
		    </div>
		}
}

export default Programs;
