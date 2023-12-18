// noinspection DuplicatedCode

(function ($) {

    Date.DEFAULT_LOCALE = 'en-US';

    Date.UNITS = {
        year: 24 * 60 * 60 * 1000 * 365,
        month: 24 * 60 * 60 * 1000 * 365 / 12,
        week: 24 * 60 * 60 * 1000 * 7,
        day: 24 * 60 * 60 * 1000,
        hour: 60 * 60 * 1000,
        minute: 60 * 1000,
        second: 1000
    }

    /**
     *
     * @param {string} locale
     */
    Date.setLocale = function (locale) {
        Date.DEFAULT_LOCALE = locale ? locale : Date.DEFAULT_LOCALE;
    };

    Date.getUnits = function () {
        return Date.UNITS;
    }


    /**
     *
     * @param {boolean} abbreviation
     * @returns {string[]}
     */
    Date.getDayNames = function (abbreviation = false) {
        const formatter = new Intl.DateTimeFormat(Date.DEFAULT_LOCALE, {
            weekday: abbreviation ? 'short' : 'long',
            timeZone: 'UTC'
        });
        const days = [2, 3, 4, 5, 6, 7, 8].map(day => {
            const dd = day < 10 ? `0${day}` : day;
            return new Date(`2017-01-${dd}T00:00:00+00:00`);
        });
        return days.map(date => formatter.format(date));
    }

    /**
     *
     * @param {boolean} abbreviation
     * @returns {string[]}
     */
    Date.getMonthNames = function (abbreviation = false) {
        const formatter = new Intl.DateTimeFormat(Date.DEFAULT_LOCALE, {
            month: abbreviation ? 'short' : 'long',
            timeZone: 'UTC'
        });
        const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(month => {
            const mm = month < 10 ? `0${month}` : month;
            return new Date(`2017-${mm}-01T00:00:00+00:00`);
        });
        return months.map(date => formatter.format(date));
    }
    /**
     *
     * @returns {string}
     */
    Date.prototype.showDateFormatted = function () {
        let options = {weekday: 'long', year: 'numeric', month: 'short', day: 'numeric'};
        return this.toLocaleDateString(Date.DEFAULT_LOCALE, options);

    }

    /**
     *
     * @returns {Date}
     */
    Date.prototype.copy = function () {
        return this.clone();
    }


    /**
     *
     * @param {boolean} abbreviation
     * @return {string}
     */
    Date.prototype.getMonthName = function (abbreviation = false) {
        const formatter = new Intl.DateTimeFormat(Date.DEFAULT_LOCALE, {
            month: abbreviation ? 'short' : 'long',
            timeZone: 'UTC'
        });
        return formatter.format(this);
    };

    /**
     * Determine the number of days in the current month
     * @returns {number}
     */
    Date.prototype.getDaysInMonth = function () {
        return [31, (this.isLeapYear() ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][this.getMonth()];
    };

    /**
     * Checks if the year of the date is a leap year
     * @returns {boolean}
     */
    Date.prototype.isLeapYear = function () {
        let year = this.getFullYear();
        return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0));
    };

    /**
     *
     * @param {boolean} abbreviation
     * @return {string}
     */
    Date.prototype.getDayName = function (abbreviation = false) {
        const formatter = new Intl.DateTimeFormat(Date.DEFAULT_LOCALE, {
            weekday: abbreviation ? 'short' : 'long',
            timeZone: 'UTC'
        });
        return formatter.format(this);
    };

    $.fn.extend({
        /**
         * Triggers multiple events on a given element.
         *
         * @param {String} events - A space-separated string of event names to trigger.
         * @param {Object|undefined|array} params - Optional parameters to pass to the event handlers.
         * @returns {jQuery} - The element on which the events were triggered.
         */
        triggerAll: function (events, params = []) {
            let el = this, i, eventArray = events.split(' ');
            for (i = 0; i < eventArray.length; i += 1) {
                el.trigger(eventArray[i], params);
            }
            return el;
        }
    });

    /**
     * Represents the jQuery plugin bsCalendar.
     *
     * @class
     */
    $.bsCalendar = {
        setDefaults(o = {}) {
            this.DEFAULTS = $.extend(true, this.DEFAULTS, o || {})
        },
        setDefault(prop, value) {
            this.DEFAULTS[prop] = value;
        },
        getDefaults(container) {
            this.DEFAULTS.url = container.data('target') || container.data('bsTarget') || this.DEFAULTS.url;
            return this.DEFAULTS;
        },
        DEFAULTS: {
            locale: 'en',
            url: null,
            width: '300px',
            icons: {
                prev: 'bi bi-chevron-left',
                next: 'bi bi-chevron-right',
                eventEdit: 'bi bi-pen',
                eventRemove: 'bi bi-calendar2-x'
            },
            showTodayHeader: true,
            showPopover: true,
            popoverConfig: {
                animation: false,
                html: true,
                delay: 400,
                placement: 'top',
                trigger: 'hover'
            },
            showEventEditButton: false,
            showEventRemoveButton: false,
            formatPopoverContent(events){
                return '<div class="list-group list-group-flush">'+events.map(e => {
                    return `<div class="list-group-itemp p-1">${e.title}</div>`;
                }).join('')+'</div>'
            },
            formatEvent(event) {
                return drawEvent(event);
            },
            formatNoEvent(date) {
                return drawNoEvent(date);
            },
            queryParams(params) {
                return params;
            },
            onClickEditEvent(e, event) {
            },
            onClickDeleteEvent(e, event) {
            },
        }
    };

    const eventEditButton = {
        class: 'btn btn-link p-0 .js-edit-event',
    };

    const eventRemoveButton = {
        class: 'btn btn-link p-0 .js-delete-event',
    };

    /**
     *
     * @param days
     * @returns {Date}
     */
    Date.prototype.addDays = function (days) {
        let date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date;
    }

    /**
     *
     * @param days
     * @returns {Date}
     */
    Date.prototype.subDays = function (days) {
        let date = new Date(this.valueOf());
        date.setDate(date.getDate() - days);
        return date;
    }

    /**
     * Subtracts a specified number of months from the date
     * @param {number} months
     * @returns {Date}
     */
    Date.prototype.subMonths = function (months) {
        const month = this.getMonth();
        this.setMonth(this.getMonth() - months);
        while (this.getMonth() === month) {
            this.subDays(1);
        }
        return this;
    }
    /**
     *
     * @param year
     * @returns {boolean}
     */
    Date.isLeapYear = function (year) {
        return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0));
    };


    /**
     * Adds a specified number of months to the date
     * @param {number} months
     * @returns {Date}
     */
    Date.prototype.addMonths = function (months) {
        let n = this.getDate();
        this.setDate(1);
        this.setMonth(this.getMonth() + months);
        this.setDate(Math.min(n, this.getDaysInMonth()));
        return this;
    };

    /**
     * Get the first day of the month for a given date.
     *
     * @returns {Date} - The first day of the month for the given date.
     */
    Date.prototype.getFirstDayOfMonth = function () {
        return new Date(this.getFullYear(), this.getMonth(), 1);
    }


    /**
     * Returns the last day of the month for the given date.
     *
     * @returns {Date} - The last day of the month.
     */
    Date.prototype.getLastDayOfMonth = function () {
        return new Date(this.getFullYear(), this.getMonth() + 1, 0);
    }

    /**
     * Returns the Monday of the week for a given date.
     *
     * @returns {Date} The Date object representing the Monday of the week.
     */
    Date.prototype.getMonday = function () {
        let d = new Date(this.valueOf());
        let day = d.getDay(),
            diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
        return new Date(d.setDate(diff));
    }


    /**
     * Determine the previous Monday of the current date
     * @returns {Date}
     */
    Date.prototype.getFirstDayOfWeek = function () {
        let d = this.copy();
        let day = d.getDay(),
            diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
        return new Date(d.setDate(diff));
    }


    /**
     * Determine the Sunday of the current date
     * @returns {Date}
     */
    Date.prototype.getLastDayOfWeek = function () {
        let d = this.clone();
        const first = d.getDate() - d.getDay() + 1;
        const last = first + 6;

        return new Date(d.setDate(last));
    }

    /**
     *
     * @returns {Date}
     */
    Date.prototype.getSunday = function () {
        let d = new Date(this.valueOf());
        const first = d.getDate() - d.getDay() + 1;
        const last = first + 6;

        return new Date(d.setDate(last));
    }
    /**
     *
     * @returns {Date}
     */
    Date.prototype.clone = function () {
        return new Date(this.valueOf());
    }

    /**
     *
     * @param asArray
     * @returns {(number|string)[]|string}
     */
    Date.prototype.formatDate = function (asArray) {
        let d = new Date(this.valueOf()),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return asArray ? [year, month, day] : [year, month, day].join('-');
    }

    /**
     *
     * @returns {number}
     */
    Date.prototype.getWeek = function () {
        // Copy date so don't modify original
        let d = new Date(Date.UTC(this.getFullYear(), this.getMonth(), this.getDate()));
        // Set to the nearest Thursday: current date + 4 - current day number
        // Make Sunday's day number 7
        d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
        // Get first day of year
        let yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        // Calculate full weeks to the nearest Thursday and return week number
        return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    }


    /**
     *
     * @param date
     * @returns {string}
     */
    function formatDate(date) {
        let date_arr = date.split('-');
        return date_arr[2] + '.' + date_arr[1] + '.' + date_arr[0];
    }

    /**
     *
     * @param time
     * @returns {string}
     */
    function formatTime(time) {
        return time.substring(0, 5);
    }

    /**
     * Generates HTML code to display the details of an event.
     *
     * @param {object} event - The event object containing the following properties:
     *   - title: The title of the event.
     *   - start: The start date and time of the event in the format "YYYY-MM-DD HH:MM:SS".
     *   - end: The end date and time of the event in the format "YYYY-MM-DD HH:MM:SS".
     *   - description: The description of the event (optional).
     *
     * @returns {string} - The HTML code to display the event details.
     *
     */
    function drawEvent(event) {
        let desc = event.description ? '<p class="m-0">' + event.description + '</p>' : '';
        let s, e;
        let startDate = event.start.split(' ')[0];
        let endDate = event.end.split(' ')[0];
        if (startDate === endDate) {
            s = formatTime(event.start.split(' ')[1]);
            e = formatTime(event.end.split(' ')[1]);
        } else {
            s = formatDate(startDate);
            e = formatDate(endDate);
        }
        return `
        <div class="d-flex flex-column p-3" style="font-size:.8em">
            <h6 class="mb-0 text-uppercase">${event.title}</h6>
            <small class="text-muted">${s} - ${e}</small>
            ${desc}
        </div>
        `;
    }

    // noinspection JSUnusedLocalSymbols
    /**
     * Draws a no event message on the specified date.
     *
     * @param {Date} date - The date for which the no event message should be drawn.
     * @return {string} - The HTML markup for the no event message.
     */
    function drawNoEvent(date) {
        return `
        <div class="p-2" style="font-size:.8em">
        <h6 class="mb-0 text-center">No appointments on this day</h6>
        </div>
        `;
    }

    function getFormattedDate(date){
        return `${date.getDate()}. ${date.getMonthName()} ${date.getFullYear()}`;
    }
    /**
     *
     * @param {object} container
     */
    function drawTemplate(container) {
        let settings = container.data('settings');

        let todayHeader = '';
        if (settings.showTodayHeader){
            let today = new Date();
            todayHeader = `
                <div class="p-3 d-flex flex-column">
				    <small>${today.getDayName()}</small>
				    <h4 class="mb-0">${getFormattedDate(today)}</h4>
			    </div>
            `;
        }
        container
            .css({'width': settings.width})
            .html(`
			${todayHeader}
            <div class="d-flex flex-nowrap justify-content-between align-items-center p-2">
                <a href="#" class="btn btn-link text-decoration-none btn-prev-month"><i class="${settings.icons.prev}"></i></a>
                <a href="#" class="btn btn-link text-decoration-none  mx-1 flex-fill btn-curr-month month-name"></a>
                <a href="#" class="btn btn-link text-decoration-none  btn-next-month"><i class="${settings.icons.next}"></i></a>
            </div>
            <div class="d-flex flex-nowrap align-items-center js-weekdays">
                <div class="text-center"></div>
            </div>
             <div class="js-weeks"></div>
            <div class="dates"></div>
            <div class="p-2 js-collapse d-none">
                <div class="card mb-0 rounded-0 border-0">
                    <div class="text-center fw-bold py-2 js-day-name card-header bg-transparent"></div>
                    <div class="js-events list-group list-group-flush"></div>
                </div>
            </div>
        `);

        let cellWidthHeight = container.width() / 8; // 7 days + calendar week
        let fontSize = cellWidthHeight / 3;
        let cellCss = {
            color: '#adadad',
            lineHeight: cellWidthHeight + 'px',
            fontSize: fontSize + 'px',
            height: cellWidthHeight,
            width: cellWidthHeight,
        };
        container.find('.js-weekdays div:first').css(cellCss);


        let currentDayName = '';
        if (container.find('.js-today').length) {
            currentDayName = new Date().getDayName(true);
        }


        Date.getDayNames(true).forEach(wd => {
            const addClass = wd === currentDayName ? 'text-warning' : '';
            $('<div>', {
                html: wd,
                class: 'js-day-name-short text-center ' + addClass,
                css: cellCss,
            }).appendTo(container.find('.js-weekdays'));
        });
    }

    function highlightDayName(container) {
        const highlightClasses = 'text-warning fw-bold';
        const iSeeToday = container.find('.js-today').length !== 0;
        const wrap = container.find('.js-weekdays');
        wrap.find('.js-day-name-short').removeClass(highlightClasses);
        if (iSeeToday){
            wrap.find('.js-day-name-short:eq('+(container.find('.js-today').index() -1)+')').addClass(highlightClasses);
        }

    }

    /**
     *
     * @param {object|null} options
     * @param {object|null|string|Date} params
     * @returns {*|jQuery|HTMLElement}
     */
    $.fn.bsCalendar = function (options, params = null) {

        if ($(this).length > 1) {
            return $(this).each(function (i, e) {
                return $(e).bsCalendar(options, params);
            })
        }

        /**
         *
         * @type {jQuery|HTMLElement|*}
         */
        const container = $(this);
        let xhr = null;

        let isMethodSet = typeof options === 'string';

        let settings;

        if (container.data('init') !== true) {
            settings = $.extend(true, $.bsCalendar.getDefaults(container), options || {});
            Date.setLocale(settings.locale);
            container.data('settings', $.extend(true, $.bsCalendar.getDefaults(container), options || {}));
            drawTemplate(container);
        } else {
            settings = container.data('settings');
        }

        let cellWidthHeight = container.width() / 8; // 7 days + calendar week
        let fontSize = cellWidthHeight / 3; // 7 days + calendar week
        let calendar = [];

        // noinspection JSUnusedLocalSymbols
        /**
         * Checks if the current theme is dark mode.
         *
         * @return {boolean} Returns true if the current theme is dark mode, and false otherwise.
         */
        function isDarkMode() {
            return container.data('bsTheme') === 'dark'
                || (container.closest('[data-bs-theme]').length
                    && container.closest('[data-bs-theme]').data('bsTheme') === 'dark'
                );
        }

        /**
         * Retrieves events from a server based on the provided parameters.
         *
         * @param {object} container - The container element where the events will be loaded.
         * @param {Date} selected - The selected date for which events should be retrieved.
         * @param {function} callback - The callback function to be called with the retrieved events.
         * @return {void}
         */
        function getEvents(container, selected, callback) {
            if (xhr) {
                xhr.abort();
                xhr = null;
            }

            if (!settings.url) {
                callback([]);
            } else {
                let data = {
                    from: selected.clone().getFirstDayOfMonth().getFirstDayOfWeek().formatDate(false),
                    to: selected.clone().getLastDayOfMonth().getLastDayOfWeek().formatDate(false)
                };
                // noinspection JSUnusedGlobalSymbols
                xhr = $.ajax({
                    url: settings.url,
                    dataType: 'json',
                    data: settings.queryParams(data),
                    success: function (events) {
                        container.trigger('events-loaded', [events]);
                        callback(events || []);
                    }
                });
            }
        }

        /**
         * Draw a calendar based on a selected date
         * @param {Date|null|undefined} selectedDate - The selected date to display the calendar for
         */
        function drawCalendar(selectedDate = null) {

            if (!selectedDate){
                selectedDate = new Date();
            }
            let activeDate = container.find('[data-date].active').length ? container.find('[data-date].active').data('date') : null;

            let wrap = container.find('.js-weeks').empty();
            const startDay = selectedDate.clone().getFirstDayOfMonth().getMonday();
            const endDay = selectedDate.clone().getLastDayOfMonth().getSunday();

            let date = startDay.clone().subDays(1);

            container.find('.month-name').html(selectedDate.getMonthName() + ' ' + selectedDate.getFullYear());

            calendar = [];
            while (date < endDay) {
                calendar.push({
                    days: Array(7).fill(0).map(() => {
                        date = date.addDays(1);
                        return date;
                    })
                });
            }
            const today = new Date();
            const currentWeek = today.getWeek();
            const currentYear = today.getFullYear();

            calendar.forEach(week => {
                let w = week.days[0].getWeek();
                let highlight_week = currentYear === week.days[0].getFullYear() && currentWeek === w;
                let highlightClass = highlight_week ? 'fw-bold text-warning' : 'fw-small';

                let weekContainer = $('<div>', {
                    class: 'd-flex flex-nowrap'
                }).appendTo(wrap);

                // calendar week
                $('<div>', {
                    class: 'd-flex justify-content-center align-items-center js-cal-row',
                    css: {
                        fontSize: fontSize + 'px',
                        color: '#adadad',
                        width: cellWidthHeight,
                        height: cellWidthHeight
                    },
                    html: [
                        '<small class="text-center mb-0 ' + highlightClass + '">' + w + '</small>'
                    ].join('')
                }).appendTo(weekContainer);


                week.days.forEach(day => {
                    let isToday = today.formatDate(false) === day.formatDate(false);
                    let isInMonth = selectedDate.formatDate(true)[1] === day.formatDate(true)[1];
                    let cellBackground = isToday ? ' text-bg-primary rounded-circle ' : (isInMonth ? ' fw-bold ' : ' fw-small');
                    let cellTextColor = isInMonth ? '' : 'gray';
                    let highlight = !isToday ? '' : ' js-today ';
                    let col = $('<div>', {
                        'data-date': day.formatDate(false),
                        class: 'position-relative d-flex justify-content-center align-items-center ' + highlight + cellBackground,
                        css: {
                            color: cellTextColor,
                            cursor: 'pointer',
                            width: cellWidthHeight,
                            height: cellWidthHeight
                        },
                        html: [
                            '<div style="font-size:' + fontSize + 'px">' + day.formatDate(true)[2] + '</div>',
                            [
                                '<small class="js-count-events position-absolute text-center rounded-circle" style="width:4px; height:4px; bottom:4px; left: 50%; margin-left:-2px">',
                                '</small>'
                            ].join('')
                        ].join('')
                    }).appendTo(weekContainer);
                    col.data('events', []);
                });


            });

            highlightDayName(container);

            getEvents(container, selectedDate, function (events) {
                let haveEventsToday = false;
                events.forEach(event => {
                    let start = new Date(event.start);
                    let end = new Date(event.end);

                    let curDate = start.clone();
                    let currDaysFormatted;
                    let now = new Date();
                    do {

                        currDaysFormatted = curDate.formatDate(false);

                        if (false === haveEventsToday && (currDaysFormatted === now.formatDate(false))) {
                            haveEventsToday = true;
                        }

                        let column = container.find('[data-date="' + curDate.formatDate(false) + '"]');
                        let dataEvents = [];
                        if (column.length) {
                            dataEvents = column.data('events');
                            dataEvents.push(event);
                            column
                                .data('events', dataEvents)
                                .find(`.js-count-events`)
                                .addClass('bg-danger')
                        }

                        if (column.length && dataEvents.length && settings.showPopover){
                            $(column).popover('dispose');
                            const popoverContent = settings.formatPopoverContent(dataEvents)
                            const popoverSetup = $.extend(settings.popoverConfig || {}, {
                                title: '<small>'+getFormattedDate(curDate)+'</small>',
                                content: popoverContent
                            });
                            column.popover(popoverSetup);
                        }

                        curDate = curDate.clone().addDays(1);

                    } while (currDaysFormatted < end.formatDate(false));
                });

                if (activeDate !== null && container.find('[data-date="' + activeDate + '"]').length) {
                    container.find('[data-date="' + activeDate + '"]').trigger('click');
                } else {
                    // Today is in the current month?
                    if (container.find('.js-today').length) {
                        container.find('.js-today').trigger('click');
                    }
                }
            });
        }

        /**
         * Attach event listeners to the container element.
         * Triggers various events when specific actions are performed.
         *
         * @return {void}
         */
        function events() {
            container
                .on('click', '.js-event', function (e) {
                    let event = $(e.currentTarget).data('event');
                    container.trigger('click-event', [event]);
                })
                .on('click', '.btn-prev-month', function (e) {
                    e.preventDefault();
                    const dateBefore = container.data('current');
                    const dateAfter = dateBefore.clone().subMonths(1);
                    container.data('current',dateAfter);
                    drawCalendar(dateAfter);
                    container.find('.js-collapse:not(.d-none)').addClass('d-none');
                    container.triggerAll('click-prev-month change-month');

                })
                .on('click', '.btn-curr-month', function (e) {
                    e.preventDefault();
                    const dateAfter = new Date();
                    container.data('current',dateAfter);
                    drawCalendar(dateAfter);
                    container.find('.js-collapse:not(.d-none)').addClass('d-none');
                    container.triggerAll('click-current-month change-month');
                })
                .on('click', '.btn-next-month', function (e) {
                    e.preventDefault();
                    const dateBefore = container.data('current');
                    const dateAfter = dateBefore.clone().addMonths(1);
                    container.data('current',dateAfter)
                    drawCalendar(dateAfter);
                    container.find('.js-collapse:not(.d-none)').addClass('d-none');
                    container.triggerAll('click-next-month change-month');

                })
                .on('mouseleave', '[data-date]', function (e) {
                    if (settings.showPopover){
                        $(e.currentTarget).popover('hide');
                    }
                })
                .on('click', '[data-date]', function (e) {
                    let $column = $(e.currentTarget);
                    let date = new Date($column.data('date'));
                    let events = $column.data('events');
                    container.find('.js-day-name').html(date.showDateFormatted());
                    drawEventList(container, events, date);
                    container.find('.js-collapse.d-none').removeClass('d-none');
                    container.trigger('change-day', [date, events]);
                });
        }

        /**
         * Draws the event list in the specified container with the given events and date.
         *
         * @param {jQuery} container - The DOM element (jQuery object) where the event list will be displayed.
         * @param {array} events - An array of events to be displayed in the event list.
         * @param {Date} date - The date used for formatting purposes.
         */
        function drawEventList(container, events, date) {
            $(container).trigger('show-event-list', [events]);
            let eventList = $(container).find('.js-events');
            eventList.empty();
            if (!events.length) {
                $('<div>', {
                    class: 'list-group-item',
                    html: settings.formatNoEvent(date)
                }).appendTo(eventList);
            } else {

                events.forEach(event => {
                    let eventHtml = settings.formatEvent(event);

                    let eventWrapper = $('<div>', {
                        class: 'js-event d-flex justify-content-between align-items-center list-group-item p-0',
                        html: `<div class="flex-fill">${eventHtml}</div><div><div class="btn-group-vertical btn-group-sm" role="group"></div></div>`
                    }).appendTo(eventList);
                    getEventButtons(container, event, eventWrapper.find('.btn-group-vertical'));
                    eventWrapper.data('event', event);
                });
            }

            setTimeout(function () {
                $(container).trigger('shown-event-list', [events]);
            }, 0);

        }

        /**
         * Retrieves the event buttons for a given container, event, and wrap.
         *
         * @param {jQuery} container - The jQuery object representing the container element.
         * @param {Object} event - The event object.
         * @param {jQuery} wrap - The jQuery object representing the wrap element.
         */
        function getEventButtons(container, event, wrap) {
            let settings = $(container).data('settings');
            let editable = !event.hasOwnProperty('editable') || event.editable;
            let deletable = !event.hasOwnProperty('deletable') || event.deletable;
            if (settings.showEventEditButton && editable) {
                let editButton = $('<a>', {
                    href: '#',
                    class: eventEditButton.class,
                    html: `<i class="${settings.icons.eventEdit}"></i>`
                }).appendTo(wrap);

                editButton.on('click', function (e) {
                    e.preventDefault();
                    settings.onClickEditEvent(e, event);
                });
            }
            if (settings.showEventRemoveButton && deletable) {
                let removeButton = $('<a>', {
                    href: '#',
                    class: eventRemoveButton.class,
                    html: `<i class="${settings.icons.eventRemove}"></i>`
                }).appendTo(wrap);

                removeButton.on('click', function (e) {
                    e.preventDefault();
                    settings.onClickDeleteEvent(e, event);
                });
            }
        }

        /**
         * Initializes the container and triggers the 'init' event.
         *
         * @returns {*} Returns the container element.
         */
        function init() {
            if (!container.data('init')) {
                container.data('current', new Date());
                drawCalendar();
                events();

                container.data('init', true);
                container.trigger('init');
            }
            return container;
        }

        if (isMethodSet) {
            switch (options) {
                case 'updateOptions': {
                    const beforeOptions = container.data('settings');
                    const newOptions = $.extend(true, beforeOptions, params || {});
                    Date.setLocale(newOptions.locale);
                    const dateAfter = container.data('current');
                    container.data('settings', newOptions);
                    container.empty();
                    drawTemplate(container);
                    drawCalendar(dateAfter);
                    break;
                }
                case 'refresh': {
                    container.empty();
                    const dateAfter = container.data('current');
                    drawTemplate(container);
                    drawCalendar(dateAfter);
                    break;
                }
                case 'setDate': {
                    const dateAfter = new Date(params);
                    container.data('current', dateAfter);
                    drawCalendar(dateAfter);
                    break;
                }
            }
        }

        return init();
    };
}(jQuery));