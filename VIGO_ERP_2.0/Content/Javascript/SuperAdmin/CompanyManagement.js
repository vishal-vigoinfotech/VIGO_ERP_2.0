//Here Super all Js Handle Added by SUbham -- 2_01_2026

var AccesToken = "";
var BaseUrl = "/api/SuperAdminApi/"


$(document).ready(function () {
    GetAllCompanyDetails("VIEW");
});


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

var blockedChars = ["<", ">", "{", "}", "|", "~", "#", "{", "}", "(", ")"];
//#region Manage Company Page 

function GetAllCompanyDetails(action) {
    App.showLoader();
    $.ajax({
        type: 'GET',
        url: BaseUrl+'GetAllCompanyDetails',
        contentType: "application/json; charset=utf-8",
        headers: { "Authorization": "Bearer " + accessToken },
        data: "",
        dataType: "json",
        success: function (response) {
            App.hideLoader();
            //Here tabular binding
            var table = new Tabulator("#divCompanyDetails", {
                data: response,
                layout: "fitColumns",
                pagination: "local",
                paginationSize: 10,
                columns: [
                    {
                        title: "Sr", formatter: "rownum", hozAlign: "center", width: 50, frozen: true,
                        formatterParams: {
                            rowRangeStart: function (row) {
                                return row.getTable().getPage() * row.getTable().getPageSize() - row.getTable().getPageSize();
                            }
                        }
                    },
                    { title: "Company Name", field: "CompanyName", hozAlign: "center" },
                    { title: "Comp Code", field: "Code", hozAlign: "center" },
                    { title: "User Name", field: "UserName", hozAlign: "center" },
                    { title: "Start Date", field: "StartDate", hozAlign: "center" },
                    { title: "End Date", field: "EndDate", hozAlign: "center" },
                    { title: "No. of Lic", field: "TotalLicenses", hozAlign: "center" },
                    { title: "Mode of Pay", field: "ModeOFPayment", hozAlign: "center" },
                    {
                        title: "Status",
                        field: "IsActive",
                        hozAlign: "center",
                        formatter: function (cell, formatterParams) {
                            var rowData = cell.getRow().getData();  //Here we get this row all value
                            var Id = rowData.ID;
                            var value = cell.getValue();
                            var param = Id + "#" + value;

                            if (value === true || value === "True" || value === 1) {
                                return `<button class="status-btn active" onclick="ActiveDeactiveClients('${param}')">Active</button>`;
                            } else {
                                return `<button class="status-btn inactive" onclick="ActiveDeactiveClients('${param}')">Inactive</button>`;
                            }
                        },
                        download: false
                    },
                    {
                        title: "Actions",
                        hozAlign: "center",
                        formatter: function (cell, formatterParams) {
                            var rowData = cell.getRow().getData();  //Here we get this row all value
                            return `<button class="view-btn action_btn" onclick="ViewBeforeUpdate('${rowData.ID + "#" + false}')">View</button> | <button class="update-btn action_btn" onclick="ViewBeforeUpdate('${rowData.ID + "#" + true}')">Update</button>`;
                        },
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

//#region Company validation 
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
//#endregion

//$(document).on("click", "#btnCreateCompany", function (e) {
//    e.preventDefault();
function CreateCompany() {
    App.showLoader();
    var isValid = true;
    debugger
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
        App.hideLoader();
        alert("Please fill all required fields correctly!", "error");
        return false;
    }
    else {
        var model = {
            CompanyCode: $("#txtCompanyCode").val(),
            CompanyName: $("#txtCompanyName").val(),
            CompanyAddress: $("input[name='CompanyAddress']").val(),
            OtherDetails: $("input[name='OtherDetails']").val(),
            UserName: $("#txtUserName").val(),
            FirstName: $("#txtFirstName").val(),
            LastName: $("#txtLastName").val(),
            Email: $("#email").val(),
            Contact: $("#txtContact").val(),
            License: $("#txtLicense").val(),
            StartDate: $("#txtStartDate").val(),
            EndDate: $("#txtEndDate").val(),
            ModeOFPayment: $("#ddlModeOfPay").val(),
            APK: $("#txtAPK").val(),
            Aadhaar: $("input[name='Aadhaar']:checked").val(),
            Bank: $("input[name='Bank']:checked").val(),
            UAN: $("input[name='UAN']:checked").val(),
            ClientV: $("input[name='ClientV']:checked").val(),
            RecruitmentV: $("input[name='RecruitmentV']:checked").val()
        };

        $.ajax({
            url: BaseUrl + 'CreateCompany',
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            headers: { "Authorization": "Bearer " + accessToken },
            data: JSON.stringify(model),
            success: function (response) {
                App.hideLoader();
                var suc = response.split("#");
                if (suc[1] == 1) {
                    showToast("Company created successfully", "success");
                    $('#exampleModal').modal('hide');
                    ClearCompanyForm();
                    GetAllCompanyDetails("VIEW");
                }
                else {
                    showToast(suc[0], "error");
                }
            },
            error: function () {
                alert("Something went wrong!");
            }
        });
    }
};

function ClearCompanyForm() {

    $("#txtCompanyCode").val('');
    $("#txtCompanyName").val('');
    $("input[name='CompanyAddress']").val('');
    $("input[name='OtherDetails']").val('');
    $("#txtUserName").val('');
    $("#txtFirstName").val('');
    $("#txtLastName").val('');
    $("#email").val('');
    $("#txtContact").val('');
    $("#txtLicense").val('');
    $("#txtStartDate").val('');
    $("#txtEndDate").val('');
    $("#txtAPK").val('');
    $("#ddlModeOfPay").prop("selectedIndex", 0);
    $("input[name='Aadhaar']").prop("checked", false);
    $("input[name='Bank']").prop("checked", false);
    $("input[name='UAN']").prop("checked", false);
    $("input[name='ClientV']").prop("checked", false);
    $("input[name='RecruitmentV']").prop("checked", false);
}

function ActiveDeactiveClients(data) {
    App.showLoader();
    var detail = data.split("#");
    var companyid = detail[0];
    var status = detail[1]
    var model =
    {
        Status: status,
        CompId: companyid
    }

    $.ajax({
        type: "POST",
        url: BaseUrl + "ActiveDeactiveClients",
        headers: { "Authorization": "Bearer " + accessToken },
        contentType: "application/json; charset=utf-8",
        processData: false,
        data: JSON.stringify(model),
        success: function (response) {
            App.hideLoader();
            var suc = response.split("#");
            if (suc[1] == 1) {
                showToast(suc[0], "success");
                GetAllCompanyDetails("VIEW");
            }
            else {
                showToast(suc[0], "success");
            }
        },
    });
}

var UserID;
var CompID;
function ViewBeforeUpdate(data) {
    App.showLoader();
    var detail = data.split("#");
    var btnshow = detail[1];
   
    $.ajax({
        type: "POST",
        url: BaseUrl + "GetCompanyDetailById",
        headers: { "Authorization": "Bearer " + accessToken },
        contentType: "application/json",
        data: JSON.stringify(detail[0]),
        success: function (response) {
            App.hideLoader();
            ClearCompanyForm();
            var getData = $.parseJSON(response);
            CompID = getData[0].ID;
            UserID = getData[0].UserId;
            $("#txtCompanyCode").val(getData[0].Code);
            $("#txtCompanyName").val(getData[0].Name);
            $("input[name='CompanyAddress']").val(getData[0].Address);
            $("input[name='OtherDetails']").val(getData[0].Details);
            $("#txtUserName").val(getData[0].UserName);
            $("#txtFirstName").val(getData[0].FirstName);
            $("#txtLastName").val(getData[0].LastName);
            $("#email").val(getData[0].Email);
            $("#txtContact").val(getData[0].ContactNo);
            $("#txtLicense").val(getData[0].TotalLicenses);
            $("#txtStartDate").val(toISODate(getData[0].StartDate));
            $("#txtEndDate").val(toISODate(getData[0].Enddate));
            $("#ddlModeOfPay").val(getData[0].SubscriptionType);
            $("#txtAPK").val(getData[0].APK);
            debugger
            if (getData[0].Aadhaar === true || getData[0].Aadhaar === 1 || getData[0].Aadhaar === "1" || getData[0].Aadhaar === "true")
                $("#AadhaarY").prop("checked", true);
            else
                $("#AadhaarN").prop("checked", true);

            if (getData[0].Bank === true || getData[0].Bank === 1 || getData[0].Bank === "1" || getData[0].Bank === "true")
                $("#BankY").prop("checked", true);
            else
                $("#BankN").prop("checked", true);

            if (getData[0].UAN === true || getData[0].UAN === 1 || getData[0].UAN === "1" || getData[0].UAN === "true")
                $("#UANY").prop("checked", true);
            else
                $("#UANN").prop("checked", true);

            if (getData[0].ClientV === true || getData[0].ClientV === 1 || getData[0].ClientV === "1" || getData[0].ClientV === "true")
                $("#ClientVY").prop("checked", true);
            else
                $("#ClientVN").prop("checked", true);

            if (getData[0].RecruitmentV === true || getData[0].RecruitmentV === 1 || getData[0].RecruitmentV === "1" || getData[0].RecruitmentV === "true")
                $("#RecruitmentVY").prop("checked", true);
            else
                $("#RecruitmentVN").prop("checked", true); 

            $('#exampleModal').modal('show');
            debugger
            if (btnshow == 'true') {
                $("#btnCreateCompany").html('Update');
                $("#btnCreateCompany").attr("onclick", "UpdateCompany(this);return false;");
            }
            else {
                $("#btnCreateCompany").css("display", "none");
            }
        },
    });
}

function UpdateCompany() {
    App.showLoader();
    var isValid = true;
    debugger
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
        alert("Please fill all required fields correctly!", "error");
        return false;
    }
    else {
        var model = {
            CompId: CompID,
            UserID : UserID,
            CompanyCode: $("#txtCompanyCode").val(),
            CompanyName: $("#txtCompanyName").val(),
            CompanyAddress: $("input[name='CompanyAddress']").val(),
            OtherDetails: $("input[name='OtherDetails']").val(),
            UserName: $("#txtUserName").val(),
            FirstName: $("#txtFirstName").val(),
            LastName: $("#txtLastName").val(),
            Email: $("#email").val(),
            Contact: $("#txtContact").val(),
            License: $("#txtLicense").val(),
            StartDate: $("#txtStartDate").val(),
            EndDate: $("#txtEndDate").val(),
            ModeOFPayment: $("#ddlModeOfPay").val(),
            APK: $("#txtAPK").val(),
            Aadhaar: $("input[name='Aadhaar']:checked").val(),
            Bank: $("input[name='Bank']:checked").val(),
            UAN: $("input[name='UAN']:checked").val(),
            ClientV: $("input[name='ClientV']:checked").val(),
            RecruitmentV: $("input[name='RecruitmentV']:checked").val()
        };

        $.ajax({
            url: BaseUrl + 'UpdateCompanyDetails',
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            headers: { "Authorization": "Bearer " + accessToken },
            data: JSON.stringify(model),
            success: function (response) {
                App.hideLoader();
                var suc = response.split("#");
                if (suc[1] == 1) {
                    showToast("Company Update successfully", "success");
                    $('#exampleModal').modal('hide');
                    ClearCompanyForm();
                    GetAllCompanyDetails("VIEW");
                }
                else {
                    showToast(suc[0], "success");
                }
            },
            error: function () {
                alert("Something went wrong!");
            }
        });
    }
}

function toISODate(str) {
    let parts = str.split("/"); // ["22","03","23"]
    let day = parts[0].padStart(2, "0");
    let month = parts[1].padStart(2, "0");
    let year = parts[2].padStart(2, "0") ;
    return `${year}-${month}-${day}`;
}
//#endregion