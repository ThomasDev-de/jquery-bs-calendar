# jquery-bs-calendar

### options

```javascript
let options = {
  "url": null,
  "width": 310,
  "weekdays": [
    "Mo",
    "Di",
    "Mi",
    "Do",
    "Fr",
    "Sa",
    "So"
  ],
  "months": [
    "Januar",
    "Februar",
    "März",
    "April",
    "Mai",
    "Juni",
    "Juli",
    "August",
    "September",
    "Oktober",
    "November",
    "Dezember"
  ],
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
    "queryParams": function (params) {}
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
    .on('init', function (e) {
    })
    .on('change-day', function (e, date, events) {
    })
    .on('click-event', function (e, event) {
    })
    .on('events-loaded', function (e, events) {
    })
```