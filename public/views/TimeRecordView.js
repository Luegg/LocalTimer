steal(function(){
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
			} else {
				$(this.el).removeClass('active');
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
			
			this.collection.bind('add', this.addOne, this);
			this.collection.bind('reset', this.addAll, this);
			this.collection.bind('all', this.render, this);
			
			this.collection.fetch();
		},
		
		render: function(){
			this.$('#recordstats').html(this.statsTemplate({
				totalCount: this.collection.length,
				totalTime: this.collection.getTotalTime()
			}));
			this.delegateEvents();
		},
		
		addOne: function(record){
			var view = new TimeRecordView({model: record});
			this.$('#record-table').prepend(view.render().el);
		},
		
		addAll: function(){
			this.collection.each(this.addOne);
		},
		
		createOnEnter: function(e){
			var text = this.input.val();
			if (!text || e.keyCode != 13) return;
			this.collection.create({text: text});
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
			this.collection.each(function(record){
				record.destroy();
			});
			
			return false;
		}
	});
});