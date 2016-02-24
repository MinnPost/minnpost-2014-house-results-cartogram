
define('text!../bower.json',[],function () { return '{\n  "name": "minnpost-2014-house-results-cartogram",\n  "version": "0.0.0",\n  "main": "index.html",\n  "homepage": "https://github.com/minnpost/minnpost-2014-house-results-cartogram",\n  "repository": {\n    "type": "git",\n    "url": "https://github.com/minnpost/minnpost-2014-house-results-cartogram"\n  },\n  "bugs": "https://github.com/minnpost/minnpost-2014-house-results-cartogram/issues",\n  "license": "MIT",\n  "author": {\n    "name": "MinnPost",\n    "email": "data@minnpost.com"\n  },\n  "dependencies": {\n    "ractive-transitions-fade": "~0.1.2",\n    "leaflet": "~0.7.3",\n    "ractive": "~0.5.6",\n    "ractive-events-tap": "~0.1.1",\n    "ractive-backbone": "~0.1.1",\n    "requirejs": "~2.1.15",\n    "almond": "~0.3.0",\n    "text": "~2.0.12",\n    "underscore": "~1.7.0",\n    "jquery": "~1.11.1",\n    "backbone": "~1.1.2",\n    "rgrove-lazyload": "*",\n    "minnpost-styles": "master"\n  },\n  "devDependencies": {\n    "qunit": "~1.15.0"\n  },\n  "dependencyMap": {\n    "requirejs": {\n      "rname": "requirejs",\n      "js": [\n        "requirejs/require"\n      ]\n    },\n    "almond": {\n      "rname": "almond",\n      "js": [\n        "almond/almond"\n      ]\n    },\n    "text": {\n      "rname": "text",\n      "js": [\n        "text/text"\n      ]\n    },\n    "jquery": {\n      "rname": "jquery",\n      "js": [\n        "jquery/dist/jquery"\n      ],\n      "returns": "$"\n    },\n    "underscore": {\n      "rname": "underscore",\n      "js": [\n        "underscore/underscore"\n      ],\n      "returns": "_"\n    },\n    "backbone": {\n      "rname": "backbone",\n      "js": [\n        "backbone/backbone"\n      ],\n      "returns": "Backbone"\n    },\n    "rgrove-lazyload": {\n      "rname": "lazyload",\n      "js": [\n        "rgrove-lazyload/lazyload"\n      ],\n      "returns": "Lazyload"\n    },\n    "ractive": {\n      "rname": "ractive",\n      "js": [\n        "ractive/ractive-legacy"\n      ],\n      "returns": "Ractive"\n    },\n    "ractive-backbone": {\n      "rname": "ractive-backbone",\n      "js": [\n        "ractive-backbone/ractive-adaptors-backbone"\n      ],\n      "returns": "RactiveBackbone"\n    },\n    "ractive-events-tap": {\n      "rname": "ractive-events-tap",\n      "js": [\n        "ractive-events-tap/ractive-events-tap"\n      ],\n      "returns": "RactiveEventsTap"\n    },\n    "ractive-transitions-fade": {\n      "rname": "ractive-transitions-fade",\n      "js": [\n        "ractive-transitions-fade/ractive-transitions-fade"\n      ],\n      "returns": "RactiveTransitionsFade"\n    },\n    "leaflet": {\n      "rname": "leaflet",\n      "js": [\n        "leaflet/dist/leaflet-src"\n      ],\n      "css": [\n        "leaflet/dist/leaflet"\n      ],\n      "images": [\n        "leaflet/dist/images"\n      ],\n      "returns": "L"\n    },\n    "minnpost-styles": {\n      "rname": "mpStyles",\n      "css": [\n        "//netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.css",\n        "minnpost-styles/dist/minnpost-styles"\n      ],\n      "sass": [\n        "minnpost-styles/styles/main"\n      ]\n    },\n    "mpConfig": {\n      "rname": "mpConfig",\n      "js": [\n        "minnpost-styles/dist/minnpost-styles.config"\n      ],\n      "returns": "mpConfig"\n    },\n    "mpFormatters": {\n      "rname": "mpFormatters",\n      "js": [\n        "minnpost-styles/dist/minnpost-styles.formatters"\n      ],\n      "returns": "mpFormatters"\n    },\n    "mpMaps": {\n      "rname": "mpMaps",\n      "js": [\n        "minnpost-styles/dist/minnpost-styles.maps"\n      ],\n      "returns": "mpMaps"\n    }\n  },\n  "resolutions": {\n    "underscore": ">=1.5.0"\n  }\n}\n';});

/**
 * Base class(es) for applications.
 */

// Create main application
define('base',['jquery', 'underscore', 'backbone', 'lazyload', 'mpFormatters', 'text!../bower.json'],
  function($, _, Backbone, Lazyload, formatters, bower) {
  'use strict';

  var Base = {};
  bower = JSON.parse(bower);

  // Base App constructor
  Base.BaseApp = function(options) {
    // Attach options
    this.options = _.extend(this.baseDefaults || {}, this.defaults || {}, options || {});
    this.name = this.options.name;

    // Handle element if in options
    if (this.options.el) {
      this.el = this.options.el;
      this.$el = $(this.el);
      this.$ = function(selector) { return this.$el.find(selector); };
    }

    // Determine paths and get assesets
    this.determinePaths();
    this.renderAssests();

    // Run an initializer once CSS has been loaded
    this.on('cssLoaded', function() {
      this.initialize.apply(this, arguments);
    });
  };

  // Extend with Backbone Events and other properties
  _.extend(Base.BaseApp.prototype, Backbone.Events, {
    // Attach bower info
    bower: bower,

    // Default options
    baseDefaults: {
      jsonpProxy: '//mp-jsonproxy.herokuapp.com/proxy?url=',
      availablePaths: {
        local: {
          css: ['.tmp/css/main.css'],
          images: 'images/',
          data: 'data/'
        },
        build: {
          css: [
            'dist/[[[PROJECT_NAME]]].libs.min.css',
            'dist/[[[PROJECT_NAME]]].latest.min.css'
          ],
          images: 'dist/images/',
          data: 'dist/data/'
        },
        deploy: {
          css: [
            '//s3.amazonaws.com/data.minnpost/projects/' +
              '[[[PROJECT_NAME]]]/[[[PROJECT_NAME]]].libs.min.css',
            '//s3.amazonaws.com/data.minnpost/projects/' +
              '[[[PROJECT_NAME]]]/[[[PROJECT_NAME]]].latest.min.css'
          ],
          images: '//s3.amazonaws.com/data.minnpost/projects/[[[PROJECT_NAME]]]/images/',
          data: '//s3.amazonaws.com/data.minnpost/projects/[[[PROJECT_NAME]]]/data/'
        }
      }
    },

    // Determine paths.  A bit hacky.
    determinePaths: function() {
      var query;

      // Only handle once
      if (_.isObject(this.options.paths) && !_.isUndefined(this.options.deployment)) {
        return this.options.paths;
      }

      // Deploy by default
      this.options.deployment = 'deploy';

      if (window.location.host.indexOf('localhost') !== -1) {
        this.options.deployment = 'local';

        // Check if a query string forces something
        query = this.parseQueryString();
        if (_.isObject(query) && _.isString(query.mpDeployment)) {
          this.options.deployment = query.mpDeployment;
        }
      }

      this.options.paths = this.options.availablePaths[this.options.deployment];
      return this.options.paths;
    },

    // Get assests.  We use the rgrove lazyload library since it is simple
    // and small, but it is unmaintained.
    renderAssests: function() {
      var thisApp = this;
      var scripts = [];

      // Add CSS from bower dependencies
      _.each(this.bower.dependencyMap, function(c, ci) {
        if (c.css) {
          _.each(c.css, function(s, si) {
            // If local, add script, else only add external scripts
            if (thisApp.options.deployment === 'local') {
              s = (s.match(/^(http|\/\/)/)) ? s : 'bower_components/' + s + '.css';
              scripts.push(thisApp.makePath(s));
            }
            else if (s.match(/^(http|\/\/)/)) {
              scripts.push(thisApp.makePath(s));
            }
          });
        }
      });

      // Add app CSS
      _.each(this.options.paths.css, function(c, ci) {
        scripts.push(thisApp.makePath(c));
      });

      // Load and fire event when done
      Lazyload.css(scripts, function() {
        this.trigger('cssLoaded');
      }, null, this);
    },

    // Make path
    makePath: function(path) {
      path = path.split('[[[PROJECT_NAME]]]').join(this.name);
      if (this.options.basePath && !path.match(/^(http|\/\/)/)) {
        path = this.options.basePath + path;
      }
      return path;
    },

    // Override Backbone's ajax call to use JSONP by default as well
    // as force a specific callback to ensure that server side
    // caching is effective.
    overrideBackboneAJAX: function() {
      Backbone.ajax = function() {
        var options = arguments[0];
        if (options.dataTypeForce !== true) {
          return this.jsonpRequest(options);
        }
        return Backbone.$.ajax.apply(Backbone.$, [options]);
      };
    },

    // Unfortunately we need this more often than we should
    isMSIE: function() {
      var match = /(msie) ([\w.]+)/i.exec(navigator.userAgent);
      return match ? parseInt(match[2], 10) : false;
    },

    // Read query string
    parseQueryString: function() {
      var assoc  = {};
      var decode = function(s) {
        return decodeURIComponent(s.replace(/\+/g, " "));
      };
      var queryString = location.search.substring(1);
      var keyValues = queryString.split('&');

      _.each(keyValues, function(v, vi) {
        var key = v.split('=');
        if (key.length > 1) {
          assoc[decode(key[0])] = decode(key[1]);
        }
      });

      return assoc;
    },

    // Wrapper for a JSONP request, the first set of options are for
    // the AJAX request, while the other are from the application.
    //
    // JSONP is hackish, but there are still data sources and
    // services that we don't have control over that don't fully
    // support CORS
    jsonpRequest: function(options) {
      options.dataType = 'jsonp';

      // If no callback, use proxy
      if (this.options.jsonpProxy && options.url.indexOf('callback=') === -1) {
        options.jsonpCallback = 'mpServerSideCachingHelper' +
          formatters.hash(options.url);
        options.url = this.options.jsonpProxy + encodeURIComponent(options.url) +
          '&callback=' + options.jsonpCallback;
        options.cache = true;
      }

      return $.ajax.apply($, [options]);
    },


    // Project data source handling for data files that are not
    // embedded in the application itself.  For development, we can call
    // the data directly from the JSON file, but for production
    // we want to proxy for JSONP.
    //
    // Takes single or array of paths to data, relative to where
    // the data source should be.
    //
    // Returns jQuery's defferred object.
    dataRequest: function(datas) {
      var thisApp = this;
      var useJSONP = false;
      var defers = [];
      datas = (_.isArray(name)) ? datas : [ datas ];

      // If the data path is not relative, then use JSONP
      if (this.options.paths.data.indexOf('http') === 0) {
        useJSONP = true;
      }

      // Go through each file and add to defers
      _.each(datas, function(d) {
        var defer = (useJSONP) ?
          thisApp.jsonpRequest(thisApp.options.paths.data + d) :
          $.getJSON(thisApp.options.paths.data + d);
        defers.push(defer);
      });

      return $.when.apply($, defers);
    },

    // Empty initializer
    initialize: function() { }
  });

  // Add extend from Backbone
  Base.BaseApp.extend = Backbone.Model.extend;


  return Base;
});


