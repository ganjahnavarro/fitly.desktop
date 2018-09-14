import React from 'react'
import { Link } from 'react-router'
import Chart from 'chart.js';

import View from './abstract/View'
import Button from '../components/Button'

import Formatter from '../core/Formatter'
import Fetch from '../core/Fetch'

class Home extends View {

		constructor(props) {
				super(props);

				const placeholderValue = "...";
				this.state.mostPurchasedProgram = placeholderValue;
				this.state.mostPurchasedPackage = placeholderValue;
		}

		fetchProgramPurchaseSummaryData() {
				Fetch.get("report/program/summary/", undefined, (items) => {
						if (items && items.length) {
								this.setState({
										mostPurchasedProgram: items[0].program.name,
										programPurchaseSummaries: items
								});
						}
				});
		}

		fetchPackagePurchaseSummaryData() {
				Fetch.get("report/package/summary/", undefined, (items) => {
						if (items && items.length) {
								this.setState({
										mostPurchasedPackage: items[0].pkg.name,
										packagePurchaseSummaries: items
								});
						}
				});
		}

		fetchEnrolleesCounts() {
				Fetch.get("member/count/", undefined, (count) => {
						this.setState({ membersCount: count });
						this.updateEnrolleesChart();
				});

				Fetch.get("member/count/", { type: "WALKIN" }, (count) => {
						console.warn("walkins count", count);
						this.setState({ walkinsCount: count });
						this.updateEnrolleesChart();
				});
		}

		fetchSalesReports() {
				Fetch.get("report/sales", null, (salesReports) => {
						this.setState({ salesReports });
						this.updateSalesReportChart();
				});
		}

		updateEnrolleesChart() {
				const { membersCount, walkinsCount } = this.state;
				if (membersCount !== undefined && walkinsCount !== undefined) {
						this.createBarChart({
								id: "enrolleesChart",
								title: "Enrollees",
								labels: ["Walk-Ins", "Memberships"],
								values: [
										walkinsCount || 0,
										membersCount || 0
								],
						});
				}
		}

		updateSalesReportChart() {
				const { salesReports } = this.state;

				let totals = new Map();
				totals.set("Memberships", 0);
				totals.set("Program Availments", 0);
				totals.set("Package Availments", 0);
				totals.set("Commissions", 0);

				if (salesReports && salesReports.length) {
						salesReports.forEach(item => {
								const amount = item.amount + totals.get(item.description);
								totals.set(item.description, amount);
						});

						this.createBarChart({
								id: "salesChart",
								title: "Sales",
								labels: Array.from(totals.keys()),
								values: Array.from(totals.values())
						});
				}
		}

		createBarChart({ id, title, labels, values }) {
				const context = document.getElementById(id);

				const backgroundColors = [];
				const borderColors = [];

				labels.forEach(() => {
						var r = Math.floor(Math.random() * 255);
						var g = Math.floor(Math.random() * 255);
						var b = Math.floor(Math.random() * 255);
						backgroundColors.push(`rgba(${r}, ${g}, ${b}, 0.2)`);
						borderColors.push(`rgba(${r}, ${g}, ${b}, 1)`);
				});

				new Chart(context, {
						type: 'bar',
						data: {
								labels,
								datasets: [{
										label: title,
										data: values,
										backgroundColor: backgroundColors,
										borderColor: borderColors,
										borderWidth: 1
								}]
						},
						options: {
								responsive: false,
								legend: { display: false },
								scales: {
										yAxes: [{
												ticks: {
														beginAtZero: true
												}
										}]
								}
						}
				});
		}

		componentDidMount() {
				this.reprocessDashboardItems();
		}

