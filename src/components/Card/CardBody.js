// @material-ui/core components
import { makeStyles } from '@material-ui/core/styles'
// nodejs library that concatenates classes
import classNames from 'classnames'
// nodejs library to set properties for components
import PropTypes from 'prop-types'
import React from 'react'
// @material-ui/icons
// core components
import cardBodyStyle from './CardBody.styles'

const useStyles = makeStyles(cardBodyStyle)

export default function CardBody(props) {
	const classes = useStyles()
	const { className, children, plain, profile, ...rest } = props
	const cardBodyClasses = classNames({
		[classes.cardBody]: true,
		[classes.cardBodyPlain]: plain,
		[classes.cardBodyProfile]: profile,
		[className]: className !== undefined,
	})
	return (
		<div className={cardBodyClasses} {...rest}>
			{children}
		</div>
	)
}

CardBody.propTypes = {
	className: PropTypes.string,
	plain: PropTypes.bool,
	profile: PropTypes.bool,
	children: PropTypes.node,
}
