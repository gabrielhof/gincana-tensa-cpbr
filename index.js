var Twitter = require("twitter");

var currentApiIndex = 0;
var apiKeys = [
	{
		consumer_key: "cWUDFIZa4OPfIi4qHNQYnxGiC",
		consumer_secret: "ShIXhpQCvmF1ethQ5BiHRSyrjtkf6XrRVGp51K1AqoGv1yO0KY",
		access_token_key: "129619411-SdxW8D7WfcjZDbDcQMRcQyvFRp11GlQFTnkiC8nT",
		access_token_secret: "WK6OZB99FYoUuQdDipMLWqtJBAQYB9pJCN7PBJlpAnfz5"
	},
	{
		consumer_key: "7cEm5fyC1Ga12KCbJuICJ2Rsr",
		consumer_secret: "XShHzfzPrpYM0hasp6FAeHiImBPNV8Dc5RWK2sKjiQ0PRzjdsZ",
		access_token_key: "129619411-SeYVnFQp76KKw1KkjHjxnHuKBZCQmSO7yu4fI1y6",
		access_token_secret: "bKejTuRSRIRAPRp5cWtIS7oyWX5CE9s0reRkfMM6VXdrX"
	},
	{
		consumer_key: "9xwk3lBowaPTAb0ObH9qARKHS",
		consumer_secret: "yoWjfqKnIjkEDxz9lYJW9tp4zEEHZF6mFYzTCaaojYBohFbMg8",
		access_token_key: "129619411-9cbXB8GCHUOiuyZJfgpsEpjeOJo5mi7x0i1D8xZB",
		access_token_secret: "AGrARrwqc0CUe7iWenCsiEClH157TYla0DzXtps1IGpbw"
	},
	{
		consumer_key: "9xwk3lBowaPTAb0ObH9qARKHS",
		consumer_secret: "yoWjfqKnIjkEDxz9lYJW9tp4zEEHZF6mFYzTCaaojYBohFbMg8",
		access_token_key: "129619411-9cbXB8GCHUOiuyZJfgpsEpjeOJo5mi7x0i1D8xZB",
		access_token_secret: "AGrARrwqc0CUe7iWenCsiEClH157TYla0DzXtps1IGpbw"
	}
];

var twitterClient = null;

var apiCalls = {
	usersShow: 0,
	friendsIds: 0
};

var listOfParticipants = [
	"mlcastanheira",
	"Nina_choi",
	"DarcHoly",
	"guiiiseiti",
	"digosf",
	"jascovski",
	"Nohander_",
	"mlcastanheira",
	"arthurpenido",
	"G_Mocellin",
	"laurinhapqna",
	"adailn",
	"sondanieru",
	"laurinhapqna",
	"Deby_chan",
	"Eduardo_Scrt",
	"aldirjr",
	"sousandrei",
	"nick_barreto",
	"welbert_bone",
	"_llucasn",
	"_FerreiraJP",
	"canguru_alado",
	"MissTornill",
	"laurinhapqna",
	"RidrigoPanda",
	"TayroneMarques",
	"julia_sramos",
	"yoo_catalano",
	"joaovitorduarte",
	"SabrinaFavarin",
	"luceliamoradei",
	"nilohumano ",
	"Caiobroth",
	"sr_Wolf",
	"VALMIR2008",
	"GutoFalc20",
	"Edu_joliper",
	"owyeajaeh",
	"JundiaiFlavio",
	"fernando_tetu"
];

var participantsFlags = {};

var listOfUsersWhoShouldBeFollowed = [
	"EquipeTenso",
	"SeagateBrasil",
	"3Coracoes",
	"OutbackBrasil",
	"Br_PayPalDev",
	"Sebrae",
	"dwninfo",
	"Tech_School",
	"RedZeroSchool",
	"Submarino",
	"Fisl_Oficial",
	"SoftwareLivre",
	"BrPrint3D ",
	"ProgramaAWC",
	"GlocalArtsBR",
	"SemComp",
	"NovaTecEditora",
	"ComuNICBR",
	"UniversoHarley",
	"SyFyBR",
	"MiBrasil",
	"nutrieducapp",
	"HeyAppBrasil ",
	"nuuvem",
	"jorgemaia",
	"Crazytechguys ",
	"Crazytechlabs",
	"Iotweekend",
	"MadPixelStudios"
];

var usersWhoShouldBeFollowedData = {};

function getUserWhoShouldBeFollowedData(userIndex, finishCallback) {
	var targetUser = listOfUsersWhoShouldBeFollowed[userIndex];

	if (!targetUser) {
		finishCallback(usersWhoShouldBeFollowedData);
		return;
	}

	if (!twitterClient || apiCalls.usersShow > 180) {
		twitterClient = getNewTwitterConnection();
	}

	apiCalls.usersShow++;

	twitterClient.get("users/show", {
		screen_name: targetUser.trim(),
	}, function(error, response) {
		if (error) {
			console.log("Deu ruim ao consultar os dados (ID) de @" + targetUser);
			console.log(error);
			return;
		}

		usersWhoShouldBeFollowedData[targetUser] = response;
	});

	getUserWhoShouldBeFollowedData(userIndex+1, finishCallback);
};

function checkParticipant(participantIndex) {
	var sourceUser = listOfParticipants[participantIndex];
	var sourceUserData = null;

	if (!sourceUser){
		return;
	}

	if (!participantsFlags[sourceUser]) {
		sourceUserData = {
			username: sourceUser,
			started: false,
		};

		participantsFlags[sourceUser] = sourceUserData;
	} else {
		sourceUserData = participantsFlags[sourceUser];
	}

	if (!sourceUserData.started) {
		console.log("\n\n@" + sourceUser);
	}

	checkIfuserFollowsEveryone(sourceUserData, function() {
		checkParticipant(participantIndex+1);
	});
}

function checkIfuserFollowsEveryone(participantData, finishCallback) {
	var sourceUser = participantData.username;

	console.log(apiCalls.friendsIds);

	if (!twitterClient || apiCalls.friendsIds >= 15) {
		twitterClient = getNewTwitterConnection();
	}

	apiCalls.friendsIds++;

	twitterClient.get("friends/ids", {
		screen_name: sourceUser.trim()
	}, function(error, response) {
		if (error) {
			console.log("Deu ruim ao consultar se o participante @" + sourceUser + " todo mundo.");
			console.log(error);
			return;
		}

		var followingEveryone = true;

		for (sponsorIndex in usersWhoShouldBeFollowedData) {
			var sponsor = usersWhoShouldBeFollowedData[sponsorIndex];

			if (response.ids.indexOf(sponsor.id) < 0) {
				followingEveryone = false;
				console.log("O participante @" + sourceUser + " não segue @" + sponsor.screen_name);
			}
		}
	
		if (followingEveryone) {
			console.log("O participante @" + sourceUser + " segue todo mundo");
		}

		finishCallback();
	});
}

function getNewTwitterConnection() {
	currentApiIndex++;

	var currentApi = apiKeys[currentApiIndex];

	return new Twitter({
		consumer_key: currentApi.consumer_key,
		consumer_secret: currentApi.consumer_secret,
		access_token_key: currentApi.access_token_key,
		access_token_secret: currentApi.access_token_secret
	});
}

getUserWhoShouldBeFollowedData(0, function() {
	checkParticipant(0);
});