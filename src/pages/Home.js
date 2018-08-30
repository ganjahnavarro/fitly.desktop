import React from 'react'
import Chart from 'chart.js';

import View from './abstract/View'
import Button from '../components/Button'

class Home extends View {

		componentDidMount() {
				const salesChartContext = document.getElementById("salesChart");
				const salesChart = new Chart(salesChartContext, {
				    type: 'bar',
				    data: {
				        labels: ["Red", "Blue", "Yellow", "Green"],
				        datasets: [{
				            label: '# of Votes',
				            data: [12, 19, 3, 3, 3, 3, 31],
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

				const enrolleesChartContext = document.getElementById("enrolleesChart");
				const enrolleesChart = new Chart(enrolleesChartContext, {
				    type: 'bar',
				    data: {
				        labels: ["Red", "Blue", "Yellow", "Green"],
				        datasets: [{
				            label: '# of Votes',
				            data: [12, 19, 3, 3, 3, 3, 31],
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
				        labels: ["Red", "Blue", "Yellow", "Green"],
				        datasets: [{
				            label: '# of Votes',
				            data: [12, 19, 3, 3, 3, 3, 31],
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

		render() {
				return <div className="home">
						<div className="ui three column grid">
								<div className="column">
										<div className="ui fluid card">
												<div className="content">
														<a className="ui basic green label">Sales Report</a>
														<div className="description chart-container">
																<canvas id="salesChart" />
														</div>
														<a className="ui label"><i className="eye icon"></i>
														View All</a>
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
														<a className="ui label"><i className="eye icon"></i>
														View All</a>
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
														<a className="ui label"><i className="eye icon"></i>
														View All</a>
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
																		Muay Thai
																</h4>
														</div>
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
																		Boxing
																</h4>
														</div>
												</div>
										</div>
								</div>
						</div>
				</div>;
		}
}

export default Home;
