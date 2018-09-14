import React from 'react'
import { hashHistory } from 'react-router'
import View from './abstract/View'

import Fetch from '../core/Fetch'
import Alert from '../core/Alert'
import Formatter from '../core/Formatter'
import Provider from '../core/Provider'

import Input from '../components/Input'
import Button from '../components/Button'
import Header from '../components/Header'
import Dropdown from '../components/Dropdown'

import DeleteAction from '../components/DeleteAction'

const ENTER_KEY_CODE = 13;
const ESCAPE_KEY_CODE = 27;

class TimeEntries extends View {

    constructor(props) {
        super(props);
        this.state.isAdding = false;
    }

    onAdd() {
        this.setState({ isAdding: true, isManualAdd: false, value: {} });
    }

    onAddManually() {
        this.setState({ isAdding: true, isManualAdd: true, value: {} });
    }

    onCancelAdd() {
        this.setState({ isAdding: false, accessCardNoUsed: undefined, value: {} });
    }

    componentDidMount() {
        this.onFetch();

				Provider.loadCoaches((coaches) => this.setState({ coaches }));
        Provider.loadMembers((members) => this.setState({ members }));
    }

    onFetch(filterParameters) {
        let defaultParameters = {
            pageSize: 100,
            pageOffset: 0
        };

        let parameters = Object.assign({}, defaultParameters, filterParameters);

        Fetch.get("timeentry/", parameters, (items) => {
            this.setState({ items });
        });
    }

    onKeyDown(e) {
				if (e.keyCode === ENTER_KEY_CODE) {
						this.onSubmitTimeEntry();
				} else if (e.keyCode === ESCAPE_KEY_CODE) {
            this.onCancelAdd();
        }
		}

    onSubmitTimeEntry() {
        const { accessCardNoUsed } = this.state;
        const timeEntryData = { accessCardNoUsed };

        Fetch.post("timeentry/", timeEntryData, (response) => {
            this.onFetch();
        });

        this.onCancelAdd();
    }

    getAddComponent() {
        const { accessCardNoUsed } = this.state;
        return <div className="basic-overlay">
            <div className="ui label clickable close" onClick={() => this.onCancelAdd()}>Close</div>

            <div className="content">
                <img src="resources/images/icon_scan.png" className="ui image" />

                <div className="ui form">
                    <Input ref={(input) => {this.initialInput = input}} autoFocus="true"
    										name="accessCardNoUsed" label="Access Card No."
    										value={accessCardNoUsed} onChange={super.onChange.bind(this)}
    										onKeyDown={(e) => this.onKeyDown(e)} />

    								<div className="ui blue label">
    										<i className="barcode icon"></i> Scan access card using RFID reader or manually type and then press enter
    								</div>
                </div>
            </div>
        </div>;
    }

