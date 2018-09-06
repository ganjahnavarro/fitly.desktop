import React from 'react'
import { Link } from 'react-router'

import View from './abstract/View'
import ListView from './abstract/ListView'
import DetailView from './abstract/DetailView'

import Input from '../components/Input'
import Audit from '../components/Audit'
import Header from '../components/Header'
import Button from '../components/Button'
import Dropdown from '../components/Dropdown'
import Textarea from '../components/Textarea'

import { GENDERS, MEMBER_AVAILMENT_TYPES, getAvailmentTypeLabel } from '../core/Constants'
import Formatter from '../core/Formatter'
import Provider from '../core/Provider'
import Fetch from '../core/Fetch'


class Members extends ListView {

		constructor(props) {
		    super(props);
        this.endpoint = "member/";
				this.orderBy = "firstName";
				this.extraParameters = { type: "REGULAR" };

				this.state.enrollingProgram = false;
				this.state.enrollingPackage = false;
				this.state.addingAccessCard = false;
				this.state.memberAvailmentTypes = MEMBER_AVAILMENT_TYPES;
		}

		componentDidMount() {
				super.componentDidMount();

				Provider.loadPrograms((programs) => this.setState({ programs }));
				Provider.loadPackages((packages) => this.setState({ packages }));
				Provider.loadCoaches((coaches) => this.setState({ coaches }));
		}

		getInformationPage() {
				let { selectedItem, membership, availedPrograms, availedPackages, coaches } = this.state;
				return <Member value={selectedItem} membership={membership} coaches={coaches}
						availedPrograms={availedPrograms} availedPackages={availedPackages}
						onEnrollProgram={() => this.onEnrollProgram()}
						onEnrollPackage={() => this.onEnrollPackage()}
						onAddAccessCard={() => this.onAddAccessCard()}
						onFetch={this.onFetch} />;
		}

		getCancelMemberAction() {
				return <div className="ui label clickable" onClick={() => this.onCancelMemberAction()}>
						<i className="angle left icon"></i> Back
				</div>;
		}

		onPackageChange(pkg) {
				let { packages, packageAvailment } = this.state;
		    packageAvailment = packageAvailment || {};

				if (packages) {
						packageAvailment.availedPackage = packages.find(item => item.id === pkg.value);
				}
		    this.setState({ packageAvailment });
		}

		onProgramChange(program) {
				let { programs, programAvailment } = this.state;
		    programAvailment = programAvailment || {};

				if (programs) {
						const selectedProgram = programs.find(item => item.id === program.value);
						programAvailment.availedProgram = selectedProgram;

						programAvailment.type = programAvailment.type === "UNLIMITED" && !selectedProgram.monthlyPrice ?
								"REGULAR" : programAvailment.type;
						programAvailment.type = programAvailment.type === "REGULAR_WITH_COACH" && !selectedProgram.coachPrice ?
								"REGULAR" : programAvailment.type;

						const regularAvailmentType = MEMBER_AVAILMENT_TYPES.find(item => item.value === "REGULAR");
						const withCoachAvailmentType = MEMBER_AVAILMENT_TYPES.find(item => item.value === "REGULAR_WITH_COACH");
						const monthlyAvailmentType = MEMBER_AVAILMENT_TYPES.find(item => item.value === "UNLIMITED");

						let memberAvailmentTypes = [regularAvailmentType];
						memberAvailmentTypes = selectedProgram.monthlyPrice ? [...memberAvailmentTypes, monthlyAvailmentType] : memberAvailmentTypes;
						memberAvailmentTypes = selectedProgram.coachPrice ? [...memberAvailmentTypes, withCoachAvailmentType] : memberAvailmentTypes;

						this.setState({ memberAvailmentTypes });
				}
		    this.setState({ programAvailment });
		}

		onSavePackageAvailment() {
				Fetch.post("package/availment/", this.state.packageAvailment, () => {
						this.setState({ enrollingPackage: false });
						this.onFetch();
				});
		}

		onSaveProgramAvailment() {
				Fetch.post("program/availment/", this.state.programAvailment, () => {
						this.setState({ enrollingProgram: false });
						this.onFetch();
				});
		}

