const express = require('express');
const router = express.Router();
const db = require('../../db/connection');
const moment = require('moment');

const LIMIT_IN_LIMIT = 48;

function checkAdvanceCashExceedExpiryLimit() {
    db.query(
        "SELECT id, approved_date, approved_time FROM `db_cash_receipts` WHERE status = 'approved';",
        (err, rslt) => {
            if (err) throw err;

            console.log(rslt.length)
            if (rslt.length === 0) {
                setTimeout(() => {
                    checkAdvanceCashExceedExpiryLimit();
                }, 1000 * 60);
                return false;
            }

            const limit = rslt.length;
            const count = [];
            function expireRequests()
            {
                const i = count.length;
                const requestApprovedDateTime = moment(rslt[i].approved_date + ' ' + rslt[i].approved_time, 'YYYY-MM-DD HH:mm');
                const currenDateTime = moment(new Date(), 'YYYY-MM-DD HH:mm');
                const duration = moment.duration(currenDateTime.diff(requestApprovedDateTime));
                const hours = duration.asHours();
                if (hours.toFixed(2) >= LIMIT_IN_LIMIT) {
                    db.query(
                        "UPDATE db_cash_receipts SET status = ?, expired_at = ? WHERE id = ?;",
                        ['expired', new Date(), rslt[i].id],
                        ( err ) => {
                            if (err) throw err;
                            if ((count.length + 1) === limit) {
                                console.log("Advance Cash Request has Expired");
                                setTimeout(() => {
                                    checkAdvanceCashExceedExpiryLimit();
                                }, 1000 * 60);
                            }else {
                                count.push(1);
                                expireRequests();
                            }
                        }
                    );
                }else {
                    if ((count.length + 1) === limit) {
                        console.log("Advance Cash Request has Expired");
                        setTimeout(() => {
                            checkAdvanceCashExceedExpiryLimit();
                        }, 1000 * 60);
                    }else {
                        count.push(1);
                        expireRequests();
                    }
                }
            }
            expireRequests();
        }
    )
}

checkAdvanceCashExceedExpiryLimit();

module.exports = router;