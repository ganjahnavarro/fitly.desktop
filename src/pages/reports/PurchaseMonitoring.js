import React from 'react'
import { hashHistory } from 'react-router'

import View from '../abstract/View'

import Fetch from '../../core/Fetch'
import Provider from '../../core/Provider'
import Utils from '../../core/Utils'

import Header from '../../components/Header'
import Dropdown from '../../components/Dropdown'
import Button from '../../components/Button'
import Input from '../../components/Input'

class PurchaseMonitoring extends View {

		constructor(props) {
				super(props);
				this.state = { subType: "all" };
		}

		componentDidMount() {
				Provider.loadSuppliers((suppliers) => this.setState({ suppliers }));
		}

    onSupplierChange(selected) {
				const supplier = { id: selected.value };
				this.setState({ supplier });
		}

    onStockChange(selected) {
        const stock = { id: selected.value };
        this.setState({ stock });
    }

		render() {
				const { startDate, endDate,
				 		suppliers, supplier, stocks, stock } = this.state;

        let stockId = stock ? stock.id : null;

				let supplierId = supplier ? supplier.id : null;

        let supplierItems = [];
				if (suppliers) {
						supplierItems = suppliers.map((supplier) => {
								return {value: supplier.id, label: supplier.name};
						});
				}

				return (<div>
						<Header />

						<div className="ui form report-panel">
								<h1 className="ui header">Purchase Monitoring</h1>
								<br />

                <div className="fields">
										<Input name="startDate" placeholder="MM/dd/yyyy"
												label="Start Date" value={startDate} onChange={super.onChange.bind(this)} fieldClassName="eight" />

										<Input name="endDate" placeholder="MM/dd/yyyy"
												label="End Date" value={endDate} onChange={super.onChange.bind(this)} fieldClassName="eight" />
								</div>

								<div className="fields">
                    <Dropdown name="supplier" label="Supplier" value={supplierId}
                        options={supplierItems} onChange={(value) => this.onSupplierChange(value)}
                        fieldClassName="sixteen" />
								</div>

                <div className="fields">
                    <Dropdown name="stock" label="Stock" value={stockId}
                        loadOptions={Provider.getStocks} onChange={(value) => this.onStockChange(value)}
                        fieldClassName="sixteen" />
								</div>

								<br />
								<Button className="ui green button" icon="print" onClick={() => this.onPrint()}>Print</Button>
						</div>
				</div>);
		}
}

export default PurchaseMonitoring;
