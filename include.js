const express = require('express');
const app = express();

// Following route for user authentication i.e login/logout
app.use( require('./Routes/Auth/auth') );

// Following route for employee logs
app.use( require('./Routes/Employee/logs').router );

// Following route for employee form
app.use( require('./Routes/Employee/employee') );

// Following route for employee attendance
app.use( require('./Routes/Attendance/attendance') );

// Following route for employee descussions
app.use( require('./Routes/Employee/descussions') );

// Following route for employee companies
app.use( require('./Routes/Companies/companies') );

// Following route for employee attendance devices
app.use( require('./Routes/Attendance/devices') );

// Following route for employee attendance devices in/out
app.use( require('./Routes/Attendance/inout') );

// Following route for guest registration
app.use( require('./Routes/Attendance/guests') );

// Following route for employee departments
app.use( require('./Routes/Companies/departments') );

// Following route for employee designations
app.use( require('./Routes/Companies/designations') );

// Following route for employee locations
app.use( require('./Routes/Locations/locations') );

// Following route for employee sub locations
app.use( require('./Routes/Locations/sub_locations') );

// Following route for employee grades
app.use( require('./Routes/Companies/grades') );

// Following route for employee access
app.use( require('./Routes/Companies/access') );

// Following route for custom web services
app.use( require('./Routes/Services/ReadTxtFile') );

// Following route for custom web services
app.use( require('./Routes/Services/markEmpAbsent').router );

app.use( require('./Routes/Services/markEmpLateWhenNoTimeOut').router );

// Following route for set status to valid
app.use( require('./Routes/Services/SetInOutStatusToValid') );

app.use( require('./Routes/Services/AutoTickets').router );
app.use( require('./Routes/Refund/csc').router );

// Following route for employee leave
app.use( require('./Routes/Employee/leave') );



app.use( require('./Routes/Inventory/assets') );





// Following route for inventory categories
app.use( require('./Routes/Inventory/Assets/category') );

// Following route for inventory sub categories
app.use( require('./Routes/Inventory/Assets/sub_category') );

// Following route for inventory PR requests
app.use( require('./Routes/Inventory/purchaserequisition') );

// Following route for inventory PO requests
app.use( require('./Routes/Inventory/purchaseorder') );

// Following route for chat
app.use( require('./Routes/Employee/chat') );

// Following route for employee guests
app.use( require('./Routes/Employee/guests') );

// Following route for employee courses
app.use( require('./Routes/Employee/courses') );

// Following route for employee attendance
app.use( require('./Routes/Employee/attendance') );

// Following route for employee news paper
app.use( require('./Routes/Employee/newspaper') );

// Following route for employee notifications
app.use( require('./Routes/Employee/notifications').router );

// Following route for employee drive
app.use( require('./Routes/Employee/drive') );

// Following route for Employee Attendance Requests
app.use( require('./Routes/Employee/attendance_requests') );

// Following route for Admin Module users
app.use( require('./Routes/Admin_Modules/auth') );

// Following route for Admin Module users
app.use( require('./Routes/Admin_Modules/users') );

// Following route for Admin Module users
app.use( require('./Routes/Admin_Modules/user_roles') );

// STORE MODULE APIS
app.use( require('./Routes/Store/store') );

// ITEM REQUESTS
app.use( require('./Routes/ItemRequests/itemrequests') );

// EMPLOYEE PROFILE
app.use( require('./Routes/Employee/profile') );

// ADMIN ROUTES
app.use( require('./Routes/Admin_Modules/menu') );



















// INVENTORY - STORE MODULE
app.use( require('./Inventory/home') );
app.use( require('./Inventory/products').router );
app.use( require('./Inventory/auth') );
app.use( require('./Inventory/vender') );
app.use( require('./Inventory/locations') );
app.use( require('./Inventory/categories') );
app.use( require('./Inventory/itemrequests') );
app.use( require('./Inventory/repair_request') );




// ATTENDANCE - ATTENDANCE MANAGEMENT SYSTEM
app.use( require('./attendance/auth') );








// WHATSAPP ROUTES
app.use( require('./Routes/Whatsapp/whatsapp').router );









// CONTAINER ROUTES
app.use( require('./Routes/Containers/container') );












// MANAGEMENT - ADMIN DASHBOARD SYSTEM
app.use( require('./Management/auth') );
app.use( require('./Management/attendance') );









// AI - AUTO SYSTEM
app.use( require('./Routes/AI/reminders').router );
app.use( require('./Routes/AI/signature') );












app.use( require('./Routes/Cash/cash') );















app.use( require('./Workshop/auth') );
app.use( require('./Workshop/workshop') );











app.use( require('./Routes/Vehicle_Tracking/vehicleTracking') );

module.exports = app;