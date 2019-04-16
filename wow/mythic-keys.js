// Initialize Cloud Firestore through Firebase
firebase.initializeApp({
  apiKey: atob('QUl6YVN5QzdMbzN0WGZpQzl5ckNoNUZ3ZlZCNHBzUjlIMlBQT3Zj'),
  authDomain: '/',
  projectId: 'tragicmuffin-cloudapps'
});
var db = firebase.firestore();

$(function() {  // Document Ready event

    $('#nav-tabs').on("click", function(event)
        {
            // Handle tab switching
            switch ( $(event.target).attr('id') ) {
                case "nav-keylist":
                    $('#nav-content-keyform').hide()
                    $('#nav-content-keylist').show()
                    //$('#nav-content-schedule').hide()
                    generateKeyListTable();
                    break;
                case "nav-keyform":
                    $('#nav-content-keyform').show()
                    $('#nav-content-keylist').hide()
                    //$('#nav-content-schedule').hide()
                    break;
                //case "nav-schedule":
                    //$('#nav-content-keyform').hide()
                    //$('#nav-content-keylist').hide()
                    //$('#nav-content-schedule').show()
                    //break;
                default:
                    console.log("Unknown tab ID: '" + $(event.target).attr('id') + "'");
                    break;
            }

        }
    )

    //// Key Level number selection ////
    $('#keyLevel').spinner({ min: 1, max: 25, step: 1 });  // create jQuery UI spinner
    $('#keyLevel').keydown(function(event)
    {
        safe_cmds = ["Backspace", "Delete", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowUp", "Down", "Left", "Right", "Up", "Home", "End"]
        if ($.isNumeric(event.key) || safe_cmds.includes(event.key)) {
            // Allow keypress
            return true;
        }
        else {
            // Ignore keypress
            event.preventDefault();  // remove default keydown behavior (i.e. entering characters)
            return false;
        }
    });
    $('#keyLevel').change(function()
    {
        // If value falls outside of allowed range after a key is entered, snap it back into range
        var newValue = $(this).val();
        if (newValue < 1)
            $(this).val("1");
        else if (newValue > 25)
            $(this).val("25");
    });


    //// Submit button validation ////
    $('.required').on("keyup", function()
        {
            // Update this field's 'empty' state
            if ($(this).val().trim() == "")
                $(this).addClass("empty");
            else
                $(this).removeClass("empty");

            // Check if any '.required' field is empty
            var empty_reqfields = $('.required').hasClass("empty");

            // Enable submit button if all fields are valid
            if (empty_reqfields)
                $('#submit-key').removeClass("btn-success").addClass("btn-outline-danger disabled").prop('disabled', true);
            else
                $('#submit-key').removeClass("btn-outline-danger disabled").addClass("btn-success").prop('disabled', false);
        }
    )


    //// Form submit ////
    $('#submit-key').on("click", function(event)
        {
            if ( !$('#submit-key').hasClass("disabled") ) {
                // Read all fields, send to database, reset all fields, and show success modal/message

                //// Firebase DB write
                var document = {
                    discordname: escapeHtml($('#discordName').val()),
                    dungeonname: escapeHtml($('#keyDungeon').val()),
                    keylevel: escapeHtml($('#keyLevel').val()),
                    datetimeadded: firebase.firestore.Timestamp.fromDate(new Date()),
                    availability: escapeHtml($('#availability').val()),
                    clientID: getOrGenerateClientID(),
                };

                db.collection("TMA-Mythic-Keys").add(document)
                .then(function(docRef) {  // on success
                    console.log("Document successfully written with ID: ", docRef.id);

                    // Reset all form fields
                    $('#keyform').trigger("reset");
                    $('#submit-key').removeClass("btn-success").addClass("btn-outline-danger disabled").prop('disabled', true);

                    // Show submission alert message
                    $('#keyform').append('<div class="alert alert-success alert-dismissible fade show" role="alert">Key submitted successfully!<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>')

                })
                .catch(function(error) {  // on failure
                    console.error("Error adding document: ", error);

                    // Show failure alert message
                    $('#keyform').append('<div class="alert alert-danger alert-dismissible fade show" role="alert">There was an issue submitting your key. Please report this message to Tenxian.<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>')
                });

            }
        }
    )

});  // End of Document Ready event


function generateKeyListTable() {

    var tableRows = '';

    db.collection("TMA-Mythic-Keys").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {

            if (loadOption_showMyKeys() == false && doc.data()['clientID'] == getClientID()) {
                // If 'Show My Keys' box is unchecked and this row matches the user's client ID:

                // Save the unixtime in a hidden element for use by the clearExpiredKeys function, as long as the data doesn't already exist.
                unixtime = doc.data()['datetimeadded'].seconds.toString();  // get unix time of row (in seconds)
                if (!getTimestampArray(hiddenOnly=true).includes(unixtime)) {
                    $('#extra-unixtime-data').append("<div unixtime='" + unixtime + "'></div>");
                }

                return;  // Finally, skip adding this row to the table.
            }

            var fields = ['discordname', 'dungeonname', 'keylevel', 'availability', 'datetimeadded'];

            // Generate HTML for table row
            var tableRow = '<tr>';

            // Check client ID in DB against client's cookie to see whether we should add a "Delete" button to this row.
            var tableRow_deleteButton = '';
            if (doc.data()['clientID'] == getClientID()) {
                tableRow_deleteButton = '<button type="button" onclick="deleteKeyEntry(\'' + doc.id + '\');" id="key-delete-button" class="btn btn-danger btn-sm" data-toggle="modal" data-target="#modal-keydeletion">&times;</button>';
            }

            for (i = 0; i < fields.length; i++) {
                if (fields[i] == 'datetimeadded') {
                    // Return formatted date
                    var unformattedDate = new Date(doc.data()[fields[i]].seconds * 1000);  // UNIX timestamp (in ms)

                    var options = { weekday: 'short', month: 'short', day: 'numeric' };
                    formattedDate = unformattedDate.toLocaleDateString("en-US", options);

                    tableRow += '<td scope="col" unixtime="' + doc.data()[fields[i]].seconds + '">' + formattedDate + tableRow_deleteButton + '</td>';
                }

                else if (fields[i] == 'availability') {

                    var avail_tooltip = escapeHtml( doc.data()[fields[i]] );  // get availability input from DB
                    avail_tooltip = avail_tooltip.replace("\n", "<br />");  // turn newlines from input into html breaks

                    if (avail_tooltip != "") {  // only show availability icon if input was provided
                        tableRow += '<td scope="col" class="keylist-availability-item">'
                            + '<span style="cursor:pointer; font-size:1.5rem; line-height: 1rem;" data-toggle="tooltip" data-placement="right" data-html="true" title="' + avail_tooltip + '">&#x1F551;</span>'
                            + '</td>';
                    }
                    else {
                        tableRow += '<td scope="col" class="keylist-availability-item"></td>';
                    }
                }

                else {
                    tableRow += '<td scope="col">' + escapeHtml( doc.data()[fields[i]] ).slice(0, 40) + '</td>';
                }
            }

            tableRow += '</tr>';

            tableRows += tableRow;
        });  // end of 'forEach'

        // Set checkbox to correct state on init.


        var table = `
        <table id="keylist-table" class="table table-bordered">
            <thead id="keylist-thead">
                <tr>
                    <th scope="col" class="keylist-col" id="keylist-col-discordname" onclick="sortTable(0, 'str')">Discord Name</th>
                    <th scope="col" class="keylist-col" id="keylist-col-dungeonname" onclick="sortTable(1, 'str')">Dungeon</th>
                    <th scope="col" class="keylist-col" id="keylist-col-keylevel" onclick="sortTable(2, 'int')">Level</th>
                    <th scope="col" id="keylist-col-availability">Availability</th>
                    <th scope="col" class="keylist-col" id="keylist-col-datetimeadded" onclick="sortTable(4, 'date')">Date Added</th>
                </tr>
            </thead>
            <tbody>
            ` + tableRows + `
            </tbody>
        </table>
        `;

        $("#keylist-table-div").html(table);

    });  // end of 'then'

    setTimeout(function() {
        $(function () { $('[data-toggle="tooltip"]').tooltip() })  // Initialize all tooltips
        sortTable(4, 'date');
    }, 500);

}


function escapeHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
}

function deleteKeyEntry(docID) {
    // When the delete button is pressed on a table row, a confirmation modal is shown.
    // Add a function callback to the modal's 'Yes' buttton that will take the received docID and delete the DB document when clicked.
    $('#modal-keydeletion-confirm').click( function() {
        db.collection("TMA-Mythic-Keys").doc(docID).delete();
        generateKeyListTable();
    });
}

function getOrGenerateClientID() {
    cookie_name = 'mythicKeyClientID';

    // First, check client's cookies to see if they already have a stored ID.
    clientID = getCookie(cookie_name);

    if (clientID == "") {
        // If client has no stored ID, generate a new one and save cookie.
        cookie_lifetime = 60*60*24*60;  // set cookie to live for 60 days

        // Generate a random 8-character ID string
        var cookie_ID = [];
        for (var i = 0; i < 8; i++)
            cookie_ID.push( alphanumerics[Math.floor(Math.random()*alphanumerics.length)] );
        cookie_ID = cookie_ID.join("");

        setCookie(cookie_name, cookie_ID, cookie_lifetime);

        return cookie_ID;  // return the new ID so it can also be stored in the DB
    }

    // If client does have a stored ID, just return it so the new DB document can use the same ID
    else {
        return clientID;
    }

}