		reprocessDashboardItems() {
				this.fetchEnrolleesCounts();

				this.fetchProgramPurchaseSummaryData();
				this.fetchPackagePurchaseSummaryData();
				this.fetchSalesReports();

				const traineesContext = document.getElementById("traineesChart");
				const traineesChart = new Chart(traineesContext, {
						type: 'bar',
						data: {
								labels: ["Mark", "John", "Justin", "Zeke"],
								datasets: [{
										label: 'No. of Trainees',
										data: [2, 8, 3, 14],
										backgroundColor: [
												'rgba(255, 99, 132, 0.2)',
												'rgba(54, 162, 235, 0.2)',
												'rgba(255, 206, 86, 0.2)',
												'rgba(75, 192, 192, 0.2)'
										],
										borderColor: [
												'rgba(255,99,132,1)',
												'rgba(54, 162, 235, 1)',
												'rgba(255, 206, 86, 1)',
												'rgba(75, 192, 192, 1)'
										],
										borderWidth: 1
								}]
						},
						options: {
								responsive: false,
								legend: { display: false }
						}
				});
		}

		createMostPurchasedCard({ title, value, icon, onClick }) {
				return <div className="ui fluid card">
						<div className="content">
								<span className="ui basic green label">{title}</span>
								<div className="description">
										<h4 className="ui center aligned icon header">
												<img src={`resources/images/${icon}.png`} className="ui circular image" />{value}
										</h4>
								</div>
								<a className="ui label"	onClick={onClick}>
										<i className="eye icon"></i> View All
								</a>
						</div>
				</div>;
		}

		getDashboard() {
				const { mostPurchasedProgram, mostPurchasedPackage } = this.state;
				return <div className="home">
						<div className="ui grid">
								<div className="ten wide column">
										<div className="ui fluid card">
												<div className="content">
														<span className="ui basic green label">Sales Report</span>
														<div className="description">
																<canvas id="salesChart" width="630" height="150" />
														</div>
														<a className="ui label"	onClick={() => this.onViewSalesReports()}>
																<i className="eye icon"></i> View All
														</a>
												</div>
										</div>
								</div>

								<div className="six wide column">
										<div className="ui fluid card">
												<div className="content">
														<span className="ui basic green label">Enrollees</span>
														<div className="description">
																<canvas id="enrolleesChart" width="350" height="150" />
														</div>
														<Link className="ui label" to="/walkins">
																<i className="eye icon"></i> Walk-Ins
														</Link>
														<Link className="ui label" to="/members">
																<i className="eye icon"></i> Memberships
														</Link>
												</div>
										</div>
								</div>
						</div>

						<div className="ui three column grid">
								<div className="column">
										<div className="ui fluid card">
												<div className="content">
														<span className="ui basic green label">Trainees per Coach</span>
														<div className="description chart-container">
																<canvas id="traineesChart" />
														</div>
														<a className="ui label">
																<i className="eye icon"></i> Work in Progress
														</a>
												</div>
										</div>
								</div>

								<div className="column">
										{this.createMostPurchasedCard({
												onClick: () => this.onViewProgramPurchases(),
												title: "Most purchased Program",
												value: mostPurchasedProgram,
												icon: "icon_programs"
										})}
								</div>

								<div className="column">
										{this.createMostPurchasedCard({
												onClick: () => this.onViewPackagePurchases(),
												title: "Most purchased Package",
												value: mostPurchasedPackage,
												icon: "icon_packages"
										})}
								</div>
						</div>
				</div>;
		}

		onViewDashboard() {
				this.setState({ currentPage: null }, () => this.reprocessDashboardItems());
		}

		onViewSalesReports() {
				this.setState({ currentPage: "view.sales.reports" });
		}

		onViewProgramPurchases() {
				this.setState({ currentPage: "view.program.purchases" });
		}

		onViewPackagePurchases() {
				this.setState({ currentPage: "view.package.purchases" });
		}

		getBackToDashboardComponent() {
				return <div className="ui label clickable padbot back-to-dashboard" onClick={() => this.onViewDashboard()}>
						<i className="angle left icon"></i> Back
				</div>;
		}

