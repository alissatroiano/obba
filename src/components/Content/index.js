import CircularProgress from '@material-ui/core/CircularProgress'
import withStyles from '@material-ui/core/styles/withStyles'
import awsIot from 'aws-iot-device-sdk'
import React, { useEffect, useState } from 'react'
import Logo from '../../../static/images/cloudE8.png'
import ObbaLogo from '../../../static/images/obba-logo.png'
import { awsIotConfig, company, env, HOST, outletAbbr, getOutletFullname } from '../../utils/config.js'
import Card from '../Card/Card.js'
import CardBody from '../Card/CardBody.js'
import QueueDialog from '../Dialog/QueueDialog'
import QueueInfoDialog from '../Dialog/QueueInfoDialog'
import QueueEnqInfoDialog from '../Dialog/QueueEnqInfoDialog'
import QueueEnquiryDialog from '../Dialog/QueueEnquiryDialog'
import GridContainer from '../Grid/GridContainer.js'
import GridItem from '../Grid/GridItem.js'
import qrcodePageStyle from './styles.js'
import initFontAwesome from '../../scripts/initFontAwesome'

// Initialize Font Awesome
initFontAwesome()

const device = awsIot.device(awsIotConfig)
device.on('connect', function() {
	console.log('connect')
	device.subscribe(`${env}/${company}/queue/temp/${outletAbbr}`)
})

