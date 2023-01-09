# jquery-bs-calendar

The event calendar was created with JQuery and Boostrap 5. It does not need any additional CSS file.  
The calendar can be included in all Boostrap elements (.card, .navbar, .offcanvas, .dropdowns, ...).
### options

```javascript
let options = {
    "locale": "de", // Sets the language of days and months (default 'en-US')
    "url": null, // The URL to the endpoint where the dates will be loaded.
    "width": "310px", // Sets the width of the container. All subelements are calculated from the width of the container.
    "icons": { // Here you can change the icon classes. FontAwesome icons are set as default.
        "prev": "fa-solid fa-arrow-left fa-fw",
        "next": "fa-solid fa-arrow-right fa-fw",
        "eventEdit": "fa-solid fa-edit fa-fw",
        "eventRemove": "fa-solid fa-trash fa-fw"
    },
    "showEventEditButton": false, // Should an edit button appear on all appointments?
    "showEventRemoveButton": false, // Should a delete button appear for all appointments?
    "formatEvent": function (event) {}, // Here you can change the display of the dates.
    "formatNoEvent": function (date) {}, // The display when there are no appointments on the selected date.
    "queryParams": function (params) {}, // Additional parameters can be sent to the server here. From and To are always sent.
    "onClickEditEvent": function (e, event){}, // What should happen when the edit button is clicked at the appointment?
    "onClickDeleteEvent": function (e, event){}, // What should happen when the delete button is clicked at the appointment?
}
```

### the event object

The event object must have a start and an end attribute

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

This function can be used to define default values, such as the language before initialization.

```js
$.bsCalendar.setDefault(prop, value);
```

### methods
```js
$('#calendar').bsCalendar(method, param);
```

| methodName | Params | Description       |
|------------|--------|-------------------|
| refresh    | -      | Reloads the dates |


### events
```js
$('#calendar')
    .on('eventName', function (e, ...params) {});
```


| eventName           | params       | Description                                                    |
|---------------------|--------------|----------------------------------------------------------------|
| init                | -            | Fires when the calendar is fully initialized                   |
| change-day          | date, events | Fires when a date was clicked manually                         |
| events-loaded       | events       | Fires when the data has been loaded from the server            |
| show-event-list     | events       | Fires before building the appointment list                     |
| shown-event-list    | events       | Fires when the appointment list has been created and displayed |
| click-current-month | -            | Fires when the button for the current month is pressed         |
| click-prev-month    | -            | Fires when the button for the previous month is pressed        |
| click-next-month    | -            | Fires when the button for the next month has been pressed      |
| change-month        | -            | Fires when the month is changed                                |
```js
$('#calendar')
    .on('init', function (e) {})
    .on('change-day', function (e, date, events) {})
    .on('events-loaded', function (e, events) {})
    .on('show-event-list', function (e, events) {})
    .on('shown-event-list', function (e, events) {})
    .on('click-current-month', function (e) {})
    .on('click-prev-month', function (e) {})
    .on('click-next-month', function (e) {})
    .on('change-month', function (e) {})
```