import React from 'react'
import { Link } from 'react-router'
import Chart from 'chart.js';

import View from './abstract/View'
import Button from '../components/Button'

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

		updateEnrolleesChart() {
				const { membersCount, walkinsCount } = this.state;
				if (membersCount !== undefined && walkinsCount !== undefined) {
						const enrolleesChartContext = document.getElementById("enrolleesChart");
						const enrolleesChart = new Chart(enrolleesChartContext, {
								type: 'bar',
								data: {
										labels: ["Walk-Ins", "Memberships"],
										datasets: [{
												label: '# of Enrollees',
												data: [
														walkinsCount || 0,
														membersCount || 0
												],
												backgroundColor: [
														'rgba(255, 206, 86, 0.2)',
														'rgba(75, 192, 192, 0.2)'
												],
												borderColor: [
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
		}

		componentDidMount() {
				// this.reprocessDashboardItems();

				Fetch.get("report/sales", null, (salesReports) => {
						console.warn("salesReports", salesReports);
				});
		}

		reprocessDashboardItems() {
				this.fetchEnrolleesCounts();

				this.fetchProgramPurchaseSummaryData();
				this.fetchPackagePurchaseSummaryData();

				const salesChartContext = document.getElementById("salesChart");
				const salesChart = new Chart(salesChartContext, {
						type: 'bar',
						data: {
								labels: ["Boxing", "Muay Thai", "Gym", "BJJ"],
								datasets: [{
										label: '# of Votes',
										data: [13, 11, 29, 8],
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

		getDashboard() {
				const { mostPurchasedProgram, mostPurchasedPackage } = this.state;
				return <div className="home">
						<div className="ui three column grid">
								<div className="column">
										<div className="ui fluid card">
												<div className="content">
														<a className="ui basic green label">Sales Report</a>
														<div className="description chart-container">
																<canvas id="salesChart" />
														</div>
														<a className="ui label">
																<i className="eye icon"></i> Work in Progress
														</a>
												</div>
										</div>
								</div>

								<div className="column">
										<div className="ui fluid card">
												<div className="content">
														<a className="ui basic green label">Enrollees</a>
														<div className="description chart-container">
																<canvas id="enrolleesChart" />
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

								<div className="column">
										<div className="ui fluid card">
												<div className="content">
														<a className="ui basic green label">Trainees per Coach</a>
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
										<div className="ui fluid card">
												<div className="content">
														<a className="ui basic green label">Most purchased Program</a>
														<div className="description">
																<h4 className="ui center aligned icon header">
																		<img src={"resources/images/icon_programs.png"} className="ui circular image" />
																		{mostPurchasedProgram}
																</h4>
														</div>
														<a className="ui label"	onClick={() => this.onViewProgramPurchases()}>
																<i className="eye icon"></i> View All
														</a>
												</div>
										</div>
								</div>

								<div className="column">
										<div className="ui fluid card">
												<div className="content">
														<a className="ui basic green label">Most purchased Package</a>
														<div className="description">
																<h4 className="ui center aligned icon header">
																		<img src={"resources/images/icon_packages.png"} className="ui circular image" />
																		{mostPurchasedPackage}
																</h4>
														</div>
														<a className="ui label"	onClick={() => this.onViewPackagePurchases()}>
																<i className="eye icon"></i> View All
														</a>
												</div>
										</div>
								</div>
						</div>
				</div>;
		}

		onViewDashboard() {
				this.setState({ currentPage: null }, () => this.reprocessDashboardItems());
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
								<table className="ui green small table">
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
						</div>;
				}
				return component;
		}

		render() {
				let component = this.getDashboard();
				switch (this.state.currentPage) {
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
