import React from 'react'

class Checkbox extends React.Component {

		render() {
        let { value, label, fieldClassName } = this.props;
        fieldClassName = fieldClassName ? fieldClassName + " wide field" : "field";
				value = value ? value : false;

        let checkboxClassName = "ui toggle checkbox";
        let props = Object.assign({}, this.props, { type: "checkbox", checked: value, value });
				delete props.label;
				delete props.fieldClassName;

        if (value) {
            checkboxClassName += " checked";
        }

        return <div className={fieldClassName}>
            <div className={checkboxClassName}>
                <input {...props} />
                <label>{label}</label>
            </div>
				</div>;
		}

}

export default Checkbox;
