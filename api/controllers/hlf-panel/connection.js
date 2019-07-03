/*
# Copyright 2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License").
# You may not use this file except in compliance with the License.
# A copy of the License is located at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# or in the "license" file accompanying this file. This file is distributed
# on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
# express or implied. See the License for the specific language governing
# permissions and limitations under the License.
#
*/

'use strict';
var util = require('util');
var hfc = require('fabric-client');
hfc.setLogger(console);

async function getClientForOrg(userorg, username) {
	console.log('============ START getClientForOrg for org %s and user %s', userorg, username);
	let config = '../../controllers/hlf-panel/connection-org1.json';
	// let orgLower = userorg.toLowerCase();
	let clientConfig = '../../controllers/hlf-panel/connection-org1.json';

	console.log('##### getClient - Loading connection profiles from file: %s and %s', config, clientConfig);

	// Load the connection profiles. First load the network settings, then load the client specific settings
	let client = hfc.loadFromConfig(config);
	client.loadFromConfig(clientConfig);

	// Create the state store and the crypto store
	await client.initCredentialStores();

	// Try and obtain the user from persistence if the user has previously been
	// registered and enrolled
	if (username) {
		let user = await client.getUserContext(username, true);
		if (!user) {
			throw new Error(util.format('##### getClient - User was not found :', username));
		} else {
			console.log('##### getClient - User %s was found to be registered and enrolled', username);
		}
	}
	console.log('============ END getClientForOrg for org %s and user %s \n\n', userorg, username);

	return client;
}

var getRegisteredUser = async function (username, userorg, isJson) {
	try {
		console.log('============ START getRegisteredUser - for org %s and user %s', userorg, username);
		var client = await getClientForOrg(userorg);
		var user = await client.getUserContext(username, true);
		if (user && user.isEnrolled()) {
			console.log('##### getRegisteredUser - User %s already enrolled', username);
		} else {
			// user was not enrolled, so we will need an admin user object to register
			console.log('##### getRegisteredUser - User %s was not enrolled, so we will need an admin user object to register', username);
			console.log('##### getRegisteredUser - Got hfc %s', util.inspect(hfc));
			var admins = hfc.getConfigSetting('admins');
			console.log('##### getRegisteredUser - Got admin property %s', util.inspect(admins));
			let adminUserObj = await client.setUserContext({ username: admins[0].username, password: admins[0].secret });
			console.log('##### getRegisteredUser - Got adminUserObj property %s', util.inspect(admins));
			let caClient = client.getCertificateAuthority();
			console.log('##### getRegisteredUser - Got caClient %s', util.inspect(admins));
			let secret = await caClient.register({
				enrollmentID: username
			}, adminUserObj);
			console.log('##### getRegisteredUser - Successfully got the secret for user %s', username);
			user = await client.setUserContext({ username: username, password: secret });
			console.log('##### getRegisteredUser - Successfully enrolled username %s  and setUserContext on the client object', username);
		}
		if (user && user.isEnrolled) {
			if (isJson && isJson === true) {
				var response = {
					success: true,
					secret: user._enrollmentSecret,
					message: username + 'enrolled Successfully',
				};
				return response;
			}
		}
		else {
			throw new Error('##### getRegisteredUser - User was not enrolled ');
		}
	}
	catch (error) {
		console.error('##### getRegisteredUser - Failed to get registered user: %s with error: %s', username, error.toString());
		return 'failed ' + error.toString();
	}
};

var checkInChannels = (passedChannel, channels) => {
	for (let channel of channels) {
		if (channel.id == passedChannel) {
			return passedChannel;
		}
	}
	return
}


exports.getClientForOrg = getClientForOrg;
exports.getRegisteredUser = getRegisteredUser;
exports.checkInChannels = checkInChannels;
