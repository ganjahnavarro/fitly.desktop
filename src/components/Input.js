import React from 'react'
import ReactDOM from 'react-dom'

class Input extends React.Component {

		constructor(props) {
				super(props);
				this.value = this.props.value;
		}

		focus() {
				this.selectedInput.focus();
		}

		highlight() {
				if (this.selectedInput && this.value) {
						let element = this.selectedInput;
						element.setSelectionRange(0, this.value.toString().length);
				}
		}

		componentWillReceiveProps(nextProps) {
				this.value = nextProps.value;
		}

		render() {
				let { icon, label, fieldClassName, inputClassName, inlineLabel } = this.props;
				fieldClassName = fieldClassName ? fieldClassName + " wide field" : "field";

				const propsInputClassName = inputClassName ? " " + inputClassName : "";
				const iconInputClassName = this.props.icon ? " icon" : "";
				inputClassName = `ui left labeled input${propsInputClassName}${iconInputClassName}`;

				let props = Object.assign({}, this.props);
				if (typeof props.defaultValue == "undefined") {
						props.value = props.value || "";
				}
				delete props.label;
				delete props.icon;
				delete props.fieldClassName;
				delete props.inputClassName;
				delete props.inlineLabel;

				let htmlInput = <input ref={(input) => {this.selectedInput = input}} {...props} />;
				let component = htmlInput;

				component = <div className={inputClassName}>
						{inlineLabel ? <div className="ui label">{inlineLabel}</div> : undefined}
						{this.props.icon ? <i className={"icon " + icon} /> : undefined}
						{htmlInput}
				</div>

		    return <div className={fieldClassName}>
						{label ? <label>{label}</label> : null}
						{component}
				</div>;
		}

}

export default Input;