    getAddManuallyComponent() {
        let { value, coaches, members, selectedProductType,
            programAvailments, packageAvailments, hasPrograms, hasPackages } = this.state;
        value = value || {};

				let coachOptions = [];
				let coachAssigned = value.coachAssigned || {};

				if (coaches) {
						coachOptions = coaches.map((item, index) => {
								const { firstName, middleName, lastName } = item;
								const name = `${firstName} ${middleName ? middleName + " " : ""}${lastName}`;
								return { value: item.id, label: name };
						});
				}

        let memberOptions = [];
				let member = value.member || {};

				if (members) {
						memberOptions = members.map((item, index) => {
								const { firstName, middleName, lastName, type } = item;
                const typeDisplayed = type === "WALKIN" ? " (W)" : " (M)";
								const name = `${firstName} ${middleName ? middleName + " " : ""}${lastName}${typeDisplayed}`;
								return { value: item.id, label: name };
						});
				}

        let programAvailmentOptions = [];
				let programAvailment = value.programAvailment || {};

				if (programAvailments) {
						programAvailmentOptions = programAvailments.map((item, index) => {
								return { value: item.id, label: item.availedProgram.name };
						});
				}

        let packageAvailmentOptions = [];
				let packageAvailment = value.packageAvailment || {};

				if (packageAvailments) {
						packageAvailmentOptions = packageAvailments.map((item, index) => {
								return { value: item.id, label: item.availedPackage.name };
						});
				}

        const showProductSelection = hasPrograms && hasPackages;
        const productSelection = <div className="inline fields">
            <div className="field">
                <div className="ui radio checkbox" onClick={() => this.onSelectedProductTypeChange("PROGRAM")}>
                    <input type="radio" name="frequency" checked={selectedProductType === "PROGRAM" ? "checked" : undefined} />
                    <label htmlFor="frequency">Program</label>
                </div>
            </div>
            <div className="field">
                <div className="ui radio checkbox" onClick={() => this.onSelectedProductTypeChange("PACKAGE")}>
                    <input type="radio" name="frequency" checked={selectedProductType === "PACKAGE" ? "checked" : undefined} />
                    <label htmlFor="frequency">Package</label>
                </div>
            </div>
        </div>;

        let commission = null;
        let productComponent = <Input label="Program/Package" disabled={true} fieldClassName="eight" />;
        if (selectedProductType === "PROGRAM") {
            productComponent = <Dropdown name="program" label="Availed Programs" value={programAvailment.id}
                options={programAvailmentOptions} disabled={programAvailmentOptions.length <= 1}
                onChange={this.onProgramAvailmentChange.bind(this)}
                fieldClassName="eight" />;

            if (programAvailment.availedProgram) {
                commission = programAvailment.availedProgram.commission;
            }
        } else if (selectedProductType === "PACKAGE") {
            productComponent = <Dropdown name="package" label="Availed Packages" value={packageAvailment.id}
                options={packageAvailmentOptions} disabled={packageAvailmentOptions.length <= 1}
                onChange={this.onPackageAvailmentChange.bind(this)}
                fieldClassName="eight" />;

            if (packageAvailment.availedPackage) {
                commission = packageAvailment.availedPackage.commission;
            }
        }

        return <div>
						<div className="ui form">
                <div className="fields">
                    <Input ref={(input) => {this.initialInput = input}} autoFocus="true"
                        name="value.date" label="Date" value={value.date}
                        onChange={super.onChange.bind(this)} placeholder="MM/dd/yyyy"
                        fieldClassName="eight" />

                    <Dropdown name="member" label="Member" value={member.id}
                        options={memberOptions} onChange={this.onMemberChange.bind(this)}
                        fieldClassName="eight" />
                </div>

                {showProductSelection ? productSelection : undefined}

                <div className="fields">
                    {productComponent}

                    <Dropdown name="coachAssigned" label="Coach Assigned" value={coachAssigned.id}
												options={coachOptions} onChange={this.onCoachAssignedManualEntryChange.bind(this)}
												fieldClassName="eight" />
                </div>

                <div className="fields">
                    <Input name="commission" label="Commission" value={Formatter.formatAmount(commission)}
                        disabled={true} fieldClassName="eight" />
                </div>
						</div>

						<div className="actions">
                <Button className="ui green button" icon="save" onClick={() => this.onSaveManualTimeEntry()}>Save</Button>
                <Button className="ui button" icon="ban" onClick={() => this.onCancelAdd()}>Cancel</Button>
		        </div>
		    </div>;
    }

    onSelectedProductTypeChange(productType) {
        let { value, programAvailments, packageAvailments } = this.state;

        if (productType === "PROGRAM") {
            value.programAvailment = programAvailments[0];
            value.packageAvailment = undefined;
        } else {
            value.packageAvailment = packageAvailments[0];
            value.programAvailment = undefined;
        }

        this.setState({ selectedProductType: productType });
    }

    onMemberChange(member) {
        let { value, members } = this.state;
		    value = value || {};

				if (members) {
						value.member = members.find(item => item.id === member.value);
            const parameters = value.date ? { date: value.date } : {};
            this.loadAvailableProgramsForMember(value.member, parameters);
            this.loadAvailablePackagesForMember(value.member, parameters);
				}
		    this.setState({ value });
		}

    loadAvailableProgramsForMember(member, parameters) {
        Fetch.get(`program/availment/${member.id}/available`, parameters, (programAvailments) => {
            let { selectedProductType, value } = this.state;
            const hasPrograms = programAvailments && programAvailments.length;
            selectedProductType = hasPrograms ? "PROGRAM" : selectedProductType;

            if (hasPrograms) {
                value.programAvailment = programAvailments[0];
                value.commission = value.programAvailment.availedProgram.commission;
                value.packageAvailment = undefined;
            }

            this.setState({ programAvailments, selectedProductType, hasPrograms, value });
        });
    }

    loadAvailablePackagesForMember(member, parameters) {
        Fetch.get(`package/availment/${member.id}/available`, parameters, (packageAvailments) => {
            let { programAvailments, selectedProductType, value } = this.state;
            const hasPrograms = programAvailments && programAvailments.length;
            const hasPackages = packageAvailments && packageAvailments.length;
            selectedProductType = hasPackages && !hasPrograms ? "PACKAGE" : selectedProductType;

            if (hasPackages && !hasPrograms) {
                value.packageAvailment = packageAvailments[0];
                value.commission = value.packageAvailment.availedPackage.commission;
                value.programAvailment = undefined;
            }

            this.setState({ packageAvailments, selectedProductType, hasPackages, value });
        });
    }

