<?
require '../vendors/Slim/Slim.php';

$app = new Slim(array(
	'templates.path' => '../templates'
));

$app->get('/', function() use ($app){
	$app->render('main.php');
});

$app->get('/timeRecord', function() use ($app){
	
});

$app->run();