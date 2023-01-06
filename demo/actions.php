<?php
header('Content-Type: application/json');
$currentMonth = date("m");
$currentYear = date("Y");
$daysInCurrentMonth = date("t");
$countEvents = 20;
$events = [];
for($i = 0 ; $i < $countEvents; $i++){
	$day = rand(1,$daysInCurrentMonth);
	$timestamp = mktime(rand(8, 20),0,0,$currentMonth,$day,$currentYear);
	$event = new stdClass();
	$event->id = $i+1;
	$event->title = "my event";
	$event->description = "my description";
	$event->start = date("Y-m-d H:i:s", $timestamp);
	$event->end = date('Y-m-d H:i:s', strtotime('1 hour', $timestamp));
	$events[] = $event;
}
try {
	echo json_encode($events, JSON_THROW_ON_ERROR);
} catch (JsonException $e) {
	exit($e->getTraceAsString());
}
