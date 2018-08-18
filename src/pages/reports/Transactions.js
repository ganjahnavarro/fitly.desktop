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
				this.state = { subType: "purchaseOrder" };
		}

		componentDidMount() {
				Provider.loadCustomers((customers) => this.setState({customers}));
				Provider.loadSuppliers((suppliers) => this.setState({suppliers}));
		}

		onCustomerChange(selected) {
				const customer = { id: selected.value };
				this.setState({ customer });
		}

		onSupplierChange(selected) {
				const supplier = { id: selected.value };
				this.setState({ supplier });
		}

		onPrint() {
				console.log("On print");
				const { startDate, endDate, customer, supplier, subType } = this.state;
				const requestData = [
						{ key: "subType", value: subType },
						{ key: "customerId", value: customer ? customer.id : null },
						{ key: "supplierId", value: supplier ? supplier.id : null },
						{ key: "startDate", value: startDate },
						{ key: "endDate", value: endDate },
				];
				Utils.print("transactionList", requestData);
		}

		onSubTypeChange(subType) {
				this.setState({ subType });
		}

		render() {
				const { startDate, endDate, subType,
				 		customers, customer, suppliers, supplier } = this.state;

				let customerId = customer ? customer.id : null;
				let supplierId = supplier ? supplier.id : null;

				let customerItems = [];
				if (customers) {
						customerItems = customers.map((customer) => {
								return {value: customer.id, label: customer.name};
						});
				}

				let supplierItems = [];
				if (suppliers) {
						supplierItems = suppliers.map((supplier) => {
								return {value: supplier.id, label: supplier.name};
						});
				}

				const options = [
						{ label: "Purchase Order", subType: "purchaseOrder", needsSupplier: true },
						{ label: "Sales Order", subType: "salesOrder", needsSupplier: false },
						{ label: "Supplier Payment", subType: "supplierPayment", needsSupplier: true },
						{ label: "Customer Payment", subType: "customerPayment", needsSupplier: false },
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

				const customerSelection = <Dropdown name="customer" label="Customer" value={customerId}
						options={customerItems} onChange={(value) => this.onCustomerChange(value)}
						fieldClassName="sixteen" />;

				const supplierSelection = <Dropdown name="supplier" label="Supplier" value={supplierId}
						options={supplierItems} onChange={(value) => this.onSupplierChange(value)}
						fieldClassName="sixteen" />;

				return (<div>
						<Header />

						<div className="ui form report-panel">
								<h1 className="ui header">Transaction List</h1>
								<br />

								<div className="fields">
										{options.map((item) => renderItem(item))}
								</div>
								<br />

								<div className="fields">
										<Input name="startDate" placeholder="MM/dd/yyyy"
												label="Start Date" value={startDate} onChange={super.onChange.bind(this)} fieldClassName="eight" />

										<Input name="endDate" placeholder="MM/dd/yyyy"
												label="End Date" value={endDate} onChange={super.onChange.bind(this)} fieldClassName="eight" />
								</div>

								<div className="fields">
										{selectedOption.needsSupplier ? supplierSelection : customerSelection}
								</div>

								<br />
								<Button className="ui green button" icon="print" onClick={() => this.onPrint()}>Print</Button>
						</div>
				</div>);
		}
}

export default Transactions;
