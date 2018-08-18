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

class StockMovement extends View {

		onStockChange(selected) {
				const stock = { id: selected.value };
				this.setState({ stock });
		}

		render() {
				const { startDate, endDate, stock } = this.state;
				let stockId = stock ? stock.id : null;

				return (<div>
						<Header />

						<div className="ui form report-panel">
								<h1 className="ui header">Stock Movement</h1>
								<br />

								<div className="fields">
										<Input name="startDate" placeholder="MM/dd/yyyy"
												label="Start Date" value={startDate} onChange={super.onChange.bind(this)} fieldClassName="eight" />

										<Input name="endDate" placeholder="MM/dd/yyyy"
												label="End Date" value={endDate} onChange={super.onChange.bind(this)} fieldClassName="eight" />
								</div>

								<div className="fields">
                    <Dropdown name="stock" label="Stock" value={stockId}
												loadOptions={Provider.getStocks} onChange={(value) => this.onStockChange(value)}
                        fieldClassName="sixteen" />;
								</div>

								<br />
								<Button className="ui green button" icon="print">Print</Button>
						</div>
				</div>);
		}
}

export default StockMovement;
