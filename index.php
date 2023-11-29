<!DOCTYPE html>
<html>
	<head>
		<title>Facts about Book of Facts</title>
		<link rel="preconnect" href="https://fonts.googleapis.com">
		<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
		<link href="https://fonts.googleapis.com/css2?family=Open+Sans&display=swap" rel="stylesheet">
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<style>
			body {
				font-size: 0.9em;
			}
			p, span {
				margin: 0;
				font-family: 'Open Sans', sans-serif;
			}
			p.monster span.comment {
				font-size: 0.9em;
				color: #222288;
			}
			p.monster span.zone {
				font-size: 0.8em;
				color: #444444;
			}
			.hidden .spoiler {
				display: none;
			}
			.spoiler {
				display: grid;
				grid-template-columns: repeat(3, 1fr);
				grid-auto-rows: 1fr;
				gap: 0.5em;
				grid-gap: 0.5em;
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

require_once("bofa_data.php");

if (isset($_GET["class"])) $class_id = (int)$_GET["class"];
if (isset($_GET["path"])) $path_id = (int)$_GET["path"];

if (!isset($_GET["class"])) $class_id = 1;
if (!isset($_GET["path"])) $path_id = 0;

$results = [];

foreach ($monster_data as $monster) {
	$effect = get_bofa_kill_effect($class_id, $path_id, $monster);
	$effect_name = $effect;
	$effect_comment = "";
	if (strpos($effect, "@") !== false) {
		$effect_name = substr($effect, 0, strpos($effect, "@"));
		$effect_comment = substr($effect, strpos($effect, "@") + 1);
	}
	if (!isset($results[$effect_name])) $results[$effect_name] = [];
	$results[$effect_name][] = Array("monster" => $monster[1], "comment" => $effect_comment);
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
	usort($res_arr, function($a, $b) {
		return strnatcasecmp($a["monster"], $b["monster"]);
	});
	echo "<div class='spoiler-outer hidden' id='".$block_id."'>";
	echo "<div class='spoiler-inner' onclick='toggleSpoiler(".$block_id.")'>";
	echo "<p>".$result."</p>";
	echo "<p>".count($res_arr)."</p>";
	echo "</div>";
	echo "<div class='spoiler'>";
	foreach ($res_arr as $res) {
		echo "<p class='monster'>".$res["monster"];
		if ($res["comment"] != "") echo "<br><span class='comment'>".$res["comment"]."</span>";
		$monster_zone_descriptions = get_monster_zone_descriptions($res["monster"]);
		foreach ($monster_zone_descriptions as $desc) {
			echo "<br><span class='zone'>".$desc."</span>";
		}
		echo "</p>";
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
