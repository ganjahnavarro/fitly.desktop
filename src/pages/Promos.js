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


class Promos extends ListView {

		constructor(props) {
		    super(props);
        this.endpoint = "promo/";
        this.orderBy = "code";
		}

		render() {
				let items = [];
				let { selectedItem, selectedIndex } = this.state;

				if (this.state.items) {
            items = this.state.items.map((item, index) => {
								const className = selectedIndex === index ? "selected" : undefined;
								return <li key={index} onClick={this.onItemClick.bind(this, index)} className={className}>
										{item.code}
								</li>;
						});
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
										<Promo value={selectedItem} onFetch={this.onFetch}/>
								</div>
				    </div>
				</div>;
		}
}

class Promo extends DetailView {

		constructor(props) {
		    super(props);
        this.endpoint = "promo/";
    }

		render() {
				let { value, updateMode } = this.state;

		    return <div>
						<div className="ui form">
                <div className="fields">
                    <Input ref={(input) => {this.initialInput = input}} autoFocus="true" label="Code"
                        name="code" value={value.code} disabled={!updateMode}
                        onChange={super.onChange.bind(this)}
                        fieldClassName="eight" />

										<Input name="discountAmount" label="Discount Amount"
												value={value.discountAmount} disabled={!updateMode} onChange={super.onChange.bind(this)}
												fieldClassName="eight" />
								</div>

								<Textarea name="description" label="Description" value={value.description} disabled={!updateMode}
										onChange={super.onChange.bind(this)} />
						</div>

						<div>
								<Audit value={value} />
								{super.getAdminOnlyActions()}
						</div>
		    </div>
		}
}

export default Promos;
