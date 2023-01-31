// Test functions for Mythic+ Keys page

function submitTestKeyBatch(size, dbtarget="TESTING-TMA-Mythic-Keys", expiredDates=true) {

    testData = generateTestData(size, expiredDates);

    for (var i = 0; i < testData.length; i++) {

        // Firebase DB write
        var document = {
            discordname: testData[i][0],
            charactername: testData[i][1],
            characterrole: testData[i][2],
            dungeonname: testData[i][3],
            keylevel: testData[i][4],
            datetimeadded: testData[i][5],
            availability: testData[i][6],
            clientID: testData[i][7],
        };

        // dbtarget either "TESTING-TMA-Mythic-Keys" or "TMA-Mythic-Keys"
        db.collection(dbtarget).add(document)
        .then(function(docRef) {  // on success
            console.log("Document successfully written with ID: ", docRef.id);
        })
        .catch(function(error) {  // on failure
            console.error("Error adding document: ", error);
        });

    }
}

function generateTestData(size, expiredDates=true) {
    var testData = [];

    for (var i = 0; i < size; i++) {
        discord_names = ['Tenxian', 'Faedren', 'Yorutheelf', 'Koscie', 'Olta', 'Scriv'];
        char_names = ['Tenxian', 'Twicks', 'Blart', 'Nemtsova', 'Faedren', 'Scriv', 'Sints', 'Dkolta'];
        dungeon_names = ['Atal\'Dazar', 'Freehold', 'King\'s Rest', 'Shrine of the Storm', 'Siege of Boralus', 'Temple of Sethraliss', 'The MOTHERLODE!!!', 'The Underrot', 'Tol Dagor', 'Waycrest Manor'];
        avails = ['Saturdays after 2pm', 'Mon/Wed 3-10pm', 'Monday 4-10\nTuesday 5-10\nFriday 2-9', 'Weekends after noon\n Weekdays after 9pm', '', '', '', ''];

        discordname = discord_names[Math.floor(Math.random()*discord_names.length)];
        charactername = char_names[Math.floor(Math.random()*char_names.length)];
        characterrole = Math.floor(Math.random()*4);  // random role index 0-3
        dungeonname = dungeon_names[Math.floor(Math.random()*dungeon_names.length)];
        keylevel = Math.floor(Math.random()*25) + 1;
        if (expiredDates) {
            // Generate a range of times where some are likely to be expired.
            offsetHours = Math.floor(Math.random()*337);  // generate a random number of hours between 0 and 192 (8 days)
        }
        else {
            // Generate a range of (likely) unexpired times only (less than 6 hours old)
            offsetHours = Math.floor(Math.random()*7);  // generate a random number of hours between 0 and 6
        }
        datetimeadded = firebase.firestore.Timestamp.fromDate(new Date(new Date().getTime()-1000*60*60*offsetHours));  // current time minus a random number of hours
        availability = avails[Math.floor(Math.random()*avails.length)];
        clientID = 'tEsTiNg0';

        // Add the compiled data entry to the testData array
        testData.push([discordname, charactername, characterrole, dungeonname, keylevel, datetimeadded, availability, clientID]);
    }

    return testData;
}

function clearAllKeys(dbtarget="TESTING-TMA-Mythic-Keys") {
    // Be careful with this!

    // Read DB and collect IDs of all keys
    var keyIDs = [];
    db.collection(dbtarget).get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            keyIDs.push(doc.id);
        });

        // For each expired key, delete it from the DB using its ID
        for (var i = 0; i < keyIDs.length; i++) {
            db.collection(dbtarget).doc(keyIDs[i]).delete();
        }
    });  // end of get().then
}