function getClientID() {
    cookie_name = 'mythicKeyClientID';
    return getCookie(cookie_name);
}

function changeOption_showOwnKeys(state) {
    // Save new state in cookies
    saveOptions(state);

    // Redraw table (this function will get new cookie value, skipping rows if box was unchecked)
    generateKeyListTable();
}

function saveOptions(state_showMyKeys) {
    // Currently only saving one bit for show/hide keys toggle.
    cookie_name = 'mythicKeyListOptions';
    cookie_lifetime = 60*60*24*365;  // set cookie to live for 1 year
    cookie_flags = state_showMyKeys + 0;  // turns bool flag into 0/1

    return setCookie(cookie_name, cookie_flags, cookie_lifetime);
}

function loadOption_showMyKeys() {
    // Read options cookies when page is loaded and set interface accordingly.
    cookie_name = 'mythicKeyListOptions';
    options = getCookie(cookie_name);  // Currently only loading one bit for show/hide keys toggle.

    if (options != "") {
        showMyKeys = parseInt(options) && true;  // turns 0/1 into bool flag

        return showMyKeys;
    }
    else {
        return 'None';
    }
}

function getTimestampArray(hiddenOnly=false) {
    // Returns a list of unix timestamps (in seconds) for all entries in the key DB (which are stored in 'unixtime' attributes in the page html).
    var unixtimes = [];
    if (hiddenOnly) {
        // Only return unixtime values that appear in the hidden 'extra-unixtime-data' div.
        $('[unixtime]').filter('#extra-unixtime-data > div').each( function() {  // this filter selects only divs that are children of the 'extra-unixtime-data' div.
            unixtimes.push($(this).attr('unixtime'))
        });
    }
    else {
        // Return all unixtime values (default).
        $('[unixtime]').each( function() {
            unixtimes.push($(this).attr('unixtime'))
        });
        // Filter out duplicates before returning (data stored in hidden divs will be redundant when all keys are being shown)
        var unixtimesUnique = [];
        $.each(unixtimes, function(i, el) {
            if($.inArray(el, unixtimesUnique) === -1) unixtimesUnique.push(el);
        });
        unixtimes = unixtimesUnique;
    }
    return unixtimes;
}

