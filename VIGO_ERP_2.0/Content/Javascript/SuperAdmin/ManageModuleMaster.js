
//#region company Module Master Page
function GetAllCompanyModuleDetails(action) {
    App.showLoader();
    $.ajax({
        type: 'POST',
        url: BaseUrl + 'GetModuleMasterReportList',
        contentType: "application/json; charset=utf-8",
        headers: { "Authorization": "Bearer " + accessToken },
        data: "",
        dataType: "json",
        success: function (response) {
            App.hideLoader();
            console.log(response);
            //Here tabular binding
            if (response != "Error") {
                var table = new Tabulator("#divCompanyModuleDetails", {
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
                        { title: "Module Name", field: "ModuleName", hozAlign: "center" },
                        { title: "Module Id", field: "ModuleCode", hozAlign: "center" },
                        { title: "Module Description", field: "ModuleDescription", hozAlign: "center" },
                        {
                            title: "Status",
                            field: "IsVisible",
                            hozAlign: "center",
                            formatter: function (cell, formatterParams) {
                                var rowData = cell.getRow().getData();  //Here we get this row all value
                                var Id = rowData.ID;
                                var value = cell.getValue();
                                var param = rowData.ModuleId + "#" + rowData.IsVisible;

                                if (value === true || value === "True" || value === 1) {
                                    return `<button class="status-btn active" onclick="ActiveDeactiveModule('${param}')">Active</button>`;
                                } else {
                                    return `<button class="status-btn inactive" onclick="ActiveDeactiveModule('${param}')">Inactive</button>`;
                                }
                            },
                            download: false
                        },
                        {
                            title: "Actions",
                            hozAlign: "center",
                            formatter: function (cell, formatterParams) {
                                var rowData = cell.getRow().getData();  //Here we get this row all value
                                return `<button class="update-btn action_btn" onclick="ViewBeforeUpdate('${rowData.ModuleId + "#" + rowData.ModuleName + "#" + rowData.ModuleCode + "#" + rowData.ModuleDescription}')">Update</button>`;
                            },
                            download: false
                        }
                    ],
                    movableColumns: true,
                });
            }
            else {
                var table = new Tabulator("#divCompanyModuleDetails", {
                    layout: "fitColumns",
                    pagination: "local",
                    columns: [
                        {
                            title: "Sr", formatter: "rownum", hozAlign: "center", width: 50, frozen: true,
                        },
                        { title: "Module Name", field: "CompanyName", hozAlign: "center" },
                        { title: "Module Id", field: "Code", hozAlign: "center" },
                        { title: "Module Description", field: "UserName", hozAlign: "center" },
                        {title: "Status", field: "IsActive", hozAlign: "center", }, 
                        {title: "Action", field: "", hozAlign: "center", }, 
                    ],
                    movableColumns: true,
                    placeholder: "No Data Found"
                });
            }
        },
        error: function (err) {

        }
    });
    App.hideLoader();
}

function validateModuleName() {
    var moduleName = $("#txtModuleName").val().trim();
    if (moduleName === "") {
        showError("lblerr_txtModuleName", "Module Name is required");
        return false;
    }
    hideError("lblerr_txtModuleName");
    return true;
}
function validateModuleId(){
    var ModuleId = $("#txtModuleId").val().trim();

    if (ModuleId === "") {
        showError("lblerr_txtModuleId", "Module Id is required.");
        return false;
    }
    hideError("lblerr_txtModuleId");
    return true;
}
function validateModuleDescription() {
    var ModuleDescription = $("#txtModuleDescriptiion").val().trim();
    if (ModuleDescription === "") {
        showError("lblerr_txtModuleDescriptiion", "Module Description is required.");
        return false;
    }
    hideError("lblerr_txtModuleDescriptiion");
    return true;
}
function Creatmodulemaster() {
    App.showLoader();
    var IsValid = true;

    IsValid &= validateModuleName();
    IsValid &= validateModuleId();
    IsValid &= validateModuleDescription();

    if (IsValid) {
        var model = {
            ModuleName: $("#txtModuleName").val().trim(),
            ModuleCode: $("#txtModuleId").val().trim(),
            ModuleDescription: $("#txtModuleDescriptiion").val().trim()
        }
        $.ajax({
            url: BaseUrl + 'CreateModuleMaster',
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            headers: { "Authorization": "Bearer " + accessToken },
            data: JSON.stringify(model),
            success: function (response) {
                App.hideLoader();
                var suc = response.split("#");
                if (suc[1] == 1) {
                    showToast(suc[0], "success");
                    ClearForm();
                    GetAllCompanyModuleDetails("VIEW");
                }
                else {
                    showToast(suc[0], "error");
                }
            },
            error: function () {
                showToast("Something went wrong!","error");
            }
        });
    }
    App.hideLoader();
}
function ClearForm() {
    $("#txtModuleName").val('');
    $("#txtModuleId").val('');
    $("#txtModuleDescriptiion").val('');
}
function ActiveDeactiveModule(data) {
    App.showLoader();
    var detail = data.split("#");
    var ModuleId = detail[0];
    var status = detail[1]
    var model =
    {
        statusId: status,
        moduleId: ModuleId
    }
    $.ajax({
        type: "POST",
        url: BaseUrl + "ActiveDeactiveModule",
        headers: { "Authorization": "Bearer " + accessToken },
        contentType: "application/json; charset=utf-8",
        processData: false,
        data: JSON.stringify(model),
        success: function (response) {
            App.hideLoader();
            //var suc = response.split("#");
            if (response != null) {
                showToast("Module status update successfully", "success");
                GetAllCompanyModuleDetails("VIEW");
            }
            else {
                showToast("Server error", "success");
            }
        },
    });
    App.hideLoader();
}
var Id;
function ViewBeforeUpdate(data) {

    var details = data.split("#");
    Id = details[0];
    $("#txtModuleName").val(details[1]);
    $("#txtModuleId").val(details[2]);
    $("#txtModuleDescriptiion").val(details[3]);

    $("#btnCompanyModuleMaster").html('Update');
    $("#btnCompanyModuleMaster").attr("onclick", "UpdateModuleMaster(this);return false;");
}
function UpdateModuleMaster() {
    App.showLoader();
    var IsValid = true;
    debugger
    IsValid &= validateModuleName();
    IsValid &= validateModuleId();
    IsValid &= validateModuleDescription();

    if (IsValid) {
        var model = {
            ModuleId:Id,
            ModuleName: $("#txtModuleName").val().trim(),
            ModuleCode: $("#txtModuleId").val().trim(),
            ModuleDescription: $("#txtModuleDescriptiion").val().trim()
        }
        $.ajax({
            url: BaseUrl + 'UpdateModuleMaster',
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            headers: { "Authorization": "Bearer " + accessToken },
            data: JSON.stringify(model),
            success: function (response) {
                App.hideLoader();
                var suc = response.split("#");
                if (suc[1] == 1) {
                    showToast(suc[0], "success");
                    ClearForm();
                    GetAllCompanyModuleDetails("VIEW");
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
     App.hideLoader();
}
//#endregion