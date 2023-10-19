import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import TextField from '@material-ui/core/TextField'
import { makeStyles } from '@material-ui/core/styles'
import React, { useState } from 'react'
import { HOST, getOutletFullname, outletAbbr } from '../../utils/config'
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css'
import './QueueDialog.css';

const useStyles = makeStyles(theme => ({
	root: {
		'& .MuiTextField-root': {
			width: '100%',
		},
		'& .MuiFormHelperText-root': {
			color: '#db0011',
			fontSize: '1rem',
		},
	},
	formTitle: {
		paddingBottom: 0,
		marginLeft: '16px',
		paddingTop: '24px',
	},
	buttonWrapper: {
		display: 'flex',
		justifyContent: 'center',
		marginTop: '20px',
	},
	switchWrapper: {
		margin: theme.spacing(2),
		width: '30ch',
	},
	btnWrapper: {
		display: 'flex',
		alignItems: 'center',
		marginLeft: '1rem',
		paddingTop: '12px',
	},
	dFlex: {
		display: 'flex',
	},
	divider: {
		margin: '3rem 16px 2rem',
		backgroundColor: 'rgba(0, 0, 0, 0.42)',
	},
	memberIconWrapper: {
		position: 'absolute',
		right: 0,
	},
	memberIcon: {
		cursor: 'pointer',
	},
	PhoneInput: {
		minWidth: '100vw',
		border: '5px solid pink'
	},
}))

export default function QueueDialog({ setQueueNumber, serverErrorMsg, setServerErrorMsg, queueMaxPax }) {
	const [open, setOpen] = useState(false)
	const [buttonHidden, setButtonHidden] = useState(false)
	const [outletFullname, setOutletFullname] = useState(getOutletFullname(outletAbbr))
	const [newQueue, setNewQueue] = useState({
		name: '',
		phoneNo: '',
		paxNo: '',
		birthDate: '',
		gender: 'male',
		member: false,
		email: '',
		outlet: outletFullname,
	})
	const [joinMember, setjoinMember] = useState(false)
	const genders = [
		{
			value: 'male',
			label: 'Male',
		},
		{
			value: 'female',
			label: 'Female',
		},
	]
	const [phoneNo, setPhoneNo] = useState('');
	const [valid, setValid] = useState(true);
	const [phoneErrorMsg, setPhoneErrorMsg] = useState('')
	const classes = useStyles()

	const handleClickOpen = () => {
		setOpen(true)
	}

	const handleClose = () => {
		setOpen(false)
		setNewQueue({
			name: '',
			phoneNo: '',
			paxNo: '',
			birthDate: '',
			gender: 'male',
			member: false,
			email: '',
			outlet: outletFullname,
		})
	}

	const handleChange = (value) => {
		const id = event.target.id
		if (id === 'phoneNo') {
			setPhoneNo(value);
			setValid(validatePhoneNumber(value));
		}
		else {
			setNewQueue({ ...newQueue, [id]: event.target.value })
		}
		if (id === 'validator') {
			setjoinMember(event.target.checked)
		}
	}

	const validatePhoneNumber = (phoneNo) => {
		const phoneNumberPattern = /^\d{11}$/;
		return phoneNumberPattern.test(phoneNo);
	}

	const handleSubmit = (e, newQueue) => {
		e.preventDefault()
		const { isValid, hasCountryCode, formattedNumber, errorMsg } = validatePhoneNumber(newQueue.phoneNo)
		if (!isValid || !hasCountryCode) {
			setPhoneErrorMsg(errorMsg)
			return
		}
		const updatedQueue = {
			...newQueue,
			phoneNo: formattedNumber.replace(/\+/g, ''),
			member: joinMember,
		}
		console.log(updatedQueue)
		const postData = async newQueue => {
			setButtonHidden(true)
			try {
				const result = await fetch(`${HOST}/queue/current`, {
					method: 'POST',
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(newQueue),
				})
				const data = await result.json()
				return data
			} catch (error) {
				console.log(error)
			}
		}
		postData(updatedQueue).then(data => {
			if (data.statusCode === 400) {
				setButtonHidden(false)
				setServerErrorMsg(data.message)
				handleClose()
			} else {
				setButtonHidden(false)
				setQueueNumber(data.queueNo)
				handleClose()
			}
		})
	}


	const renderMemberRegister = () => {
		if (joinMember === true) {
			return (
				<div>
					<TextField
						fullWidth
						variant="outlined"
						id="email"
						label="Email Address"
						type="email"
						value={newQueue.email}
						onChange={handleChange}
						InputLabelProps={{
							shrink: true,
						}}
						required
					/>
					<br />
					<TextField
						fullWidth
						variant="outlined"
						id="birthDate"
						label="Date of Birth"
						type="date"
						value={newQueue.birthDate}
						// defaultValue="09-09-1999"
						onChange={handleChange}
						InputLabelProps={{
							shrink: true,
						}}
						required
					/>

					<TextField
						margin="normal"
						fullWidth
						variant="outlined"
						id="gender"
						label="Gender"
						select
						SelectProps={{
							native: true,
						}}
						value={newQueue.gender}
						onChange={handleChange}
						InputLabelProps={{
							shrink: true,
						}}
						required
					>
						{genders.map(option => (
							<option key={option.value} value={option.value}>
								{option.label}
							</option>
						))}
					</TextField>
				</div>
			)
		}
	}

	return (
		<div>
			<form autoComplete="off" onSubmit={e => handleSubmit(e, newQueue)} className={classes.root}>
							<TextField
								margin="normal"
								fullWidth
								variant="outlined"
								id="name"
								label="Name"
								value={newQueue.name}
								onChange={handleChange}
								type="text"
								required
								autoFocus={true}
							/>
							<PhoneInput
								country={'sg'}
								margin="normal"
								fullWidth
								variant="outlined"
								id="phoneNo"
								label="Phone Number"
								type="tel"
								value={newQueue.phoneNo}
								onChange={handleChange}
								autoFocus={true}
							/>
							{! valid && <p>Please enter a valid 10 digit number</p> }
							<TextField
								margin="normal"
								fullWidth
								variant="outlined"
								id="paxNo"
								label="Party Size"
								type="number"
								value={newQueue.paxNo}
								onChange={handleChange}
								required
								InputProps={{ inputProps: { min: 1, max: queueMaxPax } }}
							/>
								{/* <FormControlLabel
								label="Join Member"
								control={
									<Checkbox
										variant="outlined"
										checked={joinMember}
										onChange={handleChange}
										id="validator"
										name="validator"
										color="primary"
									/>
								}
							/>
							{renderMemberRegister()} */}
						<div className={classes.buttonWrapper}>
							<Button onClick={handleClose} color="primary">
								Cancel
							</Button>
							<Button type="submit" color="primary" disabled={buttonHidden}>
								Add
							</Button>
						</div>
					</form>
					</div>
	)
};