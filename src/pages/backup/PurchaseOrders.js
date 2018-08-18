import _ from 'lodash'
import React from 'react';
import { Link } from 'react-router';

import Utils from '../core/Utils'
import Provider from '../core/Provider'
import Formatter from '../core/Formatter'

import Input from '../components/Input'
import Button from '../components/Button'
import Dropdown from '../components/Dropdown'
import Textarea from '../components/Textarea'
import Datatable from '../components/Datatable'


import TransactionView from './abstract/TransactionView'

class PurchaseOrders extends TransactionView {

    constructor(props) {
        super(props);
        this.type = "purchaseOrder";
        this.endpoint = `${this.type}/`;
    }

    getColumns() {
        const { transaction } = this.state;

        let columns = [
            {
                key: "stock",
                name: "Stock",
                editable: true,
                required: true,
                getOptions: Provider.getStocks,
            }, {
                key: "stock.description",
                name: "Description"
            }, {
                key: "stock.unit.name",
                name: "Unit"
            }, {
                key: "quantity",
                name: "Qty",
                editable: true,
                required: true,
                type: "number",
                getDefaultValue: (row) => row && row.stock ? 1 : null
            }, {
                key: "price",
                name: "Price",
                editable: true,
                required: true,
                type: "amount",
                getDefaultValue: (row) => row && row.stock ? row.stock.cost : null
            }
        ];

        let createDiscountColumn = (key, name) => {
            return {
                key,
                name,
                editable: true,
                type: "amount",
            };
        }
        columns.push(createDiscountColumn("discount1", "D1"));
        columns.push(createDiscountColumn("discount2", "D2"));

        columns.push({
            key: "amount",
            name: "Amount",
            type: "amount",
            formula: (item) => {
                if (item.price && item.quantity && !isNaN(item.price) && !isNaN(item.quantity)) {
                    const gross = parseFloat(item.price) * parseFloat(item.quantity);
                    let net = gross;

                    if (item.discount1 && !isNaN(item.discount1)) {
                        net = net - (net * (parseFloat(item.discount1) / 100));
                    }

                    if (item.discount2 && !isNaN(item.discount2)) {
                        net = net - (net * (parseFloat(item.discount2) / 100));
                    }

                    if (item.discount3 && !isNaN(item.discount3)) {
                        net = net - (net * (parseFloat(item.discount3) / 100));
                    }
                    return net;
                }
                return null;
            }
        });

        return columns;
    }

    componentDidMount() {
        super.componentDidMount();
        Provider.loadSuppliers((suppliers) => this.setState({suppliers}));
    }

    getRequestValue() {
        let transaction = this.state.transaction;
        transaction.items = this.transactionItemsTable.getRows().map((item) => {
            if (!transaction.discount1) {
                delete item.discount1;
            }

            if (!transaction.discount2) {
                delete item.discount2;
            }

            if (!transaction.discount3) {
                delete item.discount3;
            }
            return item;
        });

        return transaction;
		}

    onSupplierChange(supplier) {
		    let transaction = this.state.transaction || {};
		    transaction.supplier = {id: supplier.value};
		    this.setState({transaction});
		}

    renderTransaction() {
        let { transaction, suppliers, totalAmount, items, updateMode } = this.state;

        let supplier = transaction.supplier;
        let supplierId = supplier ? supplier.id : null;

        let supplierItems = [];
        if (suppliers) {
            supplierItems = suppliers.map((supplier) => {
                return {value: supplier.id, label: supplier.name};
            });
        }

        return <div className="ui form">
            <div className="fields">
                <Input ref={(input) => {this.firstInput = input}} autoFocus="true"
                    name="transaction.documentNo" disabled={true}
                    label="Document No." value={transaction.documentNo} disabled={!updateMode}
                    onChange={super.onChange.bind(this)} fieldClassName="four" />

                <Input name="transaction.date" placeholder="MM/dd/yyyy"
                    label="Date" value={transaction.date} disabled={!updateMode}
                    onChange={super.onChange.bind(this)} fieldClassName="four" />

                <Dropdown name="supplier" label="Supplier" value={supplierId} disabled={!updateMode}
                    options={supplierItems} onChange={(value) => this.onSupplierChange(value)}
                    fieldClassName="eight" />
            </div>

            <div className="fields">
                <Textarea ref={(input) => {this.lastInput = input;}}
                    name="transaction.remarks" label="Remarks" value={transaction.remarks} disabled={!updateMode}
                    onChange={super.onChange.bind(this)} onKeyDown={this.checkTableTab.bind(this)}
                    fieldClassName="eight" />

                <Input name="totalAmount" label="Total Amount"
                    value={Formatter.formatAmount(totalAmount)} disabled={true}
                    fieldClassName="eight" />
            </div>
            <br/>

            <Datatable
                columns={this.getColumns()}
                rows={items} footers={this.state.footers}
                disabled={!updateMode} allowedDelete={true}
                ref={(table) => { this.transactionItemsTable = table; }}
                onRowsChange={(rows) => this.updateTotalAmount(rows)}
                getFirstInput={() => this.firstInput}
                getLastInput={() => this.lastInput} />
        </div>;
    }

}

export default PurchaseOrders;
