import React from 'react'
import { Link } from 'react-router'

import View from './abstract/View'
import ListView from './abstract/ListView'
import DetailView from './abstract/DetailView'

import Input from '../components/Input'
import Audit from '../components/Audit'
import Header from '../components/Header'
import Textarea from '../components/Textarea'


class Categories extends ListView {

		constructor(props) {
		    super(props);
        this.endpoint = "category/";
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
										<Category value={selectedItem} onFetch={this.onFetch}/>
								</div>
						</div>
		    </div>;
		}
}

class Category extends DetailView {

		constructor(props) {
		    super(props);
        this.endpoint = "category/";
    }

		render() {
				return <div>
						<div className="ui form">
								<Input ref={(input) => {this.initialInput = input}} autoFocus="true" label="Name"
										name="name" value={this.state.value.name} disabled={!this.state.updateMode}
										onChange={super.onChange.bind(this)} />

								<Textarea name="description" label="Description" value={this.state.value.description} disabled={!this.state.updateMode}
										onChange={super.onChange.bind(this)} />
						</div>

						<div>
								<Audit value={this.state.value} />
								{super.getActions()}
						</div>
		    </div>
		}
}

export default Categories;
