const express = require('express');
const app = express();

app.use( require('./Routes/Auth/auth') );
app.use( require('./Routes/Employee/logs').router );
app.use( require('./Routes/Employee/employee') );
app.use( require('./Routes/Attendance/attendance') );
app.use( require('./Routes/Employee/descussions') );
app.use( require('./Routes/Companies/companies') );
app.use( require('./Routes/Attendance/devices') );
app.use( require('./Routes/Attendance/inout') );
app.use( require('./Routes/Attendance/guests') );
app.use( require('./Routes/Companies/departments') );
app.use( require('./Routes/Companies/designations') );
app.use( require('./Routes/Locations/locations') );
app.use( require('./Routes/Locations/sub_locations') );
app.use( require('./Routes/Companies/grades') );
app.use( require('./Routes/Companies/access') );
app.use( require('./Routes/Services/ReadTxtFile') );
app.use( require('./Routes/Services/markEmpAbsent').router );

app.use( require('./Routes/Services/markEmpLateWhenNoTimeOut').router );
app.use( require('./Routes/Services/SetInOutStatusToValid') );

app.use( require('./Routes/Services/AdvanceCashExpiry') );
app.use( require('./Routes/Services/AutoTickets').router );
app.use( require('./Routes/Refund/csc').router );
app.use( require('./Routes/Employee/leave') );



app.use( require('./Routes/Inventory/assets') );
app.use( require('./Routes/PortalIssues/portal_issues') );




app.use( require('./Routes/Inventory/Assets/category') );
app.use( require('./Routes/Inventory/Assets/sub_category') );
app.use( require('./Routes/Inventory/purchaserequisition') );
app.use( require('./Routes/Inventory/purchaseorder') );
app.use( require('./Routes/Employee/chat') );
app.use( require('./Routes/Employee/guests') );
app.use( require('./Routes/Employee/courses') );
app.use( require('./Routes/Employee/attendance') );

app.use( require('./Routes/Employee/newspaper') );
app.use( require('./Routes/Employee/notifications').router );

app.use( require('./Routes/Employee/drive') );
app.use( require('./Routes/Employee/attendance_requests') );
app.use( require('./Routes/Admin_Modules/auth') );
app.use( require('./Routes/Admin_Modules/users') );
app.use( require('./Routes/Admin_Modules/user_roles') );
app.use( require('./Routes/Store/store') );
app.use( require('./Routes/ItemRequests/itemrequests') );
app.use( require('./Routes/Employee/profile') );
app.use( require('./Routes/Admin_Modules/menu') );


















app.use( require('./inventory/home') );
app.use( require('./inventory/products').router );
app.use( require('./inventory/auth') );
app.use( require('./inventory/vender') );
app.use( require('./inventory/locations') );
app.use( require('./inventory/categories') );
app.use( require('./inventory/itemrequests') );
app.use( require('./inventory/repair_request') );



// app.use( require('./attendance/auth') );







app.use( require('./Routes/Whatsapp/whatsapp').router );








// app.use( require('./Routes/Containers/container') );











// app.use( require('./Management/auth') );
// app.use( require('./Management/attendance') );








app.use( require('./Routes/AI/reminders').router );
app.use( require('./Routes/AI/signature') );












app.use( require('./Routes/Cash/adv_cash_shp_line') ); // Shipping Line Advance Cash
app.use( require('./Routes/Cash/cash') ); // Advance Cash















app.use( require('./workshop/auth') );
app.use( require('./workshop/workshop') );











app.use( require('./Routes/Vehicle_Tracking/vehicleTracking') );

app.use( require('./Routes/Fuel_Management/fuel_management') );

module.exports = app;