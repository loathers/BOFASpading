<!DOCTYPE html>
<html>
	<head>
		<title>Facts about Book of Facts</title>
		<link rel="preconnect" href="https://fonts.googleapis.com">
		<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
		<link href="https://fonts.googleapis.com/css2?family=Open+Sans&display=swap" rel="stylesheet">
		<style>
			body {
				font-size: 0.8em;
			}
			p {
				margin: 0;
				font-family: 'Open Sans', sans-serif;
			}
			.hidden .spoiler {
				display: none;
			}
			.spoiler {
				display: grid;
				grid-template-columns: repeat(3, 1fr);
			}
			.spoiler-inner {
				display: flex;
				flex-direction: row;
				width: 100%;
				justify-content: space-between;
				background: linear-gradient(#E0FFE0, #FFFFFF, #E0FFE0);
				font-size: 1.5em;
				user-select: none;
				cursor: pointer;
			}
			.hidden .spoiler-inner {
				background: linear-gradient(#E0E0FF, #FFFFFF, #E0E0FF);
			}
			.spoiler-outer {
				margin: 1em;
			}
			form {
				display: flex;
				justify-content: center;
				align-items: center;
			}
			select {
				margin-left: 1em;
				margin-right: 2em;
			}
		</style>
		<script>
			function toggleSpoiler(spoiler_id) {
				document.getElementById(spoiler_id).classList.toggle('hidden');
			}
		</script>
	</head>
	<body>
<?php

require_once("/data/bofa_data.php");

$class_id = (int)$_GET["class"];
$path_id = (int)$_GET["path"];

if (!isset($_GET["class"])) $class_id = 1;
if (!isset($_GET["path"])) $path_id = 0;

$results = [];

foreach ($monster_data as $monster) {
	$seed = 421 * $class_id + 11 * $path_id + (int)$monster[0];
	mt_srand($seed, MT_RAND_PHP);
	$effect = null;
	if ($seed % 3 == 1) {
		$effect = $phylum_effects[$monster[2]][mt_rand(0, count($phylum_effects[$monster[2]]) - 1)];
	}
	else {
		$effect = $regular_effects[mt_rand(0, count($regular_effects) - 1)];
	}
	if (!isset($results[$effect])) $results[$effect] = [];
	$results[$effect][] = $monster[1];
}

ksort($results);

?>

<form action="index.php" method="get">
    <label for="class">Class:</label>
	<select name="class">
    <?php
		foreach ($classes as $class) {
			echo "<option value='".$class[1]."' ";
			if ($class[1] == $class_id) echo "selected";
			echo ">".$class[0]."</option>";
		}
	?>
	</select>

    <label for="path">Path:</label>
    <select name="path">
    <?php
		foreach ($paths as $path) {
			echo "<option value='".$path[1]."' ";
			if ($path[1] == $path_id) echo "selected";
			echo ">".$path[0]."</option>";
		}
	?>
	</select>

    <button type="submit">Update</button>
</form>

<?php

$block_id = 0;
foreach ($results as $result => $res_arr) {
	echo "<div class='spoiler-outer hidden' id='".$block_id."'>";
	echo "<div class='spoiler-inner' onclick='toggleSpoiler(".$block_id.")'>";
	echo "<p>".$result."</p>";
	echo "<p>".count($res_arr)."</p>";
	echo "</div>";
	echo "<div class='spoiler'>";
	foreach ($res_arr as $res) {
		echo "<p>".$res."</p>";
	}
	echo "</div></div>";
	$block_id += 1;
}

?>
	<footer>
		<p style='text-align: right'>Made by Semenar (#3275442)</p>
	</footer>
	</body>
</html>
