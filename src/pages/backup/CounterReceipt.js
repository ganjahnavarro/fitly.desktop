import React from 'react'

import View from './abstract/View'

import Provider from '../core/Provider'
import Utils from '../core/Utils'

import Header from '../components/Header'
import Dropdown from '../components/Dropdown'
import Button from '../components/Button'
import Input from '../components/Input'

class CounterReceipt extends View {

    componentDidMount() {
        Provider.loadCustomers((customers) => this.setState({customers}));
    }

    onCustomerChange(selected) {
		    const customer = { id: selected.value };
		    this.setState({ customer });
		}

    onPrint() {
        console.log("On print");
        const { startDate, endDate, customer } = this.state;
        const requestData = [
            { key: "customerId", value: customer ? customer.id : null },
            { key: "startDate", value: startDate },
            { key: "endDate", value: endDate },
        ];
        Utils.print("counterReceipt", requestData);
    }

    render() {
        const { startDate, endDate, customers, customer } = this.state;

        let customerId = customer ? customer.id : null;
        let customerItems = [];

        if (customers) {
            customerItems = customers.map((customer) => {
                return {value: customer.id, label: customer.name};
            });
        }

        return (<div>
            <Header />

            <div className="ui form report-panel">
                <h1 className="ui header">Counter Receipts</h1>

                <div className="fields">
                    <Input name="startDate" placeholder="MM/dd/yyyy"
                        label="Start Date" value={startDate} onChange={super.onChange.bind(this)} fieldClassName="eight" />

                    <Input name="endDate" placeholder="MM/dd/yyyy"
                        label="End Date" value={endDate} onChange={super.onChange.bind(this)} fieldClassName="eight" />
                </div>

                <div className="fields">
                    <Dropdown name="customer" label="Customer" value={customerId}
                        options={customerItems} onChange={(value) => this.onCustomerChange(value)}
                        fieldClassName="sixteen" />
                </div>

                <br />
                <Button className="ui green button" icon="print" onClick={() => this.onPrint()}>Print</Button>
            </div>
        </div>);
    }

}

export default CounterReceipt;
