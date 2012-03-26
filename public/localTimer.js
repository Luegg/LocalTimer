$(function(){
	$('.help').popover();

	var LocalTimer;

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
		}
	});
	
	window.TimeRecordList = Backbone.Collection.extend({
		model:			TimeRecord,
		localStorage:	new Store('records'),
		counter:			1,
		
		done: function() {
			return this.filter(function(record){
				return record.get('stoppedAt') != null;
			});
		},
		
		open: function() {
			return this.without.apply(this, this.done());
		},
		
		comparator: function(record) {
			return record.get('order');
		},
		
		nextOrder: function(){
			return this.counter++;
		}
	});
	
	window.Records = new TimeRecordList;
	
	window.TimeRecordView = Backbone.View.extend({
		tagName:		'tr',
		template:		_.template($('#record-item-template').html()),
		events:	{
			'click .record-stop':	'stopRecord',
			'click .record-restart':'restartRecord'
		},
		
		initialize: function(){
			this.model.bind('change', this.render, this);
		},

		render: function() {
			$(this.el).html(this.template(this.model.toJSON()));
			this.setContent();
			return this;
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
		}
	});
	
	window.TimeRecordAppView = Backbone.View.extend({
		el:				$('#recordapp'),
		
		statsTemplate:	_.template($('#record-stats-template').html()),
		
		events: {
			'keypress #record-new':	'createOnEnter',
			'keyup #record-new':	'showPopover'
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
				total: Records.length
			}));
		},
		
		addOne: function(record){
			var view = new TimeRecordView({model: record});
			this.$('#record-table').append(view.render().el);
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
		}
	});
	
	window.App = new TimeRecordAppView;
});