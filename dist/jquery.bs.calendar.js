/* global moment */
(function ($) {
    $.fn.bsCalendar = function (options) {

        const container = $(this);

        let xhr = null;

        let settings = $.extend(true, {
            url: container.data('url') || null,
            width: 310,
            weekdays: ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'],
            months: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
        }, options || {});

        container.css({'width': settings.width}).addClass('bg-white  border-top');

        let cellWidthHeight = (settings.width - 30) / 7; // 7 days + calendar week

        let containerCalendarHeader = $('<div>', {class: 'd-flex flex-nowrap bg-primary text-white align-items-center'}).appendTo(container);
        let containerCalendar = $('<div>').appendTo(container);
        let containerCalendarFooter = $('<div>', {class: 'd-flex flex-nowrap justify-content-center align-items-center pt-1'}).appendTo(container);
        let calendar = [];
        let containerHeader, btnPrev, btnNext, monthName, dayName, btnCloseCollapse, btnCurrMonth, table, collapse;

        const today = moment();
        let current = today.clone();

        function buildNavbar() {

            containerHeader = $('<div>', {
                class: 'd-flex flex-nowrap justify-content-between align-items-center border-right'
            }).prependTo(container);

            btnPrev = $('<a>', {
                href: '#',
                html: '<i class="fa-solid fa-arrow-left fa-fw"></i>',
                class: 'btn btn-link'
            }).appendTo(containerHeader);

            monthName = $('<div>', {
                html: '',
            }).appendTo(containerHeader);

            btnNext = $('<a>', {
                href: '#',
                html: '<i class="fa-solid fa-arrow-right fa-fw"></i>',
                class: 'btn btn-link'
            }).appendTo(containerHeader);

        }

        function buildTable() {
            collapse = $('<div>', {
                class: 'p-2 border',
                css: {display: 'none'}
            }).appendTo(container);

            dayName = $('<div>', {
                class: 'text-center font-weight-bold py-2'
            }).appendTo(collapse);

            table = $('<table>', {
                class: 'table table-sm'
            }).appendTo(collapse);

            let div = $('<div>', {
                class: 'd-flex justify-content-end'
            }).appendTo(collapse);

            btnCloseCollapse = $('<a>', {
                href: '#',
                class: 'btn btn-sm btn-outline-dark',
                html: '<i class="fas fa-times fa-fw"></i> Schließen'
            }).appendTo(div);

            table.bootstrapTable({
                classes: 'table table-sm table-hover table-striped',
                sidePagination: 'client',
                paginationVAlign: 'bottom',
                onPostBody: () => {
                    triggerChange();
                },
                formatNoMatches: () => {
                    return `Keine Termine!`;
                },
                formatShowingRows: (pageFrom, pageTo, totalRows) => {
                    return pageFrom + ' bis ' + pageTo + ' von ' + totalRows + ' Terminen';
                },
                pagination: true,
                showHeader: false,
                // cardView: true,
                columns: [
                    // {
                    //     field: 'id',
                    //     class: 'text-nowrap p-1  text-center',
                    //     width: 50,
                    //     formatter: (id, event) => {
                    //         let s, e;
                    //         let startDate = event.start.split(' ')[0];
                    //         let endDate = event.end.split(' ')[0];
                    //         if (startDate === endDate) {
                    //             s = formatTime(event.start.split(' ')[1]);
                    //             e = formatTime(event.end.split(' ')[1]);
                    //         } else {
                    //             s = formatDate(startDate);
                    //             e = formatDate(endDate);
                    //         }
                    //
                    //         return `<small>${s}<br>${e}</small>`;
                    //
                    //     }
                    // },
                    {
                        class: 'p-1 text-nowrap',
                        field: 'title',
                        formatter: (title, event) => {
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


                            return [
                                `<small class="badge badge-primary">${s} - ${e}</small>`,
                                `<strong>${title}</strong>`,
                                event.description,
                            ].join('<br>');

                        }
                    },
                    {
                        class: 'p-1',
                        field: 'link',
                        align: 'right',
                        formatter: (link, event) => {
                            if (link)
                                return `<a class="btn btn-sm py-1 btn-link" href="${link}" target="_blank"><i class="fa-solid fa-lg fa-video fa-fw text-primary"></i></a>`;

                            if (event.zoom && event.zoom.link !== null) {
                                let zoomId = event.zoom.id === null ? '' : `ID: ${event.zoom.id}`;
                                let zoomPW = event.zoom.password === null ? '' : `ID: ${event.zoom.password}`;
                                return `
                                    <div class="d-flex flex-column">
                                        <a class="btn btn-sm py-1 text-primary btn-link" href="${event.zoom.link}" target="_blank">
                                            <i class="fa-solid fa-lg fa-video fa-fw"></i> Zoom
                                        </a>
                                        ${zoomId}
                                        ${zoomPW}
                                    </div>`;
                            }

                            if (event.room)
                                return `<small>${event.room.room}</small>`;

                            return '';

                        }
                    }
                ]
            });
        }

        function triggerChange() {
            container.trigger(`change`);
        }

        function formatDate(date) {
            let date_arr = date.split('-');
            return date_arr[2] + '.' + date_arr[1] + '.' + date_arr[0];
        }

        function formatTime(time) {
            return time.substring(0, 5);
        }

        function buildCalendarHeader() {

            $('<div>', {
                html: '<small>KW</small>',
                class: 'text-center py-1',
                css: {
                    width: 30,
                },
            }).appendTo(containerCalendarHeader);

            settings.weekdays.forEach(wd => {
                $('<div>', {
                    html: '<small>' + wd + '</small>',
                    class: 'text-center py-1',
                    css: {
                        width: cellWidthHeight,
                    },
                }).appendTo(containerCalendarHeader);
            });
        }

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
                    callback(events || []);
                }, 'json');
            }
        }

        function drawCalendar(selected) {

            containerCalendar.empty();
            const startDay = selected.clone().startOf('month').startOf('week');
            const endDay = selected.clone().endOf('month').endOf('week');

            let date = startDay.clone().subtract(1, 'day');

            monthName.html(settings.months[selected.format('M') - 1] + ' ' + selected.format('YYYY'));

            calendar = [];
            while (date.isBefore(endDay, 'day'))
                calendar.push({
                    days: Array(7).fill(0).map(() => date.add(1, 'day').clone())
                });

            calendar.forEach(week => {

                let weekContainer = $('<div>', {
                    class: 'd-flex flex-nowrap border-bottom'
                }).appendTo(containerCalendar);

                // calendar week
                $('<div>', {
                    class: 'p-1 d-flex justify-content-center align-items-center border-right js-cal-row border-left bg-light',
                    css: {
                        width: 30,
                        height: cellWidthHeight
                    },
                    html: [
                        '<small class=" text-muted text-center mb-0">' + week.days[0].format('w') + '</small>'
                    ].join('')
                }).appendTo(weekContainer);


                week.days.forEach(day => {
                    let isToday = today.format('DDMMYYYY') === day.format('DDMMYYYY');
                    let inMonth = selected.format('MM') === day.format('MM');
                    let cellBackground = isToday ? '' : (inMonth ? ' bg-white ' : ' bg-light text-muted');
                    let highlight = !isToday ? '' : ' js-today ';
                    let col = $('<div>', {
                        'data-date': day.format('YYYY-MM-DD'),
                        class: 'p-1 d-flex position-relative flex-column border-right ' + highlight + cellBackground,
                        css: {
                            cursor: 'pointer',
                            width: cellWidthHeight,
                            height: cellWidthHeight
                        },
                        html: [
                            !isToday
                                ? '<small class="text-right">' + day.format('D') + '</small>'
                                : '<small class="position-absolute text-center rounded-circle bg-primary text-light" style="width:20px; line-height: 20px; height:20px; top:2px; right: 2px">' + day.format('D') + '</small>',
                            [
                                '<small class="js-count-events position-absolute text-center rounded-circle" style="width:20px; line-height: 20px; height:20px; bottom:2px; left: 2px">',

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
                    let days = 1;
                    let curDaysFormatted;
                    do {

                        curDaysFormatted = curDate.format('YYYYMMDD');

                        if (false === haveEventsToday && (curDaysFormatted === today.format('YYYYMMDD'))) {
                            haveEventsToday = true;
                        }

                        let column = container.find('[data-date="' + curDate.format('YYYY-MM-DD') + '"]');
                        if (column.length) {
                            let dataEvents = column.data('events');
                            dataEvents.push(event);
                            column
                                .data('events', dataEvents)
                                .find(`.js-count-events`)
                                .addClass('bg-warning text-white')
                                .text(dataEvents.length);
                        }
                        curDate = curDate.clone().add(days, 'days');
                    } while (curDaysFormatted < end.format('YYYYMMDD'));
                });

                if (haveEventsToday) {
                    container.find('.js-today').click();
                }

                console.log(events);
            });
        }

        function drawCalendarFooter() {
            btnCurrMonth = $('<a>', {
                href: '#',
                class: 'btn btn-link btn-sm p-0',
                html: '<i class="fa-solid fa-location-crosshairs fa-fw"></i> aktueller Monat'
            }).appendTo(containerCalendarFooter);
        }

        function events() {
            btnCloseCollapse
                .on('click', function (e) {
                    e.preventDefault();
                    collapse.hide();
                    triggerChange();
                });
            btnPrev
                .on('click', function (e) {
                    e.preventDefault();
                    current = current.clone().subtract(1, 'months');
                    drawCalendar(current);
                    table.bootstrapTable('removeAll')
                    collapse.hide();
                    triggerChange();
                });

            btnCurrMonth
                .on('click', function (e) {
                    e.preventDefault();
                    current = today.clone();
                    drawCalendar(current);
                    table.bootstrapTable('removeAll')
                    collapse.hide();
                    triggerChange();
                });

            btnNext
                .on('click', function (e) {
                    e.preventDefault();
                    current = current.clone().add(1, 'M')
                    drawCalendar(current);
                    table.bootstrapTable('removeAll')
                    collapse.hide();
                    triggerChange();
                });
            containerCalendar
                .on('click', '[data-date]', function (e) {
                    let $column = $(e.currentTarget);
                    let date = moment($column.data('date'));
                    dayName.html(date.format('DD.MM.YYYY'));
                    // container.find('[data-date]').removeClass('bg-danger');
                    table.bootstrapTable('load', $(e.currentTarget).data('events'));
                    collapse.show();
                    // $(e.currentTarget).addClass('bg-danger');
                    triggerChange();
                });
        }

        function init() {
            buildNavbar();
            buildCalendarHeader();
            drawCalendar(today);
            drawCalendarFooter();
            buildTable();
            events();

            return container;
        }

        init();
    };
}(jQuery));