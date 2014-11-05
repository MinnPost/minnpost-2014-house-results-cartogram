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