define('text!templates/application.mustache',[],function () { return '<div class="application-container">\n  <div class="message-container"></div>\n\n  <div class="content-container">\n\n\n    <div class="row">\n      <div class="cartogram column-medium-66">\n        <table class="arrangement">\n          <tbody>\n            {{#aRows:ar}}\n              <tr>\n                {{#aColumns:ac}}\n                  <td>\n                    <div\n                      on-tap="selectDistrict:{{ r[a[f.padLeft(ac) + f.padLeft(ar)]] }}"\n                      class="grid\n                        {{#(a[f.padLeft(ac) + f.padLeft(ar)])}}has-value{{/()}}\n                        bg-color-political-{{ r[a[f.padLeft(ac) + f.padLeft(ar)]].winner_party.toLowerCase() }}\n                        {{#(r[a[f.padLeft(ac) + f.padLeft(ar)]].party_flip)}}flipped{{/()}}\n                        {{#(r[a[f.padLeft(ac) + f.padLeft(ar)]].district === district.district)}}active{{/()}}\n                      "\n                      style="\n                        width: {{ gs }}px;\n                        height: {{ gs }}px;\n                        font-size: {{ gs * 0.3 }}px;\n                        line-height: {{ gs * 0.9 }}px;\n                      "\n                        title="District {{ r[a[f.padLeft(ac) + f.padLeft(ar)]].district }}">\n                      {{ r[a[f.padLeft(ac) + f.padLeft(ar)]].district }}\n                    </div>\n                  </td>\n                {{/aColumns}}\n              </tr>\n            {{/aRows}}\n\n            <tr class="place-labels">\n              <td colspan="8">Greater Minnesota</td>\n              {{#(!sizeSmall || (sizeSmall && ac < as))}}\n                <td colspan="{{ aColumns.length - 8 }}">Metro area</td>\n              {{/()}}\n            </tr>\n          </tbody>\n        </table>\n\n        <div class="legend">\n          <div class="legend-item">\n            <div class="legend-r"></div> GOP win\n          </div>\n\n          <div class="legend-item">\n            <div class="legend-r-flip"></div> Flip to GOP\n          </div>\n\n          <div class="legend-item">\n            <div class="legend-d"></div> DFL win\n          </div>\n\n          <div class="legend-item">\n            <div class="legend-d-flip"></div> Flip to DFL\n          </div>\n        </div>\n\n      </div>\n\n      <div class="district-details column-medium-33">\n\n        {{#(!district)}}\n          <p class="details-placeholder em text-center">Click on a district to see result details.</p>\n        {{/()}}\n        {{#district}}\n          <div class="district-display" intro="fade" outro="fade">\n            <h3>District {{ f.removeLead(district) }}</h3>\n\n            {{^uncontested}}\n              <p>\n                The\n                <span class="color-political-{{ winner_party.toLowerCase() }}">{{ winner_party }}</span>\n                {{#winner_incumbent}}incumbent{{/winner_incumbent}} candidate, {{ winner_name }},\n                won the district by a {{ margin }} percentage-point margin against the\n                <span class="color-political-{{ loser_party.toLowerCase() }}">{{ loser_party }}</span>\n                {{#loser_incumbent}}incumbent{{/loser_incumbent}} challenger,\n                {{ loser_name }}{{#party_flip}}, flipping the party in this district{{/party_flip}}.\n              </p>\n            {{/uncontested}}\n\n            {{#uncontested}}\n              <p>\n                The\n                <span class="color-political-{{ winner_party.toLowerCase() }}">{{ winner_party }}</span>\n                {{#winner_incumbent}}incumbent{{/winner_incumbent}} candidate, {{ winner_name }},\n                won uncontested.\n              </p>\n            {{/uncontested}}\n\n            {{#not_fully_reported}}\n              <p class="caption">Not all precincts have reported in on this race yet.</p>\n            {{/not_fully_reported}}\n\n            {{#(margin < 0.5)}}\n              <p class="caption">With a margin of less than 0.5 percentage-points, the losing candidate could ask for a recount of this race.</p>\n            {{/()}}\n\n            {{#boundary.simple_shape }}\n              <div class="map" decorator="map:{{ this }}"></div>\n            {{/boundary.simple_shape}}\n            {{^boundary.simple_shape}}\n              <div class="loading-container">\n                <i class="loading"></i> Loading map...\n              </div>\n            {{/boundary.simple_shape}}\n          </div>\n        {{/district}}\n      </div>\n    </div>\n\n  </div>\n\n  <div class="footnote-container">\n    <div class="footnote">\n      <p>Data collected manually from the <a href="http://electionresults.sos.state.mn.us/Results/StateRepresentative/20?districttype=LG" target="_blank">Office of the Secretary of State 2014 General Election Results</a>.  Some code, techniques, and data on <a href="https://github.com/minnpost/minnpost-2014-house-results-cartogram" target="_blank">Github</a>.</p>\n\n        <p>Some map data © OpenStreetMap contributors; licensed under the <a href="http://www.openstreetmap.org/copyright" target="_blank">Open Data Commons Open Database License</a>.  Some map design © MapBox; licensed according to the <a href="http://mapbox.com/tos/" target="_blank">MapBox Terms of Service</a>.  Location geocoding provided by <a href="http://www.mapquest.com/" target="_blank">Mapquest</a> and is not guaranteed to be accurate.</p>\n\n    </div>\n  </div>\n</div>\n';});


define('text!../data/district-arrangement.json',[],function () { return '[[1,0,"02A"],[0,1,"01A"],[1,1,"01B"],[2,1,"02B"],[3,1,"06A"],[4,1,"06B"],[5,1,"03B"],[6,1,"03A"],[0,2,"04A"],[1,2,"04B"],[2,2,"05A"],[3,2,"05B"],[4,2,"07B"],[5,2,"07A"],[0,3,"08A"],[1,3,"08B"],[2,3,"10A"],[3,3,"10B"],[4,3,"11A"],[10,3,"30A"],[11,3,"30B"],[12,3,"35A"],[13,3,"35B"],[14,3,"31B"],[15,3,"32B"],[0,4,"12A"],[1,4,"09A"],[2,4,"09B"],[3,4,"15B"],[4,4,"11B"],[9,4,"34A"],[10,4,"36A"],[11,4,"36B"],[12,4,"37A"],[13,4,"37B"],[14,4,"38A"],[15,4,"38B"],[16,4,"39A"],[0,5,"12B"],[1,5,"13A"],[2,5,"13B"],[3,5,"15A"],[4,5,"32A"],[9,5,"34B"],[10,5,"40A"],[11,5,"40B"],[12,5,"41A"],[13,5,"41B"],[14,5,"42A"],[15,5,"42B"],[16,5,"43A"],[0,6,"17A"],[1,6,"17B"],[2,6,"14A"],[3,6,"14B"],[4,6,"31A"],[8,6,"44A"],[9,6,"45A"],[10,6,"45B"],[11,6,"59A"],[12,6,"60A"],[13,6,"66A"],[14,6,"66B"],[15,6,"67A"],[16,6,"43B"],[17,6,"39B"],[0,7,"16A"],[1,7,"18A"],[2,7,"29A"],[3,7,"29B"],[9,7,"44B"],[10,7,"46A"],[11,7,"59B"],[12,7,"60B"],[13,7,"64A"],[14,7,"65A"],[15,7,"67B"],[16,7,"53A"],[0,8,"16B"],[1,8,"18B"],[2,8,"47A"],[3,8,"33A"],[9,8,"33B"],[10,8,"46B"],[11,8,"61A"],[12,8,"62A"],[13,8,"63A"],[14,8,"65B"],[15,8,"53B"],[16,8,"54B"],[0,9,"19A"],[1,9,"20A"],[2,9,"20B"],[3,9,"58B"],[4,9,"21A"],[5,9,"21B"],[9,9,"48A"],[10,9,"49A"],[11,9,"61B"],[12,9,"62B"],[13,9,"63B"],[14,9,"64B"],[15,9,"52A"],[16,9,"54A"],[0,10,"22B"],[1,10,"19B"],[2,10,"23B"],[3,10,"25B"],[4,10,"24B"],[5,10,"25A"],[6,10,"28A"],[9,10,"47B"],[10,10,"48B"],[11,10,"49B"],[12,10,"50A"],[13,10,"50B"],[14,10,"51A"],[15,10,"51B"],[16,10,"52B"],[0,11,"22A"],[1,11,"23A"],[2,11,"24A"],[3,11,"26B"],[4,11,"26A"],[5,11,"27A"],[6,11,"27B"],[7,11,"28B"],[10,11,"55A"],[11,11,"55B"],[12,11,"56A"],[13,11,"56B"],[14,11,"58A"],[15,11,"57A"],[16,11,"57B"]]\n';});


