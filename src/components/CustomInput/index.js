import FormControl from '@material-ui/core/FormControl'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles'
// nodejs library that concatenates classes
import classNames from 'classnames'
// nodejs library to set properties for components
import PropTypes from 'prop-types'
import React from 'react'
import customInputStyle from './styles.js'

function CustomInput({ ...props }) {
	const {
		classes,
		formControlProps,
		labelText,
		id,
		labelProps,
		inputProps,
		error,
		white,
		inputRootCustomClasses,
		success,
	} = props

	const labelClasses = classNames({
		[' ' + classes.labelRootError]: error,
		[' ' + classes.labelRootSuccess]: success && !error,
	})
	
	const marginTop = classNames({
		[inputRootCustomClasses]: inputRootCustomClasses !== undefined,
	})
	const inputClasses = classNames({
		[classes.input]: true,
		[classes.whiteInput]: white,
	})
	var formControlClasses
	if (formControlProps !== undefined) {
		formControlClasses = classNames(formControlProps.className, classes.formControl)
	} else {
		formControlClasses = classes.formControl
	}
	return (
		<FormControl {...formControlProps} className={formControlClasses}>
			{labelText !== undefined ? (
				<InputLabel className={classes.labelRoot + ' ' + labelClasses} htmlFor={id} {...labelProps}>
					{labelText}
				</InputLabel>
			) : null}
			<Input
				classes={{
					input: inputClasses,
					root: marginTop,
					disabled: classes.disabled,
				}}
				id={id}
				{...inputProps}
			/>
		</FormControl>
	)
}

CustomInput.propTypes = {
	classes: PropTypes.object.isRequired,
	labelText: PropTypes.node,
	labelProps: PropTypes.object,
	id: PropTypes.string,
	inputProps: PropTypes.object,
	formControlProps: PropTypes.object,
	inputRootCustomClasses: PropTypes.string,
	error: PropTypes.bool,
	success: PropTypes.bool,
	white: PropTypes.bool,
}

export default withStyles(customInputStyle)(CustomInput)
