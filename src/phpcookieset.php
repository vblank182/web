<html>

<head>
	<title>Raspberry Pi Server - Web Sandbox - Cookies</title>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<!-- Bootstrap - CSS -->
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
	<!-- Bootstrap - JavaScript -->
	<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
	<!-- jQuery -->
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
</head>

<body>
<?php
	$cookie_name = "test-php";
	$cookie_value = "SomeGoodData";

	setcookie($cookie_name, $cookie_value, time()+30);
?>

<div class="well row">
	<div class="col-sm-6" style="font-size: 38">Set Cookie with PHP</div>
	<div class="col-sm-6 text-right"><a href="index.html" class="btn btn-lg btn-info" role="button">Back to Index</a></div>
</div>


<div class="container">
	<div class="well" style="text-align: center">
		<div class="row">
			<h2>A cookie has been set. It will expire in 30 seconds.</h2>
		</div>
	
		<div class="row">
			<a href="phpcookieread.php" class="btn btn-lg btn-success" role="button">Read Cookie <span class="glyphicon glyphicon-export"></span></a>
		</div>
		
	</div>
</div>

</div>

</body>

</html>
