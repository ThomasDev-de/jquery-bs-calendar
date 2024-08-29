// noinspection DuplicatedCode,JSUnresolvedReference

(function ($) {

    // noinspection JSUnusedGlobalSymbols
    /**
     * Represents the jQuery plugin bsCalendar.
     *
     * @class
     */
    $.bsCalendar = {
        setDefaults(o = {}) {
            this.DEFAULTS = $.extend(true, this.DEFAULTS, o || {})
        }, setDefault(prop, value) {
            this.DEFAULTS[prop] = value;
        }, getDefaults() {
            return this.DEFAULTS;
        }, DEFAULTS: {
            locale: 'en',
            url: null,
            width: '300px',
            icons: {
                prev: 'bi bi-chevron-left',
                next: 'bi bi-chevron-right'
            },
            classes: {
                table: 'table tables-sm table-borderless',
                tableHeaderCell: 'text-muted fw-lighter',
                tableHeaderCellActive: 'text-warning fw-bold',
                tableData: {
                    all: 'rounded-circle w-100 h-100 border',
                    today: 'text-bg-primary',
                    hover: 'opacity-75',
                    active: 'border-secondary',
                    inMonth: 'fw-bold',
                    notInMonth: 'text-muted fw-small border-0 opacity-25',
                    eventCounter: 'start-50 bottom-0 translate-middle-x text-bg-danger rounded-pill'
                }
            },
            showTodayHeader: true,
            popoverConfig: {
                animation: false,
                html: true,
                delay: 400,
                placement: 'top',
                trigger: 'hover'
            },
            event: {
                formatter(event) {
                    return drawEvent(event);
                },
                events: null
            },
            eventListContainer: null,
            formatPopoverContent(events) {
                return '<div class="list-group list-group-flush">' + events.map(e => {
                    return `<div class="list-group-itemp p-1">${e.title}</div>`;
                }).join('') + '</div>'
            }, formatNoEvent(date) {
                return drawNoEvent(date);
            }, queryParams(params) {
                return params;
            }, onClickEditEvent(e, event) {  // @deprecated
            }, onClickDeleteEvent(e, event) {  // @deprecated
            },
        }
    };

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
            weekday: abbreviation ? 'short' : 'long', timeZone: 'UTC'
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
            month: abbreviation ? 'short' : 'long', timeZone: 'UTC'
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
            month: abbreviation ? 'short' : 'long', timeZone: 'UTC'
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
            weekday: abbreviation ? 'short' : 'long', timeZone: 'UTC'
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
        let day = d.getDay(), diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
        return new Date(d.setDate(diff));
    }

    /**
     * Determine the previous Monday of the current date
     * @returns {Date}
     */
    Date.prototype.getFirstDayOfWeek = function () {
        let d = this.copy();
        let day = d.getDay(), diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
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
        let d = new Date(this.valueOf()), month = '' + (d.getMonth() + 1), day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

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

    /**
     * Formats a given date into a string representation.
     *
     * @param {Date} date - The date object to be formatted.
     * @return {string} - The formatted date string.
     */
    function getFormattedDate(date) {
        return `${date.getDate()}. ${date.getMonthName()} ${date.getFullYear()}`;
    }

    /**
     * Retrieves the font size based on the width and height of the container element.
     *
     * @param {jQuery} containerElement - The container element to calculate the font size for.
     * @returns {number} The calculated font size.
     */
    function getFontSize(containerElement) {
        const widthHeight = getCellWidthHeight(containerElement);
        return widthHeight / 3;
    }

    /**
     * Calculates the width and height of a cell within the provided container element.
     *
     * @param {jQuery} containerElement - The container element in which the cell is located.
     * @return {number} - The calculated width and height of the cell.
     */
    function getCellWidthHeight(containerElement) {
        return containerElement.width() / 8; // 7 days + calendar week
    }

    /**
     * Draws a template for the calendar in the specified container.
     * @param {jQuery} container - The container element where the template will be drawn.
     * @return {void}
     */
    function drawTemplate(container) {

        let settings = container.data('settings');


        let todayHeader = '';
        if (settings.showTodayHeader) {
            let today = new Date();
            todayHeader = `
                <div class="p-3 d-flex flex-column">
				    <small>${today.getDayName()}</small>
				    <h4 class="mb-0">${getFormattedDate(today)}</h4>
			    </div>
            `;
        }

        let eventListContainer;
        let list = '';
        if (settings.eventListContainer === null) {
            list = `
                 <div class="p-2 js-collapse d-none">
                    <div class="mb-0 rounded-0" style="width: 100%">
                        <div class="text-center fw-bold py-2 js-day-name bg-transparent"></div>
                        <div class="js-events list-group list-group-flush"></div>
                    </div>
                </div>
        `;
        } else {
            eventListContainer = `
                 <div class="js-collapse d-none">
                    <div class="text-center fw-bold py-2 js-day-name bg-transparent"></div>
                    <div class="js-events list-group list-group-flush"></div>
                </div>
            `;
            $(settings.eventListContainer).html(eventListContainer);
        }

        container
            // .width(settings.width)
            // .css({width: settings.width})
            .html(`
                    ${todayHeader}
                    <div class="d-flex flex-nowrap justify-content-between align-items-center p-2">
                        <a href="#" class="btn btn-link text-decoration-none btn-prev-month"><i class="${settings.icons.prev}"></i></a>
                        <a href="#" class="btn btn-link text-decoration-none  mx-1 flex-fill btn-curr-month month-name"></a>
                        <a href="#" class="btn btn-link text-decoration-none  btn-next-month"><i class="${settings.icons.next}"></i></a>
                    </div>
                    <table class="${settings.classes.table}">
                        <thead><tr><th class="text-center align-middle">
                        </th></tr></thead> 
                        <tbody></tbody>
                    </table>
                    <div class="js-weeks"></div>
                    <div class="dates"></div>
                   ${list}
        `);

        const table = container.find('table:first');
        const tableHeadTr = table.find('thead tr:first');

        Date.getDayNames(true).forEach(wd => {
            $('<th>', {
                class: `js-day-name-short ${settings.classes.tableHeaderCell}`,
                css: getCellCss(container),
                html: wd
            }).appendTo(tableHeadTr);
        });
    }

    /**
     * Highlights the day name in the given container.
     * @param {jQuery} container - The container element where the day name will be highlighted.
     * @return {void}
     */
    function highlightDayName(container) {
        const settings = container.data('settings');
        const highlightClasses = settings.classes.tableHeaderCellActive;
        const iSeeToday = container.find('.js-today').length !== 0;
        const wrap = container.find('table thead');
        wrap.find('.js-day-name-short').removeClass(highlightClasses);
        if (iSeeToday) {
            wrap.find('.js-day-name-short:eq(' + (container.find('.js-today').index() - 1) + ')').removeClass('text-muted')
                .addClass(highlightClasses);
        }

    }

    function getCellCss(containerElement) {
        const widthHeight = getCellWidthHeight(containerElement);
        return {
            // borderRadius: '50%',
            'text-align': 'center',
            'vertical-align': 'middle',
            width: widthHeight + 'px',
            height: widthHeight + 'px',
            fontSize: getFontSize(containerElement)
        }
    }

    function getCellInner(innerHTML) {
        return `${innerHTML}`;
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
        const CONTAINER_WRAPPER_CLASS = '.bootstrap-calendar-container';
        const container = $(this);
        let xhr = null;

        let isMethodSet = typeof options === 'string';

        let calendar = [];


        // noinspection JSUnusedLocalSymbols
        /**
         * Checks if the current theme is dark mode.
         *
         * @return {boolean} Returns true if the current theme is dark mode, and false otherwise.
         */
        function isDarkMode() {
            return container.data('bsTheme') === 'dark' || (container.closest('[data-bs-theme]').length && container.closest('[data-bs-theme]').data('bsTheme') === 'dark');
        }

        /**
         * Retrieves events from a server based on the provided parameters.
         *
         * @param {jQuery} container - The container element where the events will be loaded.
         * @param {Date} selected - The selected date for which events should be retrieved.
         * @param {function} callback - The callback function to be called with the retrieved events.
         * @return {void}
         */
        function getEvents(container, selected, callback) {
            const setup = container.data('settings');
            let data = {
                from: selected.clone().getFirstDayOfMonth().getFirstDayOfWeek().formatDate(false),
                to: selected.clone().getLastDayOfMonth().getLastDayOfWeek().formatDate(false)
            };

            if (!setup.url) {
                callback([]);
            } else if (typeof setup.url === "function") {
                setup.url(setup.queryParams(data)).then(callback);
            } else if (typeof setup.url === "string") {
                if (xhr) {
                    xhr.abort();
                    xhr = null;
                }

                // noinspection JSUnusedGlobalSymbols
                xhr = $.ajax({
                    async: true,
                    url: setup.url,
                    dataType: 'json',
                    data: setup.queryParams(data),
                    success: function (events) {
                        container.trigger('events-loaded', [events]);
                        callback(events || []);
                    }
                });
            }
        }


        /**
         * Draw a calendar based on a selected date
         * @param {jQuery|$} containerElement - The wrapper
         * @param {Date|null|undefined} selectedDate - The selected date to display the calendar for
         */
        function drawCalendar(containerElement, selectedDate = null) {
            const settings = containerElement.data('settings');
            const table = containerElement.find('table:first');
            const tableBody = table.find('tbody').empty();
            let forceDate = true;
            if (!selectedDate) {
                forceDate = false;
                selectedDate = containerElement.data('current');
            }
            // let activeDate = $(containerElement).find('[data-date].active').length ? $(containerElement).find('[data-date].active').data('date') : null;

            let wrap = $(containerElement).find('.js-weeks').empty();
            const startDay = selectedDate.clone().getFirstDayOfMonth().getMonday();
            const endDay = selectedDate.clone().getLastDayOfMonth().getSunday();

            let date = startDay.clone().subDays(1);

            $(containerElement).find('.month-name').html(selectedDate.getMonthName() + ' ' + selectedDate.getFullYear());

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
            let foundToday = false;
            const widthHeight = getCellWidthHeight(containerElement);
            calendar.forEach(week => {
                const tr = $('<tr>').appendTo(tableBody);
                let w = week.days[0].getWeek();
                let highlight_week = currentYear === week.days[0].getFullYear() && currentWeek === w;
                let highlightClass = highlight_week ? settings.classes.tableHeaderCellActive : settings.classes.tableHeaderCell;

                $('<div>', {
                    class: 'd-flex flex-nowrap'
                }).appendTo(wrap);

                $('<th>', {
                    text: w,
                    class: 'text-center ' + highlightClass,
                    css: getCellCss(containerElement)
                }).appendTo(tr);
                week.days.forEach(day => {
                    const classes = [settings.classes.tableData.all];
                    const isToday = today.formatDate(false) === day.formatDate(false);
                    const isInMonth = selectedDate.formatDate(true)[1] === day.formatDate(true)[1];
                    if (isToday) {
                        foundToday = true;
                        classes.push(settings.classes.tableData.today);
                        classes.push('js-today');
                    }
                    if (isInMonth) {
                        classes.push(settings.classes.tableData.inMonth)
                    } else {
                        classes.push(settings.classes.tableData.notInMonth);
                    }
                    const dayTD = $('<td>', {
                        class: 'position-relative p-1',
                        'data-date': day.formatDate(false),
                        css: getCellCss(containerElement)
                    }).appendTo(tr);
                    const addClasses = classes.join(' ');
                    let html = getCellInner(
                        '<div class="d-flex js-cell-inner justify-content-center align-items-center ' + addClasses + '"><span>' + day.formatDate(true)[2] + '</span></div>' +
                        '<small class="js-count-events position-absolute"></small>'
                    );
                    dayTD.html(html)

                    dayTD.data('events', []);
                });


            });

            highlightDayName(containerElement);

            getEvents(containerElement, selectedDate, function (events) {

                const setup = container.data('settings');

                // empty the event list before
                $(containerElement).find('[data-date]').each(function (i, e) {
                    $(e).data('events', [])
                });

                events.forEach(event => {
                    const start = new Date(event.start);
                    const end = new Date(event.end);

                    let curDate = start.clone();
                    let currDaysFormatted;

                    do {

                        currDaysFormatted = curDate.formatDate(false);

                        let column = $(containerElement).find('[data-date="' + curDate.formatDate(false) + '"]');
                        let dataEvents = [];
                        if (column.length) {
                            dataEvents = column.data('events');
                            dataEvents.push(event);
                            column
                                .data('events', dataEvents)
                                .find(`.js-count-events`)
                                .addClass(setup.classes.tableData.eventCounter)
                                .height(4)
                                .width(4);
                        }

                        if (column.length && dataEvents.length && typeof setup.popoverConfig === 'object') {
                            $(column).popover('dispose');
                            const popoverContent = setup.formatPopoverContent(dataEvents)
                            const popoverSetup = $.extend(setup.popoverConfig || {}, {
                                title: '<small>' + getFormattedDate(curDate) + '</small>', content: popoverContent
                            });
                            column.popover(popoverSetup);
                        }

                        curDate = curDate.clone().addDays(1);

                    } while (currDaysFormatted < end.formatDate(false));
                });

                if (widthHeight >= 55) {
                    $(containerElement).find('[data-date]').each(function (i, e) {
                        const count = $(e).data('events').length;
                        if (count) {
                            $(e).find('.js-count-events').css({
                                fontSize: '9px',
                                height: '16px',
                                width: '16px',
                                lineHeight: '16px',
                                color: 'white',
                                left: 'calc(50% - 8px)',
                                bottom: '1px',
                                margin: 0
                            }).text(count);
                        }

                    });
                }


                if (forceDate) {
                    let year = selectedDate.getFullYear();
                    let month = ("0" + (selectedDate.getMonth() + 1)).slice(-2); // add leading zero
                    let day = ("0" + selectedDate.getDate()).slice(-2); // add leading zero

                    let formattedDate = year + '-' + month + '-' + day;

                    $(containerElement).find('[data-date="' + formattedDate + '"]').trigger('click');
                } else if (foundToday) {
                    $(containerElement).find('.js-today').trigger('click');
                }
            });
        }

        /**
         * Attach event listeners to the container element.
         * Triggers various events when specific actions are performed.
         *
         * @return {void}
         */
        function events(containerElement) {
            const settings = $(containerElement).data('settings');
            let eventTypes = [
                'click',
                'change',
                'focus',
                'blur',
                'keydown',
                'keyup',
                'submit',
                'touchstart',
                'touchmove',
                'touchend',
                'touchcancel',
                'mouseenter',
                'mouseleave',
                'mousedown',
                'mouseup'
            ];

            // If the events were integrated outside the calendar container,
            // the events must be fired on the external container
            const eventListContainer =
                settings.eventListContainer !== null && $(settings.eventListContainer).length
                    ? $(settings.eventListContainer)
                    : $(containerElement);

            eventListContainer
                .on(eventTypes.join(' '), '.js-event', function (e) {
                    let target = $(e.target);
                    let $column = $(e.currentTarget);
                    let event = $column.data('event');
                    if (settings.event.events && typeof settings.event.events === "object") {
                        for (let key in settings.event.events) {
                            let eventType_selector = key.split(' ');
                            let eventType = eventType_selector[0];
                            let selector = eventType_selector[1];
                            let element = target.closest(selector);
                            if (e.type === eventType && element.length) {
                                e.stopPropagation();
                                settings.event.events[key].call(this, e, event, element);
                            }
                        }
                    }
                })

            containerElement
                .on('click', '.btn-prev-month', function (e) {
                    e.preventDefault();
                    const btn = $(e.currentTarget);
                    let container2 = btn.closest(CONTAINER_WRAPPER_CLASS);
                    const dateBefore = container2.data('current');
                    const dateAfter = dateBefore.clone().subMonths(1);
                    container2.data('current', dateAfter);
                    drawCalendar(container2, dateAfter);
                    const c = settings.eventListContainer !== null ? $(settings.eventListContainer) : container2;
                    c.find('.js-collapse:not(.d-none)').addClass('d-none');
                    container2.triggerAll('click-prev-month change-month');
                })
                .on('click', '.btn-curr-month', function (e) {
                    e.preventDefault();
                    const btn = $(e.currentTarget);
                    let container2 = btn.closest(CONTAINER_WRAPPER_CLASS);
                    const dateAfter = new Date();
                    container2.data('current', dateAfter);
                    drawCalendar(container2, dateAfter);
                    const c = settings.eventListContainer !== null ? $(settings.eventListContainer) : container2;
                    c.find('.js-collapse:not(.d-none)').addClass('d-none');
                    container2.triggerAll('click-current-month change-month');
                })
                .on('click', '.btn-next-month', function (e) {
                    e.preventDefault();
                    const btn = $(e.currentTarget);
                    let container2 = btn.closest(CONTAINER_WRAPPER_CLASS);
                    const dateBefore = container2.data('current');
                    const dateAfter = dateBefore.clone().addMonths(1);
                    container2.data('current', dateAfter)

                    drawCalendar(container2, dateAfter);
                    const c = settings.eventListContainer !== null ? $(settings.eventListContainer) : container2;
                    c.find('.js-collapse:not(.d-none)').addClass('d-none');
                    container2.triggerAll('click-next-month change-month');
                })
                .on('mouseenter touchstart', '[data-date] .js-cell-inner', function (e) {
                    const cell = $(e.currentTarget);
                    let container2 = cell.closest(CONTAINER_WRAPPER_CLASS);
                    container2.find('.js-cell-inner').removeClass(settings.classes.tableData.hover);
                    cell.addClass(settings.classes.tableData.hover);
                })
                .on('mouseleave touchend', '[data-date]', function (e) {
                    if (typeof settings.popoverConfig === 'object') {
                        $(e.currentTarget).popover('hide');
                    }
                    const cell = $(e.currentTarget);
                    let container2 = cell.closest(CONTAINER_WRAPPER_CLASS);
                    container2.find('[data-date]').removeClass(settings.classes.tableData.hover);
                })
                .on('click', '[data-date]', function (e) {
                    let $column = $(e.currentTarget);
                    let $cellInner = $column.find('.js-cell-inner');
                    let container2 = $column.closest(CONTAINER_WRAPPER_CLASS);
                    container2.find('[data-date] .js-cell-inner.active').removeClass('active ' + settings.classes.tableData.active);
                    $cellInner.not('.js-today').addClass('active ' + settings.classes.tableData.active);
                    let date = new Date($column.data('date'));
                    let events = $column.data('events');
                    container2.data('current', date);
                    container2.find('.js-day-name').html(date.showDateFormatted());
                    const c = settings.eventListContainer !== null ? $(settings.eventListContainer) : container2;
                    drawEventList(container2, events, date);

                    c.find('.js-collapse.d-none').removeClass('d-none');
                    container2.trigger('change-day', [date, events]);
                });
        }

        /**
         * Draws the event list in the specified container with the given events and date.
         *
         * @param {jQuery} containerElement - The DOM element (jQuery object) where the event list will be displayed.
         * @param {array} events - An array of events to be displayed in the event list.
         * @param {Date} date - The date used for formatting purposes.
         */
        function drawEventList(containerElement, events, date) {
            $(containerElement).trigger('show-event-list', [events]);
            const setup = containerElement.data('settings');
            const c = setup.eventListContainer !== null ? $(setup.eventListContainer) : containerElement;
            let eventList = c.find('.js-events');
            eventList.empty();
            if (!events.length) {
                $('<div>', {
                    class: 'list-group-item', html: setup.formatNoEvent(date)
                }).appendTo(eventList);
            } else {

                events.forEach(event => {
                    let eventHtml = setup.event.formatter(event);

                    let eventWrapper = $('<div>', {
                        class: 'js-event d-flex justify-content-between align-items-center list-group-item p-0',
                        html: `<div class="flex-fill">${eventHtml}</div><div><div class="btn-group-vertical btn-group-sm" role="group"></div></div>`
                    }).appendTo(eventList);
                    // getEventButtons(containerElement, event, eventWrapper.find('.btn-group-vertical'));
                    eventWrapper.data('event', event);
                });
            }

            $(containerElement).trigger('shown-event-list', [events]);


        }

        /**
         * Initializes the container and triggers the 'init' event.
         *
         * @returns {*} Returns the container element.
         */
        function init() {
            if (!container.data('init')) {
                container.addClass(CONTAINER_WRAPPER_CLASS.substring(1) + ' user-select-none');
                container.data('current', new Date());
                let settings = $.extend(true, {}, $.bsCalendar.DEFAULTS, options || {});

                // Manually overriding the URL if options.url is a function.
                // This single line of code is a concise way
                // to determine the URL by checking multiple possible sources in sequence,
                // using options.url as the primary source,
                // followed by the data-target or data-bsTarget attributes,
                // and finally falling back to a default value.
                settings.url = typeof options === 'object'
                    ? (options.url ?? container.data('target')) || container.data('bsTarget') || $.bsCalendar.DEFAULTS.url
                    : null;

                Date.setLocale(settings.locale);
                container.data('settings', settings);
                container.css('width', settings.width);
                drawTemplate(container);
                drawCalendar(container);
                events(container);

                container.data('init', true);
                container.trigger('init');
            }
            return container;
        }


        /**
         * Refreshes the calendar with the provided parameters.
         *
         * @param {jQuery} c - The calendar container element.
         * @param {Object|string|number} p - The parameters to configure the calendar.
         * @return {void}
         */
        function refresh(c, p) {
            c.empty();
            const dateAfter = c.data('current');
            drawTemplate(c);
            if (!p) {
                drawCalendar(c, dateAfter);
            } else {
                setDate(c, p)
            }
        }

        /**
         * Sets the date of the calendar and updates it accordingly.
         *
         * @param {jQuery} c - The calendar element.
         * @param {String|Number|Date} p - The new date to set.
         * @return {void}
         */
        function setDate(c, p) {
            const dateAfter = new Date(p);
            c.data('current', dateAfter);
            drawCalendar(c, dateAfter);
        }

        /**
         * Updates the options for a given element.
         *
         * @param {jQuery} c - The jQuery object representing the element.
         * @param {Object} p - The new options to be merged with the current settings.
         * @return {void}
         */
        function updateOptions(c, p) {
            const currentSettings = c.data('settings');
            const newSettings = $.extend(true, currentSettings, p || {});
            Date.setLocale(newSettings.locale);
            const currentDate = c.data('current');
            c.data('settings', newSettings);
            c.empty();
            drawTemplate(c);
            drawCalendar(c, currentDate);
        }

        init();

        if (isMethodSet) {
            switch (options) {
                case 'updateOptions': {
                    updateOptions(container, params);
                    break;
                }
                case 'refresh': {
                    refresh(container, params);
                    break;
                }
                case 'setDate': {
                    setDate(container, params);
                    break;
                }
                default:
                    console.log('methodName not found');
            }
        }

        return container;
    };
}(jQuery));
