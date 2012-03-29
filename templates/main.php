<!DOCTYPE html>
<html>
	<head>
		<title>LocalTimer</title>
		<script src="vendors/json2.js"></script>
		<script src="vendors/jquery-1.7.1.js"></script>
		<script src="vendors/underscore.js"></script>
		<script src="vendors/backbone.js"></script>
		<script src="vendors/backbone.localStorage.js"></script>
		<script src="vendors/bootstrap/js/bootstrap.js"></script>
		<script type='text/javascript' src='steal/steal.js?localTimer.js'></script>
		<link href="vendors/bootstrap/css/bootstrap.css" media="all" rel="stylesheet" type="text/css"/>
		<link href="localTimer.css" media="all" rel="stylesheet" type="text/css"/>
		<link href="vendors/bootstrap/css/bootstrap-responsive.css" media="all" rel="stylesheet" type="text/css"/>
	</head>

	<body>
		<div class="navbar navbar-fixed-top">
		  <div class="navbar-inner">
			<div class="container">
			  <a class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">
				<span class="icon-bar"></span>
				<span class="icon-bar"></span>
				<span class="icon-bar"></span>
			  </a>
			  <a class="brand" href="">LocalTimer</a>
			  <div class="nav-collapse">
				<ul class="nav">
				  <li class="">
					<a href="#">First</a>
				  </li>
				  <li class="">
					<a href="#">Second</a>
				  </li>
				</ul>
			  </div>
			</div>
		  </div>
		</div>
		<div class="container">
		<!--<header style="display: none;">
			<div class="page-header">
				<h1>Time Records <small>record your time spent for anything</small></h1>
			</div>
		</header>-->
		
		<section class="row" id="recordapp">
			<div class="span4 offset3 app">
				<h2>Records</h2>
				
				<div id="record-create">
					<input id="record-new" placeholder="What are you working at?" type="text" />
					<a href="#" class="help" rel="popover" title="New record" data-content="Enter description and press enter to start a new record"><i class="icon-question-sign"></i></a>
				</div>
				
				<table id="record-table" class="table">
				
				</table>
			</div>
			<div class="span2">
				<div class="app" id="recordstats">
				</div>
			</div>
		</section>
		
		<footer>
			
		</footer>
		</div>
		
	<!-- Templates -->
	<script type="text/template" id="record-item-template">
		<td>
			<%= stoppedAt == null ? '<a href="#" class="record-stop" title="Stop record"><i class="icon-ok-sign"></i></a>' : '<a href="#" class="record-restart" title="Restart record"><i class="icon-plus-sign"></i></a>' %>
		</td>
		<td class="record <%= stoppedAt == null ? 'active' : 'stopped' %>">
			<span class="record-text"></span>
			<span class="record-edit"></span>
		</td>
		<td class="">
			<a href="#" class="record-destroy" title="Clear record"><i class="icon-remove"></i></a>
		</td>
	</script>

	<script type="text/template" id="record-stats-template">
		<h3>Stats</h3>
		<% if (totalCount) { %>
			<div>Total Records: <%= totalCount %></div>
		<% } %>
		<% if (totalTime) { %>
			<div>Total Time: <%= totalTime %></div>
		<% } %>
		<% if (totalCount) { %>
			<div class="records-destroy"><a href="#"><i class="icon-remove"></i> Delete all records</a></div>
		<% } %>
	</script>

	</body>
</html>