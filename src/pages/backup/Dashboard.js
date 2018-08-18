import React from 'react'
import View from './abstract/View'
import { Link } from 'react-router'

import Header from '../components/Header'

class Dashboard extends View {

		renderItem(item, index) {
				let colors = ["red", "orange", "yellow", "olive", "green", "teal",
						"blue", "violet", "purple", "pink"];

				return <div key={item.label} className={"ui card " + colors[index]}>
						<Link to={item.link} className="image">
								<div className="image-container">
										<img src={"resources/images/" + item.icon + ".png"} />
								</div>
						</Link>

						<Link to={item.link} className="content">
								<span className="header">{item.label}</span>
						</Link>
				</div>
		}

		render() {
				let files = [
						{link: "/units", label: "Units", icon: "icon_units"},
						{link: "/categories", label: "Categories", icon: "icon_categories"},
						{link: "/brands", label: "Brands", icon: "icon_brands"},
						{link: "/stocks", label: "Stock Inventory", icon: "icon_stocks"},
						{link: "/agents", label: "Agents", icon: "icon_agents"},
						{link: "/suppliers", label: "Suppliers", icon: "icon_suppliers"},
						{link: "/customers", label: "Customers", icon: "icon_customers"}
				];

				let transactions = [
						{link: "/purchaseOrders", label: "Purchase Orders", icon: "icon_purchase_orders"},
						{link: "/salesOrders", label: "Sales Orders", icon: "icon_sales_orders"},
						{link: "/counterReceipts", label: "Counter Receipts", icon: "icon_counter_receipts"},
						{link: "/todo", label: "Commissions", icon: "icon_commissions"},
						{link: "/todo", label: "Customer Payments", icon: "icon_customer_payments"},
						{link: "/todo", label: "Supplier Payments", icon: "icon_supplier_payments"},
				];

				let reports = [
						{link: "/transactions", label: "Transaction List", icon: "icon_report1"},
						{link: "/stockMovement", label: "Stock Movement", icon: "icon_report2"},
						{link: "/stockMonitoring", label: "Stock Monitoring", icon: "icon_report3"},
						{link: "/purchaseMonitoring", label: "Purchase Monitoring", icon: "icon_report4"},
						{link: "/salesMonitoring", label: "Sales Monitoring", icon: "icon_report5"}
				];

				let filesComponents = files.map((item, index) => this.renderItem(item, index));
				let transactionsComponents = transactions.map((item, index) => this.renderItem(item, index));
				let reportsComponents = reports.map((item, index) => this.renderItem(item, index));

				return <div>
						<Header />
						<div className="dashboard">
								<div className="group">
										<div className="ui large label teal">Files</div> <br/>
										<div className="ui link seven cards">
												{filesComponents}
										</div>
								</div>

								<div className="group">
										<div className="ui large label blue">Transactions</div>
										<div className="ui link six cards">
												{transactionsComponents}
										</div>
								</div>

								<div className="group">
										<div className="ui large label violet">Reports</div>
										<div className="ui link five cards">
												{reportsComponents}
										</div>
								</div>
						</div>
				</div>
		}
}

export default Dashboard;
