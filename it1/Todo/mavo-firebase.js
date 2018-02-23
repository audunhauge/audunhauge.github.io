'use strict';

(function () {
  var $ = window.Bliss;
  var Mavo = window.Mavo;
  var firebase = window.firebase;

  Mavo.Backend.register($.Class({
    extends: Mavo.Backend,
    id: 'Firebase',
    constructor: function constructor(databaseUrl) {
      var _this = this;

      var id = this.mavo.id || 'mavo';
      var config = {};

      var initUsingAttributes = /^https:\/\/.*\.firebaseio\.com$/.test(databaseUrl);

      // Init Firebase using attributes
      if (initUsingAttributes) {
        config = {
          apiKey: this.mavo.element.getAttribute('mv-firebase-api-key'),
          authDomain: this.mavo.element.getAttribute('mv-firebase-auth-domain'),
          databaseURL: databaseUrl,
          storageBucket: this.mavo.element.getAttribute('mv-firebase-storage-bucket')
        };

        if (!config.apiKey) {
          return this.mavo.error('Firebase: mv-firebase-api-key attribute missing');
        }

        // Support using multiple apps on the same page
        if (!firebase.apps.length) {
          this.app = firebase.initializeApp(config);
        } else {
          this.app = firebase.initializeApp(config, 'app' + firebase.apps.length);
        }
      } else {
        // Init firebase using script
        config = firebase.default.app().options;

        if (!config.apiKey) {
          return this.mavo.error('Firebase: apiKey missing from config');
        }

        this.app = firebase.default;
      }

      this.statusChangesCallbacks = [];

      // PERMISSIONS
      var unauthenticatedPermissionsAttr = this.mavo.element.getAttribute('mv-unauthenticated-permissions');
      var authenticatedPermissionsAttr = this.mavo.element.getAttribute('mv-authenticated-permissions');

      var authenticatedPermissions = getPermissions(authenticatedPermissionsAttr) || ['read', 'edit', 'add', 'delete', 'save', 'logout'];

      // Use default permissions if unauthenticated-permissions isn't specified,
      // attribute 'firebase-auth-domain' has to be set if permission 'login' is used
      var unauthenticatedPermissions = getPermissions(unauthenticatedPermissionsAttr);
      if (unauthenticatedPermissions) {
        if (!config.authDomain && unauthenticatedPermissions.includes('login')) {
          if (initUsingAttributes) {
            return this.mavo.error('Firebase: authDomain missing from config (needed if permission \'login\' is specified)');
          } else {
            return this.mavo.error('Firebase: firebase-auth-domain attribute missing (needed if permission \'login\' is specified)');
          }
        }
      } else {
        if (config.authDomain) {
          unauthenticatedPermissions = ['read', 'login'];
        } else {
          unauthenticatedPermissions = ['read'];
        }
      }

      this.defaultPermissions = {
        authenticated: authenticatedPermissions,
        unauthenticated: unauthenticatedPermissions
      };

      this.permissions.on(this.defaultPermissions.unauthenticated);

      this.db = this.app.database().ref(id);

      // STORAGE

      // Only allow file uploading if storageBucket is defined
      if (config.storageBucket) {
        this.storage = this.app.storage().ref(id);

        this.upload = function (file) {
          var ref = this.storage.child(file.name + '-' + Date.now());

          return ref.put(file).then(function () {
            return ref.getDownloadURL();
          });
        };
      }

      // Firebase auth changes
      this.app.auth().onAuthStateChanged(function (user) {
        if (!user) {
          return;
        }

        _this.permissions.off(_this.defaultPermissions.unauthenticated).on(_this.defaultPermissions.authenticated);
        _this.user = {
          username: user.email,
          name: user.displayName,
          avatar: user.photoURL
        };
      }, function (error) {
        _this.mavo.error('Firebase: ' + error.message);
      });

      // Enable pushing data from server
      var serverPushAttr = this.mavo.element.getAttribute('mv-server-push');
      if (serverPushAttr !== null && serverPushAttr !== 'false') {
        this.setListenForChanges(true);
      }

      // HELPER FUNCTIONS

      function getPermissions(attr) {
        if (attr) {
          return attr.split(/\s+/);
        } else if (attr === '') {
          return [];
        }
      }
    },

    onStatusChange: function onStatusChange(callback) {
      var _this2 = this;

      this.statusChangesCallbacks.push(callback);

      if (this.listeningOnStatus) {
        return;
      }
      this.listeningOnStatus = true;

      this.app.database().ref('.info/connected').on('value', function (snap) {
        _this2.statusChangesCallbacks.forEach(function (callback) {
          return callback(snap.val());
        });
      });
    },

    setListenForChanges: function setListenForChanges(bool) {
      var _this3 = this;

      if (bool) {
        if (!this.listeningForChanges) {
          this.db.on('value', function (snapshot) {
            var doc = snapshot.val();

            // Ignore if data is old
            if (_this3.compareDocRevs({
              _rev: _this3.rev
            }, doc) !== 1) {
              return;
            }

            _this3.rev = doc._rev;

            _this3.onNewData(doc);
          });
        }
      } else {
        this.db.off();
      }

      this.listeningForChanges = bool;
    },

    onNewData: function onNewData(data) {
      return this.mavo.render(data);
    },

    load: function load() {
      var _this4 = this;

      return this.db.once('value').then(function (snapshot) {
        var data = snapshot.val();

        if (!data) {
          _this4.rev = 1;
          return {};
        }

        _this4.rev = data._rev || 1;
        return data;
      });
    },

    store: function store(data) {
      var _this5 = this;

      // Needed to make this.mavo.unsavedChanges work correctly
      return Promise.resolve().then(function () {
        _this5.storeData = data;

        // this.mavo.unsavedChanges needed because of https://github.com/mavoweb/mavo/issues/256
        if (!_this5.mavo.unsavedChanges || _this5.storing) {
          return;
        }

        _this5.storing = true;

        return _this5.put().then(function () {
          _this5.storing = false;
        });
      });
    },

    put: function put(data) {
      var _this6 = this;

      data = this.storeData || data;
      delete this.storeData;

      // Overrides server with local data
      return this.db.transaction(function (currentData) {
        if (currentData) {
          _this6.rev = Number.isInteger(currentData._rev) ? currentData._rev + 1 : 1;
        } else {
          _this6.rev = 1;
        }

        return Object.assign(data, {
          _rev: _this6.rev
        });
      }).then(function () {
        if (_this6.storeData) {
          return _this6.put();
        }
      });
    },

    login: function login() {
      var _this7 = this;

      return this.ready.then(function () {
        if (_this7.user) {
          return;
        }

        var provider = new firebase.auth.GoogleAuthProvider();

        return _this7.app.auth().signInWithPopup(provider).catch(function (error) {
          _this7.mavo.error('Firebase: ' + error.message);
          return Promise.reject(error);
        });
      });
    },

    logout: function logout() {
      var _this8 = this;

      return this.app.auth().signOut().then(function () {
        // Sign-out successful.
        _this8.permissions.off(_this8.defaultPermissions.authenticated).on(_this8.defaultPermissions.unauthenticated);
      }).catch(function (error) {
        _this8.mavo.error('Firebase: ' + error.message);
      });
    },

    compareDocRevs: function compareDocRevs(docA, docB) {
      // If b is newer return 1

      if (!docA || !Number.isInteger(docA._rev)) {
        return 1;
      }

      if (!docB || !Number.isInteger(docB._rev)) {
        return -1;
      }

      if (docA._rev === docB._rev) {
        return 0;
      }

      return docA._rev < docB._rev ? 1 : -1;
    },

    static: {
      test: function test(url) {
        return (/^(firebase|https:\/\/.*\.firebaseio\.com)$/.test(url)
        );
      }
    }
  }));
})();

//# sourceMappingURL=mavo-firebase.js.map
