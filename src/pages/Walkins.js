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
import Formatter from '../core/Formatter'
import Provider from '../core/Provider'
import Fetch from '../core/Fetch'


class Members extends ListView {

		constructor(props) {
		    super(props);
        this.endpoint = "member/";
				this.orderBy = "firstName";
				this.extraParameters = { type: "WALKIN" };

				this.state.enrollingProgram = false;
				this.state.enrollingPackage = false;
		}

		componentDidMount() {
				super.componentDidMount();
				Provider.loadPrograms((programs) => this.setState({programs}));
		}

		getInformationPage() {
				let { selectedItem, availedPrograms } = this.state;
				return <Member value={selectedItem}
						availedPrograms={availedPrograms}
						onEnrollProgram={() => this.onEnrollProgram()}
						onEnrollPackage={() => this.onEnrollPackage()}
						onFetch={this.onFetch} />;
		}

		getCancelMemberAction() {
				return <div className="ui label clickable" onClick={() => this.onCancelMemberAction()}>
						<i className="angle left icon"></i> Back
				</div>;
		}

		onProgramChange(program) {
				let { programs, programAvailment } = this.state;
		    programAvailment = programAvailment || {};

				if (programs) {
						programAvailment.availedProgram = programs.find(item => item.id === program.value);
				}
		    this.setState({ programAvailment });
		}

		onSaveProgramAvailment() {
				Fetch.post("program/availment/", this.state.programAvailment, () => {
						this.setState({ enrollingProgram: false });
						this.onFetch();
				});
		}

		getEnrollProgramPage() {
				let { programs, programAvailment } = this.state;
				let program = programAvailment.availedProgram || {};

				let programOptions = [];

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
								<div className="fields">
										<Dropdown name="program" label="Program" value={program.id}
												options={programOptions} onChange={this.onProgramChange.bind(this)}
												fieldClassName="eight" />

										<Input name="programAvailment.date" label="Date" value={programAvailment.date}
												onChange={super.onChange.bind(this)} placeholder="MM/dd/yyyy"
												fieldClassName="eight" />
								</div>

								<div className="fields">
										<Input name="price" label="Walk-in Price" value={Formatter.formatAmount(program.guestPrice)}
												disabled={true} fieldClassName="eight" />
								</div>
						</div>

						<div className="actions">
								<Button className="ui green button" icon="save" onClick={() => this.onSaveProgramAvailment()}>Save</Button>
								<Button className="ui button" icon="ban" onClick={() => this.onCancelMemberAction()}>Cancel</Button>
		        </div>
				</div>;
		}

		onCancelMemberAction() {
				this.setState({
						enrollingProgram: false
				});
		}

		onEnrollProgram() {
				const { selectedItem } = this.state;
				const programAvailment = {
						member: selectedItem,
						date: new Date().toLocaleDateString(),
						type: "GUEST"
				};
				this.setState({ programAvailment, enrollingProgram: true });
		}

		getDetailPage() {
				let { enrollingProgram, enrollingPackage, addingAccessCard } = this.state;

				let detailComponent = this.getInformationPage();
				if (enrollingProgram) {
						detailComponent = this.getEnrollProgramPage();
				}
				return detailComponent;
		}

		onItemClick(index) {
        super.onItemClick(index);

				if (this.state.items) {
						let item = this.state.items[index];
						Fetch.get(`program/availment/${item.id}`, undefined, (availedPrograms) => {
								this.setState({ availedPrograms })
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
				value.type = "WALKIN";
				return value;
		}

		onGenderChange(gender) {
		    let nextState = this.state.value || {};
		    nextState.gender = gender.value;
		    this.setState(nextState);
		}

		getEnrollments() {
				const { onEnrollProgram, onEnrollPackage, availedPrograms } = this.props;

				const addComponent = <Button className="ui green basic button" icon="rocket"
						onClick={() => onEnrollProgram()}>
						Avail Program
				</Button>;

				let viewComponent = undefined;
				if (availedPrograms && availedPrograms.length) {
						viewComponent = <div>
								<br />
								{availedPrograms.map(item => <div key={item.id} className="ui label">
										{item.availedProgram.name}
										<div className="detail">{item.date}</div>
								</div>)}
						</div>;
				}

				return <div>
						<div className="clearfix" /> <br />
						<div className="ui horizontal divider">Availed Programs</div> <br />

						{addComponent} <br />
						{viewComponent}
				</div>;
		}

		render() {
				const { value, updateMode } = this.state;
				const showOtherPanels = !updateMode && value && value.id;

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
