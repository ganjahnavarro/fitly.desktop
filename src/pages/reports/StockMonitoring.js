import React from 'react'
import { hashHistory } from 'react-router'

import View from '../abstract/View'

import Provider from '../../core/Provider'
import Utils from '../../core/Utils'

import Header from '../../components/Header'
import Dropdown from '../../components/Dropdown'
import Button from '../../components/Button'
import Input from '../../components/Input'

class Transactions extends View {

		constructor(props) {
				super(props);
				this.state = { subType: "all" };
		}

		componentDidMount() {
				Provider.loadCategories((categories) => this.setState({categories}));
		}

    onCategoryChange(selected) {
        const category = { id: selected.value };
				this.setState({ category });
    }

		onSubTypeChange(subType) {
				this.setState({ subType });
		}

		render() {
				const { startDate, endDate, subType,
				 		categories, category } = this.state;

				let categoryId = category ? category.id : null;

				let categoryItems = [];
				if (categories) {
						categoryItems = categories.map((category) => {
								return {value: category.id, label: category.name};
						});
				}

				const options = [
						{ label: "All", subType: "all" },
						{ label: "Zero", subType: "zero" },
						{ label: "Positive", subType: "positive" },
						{ label: "Negative", subType: "negative" },
				];

				const selectedOption = options.find(item => item.subType === subType);

				const renderItem = (item) => {
						const defaultClass = "ui basic button report-option";
						const className = item.subType === subType ? defaultClass + " green" : defaultClass;
						return (<div key={item.subType} className="four wide field">
								<Button className={className}
										onClick={() => this.onSubTypeChange(item.subType)}>
										{item.label}
								</Button>
						</div>);
				};

				return (<div>
						<Header />

						<div className="ui form report-panel">
								<h1 className="ui header">Stock Monitoring</h1>
								<br />

								<div className="fields">
										{options.map((item) => renderItem(item))}
								</div>
								<br />

								<div className="fields">
                    <Dropdown name="category" label="Category" value={categoryId}
                        options={categoryItems} onChange={(value) => this.onCategoryChange(value)}
                        fieldClassName="sixteen" />
								</div>

								<br />
								<Button className="ui green button" icon="print" onClick={() => this.onPrint()}>Print</Button>
						</div>
				</div>);
		}
}

export default Transactions;