const QrcodePage = ({ classes }) => {
	const [tempQueueTopic, setTempQueueTopic] = useState('')
	const [cardAnimation, setCardAnimation] = useState('cardHidden')
	const [qrcodeImg, setQrcodeImg] = useState(null)
	const [loading, setLoading] = useState(true)
	const [counter, setCounter] = React.useState(10)
	// const [queueEnqNumber, setQueueEnqNumber] = useState('')
	const [queueEnqMsg, setQueueEnqMsg] = useState('')
	const [queueNumber, setQueueNumber] = useState('')
	const [serverErrorMsg, setServerErrorMsg] = useState('')
	const [EnqErrorMsg, setEnqErrorMsg] = useState('')
	const [outletFullname, setOutletFullname] = useState(getOutletFullname(outletAbbr))
	const [queueSettings, setQueueSettings] = useState(true)
	const handleSubmit = formData => {
		console.log('Form data:', formData)
	}

	// Initial State Data Fetching
	useEffect(() => {
		fetch(`${HOST}/queue/settings`)
			.then(responses => responses.json())
			.then(values => {
				setQueueSettings(values)
				fetch(`${HOST}/queue/topics`)
					.then(responses => responses.json())
					.then(values => {
						const { tempQueueList } = values
						setTempQueueTopic(tempQueueList)

						device.on('error', function(error) {
							console.log(error)
						})

						device.on('message', function(topic, payload) {
							const queueItem = JSON.parse(payload.toString())
							const action = queueItem.action
							console.log(`subscribe ${topic} items`, queueItem)
							console.log(`${topic}`)
							switch (topic) {
								case `${env}/${company}/queue/temp/${outletAbbr}`:
									switch (action) {
										case 'Remove':
											setQrcodeImg(null)
											setLoading(true)
											fetch(`${HOST}/queue/generate`)
												.then(responses => responses.json())
												.then(values => {
													setQrcodeImg(values.dataUrl)
													setLoading(false)
													setCounter(9)
												})
												.catch(error => {
													setLoading(true)
													console.log(error)
												})
											break
										default:
											break
									}
									break

								default:
									break
							}
						})
					})
					.catch(error => {
						console.log(error)
					})

				fetch(`${HOST}/queue/generate`)
					.then(responses => responses.json())
					.then(values => {
						setQrcodeImg(values.dataUrl)
						setLoading(false)
					})
					.catch(error => {
						setLoading(true)
						console.log(error)
					})
			})
			.catch(error => {
				setLoading(true)
				console.log(error)
			})
	}, [])

	useEffect(() => {
		const interval = setInterval(() => {
			fetch(`${HOST}/queue/settings`)
				.then(responses => responses.json())
				.then(values => {
					setQueueSettings(values)
				})
				.catch(error => {
					setLoading(true)
					console.log(error)
				})

			fetch(`${HOST}/queue/generate`)
				.then(responses => responses.json())
				.then(values => {
					setQrcodeImg(values.dataUrl)
					setLoading(false)
					setCounter(9)
				})
				.catch(error => {
					setLoading(true)
					console.log(error)
				})
		}, 10000)
		return () => clearInterval(interval)
	}, [tempQueueTopic])

	useEffect(() => {
		const timer = counter > 0 && setInterval(() => setCounter(counter - 1), 1000)
		return () => clearInterval(timer)
	}, [counter, qrcodeImg])

	useEffect(() => {
		const timer = setTimeout(() => {
			setCardAnimation('')
		}, 700)
		return () => clearTimeout(timer)
	}, [])

	return (
		<div className={classes.container}>
			<GridContainer justify="center" style={{ flexWrap: 'nowrap', flexGrow: 2 }}>
				<GridItem
					xs={12}
					sm={12}
					md={10}
					style={{ alignItems: 'center', display: 'flex', flexDirection: 'row' }}
				>
					<Card className={classes.qrcodeCard}>
						<div className="form-grid" id="formQrRow">					
							<CardBody id="takeQueueRow">
								<div id="whatsapp" style={{display: 'flex', justifyContent: 'center'}}>
									<div>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										height="1em"
										viewBox="0 0 448 512"
										fill="#fafafa"
									>
										<path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
									</svg>
									</div>
									<strong>OR </strong>
									<div>
									<svg fill="#000000" width="65px" height="65px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M6.92,5.51h0L3.71,2.29A1,1,0,0,0,2.29,3.71L4.56,6A15.21,15.21,0,0,0,1.4,8.39a1,1,0,0,0,0,1.41,1,1,0,0,0,.71.3,1,1,0,0,0,.7-.29A13.07,13.07,0,0,1,6.05,7.46L7.54,9a10.78,10.78,0,0,0-3.32,2.27,1,1,0,1,0,1.42,1.4,8.8,8.8,0,0,1,3.45-2.12l1.62,1.61a7.07,7.07,0,0,0-3.66,1.94,1,1,0,1,0,1.42,1.4A5,5,0,0,1,12,14a4.13,4.13,0,0,1,.63.05l7.66,7.66a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42ZM12,16a3,3,0,1,0,3,3A3,3,0,0,0,12,16Zm0,4a1,1,0,1,1,1-1A1,1,0,0,1,12,20ZM22.61,8.39A15,15,0,0,0,10.29,4.1a1,1,0,1,0,.22,2A13.07,13.07,0,0,1,21.2,9.81a1,1,0,0,0,1.41-1.42Zm-4.25,4.24a1,1,0,0,0,1.42-1.4,10.75,10.75,0,0,0-4.84-2.82,1,1,0,1,0-.52,1.92A8.94,8.94,0,0,1,18.36,12.63Z"/></svg>
									</div>
								</div>
								<div className="queueCardRow" id="queueRow">
									{queueSettings.takingQueueProcess && !queueNumber && !serverErrorMsg ? (
										<QueueDialog
											setQueueNumber={setQueueNumber}
											serverErrorMsg={serverErrorMsg}
											setServerErrorMsg={setServerErrorMsg}
											queueMaxPax={queueSettings.maxPax}
										/>
									) : (
										<QueueInfoDialog
											queueNumber={queueNumber}
											setQueueNumber={setQueueNumber}
											serverErrorMsg={serverErrorMsg}
											setServerErrorMsg={setServerErrorMsg}
										/>
									)}
								</div>
							</CardBody>
					
							{queueSettings.takingQueueProcess && queueSettings.qrCodeFBDisplay && (
								<CardBody className={classes.spinnerWrapper} id="qrCodeRow">
									<div id="fbMessenger">
										<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512">
											<path d="M256.55 8C116.52 8 8 110.34 8 248.57c0 72.3 29.71 134.78 78.07 177.94 8.35 7.51 6.63 11.86 8.05 58.23A19.92 19.92 0 0 0 122 502.31c52.91-23.3 53.59-25.14 62.56-22.7C337.85 521.8 504 423.7 504 248.57 504 110.34 396.59 8 256.55 8zm149.24 185.13l-73 115.57a37.37 37.37 0 0 1-53.91 9.93l-58.08-43.47a15 15 0 0 0-18 0l-78.37 59.44c-10.46 7.93-24.16-4.6-17.11-15.67l73-115.57a37.36 37.36 0 0 1 53.91-9.93l58.06 43.46a15 15 0 0 0 18 0l78.41-59.38c10.44-7.98 24.14 4.54 17.09 15.62z" />
										</svg>
									</div>
									{loading ? (
										<CircularProgress className={classes.spinner} size={80} />
									) : (
										<img
											className={classes.imgCardTop}
											src={qrcodeImg}
											alt="Card-img-cap"
											id="qrcodeImg"
										/>
									)}
									<h3 className="qr-code-counter">
										QR Code will be refresh in{' '}
										<span className={`${classes.counterNum}`}>{counter}</span> second.
									</h3>
								</CardBody>
							)}
							{/* <CardFooter className={classes.cardFooter}>
								<QueueDialog />
							</CardFooter> */}
						</div>
					</Card>
				</GridItem>
			</GridContainer>
			<CardBody className={classes.spinnerWrapper} id="checkQueueButton">
				<div id="myQueueStatus">
					{!queueEnqMsg && !EnqErrorMsg ? (
						<QueueEnquiryDialog
							setQueueEnqMsg={setQueueEnqMsg}
							queueEnqMsg={queueEnqMsg}
							EnqErrorMsg={EnqErrorMsg}
							setEnqErrorMsg={setEnqErrorMsg}
						/>
					) : (
						<QueueEnqInfoDialog
							queueEnqMsg={queueEnqMsg}
							setQueueEnqMsg={setQueueEnqMsg}
							EnqErrorMsg={EnqErrorMsg}
							setEnqErrorMsg={setEnqErrorMsg}
						/>
					)}
				</div>
			</CardBody>
			{/* <CardFooter className={classes.cardFooter}>
								<QueueDialog />
							</CardFooter> */}
			<div className="infoRow" style={{ display: 'flex' }} id="bottomRowTxt">
				<div className="col">
					<h4 id="infoMsgBtm">For a better experience, download WhatsApp or Messenger</h4>
				</div>
			</div>
			<div className={classes.logoWrapper} id="logoRow">
				<img src={ObbaLogo} className={classes.obbaLogoStyle} id="obbaLogo" />
				<img src={Logo} className={classes.logoStyle} id="ollaLogo" />
			</div>
		</div>
	)
}

<div className="success-message">
	<p>Form submitted successfully!</p>
	<button onClick={() => setIsSuccess(false)}>Close</button>
</div>

export default withStyles(qrcodePageStyle)(QrcodePage)
