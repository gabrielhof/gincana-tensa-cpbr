var Twitter = require("twitter");

var twitterClient = new Twitter({
	consumer_key: "cWUDFIZa4OPfIi4qHNQYnxGiC",
	consumer_secret: "ShIXhpQCvmF1ethQ5BiHRSyrjtkf6XrRVGp51K1AqoGv1yO0KY",
	access_token_key: "129619411-SdxW8D7WfcjZDbDcQMRcQyvFRp11GlQFTnkiC8nT",
	access_token_secret: "WK6OZB99FYoUuQdDipMLWqtJBAQYB9pJCN7PBJlpAnfz5"
});

var sourceUser = process.argv[2];

if (!sourceUser) {
	console.log("Por favor, informe o twitter de um participante.");
	return;
}

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

var followingEveryone = true;

function checkIfuserFollows(targetUserIndex) {
	if (!listOfUsersWhoShouldBeFollowed[targetUserIndex]) {
		if (followingEveryone) {
			console.log("O participante @" + sourceUser + " segue todo mundo");	
		}

		return;
	}

	var targetUser = listOfUsersWhoShouldBeFollowed[targetUserIndex];

	twitterClient.get("friendships/show", {
		source_screen_name: sourceUser.trim(),
		target_screen_name: targetUser.trim()
	}, function(error, response) {
		if (error) {
			console.log("Deu ruim ao consultar se o participante @" + sourceUser + " segue @" + targetUser);
			console.log(error);
			return;
		}
	
		if (!response.relationship.source.following) {
			followingEveryone = false;
			console.log("O participante @" + sourceUser + " não segue @" + targetUser);
		}

		checkIfuserFollows(targetUserIndex+1);
	});
}

checkIfuserFollows(0);


