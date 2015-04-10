/** @author Simon Urli <simon@the6thscreen.fr>  */

/// <reference path="../t6s-core/core-backend/scripts/server/SourceServer.ts" />
/// <reference path="../t6s-core/core-backend/scripts/Logger.ts" />

/// <reference path="./InstagramNamespaceManager.ts" />

class Instagram extends SourceServer {

	/**
	 * Constructor.
	 *
	 * @param {number} listeningPort - Server's listening port..
	 * @param {Array<string>} arguments - Server's command line arguments.
	 */
	constructor(listeningPort : number, arguments : Array<string>) {
		super(listeningPort, arguments);

		this.init();
	}

	/**
	 * Method to init the Instagram server.
	 *
	 * @method init
	 */
	init() {
		var self = this;

		this.addNamespace("Instagram", InstagramNamespaceManager);
	}
}

/**
 * Server's Instagram listening port.
 *
 * @property _InstagramListeningPort
 * @type number
 * @private
 */
var _InstagramListeningPort : number = process.env.PORT || 6007;

/**
 * Server's Instagram command line arguments.
 *
 * @property _InstagramArguments
 * @type Array<string>
 * @private
 */
var _InstagramArguments : Array<string> = process.argv;

var serverInstance = new Instagram(_InstagramListeningPort, _InstagramArguments);
serverInstance.run();