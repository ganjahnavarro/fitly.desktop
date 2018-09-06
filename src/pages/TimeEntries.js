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

const ENTER_KEY_CODE = 13;
const ESCAPE_KEY_CODE = 27;

class TimeEntries extends View {

    constructor(props) {
        super(props);
        this.state.isAdding = false;
    }

    onAdd() {
        this.setState({ isAdding: true });
    }

    onCancelAdd() {
        this.setState({ isAdding: false, accessCardNoUsed: undefined });
    }

    componentDidMount() {
        this.onFetch();
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
            this.onCancelAdd();
            this.onFetch();
        });
    }

    getAddComponent() {
        const { accessCardNoUsed } = this.state;
        return <div className="basic-overlay">
            <div className="ui label clickable close" onClick={() => this.onCancelAdd()}>Close</div>

            <div className="content">
                <img src="resources/images/icon_access_card.png" className="ui image" />

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
        const { isAdding, items } = this.state;

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
										</tr>
								</thead>
								<tbody>
                    {items.map(renderRow)}
								</tbody>
						</table>;
				}

				return <div className="time-entry">
						<Header location={this.props.location} />
            <div className="ui orange label clickable" onClick={() => this.onAdd()}>
								<i className="plus icon"></i> Add Time Entry
						</div>

            {itemsComponent}
            {isAdding ? this.getAddComponent() : undefined}
				</div>;
		}
}

export default TimeEntries;