function clearExpiredKeys() {
    // This function will clear expired key entries from the database the first time a user loads the database after the expiry date.
    // (This runs once, 10 seconds after initial page load.)

    // Mythic keys on Proudmoore expire on Tuesday at 8am PST (UTC -7).
    // Tuesday @ 8:00 PST == Tuesday @ 15:00 UTC
    expiryDayUTC = 2;  // Day number for Tuesday
    expiryHourUTC = 15;

    // Calculate the current unix time cutoff. Any keys with unix timestamps less than the cutoff will be considered expired.
    var currentUnix = new Date();
    var cutoff = new Date();

    dayNum = currentUnix.getUTCDay();  // get current day-of-week number (Sun-Sat: 0-6)
    if (dayNum == expiryDayUTC && currentUnix.getUTCHours() < expiryHourUTC) {
        // If today is Tuesday, but it's before 8am PST, the cutoff day will still be one week ago.
        cutoff.setUTCDate(currentUnix.getUTCDate() - 7);  // get date of last week's Tuesday (since it's too early for today to be the cutoff)
    }
    else {
        // If it's any other day than Tuesday, use the most recent Tuesday. If it's Tuesday and after 8am PST, use today.
        cutoff.setUTCDate(currentUnix.getUTCDate() - (dayNum-expiryDayUTC)%7);  // get date of most recent Tuesday
    }

    // Set the cutoff time to 8am PST (15:00 UTC)
    cutoff = new Date(cutoff).setUTCHours(expiryHourUTC, 0, 0, 0);
    cutoff = Math.floor(cutoff/1000);
    // 'cutoff' now holds the unix time (in seconds) of the last key expiration date.


    // Check if any DB entry has a unixtime less than the cutoff time.
    expiredKeys = false;
    keyTimestamps = getTimestampArray();
    for (var i = 0; i < keyTimestamps.length; i++) {
        // Loop through the array of timestamps to determine only whether any keys are expired.
        if (parseInt(keyTimestamps[i]) < cutoff) {
            // If we find any expired keys, stop this loop and move on to DB deletion procedure.
            expiredKeys = true;
            break;
        }
    }

    // If any expired keys were found in the previous loop, we'll now do a full read of the DB and delete all expired keys.
    if (expiredKeys) {

        // Read DB and collect IDs of any expired keys
        var expiredIDs = [];
        db.collection("TMA-Mythic-Keys").get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                var keyUnixtime = doc.data()['datetimeadded'].seconds;
                if (keyUnixtime < cutoff)
                    expiredIDs.push(doc.id);
            });

            // For each expired key, delete it from the DB using its ID
            for (var i = 0; i < expiredIDs.length; i++) {
                db.collection("TMA-Mythic-Keys").doc(expiredIDs[i]).delete();
            }

            // Finally, redraw the table for the user
            generateKeyListTable();

        });  // end of get().then

    }

}

////////////////////
// Cookie Helpers //
function setCookie(cname, cvalue, cexp) {
    var d = new Date();
    d.setTime(d.getTime() + cexp*1000);
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
////////////////////
////////////////////


function sortTable(column, dataType) {
    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById("keylist-table");
    switching = true;
    //Set the sorting direction to ascending:
    dir = "asc";
    // Make a loop that will continue until no switching has been done:
    while (switching) {
        //start by saying: no switching is done:
        switching = false;
        rows = table.getElementsByTagName("tr");
        // Loop through all table rows (except the first, which contains table headers):
        for (i = 1; i < (rows.length - 1); i++) {
            //start by saying there should be no switching:
            shouldSwitch = false;
            // Get the two elements you want to compare, one from current row and one from the next:
            x = rows[i].getElementsByTagName("td")[column];
            y = rows[i + 1].getElementsByTagName("td")[column];

            // Check if the two rows should switch place, based on the direction, asc or desc:
            if (dir == "asc") {
                // Sort case: Strings
                if (dataType == 'str') {
                    if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                        //if so, mark as a switch and break the loop:
                        shouldSwitch = true;
                        break;
                    }
                }
                else if (dataType == 'int') {
                    if (parseInt(x.innerHTML) > parseInt(y.innerHTML)) {
                        //if so, mark as a switch and break the loop:
                        shouldSwitch = true;
                        break;
                    }
                }
                else if (dataType == 'date') {
                    if (parseInt(x.getAttribute('unixtime')) > parseInt(y.getAttribute('unixtime'))) {
                        //if so, mark as a switch and break the loop:
                        shouldSwitch = true;
                        break;
                    }
                }
            }
            else if (dir == "desc") {
                if (dataType == 'str') {
                    if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                        //if so, mark as a switch and break the loop:
                        shouldSwitch = true;
                        break;
                    }
                }
                else if (dataType == 'int') {
                    if (parseInt(x.innerHTML) < parseInt(y.innerHTML)) {
                        //if so, mark as a switch and break the loop:
                        shouldSwitch = true;
                        break;
                    }
                }
                else if (dataType == 'date') {
                    if (parseInt(x.getAttribute('unixtime')) < parseInt(y.getAttribute('unixtime'))) {
                        //if so, mark as a switch and break the loop:
                        shouldSwitch = true;
                        break;
                    }
                }
            }
        }
        if (shouldSwitch) {
            // If a switch has been marked, make the switch and mark that a switch has been done:
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            //Each time a switch is done, increase this count by 1:
            switchcount ++;
        } else {
            // If no switching has been done AND the direction is "asc", set the direction to "desc" and run the while loop again.
            if (switchcount == 0 && dir == "asc") {
                dir = "desc";
                switching = true;
            }
        }

    }
}

alphanumerics = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