		onSubmit(e) {
				if (e.keyCode === 13) {
						Fetch.patch("membership/", this.state.membership, () => {
								this.setState({ addingAccessCard: false });
								this.onFetch();
						});
				}
		}

		getAddAccessCardPage() {
				let { membership } = this.state;
				return <div>
						{this.getCancelMemberAction()}

						<h4 className="ui center aligned icon header">
								<img src={"resources/images/icon_access_card.png"} className="ui circular image" />
								Add Access Card
						</h4>

						<div className="ui form">
								<Input ref={(input) => {this.initialInput = input}} autoFocus="true"
										name="membership.accessCardNo" label="Access Card No."
										value={membership.accessCardNo} onChange={super.onChange.bind(this)}
										onKeyDown={(e) => this.onSubmit(e)} />

								<div className="ui basic blue label">
										<i className="barcode icon"></i> Scan access card using RFID reader or manually type and then press enter
								</div>
						</div>
				</div>;
		}

		onAvailmentTypeChange(availmentType) {
				let { programAvailment } = this.state;
				programAvailment = programAvailment || {};
				programAvailment.type = availmentType.value;
		    this.setState({ programAvailment });
		}

		getEnrollProgramPage() {
				let { programs, programAvailment, memberAvailmentTypes } = this.state;
				let program = programAvailment.availedProgram || {};

				let programOptions = [];

				if (programs) {
						programOptions = programs.map((item, index) => {
								return { value: item.id, label: item.name };
						});
				}

				const price = programAvailment.type === "REGULAR" ? program.memberPrice : program.monthlyPrice;
				const allowTypeSelection = memberAvailmentTypes && memberAvailmentTypes.length > 1;

				return <div>
						{this.getCancelMemberAction()}

						<h4 className="ui center aligned icon header">
								<img src={"resources/images/icon_programs.png"} className="ui circular image" />
								Program Enrollment
						</h4>

						<div className="ui form">
								<div className="fields">
										<Dropdown name="program" label="Program" value={program.id}
												options={programOptions} onChange={this.onProgramChange.bind(this)}
												fieldClassName="eight" />

										<Input name="programAvailment.startDate" label="Start Date" value={programAvailment.startDate}
												onChange={super.onChange.bind(this)} placeholder="MM/dd/yyyy"
												fieldClassName="eight" />
								</div>

								<div className="fields">
										<Dropdown name="programAvailment.type" label="Type" value={programAvailment.type}
												options={memberAvailmentTypes} onChange={this.onAvailmentTypeChange.bind(this)}
												disabled={!allowTypeSelection} fieldClassName="eight" />

										<Input name="price" label="Price" value={Formatter.formatAmount(price)}
												disabled={true} fieldClassName="eight" />
								</div>
						</div>

						<div className="actions">
								<Button className="ui green button" icon="save" onClick={() => this.onSaveProgramAvailment()}>Save</Button>
								<Button className="ui button" icon="ban" onClick={() => this.onCancelMemberAction()}>Cancel</Button>
		        </div>
				</div>;
		}

		getEnrollPackagePage() {
				let { packages, packageAvailment } = this.state;
				let availedPackage = packageAvailment.availedPackage || {};

				let packageOptions = [];

				if (packages) {
						packageOptions = packages.map((item, index) => {
								return { value: item.id, label: item.name };
						});
				}

				return <div>
						{this.getCancelMemberAction()}

						<h4 className="ui center aligned icon header">
								<img src={"resources/images/icon_packages.png"} className="ui circular image" />
								Package Enrollment
						</h4>

						<div className="ui form">
								<div className="fields">
										<Dropdown name="package" label="Package" value={availedPackage.id}
												options={packageOptions} onChange={this.onPackageChange.bind(this)}
												fieldClassName="eight" />

										<Input name="packageAvailment.startDate" label="Start Date" value={packageAvailment.startDate}
												onChange={super.onChange.bind(this)} placeholder="MM/dd/yyyy"
												fieldClassName="eight" />
								</div>

								<div className="fields">
										<Input name="price" label="Price" value={Formatter.formatAmount(availedPackage.price)}
												disabled={true} fieldClassName="eight" />
								</div>
						</div>

						<div className="actions">
								<Button className="ui green button" icon="save" onClick={() => this.onSavePackageAvailment()}>Save</Button>
								<Button className="ui button" icon="ban" onClick={() => this.onCancelMemberAction()}>Cancel</Button>
						</div>
				</div>;
		}

