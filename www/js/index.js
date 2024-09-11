/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/* App object */
let app = {
    checkForAuth: function() {
        let authMethods = (methods) => document.getElementById('auth').value = methods;
        let authError = (error) => alert('Error: ' + error);
        let optionalParams = {allowBackup: true, requireStrongBiometrics: true};
        Fingerprint.isAvailable(authMethods, authError, optionalParams);
    },
    authenticate: function() {
        let onAuthSuccess = function(authResponse) {
            document.getElementById('auth').value = authResponse;
            document.getElementById('auth').dispatchEvent(new CustomEvent('input'));
        }
        let onAuthFailure = function(error) {
            document.getElementById('auth').value = error.message;
        }
        let options = {
            title: 'DiagnoCom',
            subtitle: 'Autoriza para continuar',
            disableBackup: false,
            confirmationRequired: true
        };
        Fingerprint.show(options, onAuthSuccess, onAuthFailure);
    }
}

/* Cordova has been loaded. Perform any initialization that requires Cordova here. */
document.addEventListener('deviceready', function() {
    app.checkForAuth();
}, false);

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
