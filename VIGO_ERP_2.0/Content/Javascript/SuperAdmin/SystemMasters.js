//Here System Masters all Js Handle Added by Himanshu -- 03/01/2026
var CountryId;
var BaseUrl = "/api/SuperAdminApi/"

function PageFunction() {
    $("#btnUpdate").hide();
    $("#btnSubmit").show();
}
//#region Manage Country Page         ----Add By Himanshu Vishwakarma
function GetCountryDetails() {
    debugger
    $.ajax({
        type: 'POST',
        url: BaseUrl+'GetCountryList',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        headers: { "Authorization": "Bearer " + accessToken },
        success: function (getData) {
            App.hideLoader();
            var table = new Tabulator("#divCountryList", {
                data: getData,
                layout: "fitColumns",
                pagination: "local",
                paginationSize: 10,
                movableColumns: true,

                columns: [
                    {
                        title: "Sr",
                        formatter: "rownum",
                        hozAlign: "center",
                        width: 60,
                        formatterParams: {
                            rowRangeStart: function (row) {
                                return row.getTable().getPage() * row.getTable().getPageSize()
                                    - row.getTable().getPageSize();
                            }
                        }
                    },
                    {
                        title: "Country Code",
                        field: "CountryCode",
                        hozAlign: "center"
                    },
                    {
                        title: "Country Name",
                        field: "CountryName",
                        hozAlign: "center"
                    },
                    {
                        title: "Status",
                        field: "IsVisible",
                        hozAlign: "center",
                        formatter: function (cell, formatterParams) {
                            var rowData = cell.getRow().getData();  //Here we get this row all value
                            var Id = rowData.CountryId;
                            var value = cell.getValue();
                            var param = Id + "#" + value;
                            if (value === true || value === "True" || value === 1) {
                                return `<button class="status-btn active" onclick="SetCountryEnableDisable('${param}')">Active</button>`;
                            } else {
                                return `<button class="status-btn inactive" onclick="SetCountryEnableDisable('${param}')">Inactive</button>`;
                            }
                        },
                        download: false
                    },
                    {
                        title: "Action",
                        hozAlign: "center",
                       /* width: 180,*/
                        headerSort: false,
                        formatter: function (cell) {
                            var d = cell.getRow().getData();
                            return `            
                                 <button class="view-btn action_btn" onclick="ViewBeforeUpdate('${d.CountryId + "#" + d.CountryName + "#" + d.CountryCode}')">Update</button> | <button class="delete-btn action_btn" onclick="DeleteCountry('${d.CountryId}')">Delete</button>
                            `;
                            
                        }
                    }

                ]
            });
            $("#searchBox").on("keyup", function () {
                var value = $(this).val().toLowerCase();

                table.setFilter(function (data) {
                    return Object.values(data).some(v =>
                        String(v).toLowerCase().includes(value)
                    );
                });
            });

        },
        error: function (err) {
            console.error(err);
            alert('Error loading country list');
        }
    });
}
//Add Country
function CreateCountry(action) {

    if (!ValidateCompanySetup()) return false;
    App.showLoader();

    var model = {
        CountryName: $("#txtCountryName").val(),
        CountryCode: $("#txtCountryCode").val().toUpperCase()
    };

    $.ajax({
        type: "POST",
        url: BaseUrl + 'CreateCountry',
        headers: { "Authorization": "Bearer " + accessToken },
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify(model),                    
        success: function (response) {
            App.hideLoader();
            console.log(response);
            if (response != null) {
                showToast("Country added successfully!","success");
                GetCountryDetails('VIEW');
                ClearFields();
            } else {
                showToast(response.split('#')[0].trim(),"error");
            }
        },
        error: function () {
            App.hideLoader();
            toastr.error("Server error");
        }
    });
}

//For view Data in text Boxes Before Updating it
function ViewBeforeUpdate(data) {
    var detail = data.split("#");
    CountryId = detail[0];
    $('#txtCountryName').val(detail[1]);
    $('#txtCountryCode').val(detail[2]);
    $('#txtCountryCode').css("pointer-events","none");
    $("#btnUpdate").show();
    $("#btnSubmit").hide();
}