		onCancelMemberAction() {
				this.setState({
						enrollingProgram: false,
						enrollingPackage: false,
						addingAccessCard: false,
				});
		}

		onAddAccessCard() {
				const membership = this.state.membership;
				membership.accessCardNo = undefined;
				this.setState({ membership, addingAccessCard: true });
		}

		onEnrollProgram() {
				const { selectedItem } = this.state;
				const programAvailment = {
						member: selectedItem,
						date: new Date().toLocaleDateString(),
						type: "REGULAR"
				};
				this.setState({ programAvailment, enrollingProgram: true });
		}

		onEnrollPackage() {
				const { selectedItem } = this.state;
				const packageAvailment = {
						member: selectedItem,
						date: new Date().toLocaleDateString(),
				};
				this.setState({ packageAvailment, enrollingPackage: true });
		}

		getDetailPage() {
				let { enrollingProgram, enrollingPackage, addingAccessCard } = this.state;

				let detailComponent = this.getInformationPage();
				if (enrollingProgram) {
						detailComponent = this.getEnrollProgramPage();
				} else if (enrollingPackage) {
						detailComponent = this.getEnrollPackagePage();
				} else if (addingAccessCard) {
						detailComponent = this.getAddAccessCardPage();
				}
				return detailComponent;
		}

		onItemClick(index) {
        super.onItemClick(index);

				if (this.state.items) {
						let item = this.state.items[index];

						Fetch.get(`membership/member/${item.id}`, undefined, (membership) => {
								this.setState({ membership });
						});

						Fetch.get(`program/availment/${item.id}`, undefined, (availedPrograms) => {
								this.setState({ availedPrograms })
						});

						Fetch.get(`package/availment/${item.id}`, undefined, (availedPackages) => {
								this.setState({ availedPackages })
						});
				}
		}

		render() {
				let items = [];
				let { selectedIndex } = this.state;

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
										{this.getDetailPage()}
								</div>
				    </div>
				</div>;
		}
}

class Member extends DetailView {

		constructor(props) {
		    super(props);
        this.endpoint = "member/";
    }

		getRequestValue() {
				const { value } = this.state;
				value.type = "REGULAR";
				return value;
		}

		onGenderChange(gender) {
		    let nextState = this.state.value || {};
		    nextState.gender = gender.value;
		    this.setState(nextState);
		}

		getMembership() {
				const { onAddAccessCard, membership } = this.props;

				if (membership) {
						const renderMembershipInfo = (label, value, icon) => <div className="ui basic orange label"
								data-variation="mini" data-inverted="" data-tooltip={label} data-position="bottom left">
								<i className={`${icon} icon`}></i> {value}
						</div>;

						const viewAccessCardComponent = renderMembershipInfo("Access Card No.", membership.accessCardNo, "barcode");
						const addAccessCardComponent = <div className="ui orange label clickable" onClick={() => onAddAccessCard()}>
								<i className="plus icon"></i> Add Access Card
						</div>;

						return <div className="membership">
								{renderMembershipInfo("Member Since", membership.startDate, "calendar")}
								{renderMembershipInfo("Membership Expiry", membership.endDate, "ban")}
								{membership.accessCardNo ? viewAccessCardComponent : addAccessCardComponent}
								<div className="clearfix" /> <br />
						</div>;
				}
				return undefined;
		}

