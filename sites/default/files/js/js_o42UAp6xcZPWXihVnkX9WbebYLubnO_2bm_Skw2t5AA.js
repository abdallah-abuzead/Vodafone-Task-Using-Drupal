/**
 * @file
 * Javascript for the geolocation module.
 */

/**
 * @typedef {Object} GeolocationSettings
 *
 * @property {GeolocationMapSettings[]} maps
 * @property {Object} mapCenter
 */

/**
 * @type {GeolocationSettings} drupalSettings.geolocation
 */

/**
 * @typedef {Object} GeolocationMapSettings
 *
 * @property {String} [type] Map type
 * @property {String} id
 * @property {Object} settings
 * @property {Number} lat
 * @property {Number} lng
 * @property {Object[]} map_center
 * @property {jQuery} wrapper
 * @property {GeolocationMapMarker[]} mapMarkers
 */

/**
 * Callback when map is clicked.
 *
 * @callback GeolocationMapClickCallback
 *
 * @param {GeolocationCoordinates} location - Click location.
 */

/**
 * Callback when a marker is added or removed.
 *
 * @callback GeolocationMarkerCallback
 *
 * @param {GeolocationMapMarker} marker - Map marker.
 */

/**
 * Callback when map is right-clicked.
 *
 * @callback GeolocationMapContextClickCallback
 *
 * @param {GeolocationCoordinates} location - Click location.
 */

/**
 * Callback when map provider becomes available.
 *
 * @callback GeolocationMapInitializedCallback
 *
 * @param {GeolocationMapInterface} map - Geolocation map.
 */

/**
 * Callback when map fully loaded.
 *
 * @callback GeolocationMapPopulatedCallback
 *
 * @param {GeolocationMapInterface} map - Geolocation map.
 */

/**
 * @typedef {Object} GeolocationCoordinates

 * @property {Number} lat
 * @property {Number} lng
 */

/**
 * @typedef {Object} GeolocationMapMarker
 *
 * @property {GeolocationCoordinates} position
 * @property {string} title
 * @property {boolean} [setMarker]
 * @property {string} [icon]
 * @property {string} [label]
 * @property {jQuery} locationWrapper
 */

/**
 * Interface for classes that represent a color.
 *
 * @interface GeolocationMapInterface
 *
 * @property {Boolean} initialized - True when map provider available and initializedCallbacks executed.
 * @property {Boolean} loaded - True when map fully loaded and all loadCallbacks executed.
 * @property {String} id
 * @property {GeolocationMapSettings} settings
 * @property {Number} lat
 * @property {Number} lng
 * @property {Object[]} mapCenter
 * @property {jQuery} wrapper
 * @property {jQuery} container
 * @property {Object[]} mapMarkers
 *
 * @property {function({jQuery}):{jQuery}} addControl - Add control to map, identified by classes.
 * @property {function()} removeControls - Remove controls from map.
 *
 * @property {function()} populatedCallback - Executes {GeolocationMapPopulatedCallback[]} for this map.
 * @property {function({GeolocationMapPopulatedCallback})} addPopulatedCallback - Adds a callback that will be called when map is fully loaded.
 * @property {function()} initializedCallback - Executes {GeolocationMapInitializedCallbacks[]} for this map.
 * @property {function({GeolocationMapInitializedCallback})} addInitializedCallback - Adds a callback that will be called when map provider becomes available.
 * @property {function({GeolocationMapSettings})} update - Update existing map by settings.
 *
 * @property {function({GeolocationMapMarker}):{GeolocationMapMarker}} setMapMarker - Set marker on map.
 * @property {function({GeolocationMapMarker})} removeMapMarker - Remove single marker.
 * @property {function()} removeMapMarkers - Remove all markers from map.
 *s
 * @property {function({string})} setZoom - Set zoom.
 * @property {function():{GeolocationCoordinates}} getCenter - Get map center coordinates.
 * @property {function({string})} setCenter - Center map by plugin.
 * @property {function({GeolocationCoordinates}, {Number}?, {string}?)} setCenterByCoordinates - Center map on coordinates.
 * @property {function({GeolocationMapMarker[]}?, {String}?)} fitMapToMarkers - Fit map to markers.
 * @property {function({GeolocationMapMarker[]}?):{Object}} getMarkerBoundaries - Get marker boundaries.
 * @property {function({Object}, {String}?)} fitBoundaries - Fit map to bounds.
 *
 * @property {function({Event})} clickCallback - Executes {GeolocationMapClickCallbacks} for this map.
 * @property {function({GeolocationMapClickCallback})} addClickCallback - Adds a callback that will be called when map is clicked.
 *
 * @property {function({Event})} doubleClickCallback - Executes {GeolocationMapClickCallbacks} for this map.
 * @property {function({GeolocationMapClickCallback})} addDoubleClickCallback - Adds a callback that will be called on double click.
 *
 * @property {function({Event})} contextClickCallback - Executes {GeolocationMapContextClickCallbacks} for this map.
 * @property {function({GeolocationMapContextClickCallback})} addContextClickCallback - Adds a callback that will be called when map is clicked.
 *
 * @property {function({GeolocationMapMarker})} markerAddedCallback - Executes {GeolocationMarkerCallback} for this map.
 * @property {function({GeolocationMarkerCallback})} addMarkerAddedCallback - Adds a callback that will be called on marker(s) being added.
 *
 * @property {function({GeolocationMapMarker})} markerRemoveCallback - Executes {GeolocationMarkerCallback} for this map.
 * @property {function({GeolocationMarkerCallback})} addMarkerRemoveCallback - Adds a callback that will be called before marker is removed.
 */

