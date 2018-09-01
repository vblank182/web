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

<div class="well row">
	<div class="col-sm-6" style="font-size: 38">Read Cookie with PHP</div>
	<div class="col-sm-6 text-right"><a href="index.html" class="btn btn-lg btn-info" role="button">Back to Index</a></div>
</div>

<div class="container">
	<div class="well" style="text-align: center">
		<div class="row">
			<h2>
			<?php
			$cookie_name = "test-php";
			$button = "";
			
			if(isset($_COOKIE[$cookie_name])) {
				if($_GET["kill"] == "yes") {
					// If we get here from a kill request, kill cookie.
					setcookie($cookie_name, "", time()-1); // Cookie with expiration date in the past is "deleted"
					echo "You have no cookies from this domain.";
					$button = '<a href="phpcookieset.php" class="btn btn-lg btn-success" role="button">Set Cookie <span class="glyphicon glyphicon-import"></span></a>';
				}
				else {
					echo "You have a cookie with the following data: ";
					echo "<code>";
					echo $_COOKIE[$cookie_name];
					echo "</code>";
					$button = '<a href="phpcookieread.php?kill=yes" class="btn btn-lg btn-danger" role="button">Kill Cookie <span class="glyphicon glyphicon-remove"></span></a>';
				}
			}
			else {
				echo "You have no cookies from this domain.";
				$button = '<a href="phpcookieset.php" class="btn btn-lg btn-success" role="button">Set Cookie <span class="glyphicon glyphicon-import"></span></a>';
			}
			?>
			</h2>
		</div>
	
		<div class="row">
			<?php echo $button;?>
		</div>
		
	</div>
</div>

</body>

</html>