		getEnrollments() {
				const { onEnrollProgram, onEnrollPackage, availedPrograms, availedPackages } = this.props;

				let availedProgramsComponent = null;
				if (availedPrograms) {
						availedProgramsComponent = <table className="ui green small table">
								<thead>
										<tr>
												<th>Date</th>
												<th>Program</th>
												<th>Availment Type</th>
												<th>Price</th>
										</tr>
								</thead>
								<tbody>
										{availedPrograms.map(item => <tr key={item.id}>
												<td>{item.startDate}</td>
												<td>{item.availedProgram.name}</td>
												<td>{getAvailmentTypeLabel(item.type)}</td>
												<td>{Formatter.formatAmount(item.price)}</td>
										</tr>)}
								</tbody>
						</table>;
				}

				let availedPackagesComponent = null;
				if (availedPackages) {
						availedPackagesComponent = <table className="ui blue small table">
								<thead>
										<tr>
												<th>Start Date</th>
												<th>End Date</th>
												<th>Package</th>
												<th>No. of Sessions</th>
												<th>Remaining Sessions</th>
												<th>Price</th>
										</tr>
								</thead>
								<tbody>
										{availedPackages.map(item => <tr key={item.id}>
												<td>{item.startDate}</td>
												<td>{item.endDate}</td>
												<td>{item.availedPackage.name}</td>
												<td>{item.sessionsCount}</td>
												<td>{item.sessionsRemaining}</td>
												<td>{Formatter.formatAmount(item.price)}</td>
										</tr>)}
								</tbody>
						</table>;
				}

				let viewComponent = <div>
						{availedProgramsComponent}
						{availedPackagesComponent}
				</div>;

				return <div>
						<div className="clearfix" /> <br />
						<div className="ui horizontal divider">Enrolled Program/Packages</div>

						<div>
								<br />
								<Button className="ui green basic button" icon="rocket"
										onClick={() => onEnrollProgram()}>
										Enroll to a Program
								</Button>
								<Button className="ui blue basic button" icon="tag"
										onClick={() => onEnrollPackage()}>
										Enroll to a Package
								</Button>
						</div>
						<br />

						{viewComponent}
				</div>;
		}

		onDefaultCoachChange(coach) {
				let { coaches } = this.props;
				let { value } = this.state;

				if (coaches) {
						const selectedCoach = coaches.find(item => item.id === coach.value);
						value.defaultCoach = selectedCoach;
				}
		    this.setState({ value });
		}

		render() {
				const { value, updateMode } = this.state;
				const showOtherPanels = !updateMode && value && value.id;

				let { coaches } = this.props;
				let coachOptions = [];
				let defaultCoach = value.defaultCoach || {};

				if (coaches) {
						coachOptions = coaches.map((item, index) => {
								const { firstName, middleName, lastName } = item;
								const name = `${firstName} ${middleName ? middleName + " " : ""}${lastName}`;
								return { value: item.id, label: name };
						});
				}

		    return <div>
						{showOtherPanels ? this.getMembership() : undefined}

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
												fieldClassName="six" />

										<Input name="birthDate" label="Birth Date" value={value.birthDate} disabled={!updateMode}
												onChange={super.onChange.bind(this)} placeholder="MM/dd/yyyy"
												fieldClassName="six" />

										<Dropdown name="gender" label="Gender" value={value.gender} disabled={!updateMode}
												options={GENDERS} onChange={this.onGenderChange.bind(this)}
												fieldClassName="four" />
								</div>

								<div className="fields">
										<Input name="email" label="Email" value={value.email} disabled={!updateMode}
												onChange={super.onChange.bind(this)}
												fieldClassName="eight" />

										<Input name="width" label="Width (kg)" value={value.width} disabled={!updateMode}
												onChange={super.onChange.bind(this)}
												fieldClassName="four" />

										<Input name="height" label="Height (cm)" value={value.height} disabled={!updateMode}
												onChange={super.onChange.bind(this)}
												fieldClassName="four" />
								</div>

								<div className="fields">
										<Textarea name="address" label="Address" value={value.address} disabled={!updateMode}
												onChange={super.onChange.bind(this)}
												fieldClassName="eleven" />

										<Dropdown name="defaultCoach" label="Default Coach" value={defaultCoach.id}
												options={coachOptions} onChange={this.onDefaultCoachChange.bind(this)} disabled={!updateMode}
												fieldClassName="eight" />
								</div>
						</div>

						<div>
								<Audit value={value} />
								{super.getActions()}
						</div>

						{showOtherPanels  ? this.getEnrollments() : undefined}
						<br />
				</div>
		}
}

export default Members;
