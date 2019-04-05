// Initialize Cloud Firestore through Firebase
firebase.initializeApp({
  apiKey: 'AIzaSyC7Lo3tXfiC9yrCh5FwfVB4psR9H2PPOvc',
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
                    $('#nav-content-schedule').hide()
                    generateKeyListTable();
                    break;
                case "nav-keyform":
                    $('#nav-content-keyform').show()
                    $('#nav-content-keylist').hide()
                    $('#nav-content-schedule').hide()
                    break;
                case "nav-schedule":
                    $('#nav-content-keyform').hide()
                    $('#nav-content-keylist').hide()
                    $('#nav-content-schedule').show()
                    break;
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


function escapeHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
}

function generateKeyListTable() {

    var tableRows = '';

    db.collection("TMA-Mythic-Keys").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {

            var fields = ['discordname', 'dungeonname', 'keylevel', 'availability', 'datetimeadded'];

            // Generate HTML for table row
            var tableRow = '<tr>';

            for (i = 0; i < fields.length; i++) {
                if (fields[i] == 'datetimeadded') {
                    // Return formatted date
                    var unformattedDate = new Date(doc.data()[fields[i]].seconds * 1000);  // UNIX timestamp (in ms)

                    var options = { weekday: 'short', month: 'short', day: 'numeric' };
                    formattedDate = unformattedDate.toLocaleDateString("en-US", options);

                    tableRow += '<td scope="col" unixtime="' + doc.data()[fields[i]].seconds + '">' + formattedDate + '</td>';
                }
                else {
                    tableRow += '<td scope="col">' + escapeHtml( doc.data()[fields[i]] ).slice(0, 40) + '</td>';
                }
            }

            tableRow += '</tr>';

            tableRows += tableRow;

            //console.log("Document data:", doc.data());
        });

        var table = `
        <table id="keylist-table" class="table table-bordered">
            <thead id="keylist-thead">
                <tr>
                    <th scope="col" class="keylist-col" id="keylist-col-discordname" onclick="sortTable(0, 'str')">Discord Name</th>
                    <th scope="col" class="keylist-col" id="keylist-col-dungeonname" onclick="sortTable(1, 'str')">Dungeon</th>
                    <th scope="col" class="keylist-col" id="keylist-col-keylevel" onclick="sortTable(2, 'int')">Level</th>
                    <th scope="col" class="keylist-col" id="keylist-col-availability" onclick="sortTable(3, 'str')">Availability</th>
                    <th scope="col" class="keylist-col" id="keylist-col-datetimeadded" onclick="sortTable(4, 'date')">Date Added</th>
                </tr>
            </thead>
            <tbody>
            ` + tableRows + `
            </tbody>
        </table>
        `;

        $("#keylist-table").html(table);

    });
}


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
