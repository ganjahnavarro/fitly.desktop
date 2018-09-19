import React from 'react'
import { Link } from 'react-router'
import Chart from 'chart.js'
import moment from 'moment'

import View from './abstract/View'
import Input from '../components/Input'
import Button from '../components/Button'

import Formatter from '../core/Formatter'
import Fetch from '../core/Fetch'

class Home extends View {

		constructor(props) {
				super(props);

				const today = moment().format("MM/DD/YYYY");
				this.state.todayAsDateRange = {
						startDate: today,
						endDate: today
				};

				this.state.salesReportStartDate = today;
				this.state.salesReportEndDate = today;
				this.state.coachEnrolleesStartDate = today;
				this.state.coachEnrolleesEndDate = today;

				const placeholderValue = "...";
				this.state.mostPurchasedProgram = placeholderValue;
				this.state.mostPurchasedPackage = placeholderValue;
		}

		resetDateFilters(callback) {
				const today = moment().format("MM/DD/YYYY");
				this.setState({
						salesReportStartDate: today,
						salesReportEndDate: today,
						coachEnrolleesStartDate: today,
						coachEnrolleesEndDate: today
				}, callback);
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
				Fetch.get("member/count/", this.state.todayAsDateRange, (count) => {
						this.setState({ membersCount: count });
						this.updateEnrolleesChart();
				});

				const params = Object.assign({ type: "WALKIN" }, this.state.todayAsDateRange);
				Fetch.get("member/count/", params, (count) => {
						this.setState({ walkinsCount: count });
						this.updateEnrolleesChart();
				});
		}

		fetchSalesReports() {
				const { salesReportStartDate, salesReportEndDate } = this.state;
				const params = {
						startDate: salesReportStartDate,
						endDate: salesReportEndDate
				};
				Fetch.get("report/sales", params, (salesReports) => {
						this.setState({ salesReports });
						this.updateSalesReportChart();
				});
		}

		fetchCoachEnrollees() {
				const { coachEnrolleesStartDate, coachEnrolleesEndDate } = this.state;
				const params = {
						startDate: coachEnrolleesStartDate,
						endDate: coachEnrolleesEndDate
				};
				Fetch.get("report/coach/enrollees", params, (coachEnrollees) => {
						this.setState({ coachEnrollees });
						this.updateCoachEnrolleesChart();
				});
		}

		updateEnrolleesChart() {
				let { membersCount, walkinsCount, currentPage } = this.state;
				if (membersCount !== undefined && walkinsCount !== undefined) {
						walkinsCount = walkinsCount || 0;
						membersCount = membersCount || 0;

						if (walkinsCount || membersCount) {
								if (!currentPage) {
										this.createBarChart({
												id: "enrolleesChart",
												title: "Enrollees",
												labels: ["Walk-Ins", "Memberships"],
												values: [walkinsCount, membersCount],
												fixedStepSize: 1
										});
								}
								this.setState({ noEnrolleesData: false });
						} else {
								this.setState({ noEnrolleesData: true });
						}
				}
		}

