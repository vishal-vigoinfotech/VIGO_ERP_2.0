//Here Super all Js Handle Added by SUbham -- 2_01_2026
var table;
var AccesToken = "";
var BaseUrl = "SuperAdmin/"

//#region Manage Company Page 

    function GetAllCompanyDetails(action) {

    $.ajax({
        type: 'GET',
        url: 'GetCompanyReportList',
        contentType: "application/json; charset=utf-8",
        data: "",
        dataType: "json",
        success: function (response) {
            console.log(response);
            //Here tabular binding
            var table= new Tabulator("#divCompanyDetails", {
                data: response,
                layout: "fitColumns",
                pagination: "local",
                paginationSize: 10,
                layout: "fitData",
                columns: [
                    {title: "Sr",formatter: "rownum",hozAlign: "center",width: 50,
                        formatterParams: {
                            rowRangeStart: function (row) {
                                return row.getTable().getPage() * row.getTable().getPageSize() - row.getTable().getPageSize();}
                        }
                    },
                    { title: "Company Name", field: "CompanyName", hozAlign: "center" },
                    { title: "Comp Code", field: "Code", hozAlign: "center" },
                    { title: "User Name", field: "UserName", hozAlign: "center" },
                    { title: "Start Date", field: "StartDate", hozAlign: "center" },
                    { title: "End Date", field: "EndDate", hozAlign: "center" },
                    { title: "No. of Lic", field: "NoOfLogin", hozAlign: "center" },
                    { title: "Mode of Pay", field: "ModeOFPayment", hozAlign: "center" },
                    {
                        title: "Status",
                        field: "IsActive",
                        hozAlign: "center",
                        formatter: function (cell, formatterParams) {
                            var value = cell.getValue();
                            if (value === true || value === "True" || value === 1) {
                                return `<button class="status-btn active">Active</button>`;
                            } else {
                                return `<button class="status-btn inactive">Inactive</button>`;
                            }
                        },
                        //cellClick: function (e, cell) {
                        //    var data = cell.getRow().getData();
                        //    data.IsActive = !data.IsActive; // toggle value
                        //    cell.getRow().update(data); // refresh row
                        //}
                        download:false
                    },
                    {
                        title: "Actions",
                        hozAlign: "center",
                        formatter: function (cell, formatterParams) {
                            return `<button class="view-btn action_btn">View</button> | <button class="update-btn action_btn">Update</button>`;
                        },
                        //cellClick: function (e, cell) {
                        //    // Identify which button is clicked
                        //    if (e.target.classList.contains("view-btn")) {
                        //        var data = cell.getRow().getData();
                        //    }
                        //    if (e.target.classList.contains("update-btn")) {
                        //        var data = cell.getRow().getData();
                        //    }
                        //},
                        download: false // Skip in Excel/PDF
                    }
                ],
                movableColumns: true,
            });

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
        },
        error: function (err) {

        }
    });
}

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
function showToast(message, type = "error") {

    const icons = {
        success: "✔",
        error: "✖",
        warning: "⚠"
    };

    const toast = $(`
                    <div class="toast-card toast-${type}">
                        <div class="toast-icon">${icons[type]}</div>
                        <div class="toast-text">${message}</div>
                    </div>
                `);

    $("#toastContainer").append(toast);

    // SHOW
    setTimeout(() => toast.addClass("show"), 50);

    // AUTO HIDE
    setTimeout(() => {
        toast.removeClass("show").addClass("hide");
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}
//Here custom Special character validation
// ================= COMMON HELPER =================
function showError(lblId, message) {
    $("#" + lblId).text(message).fadeIn(300);
}

function hideError(lblId) {
    $("#" + lblId).fadeOut(200);
}

// Dummy blocked char function (agar already hai to remove kar dena)
function hasBlockedChar(value, blockedChars) {
    for (var i = 0; i < blockedChars.length; i++) {
        if (value.includes(blockedChars[i])) {
            return { valid: false, message: "Special characters are not allowed" };
        }
    }
    return { valid: true };
}

var blockedChars = ["<", ">", "{", "}", "|", "~","#","{","}","(",")"];

function validateCompanyCode() {
    var val = $("#txtCompanyCode").val().trim();
    if (val === "") {
        showError("lblerr_txtCompanyCode", "Company Code is required");
        return false;
    }
    hideError("lblerr_txtCompanyCode");
    return true;
}

function validateCompanyName() {
    var val = $("#txtCompanyName").val().trim();
    if (val === "") {
        showError("lblerr_txtCompanyName", "Company Name is required");
        return false;
    }
    var res = hasBlockedChar(val, blockedChars);
    if (!res.valid) {
        showError("lblerr_txtCompanyName", res.message);
        return false;
    }
    hideError("lblerr_txtCompanyName");
    return true;
}

function validateCompanyUsername() {
    var val = $("#txtUserName").val().trim();
    if (val === "") {
        showError("lblerr_txtUserName", "User Name is required");
        return false;
    }
    hideError("lblerr_txtUserName");
    return true;
}

function validateCompanyFname() {
    var val = $("#txtFirstName").val().trim();
    if (val === "") {
        showError("lblerr_txtFirstName", "First Name is required");
        return false;
    }
    hideError("lblerr_txtFirstName");
    return true;
}

function validateCompanyLname() {
    var val = $("#txtLastName").val().trim();
    if (val === "") {
        showError("lblerr_txtlastName", "Last Name is required");
        return false;
    }
    hideError("lblerr_txtlastName");
    return true;
}

function validateCompanyContact() {
    var val = $("#txtContact").val().trim();
    if (val === "") {
        showError("lblerr_txtContact", "Contact No is required");
        return false;
    }
    if (!/^[0-9]{10}$/.test(val)) {
        showError("lblerr_txtContact", "Enter valid 10 digit number");
        return false;
    }
    hideError("lblerr_txtContact");
    return true;
}

function validateNoLic() {
    var val = $("#txtLicense").val().trim();
    if (val === "") {
        showError("lblerr_txtNoLic", "No of License is required");
        return false;
    }
    hideError("lblerr_txtNoLic");
    return true;
}

function validateStartDate() {
    if ($("#txtStartDate").val() === "") {
        showError("lblerr_txtStartDate", "Start date is required");
        return false;
    }
    hideError("lblerr_txtStartDate");
    return true;
}

function validateEndDate() {
    if ($("#txtEndDate").val() === "") {
        showError("lblerr_txtEndDate", "End date is required");
        return false;
    }
    hideError("lblerr_txtEndDate");
    return true;
}

function validateModeOfpay() {
    if ($("#ddlModeOfPay").val() === "-1") {
        showError("lblerr_txtModeOfPay", "Subscription type is required");
        return false;
    }
    hideError("lblerr_txtModeOfPay");
    return true;
}

function validateAPK() {
    if ($("#txtAPK").val().trim() === "") {
        showError("lblerr_txtAPK", "APK is required");
        return false;
    }
    hideError("lblerr_txtAPK");
    return true;
}

$(document).ready(function () {
    $("#ComapnymanageForm").on("submit", function (e) {
    e.preventDefault();
    var isValid = true;

    isValid &= validateCompanyCode();
    isValid &= validateCompanyName();
    isValid &= validateCompanyUsername();
    isValid &= validateCompanyFname();
    isValid &= validateCompanyLname();
    isValid &= validateCompanyContact();
    isValid &= validateNoLic();
    isValid &= validateStartDate();
    isValid &= validateEndDate();
    isValid &= validateModeOfpay();
    isValid &= validateAPK();

    if (!isValid) {
        showToast("Please fill all required fields correctly!", "error");
        return false;
    }
    else {
        var data = $(this).serialize();
        $.ajax({
            url: '/SuperAdmin/CreateCompany',
            type: 'POST',
            data: data,
            success: function (res) {
                if (res) {
                    showToast("Record saved successfully", "success");
                } else {
                    showToast(res.message, "error");
                    //showToast("Login successful", "success"); // green
                    //showToast("Password will expire soon", "warning"); // yellow
                }
            },
            error: function () {
                showToast("something went wrong !", "error");
            }
        });
    }
});
});

//function ValidateCompanyDetails() {
//    var CompanyCode = $("#txtCompanyCode").val();
//    var CompanyName = $("#txtCompanyName").val();
//    var License = $("#txtLicense").val();
//    var StartDate = $("#txtStartDate").val();
//    var EndDate = $("#txtEndDate").val();
//    var FirstName = $("#txtFirstName").val();
//    var LastName = $("#txtLastName").val();
//    var Contact = $("#txtContact").val();
//    var email = $("#email").val();
//    var ComipanyAddress = $("#txtCompanyAddress").val();
//    var OtherDetails = $("#txtOtherDetails").val();
//    var UserName = $("#txtUserName").val();
//    var ModeOFPayment = $("#ddlModeOfPay option:selected").val();
//    var APK = $("#txtAPK").val();
//    var emailcheck = ValidateEmail();

//    if (CompanyCode == "" || CompanyName == "" || License == "" || StartDate == "" || EndDate == "" || FirstName == ""
//        || LastName == "" || Contact == "" || emailcheck == false || UserName == "" || ModeOFPayment == "" || ModeOFPayment == "-1") {

//        if (CompanyName == "") {
//            $("#lblerr_txtCompanyName").text("CompanyName is required").fadeIn(1000);
//        }
//        if (License == "") {
//            $("#lblerr_txtLicense").text("No. Of license required").fadeIn(1000);
//        }
//        if (Contact == "") {
//            $("#lblerr_txtContact").text("Contact is required").fadeIn(1000);
//        }
//        if (CompanyCode == "") {
//            $("#lblerr_txtCompanyCode").text("CompanyCode is required").fadeIn(1000);
//        }
//        if (FirstName == "") {
//            $("#lblerr_txtFirstName").text("First Name is required").fadeIn(1000);
//        }
//        if (LastName == "") {
//            $("#lblerr_txtLastName").text("Last Name is required").fadeIn(1000);
//        }
//        if (emailcheck == false) {
//        }
//        if (StartDate == "") {
//            $("#lblerr_txtStartDate").text("Start date is required").fadeIn(1000);
//        }
//        if (EndDate == "") {
//            $("#lblerr_txtEndDate").text("End date is required").fadeIn(1000);
//        }
//        if (UserName == "") {
//            $("#lblerr_txtUserName").text("Username is required").fadeIn(1000);
//        }
//        if (ModeOFPayment == "" || ModeOFPayment == "-1") {
//            $("#lblerr_ddlModeOfPay").text("Subscription type is Required").fadeIn(1000);
//        }
//        if (APK == "") {
//            $("#lblerr_txtAPK").text("APK is required").fadeIn(1000);
//        }
//        return;
//    }
//}
//#endregion

//#region Manage Country Page         ----Add By Himanshu Vishwakarma
//function GetCountryDetails() {
//    debugger
//    $.ajax({
//        type: 'GET',
//        url: 'GetCountryList',
//        contentType: "application/json; charset=utf-8",
//        data: "",
//        dataType: "json",
//        success: function (response) {
//            console.log(response);

//            if (table) {
//                table.setData(response); // already exists
//            } else {
//                table = new Tabulator("#divCountryList", {
//                    layout: "fitColumns",
//                    pagination: "local",
//                    paginationSize: 5,
//                    movableColumns: true,
//                    data: response,
//                    columns: [
//                        { title: "Sr.", formatter: "rownum", width: 70 },
//                        { title: "Country Code", field: "CountryCode" },
//                        { title: "Country Name", field: "CountryName" },
//                        {
//                            title: "Status", field: "IsActive",
//                            formatter: cell =>
//                                cell.getValue()
//                                    ? "<span style='color:green'>Active</span>"
//                                    : "<span style='color:red'>Inactive</span>"
//                        },
//                        {
//                            title: "Action",
//                            formatter: () =>
//                                "<span style='color:orangered;cursor:pointer'>Update</span> | " +
//                                "<span style='color:orangered;cursor:pointer'>Delete</span>"
//                        }
//                    ]
//                });
//            }
//        },
//        error: function (err) {

//        }
//    });
//}
//#endregion