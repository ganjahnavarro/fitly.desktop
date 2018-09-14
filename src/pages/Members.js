import React from 'react'

import View from './abstract/View'
import ListView from './abstract/ListView'
import DetailView from './abstract/DetailView'

import Input from '../components/Input'
import Audit from '../components/Audit'
import Header from '../components/Header'
import Button from '../components/Button'
import Dropdown from '../components/Dropdown'
import Textarea from '../components/Textarea'

import DeleteAction from '../components/DeleteAction'

import { GENDERS, MEMBER_AVAILMENT_TYPES, getAvailmentTypeLabel } from '../core/Constants'
import Formatter from '../core/Formatter'
import Provider from '../core/Provider'
import Fetch from '../core/Fetch'

const MENU_PERSONAL = "Personal";
const MENU_ENROLLMENTS = "Packages/Programs";
const MENU_MEMBERSHIP = "Membership";

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
				let { selectedItem, memberships, availedPrograms, availedPackages, coaches } = this.state;
				return <Member value={selectedItem} memberships={memberships} coaches={coaches}
						availedPrograms={availedPrograms} availedPackages={availedPackages}
						loadProgramAvailments={() => this.loadProgramAvailments()}
						loadPackageAvailments={() => this.loadPackageAvailments()}
						loadMemberships={() => this.loadMemberships()}
						onEnrollProgram={() => this.onEnrollProgram()}
						onEnrollPackage={() => this.onEnrollPackage()}
						onAddAccessCard={(membership) => this.onAddAccessCard(membership)}
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
						const { membership } = this.state;
						Fetch.patch("membership/", membership,
								() => {
										this.onFetch();
										this.setState({ addingAccessCard: false });
								},
								() => {
										membership.accessCardNo = undefined
										this.setState({ addingAccessCard: false, membership });
								}
						);
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

		onAddAccessCard(membership) {
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

				if (this.state.items && this.state.items.length) {
						let item = this.state.items[index];
						this.loadMemberships(item.id);
						this.loadProgramAvailments(item.id);
						this.loadPackageAvailments(item.id);
				}
		}

		loadMemberships(memberId) {
				memberId = memberId || this.state.selectedItem.id;
				Fetch.get(`membership/member/${memberId}`, undefined, (memberships) => {
						console.warn("memberships", memberships);
						this.setState({ memberships });
				});
		}

		loadProgramAvailments(memberId) {
				memberId = memberId || this.state.selectedItem.id;
				Fetch.get(`program/availment/${memberId}/all`, undefined, (availedPrograms) => {
						this.setState({ availedPrograms });
				});
		}

		loadPackageAvailments(memberId) {
				memberId = memberId || this.state.selectedItem.id;
				Fetch.get(`package/availment/${memberId}/all`, undefined, (availedPackages) => {
						this.setState({ availedPackages });
				});
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

		getMenu() {
				const menus = [MENU_PERSONAL, MENU_ENROLLMENTS, MENU_MEMBERSHIP];

				let { selectedMenu } = this.state;
				selectedMenu = selectedMenu || menus[0];

				const onSelectMenu = (selectedMenu) => this.setState({ selectedMenu });

				const renderItem = (item) => {
						const className = `${item === selectedMenu ? "active " : ""}item`;
						return <a key={item} className={className} onClick={() => onSelectMenu(item)}>
								{item}
						</a>
				};

				return <div className="ui tabular mini menu">
						{menus.map(renderItem)}
				</div>;
		}

		onPromoChange(rowIndex, selected) {
        const { memberships } = this.props;

        const promos = Provider.filteredItems.promos;
        const promo = promos.find((promo) => promo.id == selected.value);

        memberships[rowIndex].promo = promo;

        Fetch.patch("membership/", memberships[rowIndex], (membership) => {
						memberships[rowIndex] = membership;
            this.setState({ memberships });
        });
		}

		getMemberships() {
				const { onEnrollProgram, memberships, onAddAccessCard, loadMemberships } = this.props;
				const renderRow = (item, index) => {
						const addAccessCardComponent = <div className="ui orange label clickable" onClick={() => onAddAccessCard(item)}>
								<i className="plus icon"></i> Add Access Card
						</div>;

						/*
						<td	className="tbl-actions">
								<DeleteAction id={item.id} path="membership/" postAction={loadMemberships} />
						</td>
						*/

						return <tr key={item.id}>
								<td>{item.startDate}</td>
								<td>{item.endDate}</td>
								<td>{item.accessCardNo || addAccessCardComponent}</td>
								<td>
                    <Dropdown value={item.promo ? item.promo.id : null}
                        onChange={(selected) => this.onPromoChange(index, selected)}
                        loadOptions={Provider.getPromos} />
                </td>
								<td>{Formatter.formatAmount(item.discountedAmount)}</td>
						</tr>;
				};

				let membershipsComponent = null;
				if (memberships && memberships.length) {
						membershipsComponent = <table className="ui orange small table">
								<thead>
										<tr>
												<th>Start Date</th>
												<th>End Date</th>
												<th>Access Card</th>
												<th width="180">Promo Code</th>
												<th>Amount</th>
										</tr>
								</thead>
								<tbody>
										{memberships.map(renderRow)}
								</tbody>
						</table>;
				}

				/*
				<Button className="ui orange basic button" icon="user plus"
						onClick={() => onEnrollProgram()}>
						Add Membership
				</Button>
				*/
				return membershipsComponent;
		}

		getEnrollments() {
				const { onEnrollProgram, onEnrollPackage, availedPrograms, availedPackages,
				 		loadProgramAvailments, loadPackageAvailments } = this.props;

				const renderAvailedProgramRow = (item) => {
						return <tr key={item.id}>
								<td>{item.startDate}</td>
								<td>{item.availedProgram.name}</td>
								<td>{getAvailmentTypeLabel(item.type)}</td>
								<td>{Formatter.formatAmount(item.price)}</td>
								<td	className="tbl-actions">
										<DeleteAction id={item.id} path="program/availment/" postAction={loadProgramAvailments} />
								</td>
						</tr>;
				};

				const renderAvailedPackageRow = (item) => {
						return <tr key={item.id}>
								<td>{item.startDate}</td>
								<td>{item.endDate}</td>
								<td>{item.availedPackage.name}</td>
								<td>{item.sessionsCount}</td>
								<td>{item.sessionsRemaining}</td>
								<td>{Formatter.formatAmount(item.price)}</td>
								<td	className="tbl-actions">
										<DeleteAction id={item.id} path="package/availment/" postAction={loadPackageAvailments} />
								</td>
						</tr>;
				};

				let availedProgramsComponent = null;
				if (availedPrograms && availedPrograms.length) {
						availedProgramsComponent = <table className="ui green small table">
								<thead>
										<tr>
												<th>Date</th>
												<th>Program</th>
												<th>Availment Type</th>
												<th>Price</th>
												<th></th>
										</tr>
								</thead>
								<tbody>
										{availedPrograms.map(renderAvailedProgramRow)}
								</tbody>
						</table>;
				}

				let availedPackagesComponent = null;
				if (availedPackages && availedPackages.length) {
						const memberId = this.state.value.id;
						availedPackagesComponent = <table className="ui blue small table">
								<thead>
										<tr>
												<th>Start Date</th>
												<th>End Date</th>
												<th>Package</th>
												<th>No. of Sessions</th>
												<th>Remaining Sessions</th>
												<th>Price</th>
												<th></th>
										</tr>
								</thead>
								<tbody>
										{availedPackages.map(renderAvailedPackageRow)}
								</tbody>
						</table>;
				}

				return <div>
						<div>
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

						<div>
								{availedProgramsComponent}
								{availedPackagesComponent}
						</div>
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

		getPersonalInformation() {
				const { value, updateMode } = this.state;

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
				</div>;
		}

		render() {
				const { value, updateMode, selectedMenu } = this.state;
				const showOtherPanels = !updateMode && value && value.id;

				// {this.getPersonalInformation()}
				// {showOtherPanels  ? this.getEnrollments() : undefined}

				let component = this.getPersonalInformation();
				if (selectedMenu === MENU_ENROLLMENTS) {
						component = this.getEnrollments();
				} else if (selectedMenu === MENU_MEMBERSHIP) {
						component = this.getMemberships();
				}

		    return <div>
						{showOtherPanels ? this.getMenu() : undefined}
						{component}
						<br />
				</div>
		}
}

export default Members;
