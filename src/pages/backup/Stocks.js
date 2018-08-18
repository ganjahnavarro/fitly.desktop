import React from 'react'
import { Link } from 'react-router'

import View from './abstract/View'
import ListView from './abstract/ListView'
import DetailView from './abstract/DetailView'

import Provider from '../core/Provider'

import Input from '../components/Input'
import Audit from '../components/Audit'
import Header from '../components/Header'
import Textarea from '../components/Textarea'
import Dropdown from '../components/Dropdown'


class Stocks extends ListView {

		constructor(props) {
		    super(props);
				this.endpoint = "stock/";
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
										<Stock value={selectedItem} onFetch={this.onFetch}/>
								</div>
						</div>
				</div>;
		}
}

class Stock extends DetailView {

		constructor(props) {
		    super(props);
				this.endpoint = "stock/";
    }

    componentDidMount() {
        // Provider.loadCategories((categories) => this.setState({categories}));
				// Provider.loadUnits((units) => this.setState({units}));
				// Provider.loadBrands((brands) => this.setState({brands}));
    }

		onUnitChange(unit) {
		    let nextState = this.state.value || {};
		    nextState.unit = {id: unit.value};
		    this.setState(nextState);
		}

		onCategoryChange(category) {
		    let nextState = this.state.value || {};
		    nextState.category = {id: category.value};
		    this.setState(nextState);
		}

		onBrandChange(brand) {
		    let nextState = this.state.value || {};
		    nextState.brand = {id: brand.value};
		    this.setState(nextState);
		}

		render() {
				let { value, units, categories, brands, updateMode } = this.state;

				let unitOptions = [];
				let categoryOptions = [];
				let brandOptions = [];

        let unitId = value && value.unit ? value.unit.id : null;
				let categoryId = value && value.category ? value.category.id : null;
				let brandId = value && value.brand ? value.brand.id : null;

				if (units) {
						unitOptions = units.map((unit, index) => {
								return {value: unit.id, label: unit.name}
						});
        }

				if (categories) {
						categoryOptions = categories.map((category, index) => {
								return {value: category.id, label: category.name}
						});
        }

				if (brands) {
						brandOptions = brands.map((brand, index) => {
								return {value: brand.id, label: brand.name}
						});
        }

				return <div>
						<div className="ui form">
								<Input ref={(input) => {this.initialInput = input}} autoFocus="true" label="Name"
										name="name" value={value.name} disabled={!updateMode}
										onChange={super.onChange.bind(this)} />

								<Textarea name="description" label="Description" value={value.description} disabled={!updateMode}
										onChange={super.onChange.bind(this)} />

								<div className="fields">
										<Input name="cost" label="Cost" value={value.cost} disabled={!updateMode}
												onChange={super.onChange.bind(this)}
												fieldClassName="six" />

										<Input name="price" label="Price" value={value.price} disabled={!updateMode}
												onChange={super.onChange.bind(this)}
												fieldClassName="six" />

										<Input name="onHand" label="Quantity on Hand" value={value.onHand} disabled={!updateMode}
												onChange={super.onChange.bind(this)}
												fieldClassName="four" />
								</div>

								<Dropdown name="category" label="Category" value={categoryId} disabled={!updateMode}
										options={categoryOptions} onChange={this.onCategoryChange.bind(this)} />

								<div className="fields">
										<Dropdown name="brand" label="Brand" value={brandId} disabled={!updateMode}
												options={brandOptions} onChange={this.onBrandChange.bind(this)}
												fieldClassName="thirteen" />

										<Dropdown name="unit" label="Unit" value={unitId} disabled={!updateMode}
												options={unitOptions} onChange={this.onUnitChange.bind(this)}
												fieldClassName="three" />
								</div>
						</div>

						<div>
								<Audit value={value} />
								{super.getActions()}
						</div>
		    </div>
		}
}

export default Stocks;