define('text!../data/results.json',[],function () { return '{"MN House Results for 2014 General Election":[{"district":"01A","margin12":20.39,"pvi14":9.415101189,"incumbent":"DAN FABIAN","incumbent.party":"R","cand.1.name":"DAN FABIAN","cand.1.party":"R","cand.1.percent":67.13,"cand.2.name":"BRUCE PATTERSON","cand.2.party":"DFL","cand.2.percent":32.79,"margin":34.34,"not.fully.reported":"","rowNumber":1},{"district":"01B","margin12":3.95,"pvi14":-3.842167034,"incumbent":"DEBRA (DEB) KIEL","incumbent.party":"R","cand.1.name":"DEBRA (DEB) KIEL","cand.1.party":"R","cand.1.percent":55.84,"cand.2.name":"ERIC BERGESON","cand.2.party":"DFL","cand.2.percent":44.12,"margin":11.72,"not.fully.reported":"","rowNumber":2},{"district":"02A","margin12":-9.31,"pvi14":-4.387150035,"incumbent":"ROGER ERICKSON","incumbent.party":"DFL","cand.1.name":"ROGER ERICKSON","cand.1.party":"DFL","cand.1.percent":47.49,"cand.2.name":"DAVE HANCOCK","cand.2.party":"R","cand.2.percent":52.36,"margin":4.87,"not.fully.reported":"","rowNumber":3},{"district":"02B","margin12":2,"pvi14":-0.116624542,"incumbent":"STEVE GREEN","incumbent.party":"R","cand.1.name":"STEVE GREEN","cand.1.party":"R","cand.1.percent":57.16,"cand.2.name":"DAVID SOBIESKI","cand.2.party":"DFL","cand.2.percent":42.77,"margin":14.39,"not.fully.reported":"","rowNumber":4},{"district":"03A","margin12":-33.66,"pvi14":-34.34055348,"incumbent":"DAVID DILL","incumbent.party":"DFL","cand.1.name":"DAVID DILL","cand.1.party":"DFL","cand.1.percent":65.55,"cand.2.name":"ERIC JOHNSON","cand.2.party":"R","cand.2.percent":34.19,"margin":31.36,"not.fully.reported":"","rowNumber":5},{"district":"03B","margin12":-30,"pvi14":-28.58426059,"incumbent":"MARY MURPHY","incumbent.party":"DFL","cand.1.name":"MARY MURPHY","cand.1.party":"DFL","cand.1.percent":62.12,"cand.2.name":"WADE K. FREMLING","cand.2.party":"R","cand.2.percent":37.76,"margin":24.36,"not.fully.reported":"","rowNumber":6},{"district":"04A","margin12":-9.77,"pvi14":8.796801838,"incumbent":"BEN LIEN","incumbent.party":"DFL","cand.1.name":"BEN LIEN","cand.1.party":"DFL","cand.1.percent":58.34,"cand.2.name":"BRIAN E. GRAMER","cand.2.party":"R","cand.2.percent":41.47,"margin":16.87,"not.fully.reported":"","rowNumber":7},{"district":"04B","margin12":-30.54,"pvi14":-33.15106326,"incumbent":"PAUL MARQUART","incumbent.party":"DFL","cand.1.name":"PAUL MARQUART","cand.1.party":"DFL","cand.1.percent":65.84,"cand.2.name":"JARED LADUKE","cand.2.party":"R","cand.2.percent":34.12,"margin":31.72,"not.fully.reported":"","rowNumber":8},{"district":"05A","margin12":-12.37,"pvi14":-7.937067071,"incumbent":"JOHN PERSELL","incumbent.party":"DFL","cand.1.name":"JOHN PERSELL","cand.1.party":"DFL","cand.1.percent":55.41,"cand.2.name":"PHILLIP NELSON","cand.2.party":"R","cand.2.percent":44.5,"margin":10.91,"not.fully.reported":"Y","rowNumber":9},{"district":"05B","margin12":-6.96,"pvi14":-4.249005146,"incumbent":"TOM ANZELC","incumbent.party":"DFL","cand.1.name":"TOM ANZELC","cand.1.party":"DFL","cand.1.percent":56.64,"cand.2.name":"JUSTIN EICHORN","cand.2.party":"R","cand.2.percent":43.21,"margin":13.43,"not.fully.reported":"Y","rowNumber":10},{"district":"06A","margin12":-41.67,"pvi14":-38.31937863,"incumbent":"CARLY MELIN","incumbent.party":"DFL","cand.1.name":"CARLY MELIN","cand.1.party":"DFL","cand.1.percent":70.01,"cand.2.name":"ROGER WEBER","cand.2.party":"R","cand.2.percent":29.76,"margin":40.25,"not.fully.reported":"Y","rowNumber":11},{"district":"06B","margin12":-36.46,"pvi14":-43.49018556,"incumbent":"JASON METSA","incumbent.party":"DFL","cand.1.name":"JASON METSA","cand.1.party":"DFL","cand.1.percent":64.08,"cand.2.name":"MATT MATASICH","cand.2.party":"R","cand.2.percent":35.74,"margin":28.34,"not.fully.reported":"","rowNumber":12},{"district":"07A","margin12":-42.29,"pvi14":-36.25509914,"incumbent":"","incumbent.party":"DFL","cand.1.name":"JENNIFER SCHULTZ","cand.1.party":"DFL","cand.1.percent":62.11,"cand.2.name":"BECKY HALL","cand.2.party":"R","cand.2.percent":33.28,"margin":28.83,"not.fully.reported":"","rowNumber":13},{"district":"07B","margin12":-40.68,"pvi14":-43.11551216,"incumbent":"ERIK SIMONSON","incumbent.party":"DFL","cand.1.name":"ERIK SIMONSON","cand.1.party":"DFL","cand.1.percent":71.05,"cand.2.name":"TRAVIS SILVERS","cand.2.party":"R","cand.2.percent":28.64,"margin":42.41,"not.fully.reported":"","rowNumber":14},{"district":"08A","margin12":25.65,"pvi14":24.27931424,"incumbent":"BUD NORNES","incumbent.party":"R","cand.1.name":"BUD NORNES","cand.1.party":"R","cand.1.percent":64.69,"cand.2.name":"JIM MILTICH","cand.2.party":"DFL","cand.2.percent":35.22,"margin":29.47,"not.fully.reported":"","rowNumber":15},{"district":"08B","margin12":0.01,"pvi14":12.17229705,"incumbent":"MARY FRANSON","incumbent.party":"R","cand.1.name":"MARY FRANSON","cand.1.party":"R","cand.1.percent":58.41,"cand.2.name":"JAY SIELING","cand.2.party":"DFL","cand.2.percent":41.36,"margin":17.05,"not.fully.reported":"","rowNumber":16},{"district":"09A","margin12":16.11,"pvi14":12.34058469,"incumbent":"MARK ANDERSON","incumbent.party":"R","cand.1.name":"MARK ANDERSON","cand.1.party":"R","cand.1.percent":63.91,"cand.2.name":"DAN BYE","cand.2.party":"DFL","cand.2.percent":36.02,"margin":27.89,"not.fully.reported":"","rowNumber":17},{"district":"09B","margin12":6.06,"pvi14":7.488355067,"incumbent":"RON KRESHA","incumbent.party":"R","cand.1.name":"RON KRESHA","cand.1.party":"R","cand.1.percent":56.42,"cand.2.name":"AL DOTY","cand.2.party":"DFL","cand.2.percent":43.53,"margin":12.89,"not.fully.reported":"","rowNumber":18},{"district":"10A","margin12":-14.1,"pvi14":-14.12174276,"incumbent":"JOHN WARD","incumbent.party":"DFL","cand.1.name":"JOHN WARD","cand.1.party":"DFL","cand.1.percent":46.54,"cand.2.name":"JOSHUA HEINTZEMAN","cand.2.party":"R","cand.2.percent":53.37,"margin":6.83,"not.fully.reported":"","rowNumber":19},{"district":"10B","margin12":-1.47,"pvi14":-4.351757483,"incumbent":"JOE RADINOVICH","incumbent.party":"DFL","cand.1.name":"JOE RADINOVICH","cand.1.party":"DFL","cand.1.percent":48,"cand.2.name":"DALE K LUECK","cand.2.party":"R","cand.2.percent":51.86,"margin":3.86,"not.fully.reported":"","rowNumber":20},{"district":"11A","margin12":-33.83,"pvi14":-28.77451403,"incumbent":"MIKE SUNDIN","incumbent.party":"DFL","cand.1.name":"MIKE SUNDIN","cand.1.party":"DFL","cand.1.percent":62.35,"cand.2.name":"TIM HAFVENSTEIN","cand.2.party":"R","cand.2.percent":37.55,"margin":24.8,"not.fully.reported":"","rowNumber":21},{"district":"11B","margin12":-2.66,"pvi14":-0.512959063,"incumbent":"TIM FAUST","incumbent.party":"DFL","cand.1.name":"TIM FAUST","cand.1.party":"DFL","cand.1.percent":46.15,"cand.2.name":"JASON RARICK","cand.2.party":"R","cand.2.percent":53.68,"margin":7.53,"not.fully.reported":"","rowNumber":22},{"district":"12A","margin12":-1.2,"pvi14":7.143330362,"incumbent":"JAY MCNAMAR","incumbent.party":"DFL","cand.1.name":"JAY MCNAMAR","cand.1.party":"DFL","cand.1.percent":47.94,"cand.2.name":"JEFF BACKER","cand.2.party":"R","cand.2.percent":51.87,"margin":3.93,"not.fully.reported":"","rowNumber":23},{"district":"12B","margin12":32.71,"pvi14":46.33987329,"incumbent":"PAUL ANDERSON","incumbent.party":"R","cand.1.name":"PAUL ANDERSON","cand.1.party":"R","cand.1.percent":67.84,"cand.2.name":"GORDON (GORDY) WAGNER","cand.2.party":"DFL","cand.2.percent":32.1,"margin":35.74,"not.fully.reported":"","rowNumber":24},{"district":"13A","margin12":18.28,"pvi14":-6.844607407,"incumbent":"JEFF HOWE","incumbent.party":"R","cand.1.name":"JEFF HOWE","cand.1.party":"R","cand.1.percent":60.51,"cand.2.name":"EMILY JENSEN","cand.2.party":"DFL","cand.2.percent":39.38,"margin":21.13,"not.fully.reported":"","rowNumber":25},{"district":"13B","margin12":20.6,"pvi14":16.94062362,"incumbent":"TIM O\'DRISCOLL","incumbent.party":"R","cand.1.name":"TIM O\'DRISCOLL","cand.1.party":"R","cand.1.percent":97.48,"cand.2.name":"","cand.2.party":"","cand.2.percent":"","margin":97.48,"not.fully.reported":"","rowNumber":26},{"district":"14A","margin12":8.11,"pvi14":12.5516664,"incumbent":"TAMA THEIS","incumbent.party":"R","cand.1.name":"TAMA THEIS","cand.1.party":"R","cand.1.percent":54.9,"cand.2.name":"DAN WOLGAMOTT","cand.2.party":"DFL","cand.2.percent":44.96,"margin":9.94,"not.fully.reported":"","rowNumber":27},{"district":"14B","margin12":-12.73,"pvi14":-12.61853235,"incumbent":"ZACHARY \\"ZACH\\" DORHOLT","incumbent.party":"DFL","cand.1.name":"ZACHARY \\"ZACH\\" DORHOLT","cand.1.party":"DFL","cand.1.percent":49.54,"cand.2.name":"JIM KNOBLACH","cand.2.party":"R","cand.2.percent":50.15,"margin":0.61,"not.fully.reported":"","rowNumber":28},{"district":"15A","margin12":4.81,"pvi14":5.042175735,"incumbent":"SONDRA ERICKSON","incumbent.party":"R","cand.1.name":"SONDRA ERICKSON","cand.1.party":"R","cand.1.percent":63.01,"cand.2.name":"JAMES RITTENOUR","cand.2.party":"DFL","cand.2.percent":36.8,"margin":26.21,"not.fully.reported":"","rowNumber":29},{"district":"15B","margin12":15.68,"pvi14":19.6789802,"incumbent":"JIM NEWBERGER","incumbent.party":"R","cand.1.name":"JIM NEWBERGER","cand.1.party":"R","cand.1.percent":63.93,"cand.2.name":"BRIAN JOHNSON","cand.2.party":"DFL","cand.2.percent":35.95,"margin":27.98,"not.fully.reported":"","rowNumber":30},{"district":"16A","margin12":13.54,"pvi14":13.72734571,"incumbent":"CHRIS SWEDZINSKI","incumbent.party":"R","cand.1.name":"CHRIS SWEDZINSKI","cand.1.party":"R","cand.1.percent":61.72,"cand.2.name":"LAURIE DRIESSEN","cand.2.party":"DFL","cand.2.percent":38.25,"margin":23.47,"not.fully.reported":"","rowNumber":31},{"district":"16B","margin12":23.83,"pvi14":35.15339244,"incumbent":"PAUL TORKELSON","incumbent.party":"R","cand.1.name":"PAUL TORKELSON","cand.1.party":"R","cand.1.percent":64.93,"cand.2.name":"JAMES KANNE","cand.2.party":"DFL","cand.2.percent":34.95,"margin":29.98,"not.fully.reported":"","rowNumber":32},{"district":"17A","margin12":-7.87,"pvi14":-10.86434194,"incumbent":"ANDREW FALK","incumbent.party":"DFL","cand.1.name":"ANDREW FALK","cand.1.party":"DFL","cand.1.percent":44.46,"cand.2.name":"TIM MILLER","cand.2.party":"R","cand.2.percent":55.37,"margin":10.91,"not.fully.reported":"","rowNumber":33},{"district":"17B","margin12":-4.17,"pvi14":-0.257265384,"incumbent":"MARY SAWATZKY","incumbent.party":"DFL","cand.1.name":"MARY SAWATZKY","cand.1.party":"DFL","cand.1.percent":49.27,"cand.2.name":"DAVE BAKER","cand.2.party":"R","cand.2.percent":50.66,"margin":1.39,"not.fully.reported":"","rowNumber":34},{"district":"18A","margin12":16.73,"pvi14":27.10544223,"incumbent":"DEAN URDAHL","incumbent.party":"R","cand.1.name":"DEAN URDAHL","cand.1.party":"R","cand.1.percent":67.22,"cand.2.name":"STEVEN SCHIROO","cand.2.party":"DFL","cand.2.percent":32.43,"margin":34.79,"not.fully.reported":"","rowNumber":35},{"district":"18B","margin12":16.18,"pvi14":33.13813712,"incumbent":"GLENN H. GRUENHAGEN","incumbent.party":"R","cand.1.name":"GLENN H. GRUENHAGEN","cand.1.party":"R","cand.1.percent":63.94,"cand.2.name":"JOHN LIPKE","cand.2.party":"DFL","cand.2.percent":35.88,"margin":28.06,"not.fully.reported":"","rowNumber":36},{"district":"19A","margin12":-97.65,"pvi14":-48.1146334,"incumbent":"CLARK JOHNSON","incumbent.party":"DFL","cand.1.name":"CLARK JOHNSON","cand.1.party":"DFL","cand.1.percent":54.08,"cand.2.name":"KIM SPEARS","cand.2.party":"R","cand.2.percent":45.78,"margin":8.3,"not.fully.reported":"","rowNumber":37},{"district":"19B","margin12":-28.14,"pvi14":-20.53596584,"incumbent":"","incumbent.party":"DFL","cand.1.name":"JACK CONSIDINE","cand.1.party":"DFL","cand.1.percent":55.96,"cand.2.name":"DAVE KRUSE","cand.2.party":"R","cand.2.percent":43.87,"margin":12.09,"not.fully.reported":"","rowNumber":38},{"district":"20A","margin12":9.05,"pvi14":14.45198517,"incumbent":"","incumbent.party":"R","cand.1.name":"BOB VOGEL","cand.1.party":"R","cand.1.percent":64.29,"cand.2.name":"THOMAS LOFGREN","cand.2.party":"DFL","cand.2.percent":35.52,"margin":28.77,"not.fully.reported":"","rowNumber":39},{"district":"20B","margin12":-13.92,"pvi14":-11.1631232,"incumbent":"DAVID BLY","incumbent.party":"DFL","cand.1.name":"DAVID BLY","cand.1.party":"DFL","cand.1.percent":57.97,"cand.2.name":"DAN MATEJCEK","cand.2.party":"R","cand.2.percent":41.8,"margin":16.17,"not.fully.reported":"","rowNumber":40},{"district":"21A","margin12":15.14,"pvi14":15.25447067,"incumbent":"TIM KELLY","incumbent.party":"R","cand.1.name":"TIM KELLY","cand.1.party":"R","cand.1.percent":62.17,"cand.2.name":"LYNN SCHOEN","cand.2.party":"DFL","cand.2.percent":37.78,"margin":24.39,"not.fully.reported":"","rowNumber":41},{"district":"21B","margin12":16.01,"pvi14":15.66432361,"incumbent":"STEVE DRAZKOWSKI","incumbent.party":"R","cand.1.name":"STEVE DRAZKOWSKI","cand.1.party":"R","cand.1.percent":63.33,"cand.2.name":"M.A. SCHNEIDER","cand.2.party":"DFL","cand.2.percent":36.38,"margin":26.95,"not.fully.reported":"","rowNumber":42},{"district":"22A","margin12":18.13,"pvi14":16.18143457,"incumbent":"JOE SCHOMACKER","incumbent.party":"R","cand.1.name":"JOE SCHOMACKER","cand.1.party":"R","cand.1.percent":66.71,"cand.2.name":"DIANA SLYTER","cand.2.party":"DFL","cand.2.percent":33.21,"margin":33.5,"not.fully.reported":"","rowNumber":43},{"district":"22B","margin12":20.21,"pvi14":24.22656922,"incumbent":"ROD HAMILTON","incumbent.party":"R","cand.1.name":"ROD HAMILTON","cand.1.party":"R","cand.1.percent":66.19,"cand.2.name":"CHERYL AVENEL-NAVARA","cand.2.party":"DFL","cand.2.percent":33.72,"margin":32.47,"not.fully.reported":"","rowNumber":44},{"district":"23A","margin12":12.88,"pvi14":22.73803837,"incumbent":"BOB GUNTHER","incumbent.party":"R","cand.1.name":"BOB GUNTHER","cand.1.party":"R","cand.1.percent":61.66,"cand.2.name":"PAT BACON","cand.2.party":"DFL","cand.2.percent":38.3,"margin":23.36,"not.fully.reported":"","rowNumber":45},{"district":"23B","margin12":96.25,"pvi14":45.83915096,"incumbent":"TONY CORNISH","incumbent.party":"R","cand.1.name":"TONY CORNISH","cand.1.party":"R","cand.1.percent":96.11,"cand.2.name":"","cand.2.party":"","cand.2.percent":"","margin":96.11,"not.fully.reported":"","rowNumber":46},{"district":"24A","margin12":4.58,"pvi14":-11.3186459,"incumbent":"JOHN PETERSBURG","incumbent.party":"R","cand.1.name":"JOHN PETERSBURG","cand.1.party":"R","cand.1.percent":55.32,"cand.2.name":"BEVERLY CASHMAN","cand.2.party":"DFL","cand.2.percent":44.63,"margin":10.69,"not.fully.reported":"","rowNumber":47},{"district":"24B","margin12":-13.52,"pvi14":-8.445674244,"incumbent":"PATTI FRITZ","incumbent.party":"DFL","cand.1.name":"PATTI FRITZ","cand.1.party":"DFL","cand.1.percent":49,"cand.2.name":"BRIAN DANIELS","cand.2.party":"R","cand.2.percent":50.87,"margin":1.87,"not.fully.reported":"","rowNumber":48},{"district":"25A","margin12":9.21,"pvi14":12.49644065,"incumbent":"DUANE QUAM","incumbent.party":"R","cand.1.name":"DUANE QUAM","cand.1.party":"R","cand.1.percent":96.28,"cand.2.name":"","cand.2.party":"","cand.2.percent":"","margin":96.28,"not.fully.reported":"","rowNumber":49},{"district":"25B","margin12":-15.24,"pvi14":-12.01690507,"incumbent":"KIM NORTON","incumbent.party":"DFL","cand.1.name":"KIM NORTON","cand.1.party":"DFL","cand.1.percent":94.91,"cand.2.name":"","cand.2.party":"","cand.2.percent":"","margin":94.91,"not.fully.reported":"","rowNumber":50},{"district":"26A","margin12":-17.83,"pvi14":-17.51468112,"incumbent":"TINA LIEBLING","incumbent.party":"DFL","cand.1.name":"TINA LIEBLING","cand.1.party":"DFL","cand.1.percent":55.23,"cand.2.name":"BREANNA BLY","cand.2.party":"R","cand.2.percent":44.67,"margin":10.56,"not.fully.reported":"","rowNumber":51},{"district":"26B","margin12":14.4,"pvi14":5.065255054,"incumbent":"","incumbent.party":"R","cand.1.name":"RICH WRIGHT","cand.1.party":"DFL","cand.1.percent":40.03,"cand.2.name":"NELS T. PIERSON","cand.2.party":"R","cand.2.percent":59.85,"margin":19.82,"not.fully.reported":"","rowNumber":52},{"district":"27A","margin12":-3.2,"pvi14":-3.221256476,"incumbent":"SHANNON SAVICK","incumbent.party":"DFL","cand.1.name":"SHANNON SAVICK","cand.1.party":"DFL","cand.1.percent":39.93,"cand.2.name":"PEGGY BENNETT","cand.2.party":"R","cand.2.percent":53.04,"margin":13.11,"not.fully.reported":"","rowNumber":53},{"district":"27B","margin12":-25.66,"pvi14":-25.72807116,"incumbent":"JEANNE POPPE","incumbent.party":"DFL","cand.1.name":"JEANNE POPPE","cand.1.party":"DFL","cand.1.percent":54.1,"cand.2.name":"DENNIS SCHMINKE","cand.2.party":"R","cand.2.percent":45.8,"margin":8.3,"not.fully.reported":"","rowNumber":54},{"district":"28A","margin12":-33.6,"pvi14":-26.3955084,"incumbent":"GENE P PELOWSKI JR","incumbent.party":"DFL","cand.1.name":"GENE P PELOWSKI JR","cand.1.party":"DFL","cand.1.percent":62.7,"cand.2.name":"LYNAE HAHN","cand.2.party":"R","cand.2.percent":37.1,"margin":25.6,"not.fully.reported":"","rowNumber":55},{"district":"28B","margin12":16.8,"pvi14":13.71964978,"incumbent":"GREGORY M. DAVIDS","incumbent.party":"R","cand.1.name":"GREGORY M. DAVIDS","cand.1.party":"R","cand.1.percent":55.88,"cand.2.name":"JON PIEPER","cand.2.party":"DFL","cand.2.percent":43.96,"margin":11.92,"not.fully.reported":"","rowNumber":56},{"district":"29A","margin12":24.16,"pvi14":27.3973738,"incumbent":"JOE MCDONALD","incumbent.party":"R","cand.1.name":"JOE MCDONALD","cand.1.party":"R","cand.1.percent":96.8,"cand.2.name":"","cand.2.party":"","cand.2.percent":"","margin":96.8,"not.fully.reported":"","rowNumber":57},{"district":"29B","margin12":7.89,"pvi14":12.60390999,"incumbent":"MARION O\'NEILL","incumbent.party":"R","cand.1.name":"MARION O\'NEILL","cand.1.party":"R","cand.1.percent":96.77,"cand.2.name":"","cand.2.party":"","cand.2.percent":"","margin":96.77,"not.fully.reported":"","rowNumber":58},{"district":"30A","margin12":27.59,"pvi14":27.05971778,"incumbent":"NICK ZERWAS","incumbent.party":"R","cand.1.name":"NICK ZERWAS","cand.1.party":"R","cand.1.percent":68.51,"cand.2.name":"BRENDEN ELLINGBOE","cand.2.party":"DFL","cand.2.percent":31.35,"margin":37.16,"not.fully.reported":"","rowNumber":59},{"district":"30B","margin12":23.85,"pvi14":27.06864992,"incumbent":"","incumbent.party":"R","cand.1.name":"ERIC LUCERO","cand.1.party":"R","cand.1.percent":67.75,"cand.2.name":"SHARON G. SHIMEK","cand.2.party":"DFL","cand.2.percent":32.02,"margin":35.73,"not.fully.reported":"","rowNumber":60},{"district":"31A","margin12":21,"pvi14":24.7672421,"incumbent":"KURT DAUDT","incumbent.party":"R","cand.1.name":"KURT DAUDT","cand.1.party":"R","cand.1.percent":96.67,"cand.2.name":"","cand.2.party":"","cand.2.percent":"","margin":96.67,"not.fully.reported":"","rowNumber":61},{"district":"31B","margin12":21.87,"pvi14":26.98719766,"incumbent":"TOM HACKBARTH","incumbent.party":"R","cand.1.name":"TOM HACKBARTH","cand.1.party":"R","cand.1.percent":64.47,"cand.2.name":"JD HOLMQUIST","cand.2.party":"DFL","cand.2.percent":35.39,"margin":29.08,"not.fully.reported":"","rowNumber":62},{"district":"32A","margin12":7.24,"pvi14":7.92868776,"incumbent":"BRIAN JOHNSON","incumbent.party":"R","cand.1.name":"BRIAN JOHNSON","cand.1.party":"R","cand.1.percent":57.48,"cand.2.name":"PAUL GAMMEL","cand.2.party":"DFL","cand.2.percent":42.41,"margin":15.07,"not.fully.reported":"","rowNumber":63},{"district":"32B","margin12":1.87,"pvi14":4.617889846,"incumbent":"BOB BARRETT","incumbent.party":"R","cand.1.name":"BOB BARRETT","cand.1.party":"R","cand.1.percent":55.73,"cand.2.name":"LAURIE J. WARNER","cand.2.party":"DFL","cand.2.percent":44.19,"margin":11.54,"not.fully.reported":"","rowNumber":64},{"district":"33A","margin12":24.28,"pvi14":32.72312183,"incumbent":"JERRY HERTAUS","incumbent.party":"R","cand.1.name":"JERRY HERTAUS","cand.1.party":"R","cand.1.percent":65.7,"cand.2.name":"TODD MIKKELSON","cand.2.party":"DFL","cand.2.percent":34.19,"margin":31.51,"not.fully.reported":"","rowNumber":65},{"district":"33B","margin12":8.88,"pvi14":22.92171133,"incumbent":"CINDY PUGH","incumbent.party":"R","cand.1.name":"CINDY PUGH","cand.1.party":"R","cand.1.percent":61.21,"cand.2.name":"PAUL ALEGI","cand.2.party":"DFL","cand.2.percent":38.7,"margin":22.51,"not.fully.reported":"","rowNumber":66},{"district":"34A","margin12":28.59,"pvi14":30.9067992,"incumbent":"JOYCE PEPPIN","incumbent.party":"R","cand.1.name":"JOYCE PEPPIN","cand.1.party":"R","cand.1.percent":97.05,"cand.2.name":"","cand.2.party":"","cand.2.percent":"","margin":97.05,"not.fully.reported":"","rowNumber":67},{"district":"34B","margin12":9.16,"pvi14":11.26821466,"incumbent":"","incumbent.party":"R","cand.1.name":"DENNIS SMITH","cand.1.party":"R","cand.1.percent":56.36,"cand.2.name":"DAVID B. HODEN","cand.2.party":"DFL","cand.2.percent":43.54,"margin":12.82,"not.fully.reported":"","rowNumber":68},{"district":"35A","margin12":25.4,"pvi14":30.16433595,"incumbent":"","incumbent.party":"R","cand.1.name":"PETER PEROVICH","cand.1.party":"DFL","cand.1.percent":39.86,"cand.2.name":"ABIGAIL WHELAN","cand.2.party":"R","cand.2.percent":59.95,"margin":20.09,"not.fully.reported":"","rowNumber":69},{"district":"35B","margin12":18.32,"pvi14":20.41855553,"incumbent":"PEGGY SCOTT","incumbent.party":"R","cand.1.name":"PEGGY SCOTT","cand.1.party":"R","cand.1.percent":65.97,"cand.2.name":"SAM BEARD","cand.2.party":"DFL","cand.2.percent":33.94,"margin":32.03,"not.fully.reported":"","rowNumber":70},{"district":"36A","margin12":2.17,"pvi14":-6.1949472,"incumbent":"MARK W. UGLEM","incumbent.party":"R","cand.1.name":"MARK W. UGLEM","cand.1.party":"R","cand.1.percent":58.93,"cand.2.name":"JEFFERSON FIETEK","cand.2.party":"DFL","cand.2.percent":40.92,"margin":18.01,"not.fully.reported":"","rowNumber":71},{"district":"36B","margin12":-14.77,"pvi14":-9.403147364,"incumbent":"MELISSA HORTMAN","incumbent.party":"DFL","cand.1.name":"MELISSA HORTMAN","cand.1.party":"DFL","cand.1.percent":51.9,"cand.2.name":"PETER CREMA","cand.2.party":"R","cand.2.percent":48,"margin":3.9,"not.fully.reported":"","rowNumber":72},{"district":"37A","margin12":-14.54,"pvi14":-13.34325125,"incumbent":"JERRY NEWTON","incumbent.party":"DFL","cand.1.name":"JERRY NEWTON","cand.1.party":"DFL","cand.1.percent":52.45,"cand.2.name":"MANDY BENZ","cand.2.party":"R","cand.2.percent":47.46,"margin":4.99,"not.fully.reported":"","rowNumber":73},{"district":"37B","margin12":8,"pvi14":8.302376864,"incumbent":"TIM SANDERS","incumbent.party":"R","cand.1.name":"TIM SANDERS","cand.1.party":"R","cand.1.percent":55.39,"cand.2.name":"SUSAN WITT","cand.2.party":"DFL","cand.2.percent":44.55,"margin":10.84,"not.fully.reported":"","rowNumber":74},{"district":"38A","margin12":16.15,"pvi14":14.8935426,"incumbent":"LINDA RUNBECK","incumbent.party":"R","cand.1.name":"LINDA RUNBECK","cand.1.party":"R","cand.1.percent":62.19,"cand.2.name":"PAT DAVERN","cand.2.party":"DFL","cand.2.percent":37.71,"margin":24.48,"not.fully.reported":"","rowNumber":75},{"district":"38B","margin12":4.76,"pvi14":12.31075069,"incumbent":"MATT DEAN","incumbent.party":"R","cand.1.name":"MATT DEAN","cand.1.party":"R","cand.1.percent":56.08,"cand.2.name":"GREG M. PARISEAU","cand.2.party":"DFL","cand.2.percent":43.8,"margin":12.28,"not.fully.reported":"","rowNumber":76},{"district":"39A","margin12":14.96,"pvi14":22.08646393,"incumbent":"BOB DETTMER","incumbent.party":"R","cand.1.name":"BOB DETTMER","cand.1.party":"R","cand.1.percent":58.02,"cand.2.name":"TIM STENDER","cand.2.party":"DFL","cand.2.percent":41.91,"margin":16.11,"not.fully.reported":"","rowNumber":77},{"district":"39B","margin12":6.1,"pvi14":4.856735191,"incumbent":"KATHY LOHMER","incumbent.party":"R","cand.1.name":"KATHY LOHMER","cand.1.party":"R","cand.1.percent":54.55,"cand.2.name":"TOM DEGREE","cand.2.party":"DFL","cand.2.percent":45.37,"margin":9.18,"not.fully.reported":"","rowNumber":78},{"district":"40A","margin12":-97.18,"pvi14":-49.16860915,"incumbent":"MICHAEL NELSON","incumbent.party":"DFL","cand.1.name":"MICHAEL NELSON","cand.1.party":"DFL","cand.1.percent":64.85,"cand.2.name":"CHARLES (CHUCK) SUTPHEN","cand.2.party":"R","cand.2.percent":34.94,"margin":29.91,"not.fully.reported":"","rowNumber":79},{"district":"40B","margin12":-42.74,"pvi14":-32.57955847,"incumbent":"DEBRA HILSTROM","incumbent.party":"DFL","cand.1.name":"DEBRA HILSTROM","cand.1.party":"DFL","cand.1.percent":67.36,"cand.2.name":"MALI MARVIN","cand.2.party":"R","cand.2.percent":32.45,"margin":34.91,"not.fully.reported":"","rowNumber":80},{"district":"41A","margin12":-23.5,"pvi14":-19.62792406,"incumbent":"CONNIE BERNARDY","incumbent.party":"DFL","cand.1.name":"CONNIE BERNARDY","cand.1.party":"DFL","cand.1.percent":60.16,"cand.2.name":"JEFF PHILLIPS","cand.2.party":"R","cand.2.percent":39.68,"margin":20.48,"not.fully.reported":"","rowNumber":81},{"district":"41B","margin12":-30.73,"pvi14":-23.68230406,"incumbent":"CAROLYN LAINE","incumbent.party":"DFL","cand.1.name":"CAROLYN LAINE","cand.1.party":"DFL","cand.1.percent":57.38,"cand.2.name":"CAMDEN PIKE","cand.2.party":"R","cand.2.percent":29.29,"margin":28.09,"not.fully.reported":"","rowNumber":82},{"district":"42A","margin12":-6.74,"pvi14":-5.212494668,"incumbent":"BARB YARUSSO","incumbent.party":"DFL","cand.1.name":"BARB YARUSSO","cand.1.party":"DFL","cand.1.percent":50.55,"cand.2.name":"RANDY JESSUP","cand.2.party":"R","cand.2.percent":49.28,"margin":1.27,"not.fully.reported":"","rowNumber":83},{"district":"42B","margin12":-15.29,"pvi14":-17.25576571,"incumbent":"JASON \\"IKE\\" ISAACSON","incumbent.party":"DFL","cand.1.name":"JASON \\"IKE\\" ISAACSON","cand.1.party":"DFL","cand.1.percent":52.3,"cand.2.name":"HEIDI GUNDERSON","cand.2.party":"R","cand.2.percent":47.55,"margin":4.75,"not.fully.reported":"","rowNumber":84},{"district":"43A","margin12":-5.63,"pvi14":-6.226663421,"incumbent":"PETER M FISCHER","incumbent.party":"DFL","cand.1.name":"PETER M FISCHER","cand.1.party":"DFL","cand.1.percent":50.65,"cand.2.name":"STACEY STOUT","cand.2.party":"R","cand.2.percent":49.14,"margin":1.51,"not.fully.reported":"","rowNumber":85},{"district":"43B","margin12":-21.04,"pvi14":-23.07506828,"incumbent":"LEON M. LILLIE","incumbent.party":"DFL","cand.1.name":"LEON M. LILLIE","cand.1.party":"DFL","cand.1.percent":58.08,"cand.2.name":"JUSTICE B. WHITETHORN","cand.2.party":"R","cand.2.percent":41.75,"margin":16.33,"not.fully.reported":"","rowNumber":86},{"district":"44A","margin12":2.57,"pvi14":13.0455666,"incumbent":"SARAH ANDERSON","incumbent.party":"R","cand.1.name":"SARAH ANDERSON","cand.1.party":"R","cand.1.percent":55.51,"cand.2.name":"AUDREY BRITTON","cand.2.party":"DFL","cand.2.percent":44.43,"margin":11.08,"not.fully.reported":"","rowNumber":87},{"district":"44B","margin12":-11.79,"pvi14":-5.691491551,"incumbent":"","incumbent.party":"DFL","cand.1.name":"JON APPLEBAUM","cand.1.party":"DFL","cand.1.percent":51.3,"cand.2.name":"RYAN RUTZICK","cand.2.party":"R","cand.2.percent":48.46,"margin":2.84,"not.fully.reported":"","rowNumber":88},{"district":"45A","margin12":-19.33,"pvi14":-15.7470442,"incumbent":"LYNDON R. CARLSON","incumbent.party":"DFL","cand.1.name":"LYNDON R. CARLSON","cand.1.party":"DFL","cand.1.percent":56.52,"cand.2.name":"RICHARD LIEBERMAN","cand.2.party":"R","cand.2.percent":43.28,"margin":13.24,"not.fully.reported":"","rowNumber":89},{"district":"45B","margin12":-32.04,"pvi14":-27.41502056,"incumbent":"MIKE FREIBERG","incumbent.party":"DFL","cand.1.name":"MIKE FREIBERG","cand.1.party":"DFL","cand.1.percent":66.94,"cand.2.name":"ALMA J. WETZKER","cand.2.party":"R","cand.2.percent":32.89,"margin":34.05,"not.fully.reported":"","rowNumber":90},{"district":"46A","margin12":-31.93,"pvi14":-27.69129055,"incumbent":"RYAN WINKLER","incumbent.party":"DFL","cand.1.name":"RYAN WINKLER","cand.1.party":"DFL","cand.1.percent":66.17,"cand.2.name":"TIMOTHY O. MANTHEY","cand.2.party":"R","cand.2.percent":33.66,"margin":32.51,"not.fully.reported":"","rowNumber":91},{"district":"46B","margin12":-40.17,"pvi14":-35.89340733,"incumbent":"","incumbent.party":"DFL","cand.1.name":"CHERYL YOUAKIM","cand.1.party":"DFL","cand.1.percent":68.5,"cand.2.name":"BRYAN P. BJORNSON","cand.2.party":"R","cand.2.percent":31.3,"margin":37.2,"not.fully.reported":"","rowNumber":92},{"district":"47A","margin12":25.23,"pvi14":29.29162903,"incumbent":"","incumbent.party":"R","cand.1.name":"MATTHEW W. GIESEKE","cand.1.party":"DFL","cand.1.percent":32.07,"cand.2.name":"JIM NASH","cand.2.party":"R","cand.2.percent":67.64,"margin":35.57,"not.fully.reported":"","rowNumber":93},{"district":"47B","margin12":97.15,"pvi14":67.87286528,"incumbent":"JOE HOPPE","incumbent.party":"R","cand.1.name":"JOE HOPPE","cand.1.party":"R","cand.1.percent":97.18,"cand.2.name":"","cand.2.party":"","cand.2.percent":"","margin":97.18,"not.fully.reported":"","rowNumber":94},{"district":"48A","margin12":-0.82,"pvi14":-2.040107947,"incumbent":"YVONNE SELCER","incumbent.party":"DFL","cand.1.name":"YVONNE SELCER","cand.1.party":"DFL","cand.1.percent":50.03,"cand.2.name":"KIRK STENSRUD","cand.2.party":"R","cand.2.percent":49.84,"margin":0.19,"not.fully.reported":"","rowNumber":95},{"district":"48B","margin12":17.95,"pvi14":23.00047957,"incumbent":"JENIFER LOON","incumbent.party":"R","cand.1.name":"JENIFER LOON","cand.1.party":"R","cand.1.percent":64.42,"cand.2.name":"JOAN HOWE-PULLIS","cand.2.party":"DFL","cand.2.percent":35.43,"margin":28.99,"not.fully.reported":"","rowNumber":96},{"district":"49A","margin12":-11.72,"pvi14":-1.154977486,"incumbent":"RON ERHARDT","incumbent.party":"DFL","cand.1.name":"RON ERHARDT","cand.1.party":"DFL","cand.1.percent":51.38,"cand.2.name":"DARIO ANSELMO","cand.2.party":"R","cand.2.percent":48.55,"margin":2.83,"not.fully.reported":"","rowNumber":97},{"district":"49B","margin12":-6.76,"pvi14":-3.211975607,"incumbent":"PAUL ROSENTHAL","incumbent.party":"DFL","cand.1.name":"PAUL ROSENTHAL","cand.1.party":"DFL","cand.1.percent":52.8,"cand.2.name":"BARB SUTTER","cand.2.party":"R","cand.2.percent":47.11,"margin":5.69,"not.fully.reported":"","rowNumber":98},{"district":"50A","margin12":-31.86,"pvi14":-30.94002296,"incumbent":"LINDA SLOCUM","incumbent.party":"DFL","cand.1.name":"LINDA SLOCUM","cand.1.party":"DFL","cand.1.percent":64.72,"cand.2.name":"DEAN MUMBLEAU","cand.2.party":"R","cand.2.percent":35.11,"margin":29.61,"not.fully.reported":"","rowNumber":99},{"district":"50B","margin12":-30.71,"pvi14":-27.79739366,"incumbent":"ANN LENCZEWSKI","incumbent.party":"DFL","cand.1.name":"ANN LENCZEWSKI","cand.1.party":"DFL","cand.1.percent":65.6,"cand.2.name":"ZAVIER BICOTT","cand.2.party":"R","cand.2.percent":34.24,"margin":31.36,"not.fully.reported":"","rowNumber":100},{"district":"51A","margin12":-11.21,"pvi14":-4.796473124,"incumbent":"SANDRA MASIN","incumbent.party":"DFL","cand.1.name":"SANDRA MASIN","cand.1.party":"DFL","cand.1.percent":51.47,"cand.2.name":"ANDREA TODD-HARLIN","cand.2.party":"R","cand.2.percent":48.34,"margin":3.13,"not.fully.reported":"","rowNumber":101},{"district":"51B","margin12":-3.87,"pvi14":-0.709947338,"incumbent":"LAURIE HALVERSON","incumbent.party":"DFL","cand.1.name":"LAURIE HALVERSON","cand.1.party":"DFL","cand.1.percent":51.09,"cand.2.name":"JEN WILSON","cand.2.party":"R","cand.2.percent":48.8,"margin":2.29,"not.fully.reported":"","rowNumber":102},{"district":"52A","margin12":-25.09,"pvi14":-24.98394128,"incumbent":"RICK HANSEN","incumbent.party":"DFL","cand.1.name":"RICK HANSEN","cand.1.party":"DFL","cand.1.percent":59.38,"cand.2.name":"JOE BLUM","cand.2.party":"R","cand.2.percent":40.47,"margin":18.91,"not.fully.reported":"","rowNumber":103},{"district":"52B","margin12":-32.17,"pvi14":-30.93878402,"incumbent":"JOE ATKINS","incumbent.party":"DFL","cand.1.name":"JOE ATKINS","cand.1.party":"DFL","cand.1.percent":64.47,"cand.2.name":"DON LEE","cand.2.party":"R","cand.2.percent":35.45,"margin":29.02,"not.fully.reported":"","rowNumber":104},{"district":"53A","margin12":-12.54,"pvi14":-14.49891409,"incumbent":"JOANN WARD","incumbent.party":"DFL","cand.1.name":"JOANN WARD","cand.1.party":"DFL","cand.1.percent":58.36,"cand.2.name":"LUKAS CZECH","cand.2.party":"R","cand.2.percent":41.47,"margin":16.89,"not.fully.reported":"","rowNumber":105},{"district":"53B","margin12":9.78,"pvi14":4.676941894,"incumbent":"","incumbent.party":"R","cand.1.name":"KAY HENDRIKSON","cand.1.party":"DFL","cand.1.percent":42.96,"cand.2.name":"KELLY FENTON","cand.2.party":"R","cand.2.percent":56.93,"margin":13.97,"not.fully.reported":"","rowNumber":106},{"district":"54A","margin12":-16.86,"pvi14":-9.267581735,"incumbent":"DAN SCHOEN","incumbent.party":"DFL","cand.1.name":"DAN SCHOEN","cand.1.party":"DFL","cand.1.percent":55.52,"cand.2.name":"MATTHEW KOWALSKI","cand.2.party":"R","cand.2.percent":44.35,"margin":11.17,"not.fully.reported":"","rowNumber":107},{"district":"54B","margin12":15.01,"pvi14":20.611784,"incumbent":"DENNY MCNAMARA","incumbent.party":"R","cand.1.name":"DENNY MCNAMARA","cand.1.party":"R","cand.1.percent":60.53,"cand.2.name":"DONALD SLATEN","cand.2.party":"DFL","cand.2.percent":39.32,"margin":21.21,"not.fully.reported":"","rowNumber":108},{"district":"55A","margin12":9.34,"pvi14":15.20080329,"incumbent":"","incumbent.party":"R","cand.1.name":"BOB LOONAN","cand.1.party":"R","cand.1.percent":56.75,"cand.2.name":"JAY C. WHITING","cand.2.party":"DFL","cand.2.percent":38.76,"margin":17.99,"not.fully.reported":"","rowNumber":109},{"district":"55B","margin12":26.91,"pvi14":28.6836615,"incumbent":"TONY ALBRIGHT","incumbent.party":"R","cand.1.name":"TONY ALBRIGHT","cand.1.party":"R","cand.1.percent":61,"cand.2.name":"KEVIN BURKART","cand.2.party":"DFL","cand.2.percent":35.65,"margin":25.35,"not.fully.reported":"","rowNumber":110},{"district":"56A","margin12":8.05,"pvi14":10.60724223,"incumbent":"","incumbent.party":"R","cand.1.name":"DREW CHRISTENSEN","cand.1.party":"R","cand.1.percent":55.81,"cand.2.name":"DAN KIMMEL","cand.2.party":"DFL","cand.2.percent":44.01,"margin":11.8,"not.fully.reported":"","rowNumber":111},{"district":"56B","margin12":-0.8,"pvi14":5.670417123,"incumbent":"WILL MORGAN","incumbent.party":"DFL","cand.1.name":"WILL MORGAN","cand.1.party":"DFL","cand.1.percent":45.83,"cand.2.name":"ROZ PETERSON","cand.2.party":"R","cand.2.percent":53.99,"margin":8.16,"not.fully.reported":"","rowNumber":112},{"district":"57A","margin12":6.91,"pvi14":8.527259902,"incumbent":"TARA MACK","incumbent.party":"R","cand.1.name":"TARA MACK","cand.1.party":"R","cand.1.percent":58.44,"cand.2.name":"BRUCE FOLKEN","cand.2.party":"DFL","cand.2.percent":41.52,"margin":16.92,"not.fully.reported":"","rowNumber":113},{"district":"57B","margin12":8.93,"pvi14":8.714352454,"incumbent":"ANNA WILLS","incumbent.party":"R","cand.1.name":"ANNA WILLS","cand.1.party":"R","cand.1.percent":58.4,"cand.2.name":"DENISE PACKARD","cand.2.party":"DFL","cand.2.percent":41.53,"margin":16.87,"not.fully.reported":"","rowNumber":114},{"district":"58A","margin12":18.29,"pvi14":25.03739901,"incumbent":"","incumbent.party":"R","cand.1.name":"JON KOZNICK","cand.1.party":"R","cand.1.percent":55.28,"cand.2.name":"AMY WILLINGHAM","cand.2.party":"DFL","cand.2.percent":44.63,"margin":10.65,"not.fully.reported":"","rowNumber":115},{"district":"58B","margin12":19.03,"pvi14":21.1710038,"incumbent":"PAT GAROFALO","incumbent.party":"R","cand.1.name":"PAT GAROFALO","cand.1.party":"R","cand.1.percent":63.86,"cand.2.name":"MARLA VAGTS","cand.2.party":"DFL","cand.2.percent":36.01,"margin":27.85,"not.fully.reported":"","rowNumber":116},{"district":"59A","margin12":-68.56,"pvi14":-64.22276754,"incumbent":"JOE MULLERY","incumbent.party":"DFL","cand.1.name":"JOE MULLERY","cand.1.party":"DFL","cand.1.percent":81.98,"cand.2.name":"FRED STATEMA","cand.2.party":"R","cand.2.percent":17.24,"margin":64.74,"not.fully.reported":"","rowNumber":117},{"district":"59B","margin12":-53.45,"pvi14":-57.16103494,"incumbent":"RAYMOND DEHN","incumbent.party":"DFL","cand.1.name":"RAYMOND DEHN","cand.1.party":"DFL","cand.1.percent":78.1,"cand.2.name":"MARGARET E. MARTIN","cand.2.party":"R","cand.2.percent":21.42,"margin":56.68,"not.fully.reported":"","rowNumber":118},{"district":"60A","margin12":-64.14,"pvi14":-60.61980367,"incumbent":"DIANE LOEFFLER","incumbent.party":"DFL","cand.1.name":"DIANE LOEFFLER","cand.1.party":"DFL","cand.1.percent":82.42,"cand.2.name":"BRENT MILLSOP","cand.2.party":"R","cand.2.percent":17.24,"margin":65.18,"not.fully.reported":"","rowNumber":119},{"district":"60B","margin12":-56.77,"pvi14":-49.23086595,"incumbent":"PHYLLIS KAHN","incumbent.party":"DFL","cand.1.name":"PHYLLIS KAHN","cand.1.party":"DFL","cand.1.percent":76.89,"cand.2.name":"ABDIMALIK ASKAR","cand.2.party":"R","cand.2.percent":22.34,"margin":54.55,"not.fully.reported":"","rowNumber":120},{"district":"61A","margin12":-59.12,"pvi14":-59.83468686,"incumbent":"FRANK HORNSTEIN","incumbent.party":"DFL","cand.1.name":"FRANK HORNSTEIN","cand.1.party":"DFL","cand.1.percent":80.79,"cand.2.name":"FRANK TAYLOR","cand.2.party":"R","cand.2.percent":18.96,"margin":61.83,"not.fully.reported":"","rowNumber":121},{"district":"61B","margin12":-63.06,"pvi14":-59.63653551,"incumbent":"PAUL THISSEN","incumbent.party":"DFL","cand.1.name":"PAUL THISSEN","cand.1.party":"DFL","cand.1.percent":80.94,"cand.2.name":"TOM GALLAGHER","cand.2.party":"R","cand.2.percent":18.92,"margin":62.02,"not.fully.reported":"","rowNumber":122},{"district":"62A","margin12":-79.62,"pvi14":-75.00357064,"incumbent":"KAREN CLARK","incumbent.party":"DFL","cand.1.name":"KAREN CLARK","cand.1.party":"DFL","cand.1.percent":82.13,"cand.2.name":"YOLANDITA COLÓN","cand.2.party":"IP","cand.2.percent":9.57,"margin":72.56,"not.fully.reported":"","rowNumber":123},{"district":"62B","margin12":-77.55,"pvi14":-69.46866551,"incumbent":"SUSAN ALLEN","incumbent.party":"DFL","cand.1.name":"SUSAN ALLEN","cand.1.party":"DFL","cand.1.percent":88.66,"cand.2.name":"JULIE HANSON","cand.2.party":"R","cand.2.percent":10.93,"margin":77.73,"not.fully.reported":"","rowNumber":124},{"district":"63A","margin12":-71.14,"pvi14":-69.15200508,"incumbent":"JIM DAVNIE","incumbent.party":"DFL","cand.1.name":"JIM DAVNIE","cand.1.party":"DFL","cand.1.percent":86.44,"cand.2.name":"KYLE BRAGG","cand.2.party":"R","cand.2.percent":13.21,"margin":73.23,"not.fully.reported":"","rowNumber":125},{"district":"63B","margin12":-53.08,"pvi14":-51.15082375,"incumbent":"JEAN WAGENIUS","incumbent.party":"DFL","cand.1.name":"JEAN WAGENIUS","cand.1.party":"DFL","cand.1.percent":75.06,"cand.2.name":"ANDRES HORTILLOSA","cand.2.party":"R","cand.2.percent":24.64,"margin":50.42,"not.fully.reported":"","rowNumber":126},{"district":"64A","margin12":-57.84,"pvi14":-58.06558719,"incumbent":"ERIN MURPHY","incumbent.party":"DFL","cand.1.name":"ERIN MURPHY","cand.1.party":"DFL","cand.1.percent":81.21,"cand.2.name":"ANDREW BROWN","cand.2.party":"R","cand.2.percent":18.52,"margin":62.69,"not.fully.reported":"","rowNumber":127},{"district":"64B","margin12":-44.51,"pvi14":-42.73616647,"incumbent":"","incumbent.party":"DFL","cand.1.name":"DANIEL SURMAN","cand.1.party":"R","cand.1.percent":26.25,"cand.2.name":"DAVE PINTO","cand.2.party":"DFL","cand.2.percent":73.49,"margin":47.24,"not.fully.reported":"","rowNumber":128},{"district":"65A","margin12":-69.21,"pvi14":-64.13990372,"incumbent":"RENA MORAN","incumbent.party":"DFL","cand.1.name":"RENA MORAN","cand.1.party":"DFL","cand.1.percent":71.2,"cand.2.name":"ANTHONY MESCHKE","cand.2.party":"R","cand.2.percent":14.59,"margin":56.61,"not.fully.reported":"","rowNumber":129},{"district":"65B","margin12":-56.36,"pvi14":-51.43216975,"incumbent":"CARLOS MARIANI","incumbent.party":"DFL","cand.1.name":"CARLOS MARIANI","cand.1.party":"DFL","cand.1.percent":77.54,"cand.2.name":"ANTHONY \\"TONY\\" ATHEN","cand.2.party":"R","cand.2.percent":21.91,"margin":55.63,"not.fully.reported":"","rowNumber":130},{"district":"66A","margin12":-31.89,"pvi14":-28.37965252,"incumbent":"ALICE HAUSMAN","incumbent.party":"DFL","cand.1.name":"ALICE HAUSMAN","cand.1.party":"DFL","cand.1.percent":67.09,"cand.2.name":"JON HEYER","cand.2.party":"R","cand.2.percent":32.76,"margin":34.33,"not.fully.reported":"","rowNumber":131},{"district":"66B","margin12":-58.9,"pvi14":-52.75356953,"incumbent":"JOHN LESCH","incumbent.party":"DFL","cand.1.name":"JOHN LESCH","cand.1.party":"DFL","cand.1.percent":76.41,"cand.2.name":"LIZZ PAULSON","cand.2.party":"R","cand.2.percent":23.06,"margin":53.35,"not.fully.reported":"","rowNumber":132},{"district":"67A","margin12":-56.13,"pvi14":-52.32372048,"incumbent":"TIM MAHONEY","incumbent.party":"DFL","cand.1.name":"TIM MAHONEY","cand.1.party":"DFL","cand.1.percent":72.43,"cand.2.name":"ANDREW LIVINGSTON","cand.2.party":"R","cand.2.percent":27.26,"margin":45.17,"not.fully.reported":"","rowNumber":133},{"district":"67B","margin12":-51.86,"pvi14":-45.79737131,"incumbent":"SHELDON JOHNSON","incumbent.party":"DFL","cand.1.name":"SHELDON JOHNSON","cand.1.party":"DFL","cand.1.percent":72.82,"cand.2.name":"JOHN T. QUINN","cand.2.party":"R","cand.2.percent":26.79,"margin":46.03,"not.fully.reported":"","rowNumber":134}]}';});

