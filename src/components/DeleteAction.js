import React from 'react'
import Fetch from '../core/Fetch'

class DeleteAction extends React.Component {

    constructor(props) {
        super(props);
        this.state = { confirming: false, tooltip: "Delete" };
    }

    onDelete() {
        const { confirming } = this.state;
        const { id, path, postAction } = this.props;

        if (confirming) {
            Fetch.delete(path, id, postAction);
        } else {
            this.setState({ confirming: true });
        }
    }

    onCancelDelete() {
        this.setState({ confirming: false });
    }

    render() {
        const { confirming } = this.state;
        const tooltip = confirming ? "Click again to confirm." : "Delete?";

        return <div className="ui label"
            onClick={() => this.onDelete()} onMouseLeave={() => this.onCancelDelete()}
            data-inverted="" data-tooltip={tooltip} data-position="left center">
            <i className="trash icon icon-only" />
        </div>;
    }
}

export default DeleteAction;
