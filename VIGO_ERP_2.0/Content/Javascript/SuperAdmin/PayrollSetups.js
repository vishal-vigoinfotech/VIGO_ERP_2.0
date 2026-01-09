var BaseUrl = "/api/SuperAdminApi/"

//#region master payroll page   
function ViewSalaryReportComponent(action) {
    App.showLoader();

    $.ajax({
        type: 'GET',
        url: BaseUrl + 'ViewSalaryReport',
        contentType: "application/json; charset=utf-8",
        headers: { "Authorization": "Bearer " + accessToken },
        data: "",
        dataType: "json",
        success: function (response) {
            App.hideLoader();
            console.log(response);
            var table = new Tabulator("#divPayRollDetails", {
                data: response,
                //layout: "fitColumns",
                progressiveLoadSize: 10,
                pagination: "local",
                paginationSize: 10,
                layout: "fitData",
                columns: [
                    {
                        title: "Sr", formatter: "rownum", hozAlign: "center", width: 50, frozen: true,
                        formatter: function (cell) {
                            var table = cell.getTable();
                            var page = table.getPage();        
                            var size = table.getPageSize(); 

                            return ((page - 1) * size) + cell.getRow().getPosition(true);
                        }
                    },
                    { title: "Component Name", field: "ComponentName", hozAlign: "center" },
                    { title: "Component Display Name", field: "ComponentDispName", hozAlign: "center" },
                    {
                        title: "Component Type", field: "ComponentType", hozAlign: "center",
                        formatter: function (cell, formatterParams) {
                            var value = cell.getValue();
                            if (value == "1")
                            { return "Earning" }
                            else if (value == "2")
                            { return "Deduction" }
                            else { return "Reimbursement" }
                        }
                    },
                    { title: "Order in Pay Slip", field: "DisplayOrder", hozAlign: "center" },
                    { title: "Is Calculated Monthly", field: "IsCalMonthly", hozAlign: "center" },
                    { title: "Is Active", field: "IsActive", hozAlign: "center" },
                    { title: "Action", field: "ModeOFPayment", hozAlign: "center" }
                ]
            });

            $('#payRollSearch').on('keyup', function () {
                var value = this.value;

                if (value === "") {
                    table.clearFilter();  
                } else {
                    table.setFilter(function (data) {
                        for (var key in data) {
                            if (String(data[key]).toLowerCase().includes(value.toLowerCase())) {
                                return true;
                            }
                        }
                        return false;
                    });
                }
            });


        },
    });
}

function validateComponentName() {
    var val = $("#txtComponentName").val().trim();
    if (val === "") {
        showError("lblerr_txtComponentName", "Component Name is required");
        return false;
    }
    var res = hasBlockedChar(val, blockedChars);
    if (!res.valid) {
        showError("lblerr_txtComponentName", res.message);
        return false;
    }
    hideError("lblerr_txtComponentName");
    return true;
}

function validateDisplayName() {
    var val = $("#txtDisplayName").val().trim();
    if (val === "") {
        showError("lblerr_txtDisplayName", "Company Name is required");
        return false;
    }
    var res = hasBlockedChar(val, blockedChars);
    if (!res.valid) {
        showError("lblerr_txtDisplayName", res.message);
        return false;
    }
    hideError("lblerr_txtDisplayName");
    return true;
}

function validateShortCode() {
    var val = $("#txtShortCode").val().trim();
    if (val === "") {
        showError("lblerr_txtShortCode", "User Name is required");
        return false;
    }
    hideError("lblerr_txtShortCode");
    return true;
}

function validateDisplayOrderPayslip() {
    var val = $("#txtDisplayOrderPayslip").val().trim();
    if (val === "") {
        showError("lblerr_txtDisplayOrderPayslip", "First Name is required");
        return false;
    }
    hideError("lblerr_txtDisplayOrderPayslip");
    return true;
}

function CreateSalaryHead() {
    var IsValid = true;
    isValid &= validateComponentName();
    isValid &= validateDisplayName();
    isValid &= validateShortCode();
    isValid &= validateDisplayOrderPayslip();

    if (!isValid) {
        App.hideLoader();
        alert("Please fill all required fields correctly!", "error");
        return false;
    }
    else {
        var model = {

        }
    }
}
//#endregion
