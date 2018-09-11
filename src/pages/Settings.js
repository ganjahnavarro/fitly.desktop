import React from 'react'
import { Link } from 'react-router'

import View from './abstract/View'
import ListView from './abstract/ListView'
import DetailView from './abstract/DetailView'

import Input from '../components/Input'
import Audit from '../components/Audit'
import Button from '../components/Button'
import Header from '../components/Header'


class Configs extends ListView {

		constructor(props) {
		    super(props);
        this.endpoint = "config/";
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
										<Config value={selectedItem} onFetch={this.onFetch}/>
								</div>
				    </div>
				</div>;
		}
}

class Config extends DetailView {

		constructor(props) {
		    super(props);
        this.endpoint = "config/";
    }

		render() {
				let { value, updateMode } = this.state;

        let viewingActions = <div>
            {value && value.id ? <Button className="ui blue button" icon="write" onClick={() => this.onEdit()}>Edit</Button> : null}
        </div>;

        let editingActions = <div>
            <Button className="ui green button" icon="save" onClick={() => this.onSave()}>Save</Button>
            <Button className="ui button" icon="ban" onClick={() => this.onCancel()}>Cancel</Button>
        </div>;

		    return <div>
						<div className="ui form">
								<Input label="Name" name="name" value={value.name} disabled={true} />
								<Input ref={(input) => {this.initialInput = input}} autoFocus="true" label="Value"
										name="value" value={value.value} disabled={!updateMode}
										onChange={super.onChange.bind(this)} />
						</div>

						<div>
								<Audit value={value} />
								<div className="actions">
				            {updateMode ? editingActions : viewingActions}
				        </div>
						</div>
		    </div>
		}
}

export default Configs;
