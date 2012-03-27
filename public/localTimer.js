$(function(){
	$('.help').popover();

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
	
	window.Records = new TimeRecordList;
	
	window.TimeRecordView = Backbone.View.extend({
		tagName:		'tr',
		template:		_.template($('#record-item-template').html()),
		events:	{
			'click .record-stop':	'stopRecord',
			'click .record-restart':'restartRecord',
			'click .record-destroy':'destroyRecord'
		},
		
		initialize: function(){
			this.model.bind('change', this.render, this);
			this.model.bind('destroy', this.remove, this);
		},

		render: function() {
			$(this.el).html(this.template(this.model.toJSON()));
			this.setContent();
			if(this.model.isActive()){
				$(this.el).addClass('active');
			}
			return this;
		},
		
		remove: function() {
			$(this.el).remove();
		},
		
		setContent: function() {
			var text = this.model.get('text');
			this.$('.record-text').text(text);
		},
		
		stopRecord: function(e) {
			this.model.stop();
		},
		
		restartRecord: function(e) {
			var text = this.model.get('text');
			Records.create({text: text});
		},
		
		destroyRecord: function(e) {
			this.model.destroy();
		}
	});
	
	window.TimeRecordAppView = Backbone.View.extend({
		el:				$('#recordapp'),
		
		statsTemplate:	_.template($('#record-stats-template').html()),
		
		events: {
			'keypress #record-new':	'createOnEnter',
			'keyup #record-new':	'showPopover',
			'click #records-destroy a':'destroyAll'
		},
		
		initialize: function(){
			this.input = this.$('#record-new');
			
			Records.bind('add', this.addOne, this);
			Records.bind('reset', this.addAll, this);
			Records.bind('all', this.render, this);
			
			Records.fetch();
		},
		
		render: function(){
			this.$('#recordstats').html(this.statsTemplate({
				totalCount: Records.length,
				totalTime: Records.getTotalTime()
			}));
			this.delegateEvents();
		},
		
		addOne: function(record){
			var view = new TimeRecordView({model: record});
			this.$('#record-table').prepend(view.render().el);
		},
		
		addAll: function(){
			Records.each(this.addOne);
		},
		
		createOnEnter: function(e){
			var text = this.input.val();
			if (!text || e.keyCode != 13) return;
			Records.create({text: text});
			this.input.val('');
		},
		
		showPopover: function(e){
			var po = this.$('.help');
			var text = this.input.val();
			po.popover('hide');
			if(this.tooltipTimeout)
				clearTimeout(this.tooltipTimeout);
			if(text == '')
				return;
			this.tooltipTimeout = _.delay(function(){
					po.popover('show');
				}, 1000);
		},
		
		destroyAll: function(e){
			Records.each(function(record){
				record.destroy();
			});
			
			return false;
		}
	});
	
	window.App = new TimeRecordAppView;
});