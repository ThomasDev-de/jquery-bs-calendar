/* global moment */
//! moment-holiday.js locale configuration
//! locale : Germany
//! author : Kodie Grantham : https://github.com/kodie
/* regions :
      BB : Brandenburg
      BW : Baden-Württemberg
      BY : Bayern
      HE : Hessen
      MV : Mecklenburg-Vorpommern
      NW : Nordrhein-Westfalen
      RP : Rheinland-Pfalz
      SN : Sachsen
      SL : Saarland
      ST : Sachsen-Anhalt
      TH : Thüringen
*/

// (function() {
//     var moment = (typeof require !== 'undefined' && require !== null) && !require.amd ? require('moment') : this.moment;
//
//     moment.holidays.germany = {
//         "Neujahrstag": {
//             date: '1/1',
//             keywords: ['new', 'year']
//         },
//         "Karfreitag": {
//             date: 'easter-2',
//             keywords: ['good', 'friday']
//         },
//         "Ostersonntag": {
//             date: 'easter',
//             keywords: ['easter'],
//             keywords_n: ['monday'],
//             regions: ['bb']
//         },
//         "Ostermontag": {
//             date: 'easter+1',
//             keywords: ['easter', 'monday']
//         },
//         "Heilige Drei Könige": {
//             date: '1/6',
//             keywords: ['konige'],
//             regions: ['bw', 'by', 'st']
//         },
//         "Maifeiertag": {
//             date: '5/1'
//         },
//         "Christi Himmelfahrt": {
//             date: 'easter+39',
//             kaywords: ['ascension']
//         },
//         "Pfingstsonntag": {
//             date: 'easter+49',
//             keywords: ['pentecost'],
//             regions: ['bb']
//         },
//         "Pfingstmontag": {
//             date: 'easter+50',
//             keywords: ['whit', 'monday']
//         },
//         "Fronleichnam": {
//             date: 'easter+60',
//             keywords: ['corpus', 'christi'],
//             regions: ['bw', 'by', 'he', 'nw', 'rp', 'sl']
//         },
//         "Mariä Himmelfahrt": {
//             date: '8/15',
//             keywords: ['maria'],
//             regions: ['sl']
//         },
//         "Tag der deutschen Einheit": {
//             date: '10/3'
//         },
//         "Reformationstag": {
//             date: '10/31',
//             regions: ['bb', 'mv', 'sn', 'st', 'th']
//         },
//         "Allerheiligen": {
//             date: '11/1',
//             regions: ['bw', 'by', 'nw', 'rp', 'sl']
//         },
//         "Buß- und Bettag": {
//             date: '11/(3,[17])',
//             keywords: ['bub'],
//             regions: ['sn']
//         },
//         "Weihnachten": {
//             date: '12/24',
//             keywords: ['christmas']
//         },
//         "Zweiter Weihnachtsfeiertag": {
//             date: '12/26',
//             keywords_y: ['zweiter']
//         }
//     };
//
//     if ((typeof module !== 'undefined' && module !== null ? module.exports : void 0) != null) { module.exports = moment; }
// }).call(this);