/**
 * Main application file for: minnpost-2014-house-results-cartogram
 *
 * This pulls in all the parts
 * and creates the main object for the application.
 */

// Create main application
require([
  'jquery', 'underscore', 'backbone', 'ractive', 'ractive-backbone',
  'ractive-transitions-fade', 'ractive-events-tap', 'leaflet',
  'mpConfig', 'mpFormatters', 'mpMaps', 'base',
  'text!templates/application.mustache',
  'text!../data/district-arrangement.json',
  'text!../data/results.json'
], function(
  $, _, Backbone, Ractive, RactiveBackbone, RactiveTransitionsFade, RactiveEventsTap,
  L, mpConfig, mpFormatters, mpMaps,
  Base,
  tApplication,
  dDistricts, dResults
  ) {
  'use strict';

  // Create new class for app
  var App = Base.BaseApp.extend({

    defaults: {
      name: 'minnpost-2014-house-results-cartogram',
      el: '.minnpost-2014-house-results-cartogram-container',
      boundaryAPI: '//boundaries.minnpost.com/1.0/boundary/[[[ID]]]-state-house-district-2012?callback=?'
    },

    initialize: function() {
      var thisApp = this;

      // Handle some data
      this.districts = JSON.parse(dDistricts);
      this.results = JSON.parse(dResults);

      // Key arrangement by row and column
      this.arrangements = {};
      _.each(this.districts, function(d, di) {
        thisApp.arrangements[mpFormatters.padLeft(d[0]) + mpFormatters.padLeft(d[1])] = d[2];
      });

      // Parse districts
      _.each(this.results, function(d, di) {
        thisApp.results = d;
      });
      this.results = _.map(this.results, function(d, di) {
        var n = {};
        _.each(d, function(f, fi) {
          n[fi.replace(/\./g, '_')] = f;
        });
        return n;
      });
      this.results = _.map(this.results, function(d, di) {
        var c1win = (d.cand_1_percent > d.cand_2_percent);
        d.winner_name = (c1win) ? d.cand_1_name : d.cand_2_name;
        d.winner_party = (c1win) ? d.cand_1_party : d.cand_2_party;
        d.winner_percent = (c1win) ? d.cand_1_percent : d.cand_2_percent;
        d.winner_incumbent = (d.winner_name === d.incumbent);
        d.loser_name = (c1win) ? d.cand_2_name : d.cand_1_name;
        d.loser_party = (c1win) ? d.cand_2_party : d.cand_1_party;
        d.loser_percent = (c1win) ? d.cand_2_percent : d.cand_1_percent;
        d.loser_incumbent = (d.loser_name === d.incumbent);

        d.party_flip = (d.winner_party !== d.incumbent_party);
        d.uncontested = (!d.loser_name);

        return d;
      });
      this.resultsKeyed = {};
      _.each(this.results, function(d, di) {
        thisApp.resultsKeyed[d.district] = d;
      });

      // Add formatter to remove leading zero
      mpFormatters.removeLead = function(input) {
        return (input.indexOf('0') === 0) ? input.substring(1) : input;
      };

      // Create main application view
      this.mainView = new Ractive({
        el: this.$el,
        template: tApplication,
        data: {
          a: this.arrangements,
          aRows: _.range(_.max(this.districts, function(d, di) { return d[1]; })[1] + 1),
          aColumns: _.range(_.max(this.districts, function(d, di) { return d[0]; })[0] + 1),
          r: this.resultsKeyed,
          gs: 32,
          f: mpFormatters
        },
        partials: {
        },
        decorators: {
          map: this.mapDecorator
        }
      });

      // Select item
      this.mainView.on('selectDistrict', function(e, district) {
        var thisView = this;
        e.original.preventDefault();
        var current = this.get('district');
        var bID;

        if (!_.isObject(district) || (current && current.district === district.district)) {
          return false;
        }

        this.set('district', district);

        // Get boundary
        if (!_.isObject(district.boundary)) {
          // Boundary service doesn't want leading zero
          bID = mpFormatters.removeLead(district.district.toLowerCase());
          $.getJSON(thisApp.options.boundaryAPI.replace('[[[ID]]]', bID))
            .done(function(data) {
              if (_.isObject(data)) {
                var current = thisView.get('district');
                // Set on dataset
                thisView.set('r.' + district.district + '.boundary', data);
                // Set on current district if still the same
                if (current && current.district === district.district) {
                  thisView.set('district.boundary', data);
                }
              }
            });
        }
      });
    },

    // Ractive decorator for making a map
    mapDecorator: function(node, shape) {
      var map, layer;

      // Add map
      if (!_.isObject(map) && _.isObject(shape) && !this.get('sizeMedium')) {
        map = mpMaps.makeLeafletMap(node);
        map.removeControl(map.zoomControl);
        map.addControl(new L.Control.Zoom({ position: 'topright' }));
        layer = L.geoJson(shape, {
          style: mpMaps.mapStyle
        }).addTo(map);
        map.fitBounds(layer.getBounds(), {
          padding: [18, 18]
        });
        map.invalidateSize();
      }

      return {
        teardown: function () {
          if (_.isObject(map)) {
            map.remove();
          }
        }
      };
    }

  });

  // Create instance and return
  return new App({});
});

define("app", function(){});