    onProgramAvailmentChange(programAvailment) {
        let { value, programAvailments } = this.state;
		    value = value || {};

				if (programAvailment && programAvailments) {
						value.programAvailment = programAvailments.find(item => item.id === programAvailment.value);
            value.commission = value.programAvailment.availedProgram.commission;
            value.packageAvailment = undefined;
				}
		    this.setState({ value });
		}

    onPackageAvailmentChange(packageAvailment) {
        let { value, packageAvailments } = this.state;
		    value = value || {};

				if (packageAvailment && packageAvailments) {
						value.packageAvailment = packageAvailments.find(item => item.id === packageAvailment.value);
            value.commission = value.packageAvailment.availedPackage.commission;
            value.programAvailment = undefined;
				}
		    this.setState({ value });
		}

    onCoachAssignedManualEntryChange(coach) {
        let { value, coaches } = this.state;
		    value = value || {};

				if (coach && coaches) {
						value.coachAssigned = coaches.find(item => item.id === coach.value);
				}
		    this.setState({ value });
		}

    onSaveManualTimeEntry() {
        Fetch.post("timeentry/manually", this.state.value, () => {
						this.onFetch();
            this.onCancelAdd();
				});
    }

    onCoachAssignedChange(rowIndex, selected) {
        const { items } = this.state;

        const coaches = Provider.filteredItems.coaches;
        const coach = coaches.find((coach) => coach.id == selected.value);

        items[rowIndex].coachAssigned = coach;

        Fetch.patch("timeentry/", items[rowIndex], (response) => {
            this.setState({ items });
        });
		}

		render() {
        const { isAdding, isManualAdd, items } = this.state;

        const getMember = (item) => {
            const { firstName, middleName, lastName } = item.member;
            return `${firstName} ${middleName ? middleName + " " : ""}${lastName}`;
        };

        const getCoachedAssigned = (item) => {
            if (item.coachAssigned) {
                const { firstName, middleName, lastName } = item.coachAssigned;
                return `${firstName} ${middleName ? middleName + " " : ""}${lastName}`;
            }
            return "-";
        };

        const getAvailedProduct = (item) => {
            if (item.programAvailment) {
                return `${item.programAvailment.availedProgram.name} (Program)`;
            } else if (item.packageAvailment) {
                return `${item.packageAvailment.availedPackage.name} (Package)`;
            }
        };

        const loadTimeEntries = () => this.onFetch();
        const renderRow = (item, index) => {
            return <tr key={item.id}>
                <td>{item.date}</td>
                <td>{getMember(item)}</td>
                <td>{getAvailedProduct(item)}</td>
                <td>
                    <Dropdown value={item.coachAssigned ? item.coachAssigned.id : null}
                        onChange={(selected) => this.onCoachAssignedChange(index, selected)}
                        loadOptions={Provider.getCoaches} />
                </td>
                <td>{Formatter.formatAmount(item.commission)}</td>
                <td	className="tbl-actions">
                    <DeleteAction id={item.id} path="timeentry/" postAction={loadTimeEntries} />
                </td>
            </tr>;
        };

        let itemsComponent = null;
				if (items && items.length) {
            itemsComponent = <table className="ui orange small table">
								<thead>
										<tr>
												<th>Date</th>
												<th>Member</th>
												<th>Availed Program/Package</th>
												<th width="200">Coach</th>
												<th>Commission</th>
												<th></th>
										</tr>
								</thead>
								<tbody>
                    {items.map(renderRow)}
								</tbody>
						</table>;
				}

        const defaultActions = <div>
            <div className="ui orange label clickable" onClick={() => this.onAdd()}>
                <i className="plus icon"></i> Add Using Acess Card
            </div>

            <div className="ui yellow label clickable" onClick={() => this.onAddManually()}>
                <i className="plus icon"></i> Add Manually
            </div>
        </div>;

        const editingActions = <div>
            <div className="ui label clickable" onClick={() => this.onCancelAdd()}>
                <i className="angle left icon"></i> Back
            </div>
        </div>;

				return <div className="time-entry">
						<Header location={this.props.location} />

            {isAdding ? editingActions : defaultActions}
            <br />

            {isAdding && isManualAdd ? this.getAddManuallyComponent() : itemsComponent}
            {isAdding && !isManualAdd ? this.getAddComponent() : undefined}

            <br />
				</div>;
		}
}

export default TimeEntries;
