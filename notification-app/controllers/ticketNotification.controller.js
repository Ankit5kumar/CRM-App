const TicketNotificationModel = require("../models/ticketNotification.model")

/**
 * This controller adds a new unsent notification to our db
 */
const acceptNotificationRequest = async (req, res) => {
    const notificationObject = {
        subject: req.body.subject,
        content: req.body.content,
        receipientEmails: req.body.receipientEmails,
        requester: req.body.requester,
        ticketId: req.body.ticketId,
    }

    try {
        const notification = await TicketNotificationModel.create(
            notificationObject
        )
        res.status(200).send({
            requestId: notification.ticketId,
            status: "Accepted Request"
        })
    } catch (err) {
        console.log(`Error while accepting a notification request: ${err.message}`)
        res.status(500).send({
            message: "Internal Server Error!"
        })
    }
}


/**
 * This controller tells the client the current status of a
 * notification.
 */
const getNotificationStatus = async (req,res) => {
    const reqId = req.params.id;
    console.log(reqId)
    try {
        
        const notification = await TicketNotificationModel.findOne({ticketid: reqId}); // if u use the TicketId which is already present as key in findone method u will get the error as null. So use different name
        console.log(notification)

        res.status(200).send({
            requestId: notification.ticketId,
            subject: notification.subject,
            content: notification.content,
            receipientEmails:notification.receipientEmails,
            sentStatus: notification.sentStatus

        })
    } catch (err) {
        console.log(`Error while fetching a notification request: ${err.message}`)
        res.status(500).send({
            message: "Internal Server Error!"
        })
    }
}
module.exports = {
    acceptNotificationRequest,
    getNotificationStatus

}