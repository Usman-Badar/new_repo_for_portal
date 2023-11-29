WHATSAPP MODULE ERRORS:

In 
node_modules/whatsapp-web.js/src/util/Injected.js at line 17 change:
window.Store.GroupMetadata = window.mR.findModule((module) => module.default && module.default.handlePendingInvite)[0].default;

To:
window.Store.GroupMetadata = window.mR.findModule('GroupMetadata')[0].default.GroupMetadata;

Also review the link: https://stackoverflow.com/questions/74412474/cannot-login-to-whatsapp-web-js-by-puppeteer-error


65	View Shipping Line Requests Page
66	Add New Shipping Line Request (Form)

72	Filter Modal access in growth review to filter the tasks within the start and end dates.

74	Shipping Line Advance Cash Verifier
75	Shipping Line Advance Cash Approval Access
	
	
	
	
67	View Notification Management Page
68	Add New Notice (for New Button in Notification Management Page)
69	Disable The Notice in Notification Management Page [Disable Button Visible Right]
70	Send Whatsapp Notification in Notification Management Page [Send Button Visible Right]
	
	
76	Portal Issue Form Access
77	View All issues
78	Change the priority of the issue
79	Access to comment on the issue