/**
 * Geolocation map API.
 *
 * @implements {GeolocationMapInterface}
 */
(function ($, Drupal) {

  'use strict';

  /**
   * @namespace
   * @prop {Object} Drupal.geolocation
   */
  Drupal.geolocation = Drupal.geolocation || {};

  /**
   * @type {GeolocationMapInterface[]}
   * @prop {GeolocationMapSettings} settings The map settings.
   */
  Drupal.geolocation.maps = Drupal.geolocation.maps || [];

  Drupal.geolocation.mapCenter = Drupal.geolocation.mapCenter || {};

  /**
   * Geolocation map.
   *
   * @constructor
   * @abstract
   * @implements {GeolocationMapInterface}
   *
   * @param {GeolocationMapSettings} mapSettings Setting to create map.
   */
  function GeolocationMapBase(mapSettings) {
    this.settings = mapSettings.settings || {};
    this.wrapper = mapSettings.wrapper;
    this.container = mapSettings.wrapper.find('.geolocation-map-container').first();

    if (this.container.length !== 1) {
      throw "Geolocation - Map container not found";
    }

    this.initialized = false;
    this.populated = false;
    this.lat = mapSettings.lat;
    this.lng = mapSettings.lng;

    if (typeof mapSettings.id === 'undefined') {
      this.id = 'map' + Math.floor(Math.random() * 10000);
    }
    else {
      this.id = mapSettings.id;
    }

    this.mapCenter = mapSettings.map_center;
    this.mapMarkers = this.mapMarkers || [];

    return this;
  }

  GeolocationMapBase.prototype = {
    addControl: function (element) {
      // Stub.
    },
    removeControls: function () {
      // Stub.
    },
    update: function (mapSettings) {
      this.settings = $.extend(this.settings, mapSettings.settings);
      this.wrapper = mapSettings.wrapper;
      mapSettings.wrapper.find('.geolocation-map-container').replaceWith(this.container);
      this.lat = mapSettings.lat;
      this.lng = mapSettings.lng;
      if (typeof mapSettings.map_center !== 'undefined') {
        this.mapCenter = mapSettings.map_center;
      }
    },
    setZoom: function (zoom) {
      // Stub.
    },
    getCenter: function () {
      // Stub.
    },
    setCenter: function () {
      if (typeof this.wrapper.data('preserve-map-center') !== 'undefined') {
        return;
      }

      this.setZoom();
      this.setCenterByCoordinates({lat: this.lat, lng: this.lng});

      var that = this;

      Object
        .values(this.mapCenter)
        .sort(function (a, b) {
          return a.weight - b.weight;
        })
        .forEach(
          /**
           * @param {Object} centerOption
           * @param {Object} centerOption.map_center_id
           * @param {Object} centerOption.option_id
           * @param {Object} centerOption.settings
           */
          function (centerOption) {
            if (typeof Drupal.geolocation.mapCenter[centerOption.map_center_id] === 'function') {
              return Drupal.geolocation.mapCenter[centerOption.map_center_id](that, centerOption);
            }
          }
        );
    },
    setCenterByCoordinates: function (coordinates, accuracy, identifier) {
      this.centerUpdatedCallback(coordinates, accuracy, identifier);
    },
    setMapMarker: function (marker) {
      this.mapMarkers.push(marker);
      this.markerAddedCallback(marker);
    },
    removeMapMarker: function (marker) {
      var that = this;
      $.each(
        this.mapMarkers,

        /**
         * @param {integer} index - Current index.
         * @param {GeolocationMapMarker} item - Current marker.
         */
        function (index, item) {
          if (item === marker) {
            that.markerRemoveCallback(marker);
            that.mapMarkers.splice(Number(index), 1);
          }
        }
      );
    },
    removeMapMarkers: function () {
      var that = this;
      var shallowCopy = $.extend({}, this.mapMarkers);
      $.each(
        shallowCopy,

        /**
         * @param {integer} index - Current index.
         * @param {GeolocationMapMarker} item - Current marker.
         */
        function (index, item) {
          if (typeof item === 'undefined') {
            return;
          }
          that.removeMapMarker(item);
        }
      );
    },
    fitMapToMarkers: function (markers, identifier) {
      var boundaries = this.getMarkerBoundaries();
      if (boundaries === false) {
        return false;
      }

      this.fitBoundaries(boundaries, identifier);
    },
    getMarkerBoundaries: function (markers) {
      // Stub.
    },
    fitBoundaries: function (boundaries, identifier) {
      this.centerUpdatedCallback(this.getCenter(), null, identifier);
    },
    clickCallback: function (location) {
      this.clickCallbacks = this.clickCallbacks || [];
      $.each(this.clickCallbacks, function (index, callback) {
        callback(location);
      });
    },
    addClickCallback: function (callback) {
      this.clickCallbacks = this.clickCallbacks || [];
      this.clickCallbacks.push(callback);
    },
    doubleClickCallback: function (location) {
      this.doubleClickCallbacks = this.doubleClickCallbacks || [];
      $.each(this.doubleClickCallbacks, function (index, callback) {
        callback(location);
      });
    },
    addDoubleClickCallback: function (callback) {
      this.doubleClickCallbacks = this.doubleClickCallbacks || [];
      this.doubleClickCallbacks.push(callback);
    },
    contextClickCallback: function (location) {
      this.contextClickCallbacks = this.contextClickCallbacks || [];
      $.each(this.contextClickCallbacks, function (index, callback) {
        callback(location);
      });
    },
    addContextClickCallback: function (callback) {
      this.contextClickCallbacks = this.contextClickCallbacks || [];
      this.contextClickCallbacks.push(callback);
    },
    initializedCallback: function () {
      this.initializedCallbacks = this.initializedCallbacks || [];
      while (this.initializedCallbacks.length > 0) {
        this.initializedCallbacks.shift()(this);
      }
      this.initialized = true;
    },
    addInitializedCallback: function (callback) {
      if (this.initialized) {
        callback(this);
      }
      else {
        this.initializedCallbacks = this.initializedCallbacks || [];
        this.initializedCallbacks.push(callback);
      }
    },
    centerUpdatedCallback: function (coordinates, accuracy, identifier) {
      this.centerUpdatedCallbacks = this.centerUpdatedCallbacks || [];
      $.each(this.centerUpdatedCallbacks, function (index, callback) {
        callback(coordinates, accuracy, identifier);
      });
    },
    addCenterUpdatedCallback: function (callback) {
      this.centerUpdatedCallbacks = this.centerUpdatedCallbacks || [];
      this.centerUpdatedCallbacks.push(callback);
    },
    markerAddedCallback: function (marker) {
      this.markerAddedCallbacks = this.markerAddedCallbacks || [];
      $.each(this.markerAddedCallbacks, function (index, callback) {
        callback(marker);
      });
    },
    addMarkerAddedCallback: function (callback, existing) {
      existing = existing || true;
      if (existing) {
        $.each(this.mapMarkers, function (index, marker) {
          callback(marker);
        });
      }
      this.markerAddedCallbacks = this.markerAddedCallbacks || [];
      this.markerAddedCallbacks.push(callback);
    },
    markerRemoveCallback: function (marker) {
      this.markerRemoveCallbacks = this.markerRemoveCallbacks || [];
      $.each(this.markerRemoveCallbacks, function (index, callback) {
        callback(marker);
      });
    },
    addMarkerRemoveCallback: function (callback) {
      this.markerRemoveCallbacks = this.markerRemoveCallbacks || [];
      this.markerRemoveCallbacks.push(callback);
    },
    populatedCallback: function () {
      this.populatedCallbacks = this.populatedCallbacks || [];
      while (this.populatedCallbacks.length > 0) {
        this.populatedCallbacks.shift()(this);
      }
      this.populated = true;
    },
    addPopulatedCallback: function (callback) {
      if (this.populated) {
        callback(this);
      }
      else {
        this.populatedCallbacks = this.populatedCallbacks || [];
        this.populatedCallbacks.push(callback);
      }
    },
    loadMarkersFromContainer: function () {
      var locations = [];
      this.wrapper.find('.geolocation-location').each(function (index, locationWrapperElement) {

        var locationWrapper = $(locationWrapperElement);

        var position = {
          lat: Number(locationWrapper.data('lat')),
          lng: Number(locationWrapper.data('lng'))
        };

        /** @type {GeolocationMapMarker} */
        var location = {
          position: position,
          title: locationWrapper.find('.location-title').text().trim(),
          setMarker: true,
          locationWrapper: locationWrapper
        };

        if (typeof locationWrapper.data('icon') !== 'undefined') {
          location.icon = locationWrapper.data('icon').toString();
        }

        if (typeof locationWrapper.data('label') !== 'undefined') {
          location.label = locationWrapper.data('label').toString();
        }

        if (locationWrapper.data('set-marker') === 'false') {
          location.setMarker = false;
        }

        locations.push(location);
      });

      return locations;
    }
  };

  Drupal.geolocation.GeolocationMapBase = GeolocationMapBase;

  /**
   * Factory creating map instances.
   *
   * @constructor
   *
   * @param {GeolocationMapSettings} mapSettings The map settings.
   * @param {Boolean} [reset] Force creation of new map.
   *
   * @return {GeolocationMapInterface|boolean} Un-initialized map.
   */
  function Factory(mapSettings, reset) {
    reset = reset || false;
    mapSettings.type = mapSettings.type || 'google_maps';

    var map = null;

    /**
     * Previously stored map.
     * @type {boolean|GeolocationMapInterface}
     */
    var existingMap = Drupal.geolocation.getMapById(mapSettings.id);

    if (reset === true || !existingMap) {
      if (typeof Drupal.geolocation[Drupal.geolocation.MapProviders[mapSettings.type]] !== 'undefined') {
        var mapProvider = Drupal.geolocation[Drupal.geolocation.MapProviders[mapSettings.type]];
        map = new mapProvider(mapSettings);
        Drupal.geolocation.maps.push(map);
      }
    }
    else {
      map = existingMap;
      map.update(mapSettings);
    }

    if (!map) {
      console.error("Map could not be initialized."); // eslint-disable-line no-console .
      return false;
    }

    if (typeof map.container === 'undefined') {
      console.error("Map container not set."); // eslint-disable-line no-console .
      return false;
    }

    if (map.container.length !== 1) {
      console.error("Map container not unique."); // eslint-disable-line no-console .
      return false;
    }

    return map;
  }

  Drupal.geolocation.Factory = Factory;

  /**
   * @type {Object}
   */
  Drupal.geolocation.MapProviders = {};

  Drupal.geolocation.addMapProvider = function (type, name) {
    Drupal.geolocation.MapProviders[type] = name;
  };

  /**
   * Get map by ID.
   *
   * @param {String} id - Map ID to retrieve.
   *
   * @return {GeolocationMapInterface|boolean} - Retrieved map or false.
   */
  Drupal.geolocation.getMapById = function (id) {
    var map = false;
    $.each(Drupal.geolocation.maps, function (index, currentMap) {
      if (currentMap.id === id) {
        map = currentMap;
      }
    });

    if (!map) {
      return false;
    }

    if (typeof map.container === 'undefined') {
      console.error("Existing map container not set."); // eslint-disable-line no-console .
      return false;
    }

    if (map.container.length !== 1) {
      console.error("Existing map container not unique."); // eslint-disable-line no-console .
      return false;
    }

    return map;
  };

  /**
   * @typedef {Object} GeolocationMapFeatureSettings
   *
   * @property {String} id
   * @property {boolean} enabled
   * @property {boolean} executed
   */

  /**
   * Callback when map is clicked.
   *
   * @callback GeolocationMapFeatureCallback
   *
   * @param {GeolocationMapInterface} map - Map.
   * @param {GeolocationMapFeatureSettings} featureSettings - Settings.
   *
   * @return {boolean} - Executed successfully.
   */

  /**
   * Get map by ID.
   *
   * @param {String} featureId - Map ID to retrieve.
   * @param {GeolocationMapFeatureCallback} callback - Retrieved map or false.
   * @param {Object} drupalSettings - Drupal settings.
   */
  Drupal.geolocation.executeFeatureOnAllMaps = function (featureId, callback, drupalSettings) {
    if (typeof drupalSettings.geolocation === 'undefined') {
      return false;
    }

    $.each(
      drupalSettings.geolocation.maps,

      /**
       * @param {String} mapId - ID of current map
       * @param {Object} mapSettings - settings for current map
       * @param {GeolocationMapFeatureSettings} mapSettings[featureId] - Feature settings for current map
       */
      function (mapId, mapSettings) {
        if (
          typeof mapSettings[featureId] !== 'undefined'
          && mapSettings[featureId].enable
        ) {
          var map = Drupal.geolocation.getMapById(mapId);
          if (!map) {
            return;
          }

          map.features = map.features || {};
          map.features[featureId] = map.features[featureId] || {};
          if (typeof map.features[featureId].executed === 'undefined') {
            map.features[featureId].executed = false;
          }

          if (map.features[featureId].executed) {
            return;
          }

          map.addPopulatedCallback(function (map) {
            if (map.features[featureId].executed) {
              return;
            }
            var result = callback(map, mapSettings[featureId]);

            if (result === true) {
              map.features[featureId].executed = true;
            }
          });
        }
      }
    );
  };

})(jQuery, Drupal);
;
/**
 * @file
 * Javascript for the Geolocation map formatter.
 */

