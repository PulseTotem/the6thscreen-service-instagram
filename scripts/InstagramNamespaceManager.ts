/**
 * @author Simon Urli <simon@the6thscreen.fr>
 */

/// <reference path="../t6s-core/core-backend/libsdef/node-uuid.d.ts" />

/// <reference path="../t6s-core/core-backend/scripts/Logger.ts" />

/// <reference path="../t6s-core/core-backend/scripts/server/SourceNamespaceManager.ts" />

/// <reference path="../t6s-core/core-backend/t6s-core/core/scripts/infotype/PictureAlbum.ts" />
/// <reference path="../t6s-core/core-backend/t6s-core/core/scripts/infotype/Picture.ts" />
/// <reference path="../t6s-core/core-backend/t6s-core/core/scripts/infotype/PictureURL.ts" />

var datejs : any = require('datejs');

var DateJS : any = <any>Date;
var uuid : any = require('node-uuid');

var util = require('util');

class InstagramNamespaceManager extends SourceNamespaceManager {

	/**
	 * Constructor.
	 *
	 * @constructor
	 * @param {any} socket - The socket.
	 */
	constructor(socket : any) {
		super(socket);
		this.addListenerToSocket('TaggedPictures', this.retrieveTaggedPictures);
	}

	retrieveTaggedPictures(params : any, self : InstagramNamespaceManager = null) {
		if (self == null) {
			self = this;
		}

		Logger.debug("TaggedPictures Action with params :");
		Logger.debug(params);

		var fail = function(error) {
			if(error) {
				Logger.error(error);
			}
		};

		var success = function(oauthActions) {
			var successSearch = function (information) {
				console.log("Obtained informations : ");
				console.log(JSON.stringify(information));

				var pictureAlbum : PictureAlbum = new PictureAlbum();
				var listPhotos = information.data;

				pictureAlbum.setId(uuid.v1());
				pictureAlbum.setPriority(0);

				for (var i = 0; i < listPhotos.length; i++) {
					var photo = listPhotos[i];

					if (photo.type == "image") {
						var pic : Picture = new Picture(photo.id, 0, new Date(photo.created_time), null, 10000);
						//pic.setDescription(photo.description._content);
						pic.setTitle(photo.caption.text);

						var images = photo.images;

						var low_reso = new PictureURL(photo.id+"_lowresolution");
						low_reso.setURL(images.low_resolution.url);
						low_reso.setHeight(images.low_resolution.height);
						low_reso.setWidth(images.low_resolution.width);

						var stand_reso = new PictureURL(photo.id+"_standardresolution");
						stand_reso.setURL(images.standard_resolution.url);
						stand_reso.setHeight(images.standard_resolution.height);
						stand_reso.setWidth(images.standard_resolution.width);

						var thumb = new PictureURL(photo.id+"thumbnail");
						thumb.setURL(images.thumbnail.url);
						thumb.setHeight(images.thumbnail.height);
						thumb.setWidth(images.thumbnail.width);

						pic.setMedium(stand_reso);
						pic.setOriginal(stand_reso);
						pic.setSmall(low_reso);
						pic.setThumb(thumb);

						var picUser = photo.user;

						var user : User = new User(picUser.id);
						user.setUsername(picUser.username);
						user.setRealname(picUser.full_name);
						user.setProfilPicture(picUser.profile_picture);
						pic.setOwner(user);

						pictureAlbum.addPicture(pic);
					}
				}

				Logger.debug("Send PictureAlbum to client : ");
				Logger.debug(pictureAlbum);

				self.sendNewInfoToClient(pictureAlbum);
			};


			var userPhoto = 'https://api.instagram.com/v1/tags/'+params.SearchQuery+'/media/recent?count='+params.Limit;
			oauthActions.get(userPhoto, successSearch, fail);
		};

		self.manageOAuth('instagram', params.oauthKey, success, fail);
	}
}