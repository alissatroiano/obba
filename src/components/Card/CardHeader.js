// @material-ui/core components
import { makeStyles } from '@material-ui/core/styles'
// nodejs library that concatenates classes
import classNames from 'classnames'
// nodejs library to set properties for components
import PropTypes from 'prop-types'
import React from 'react'
// @material-ui/icons
// core components
import cardHeaderStyle from './CardHeader.styles'

const useStyles = makeStyles(cardHeaderStyle)

export default function CardHeader(props) {
	const classes = useStyles()
	const { className, children, color, plain, stats, icon, ...rest } = props
	const cardHeaderClasses = classNames({
		[classes.cardHeader]: true,
		[classes[color + 'CardHeader']]: color,
		[classes.cardHeaderPlain]: plain,
		[classes.cardHeaderStats]: stats,
		[classes.cardHeaderIcon]: icon,
		[className]: className !== undefined,
	})
	return (
		<div className={cardHeaderClasses} {...rest}>
			{children}
		</div>
	)
}

CardHeader.propTypes = {
	className: PropTypes.string,
	color: PropTypes.oneOf(['warning', 'success', 'danger', 'info', 'primary', 'rose']),
	plain: PropTypes.bool,
	stats: PropTypes.bool,
	icon: PropTypes.bool,
	children: PropTypes.node,
}
