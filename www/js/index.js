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
    fetchBiometrics: function() {
        const availableAuthMethods = (methods) => document.getElementById('bio-auth').value = methods;
        const authMethodsError = (error) => document.getElementById('bio-auth').value = error;
        const optionalParams = {requireStrongBiometrics: true};
        Fingerprint.isAvailable(availableAuthMethods, authMethodsError, optionalParams);
    },
    bioAuth: function() {
        const onAuthSuccess = function(authResponse) {
            document.getElementById('bio-auth').value = authResponse;
            document.getElementById('bio-auth').dispatchEvent(new CustomEvent('input'));
        }
        const onAuthFailure = function(error) {
            document.getElementById('bio-auth').value = error.message;
            document.getElementById('bio-auth').dispatchEvent(new CustomEvent('input'));
        }
        const options = {
            title: 'DiagnoCom',
            subtitle: 'Autoriza para continuar',
            disableBackup: true,
            confirmationRequired: true
        };
        Fingerprint.show(options, onAuthSuccess, onAuthFailure);
    },
    saveResultPic(fileName) {
        console.log('Feature not implemented!', '\nFile name: ', fileName);
    }
}

/* Cordova has been loaded. Perform any initialization that requires Cordova here. */
document.addEventListener('deviceready', function() {
    app.fetchBiometrics();
}, false);

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
