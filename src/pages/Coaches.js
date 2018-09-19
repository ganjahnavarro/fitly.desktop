import React from 'react'
import { Link } from 'react-router'
import moment from 'moment'

import View from './abstract/View'
import ListView from './abstract/ListView'
import DetailView from './abstract/DetailView'

import Input from '../components/Input'
import Button from '../components/Button'
import Audit from '../components/Audit'
import Header from '../components/Header'
import Dropdown from '../components/Dropdown'
import Textarea from '../components/Textarea'

import { GENDERS } from '../core/Constants'
import Formatter from '../core/Formatter'
import Provider from '../core/Provider'
import Fetch from '../core/Fetch'

class Coaches extends ListView {

		constructor(props) {
		    super(props);
        this.endpoint = "coach/";
				this.orderBy = "firstName";
		}

		render() {
				let items = [];
				let { selectedItem, selectedIndex } = this.state;

				if (this.state.items) {
						items = this.state.items.map((item, index) => {
								const { firstName, middleName, lastName } = item;
								const className = selectedIndex === index ? "selected" : undefined;
								return <li key={index} onClick={this.onItemClick.bind(this, index)} className={className}>
										{`${firstName} ${middleName ? middleName + " " : ""}${lastName}`}
								</li>;
						});
				}

		    return <div>
						<Header location={this.props.location} />
						<div className="ui grid">
								<div className="five wide column ui form">
										<Input label="Search" value={this.state.filter} name="filter"
													onChange={this.onFilter.bind(this)} placeholder="Type here to search" />

										<div className="ui divider"></div>
										<div className="files">
													<ul className="ui list">{items}</ul>
										</div>
								</div>

								<div className="eleven wide column">
										<Coach value={selectedItem} onFetch={this.onFetch}/>
								</div>
				    </div>
				</div>;
		}
}

class Coach extends DetailView {

		constructor(props) {
		    super(props);
        this.endpoint = "coach/";

				const today = moment().format("MM/DD/YYYY");
				this.state.filterStartDate = today;
				this.state.filterEndDate = today;
    }

		onGenderChange(gender) {
		    let nextState = this.state.value || {};
		    nextState.gender = gender.value;
		    this.setState(nextState);
		}

		loadCommissions() {
				let { value, filterStartDate, filterEndDate } = this.state;
				let defaultParameters = {
						coachId: value.id,
						pageSize: 100,
						pageOffset: 0,
						startDate: filterStartDate,
						endDate: filterEndDate
				};

				let parameters = Object.assign({}, defaultParameters);

				Fetch.get("timeentry/", parameters, (timeEntries) => {
						this.setState({ timeEntries });
				});
		}

		onViewCommissionsPage() {
				this.loadCommissions();
				this.setState({ viewCommissions: true });
		}

		onViewDetailPage() {
				this.setState({ viewCommissions: false });
		}