(function ($, Drupal) {

  'use strict';

  /**
   * Find and display all maps.
   *
   * @type {Drupal~behavior}
   *
   * @prop {Drupal~behaviorAttach} attach
   *   Attaches Geolocation Maps formatter functionality to relevant elements.
   */
  Drupal.behaviors.geolocationMap = {

    /**
     * @param context
     * @param drupalSettings
     * @param {Object} drupalSettings.geolocation
     */
    attach: function (context, drupalSettings) {
      $('.geolocation-map-wrapper').once('geolocation-map-processed').each(function (index, item) {
        var mapWrapper = $(item);
        var mapSettings = {};
        var reset = false;
        mapSettings.id = mapWrapper.attr('id');
        mapSettings.wrapper = mapWrapper;

        if (mapWrapper.length === 0) {
          return;
        }

        mapSettings.lat = 0;
        mapSettings.lng = 0;

        if (
          mapWrapper.data('centre-lat')
          && mapWrapper.data('centre-lng')
        ) {
          mapSettings.lat = Number(mapWrapper.data('centre-lat'));
          mapSettings.lng = Number(mapWrapper.data('centre-lng'));
        }

        if (mapWrapper.data('map-type')) {
          mapSettings.type = mapWrapper.data('map-type');
        }

        if (typeof drupalSettings.geolocation === 'undefined') {
          console.error("Bailing out for lack of settings.");  // eslint-disable-line no-console .
          return;
        }

        $.each(drupalSettings.geolocation.maps, function (mapId, currentSettings) {
          if (mapId === mapSettings.id) {
            mapSettings = $.extend(currentSettings, mapSettings);
          }
        });

        if (mapWrapper.parent().hasClass('preview-section')) {
          if (mapWrapper.parentsUntil('#views-live-preview').length) {
            reset = true;
          }
        }

        var map = Drupal.geolocation.Factory(mapSettings, reset);

        if (!map) {
          mapWrapper.removeOnce('geolocation-map-processed');
          return;
        }

        map.addInitializedCallback(function (map) {
          map.removeControls();
          $('.geolocation-map-controls > *', map.wrapper).each(function (index, control) {
            map.addControl(control);
          });
          map.removeMapMarkers();

          var locations = map.loadMarkersFromContainer();

          $.each(locations, function (index, location) {
            map.setMapMarker(location);
          });
          map.setCenter();

          map.wrapper.find('.geolocation-location').hide();
        });
      });
    },
    detach: function (context, drupalSettings) {}
  };

})(jQuery, Drupal);
;
/**
 * @file
 * Handle the common map.
 */

