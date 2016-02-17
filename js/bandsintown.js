
bandsintown = {

  app: function() {

    // Required Js
    var required_js = '/js/materialize.min.js';

    // Append Required JS
    if (!$('head script[src="' + required_js + '"]').length > 0) {
      $('head').append('<script type="text/javascript" src="' + required_js + '"></script>');
    }



    // Required CSS
    var required_css = [
      'http://fonts.googleapis.com/icon?family=Material+Icons',
      '/css/materialize.min.css',
      '/css/bandsintown.min.css'
    ];


    // Append Required CSS
    var i = 0;
    var css_html = '';

    $(required_css).each(function () {
      if (!$('head link[href="' + required_css[i] + '"]').length > 0) {
        css_html += '<link href="' + required_css[i] + '" rel="stylesheet">';
      }
      ++i;
    });

    $('head').append(css_html);




    // Destination
    var destination = bandsintown_setup.destination;


    // Initial Form
    var heading_html =
    '<div class="headings event column_wrapper">' +
    '   <div class="date">Date</div>' +
    '   <div class="main_container column_wrapper">' +
    '     <div class="details_container column_wrapper">' +
    '       <div class="city">City</div>' +
    '       <div class="venue">Venue</div>' +
    '       <div class="description">Details</div>' +
    '     </div>' +
    '     <div class="tickets">Tickets</div>' +
    '   </div>' +
    '</div>'



    var news_qty = '';
    var news_qty_last = '';
    var timeframe = '';


    // Document Ready
    $(document).ready(function() {


      // Timeframe setup
      if(bandsintown_setup.timeframe == 'past') {

        // get yesterday's date
        Date.prototype.yyyymmdd = function() {
            var yyyy = this.getFullYear().toString();
            var mm = (this.getMonth()+1).toString();
            var dd  = (this.getDate()-1).toString();
            return yyyy + '-' + (mm[1]?mm:"0"+mm[0]) + '-' + (dd[1]?dd:"0"+dd[0]);
        };

        d = new Date();
        var yesterdays_date = d.yyyymmdd();
        timeframe = '2015-01-01,' + yesterdays_date;

      } else {
          timeframe = 'upcoming';
      }


      $.ajax({
          url: 'http://api.bandsintown.com/artists/' + bandsintown_setup.artist_name + '/events.json?api_version=2.0&app_id=wmc&date=' + timeframe,
          jsonp: "callback",
          dataType: "jsonp",

          success: function (bit) {

            // console.log(bit);

            if(timeframe == 'upcoming') {
              bandsintown_loop(bit);
            } else {
              bandsintown_loop(bit.reverse());
            }
          }
      });

    }); // End Document Ready




    // Build Loop
    function bandsintown_loop(bit) {
      var i = 0;
      // var html = '';
      var show_html = '<p class="no_dates center-align">There are currently no tour dates.</p>';

      $(bit).each(function () {

        //Date

        var date_split = bit[i].datetime.split('T');
        var Date_ugly = date_split[0].split(' ');
        var Date_string = JSON.stringify(Date_ugly[0]);

        var Date_noquotes_prep = Date_string.split('"');
        var Date_noquotes = Date_noquotes_prep[1];
        var pretty_date = Date_pretty(Date_noquotes);


        //Tickets
        var ticket_html = '';
        if(bit[i].ticket_status != 'unavailable') {
           ticket_html =  '<a href="' + bit[i].ticket_url + '" target="_blank" class="waves-effect waves-light btn">Tickets</a>';
        }


        // Row link on mobile
        var link_class = '';
        if($(window).width() < 768) {
          if(bit[i].ticket_url != null){
              link_class = ' link';
          }
        }

        //Description
        var description = '&nbsp;';
        if(bit[i].description != '') {
          if(bit[i].description != null) {
            description = bit[i].description;
          }
        }

        //Display
        var display_class = '';
        if(i > bandsintown_setup.display) {
          display_class = ' hide';
        }



        if (bit.length != 0) {
          show_html +=
            '<div class="event column_wrapper' + display_class + '">' +
            '   <div class="date">' + pretty_date + '</div>' +
            '   <div class="main_container column_wrapper">' +
            '     <div class="details_container column_wrapper">' +
            '       <div class="city">' + bit[i].formatted_location + '</div>' +
            '       <div class="venue">' +  bit[i].venue.name + '</div>' +
            '       <div class="description small">' +  description + '</div>' +
            '     </div>' +
            '     <div class="tickets">' + ticket_html + '</div>' +
            '   </div>' +
            '</div>'
          ;
          ++i;



        }

      });


      $(destination).html('<div class="bandsintown_pkg" style="display: none;">' + heading_html + show_html + '</div>');


      // Hide No Date
      if (bit.length != 0) {
        $('.no_dates').css('display', 'none');
      }

      more_button();
    }




    // Show More Button
    function more_button() {
      var hide_count = $('.bandsintown_pkg .hide').length;
      if(hide_count > 0){
        $(bandsintown_setup.destination).find('.bandsintown_pkg').append('<button class="view_more btn waves-effect waves-light">View More</button>');
      }
    }





    // More button click
    $(document).on('click', '.bandsintown_pkg .view_more', function() {

      if(bandsintown_setup.view_more != '') {
        window.open(bandsintown_setup.view_more, '_self');
      } else {

        $('.bandsintown_pkg').find('.event').removeClass('hide');
        $('.bandsintown_pkg').find('.view_more').remove();
      }
    });



    // Date_Pretty
    function Date_pretty(Date_ugly) {

      var Months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec'
      ];

      var Ugly_split = Date_ugly.split('-');
      var Month_ugly = Ugly_split[1];
      var Year_ugly = Ugly_split[0];
      var Day_ugly = Ugly_split[2];


      var Month_pretty = Months[Month_ugly - 1];

      var d = new Date();
      var Year_current = d.getFullYear();

      var Date_pretty = '';
      if(Year_ugly > Year_current){
        Date_pretty = '<span class="month_day">' + Month_pretty + ' '  + Day_ugly + '</span>' +
        '<span class="year">' + Year_ugly + '</span>';

      } else {
        Date_pretty = '<span class="month_day">' + Month_pretty + ' ' + Day_ugly + '</span>';
      }

      return Date_pretty;

    };  // End Date_Pretty

  } //end app

};