(function ($) {
    moment.locale("de",{
        week: {
            dow: 1
        }
    });
    moment.locale("de");
    function getDefaults(container) {
        return {
            url: container.data('bsTarget') || null,
            width: 300,
            type: 'inline',
            weekdays: ['M', 'D', 'M', 'D', 'F', 'S', 'S'],
            months: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
            icons: {
                prev: 'fa-solid fa-arrow-left fa-fw',
                next: 'fa-solid fa-arrow-right fa-fw',
            },
            eventButtons: [{
                title: 'edit event',
                class: 'btn btn-outline-dark',
                icon: 'fa-solid fa-edit fa-fw',
                click: function (e, event) {
                    console.log('event btn clicked', event);
                }
            },{
                title: 'remove event',
                class: 'btn btn-outline-dark',
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
    }

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


        // return [
        //     `<small class="badge badge-primary">${s} - ${e}</small>`,
        //     `<strong>${title}</strong>`,
        //     event.description,
        // ].join('<br>');
        return `
        <div class="d-flex flex-column" style="font-size:.8em">
            <h6 class="mb-0 text-uppercase">${event.title}</h6>
            <small class="text-muted">${s} - ${e}</small>
            ${desc}
        </div>
        `;
    }

    function drawNoEvent(date) {
        return `
        <div class="p-4 bg-light text-bg-light border border-dark rounded">
        <h6 class="mb-0 text-uppercase">Keine Termine</h6>
        </div>
        `;
    }

    $.fn.bsCalendar = function (options) {

        const container = $(this);
        let xhr = null;

        let settings = $.extend( getDefaults(container), options || {});

        container.css({'width': settings.width}).addClass('bg-white shadow rounded');

        let cellWidthHeight = (settings.width) / 8; // 7 days + calendar week

        let containerCalendarHeader = $('<div>', {
            css: {
                color: '#adadad'
            },
            class: 'd-flex flex-nowrap align-items-center'
        }).appendTo(container);
        let containerCalendar = $('<div>').appendTo(container);
        let containerCalendarFooter = $('<div>', {class: 'd-flex flex-nowrap justify-content-center align-items-center pt-1'}).appendTo(container);
        let calendar = [];
        let containerHeader, btnPrev, btnNext, monthName, dayName, btnCloseCollapse, btnCurrMonth, eventList, collapse;

        const today = moment();
        let current = today.clone();

        function buildNavbar() {

            containerHeader = $('<div>', {
                class: 'd-flex flex-nowrap justify-content-between align-items-center'
            }).prependTo(container);

            btnPrev = $('<a>', {
                href: '#',
                html: '<i class="' + settings.icons.prev + '"></i>',
                class: 'btn btn-link'
            }).appendTo(containerHeader);

            monthName = $('<div>', {
                html: '',
            }).appendTo(containerHeader);

            btnNext = $('<a>', {
                href: '#',
                html: '<i class="' + settings.icons.next + '"></i>',
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

            eventList = $('<div>', {
                class: ''
            }).appendTo(collapse);

            let div = $('<div>', {
                class: 'd-flex justify-content-end'
            }).appendTo(collapse);

            btnCloseCollapse = $('<a>', {
                href: '#',
                class: 'btn btn-sm btn-outline-dark',
                html: '<i class="fas fa-times fa-fw"></i> Schließen'
            }).appendTo(div);

            // eventList.bootstrapTable({
            //     classes: 'eventList eventList-sm eventList-hover eventList-striped',
            //     sidePagination: 'client',
            //     paginationVAlign: 'bottom',
            //     onPostBody: () => {
            //         triggerChange();
            //     },
            //     formatNoMatches: () => {
            //         return `Keine Termine!`;
            //     },
            //     formatShowingRows: (pageFrom, pageTo, totalRows) => {
            //         return pageFrom + ' bis ' + pageTo + ' von ' + totalRows + ' Terminen';
            //     },
            //     pagination: true,
            //     showHeader: false,
            //     // cardView: true,
            //     columns: [
            //         // {
            //         //     field: 'id',
            //         //     class: 'text-nowrap p-1  text-center',
            //         //     width: 50,
            //         //     formatter: (id, event) => {
            //         //         let s, e;
            //         //         let startDate = event.start.split(' ')[0];
            //         //         let endDate = event.end.split(' ')[0];
            //         //         if (startDate === endDate) {
            //         //             s = formatTime(event.start.split(' ')[1]);
            //         //             e = formatTime(event.end.split(' ')[1]);
            //         //         } else {
            //         //             s = formatDate(startDate);
            //         //             e = formatDate(endDate);
            //         //         }
            //         //
            //         //         return `<small>${s}<br>${e}</small>`;
            //         //
            //         //     }
            //         // },
            //         {
            //             class: 'p-1 text-nowrap',
            //             field: 'title',
            //             formatter: (title, event) => {
            //                 let s, e;
            //                 let startDate = event.start.split(' ')[0];
            //                 let endDate = event.end.split(' ')[0];
            //                 if (startDate === endDate) {
            //                     s = formatTime(event.start.split(' ')[1]);
            //                     e = formatTime(event.end.split(' ')[1]);
            //                 } else {
            //                     s = formatDate(startDate);
            //                     e = formatDate(endDate);
            //                 }
            //
            //
            //                 return [
            //                     `<small class="badge badge-primary">${s} - ${e}</small>`,
            //                     `<strong>${title}</strong>`,
            //                     event.description,
            //                 ].join('<br>');
            //
            //             }
            //         },
            //         {
            //             class: 'p-1',
            //             field: 'link',
            //             align: 'right',
            //             formatter: (link, event) => {
            //                 if (link)
            //                     return `<a class="btn btn-sm py-1 btn-link" href="${link}" target="_blank"><i class="fa-solid fa-lg fa-video fa-fw text-primary"></i></a>`;
            //
            //                 if (event.zoom && event.zoom.link !== null) {
            //                     let zoomId = event.zoom.id === null ? '' : `ID: ${event.zoom.id}`;
            //                     let zoomPW = event.zoom.password === null ? '' : `ID: ${event.zoom.password}`;
            //                     return `
            //                         <div class="d-flex flex-column">
            //                             <a class="btn btn-sm py-1 text-primary btn-link" href="${event.zoom.link}" target="_blank">
            //                                 <i class="fa-solid fa-lg fa-video fa-fw"></i> Zoom
            //                             </a>
            //                             ${zoomId}
            //                             ${zoomPW}
            //                         </div>`;
            //                 }
            //
            //                 if (event.room)
            //                     return `<small>${event.room.room}</small>`;
            //
            //                 return '';
            //
            //             }
            //         }
            //     ]
            // });
        }

        function triggerChange() {
            container.trigger(`change`);
        }


        function buildCalendarHeader() {

            $('<div>', {
                html: '',
                class: 'text-center  bg-light',
                css: {
                    lineHeight: cellWidthHeight,
                    fontSize: '.8em',
                    height: cellWidthHeight,
                    width: cellWidthHeight,
                },
            }).appendTo(containerCalendarHeader);

            settings.weekdays.forEach(wd => {
                $('<div>', {
                    html: wd,
                    class: 'text-center bg-light',
                    css: {
                        lineHeight: cellWidthHeight + 'px',
                        fontSize: '.8em',
                        height: cellWidthHeight,
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
                    container.trigger('events-loaded', [events]);
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
                    class: 'd-flex flex-nowrap'
                }).appendTo(containerCalendar);

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
                            '<small style="font-size:.8em">' + day.format('D') + '</small>',
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
                    // triggerChange();
                });
            btnPrev
                .on('click', function (e) {
                    e.preventDefault();
                    current = current.clone().subtract(1, 'months');
                    drawCalendar(current);
                    // eventList.bootstrapTable('removeAll')
                    collapse.hide();
                    // triggerChange();
                });

            btnCurrMonth
                .on('click', function (e) {
                    e.preventDefault();
                    current = today.clone();
                    drawCalendar(current);
                    // eventList.bootstrapTable('removeAll')
                    collapse.hide();
                    // triggerChange();
                });

            btnNext
                .on('click', function (e) {
                    e.preventDefault();
                    current = current.clone().add(1, 'M')
                    drawCalendar(current);
                    // eventList.bootstrapTable('removeAll')
                    collapse.hide();
                    // triggerChange();
                });
            containerCalendar
                .on('click', '[data-date]', function (e) {
                    let $column = $(e.currentTarget);
                    containerCalendar.find('[data-date].border-secondary').removeClass('border-secondary').addClass('border-white');
                    $column.removeClass('border-white').addClass('border-secondary')
                    let date = moment($column.data('date'));
                    let events = $column.data('events');
                    dayName.html(date.format('DD.MM.YYYY'));
                    drawEventList(events, date)
                    // container.find('[data-date]').removeClass('bg-danger');
                    // eventList.bootstrapTable('load', $(e.currentTarget).data('events'));
                    collapse.show();
                    // $(e.currentTarget).addClass('bg-danger');
                    container.trigger('change-day', [date, events]);
                    // triggerChange();
                });

            container.on('click', '.js-event', function (e) {
                let event = $(e.currentTarget).data('event');
                container.trigger('click-event', [event]);
            })
        }


        function drawEventList(events, date) {
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
                    class: 'js-event d-flex justify-content-between align-items-center p-2 rounded border border-dark mb-1',
                    html: `
                        <div class="flex-fill">${eventHtml}</div>
                        <div>
                            <div class="btn-group-vertical btn-group-sm" role="group" aria-label="Vertical button group"></div>
                        </div>
                       
                    `
                }).appendTo(eventList);
                let actionButtons = getEventButtons(event, eventWrapper.find('.btn-group-vertical'));
                eventWrapper.data('event', event);

            });
        }

        function getEventButtons(event, wrap) {
            let arr = [];
            settings.eventButtons.forEach(btn => {
                let button = $('<a>', {
                    href: '#',
                    class: btn.class,
                    html: `<i class="${btn.icon}"></i>`
                })
                button.appendTo(wrap);
                button.on('click', function(e){
                    btn.click(e, event)
                })
            });
        }

        function init() {

            buildNavbar();
            buildCalendarHeader();
            drawCalendar(today);
            drawCalendarFooter();
            buildTable();
            events();

            container.trigger('init', []);

            return container;
        }

        init();
    };
}(jQuery));