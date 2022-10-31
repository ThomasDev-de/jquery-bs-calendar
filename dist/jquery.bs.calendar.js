/* global moment */
(function ($) {
    $.bsCalendar = {
        setDefault: function (prop, value) {
            this.DEFAULTS[prop] = value;
        },
        getDefaults: function (container) {
            this.DEFAULTS.url = container.data('target') || container.data('bsTarget') || this.DEFAULTS.url;
            return this.DEFAULTS;
        },
        DEFAULTS: {
            url: null,
            width: 300,
            weekdays: ['M', 'D', 'M', 'D', 'F', 'S', 'S'],
            months: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
            icons: {
                prev: 'fa-solid fa-arrow-left fa-fw',
                next: 'fa-solid fa-arrow-right fa-fw',
            },
            eventButtons: [{
                title: 'edit event',
                class: 'btn btn-link',
                icon: 'fa-solid fa-edit fa-fw',
                click: function (e, event) {
                    console.log('event btn clicked', event);
                }
            }, {
                title: 'remove event',
                class: 'btn btn-link',
                icon: 'fa-solid fa-trash fa-fw',
                click: function (e, event) {
                    console.log('event btn clicked', event);
                }
            }],
            formatEvent: function (event) {
                return drawEvent(event);
            },
            formatNoEvent: function (date) {
                return drawNoEvent(date);
            }
        }
    };

    moment.locale("de", {
        week: {
            dow: 1
        }
    });
    moment.locale("de");

    function formatDate(date) {
        let date_arr = date.split('-');
        return date_arr[2] + '.' + date_arr[1] + '.' + date_arr[0];
    }

    function formatTime(time) {
        return time.substring(0, 5);
    }


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
        <div class="d-flex flex-column" style="font-size:.8em">
            <h6 class="mb-0 text-uppercase">${event.title}</h6>
            <small class="text-muted">${s} - ${e}</small>
            ${desc}
        </div>
        `;
    }

    function drawNoEvent() {
        return `
        <div class="p-4 bg-light text-bg-light border border-dark rounded">
        <h6 class="mb-0 text-uppercase">Keine Termine</h6>
        </div>
        `;
    }

    function drawTemplate(container) {
        let settings = container.data('settings');

        container
            .css({'width': settings.width})
            .addClass('bg-white')
            .html(`
            <div class="d-flex flex-nowrap justify-content-between align-items-center">
                <a href="#" class="btn btn-link btn-prev-month"><i class="${settings.icons.prev}"></i></a>
                <span class="month-name"></span>
                <a href="#" class="btn btn-link btn-next-month"><i class="${settings.icons.next}"></i></a>
            </div>
            <div class="d-flex flex-nowrap align-items-center js-weekdays bg-light">
                <div class="text-center bg-light"></div>
            </div>
             <div class="js-weeks"></div>
            <div class="dates"></div>
            <div class="pt-2 js-collapse" style="display: none">
                <div class="text-center font-weight-bold py-2 js-dayname"></div>
                <div class="js-events border border-secondary rounded m-1"></div>
            </div>
        `);

        let cellWidthHeight = container.width() / 8; // 7 days + calendar week
        let fontSize = cellWidthHeight / 3; // 7 days + calendar week
        let cellCss = {
            color: '#adadad',
            lineHeight: cellWidthHeight + 'px',
            fontSize: fontSize + 'px',
            height: cellWidthHeight,
            width: cellWidthHeight,
        };
        container.find('.js-weekdays div:first').css(cellCss);

        settings.weekdays.forEach(wd => {
            $('<div>', {
                html: wd,
                class: 'text-center bg-light',
                css: cellCss,
            }).appendTo(container.find('.js-weekdays'));
        });
    }

    $.fn.bsCalendar = function (options) {

        const container = $(this);
        const today = moment();
        let xhr = null;
        let current = today.clone();


        let settings = $.extend($.bsCalendar.getDefaults(container), options || {});

        if (container.data('init') !== true) {
            container.data('settings', $.extend($.bsCalendar.getDefaults(container), options || {}));
            drawTemplate(container);
        }


        let cellWidthHeight = container.width() / 8; // 7 days + calendar week
        let fontSize = cellWidthHeight / 3; // 7 days + calendar week


        // let containerCalendar = $('<div>').appendTo(container);
        let calendar = [];


        function getEvents(selected, callback) {
            if (xhr) {
                xhr.abort();
                xhr = null;
            }

            if (!settings.url) {
                callback([]);
            } else {
                xhr = $.get(settings.url, {
                    from: selected.clone().startOf('month').startOf('week').format('YYYY-MM-DD'),
                    to: selected.clone().endOf('month').endOf('week').format('YYYY-MM-DD')
                }, function (events) {
                    container.trigger('events-loaded', [events]);
                    callback(events || []);
                }, 'json');
            }
        }

        function drawCalendar(selected) {

            let wrap =  container.find('.js-weeks').empty();
            const startDay = selected.clone().startOf('month').startOf('week');
            const endDay = selected.clone().endOf('month').endOf('week');

            let date = startDay.clone().subtract(1, 'day');

            container.find('.month-name').html(settings.months[selected.format('M') - 1] + ' ' + selected.format('YYYY'));

            calendar = [];
            while (date.isBefore(endDay, 'day'))
                calendar.push({
                    days: Array(7).fill(0).map(() => date.add(1, 'day').clone())
                });

            calendar.forEach(week => {
                let weekContainer = $('<div>', {
                    class: 'd-flex flex-nowrap'
                }).appendTo(wrap);

                // calendar week
                $('<div>', {
                    class: 'd-flex justify-content-center align-items-center js-cal-row fs-6 bg-light',
                    css: {
                        color: '#adadad',
                        width: cellWidthHeight,
                        height: cellWidthHeight
                    },
                    html: [
                        '<small class="text-center mb-0">' + week.days[0].format('w') + '</small>'
                    ].join('')
                }).appendTo(weekContainer);


                week.days.forEach(day => {
                    let isToday = today.format('DDMMYYYY') === day.format('DDMMYYYY');
                    let inMonth = selected.format('MM') === day.format('MM');
                    let cellBackground = isToday ? 'bg-primary text-bg-primary' : (inMonth ? ' bg-white ' : ' bg-white fs-6 fw-small');
                    let cellTextColor = inMonth ? 'var(--bs-dark)' : '#adadad';
                    let highlight = !isToday ? '' : ' js-today ';
                    let col = $('<div>', {
                        'data-date': day.format('YYYY-MM-DD'),
                        class: 'position-relative d-flex border border-white rounded-circle justify-content-center align-items-center' + highlight + cellBackground,
                        css: {
                            color: cellTextColor,
                            cursor: 'pointer',
                            width: cellWidthHeight,
                            height: cellWidthHeight
                        },
                        html: [
                            '<small style="font-size:' + fontSize + 'px">' + day.format('D') + '</small>',
                            [
                                '<small class="js-count-events position-absolute text-center rounded-circle" style="width:4px; height:4px; bottom:4px; left: 50%; margin-left:-2px">',

                                '</small>'
                            ].join('')
                        ].join('')
                    }).appendTo(weekContainer);
                    col.data('events', []);

                });
                // console.log(week.days);
            });

            let haveEventsToday = false;

            getEvents(selected, function (events) {
                events.forEach(event => {
                    let start = moment(event.start);
                    let end = moment(event.end);

                    let curDate = start.clone();
                    let currDaysFormatted;
                    do {

                        currDaysFormatted = curDate.format('YYYYMMDD');

                        if (false === haveEventsToday && (currDaysFormatted === today.format('YYYYMMDD'))) {
                            haveEventsToday = true;
                        }

                        let column = container.find('[data-date="' + curDate.format('YYYY-MM-DD') + '"]');
                        if (column.length) {
                            let dataEvents = column.data('events');
                            dataEvents.push(event);
                            let highlightClass = column.hasClass('js-today') ? 'bg-white' : 'bg-dark';
                            column
                                .data('events', dataEvents)
                                .find(`.js-count-events`)
                                .addClass(highlightClass)
                            // .text(dataEvents.length);
                        }
                        curDate = curDate.clone().add(1, 'days');
                    } while (currDaysFormatted < end.format('YYYYMMDD'));
                });

                if (haveEventsToday) {
                    container.find('.js-today').click();
                }

                // console.log(events);
            });
        }

        function events() {
            container
                .on('click', '.btn-close-events', function (e) {
                    e.preventDefault();
                    container.find('.js-collapse').hide();
                })
                .on('click', '.btn-current-month', function (e) {
                    e.preventDefault();
                    current = today.clone();
                    drawCalendar(current);
                    container.find('.js-collapse').hide();
                })
                .on('click', '.js-event', function (e) {
                    let event = $(e.currentTarget).data('event');
                    container.trigger('click-event', [event]);
                })
                .on('click', '.btn-prev-month', function (e) {
                    e.preventDefault();
                    current = current.clone().subtract(1, 'months');
                    drawCalendar(current);
                    container.find('.js-collapse').hide();
                })
                .on('click', '.btn-next-month', function (e) {
                    e.preventDefault();
                    current = current.clone().add(1, 'M')
                    drawCalendar(current);
                    container.find('.js-collapse').hide();
                })
                .on('click', '[data-date]', function (e) {
                    let $column = $(e.currentTarget);
                    container.find('.js-weeks').find('[data-date].border-secondary').removeClass('border-secondary').addClass('border-white');
                    $column.removeClass('border-white').addClass('border-secondary')
                    let date = moment($column.data('date'));
                    let events = $column.data('events');
                    container.find('.js-dayname').html(date.format('DD.MM.YYYY'));
                    drawEventList(events, date);
                    container.find('.js-collapse').show();
                    container.trigger('change-day', [date, events]);
                });
        }
        function drawEventList(events, date) {
            let eventList = $('.js-events')
            eventList.empty();
            if (!events.length) {
                $('<div>', {
                    class: '',
                    html: settings.formatNoEvent(date)
                }).appendTo(eventList);
                return;
            }

            events.forEach(event => {
                let eventHtml = settings.formatEvent(event);

                let eventWrapper = $('<div>', {
                    class: 'js-event d-flex justify-content-between align-items-center px-2 mb-1',
                    html: `
                        <div class="flex-fill">${eventHtml}</div>
                        <div>
                            <div class="btn-group-vertical btn-group-sm" role="group" aria-label="Vertical button group"></div>
                        </div>
                       
                    `
                }).appendTo(eventList);
                getEventButtons(event, eventWrapper.find('.btn-group-vertical'));
                eventWrapper.data('event', event);

            });
        }

        function getEventButtons(event, wrap) {
            settings.eventButtons.forEach(btn => {
                let button = $('<a>', {
                    href: '#',
                    class: btn.class,
                    html: `<i class="${btn.icon}"></i>`
                })
                button.appendTo(wrap);
                button.on('click', function (e) {
                    btn.click(e, event)
                })
            });
        }

        function init() {

            drawCalendar(today);

            events();

            container.trigger('init', []);

            return container;
        }

        return init();
    };
}(jQuery));