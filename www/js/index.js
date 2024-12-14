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

const byteData = (data) => {
    const byteCharacters = atob(data.split(',')[1]);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) byteNumbers[i] = byteCharacters.charCodeAt(i);
    return new Uint8Array(byteNumbers);
};

const ngMobileBioResElem = 'mobile-auth-res';

/**
 * Cordova App object
 */
const app = {
    fetchBiometrics: function() {
        const availableAuthMethods = (methods) => document.getElementById(ngMobileBioResElem).value = methods;
        const authMethodsError = (error) => document.getElementById(ngMobileBioResElem).value = error;
        const optionalParams = {requireStrongBiometrics: true};
        Fingerprint.isAvailable(availableAuthMethods, authMethodsError, optionalParams);
    },
    triggerBiometricsAuth: function() {
        const onAuthSuccess = function(authResponse) {
            document.getElementById(ngMobileBioResElem).value = authResponse;
            document.getElementById(ngMobileBioResElem).dispatchEvent(new CustomEvent('input'));
        };
        const onAuthFailure = function(error) {
            document.getElementById(ngMobileBioResElem).value = error.message;
            document.getElementById(ngMobileBioResElem).dispatchEvent(new CustomEvent('input'));
        };
        const options = {
            title: 'DiagnoCom',
            subtitle: 'Autoriza para continuar',
            disableBackup: true,
            confirmationRequired: true
        };
        Fingerprint.show(options, onAuthSuccess, onAuthFailure);
    },
    savePicture: function (filename, data, mimeType) {
        const androidFolder = 'file:///storage/emulated/0/Android/media/';
        const iosFolder = cordova.file.documentsDirectory;
        const location = device.platform === 'Android' ? androidFolder : iosFolder;
        window.resolveLocalFileSystemURL(location,
            systemDirectory => {
                console.log('DiagnoCom system directory: ', location);
                systemDirectory.getDirectory('ovh.serial30.diagnocom', {create: true}, directoryEntry => {
                    console.log('Created app media directory:\n', directoryEntry);
                    directoryEntry.getDirectory('DiagnoCom', {create: true}, directoryEntry => {
                        console.log('Created DiagnoCom directory:\n', directoryEntry);
                        directoryEntry.getFile(filename, {create: true}, fileEntry => {
                            fileEntry.createWriter(fileWriter => {
                                fileWriter.write(new Blob([byteData(data)], {type: mimeType}));
                                fileWriter.onwriteend = (progress) => {
                                    console.log('Successfully saved image!\n', progress);
                                    document.getElementById('saveAsPicture').value = 'Resultado guardado';
                                    document.getElementById('saveAsPicture').dispatchEvent(new CustomEvent('input'));
                                }
                                fileWriter.onerror = console.error;
                            }, console.error);
                        }, console.error);
                    }, console.error);
                }, console.error);
            }, console.error
        );
    },
    bindAppLinksEvents: function () {
        window.plugins.AppLinks.subscribe('resultLoad', function (eventData) {
            console.log('<<<ANDROID APP>>> AppLink retrieved data:\n', eventData);
            console.log('<<<ANDROID APP>>> Redirect to result with ID: ', eventData.path.split('/')[2]);
            document.getElementsByName('result-load').item(0).value = eventData.path;
            document.getElementsByName('result-load').item(0).dispatchEvent(new CustomEvent('input'));
        });
        window.plugins.AppLinks.subscribe('fileDownload', function (eventData) {
            console.log('<<<ANDROID APP>>> AppLink retrieved data:\n', eventData);
            console.log('<<<ANDROID APP>>> Try to download file from: ', eventData.url);
        });
        window.plugins.AppLinks.subscribe('appLinkLaunch', function (eventData) {
            console.log('<<<ANDROID APP>>> AppLink retrieved data:\n', eventData);
            console.log('<<<ANDROID APP>>> Launched app from url: ', eventData.url);
        });
    }
};

/* Cordova has been loaded. Perform any initialization that requires Cordova here. */
document.addEventListener('deviceready', function() {
    app.fetchBiometrics();
    app.bindAppLinksEvents();
}, false);

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
