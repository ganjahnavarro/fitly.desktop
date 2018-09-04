import React from 'react'
import { Link } from 'react-router'

import View from './abstract/View'
import ListView from './abstract/ListView'
import DetailView from './abstract/DetailView'

import Input from '../components/Input'
import Audit from '../components/Audit'
import Header from '../components/Header'
import Textarea from '../components/Textarea'
import Dropdown from '../components/Dropdown'

import { PACKAGE_DURATIONS } from '../core/Constants'

class Packages extends ListView {

		constructor(props) {
		    super(props);
        this.endpoint = "package/";
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
										<Package value={selectedItem} onFetch={this.onFetch}/>
								</div>
				    </div>
				</div>;
		}
}

class Package extends DetailView {

		constructor(props) {
		    super(props);
        this.endpoint = "package/";
    }

		onDurationChange(duration) {
		    let nextState = this.state.value || {};
		    nextState.duration = duration.value;
		    this.setState(nextState);
		}

		render() {
				let { value, updateMode } = this.state;
				value.duration = value.duration || PACKAGE_DURATIONS[0].value;

				const durationItem = PACKAGE_DURATIONS.find(item => item.value === value.duration);
				const isEndless = value.duration === "ENDLESS";

				const durationCountComponent = <Input name="durationCount" label={`No. of ${durationItem.label.toLowerCase()} valid`}
						value={value.durationCount} disabled={!updateMode} onChange={super.onChange.bind(this)}
						fieldClassName="four" />

		    return <div>
						<div className="ui form">
								<Input ref={(input) => {this.initialInput = input}} autoFocus="true" label="Name"
										name="name" value={value.name} disabled={!updateMode}
										onChange={super.onChange.bind(this)} />

								<Textarea name="description" label="Description" value={value.description} disabled={!updateMode}
										onChange={super.onChange.bind(this)} />

								<div className="fields">
										<Dropdown name="duration" label="Unit" value={value.duration} disabled={!updateMode}
												options={PACKAGE_DURATIONS} onChange={this.onDurationChange.bind(this)}
												fieldClassName="eight" />

										{isEndless ? undefined : durationCountComponent}

										<Input name="sessionsCount" label="No. of Sessions" value={value.sessionsCount} disabled={!updateMode}
												onChange={super.onChange.bind(this)}
												fieldClassName="four" />
								</div>

								<div className="fields">
										<Input name="price" label="Price" value={value.price} disabled={!updateMode}
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

export default Packages;
