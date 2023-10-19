F:\IT\Web Development\MERN\portal\Routes\Employee\attendance.js
-> /allemployeesattcompanywiseaccordingtodate
-> /getempattdetails
----------------------------------------------------------------
F:\IT\Web Development\MERN\portal\Routes\Whatsapp\whatsapp.js
-> SendWhatsappNotification() [function]
----------------------------------------------------------------
F:\IT\Web Development\MERN\portal\Routes\Employee\leave.js
-> /applyleave
-> /markleave
-> /applyshortleave
-> /markshortleave
-> /reject_leave
-> /cancel_leave
----------------------------------------------------------------
F:\IT\Web Development\MERN\portal\Routes\Employee\attendance_requests.js
-> /performactionforattrequest
-> /getallattendancerequests [POST]
----------------------------------------------------------------
F:\IT\Web Development\MERN\portal\Routes\Employee\employee.js
-> /acr/growth-review/details
-> /acr/growth-review/category/update [new POST api added]
-> /acr/growth-review/additional-tasks
-> /acr/growth-review/individual-tasks [new POST api added]
-> /getalltempemployee
-> /access/get/all [new GET api added]
-> /access/create/new [new POST api added]
-> /access/create/update [new POST api added]
-> /employees/search/keyword [new POST api added]
-> /access/module/name/update [new POST api added]
-> /access/assign/employees [new POST api added]
-> /access/employee/revoke [new POST api added]
----------------------------------------------------------------
New column [module: text] in the `accesses` table has been added.
----------------------------------------------------------------
F:\IT\Web Development\MERN\portal\Routes\Employee\newspaper.js
-> /get_all_notices
-> /get_all_notices [new POST api added]
-> /notice/new
-> /notice/update/title
-> /notice/send
-> /notice/enable
-> /notice/disable
-> /notice/update/file
----------------------------------------------------------------
F:\IT\Web Development\MERN\portal\Routes\Services\ReadTxtFile.js
-> Remove the variable [res] from the file.
----------------------------------------------------------------
view_date field was not update in the purchase requisition module
-> resolved [error occurred due to missing api].
----------------------------------------------------------------
F:\IT\Web Development\MERN\portal\Routes\Cash\adv_cash_shp_line.js
-> New file added [adv_cash_shp_line.js] for shipping line payment module.
-> /cash/shipping/create [POST Api changed from (cash/advance/create)]
----------------------------------------------------------------
new column [shp_request: varchar(5)] added in the table [db_cash_receipts].
new column [d_o: double] added in the table [db_cash_receipts].
new column [lolo: double] added in the table [db_cash_receipts].
new column [detention: double] added in the table [db_cash_receipts].
new column [damage_dirty: double] added in the table [db_cash_receipts].
----------------------------------------------------------------
[Error Found in the file]
-> cash.js -> cash/advance/create -> line: 138 -> query not changed as above -> previous payment slip or pr attachment script not added.
----------------------------------------------------------------
F:\IT\Web Development\MERN\portal\Routes\Whatsapp\whatsapp.js
-> sendMediaMessageSelected() [new function]
----------------------------------------------------------------
F:\IT\Web Development\MERN\portal\Routes\Cash\cash.js
-> /cash/load/requests
----------------------------------------------------------------
New access 65: Need to create for shipping line payment requests
-> Employee have 65 access will only able to see the shipping line requests.
New access 66: Need to create for shipping line payment form
-> Employee have 66 access will only able to send the shipping line requests.