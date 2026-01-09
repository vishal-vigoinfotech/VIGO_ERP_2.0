function showError(lblId, message) {
    $("#" + lblId).text(message).fadeIn(300);
}

function hideError(lblId) {
    $("#" + lblId).fadeOut(200);
}
//validate email
function ValidateEmail() {
    if ($('#email').val() != "") {
        $('#lblerr_email').empty();
        var x = $("#email").val();
        var atpos = x.indexOf("@");
        var dotpos = x.lastIndexOf(".");
        if (atpos < 1 || dotpos < atpos + 2 || dotpos + 2 >= x.length) {
            $('#lblerr_email').text("Enter Correct Email Id").fadeIn(1000);
            return false;
        }
    }
    else { $('#lblerr_email').text("Email Id Mandetory!").fadeIn(1000); }
}
//validate special character
function hasBlockedChar(value, blockedChars) {
    for (var i = 0; i < blockedChars.length; i++) {
        if (value.includes(blockedChars[i])) {
            return { valid: false, message: "Special characters are not allowed" };
        }
    }
    return { valid: true };
}

var blockedChars = ["<", ">", "{", "}", "|", "~", "#", "{", "}", "(", ")"];


//#region It's not use

// Excel Export
$("#download-xlsx").click(function () {
    table.download("xlsx", "CompanyReport.xlsx", { sheetName: "Company Data" });
});

// PDF Export
$("#download-pdf").click(function () {
    table.download("pdf", "CompanyReport.pdf", {
        orientation: "landscape",
        title: "Company Report",
    });
});
//#endregion