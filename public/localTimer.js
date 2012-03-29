steal('models/TimeRecord.js',
	  'views/TimeRecordView.js',
function(){	
	window.Records = new TimeRecordList;
	window.App = new TimeRecordAppView({collection: window.Records});
});