//For Actual Update Call
function UpdateCountry() {
    if (!ValidateCompanySetup()) return false;

    App.showLoader();

    var model = {
        CountryId: CountryId,
        CountryName: $("#txtCountryName").val()
    };

    $.ajax({
        type: "POST",
        url: BaseUrl + "UpdateCountry",
        headers: { "Authorization": "Bearer " + accessToken },
        data: JSON.stringify(model),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            App.hideLoader();
            if (response) {
                showToast("Country Updated Successfully!","success");
                GetCountryDetails('VIEW');
                ClearFields();
                $("#btnUpdate").hide();
                $("#btnSubmit").show();
            } else {
                showToast("Server Error Please Try Again!","error");
            }
        }
    });
}


//for Deleting country data
function DeleteCountry(countryId) {
    if (!confirm("Do You Want to Delete This?")) return;

    var model = {
        CountryId: countryId
    };

    $.ajax({
        type: "POST",
        url: BaseUrl + "DeleteCountry",
        headers: { "Authorization": "Bearer " + accessToken },
        data: JSON.stringify(model),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response) {
                showToast("Row Deleted Successfully!","success");
                GetCountryDetails('VIEW');
            } else {
                showToast("Server Error Please Try Again!","error");
            }
        }
    });
}
function SetCountryEnableDisable(data) {
    App.showLoader();
    var detail = data.split("#");
    var countryId = detail[0];
    var currentStatus = detail[1]; 

    var statusId = currentStatus === "True" ? "Active" : "InActive";

    var model = {
        CountryId: countryId,
        statusId: statusId
    };

    $.ajax({
        type: "POST",
        url: BaseUrl + "SetCountryEnableDisable",
        headers: { "Authorization": "Bearer " + accessToken },
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(model),
        success: function (response) {
            App.hideLoader();
            var suc = response.split("#");

            if (suc[1] == "1") {
                showToast(suc[0], "success");
                GetCountryDetails('VIEW');
            }
            else {
                showToast(suc[0], "error");
            }
        },
        error: function () {
            App.hideLoader();
            showToast("Status update failed", "error");
        }
    });
}



function ValidateCompanySetup() {
    var isSetupValid = true;
    ClearErrorMessage();
    if ($('#txtCountryName').val() == "" || $('#txtCountryCode').val() == "" || /[^a-zA-Z0-9]/.test($("#txtCountryCode").val())) {
      
        if ($('#txtCountryName').val() == "") {
            $(".lblerr_txtCountryName").text("Country Name is required");
        }
        if ($('#txtCountryCode').val() == "") {
            $(".lblerr_txtCountryCode").text("Country Code is required.");
        }
        if (/[^a-zA-Z0-9]/.test($("#txtCountryCode").val())) {
            $('.lblerr_txtCountryCode').text('Please enter valid Country Code!');
        }
        return;
    }
    if ($("#txtCountryName").val() == "") {
        $('.lblerr_txtCountryName').empty();
        if ($("#txtCountryName").val() == "") {
            $('.lblerr_txtCountryName').text('Country Name is required !');
        }
        return;
    }
    return isSetupValid;
}
///Clear Textboxes after process completing
function ClearFields() {
    $('#txtCountryName').val("");
    $('#txtCountryCode').val("");
    $('#txtCountryCode').prop('disabled', false);
}
function ClearErrorMessage() {
    $(".lblerr_txtCountryName").empty();
    $(".lblerr_txtCountryCode").empty();
}
//For Validation Of AlphNumeric KeyWords
function ValidateAlpha(evt) {
    evt = (evt) ? evt : window.event;
    var keyCode = (evt.which) ? evt.which : evt.keyCode;
    if ((keyCode < 48 || keyCode > 57) && (keyCode < 65 || keyCode > 90) && (keyCode < 97 || keyCode > 122) && keyCode != 32) {
        $(".lblerr_txtCountryCode").text("Please insert only alphanumeric !!").fadeIn(1000);
        return false;
    }
    return true;
}

//For Validation Of Only Alphabets
function ValidateAlphaOnly(evt) {
    evt = (evt) ? evt : window.event;
    var keyCode = (evt.which) ? evt.which : evt.keyCode;
    if ((keyCode < 65 || keyCode > 90) && (keyCode < 97 || keyCode > 122) && keyCode != 32) {
        $(".lblerr_txtCountryName").text("Please insert only alphabets !!").fadeIn(1000);
        return false;
    }
    return true;
}
//#endregion
