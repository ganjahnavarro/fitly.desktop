import React from 'react'
import { Link } from 'react-router'

import View from './abstract/View'
import ListView from './abstract/ListView'
import DetailView from './abstract/DetailView'

import Input from '../components/Input'
import Audit from '../components/Audit'
import Header from '../components/Header'
import Textarea from '../components/Textarea'


class Suppliers extends ListView {

		constructor(props) {
		    super(props);
        this.endpoint = "supplier/";
		}

		render() {
				let items = [];
				let selectedItem = this.state.selectedItem;

				if (this.state.items) {
						items = this.state.items.map(this.renderItem.bind(this));
				}

		    return <div>
						<Header />
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
										<Supplier value={selectedItem} onFetch={this.onFetch}/>
								</div>
						</div>
		    </div>;
		}
}

class Supplier extends DetailView {

		constructor(props) {
		    super(props);
        this.endpoint = "supplier/";
    }

		render() {
				let { value, updateMode } = this.state;

				return <div>
						<div className="ui form">
								<Input ref={(input) => {this.initialInput = input}} autoFocus="true" label="Name"
										name="name" value={value.name} disabled={!updateMode}
										onChange={super.onChange.bind(this)} />

								<Textarea name="address" label="Address" value={value.address} disabled={!updateMode}
										onChange={super.onChange.bind(this)} />

								<div className="fields">
										<Input name="contact" label="Contact" value={value.contact} disabled={!updateMode}
												onChange={super.onChange.bind(this)} fieldClassName="eight" />

										<Input name="fax" label="Fax" value={value.fax} disabled={!updateMode}
												onChange={super.onChange.bind(this)} fieldClassName="eight" />
								</div>

								<div className="fields">
										<Input name="tin" label="TIN" value={value.tin} disabled={!updateMode}
												onChange={super.onChange.bind(this)} fieldClassName="eight" />

										<Input name="terms" label="Terms" value={value.terms} disabled={!updateMode}
												onChange={super.onChange.bind(this)} fieldClassName="eight" />
								</div>
						</div>

						<div>
								<Audit value={value} />
								{super.getActions()}
						</div>
		    </div>
		}
}

export default Suppliers;