		updateSalesReportChart() {
				const { salesReports, currentPage } = this.state;

				let totals = new Map();
				totals.set("Memberships", 0);
				totals.set("Program Availments", 0);
				totals.set("Package Availments", 0);
				totals.set("Commissions", 0);

				if (salesReports && salesReports.length) {
						if (!currentPage) {
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
						this.setState({ noSalesReportData: false });
				} else {
						this.setState({ noSalesReportData: true });
				}
		}

		updateCoachEnrolleesChart() {
				const { coachEnrollees, currentPage } = this.state;

				if (coachEnrollees && coachEnrollees.length) {
						if (!currentPage) {
								const maxDisplayed = 5;
								const items = coachEnrollees.slice(0, maxDisplayed);

								this.createBarChart({
										id: "traineesChart",
										title: "No. of Trainees per Coach",
										labels: items.map(item => item.coach.firstName),
										values: items.map(item => item.count),
										fixedStepSize: 1
								});
						}
						this.setState({ noCoachTraineesData: false });
				} else {
						this.setState({ noCoachTraineesData: true });
				}
		}

		createBarChart({ id, title, labels, values, fixedStepSize }) {
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

				const ticks = { beginAtZero: true };
				if (fixedStepSize) {
						ticks.fixedStepSize = fixedStepSize;
				}

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
										yAxes: [{ ticks }]
								}
						}
				});
		}

		componentDidMount() {
				this.reprocessDashboardItems();
		}

		reprocessDashboardItems() {
				const callback = () => {
						this.fetchEnrolleesCounts();
						this.fetchCoachEnrollees();
						this.fetchProgramPurchaseSummaryData();
						this.fetchPackagePurchaseSummaryData();
						this.fetchSalesReports()
				};

				this.resetDateFilters(callback);
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
				const { mostPurchasedProgram, mostPurchasedPackage,
						noSalesReportData, noCoachTraineesData, noEnrolleesData } = this.state;

				const downloadSalesReportAction = <a className="ui label"	onClick={() => this.onPrintTodaySalesReport()}>
						<i className="download icon"></i> Download
				</a>;

				return <div className="home">
						<div className="ui grid">
								<div className="ten wide column">
										<div className="ui fluid card">
												<div className="content">
														<span className="ui basic green label">Sales Report</span>
														<div className="description">
																{noSalesReportData ? undefined : <canvas id="salesChart" width="630" height="150" />}
																{noSalesReportData ? <p className="no-data-message">No data yet for today.</p> : undefined}
														</div>
														<a className="ui label"	onClick={() => this.onViewSalesReports()}>
																<i className="eye icon"></i> View All
														</a>
														{noSalesReportData ? undefined : downloadSalesReportAction}
												</div>
										</div>
								</div>

								<div className="six wide column">
										<div className="ui fluid card">
												<div className="content">
														<span className="ui basic green label">Enrollees</span>
														<div className="description">
																{noEnrolleesData ? undefined : <canvas id="enrolleesChart" width="350" height="150" />}
																{noEnrolleesData ? <p className="no-data-message">No data yet for today.</p> : undefined}
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

								<div className="eight wide column">
										<div className="ui fluid card">
												<div className="content">
														<span className="ui basic green label">Trainees per Coach</span>
														<div className="description chart-container">
																{noCoachTraineesData ? undefined : <canvas id="traineesChart" width="480" height="150" />}
																{noCoachTraineesData ? <p className="no-data-message">No data yet for today.</p> : undefined}
														</div>
														<a className="ui label"	onClick={() => this.onViewCoachEnrollees()}>
																<i className="eye icon"></i> View All
														</a>
												</div>
										</div>
								</div>

								<div className="four wide column">
										{this.createMostPurchasedCard({
												onClick: () => this.onViewProgramPurchases(),
												title: "Most purchased Program",
												value: mostPurchasedProgram,
												icon: "icon_programs"
										})}
								</div>

								<div className="four wide column">
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

		onPrintTodaySalesReport() {
				this.onPrintSalesReport(this.state.todayAsDateRange);
		}

		onPrintFilteredSalesReport() {
				const { salesReportStartDate, salesReportEndDate } = this.state;
				const params = {
						startDate: salesReportStartDate,
						endDate: salesReportEndDate
				};
				this.onPrintSalesReport(params);
		}

		onPrintSalesReport(dateFilter) {
				const dateTime = moment().format('MM_DD_YYYY_hh_mm_ss');
				Fetch.download("report/sales/download", dateFilter, `Sales Report (${dateTime}).xls`);
		}

		onViewDashboard() {
				this.setState({ currentPage: null }, () => this.reprocessDashboardItems());
		}

		onViewSalesReports() {
				this.setState({ currentPage: "view.sales.reports" });
		}

		onViewCoachEnrollees() {
				this.setState({ currentPage: "view.coach.enrollees" });
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
				const { salesReports, salesReportStartDate, salesReportEndDate, noSalesReportData } = this.state;

				const renderRow = (item, index) => {
						return <tr key={index}>
								<td>{item.date}</td>
								<td>{item.person}</td>
								<td>{item.description}</td>
								<td className="right aligned">{Formatter.formatAmount(item.amount)}</td>
						</tr>;
				};

				let component = <p>No data, try adjusting start date and end date filter.</p>;
				if (salesReports && salesReports.length) {
						let totalAmount = 0;
						salesReports.forEach(item => {
								totalAmount += (item.description === "Commissions" ? -item.amount : item.amount);
						});

						component = <div className="ui grid">
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
						</div>;
				}

				const downloadSalesReportAction = <Button className="ui mini button" icon="download" onClick={() => this.onPrintFilteredSalesReport()}>Download</Button>

				return <div>
						<h4>Sales Reports</h4>
						<div className="ui filter form">
								<div className="fields">
										<Input ref={(input) => {this.initialInput = input}} autoFocus="true"
												name="salesReportStartDate" inlineLabel="Start Date" value={salesReportStartDate}
												onChange={super.onChange.bind(this)} placeholder="MM/dd/yyyy"
												fieldClassName="five" inputClassName="mini" />

										<Input name="salesReportEndDate" inlineLabel="End Date" value={salesReportEndDate}
												onChange={super.onChange.bind(this)} placeholder="MM/dd/yyyy"
												fieldClassName="five" inputClassName="mini" />

										<Button className="ui mini orange button" icon="search" onClick={() => this.fetchSalesReports()}>Filter</Button>
										{noSalesReportData ? undefined : downloadSalesReportAction}
								</div>
						</div>
						{component}
				</div>;
		}

		getCoachEnrolleesComponent() {
				const { coachEnrollees, coachEnrolleesStartDate, coachEnrolleesEndDate } = this.state;

				const renderRow = (item, index) => {
						const { firstName, middleName, lastName } = item.coach;
						return <tr key={index}>
								<td>{`${firstName} ${middleName ? middleName + " " : ""}${lastName}`}</td>
								<td>{item.count}</td>
						</tr>;
				};

				let component = <p>No data, try adjusting start date and end date filter.</p>;
				if (coachEnrollees && coachEnrollees.length) {
						let totalCount = 0;
						coachEnrollees.forEach(item => totalCount += item.count);

						component = <div className="ui grid">
								<div className="eight wide column">
										<table className="ui green small table ">
												<thead>
														<tr>
																<th>Coach</th>
																<th>Count</th>
														</tr>
												</thead>
												<tbody>
														{coachEnrollees.map(renderRow)}
												</tbody>

												<tfoot className="full-width footer-total">
														<tr>
																<th colSpan="2">
																		<div className="ui blue basic label">
																				<i className="check icon"></i> Total Enrollees: {totalCount}
																		</div>
																</th>
														</tr>
												</tfoot>
										</table>
								</div>
						</div>;
				}
				return <div>
						<h4>Coach Enrollees</h4>
						<div className="ui filter form">
								<div className="fields">
										<Input ref={(input) => {this.initialInput = input}} autoFocus="true"
												name="coachEnrolleesStartDate" inlineLabel="Start Date" value={coachEnrolleesStartDate}
												onChange={super.onChange.bind(this)} placeholder="MM/dd/yyyy"
												fieldClassName="five" inputClassName="mini" />

										<Input name="coachEnrolleesEndDate" inlineLabel="End Date" value={coachEnrolleesEndDate}
												onChange={super.onChange.bind(this)} placeholder="MM/dd/yyyy"
												fieldClassName="five" inputClassName="mini" />

										<Button className="ui mini orange button" icon="search" onClick={() => this.fetchCoachEnrollees()}>Filter</Button>
								</div>
						</div>
						{component}
				</div>;
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
						case "view.coach.enrollees":
								component = this.getCoachEnrolleesComponent();
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
