# jquery-bs-calendar
### options
```json
{
    "url": null,
    "width": 310,
    "weekdays": ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"],
    "months": ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"]
}
```
### the event object
```json
{
    "id": 1,
    "title": "first date",
    "description" : null,
    "start": "2022-10-30 10:00:00",
    "end": "2022-10-30 12:30:00",
    "link": "",
    "whatever": "you want..."
}
```

### events
```js
$('calendar')
    .on('init', function(e){})
    .on('change-day', function(e, date, events){})
    .on('click-event', function(e, event){})
    .on('events-loaded', function(e, events){})
```