		getSalesReportsComponent() {
				const { salesReports } = this.state;

				const renderRow = (item, index) => {
						return <tr key={item.id}>
								<td>{item.date}</td>
								<td>{item.person}</td>
								<td>{item.description}</td>
								<td className="right aligned">{Formatter.formatAmount(item.amount)}</td>
						</tr>;
				};

				let component = <div>
						<h4>No data to show.</h4>
				</div>;

				if (salesReports && salesReports.length) {
						let totalAmount = 0;
						salesReports.forEach(item => {
								totalAmount += (item.description === "Commissions" ? -item.amount : item.amount);
						});

						component = <div>
								<h4>Program Purchases</h4>
								<div className="ui grid">
										<div className="twelve wide column">
												<table className="ui green small table ">
														<thead>
																<tr>
																		<th>Date</th>
																		<th>Name</th>
																		<th>Type</th>
																		<th>Amount</th>
																</tr>
														</thead>
														<tbody>
																{salesReports.map(renderRow)}
														</tbody>

														<tfoot className="full-width footer-total">
																<tr>
																		<th colSpan="4">
																				<div className="ui blue basic label">
																						<i className="check icon"></i> Total Sales: {Formatter.formatAmount(totalAmount)}
																				</div>
																		</th>
																</tr>
														</tfoot>
												</table>
										</div>
								</div>
						</div>;
				}
				return component;
		}

		getProgramPurchasesComponent() {
				const { programPurchaseSummaries } = this.state;

				const renderRow = (item, index) => {
						return <tr key={item.id}>
								<td>{item.program.name}</td>
								<td>{item.count}</td>
						</tr>;
				};

				let component = <div>
						<h4>No program purchases yet.</h4>
				</div>;

				if (programPurchaseSummaries && programPurchaseSummaries.length) {
						let totalCount = 0;
						programPurchaseSummaries.forEach(item => {
								if (item.count) {
										totalCount += item.count;
								}
						});

						component = <div>
								<h4>Program Purchases</h4>
								<div className="ui grid">
										<div className="eight wide column">
												<table className="ui green small table ">
														<thead>
																<tr>
																		<th>Program</th>
																		<th>Count</th>
																</tr>
														</thead>
														<tbody>
																{programPurchaseSummaries.map(renderRow)}
														</tbody>

														<tfoot className="full-width footer-total">
																<tr>
																		<th colSpan="2">
																				<div className="ui blue basic label">
																						<i className="check icon"></i> Total Purchases: {totalCount}
																				</div>
																		</th>
																</tr>
														</tfoot>
												</table>
										</div>
								</div>
						</div>;
				}
				return component;
		}

		getPackagePurchasesComponent() {
				const { packagePurchaseSummaries } = this.state;

				const renderRow = (item, index) => {
						return <tr key={item.id}>
								<td>{item.pkg.name}</td>
								<td>{item.count}</td>
						</tr>;
				};

				let component = <div>
						<h4>No package purchases yet.</h4>
				</div>;

				if (packagePurchaseSummaries && packagePurchaseSummaries.length) {
						let totalCount = 0;
						packagePurchaseSummaries.forEach(item => {
								if (item.count) {
										totalCount += item.count;
								}
						});

						component = <div>
								<h4>Package Purchases</h4>
								<div className="ui grid">
										<div className="eight wide column">
												<table className="ui green small table">
														<thead>
																<tr>
																		<th>Package</th>
																		<th>Count</th>
																</tr>
														</thead>
														<tbody>
																	{packagePurchaseSummaries.map(renderRow)}
														</tbody>

														<tfoot className="full-width footer-total">
																<tr>
																		<th colSpan="2">
																				<div className="ui blue basic label">
																						<i className="check icon"></i> Total Purchases: {totalCount}
																				</div>
																		</th>
																</tr>
														</tfoot>
												</table>
										</div>
								</div>
						</div>;
				}
				return component;
		}

		render() {
				let component = this.getDashboard();
				switch (this.state.currentPage) {
						case "view.sales.reports":
								component = this.getSalesReportsComponent();
								break;
						case "view.program.purchases":
								component = this.getProgramPurchasesComponent();
								break;
						case "view.package.purchases":
								component = this.getPackagePurchasesComponent();
								break;
				}

				return <div>
						{this.state.currentPage ? this.getBackToDashboardComponent() : undefined}
						{component}
				</div>;
		}
}

export default Home;