/**
 * @name CommonMapUpdateSettings
 * @property {String} enable
 * @property {String} hide_form
 * @property {number} views_refresh_delay
 * @property {String} update_view_id
 * @property {String} update_view_display_id
 * @property {String} boundary_filter
 * @property {String} parameter_identifier
 */

/**
 * @name CommonMapSettings
 * @property {Object} settings
 * @property {CommonMapUpdateSettings} dynamic_map
 * @property {Boolean} markerScrollToResult
 */

/**
 * @property {CommonMapSettings[]} drupalSettings.geolocation.commonMap
 */

(function ($, window, Drupal, drupalSettings) {
  'use strict';

  /**
   * Attach common map style functionality.
   *
   * @type {Drupal~behavior}
   *
   * @prop {Drupal~behaviorAttach} attach
   *   Attaches common map style functionality to relevant elements.
   */
  Drupal.behaviors.geolocationCommonMap = {
    /**
     * @param {GeolocationSettings} drupalSettings.geolocation
     */
    attach: function (context, drupalSettings) {
      if (typeof drupalSettings.geolocation === 'undefined') {
        return;
      }

      $.each(
        drupalSettings.geolocation.commonMap,

        /**
         * @param {String} mapId - ID of current map
         * @param {CommonMapSettings} commonMapSettings - settings for current map
         */
        function (mapId, commonMapSettings) {

          var map = Drupal.geolocation.getMapById(mapId);

          if (!map) {
            return;
          }

          /*
           * Hide form if requested.
           */
          if (
            typeof commonMapSettings.dynamic_map !== 'undefined'
            && commonMapSettings.dynamic_map.enable
            && commonMapSettings.dynamic_map.hide_form
            && typeof commonMapSettings.dynamic_map.parameter_identifier !== 'undefined'
          ) {
            var exposedForm = $('form#views-exposed-form-' + commonMapSettings.dynamic_map.update_view_id.replace(/_/g, '-') + '-' + commonMapSettings.dynamic_map.update_view_display_id.replace(/_/g, '-'));

            if (exposedForm.length === 1) {
              exposedForm.find('input[name^="' + commonMapSettings.dynamic_map.parameter_identifier + '"]').each(function (index, item) {
                $(item).parent().hide();
              });

              // Hide entire form if it's empty now, except form-submit.
              if (exposedForm.find('input:visible:not(.form-submit), select:visible').length === 0) {
                exposedForm.hide();
              }
            }
          }
        }
      );
    },
    detach: function (context, drupalSettings) {}
  };

  Drupal.geolocation.commonMap = Drupal.geolocation.commonMap || {};

  Drupal.geolocation.commonMap.dynamicMapViewsAjaxSettings = function (commonMapSettings) {
    // Make sure to load current form DOM element, which will change after every AJAX operation.
    var view = $('.view-id-' + commonMapSettings.dynamic_map.update_view_id + '.view-display-id-' + commonMapSettings.dynamic_map.update_view_display_id);

    if (typeof commonMapSettings.dynamic_map.boundary_filter === 'undefined') {
      return;
    }

    // Extract the view DOM ID from the view classes.
    var matches = /(js-view-dom-id-\w+)/.exec(view.attr('class').toString());
    var currentViewId = matches[1].replace('js-view-dom-id-', 'views_dom_id:');

    var viewInstance = Drupal.views.instances[currentViewId];
    var ajaxSettings = $.extend(true, {}, viewInstance.element_settings);
    ajaxSettings.progress.type = 'none';

    var exposedForm = $('form#views-exposed-form-' + commonMapSettings.dynamic_map.update_view_id.replace(/_/g, '-') + '-' + commonMapSettings.dynamic_map.update_view_display_id.replace(/_/g, '-'));
    if (exposedForm.length) {
      // Add form values.
      jQuery.each(exposedForm.serializeArray(), function (index, field) {
        var add = {};
        add[field.name] = field.value;
        ajaxSettings.submit = $.extend(ajaxSettings.submit, add);
      });
    }

    // Trigger geolocation bounds specific behavior.
    ajaxSettings.submit = $.extend(ajaxSettings.submit, {geolocation_common_map_dynamic_view: true});

    return ajaxSettings;
  };

})(jQuery, window, Drupal, drupalSettings);
;
/**
 * @file
 * Javascript for the Google Maps API integration.
 */

