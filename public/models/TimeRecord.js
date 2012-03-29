steal(function(){
	window.TimeRecord = Backbone.Model.extend({
		defaults: function(){
			return {
				startedAt:	new Date(),
				stoppedAt:	null,
				text:		'',
				order:		Records.nextOrder()
			}
		},
		
		stop: function() {
			this.save({stoppedAt: new Date()});
		},
		
		getDuration: function() {
			if(this.has('stoppedAt')){
				//return (this.get('stoppedAt').getMilliseconds() - this.get('startedAt').getMilliseconds()) / 1000;
			}
			return 0;
		},
		
		isActive: function(){
			return !this.has('stoppedAt');
		}
	});
	
	window.TimeRecordList = Backbone.Collection.extend({
		model:			TimeRecord,
		localStorage:	new Store('records'),
		
		initialize: function(){
			this.bind('add', this.stopAllButFirst, this);
		},
		
		done: function() {
			return this.filter(function(record){
				return record.get('stoppedAt') != null;
			});
		},
		
		open: function() {
			return this.without(this, this.done());
		},
		
		comparator: function(record) {
			return (Records.last().get('order') - 1);
		},
		
		nextOrder: function(){
			return this.counter++;
		},
		
		getTotalTime: function(){
			return this.reduce(function(memo, record){
				return memo + record.getDuration();
			}, 0);
		},
		
		stopAllButFirst: function(){
			_.each(_.without(this.open(),this.last()), function(record){
				record.stop();
			});
		}
	});
});