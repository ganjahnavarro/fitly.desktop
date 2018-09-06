import React from 'react'
import { hashHistory } from 'react-router'
import View from './abstract/View'

import Fetch from '../core/Fetch'
import Alert from '../core/Alert'

import Input from '../components/Input'
import Button from '../components/Button'
import Header from '../components/Header'

class TimeEntries extends View {

    constructor(props) {
        super(props);
        this.state.isAdding = false;
    }

    onAdd() {
        this.setState({ isAdding: true });
    }

    onCancelAdd() {
        this.setState({ isAdding: false });
    }

    componentDidUpdate() {
        console.warn("componentDidUpdate", this.overlay);
        if (this.overlay) {
            this.overlay.focus();
        }
    }

    onOverlayKeydown(e) {
        const ENTER_KEY_CODE = 13;
        const ESCAPE_KEY_CODE = 27;

				if (e.keyCode === ENTER_KEY_CODE) {

				} else if (e.keyCode === ESCAPE_KEY_CODE) {
						this.onCancelAdd();
				}
        console.warn(e.keyCode, e);
		}

    getAddComponent() {
        return <div ref={(overlay) => {this.overlay = overlay}}
            className="basic-overlay" tabIndex={-1} onKeyDown={(e) => this.onOverlayKeydown(e)}>
            <div className="ui label clickable close" onClick={() => this.onCancelAdd()}>Close</div>

            <div className="content">
                <img src="resources/images/icon_access_card.png" className="ui image" />
                <div className="ui blue label">
                    <i className="barcode icon"></i> Please scan access card using RFID reader.
                </div>
            </div>
        </div>;
    }

		render() {
        const { isAdding } = this.state;

				return <div className="time-entry">
						<Header location={this.props.location} />
            <div className="ui orange label clickable" onClick={() => this.onAdd()}>
								<i className="plus icon"></i> Add Time Entry
						</div>
            {isAdding ? this.getAddComponent() : undefined}
				</div>;
		}
}

export default TimeEntries;
