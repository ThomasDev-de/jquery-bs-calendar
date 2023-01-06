# jquery-bs-calendar

### options

```javascript
let options = {
  "locale": "de", // default 'en'
  "url": null,
  "width": "310px",
    "icons": {
        "prev": "fa-solid fa-arrow-left fa-fw",
        "next": "fa-solid fa-arrow-right fa-fw",
        "eventEdit": "fa-solid fa-edit fa-fw",
        "eventRemove": "fa-solid fa-trash fa-fw"
    },
    "showEventEditButton": false,
    "showEventRemoveButton": false,
    "formatEvent": function (event) {},
    "formatNoEvent": function (date) {},
    "queryParams": function (params) {},
    "editEvent": function (e, event){}, 
    "deleteEvent": function (e, event){}, 
}
```

### the event object

```json
{
  "id": 1,
  "title": "first date",
  "description": null,
  "start": "2022-10-30 10:00:00",
  "end": "2022-10-30 12:30:00",
  "link": "",
  "editable": true,
  "deletable": true,
  "whatever": "you want..."
}
```

### set defaults

```js
$.bsCalendar.setDefault(prop, value);
```

### events

```js
$('calendar')
    .on('init', function (e) {})
    .on('change-day', function (e, date, events) {})
    .on('click-event', function (e, event) {})
    .on('events-loaded', function (e, events) {})
    .on('show-event-list', function (e, events) {})
    .on('shown-event-list', function (e, events) {})
    .on('click-current-month', function (e) {})
    .on('click-prev-month', function (e) {})
    .on('change-month', function (e) {})
```