/**
 * @callback googleLoadedCallback
 */

/**
 * @typedef {Object} Drupal.geolocation.google
 * @property {googleLoadedCallback[]} loadedCallbacks
 */

/**
 * @name GoogleMapSettings
 * @property {String} info_auto_display
 * @property {String} marker_icon_path
 * @property {String} height
 * @property {String} width
 * @property {Number} zoom
 * @property {Number} maxZoom
 * @property {Number} minZoom
 * @property {String} type
 * @property {String} gestureHandling
 * @property {Boolean} panControl
 * @property {Boolean} mapTypeControl
 * @property {Boolean} scaleControl
 * @property {Boolean} streetViewControl
 * @property {Boolean} overviewMapControl
 * @property {Boolean} zoomControl
 * @property {Boolean} rotateControl
 * @property {Boolean} fullscreenControl
 * @property {Object} zoomControlOptions
 * @property {String} mapTypeId
 * @property {String} info_text
 */

(function ($, Drupal) {
  'use strict';

  Drupal.geolocation.google = Drupal.geolocation.google || {};

  /**
   * GeolocationGoogleMap element.
   *
   * @constructor
   * @augments {GeolocationMapBase}
   * @implements {GeolocationMapInterface}
   * @inheritDoc
   *
   * @prop {GoogleMapSettings} settings.google_map_settings - Google Map specific settings.
   * @prop {google.maps.Map} googleMap - Google Map.
   */
  function GeolocationGoogleMap(mapSettings) {
    this.type = 'google_maps';

    Drupal.geolocation.GeolocationMapBase.call(this, mapSettings);

    var defaultGoogleSettings = {
      panControl: false,
      scaleControl: false,
      rotateControl: false,
      mapTypeId: 'roadmap',
      zoom: 2,
      maxZoom: 20,
      minZoom: 0,
      style: [],
      gestureHandling: 'auto'
    };

    // Add any missing settings.
    this.settings.google_map_settings = $.extend(defaultGoogleSettings, this.settings.google_map_settings);

    // Set the container size.
    this.container.css({
      height: this.settings.google_map_settings.height,
      width: this.settings.google_map_settings.width
    });

    this.addInitializedCallback(function (map) {
      // Get the center point.
      var center = new google.maps.LatLng(map.lat, map.lng);

      /**
       * Create the map object and assign it to the map.
       */
      map.googleMap = new google.maps.Map(map.container[0], {
        zoom: map.settings.google_map_settings.zoom,
        maxZoom: map.settings.google_map_settings.maxZoom,
        minZoom: map.settings.google_map_settings.minZoom,
        center: center,
        mapTypeId: google.maps.MapTypeId[map.settings.google_map_settings.type],
        mapTypeControl: false, // Handled by feature.
        zoomControl: false, // Handled by feature.
        streetViewControl: false, // Handled by feature.
        rotateControl: map.settings.google_map_settings.rotateControl,
        fullscreenControl: false, // Handled by feature.
        scaleControl: map.settings.google_map_settings.scaleControl,
        panControl: map.settings.google_map_settings.panControl,
        gestureHandling: map.settings.google_map_settings.gestureHandling
      });

      var singleClick;
      var timer;
      google.maps.event.addListener(map.googleMap, 'click', function (e) {
        // Create 500ms timeout to wait for double click.
        singleClick = setTimeout(function () {
          map.clickCallback({lat: e.latLng.lat(), lng: e.latLng.lng()});
        }, 500);
        timer = Date.now();
      });

      google.maps.event.addListener(map.googleMap, 'dblclick', function (e) {
        clearTimeout(singleClick);
        map.doubleClickCallback({lat: e.latLng.lat(), lng: e.latLng.lng()});
      });

      google.maps.event.addListener(map.googleMap, 'rightclick', function (e) {
        map.contextClickCallback({lat: e.latLng.lat(), lng: e.latLng.lng()});
      });

      google.maps.event.addListenerOnce(map.googleMap, 'tilesloaded', function () {
        map.populatedCallback();
      });
    });

    if (this.initialized) {
      this.initializedCallback();
    }
    else {
      var that = this;
      Drupal.geolocation.google.addLoadedCallback(function () {
        that.initializedCallback();
      });

      // Load Google Maps API and execute all callbacks.
      Drupal.geolocation.google.load();
    }
  }
  GeolocationGoogleMap.prototype = Object.create(Drupal.geolocation.GeolocationMapBase.prototype);
  GeolocationGoogleMap.prototype.constructor = GeolocationGoogleMap;
  GeolocationGoogleMap.prototype.setMapMarker = function (markerSettings) {
    if (typeof markerSettings.setMarker !== 'undefined') {
      if (markerSettings.setMarker === false) {
       return;
      }
    }

    markerSettings.position = new google.maps.LatLng(Number(markerSettings.position.lat), Number(markerSettings.position.lng));
    markerSettings.map = this.googleMap;

    if (typeof this.settings.google_map_settings.marker_icon_path === 'string') {
      if (
        this.settings.google_map_settings.marker_icon_path
        && typeof markerSettings.icon === 'undefined'
      ) {
        markerSettings.icon = this.settings.google_map_settings.marker_icon_path;
      }
    }

    /** @type {google.maps.Marker} */
    var currentMarker = new google.maps.Marker(markerSettings);

    Drupal.geolocation.GeolocationMapBase.prototype.setMapMarker.call(this, currentMarker);

    return currentMarker;
  };
  GeolocationGoogleMap.prototype.removeMapMarker = function (marker) {
    if (typeof marker === 'undefined') {
      return;
    }
    Drupal.geolocation.GeolocationMapBase.prototype.removeMapMarker.call(this, marker);
    marker.setMap(null);
  };
  GeolocationGoogleMap.prototype.getMarkerBoundaries = function (locations) {

    locations = locations || this.mapMarkers;
    if (locations.length === 0) {
      return false;
    }

    // A Google Maps API tool to re-center the map on its content.
    var bounds = new google.maps.LatLngBounds();

    $.each(
      locations,

      /**
       * @param {integer} index - Current index.
       * @param {google.maps.Marker} item - Current marker.
       */
      function (index, item) {
        bounds.extend(item.getPosition());
      }
    );
    return bounds;
  };
  GeolocationGoogleMap.prototype.fitBoundaries = function (boundaries, identifier) {
    var currentBounds = this.googleMap.getBounds();
    if (
      !currentBounds
      || !currentBounds.equals(boundaries)
    ) {
      this.googleMap.fitBounds(boundaries);
      Drupal.geolocation.GeolocationMapBase.prototype.fitBoundaries.call(this, boundaries, identifier);
    }
  };
  GeolocationGoogleMap.prototype.setZoom = function (zoom) {
    if (typeof zoom === 'undefined') {
      zoom = this.settings.google_map_settings.zoom;
    }

    zoom = parseInt(zoom);

    this.googleMap.setZoom(zoom);
    var that = this;
    google.maps.event.addListenerOnce(this.googleMap, "idle", function () {
      that.googleMap.setZoom(zoom);
    });
  };
  GeolocationGoogleMap.prototype.getCenter = function () {
    var center = this.googleMap.getCenter();
    return {lat: center.lat(), lng: center.lng()};
  };
  GeolocationGoogleMap.prototype.setCenterByCoordinates = function (coordinates, accuracy, identifier) {
    Drupal.geolocation.GeolocationMapBase.prototype.setCenterByCoordinates.call(this, coordinates, accuracy, identifier);

    if (typeof accuracy === 'undefined') {
      this.googleMap.setCenter(coordinates);
      return;
    }

    var circle = this.addAccuracyIndicatorCircle(coordinates, accuracy);

    // Set the zoom level to the accuracy circle's size.
    this.googleMap.fitBounds(circle.getBounds());

    // Fade circle away.
    setInterval(fadeCityCircles, 200);

    function fadeCityCircles() {
      var fillOpacity = circle.get('fillOpacity');
      fillOpacity -= 0.01;

      var strokeOpacity = circle.get('strokeOpacity');
      strokeOpacity -= 0.02;

      if (
        strokeOpacity > 0
        && fillOpacity > 0
      ) {
        circle.setOptions({fillOpacity: fillOpacity, strokeOpacity: strokeOpacity});
      }
      else {
        circle.setMap(null);
      }
    }
  };
  GeolocationGoogleMap.prototype.addControl = function (element) {
    element = $(element);

    var position = google.maps.ControlPosition.TOP_LEFT;

    if (typeof element.data('googleMapControlPosition') !== 'undefined') {
      var customPosition = element.data('googleMapControlPosition');
      if (typeof google.maps.ControlPosition[customPosition] !== 'undefined') {
        position = google.maps.ControlPosition[customPosition];
      }
    }

    var controlAlreadyAdded = false;
    var controlIndex = 0;
    this.googleMap.controls[position].forEach(function (controlElement, index) {
      var control = $(controlElement);
      if (element[0].getAttribute("class") === control[0].getAttribute("class")) {
        controlAlreadyAdded = true;
        controlIndex = index;
      }
    });

    if (!controlAlreadyAdded) {
      element.show();
      this.googleMap.controls[position].push(element[0]);
      return element;
    }
    else {
      element.remove();

      return this.googleMap.controls[position].getAt(controlIndex);
    }
  };
  GeolocationGoogleMap.prototype.removeControls = function () {
    $.each(this.googleMap.controls, function (index, item) {
      if (typeof item === 'undefined') {
        return;
      }

      if (typeof item.clear === 'function') {
        item.clear();
      }
    });
  };

  Drupal.geolocation.GeolocationGoogleMap = GeolocationGoogleMap;
  Drupal.geolocation.addMapProvider('google_maps', 'GeolocationGoogleMap');

  /**
   * Draw a circle representing the accuracy radius of HTML5 geolocation.
   *
   * @param {GeolocationCoordinates|google.maps.LatLng} location - Location to center on.
   * @param {int} accuracy - Accuracy in m.
   *
   * @return {google.maps.Circle} - Indicator circle.
   */
  GeolocationGoogleMap.prototype.addAccuracyIndicatorCircle = function (location, accuracy) {
    return new google.maps.Circle({
      center: location,
      radius: accuracy,
      map: this.googleMap,
      fillColor: '#4285F4',
      fillOpacity: 0.15,
      strokeColor: '#4285F4',
      strokeOpacity: 0.3,
      strokeWeight: 1,
      clickable: false
    });
  };

  /**
   * @inheritDoc
   */
  Drupal.geolocation.google.addLoadedCallback = function (callback) {
    Drupal.geolocation.google.loadedCallbacks = Drupal.geolocation.google.loadedCallbacks || [];
    Drupal.geolocation.google.loadedCallbacks.push(callback);
  };

  /**
   * Provides the callback that is called when maps loads.
   */
  Drupal.geolocation.google.load = function () {
    // Check for Google Maps.
    if (typeof google === 'undefined' || typeof google.maps === 'undefined') {
      console.error('Geolocation - GoogleMaps could not be initialized.'); // eslint-disable-line no-console .
      return;
    }

    $.each(Drupal.geolocation.google.loadedCallbacks, function (index, callback) {
      callback();
    });
    Drupal.geolocation.google.loadedCallbacks = [];
  };

})(jQuery, Drupal);
;