		getCommissionsPage() {
				const { timeEntries, filterStartDate, filterEndDate } = this.state;

				const getMember = (item) => {
						const { firstName, middleName, lastName } = item.member;
						return `${firstName} ${middleName ? middleName + " " : ""}${lastName}`;
				};

				const getAvailedProduct = (item) => {
						if (item.programAvailment) {
								return `${item.programAvailment.availedProgram.name} (Program)`;
						} else if (item.packageAvailment) {
								return `${item.packageAvailment.availedPackage.name} (Package)`;
						}
				};

				const renderRow = (item, index) => {
						return <tr key={item.id}>
								<td>{item.date}</td>
								<td>{getMember(item)}</td>
								<td>{getAvailedProduct(item)}</td>
								<td>{Formatter.formatAmount(item.commission)}</td>
						</tr>;
				};

				let timeEntriesComponent = <p>No data, try adjusting start date and end date filter.</p>;

				if (timeEntries && timeEntries.length) {
						let totalCommissions = 0;
						timeEntries.forEach(item => {
								if (item.commission) {
										totalCommissions += item.commission;
								}
						});

						timeEntriesComponent = <div>
								<table className="ui orange small table">
										<thead>
												<tr>
														<th>Date</th>
														<th>Member</th>
														<th>Availed Program/Package</th>
														<th>Commission</th>
												</tr>
										</thead>
										<tbody>
												{timeEntries.map(renderRow)}
										</tbody>

										<tfoot className="full-width footer-total">
												<tr>
														<th colSpan="4">
																<div className="ui blue basic label">
																		<i className="check icon"></i> Total Commissions: {Formatter.formatAmount(totalCommissions)}
																</div>
														</th>
												</tr>
										</tfoot>
								</table>
						</div>;
				}

				return <div>
						<div className="ui label clickable padbot" onClick={() => this.onViewDetailPage()}>
								<i className="angle left icon"></i> Back
						</div>

						<div>
								<h4>Commissions</h4>
								<div className="ui filter form">
										<div className="fields">
												<Input ref={(input) => {this.initialInput = input}} autoFocus="true"
														name="filterStartDate" inlineLabel="Start Date" value={filterStartDate}
														onChange={super.onChange.bind(this)} placeholder="MM/dd/yyyy"
														fieldClassName="five" inputClassName="mini" />

												<Input name="filterEndDate" inlineLabel="End Date" value={filterEndDate}
														onChange={super.onChange.bind(this)} placeholder="MM/dd/yyyy"
														fieldClassName="five" inputClassName="mini" />

												<Button className="ui mini orange button" icon="search" onClick={() => this.loadCommissions()}>Filter</Button>
										</div>
								</div>

								{timeEntriesComponent}
						</div>
				</div>;
		}

		getDetailPage() {
				let { value, updateMode } = this.state;
				return <div>
						<div className="ui form">
								<div className="three fields">
										<Input ref={(input) => {this.initialInput = input}} autoFocus="true"
												name="firstName" label="First Name" value={value.firstName} disabled={!updateMode}
												onChange={super.onChange.bind(this)} />

										<Input name="middleName" label="Middle Name" value={value.middleName} disabled={!updateMode}
												onChange={super.onChange.bind(this)} />

										<Input name="lastName" label="Last Name" value={value.lastName} disabled={!updateMode}
												onChange={super.onChange.bind(this)} />
								</div>

								<div className="fields">
										<Input name="contactNo" label="Contact No." value={value.contactNo} disabled={!updateMode}
												onChange={super.onChange.bind(this)}
												fieldClassName="eleven" />

										<Dropdown name="gender" label="Gender" value={value.gender} disabled={!updateMode}
												options={GENDERS} onChange={this.onGenderChange.bind(this)}
												fieldClassName="five" />
								</div>

								<div className="fields">
										<Input name="email" label="Email" value={value.email} disabled={!updateMode}
												onChange={super.onChange.bind(this)}
												fieldClassName="eleven" />

										<Input name="birthDate" label="Birth Date" value={value.birthDate} disabled={!updateMode}
												onChange={super.onChange.bind(this)} placeholder="MM/dd/yyyy"
												fieldClassName="five" />
								</div>

								<div className="fields">
										<Textarea name="address" label="Address" value={value.address} disabled={!updateMode}
												onChange={super.onChange.bind(this)}
												fieldClassName="eleven" />
								</div>
						</div>

						<div>
								<Audit value={value} />
								{super.getActions()}
						</div>
				</div>;
		}

		render() {
				let { value, updateMode, viewCommissions } = this.state;
				const showOtherPanels = !updateMode && value && value.id;

				const viewCommissionsAction = <div className="ui orange label clickable padbot" onClick={() => this.onViewCommissionsPage()}>
						<i className="eye icon"></i> View Commissions
				</div>;

		    return <div>
						{showOtherPanels && !viewCommissions ? viewCommissionsAction : undefined}
						{showOtherPanels && viewCommissions ? this.getCommissionsPage() : this.getDetailPage()}
		    </div>
		}
}

export default Coaches;
