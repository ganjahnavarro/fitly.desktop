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

import { GENDERS } from '../core/Constants'
import Provider from '../core/Provider'
import Fetch from '../core/Fetch'


class Members extends ListView {

		constructor(props) {
		    super(props);
        this.endpoint = "member/";
				this.orderBy = "firstName";

				this.state.enrollingProgram = false;
				this.state.enrollingPackage = false;
				this.state.addingAccessCard = false;
		}

		componentDidMount() {
				super.componentDidMount();

				Provider.loadPrograms((programs) => this.setState({programs}));
				Provider.loadPackages((packages) => this.setState({packages}));
		}

		getInformationPage() {
				let { selectedItem, membership } = this.state;
				return <Member value={selectedItem} membership={membership}
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

		onProgramChange(program) {
		    let nextState = this.state.program || {};
		    nextState.program = { id: program.value };
		    this.setState(nextState);
		}

		onSubmit(e) {
				if (e.keyCode === 13) {
						console.warn("submitting", this.state.membership);
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
								<Input name="membership.accessCardNo" label="Access Card No."
										value={membership.accessCardNo} onChange={super.onChange.bind(this)}
										onKeyDown={(e) => this.onSubmit(e)} />
						</div>
				</div>;
		}

		getEnrollProgramPage() {
				let { program, programs } = this.state;

				let programOptions = [];
				let programId = program ? program.id : null;

				if (programs) {
						programOptions = programs.map((item, index) => {
								return { value: item.id, label: item.name };
						});
				}

				return <div>
						{this.getCancelMemberAction()}

						<h4 className="ui center aligned icon header">
								<img src={"resources/images/icon_programs.png"} className="ui circular image" />
								Program Enrollment
						</h4>

						<div className="ui form">
								<Dropdown name="program" label="Program" value={programId}
										options={programOptions} onChange={this.onProgramChange.bind(this)} />
						</div>
				</div>;
		}

		getEnrollPackagePage() {
				return <div>
						{this.getCancelMemberAction()}

						<h4 className="ui center aligned icon header">
								<img src={"resources/images/icon_packages.png"} className="ui circular image" /> <br />
								Package Enrollment
						</h4>

						<div className="ui form">
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
				this.setState({ program: {}, enrollingProgram: true });
		}

		onEnrollPackage() {
				this.setState({ package: {}, enrollingPackage: true });
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
				}
		}

		render() {
				let items = [];
				if (this.state.items) {
						items = this.state.items.map((item, index) => {
								const { firstName, middleName, lastName } = item;
								return <li key={index} onClick={this.onItemClick.bind(this, index)}>
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
						const addAccessCardComponent = <div className="ui orange label" onClick={() => onAddAccessCard()}>
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
				const { onEnrollProgram, onEnrollPackage } = this.props;
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
				</div>;
		}

		render() {
				const { value, updateMode } = this.state;
				const showOtherPanels = !updateMode && value && value.id;

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

						{showOtherPanels  ? this.getEnrollments() : undefined}
		    </div>
		}
}

export default Members;
