
var accessToken = '<%=Session["access_token"]%>';
var BaseUrl = "/API/SystemMasters/";
var PrmsIsCreate = ('<%=Session["PrmsIsCreate"]%>').toLowerCase();
var PrmsIsView = ('<%=Session["PrmsIsView"]%>').toLowerCase();
var PrmsIsUpdate = ('<%=Session["PrmsIsUpdate"]%>').toLowerCase();
var PrmsIsDelete = ('<%=Session["PrmsIsDelete"]%>').toLowerCase();
var PrntUserId = '<%=Session["UserId"]%>';
var EmpBranchId = '<%=Session["BranchId"]%>';

var PrntCompId = '<%=Session["CompId"]%>';

var ListCount = 0;
var count = 0;
var count1 = 0;
var info;
var LeadId;
var LeadReturnId;
var FollowupId = 0;

var LeadCode = "";
var LeadDocId = 0;

var extcardfront = "";
var extcardback = "";
var isClientExist = false;

const eventsData = [
    { date: '2024-11-18', title: 'Casual Leave', description: 'Casual leave for personal work', color: 'blue' },
    { date: '2024-11-19', title: 'Sick Leave', description: 'Sick leave due to health issues', color: 'red' },
    { date: '2024-11-20', title: 'Meeting', description: 'Team meeting scheduled for project update', color: 'green' }
];


$(document).ready(function () {

    ShowActiveMenu();
    ShowBreadCrumb();
    GetProductDropdwn("ddlProductRequierment_0");
    GetAllRateTypeDropdwn("ddlRateType_0");
    GetAllStateDropdwn("ddlState_0");
    GetDepartmentDropdwn("txtCDepartment_0");

    PageFunction();
    GetSalesDashboardDataLeadWise();

    count = $("#desgAndnumber tbody tr").length - 1;
    count1 = $("#ClntCntrct tbody tr").length - 1;


    $("#ddlCity").select2();
    $("#btn").click(function () {
        GetCode();
    });






    $(function () {

        $('input[name="datefilter"]').daterangepicker({
            autoUpdateInput: false,
            locale: {
                cancelLabel: 'Clear'
            }
        });

        $('input[name="datefilter"]').on('apply.daterangepicker', function (ev, picker) {
            $(this).val(picker.startDate.format('DD-MM-YYYY') + ' / ' + picker.endDate.format('DD-MM-YYYY'));

        });

        $('input[name="datefilter"]').on('cancel.daterangepicker', function (ev, picker) {
            $(this).val('');
        });

    });


    $("#ddlIndustryType").change(function () {

        if ($(this).val() == 33) {
            $("#IndustryTypeRemark").show();
            $(".dynamicWidth").removeClass("l4").addClass("l3");
        }
        else {
            $("#IndustryTypeRemark").hide();
            $(".dynamicWidth").removeClass("l3").addClass("l4");
        }
    });

    $("#btn").click(function () {
        $(".comments-section").hide();
        $("#first-section-design").removeClass("first-section-design");
        $("#second-section").removeClass("second-section");
        $("#ddlAssignTo").val(PrntUserId).trigger("change");
    });

    $('#txtClientName').on('blur', function () {
        var clientName = $(this).val();
        if (clientName) {
            checkClientExist(clientName);
        }

    });

    $("#AllLeadsBtn").css({ display: "flex" });
});



//TO Get Code
function GetCode() {
    var formdata = new FormData()
    formdata.append("Action", 7)
    $.ajax({
        type: "POST",
        url: "/API/Unit/GetCode",
        contentType: "application/json; charset=utf-8",
        headers: { "Authorization": "Bearer " + accessToken },
        dataType: "json",
        data: formdata,
        contentType: false,
        processData: false,
        success: function (response) {
            //var GetData = $.getJSON(response);
            var getData = $.parseJSON(response);
            for (var a = 0; a < getData.length; a++) {

                if ((getData[a].LeadPrefix != "" && getData[a].LeadSuffix != "") && (getData[a].LeadPrefix != null && getData[a].LeadSuffix != null)) {
                    $("#CodeAtTop").html(getData[a].LeadPrefix + (parseInt(getData[a].LeadSuffix) + parseInt(1))).css("color", "green");
                } else {
                    alert("Please Setup Lead Code in Company Setup");
                    window.location.href = "../AdminMasters/CompanySetup.aspx";
                    $("#modal_emp_tbl_admin").modal("close");
                }
            }
        },
    });
}
//To Load Components Of Modal
function PageFunction() {
    $('.preloader').show();

    debugger;
    $.ajax({
        type: "GET",
        url: "/API/Inventory/GetEmployeesActiveForCRM",
        headers: { "Content-Type": "application/json", "Accept": "application/json", "Authorization": "Bearer " + accessToken },
        contentType: "application/json; charset=utf-8",
        data: "",
        async: false,
        success: function (response) {
            debugger;
            $("#ddlAssignToFilter").append('<option selected="selected" value="-1">--Select AssignTo--</option>');
            $("#ddlAssignEmployee").append('<option selected="selected" value="-1">--Select AssignTo--</option>');
            for (var i = 0; i < response.length; i++) {
                $("#ddlAssignToFilter").append($("<option/>").val(response[i].value).text(response[i].text));
                $("#ddlAssignEmployee").append($("<option />").val(response[i].value).text(response[i].text));
            }
            $('#ddlAssignToFilter').select2();
            $('#ddlAssignEmployee').select2();
        },
    });

    $.ajax({
        type: "GET",
        url: "/API/Inventory/GetCreatedByEmpForCRM",
        headers: { "Content-Type": "application/json", "Accept": "application/json", "Authorization": "Bearer " + accessToken },
        contentType: "application/json; charset=utf-8",
        data: "",
        async: false,
        success: function (response) {
            $("#ddlCreatedEmployee").append('<option selected="selected" value="-1">--Select Created By--</option>');
            for (var i = 0; i < response.length; i++) {
                $("#ddlCreatedEmployee").append($("<option/>").val(response[i].value).text(response[i].text));
            }
            $('#ddlCreatedEmployee').select2();
        },
    });


    $.ajax({
        type: "GET",
        url: BaseUrl + "GetAllLeadStatusDropdwn",
        headers: { "Content-Type": "application/json", "Accept": "application/json", "Authorization": "Bearer " + accessToken },
        contentType: "application/json; charset=utf-8",
        data: "",
        async: false,
        success: function (response) {
            debugger;
            $("#ddlStatus").empty();
            $("#ddlStatus").append('<option selected="selected" value="-1">--Select Status--</option>');
            for (var i = 0; i < response.length; i++) {
                $("#ddlStatus").append($("<option/>").val(response[i].value).text(response[i].text));
            }
        },
    });


    $.ajax({
        type: "GET",
        url: BaseUrl + "GetAllLeadSStageDropdwn",
        headers: { "Content-Type": "application/json", "Accept": "application/json", "Authorization": "Bearer " + accessToken },
        contentType: "application/json; charset=utf-8",
        data: "",
        async: false,
        success: function (response) {
            debugger;
            $("#ddlStage").empty();
            $("#ddlStage").append('<option selected="selected" value="-1">--Select Stage--</option>');
            for (var i = 0; i < response.length; i++) {
                if (response[i].value != '22' && response[i].value != '7') {
                    $("#ddlStage").append($("<option/>").val(response[i].value).text(response[i].text));
                }

            }
        },
    });

    $.ajax({
        type: "GET",
        url: BaseUrl + "GetAllDepartmentDropdwn",
        headers: { "Content-Type": "application/json", "Accept": "application/json", "Authorization": "Bearer " + accessToken },
        contentType: "application/json; charset=utf-8",
        data: "",
        async: false,
        success: function (response) {
            debugger;
            $("#txtDepartment").empty();
            $("#txtDepartment").append('<option selected="selected" value="-1">--Select Department--</option>');
            for (var i = 0; i < response.length; i++) {
                $("#txtDepartment").append($("<option/>").val(response[i].value).text(response[i].text));
            }


            $('#txtDepartment').select2({ dropdownParent: $('#department-section') });

        },
    });

    $.ajax({
        type: "GET",
        url: BaseUrl + "GetAllLeadStatusDropdwn",
        headers: { "Content-Type": "application/json", "Accept": "application/json", "Authorization": "Bearer " + accessToken },
        contentType: "application/json; charset=utf-8",
        data: "",
        async: false,
        success: function (response) {
            // debugger;
            $("#ddlStatusFilter").empty();
            $("#ddlStatusFilter").append('<option selected="selected" value="-1">--Select Status--</option>');
            for (var i = 0; i < response.length; i++) {
                $("#ddlStatusFilter").append($("<option/>").val(response[i].value).text(response[i].text));
            }
            $('#ddlStatusFilter').select2();
            // $("#ddlStatus").empty();
        },
    });

    $.ajax({
        type: "GET",
        url: BaseUrl + "GetAllLeadSStageDropdwn",
        headers: { "Content-Type": "application/json", "Accept": "application/json", "Authorization": "Bearer " + accessToken },
        contentType: "application/json; charset=utf-8",
        data: "",
        async: false,
        success: function (response) {
            //debugger;
            $("#ddlStageFilter").empty();
            $("#ddlStageFilter").append('<option selected="selected" value="-1">--Select Stage--</option>');
            for (var i = 0; i < response.length; i++) {
                if (response[i].value != '22' && response[i].value != '7') {
                    $("#ddlStageFilter").append($("<option/>").val(response[i].value).text(response[i].text));
                }
            }
            $('#ddlStageFilter').select2();
        },
    });

    ///  Request Lead Source Dropdown 
    $.ajax({
        type: "GET",
        url: BaseUrl + "GetAllLeadSourceDropdwn",
        headers: { "Content-Type": "application/json", "Accept": "application/json", "Authorization": "Bearer " + accessToken },
        contentType: "application/json; charset=utf-8",
        data: "",
        async: false,
        success: function (response) {
            debugger;
            $("#ddlLeadSource").empty();
            $("#ddlLeadSource").append('<option selected="selected" value="-1">--Select Source--</option>');
            for (var i = 0; i < response.length; i++) {
                $("#ddlLeadSource").append($("<option/>").val(response[i].value).text(response[i].text));
            }
           
        },
    });



    var formdata = new FormData();
    formdata.append('UserId', PrntUserId);
    $.ajax({
        type: "GET",
        url: "/API/SystemMasters/GetBranchListDDL",
        headers: { "Authorization": "Bearer " + accessToken },
        contentType: "application/json; charset=utf-8",
        data: formdata,
        async: false,
        dataType: "json",
        processData: false,
        contentType: false,
        success: function (response) {
            debugger;
            $('.preloader').hide();
            $("#ddlBranch").empty();
            $("#ddlBranchF").empty();
            if (EmpBranchId != '' && EmpBranchId != '0') { $("#ddlBranch").append('<option disabled selected="selected" value="-1">---Select Branch---</option>'); }
            else { $("#ddlBranch").append('<option selected="selected" value="-1">---Select Branch---</option>'); }
            if (EmpBranchId != '' && EmpBranchId != '0') { $("#ddlBranchF").append('<option disabled selected="selected" value="-1">---Select Branch---</option>'); }
            else { $("#ddlBranchF").append('<option selected="selected" value="-1">---Select Branch---</option>'); }
            if (response) {
                for (var i = 0; i < response.length; i++) {
                    $("#ddlBranch").append($("<option/>").val(response[i].value).text(response[i].text));
                    $("#ddlBranchF").append($("<option />").val(response[i].value).text(response[i].text));
                }
                $('#ddlBranch').select2({ dropdownParent: $('#modal_view_requirement_tbl') });
                $('#ddlBranchF').select2();
            }
            if (EmpBranchId != '' && EmpBranchId != '0') {
                BindEmployeeDetailByBranch(EmpBranchId, 'ddlEmployeesForm');
                $("#ddlBranch").val(EmpBranchId).trigger('change.select2');
                $("#ddlBranch").prop('disabled', false);
            }
            else { $('#ddlBranch').val('-1').trigger('change.select2'); $("#ddlBranch").prop('disabled', false); }
            if (EmpBranchId != '' && EmpBranchId != '0') {
                BindEmployeeDetailByBranchF(EmpBranchId, 'ddlAssignToFilter');
                $("#ddlBranchF").val(EmpBranchId).trigger('change.select2');
                $("#ddlBranchF").prop('disabled', false);
            }
            else { $('#ddlBranchF').val('-1').trigger('change.select2'); $("#ddlBranchF").prop('disabled', false); }
        },
    });




    $.ajax({
        type: "GET",
        url: "/API/ManageUser/GetActiveEmployeesByLoginUser",
        headers: { "Content-Type": "application/json", "Accept": "application/json", "Authorization": "Bearer " + accessToken },
        contentType: "application/json; charset=utf-8",
        data: "",
        async: false,
        success: function (response) {
            debugger;
            $("#ddlAssignTo").append('<option  value="-1">--Select AssignTo--</option>');
            for (var i = 0; i < response.length; i++) {

                if (response[i].value == PrntUserId.toUpperCase()) {

                    $("#ddlAssignTo").append($("<option/>")
                        .val(response[i].value)
                        .text("Self")
                        .attr("selected", true));


                } else {
                
                    $("#ddlAssignTo").append($("<option/>").val(response[i].value).text(response[i].text));
                }
            
            }
            $('#ddlAssignTo').select2({ dropdownParent: $('#ddlAssprnt') });

        },
    });

    //For Binding States
    $.ajax({
        type: "GET",
        url: BaseUrl + "GetPartyState",
        headers: { "Authorization": "Bearer " + accessToken },
        contentType: "application/json; charset=utf-8",
        data: "",
        async: false,
        dataType: "json",
        success: function (response) {

            $("#ddState").empty();
            $("#ddState").append('<option selected="selected" value="-1">--Select State--</option>');
            for (var i = 0; i < response.length; i++) {
                $("#ddState").append($("<option/>").val(response[i].value).text(response[i].text));
            }
            $('#ddState').select2({ dropdownParent: $('#ddStateprnt') });
            $("#ddlCity").empty();
            $("#ddlCity").append('<option selected="selected" value="-1">--Select City--</option>');
        },
    });

    //For Binding Cities As Per States
    $('select[id="ddState"]').change(function () {
        $('#ddlCity').empty();
        $.ajax({
            type: "GET",
            url: "/API/ManageUser/GetCity",
            headers: { "Authorization": "Bearer " + accessToken },
            contentType: "application/json; charset=utf-8",
            data: { stateid: $('#ddState option:selected').val() },
            async: false,
            dataType: "json",
            success: function (response) {
                $("#ddlCity").append('<option disabled selected="selected" value="-1">--Select City--</option>');
                for (var i = 0; i < response.length; i++) {
                    $("#ddlCity").append($("<option/>").val(response[i].value).text(response[i].text));
                }
                $('#ddlCity').select2({ dropdownParent: $('#ddlCityprnt') });
            },
        });
    });



    //Request IndustryType 
    $.ajax({
        type: "GET",
        url: BaseUrl + "GetAllOfficeTypeDropdwn",
        headers: { "Content-Type": "application/json", "Accept": "application/json", "Authorization": "Bearer " + accessToken },
        contentType: "application/json; charset=utf-8",
        data: "",
        async: false,
        success: function (response) {
            $("#ddlOfficeType").append('<option selected="selected" value="-1">--Select Office Type--</option>');
            for (var i = 0; i < response.length; i++) {
                $("#ddlOfficeType").append($("<option/>").val(response[i].officeTypeId).text(response[i].officeType));
            }
        
        },
    });

    $.ajax({
        type: "GET",
        url: BaseUrl + "GetAllIndustryTypeDropdwn",
        headers: { "Content-Type": "application/json", "Accept": "application/json", "Authorization": "Bearer " + accessToken },
        contentType: "application/json; charset=utf-8",
        data: "",
        async: false,
        success: function (response) {

            $("#ddlIndustryType").empty();
            $("#ddlIndustryType").append('<option selected="selected" value="-1">--Select Industry Type--</option>');
            for (var i = 0; i < response.length; i++) {
                $("#ddlIndustryType").append($("<option/>").val(response[i].value).text(response[i].text));
            }
           
        },
    });

    // For Bind List Of Risk Type
    $.ajax({
        type: "GET",
        url: "/API/ManageLead/GetAllRiskTypeDropdwn",
        headers: { "Content-Type": "application/json", "Accept": "application/json", "Authorization": "Bearer " + accessToken },
        contentType: "application/json; charset=utf-8",
        data: "",
        async: false,
        success: function (response) {
        
            $("#ddlIndustRiskType").empty();
            $("#ddlIndustRiskType").append('<option selected="selected" value="-1" selected>--Select Risk Type--</option>');
            for (var i = 0; i < response.length; i++) {
                $("#ddlIndustRiskType").append($("<option/>").val(response[i].value).text(response[i].text));
            }
        },
    });

    //This Will Give Action List Of FollowUp, Added By Faiz
    $.ajax({
        type: "GET",
        url: BaseUrl + "GetAllActionDropdwn",
        headers: { "Content-Type": "application/json", "Accept": "application/json", "Authorization": "Bearer " + accessToken },
        contentType: "application/json; charset=utf-8",
        data: "",
        async: false,
        success: function (response) {

            $("#ddlAction").empty();
            $("#ddlAction").append('<option selected="selected" value="-1">--Select Action--</option>');
            for (var i = 0; i < response.length; i++) {
                $("#ddlAction").append($("<option/>").val(response[i].value).text(response[i].text));
            }
            $('#ddlAction').select2({ dropdownParent: $('#modal_followup_tbl') });
        },
    });

    $.ajax({
        type: "GET",
        url: BaseUrl + "GetAllFollowupStatusDropdwn",
        headers: { "Content-Type": "application/json", "Accept": "application/json", "Authorization": "Bearer " + accessToken },
        contentType: "application/json; charset=utf-8",
        data: "",
        async: false,
        success: function (response) {

            $("#ddlFollowupStatus").empty();
            $("#ddlFollowupStatus").append('<option selected="selected" value="-1">--Select Follow Up Status--</option>');
            for (var i = 0; i < response.length; i++) {
                //alert(response[i].value);
                $("#ddlFollowupStatus").append($("<option/>").val(response[i].value).text(response[i].text));
            }
            $('#ddlFollowupStatus').select2({ dropdownParent: $('#modal_view_takeFollowupAction_tbl') });
            //$('#ddlFollowupStatus').select2();
            $("#ddlFollowupStatus").val('1').trigger('change.select2');
        },
    });


    $("#btnUpdate").hide();
    $("#btnSubmit").show();


    // ✅ Download button
    $("#btnDownloadCustomLog").off("click").on("click", function () {
        const $modal = $("#customUploadModal");
        const fileName = "SkippedRows_Log.txt"; // or extract dynamically if multiple logs
        window.location.href = `/API/ManageLead/DownloadLog?fileName=${fileName}`;

        setTimeout(function () {
            $modal.fadeOut(200);
        }, 1000);
    });



    // ✅ Close modal (X or button)
    $("#btnCloseCustomModal, #closeCustomModal").off("click").on("click", function () {
        $modal.fadeOut(200);
    });

    // ✅ Close on outside click
    $(window).off("click").on("click", function (e) {
        if ($(e.target).is($modal)) {
            $modal.fadeOut(200);
        }
    });
}

function showCustomModal(logFilePath) {
    const $modal = $("#customUploadModal");
    $modal.fadeIn(200).css("display", "flex"); // smooth animation


}



function BiendAllCities() {

    $.ajax({
        type: "GET",
        url: "/API/ManageUser/GetCity",
        headers: { "Content-Type": "application/json", "Accept": "application/json", "Authorization": "Bearer " + accessToken },
        contentType: "application/json; charset=utf-8",
        data: "",
        async: false,
        success: function (response) {

            $("#ddlCity").empty();
            $("#ddlCity").append('<option selected="selected" value="-1">--Select City--</option>');
            for (var i = 0; i < response.length; i++) {
                $("#ddlCity").append($("<option/>").val(response[i].value).text(response[i].text));
            }
            $('#ddlCity').select2({ dropdownParent: $('#ddlCityprnt') });
        },
    });
}

//TO Showing Active Menu in Menu bar
function ShowActiveMenu() {
    OpenMenuBar("liManageLead", "", "", "li_Lead");
}
//Show page Breadcrumb
function ShowBreadCrumb() {
    $('#pageTitle').html('Manage Lead');
    $('#breadcrumb-customs').html('<a href="#!" class="breadcrumb">Lead Management</a><a href="#!" class="breadcrumb">Manage Lead</a>');
    $('#pageTitle').html(
        '<a class="link" href="../CRM/LeadReport.aspx">Manage Lead Report</a> || ' +
        '<a class="link" href="../CRM/FollowUp.aspx">FollowUp</a>  ||  ' +
        '<a class="link" href="../CRM/ProdecutRequirements.aspx">Manage Product</a>  '
    );
}

function validation_ddlCity() {
    $(".lblerr_ddlCity").empty();
    if ($('#ddlCity option:selected').val() == "-1") {
        $(".lblerr_ddlCity").text("City is required").fadeIn(1000);
    }
    else {
        $(".lblerr_ddlCity").text("City is required").fadeOut(1000);
    }
}

function checkClientExist(clientName) {

    var formdata = new FormData();
    formdata.append('txtClientName', clientName);

    $.ajax({
        type: "POST",
        url: BaseUrl + "checkClientExist",
        contentType: "application/json; charset=utf-8",
        headers: { "Authorization": "Bearer " + accessToken },
        data: formdata,
        contentType: false,
        processData: false,
        success: function (response) {

            if (response == "0") {
                isClientExist = false;
                $(".txtClientName").text("").fadeOut(1000);
            }
            else {
                isClientExist = true;
                $(".txtClientName").text("Client already exists !").fadeIn(1000);;
            }
        },
    });
}

function validation_ddlStatus() {
    $(".lblerr_ddlStatus").empty();
    if ($('#ddlStatus option:selected').val() == "-1") {
        $(".lblerr_ddlStatus").text("Lead Status is required").fadeIn(1000);
    }
    else {
        $(".lblerr_ddlStatus").text("Lead Status is required").fadeOut(1000);
    }
}
function validation_ddlOfficeType() {
    //$(".lblerr_ddlOfficeType").empty();
    if ($('#ddlOfficeType option:selected').val() == "-1") {
        $(".lblerr_ddlOfficeType").text("Office Type is required").fadeIn(1000);
    }
    else {
        $(".lblerr_ddlOfficeType").text("Office Type is required").fadeOut(1000);
    }
}

function validation_ddlLeadSource() {
    $("#lblerr_ddlLeadSource").empty();
    if ($('#ddlLeadSource option:selected').val() == "-1") {
        $(".lblerr_ddlLeadSource").text("Lead Source is required").fadeIn(1000);
    }
    else {
        $(".lblerr_ddlLeadSource").text("Lead Source is required").fadeOut(1000);
    }
}

function validation_ddlStage() {
    $(".lblerr_ddlStage").empty();
    if ($('#ddlStage option:selected').val() == "-1") {
        $(".lblerr_ddlStage").text("Stage is required").fadeIn(1000);
    }
    else {
        $(".lblerr_ddlStage").text("Stage is required").fadeOut(1000);
    }
}

function validation_ddlCompanySize() {
    $("#lblerr_ddlCompanySize").empty();
    if ($('#ddlCompanySize option:selected').val() == "-1") {

        $(".lblerr_ddlCompanySize").text("Company Size is required").fadeIn(1000);
    }
    else {
        $(".lblerr_ddlCompanySize").text("Company Size is required").fadeOut(1000);
    }
}

function validation_ddlAssignTo() {
    $("#lblerr_ddlAssignTo").empty();
    if ($('#ddlAssignTo option:selected').val() == "-1") {
        $(".lblerr_ddlAssignTo").text("AssignTo is required").fadeIn(1000);
    }
    else {
        $(".lblerr_ddlAssignTo").text("AssignTo is required").fadeOut(1000);
    }
}

function validation_ddlIndustryType() {

    $("#lblerr_ddlIndustryType").empty();
    if ($('#ddlIndustryType option:selected').val() == "-1") {
        $(".lblerr_ddlIndustryType").text("Industry Type is required").fadeIn(1000);
    }
    else {
        $(".lblerr_ddlIndustryType").text("").fadeOut(1000);
    }
}

//For Creating New Lead
function CreateLead(action) {


    if (isClientExist) {
        $(".txtClientName").text("Client already exists !");
        return;
    } else {
        $(".txtClientName").text("");
        isClientExist = false;
    }

    if ($("#dateProposalDate").val() == "") {
        $(".error_dateProposalDate").text("Please Select Proposal Date!");
        return;
    }
    else {
        $(".error_dateProposalDate").text("");
    }

    var formdata = new FormData();
    formdata.append('txtClientName', $("#txtClientName").val());
    formdata.append('txtContactName', $("#txtContactName").val());
    formdata.append('txtDesignation', $("#txtDesignation").val());
    formdata.append('txtDepartment', $("#txtDepartment option:selected").val());
    formdata.append('txtMobile', $("#txtMobile").val());
    formdata.append('txtAddress', $("#txtAddress").val());
    formdata.append('txtArea', $("#txtArea").val());
    formdata.append('txtPinCode', $("#txtPinCode").val());
    formdata.append('txtWebsite', $("#txtWebsite").val());
    formdata.append('txtLandline', $("#txtLandline").val());
    formdata.append('txtBusinessAmount', $("#SumOfServices").val());
    formdata.append('txtCurrentVendor', $("#txtCurrentVendor").val());
    formdata.append('txtRemark', $("#txtRemark").val());
    formdata.append('txtEmail', $("#txtEmail").val());
    formdata.append('txtTelephone', $("#txtTelephone").val());

    // Dropdowns
    formdata.append('ddlOfficeType', $("#ddlOfficeType option:selected").val());
    formdata.append('ddlCity', $("#ddlCity option:selected").val());
    formdata.append('ddState', $("#ddState option:selected").val());
    formdata.append('ddlStatus', $("#ddlStatus option:selected").val());
    formdata.append('LeadGivenBy', $("#ddlLeadSource").val());
    formdata.append('ddlStage', $("#ddlStage option:selected").val());
    formdata.append('ddlAssignTo', $("#ddlAssignTo option:selected").val());
    formdata.append('ddlCompanySize', $("#ddlCompanySize option:selected").val());
    formdata.append('ddlIndustryType', $("#ddlIndustryType option:selected").val());
    formdata.append('ddlIndustRiskType', $("#ddlIndustRiskType option:selected").val());

    // Lead Details
    formdata.append('txtCompName', $("#txtCompName").val());
    formdata.append('txtCompDesig', $("#txtCompDesig").val());
    formdata.append('txtCompAddre', $("#txtCompAddre").val());
    formdata.append('txtContact', $("#txtContact").val());

    formdata.append('txtSercharge', $("#txtSercharge").val());
    formdata.append('txtFacilitydetails', $("#txtFacilitydetails").val());

    formdata.append('DeviceType', 1); // Web

    // Dates
    formdata.append('RenewalDate', $("#RenewalDate").val());
    formdata.append('dateProposalDate', $("#dateProposalDate").val());
    formdata.append('dateCompanyProfileDate', $("#dateCompanyProfileDate").val());

    formdata.append('txtIndustryTypeRemark', $("#txtIndustryTypeRemark").val().trim());
    formdata.append('txtOfficeTypeRemark', $("#txtOfficeTypeRemark").val().trim());

    $.ajax({
        type: "POST",
        url: BaseUrl + "CreateLead",
        headers: { "Authorization": "Bearer " + accessToken },
        data: formdata,
        contentType: false,
        processData: false,
        success: function (response) {
            $('.preloader').hide();
            if (response != null && response !== "") {
                if (response.split('#')[1].trim() == "1") {
                    toastr.success(response.split('#')[0].trim());

                    LeadReturnId = response.split('#')[2].trim();
                    SendProductData(1);
                    SendClntContractData(1);
                    GetSalesDashboardDataLeadWise();
                    $("#modal_view_takeAction_tbl").modal('close');
                } else {
                    toastr.error(response.split('#')[0].trim());
                    $("#modal_view_takeAction_tbl").modal('close');
                }
            } else {
                toastr.error('Server Error! Please try again later.');
            }
        },
        error: function (xhr, status, error) {
            console.error("Error:", error);
            toastr.error("Request failed. Please check your connection or try again.");
        }
    });

    $("#modal_emp_tbl_admin").modal("close");
}



function GetLeadList(action) {
    //alert("GetLeadList");
    $('.preloader').show();
    var formdata = new FormData();
    formdata.append("IsOpportunity", 0);
    formdata.append("ActionNo", 2);
    $.ajax({
        type: "POST",
        url: BaseUrl + "GetLeadList",
        headers: { "Authorization": "Bearer " + accessToken },
        data: formdata,
        dataType: "json",
        processData: false,
        contentType: false,
        beforeSend: function () {
            $('#table').empty();
        },
        success: function (response) {

            $('.preloader').hide();
            var getData = $.parseJSON(response);
            $('#div_Dept_tbl').empty();
            if (getData.length > 0) {
                $('#div_Dept_tbl').append("<table id='Branch_tbl' class='responsive-table display withrowstrap' style='width:100%' >" +
                    "<thead class='fixed_header'><tr>" +
                    "<th class='noExport'>Sr.</th>" +
                    // "<th>LeadId</th>" +
                    "<th>EquiryCode</th>" +
                    //"<th>LeadCode</th>" +
                    "<th>Lead Date</th>" +
                    /*  "<th>Status</th>" +*/
                    "<th>Client Name</th>" +
                    //"<th>Office Type</th>" +
                    "<th>Contact Person</th>" +
                    //"<th>Location</th>" +
                    "<th>Stage</th>" +
                    "<th>AssignTo</th>" +
                    "<th>DeviceType</th>" +




                    "<th class='noExport'>Action</th>" +
                    "</tr></thead>");
                $('#Branch_tbl').append("<tbody class='dataTables_scrollBodyEnq'>");
                for (var j = 0; j < getData.length; j++) {
                    var color = "";

                    if (getData[j].LeadStageName == "Lead") {
                        color = "linear-gradient(108.7deg, rgba(34, 219, 231, 1) -0.9%, rgba(52, 118, 246, 1) 88.7%) !important;";
                    } else if (getData[j].LeadStageName == "Pipeline") {
                        color = "linear-gradient(109.6deg, rgba(247, 108, 243, 1) 11.2%, rgba(173, 64, 254, 1) 100.2%) !important;";
                    } else if (getData[j].LeadStageName == "Meeting Done") {
                        color = "radial-gradient(circle 711px at 21% 79%, rgba(0, 189, 157, 1) 0%, rgba(0, 231, 192, 0.45) 90%) !important;";
                    } else if (getData[j].LeadStageName == "Negotiation") {
                        color = "radial-gradient(circle farthest-corner at 10% 20%, rgba(246, 139, 31, 1) 0%, rgba(246, 103, 103, 1) 90.1%) !important;";
                    } else if (getData[j].LeadStageName == "Agreenent") {
                        color = "aqua";
                    } else if (getData[j].LeadStageName == "Won") {
                        color = "burlywood"; // Correct color name
                    } else if (getData[j].LeadStageName == "Lost") {
                        color = "darkorange";
                    } else {
                        color = "blue"; // Fallback color
                    }

                    $('#Branch_tbl').append("<tr>" +
                        "<td>" + j + 1 + "</td>" +
                        "<td id='LeadId'><span title='" + getData[j].LeadCode + "'>" + getData[j].LeadCode + "</span></td>" +
                        "<td id='CreatedAt'><span title='" + getData[j].CreatedAt + "'>" + getData[j].CreatedAt + "</span></td>" +
                        "<td id='ClientName'><a href='#' onclick='ViewDetails(\"" + getData[j].ClientName + "#" + getData[j].ContactNo + "#" + getData[j].Designation + "#" + getData[j].Email + "#" + getData[j].Mobile + "#" + getData[j].Telephone + "#" + getData[j].Address + "#" + getData[j].Area + "#" + getData[j].Pincode + "#" + getData[j].City + "#" + getData[j].LeadStatusName + "#" + getData[j].RenewalDate + "#" + getData[j].LeadSourceName + "#" + getData[j].LeadStageName + "#" + getData[j].NameIndustry + "#" + getData[j].Website + "#" + getData[j].BusinessAmount + "#" + getData[j].CompanySize + "#" + getData[j].BuddyAccompanied + "#" + getData[j].CurrentVendor + "#" + getData[j].Remark + "#" + getData[j].ProposalDate + "#" + getData[j].CompanyProfileDate + "#" + getData[j].ExpectedClosureDate + "#" + getData[j].RenewalDate + "#" + getData[j].LeadId + "#" + getData[j].OpportunityName + "#" + getData[j].FullName + "#" + getData[j].LeadCode + "#" + getData[j].OfficeType + "#" + getData[j].Landline + "\");'>" + getData[j].ClientName + "</a></td>" +
                       
                        "<td id='ContactNo'><span title='" + getData[j].ContactNo + "'>" + getData[j].ContactNo + "</span></td>" +
                        "<td id='LeadStageName' style='background:" + color + "'><span   title='" + getData[j].LeadStageName + "'>" + getData[j].LeadStageName + "</span></td>" +
                        "<td id='FullName'><span title='" + getData[j].FullName + "'>" + getData[j].FullName + "</span></td>" +
                        "<td id='DeviceType'><span title=' '>" + (getData[j].DeviceType == "1" ? "Website" : "Mobile") + "</span></td>" +
                        "<td><a href='#' onclick='ViewBeforeUpdate(\"" + getData[j].LeadId + "\");'>Update</a>" +
                        "</tr>");
                }
                $('#Branch_tbl').append(table);
                $('#Branch_tbl').append("</tbody>");
                $('#div_Dept_tbl').append("</table>");
            } else {
                $('#div_Dept_tbl').append("<table id='Branch_tbl' class='compact row-border order-column withrowstrap' cellspacing='0' width='100%' >" +
                    "<thead><tr>" +
                    "<th class='noExport'>Sr.</th>" +
                    "<th>LeadId</th>" +
                    "<th>Lead Date</th>" +
                    "<th>Status</th>" +
                    "<th style='text-align: center;'>Client Name</th>" +
                    "<th>Contact Person</th>" +
                    //"<th>Location</th>" +
                    "<th>Stage</th>" +
                    "<th>AssignTo</th>" +
                    "<th>DeviceType</th>" +
                    "<th class='noExport'>Action</th>" +
                    "</tr></thead>");
                $('#Branch_tbl').append(table);
                $('#Branch_tbl').append("</tbody>");
                $('#div_Dept_tbl').append("</table>");
            }

            var table = $('#Branch_tbl').DataTable({
                "pageLength": 100,
                "columnDefs": [{
                    "searchable": false,
                    "orderable": false,
                    "targets": [0]
                }],
                'order': [[0, 'desc']],
                dom: 'Bfrtip',
                buttons: [
                    {
                        extend: 'excelHtml5',
                        title: 'Lead Details'
                    },
                    {
                        extend: 'print',
                        title: 'Lead Details'
                    },
                ]
            });
            table.on('order.dt search.dt', function () {
                table.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
                    cell.innerHTML = i + 1;
                });
            }).draw();
            $('.dataTables_wrapper .dataTables_filter input').attr('placeholder', 'Search...');
        },
    });
    $("#main-container").hide();

}

function ViewBeforeUpdate(data) {

    data = data.toString()
    ResetThings();
    BiendAllCities();
    extcardfront = "";
    extcardback = "";

    $(".comments-section").show();

    var formdata = new FormData();
    var detail = data.split("#");
    LeadId = detail[0];
    formdata.append('LeadId', LeadId);

    $.ajax({
        type: "POST",
        url: BaseUrl + "GetAllProductByLead",
        headers: { "Authorization": "Bearer " + accessToken },
        contentType: "application/json; charset=utf-8",
        data: formdata,
        processData: false,
        contentType: false,
        success: function (response) {
            if (response) {
                for (var i = 0; i < response.length; i++) {
                    if (i == 0) {

                        GetProductDropdwn("ddlProductRequierment_" + i);
                        GetAllRateTypeDropdwn("ddlRateType_" + i);
                        GetAllStateDropdwn("ddlState_" + i);
                        //GetAllRatePerCatDropdwn("ddlRatePerCat_" + i);
                        $('#ddlProductRequierment_' + i).val(response[i].productid);
                        //$('#ddlState_' + i).val(response[i].stateid);
                        $('#ddlState_' + i).val(response[i].stateid).trigger('change');
                        $('#ddlRateType_' + i).val(response[i].ratetype);
                        $('#ddlRatePerCat_' + i).val(response[i].ratepercat);
                        $('#txtProductRequiermentQuantity_' + i).val(response[i].quantity);
                        $('#txtProductRequiermentValue_' + i).val(response[i].value);
                    }
                    else {
                        $('#tempnewtable').append("<tr>" +
                            "<td>" + i + "</td>" +
                            "<td><div class='input-field col s12 m6 l4' style='width: 100%'>" +
                            "<select id='ddlProductRequierment_" + i + "' class='browser-default producttype'  style='width: 220px; height:40px;' name='ddlProduct'>" +
                            "</select>" +
                            "<span id='lblerr_ProductRequierment_" + i + "' style='color: red;'></span>" +
                            "</div></td>" +

                            "<td><div class='input-field col s12 m6 l4' style='width: 100%'>" +
                            //  "<label for='txtProductRequiermentQuantity_" + i + "'>Quantity</label>" +
                            "<input type='text' id='txtProductRequiermentQuantity_" + i + "' class='quantity' onchange='CalcRatePerCatValue(" + i + ");' />" +
                            "<span id='lblerr_ProductRequiermentQuantity_" + i + "' style='color: red;'></span>" +
                            "</div><div style='width: 100%'></div></td>" +

                            "<td><div class='input-field col s12 m6 l4' style='width: 100%'>" +
                            "<select id='ddlState_" + i + "' class='browser-default Pdstate' name='ddlProduct' onchange='ddlProductRequierment();' searchable='' style='width:220px; height:40px;'>" +
                            "</select>" +
                            "<span id='lblerr_ddlState_" + i + "' style='color: red;'></span>" +
                            "</div></td>" +

                            "<td><div class='input-field col s12 m6 l4' style='width: 100%'>" +
                            "<select id='ddlRateType_" + i + "' class='browser-default prdratetype' name='ddlProduct' onchange='ddlProductRequierment(); searchable='' style='width:220px; height:40px;'>" +
                            "</select>" +
                            "<span id='lblerr_ddlRateType_" + i + "' style='color: red;'></span>" +
                            "</div></td>" +

                            "<td><div class='input-field col s12 m6 l4' style='width: 100%'>" +
                            "<input type='text' placeholder=' ' id='ddlRatePerCat_" + i + "' class='prdratecat' onchange='CalcRatePerCatValue(" + i + ");'>" +
                            "<span id='lblerr_ddlRatePerCat_" + i + "' style='color: red;'></span>" +
                            "</div></td>" +

                            "<td><div class='input-field col s12 m6 l4' style='width: 100%'>" +
                            // "<label for='txtProductRequiermentValue_0" + i + "'>Value</label>" +
                            "<input type='text' id='txtProductRequiermentValue_0" + i + "' class='value' onchange='CalcRatePerCatValue(" + i + ");' disabled />" +
                            "<span id='lblerr_ProductRequiermentValue_0" + i + "' style='color: red;'></span>" +
                            "</div><div style='width: 100%'></div></td>" +

                            "<td>" + "<span class='rem'><a href='javascript:void(0);' style='font-weight:500;color:red'>X</span>" +
                            "</td>" +
                            "</tr>");

                        GetProductDropdwn("ddlProductRequierment_" + i);
                        GetAllRateTypeDropdwn("ddlRateType_" + i);
                        GetAllStateDropdwn("ddlState_" + i);
                        //GetAllRatePerCatDropdwn("ddlRatePerCat_" + i);
                        $("#ddlProductRequierment_" + i).val(response[i].productid).trigger('change');
                        $('#ddlState_' + i).val(response[i].stateid).trigger('change');
                        $('#ddlRateType_' + i).val(response[i].ratetype);
                        $('#ddlRatePerCat_' + i).val(response[i].ratepercat);
                        $("#txtProductRequiermentQuantity_" + i).val(response[i].quantity);
                        $("#txtProductRequiermentValue_" + i).val(response[i].value);

                    } $(".rem").click(function () {
                        $(this).parents("tr").remove();
                        var cn = 1;
                        $("#tempnewtable tr").each(function () {
                            $(this).find("td:first").text(cn);
                            cn++;
                        });
                        GetSummOfSerivceValues(this);
                    });
                }
                count = $("#desgAndnumber tbody tr").length - 1;
            }
        }, error: function (xhr, status, error) {
            console.log("AJAX error:", status, error);
            console.log("Response Text:", xhr.responseText);
        }
    });

    ////For Feeding ClientPOSTtact Details
    $.ajax({
        type: "POST",
        url: BaseUrl + "GetAllClntContDetailsByLead",
        headers: { "Authorization": "Bearer " + accessToken },
        contentType: "application/json; charset=utf-8",
        data: formdata,
        processData: false,
        contentType: false,
        success: function (response) {

            if (response.length > 0) {
                for (var k = 0; k < response.length; k++) {
                    if (k == 0) {
                        console.log(response);
                        GetDepartmentDropdwn("txtCDepartment_" + k);
                        $('#txtContPersName_' + k).val(response[k].clintName).trigger('change');
                        $('#txtCDesignation_' + k).val(response[k].designation).trigger('change');
                        $('#txtCDepartment_' + k).val(response[k].department).trigger('change');
                        $('#txtEmail_' + k).val(response[k].email).trigger('change');
                        $('#txtMobile_' + k).val(response[k].mobile).trigger('change');
                        $('#txtLocation_' + k).val(response[k].location).trigger('change');
                    }
                    else {
                        $('#ClntCntrcttable').append("<tr>" +
                            "<td>" + k + "</td>" +
                            "<td><div class='input-field col s12 m6 l4' style='width: 100%'>" +
                            "<input type='text' placeholder = '' id='txtContPersName_" + k + "' class='cname'>" +
                            "<span id='lblerr_txtContPersName_" + k + "' style='color: red;'></span>" +
                            "</div></td>" +

                            "<td><div class='input-field col s12 m6 l4' style='width: 100%'>" +
                            "<input type='text' placeholder = '' id='txtCDesignation_" + k + "' class='cdesig'>" +
                            "<span id='lblerr_txtCDesignation_" + k + "' style='color: red;'></span>" +
                            "</div></td>" +

                            "<td><div class='input-field col s12 m6 l4' style='width: 100%'>" +
                            "<select id='txtCDepartment_" + k + "' class='browser-default cdept' style='width: 280px; height: 30px'>" +
                            "</select>" +
                            "<span id='lblerr_txtCDepartment_" + k + "' style='color: red;'></span>" +
                            "</div></td>" +

                            "<td><div class='input-field col s12 m6 l4' style='width: 100%'>" +
                            "<input type='text' placeholder = '' id='txtEmail_" + k + "' class='cemail'>" +
                            "<span id='lblerr_txtEmail" + k + "' style='color: red;'></span>" +
                            "</div></td>" +

                            "<td><div class='input-field col s12 m6 l4' style='width: 100%'>" +
                            "<input type='text' placeholder = '' id='txtMobile_" + k + "' class='cmobile'>" +
                            "<span id='lblerr_txtMobile_" + k + "' style='color: red;'></span>" +
                            "</div></td>" +

                            "<td><div class='input-field col s12 m6 l4' style='width: 100%'>" +
                            "<input type='text' placeholder = '' id='txtLocation_" + k + "' class='clocat'>" +
                            "<span id='lblerr_txtLocation_" + k + "' style='color: red;'></span>" +
                            "</div></td>" +

                            "<td><span class='rem1'><a href='javascript:void(0);' style='font-weight:500;color:red'>X</span>" +
                            "</td></tr>");

                        GetDepartmentDropdwn("txtCDepartment_" + k);
                        $('#txtContPersName_' + k).val(response[k].clintName).trigger('change');
                        $('#txtCDesignation_' + k).val(response[k].designation).trigger('change');
                        $('#txtCDepartment_' + k).val(response[k].department).trigger('change');
                        $('#txtEmail_' + k).val(response[k].email).trigger('change');
                        $('#txtMobile_' + k).val(response[k].mobile).trigger('change');
                        $('#txtLocation_' + k).val(response[k].location).trigger('change');

                        ///Added By Faiz --At 26/02/2021
                        $(".rem").click(function () {
                            $(this).parents("tr").remove();
                            var cn = 1;
                            $("#tempnewtable tr").each(function () {
                                $(this).find("td:first").text(cn);
                                cn++;
                            });
                            GetSummOfSerivceValues(this);
                        });

                        $(".rem1").click(function () {
                            $(this).parents("tr").remove();
                            var cn = 1;
                            $("#ClntCntrcttable tr").each(function () {
                                $(this).find("td:first").text(cn);
                                cn++;
                            });
                        });
                    }
                }
                GetSummOfSerivceValues(this);
                count1 = $("#ClntCntrcttable tbody tr").length - 1;
            }
        },
    });

    ////For Setting Data Of Upper Main Part Of Lead
    // alert("LeadId=" + LeadId);
    // formdata.append('LeadId', LeadId);
    $.ajax({
        type: "POST",
        url: BaseUrl + "GetLeadListViewUpdate",
        headers: { "Authorization": "Bearer " + accessToken },
        contentType: "application/json; charset=utf-8",
        data: formdata,
        processData: false,
        contentType: false,
        beforeSend: function () {
        },
        success: function (response) {
            var getData = $.parseJSON(response);
            $("#ldstatus").html('');
            SetStatusColor(getData[0].LeadStatusCode);  //For Set Color As Per Status
            $("#ldstatus").html(getData[0].LeadStatusName);
            $('#txtClientName').val(getData[0].ClientName);
            $('#txtContactName').val(getData[0].ContactNo);
            $('#txtDesignation').val(getData[0].Designation);
            $('#txtDepartment').val(getData[0].Department).trigger('change.select2');
            $('#txtEmail').val(getData[0].Email);
            $('#txtMobile').val(getData[0].Mobile);
            $('#txtTelephone').val(getData[0].Telephone);
            $('#txtLandline').val(getData[0].Landline);
            $('#txtAddress').val(getData[0].Address);
            $('#txtArea').val(getData[0].Area);
            $('#txtPinCode').val(getData[0].Pincode);
            $('#txtWebsite').val(getData[0].Website);
            $('#txtBusinessAmount').val(getData[0].BusinessAmount);
            $('#SumOfServices').val(getData[0].BusinessAmount);
            //  $('#txtBuddyAccompanied').val(getData[0].BuddyAccompanied);
            $('#txtCurrentVendor').val(getData[0].CurrentVendor);
            $('#txtRemark').val(getData[0].Remark);
            if (getData[0].StateId == "" || getData[0].StateId == null || getData[0].StateId == "-1") {
                $('#ddState').val('-1').trigger('change.select2');
            } else {
                $('#ddState').val(getData[0].StateId).trigger('change.select2');
            }
            if (getData[0].CityId == "" || getData[0].CityId == null || getData[0].CityId == "-1") {
                $('#ddlCity').val('-1').trigger('change.select2');
            } else {
                $('#ddlCity').val(getData[0].CityId).trigger('change.select2');
            }


            $("#CodeAtTop").html(getData[0].LeadCode).css("color", "green"); // Added by akhilesh pal
            $('#ddlStatus').val(getData[0].LeadStatusId).trigger('change.select2'); //alert($('#ddlStatus option:selected').val(getData[0].LeadStatusId).text());
            $('#ddlOfficeType').val(getData[0].OfficeType).trigger('change.select2');
            $('#ddlLeadSource').val(getData[0].LeadSourceId).trigger('change.select2');
            $('#ddlStage').val(getData[0].LeadStageId).trigger('change.select2');
            $('#ddlCompanySize').val(getData[0].CompanySize).trigger('change.select2');
            $('#ddlIndustryType').val(getData[0].IndustryTypeId).trigger('change.select2');
            $('#ddlIndustRiskType').val(getData[0].RiskTypeId).trigger('change.select2');
            $('#RenewalDate').val(getData[0].RenewalDate).trigger('change');
            $('#dateProposalDate').val(getData[0].ProposalDate);
            $('#dateProposalDate').trigger('change');
            $('#dateCompanyProfileDate').val(getData[0].CompanyProfileDate).trigger('change');
            $('#dateExpectedClosureDate').val(getData[0].ExpectedClosureDate).trigger('change');

            $('#ddlAssignTo').val(getData[0].AssingTo).trigger('change');

            //  $('#txtOpportunityValue').val(getData[0].OpportunityValue);
            $('#txtOpportunityName').val(getData[0].OpportunityName);

            //Lead Details Extra
            $("#txtCompName").val(getData[0].CmpClntName);
            $("#txtCompDesig").val(getData[0].CmpClntDesignation);
            $("#txtCompAddre").val(getData[0].CmpClntAddress);
            $("#txtContact").val(getData[0].CmpClntContact);

            $("#txtSercharge").val(getData[0].ServiceCharge);
            $("#txtFacilitydetails").val(getData[0].FacilityOffered);

            if (getData[0].IndustryTypeId == 33) {
                $("#IndustryTypeRemark").show();
                $(".dynamicWidth").removeClass("l4").addClass("l3");
                $("#txtIndustryTypeRemark").val(getData[0].IndustryTypeRemark);
            }
            else {
                $("#IndustryTypeRemark").hide();
                $(".dynamicWidth").removeClass("l3").addClass("l4");
                $("#txtIndustryTypeRemark").val("");
            }

            if (getData[0].OfficeType == 4) {
                $("#OfficeTypeRemarkSection").show();
                $("#txtOfficeTypeRemark").val(getData[0].OfficeTypeRemark);
            }
            else {
                $("#OfficeTypeRemarkSection").hide();
                $("#txtOfficeTypeRemark").val("");
            }
        

        },
    });

    $("#btnUpdate").show();
    $("#btnSubmit").hide();
    $("#btnAdd").html("Update");
    $("#btnAdd").attr('onclick', 'UpdateLead(this);return false;');

    GetLeadComments1(LeadId);

    $("#modal_emp_tbl_admin").css("width", "98%");
    $(".comments-section").show();
    $("#first-section-design").addClass("first-section-design");
    $("#second-section").addClass("second-section");
    $("#modal_emp_tbl_admin").modal("open");

}


function ViewForDetails(data) {


    $("#EditButton img").attr("onclick", `ViewBeforeUpdate(${data})`);
    $("#notes-save-btn").attr("onclick", `CreateNotesByLeadID(${data})`);
    $("#Save-file").attr("onclick", `UploadLeadDocs(${data})`);
    GetLeadNotes(data);
    GetDocumentsByLead(data);
    GetProductByLead(data);

    var formdata = new FormData();

    formdata.append('LeadId', data);

    $.ajax({
        type: "POST",
        url: BaseUrl + "GetLeadDataForView",
        headers: { "Authorization": "Bearer " + accessToken },
        contentType: "application/json; charset=utf-8",
        data: formdata,
        processData: false,
        contentType: false,
        beforeSend: function () {

        },
        success: function (response) {

            var getData = $.parseJSON(response);
            $("#clientName").html(getData[0].ClientName);
            $("#stageName").html(getData[0].LeadStageName);

            var shortName2 = "";
            let fullName = getData[0].ClientName.trim();
            let nameParts = fullName.split(" ");
            shortName2 = nameParts.length > 1 ? nameParts[0][0].toUpperCase() + nameParts[1][0].toUpperCase() : nameParts[0][0].toUpperCase();

            $("#comp-client-name").html(getData[0].ClientName);
            getData[0].Website = getData[0].Website == "" ? "Not Available" : getData[0].Website;
            $("#comp-web-name").html(getData[0].Website);
            $("#comp-mob-name").html(getData[0].Mobile);
            $(".profileShortName2").text(shortName2);

            var ModifiedBy = getData[0].ModifiedBy == "" ? getData[0].CreatedBy : getData[0].ModifiedBy;
            var ModifiedOn = getData[0].ModifiedDate == "" ? getData[0].CreatedAt : getData[0].ModifiedDate;
            var ModifiedTime = getData[0].ModifiedTime == "" ? getData[0].CreatedTime : getData[0].ModifiedTime;

            var CreaterName = getData[0].ModifiedBy == "" ? "Created By" : "Modified by";
            var CreatedOn = getData[0].ModifiedDate == "" ? "Created On" : "Modified On";

            $("#last-modi-on-date").html(`${CreatedOn} : <br><b>${ModifiedOn}, ${ModifiedTime}</b>`);
            $("#last-modi-by-date").html(`${CreaterName} : <br><b>${ModifiedBy}</b>`);
        }
    });


    $.ajax({
        type: "POST",
        url: BaseUrl + "GetLeadTimeLineData",
        headers: { "Authorization": "Bearer " + accessToken },
        contentType: "application/json; charset=utf-8",
        data: formdata,
        processData: false,
        contentType: false,
        beforeSend: function () {
            $("#timeline").html("");
            $('.preloader').show();
        },
        success: function (response) {
            if (response && response.length > 0) {
                let groupedData = {};
                let getData = $.parseJSON(response);

                // Group events by date
                getData.forEach(event => {
                    let date = event.TimelineDate;
                    let time = event.TimelineTime;
                    let description = event.Description;
                    let actionType = event.ActionType;
                    let icon = '';

                    // Assign an icon based on action type
                    switch (actionType) {
                        case 'Lead Created':
                            icon = '🆕';
                            break;
                        case 'Stage Updated':
                            icon = '🔄';
                            break;
                        case 'Note Created':
                            icon = '📝';
                            break;
                        case 'Note Updated':
                            icon = '✏️';
                            break;
                        case 'Document Added':
                            icon = '📂'; // Folder or document icon
                            break;
                        case 'Document Updated':
                            icon = '📄'; // Updated document icon
                            break;
                        default:
                            icon = '📌';
                    }

                    // Initialize the date key in groupedData if not already present
                    if (!groupedData[date]) {
                        groupedData[date] = [];
                    }

                    // Add event to the grouped data
                    groupedData[date].push({
                        time: time || 'N/A',
                        icon: icon,
                        details: description
                    });
                });

                // Sort dates in descending order
                const sortedDates = Object.keys(groupedData).sort((a, b) => new Date(b) - new Date(a));

                // Clear previous timeline content
                $('#timeline, #StageHistory-data-section').empty();

                if (sortedDates.length > 0) {
                    const latestDate = sortedDates[0]; // Get the latest date for blinking effect

                    // Append grouped data to the timeline
                    sortedDates.forEach(date => {
                        $('#timeline, #StageHistory-data-section').append(`
                                <div class="timeline-date ${date === latestDate ? 'blink-date' : ''}">${date}</div>
                            `);

                        groupedData[date].forEach(event => {
                            $('#timeline, #StageHistory-data-section').append(`
                                    <div class="timeline-item">
                                        <div class="timeline-time">${event.time}</div>
                                        <div class="timeline-details">
                                                    <span class="timeline-icon">${event.icon}</span>
                                                    ${event.details}
                                                </div>
                                            </div>
                                        `);
                        });
                    });
                } else {
                    $('#timeline, #StageHistory-data-section').append('<div class="no-events">No events found.</div>');
                }
            } else {
                $('#timeline, #StageHistory-data-section').html('<div class="no-events">No events found.</div>');
            }
            $('.preloader').hide();
        }
    });


    $.ajax({
        type: "POST",
        url: BaseUrl + "GetAllClntContDetailsByLead",
        headers: { "Authorization": "Bearer " + accessToken },
        contentType: "application/json; charset=utf-8",
        data: formdata,
        processData: false,
        contentType: false,
        success: function (response) {
            if (response.length > 0) {
                for (var k = 0; k < response.length; k++) {
                    var contactHtml = "";
                    var shortName = "";
                    let fullName = response[k].clintName.trim();
                    let nameParts = fullName.split(" ");
                    shortName = nameParts.length > 1 ? nameParts[0][0].toUpperCase() + nameParts[1][0].toUpperCase() : nameParts[0][0].toUpperCase();


                    contactHtml += `
            <div class="section-${k}">
                <div style="display: flex; gap: 10px; align-items: center;">
                    <div class="profileShortName">${shortName}</div>
                    <p style="font-size: 18px">${response[k].clintName}</p>
                </div>
                <div style="display: flex; gap: 10px; align-items: center; margin: 14px 10px;">
                    <img src="../Assets/images/ManageLeadImages/icons8-email-48.png" alt="" style="width: 10%;">
                        <p style="font-size: 16px">${response[k].email}</p>
                                            </div>
                    <div style="display: flex; gap: 10px; align-items: center; margin: 14px 10px;">
                        <img src="../Assets/images/ManageLeadImages/icons8-telephone-48.png" alt="" style="width: 10%;">
                            <p style="font-size: 16px">${response[k].mobile}</p>
                                             </div>
                    </div>
                    `;

                    $("#related-contact-section").html(contactHtml);

                }

            }
        },
    });

    $("#modal_emp_tbl_admin_New").modal("open");
}

function UpdateLead(action) {



    if ($("#dateProposalDate").val() == "") {
        $(".error_dateProposalDate").text("Please Select Proposal Date!");
        return;
    }
    else {
        $(".error_dateProposalDate").text("");
    }

    $('.preloader').show();

    var formdata = new FormData();
    formdata.append('txtClientName', $("#txtClientName").val());
    formdata.append('txtContactName', $("#txtContactName").val());
    formdata.append('txtDesignation', $("#txtDesignation").val());
    formdata.append('txtDepartment', $("#txtDepartment option:selected").val());
    formdata.append('txtMobile', $("#txtMobile").val());
    formdata.append('txtLandline', $("#txtLandline").val());
    formdata.append('txtAddress', $("#txtAddress").val());
    formdata.append('txtArea', $("#txtArea").val());
    formdata.append('txtPinCode', $("#txtPinCode").val());
    formdata.append('txtWebsite', $("#txtWebsite").val());
    formdata.append('txtBusinessAmount', $("#SumOfServices").val());
    formdata.append('txtCurrentVendor', $("#txtCurrentVendor").val());
    formdata.append('txtRemark', $("#txtRemark").val());
    formdata.append('txtEmail', $("#txtEmail").val());
    formdata.append('txtTelephone', $("#txtTelephone").val());

    // Dropdowns
    formdata.append('ddlCity', $("#ddlCity option:selected").val());
    formdata.append('ddState', $("#ddState option:selected").val());
    formdata.append('ddlStatus', $("#ddlStatus option:selected").val());
    formdata.append('LeadGivenBy', $("#ddlLeadSource").val());
    formdata.append('ddlStage', $("#ddlStage option:selected").val());
    formdata.append('ddlAssignTo', $("#ddlAssignTo option:selected").val());
    formdata.append('ddlCompanySize', $("#ddlCompanySize option:selected").val());
    formdata.append('ddlIndustryType', $("#ddlIndustryType option:selected").val());
    formdata.append('ddlIndustRiskType', $("#ddlIndustRiskType option:selected").val());
    formdata.append('ddlOfficeType', $("#ddlOfficeType option:selected").val());

    // Lead Details
    formdata.append('txtCompName', $("#txtCompName").val());
    formdata.append('txtCompDesig', $("#txtCompDesig").val());
    formdata.append('txtCompAddre', $("#txtCompAddre").val());
    formdata.append('txtContact', $("#txtContact").val());

    formdata.append('txtSercharge', $("#txtSercharge").val());
    formdata.append('txtFacilitydetails', $("#txtFacilitydetails").val());

    // Dates
    formdata.append('RenewalDate', $("#RenewalDate").val());
    formdata.append('dateProposalDate', $("#dateProposalDate").val());
    formdata.append('dateCompanyProfileDate', $("#dateCompanyProfileDate").val());
    formdata.append('LeadId', LeadId);

    formdata.append('txtIndustryTypeRemark', $("#txtIndustryTypeRemark").val().trim());
    formdata.append('txtOfficeTypeRemark', $("#txtOfficeTypeRemark").val().trim());
    formdata.append('updateAction', "updateLead");

    $.ajax({
        type: "POST",
        url: BaseUrl + "UpdateLead",
        headers: { "Authorization": "Bearer " + accessToken },
        data: formdata,
        processData: false,
        contentType: false,
        success: function (response) {
            $('.preloader').hide();

            if (response && response.includes('#')) {
                if (response.split('#')[1].trim() == "1") {
                    toastr.success('Lead Updated Successfully!');
                    LeadReturnId = response.split('#')[2].trim();
                    SendProductData(2);
                    SendClntContractData(2);
                    GetSalesDashboardDataLeadWise();
                } else {
                    toastr.error(response.split('#')[0].trim());
                }
            } else {
                toastr.error('Server Error! Please try again later.');
            }

            $("#btnUpdate").hide();
            $("#btnSubmit").show();
            $("#modal_emp_tbl_admin_New").modal("close");
        },
        error: function (xhr, status, error) {
            $('.preloader').hide();
            console.error("Error:", error);
            toastr.error("Update failed! Please try again.");
        },
        complete: function () {
            $("#modal_emp_tbl_admin").modal("close");
            ViewForDetails(LeadId);
        }
    });
}



function UploadExcel() {
    var formdata2 = new FormData();
    if ($("#Enquiryfile").val() !== '') {
        formdata2.append($("#Enquiryfile").get(0).files[0].name, $("#Enquiryfile").get(0).files[0]);
    }

    if (formdata2.entries.length > -1) {
        toastr.warning("Your Data Is Uploading On Server, Please Do Not Close Or Refresh The Page!");
        $('.preloader').show();

        $.ajax({
            type: "POST",
            url: "/API/ManageLead/EnquiryExcelImport",
            headers: { "Authorization": "Bearer " + accessToken },
            data: formdata2,
            async: false,
            dataType: "json",
            processData: false,
            contentType: false,
            success: function (response) {

                $('.preloader').hide();
                GetSalesDashboardDataLeadWise();
                $('#modal_BulkUpload_Enquiry').modal('close');


                if (typeof response === "string") {
                    try { response = JSON.parse(response); } catch (e) {
                        toastr.error("Invalid response format.");
                        return;
                    }
                }

                if (response.status === "success") {
                    toastr.success(response.message);
                }
                else if (response.status === "partial") {
                    showCustomModal(response.logFile);
                }
                else {
                    toastr.error(response.message || "Unknown error occurred.");
                }
            },
            error: function (xhr, status, error) {
                $('.preloader').hide();
                toastr.error("Error uploading file: " + error);
            }
        });
    }
}



function ConvertToFolloUp(action) {
    if ($("#txtOpportunityName").val() == "" || $("#dateExpectedClosureDate").val() == "") {
        if ($("#txtOpportunityName").val() == "") { $('.txtOpportunityName').text('Please Enter Name!'); }
        if ($("#dateExpectedClosureDate").val() == "") { $('.dateExpectedClosureDate').text('Please Select Date!'); }
        return;
    }
    else {
        $('.preloader').show();
        var formdata = new FormData();
        formdata.append('LeadId', LeadId);
        formdata.append('OpportunityName', $("#txtOpportunityName").val());
        formdata.append('ClosureDate', $("#dateExpectedClosureDate").val());
        $.ajax({
            type: "POST",
            url: BaseUrl + "ConvertToFolloUp",
            headers: { "Authorization": "Bearer " + accessToken },
            contentType: "application/json; charset=utf-8",
            data: formdata,
            dataType: "json",
            processData: false,
            contentType: false,
            success: function (response) {
                $('.preloader').hide();
                $('#modal_view_takeAction_tbl').modal('close');
            }
        });
    }
}

function ViewDetails(data) {
    ResetThings();
    $('#ClientName').html('');
    $('#ContactName').html('');
    $('#Designation').html('');
    $('#Email').html('');
    $('#Mobile').html('');
    $('#Telephone').html('');
    $('#Address').html('');
    $('#Area').html('');
    $('#PinCode').html('');
    $('#City').html('');
    $('#Status').html('');
    $('#RenewalDate').html('');
    $('#Source').html('');
    $('#Stage').html('');
    $('#IdustryType').html('');
    $('#Website').html('');
    $('#BusinessAmount').html('');
    $('#CompanySize').html('');
    $('#BuddyAccompanied').html('');
    $('#CurrentVendor').html('');
    $('#Remarks').html('');
    $('#ProposalDate').html('');
    $('#CompanyProfileDate').html('');
    $('#ExpectedClosureDate').html('');
    $('#AssignTo').html('');
    $('#displddt').html('');

    var details = data.split('#');

    $('#ClientName').html(details[0]);
    $('#ContactName').html(details[1]);
    $('#Designation').html(details[2]);
    $('#Email').html(details[3]);
    $('#Mobile').html(details[4]);
    $('#Telephone').html(details[5]);
    $('#Address').html(details[6]);
    $('#Area').html(details[7]);
    $('#PinCode').html(details[8]);
    $('#City').html(details[9]);
    $('#Status').html(details[10]);
    $('#RenewalDates').html(details[11]);
    $('#Source').html(details[12]);
    $('#Stage').html(details[13]);
    $('#IdustryType').html(details[14]);
    $('#Website').html(details[15]);
    $('#BusinessAmount').html(details[16]);
    if (details[17] == "1") {
        $('#CompanySize').html("Small");
    }
    if (details[17] == "2") {
        $('#CompanySize').html("Medium");
    } if (details[17] == "3") {
        $('#CompanySize').html("Large");
    }
    $('#BuddyAccompanied').html(details[18]);
    $('#CurrentVendor').html(details[19]);
    $('#Remarks').html(details[20]);
    $('#ProposalDate').html(details[21]);
    $('#CompanyProfileDate').html(details[22]);
    $('#ExpectedClosureDate').html(details[23]);

    $('#AssignTo').html(details[27]);
    $('#displddt').html(details[28]);
    $('#Landline').html(details[30]);
    LeadDocId = 0;
    LeadDocId = details[25];
    LeadId = details[25];

    $('#OpportunityName').html(details[26]);
    var formdata = new FormData();
    GetLeadComments(LeadDocId);
    ///////Display Product Details///////////

    formdata.append('LeadId', LeadId);
    $.ajax({
        type: "POST",
        url: BaseUrl + "GetAllProductByLead",
        headers: { "Authorization": "Bearer " + accessToken },
        contentType: "application/json; charset=utf-8",
        data: formdata,
        processData: false,
        contentType: false,
        success: function (response) {
            // $('#productDetailsPrint').empty();

            for (var i = 0; i < response.length; i++) {
                if (i == 0) {
                    $('#ddlProductRequierment_' + i).val(response[i].productid).trigger("change");
                    $('#txtProductRequiermentQuantityPrint_' + i).text(response[i].quantity);
                    $('#txtProductRequiermentValuePrint_' + i).text(response[i].value);
                    $('#ddlProductRequiermentPrint_' + i).text($('#ddlProductRequierment_' + i + ' option:selected').text());
                }
                else {
                    $('#tempnewtablePrint').append("<tr>" +
                        "<td>" + (i + 1) + "</td>" +
                        "<td><div class='col s12 m6 l4' style='width: 100%'>" +
                        "<label id='ddlProductRequiermentPrint_" + i + "'></label>" +
                        "</div></td>" +

                        "<td><div class='col s12 m6 l4' style='width: 100%'>" +
                        "<label id='txtProductRequiermentQuantityPrint_" + i + "'></label>" +
                        "</div></td>" +

                        "<td><div class='col s12 m6 l4' style='width: 100%'>" +
                        "<label id='txtProductRequiermentValuePrint_" + i + "'></label>" +
                        "</div></td>" +

                        "</tr>");

                    $('#ddlProductRequierment_0').val(response[i].productid); //alert('#ddlProductRequierment_' + i);
                    $('#ddlProductRequiermentPrint_' + i).text($('#ddlProductRequierment_0 option:selected').text());

                    $("#txtProductRequiermentQuantityPrint_" + i).text(response[i].quantity);
                    $("#txtProductRequiermentValuePrint_" + i).text(response[i].value);

                }
            }

            count = $("#tempnewtablePrint tbody tr").length - 1;

        },
    });

    //For Lead FollowUp Details
    GetFollowUpByLead(LeadId);

    //For Lead Document Details
    GetDocumentsByLead(LeadDocId);

    $('#modal_View').modal('open');
    ClearField();
    $('#divContactModify').empty()
    $('#divLeadModify').empty()
    $('#divClientModify').empty()
    $('#divContactModify').append('<a href="#" onclick="ViewBeforeUpdate(' + LeadDocId + ');">Modify</a>')
    $('#divLeadModify').append('<a href="#" onclick="ViewBeforeUpdate(' + LeadDocId + ');">Modify</a>')
    $('#divClientModify').append('<a href="#" onclick="ViewBeforeUpdate(' + LeadDocId + ');">Modify</a>')
}

var a;
function Show() {
    a = $("#btnAdd").html();
    if (a = info) {
        $("#btnAdd").html('Submit');
        $("#btnAdd").attr("onclick", "CreateLead(this);return false;")
    }
    $('#modal_emp_tbl_admin').find('input:text').each(function () {
        $('input:text[id=' + $(this).attr('id') + ']').val('');
    }
    );
}

function AddmoreProductsReqmt(action) {

    count++;
    let a = parseInt(count) + 1;
    $('#tempnewtable').append("<tr class='bind-new-row-" + count + "'>" +


        "<td>" + a + "</td>" +
        "<td><div class='input-field col s12 m6 l4' style='width: 100%'>" +
        "<select id='ddlProductRequierment_" + count + "' class='browser-default producttype' name='ddlProduct' onchange='ddlProductRequierment(); searchable='' style='width:220px; height:40px;'>" +
        "</select>" +
        "<span id='lblerr_ProductRequierment_" + count + "' style='color: red;'></span>" +
        "</div></td>" +

        "<td><div class='input-field col s12 m6 l4' style='width: 100%'>" +
        // "<label for='txtProductRequiermentQuantity_" + count + "'>Quantity </label>" +
        "<input type='text' placeholder='' id='txtProductRequiermentQuantity_" + count + "' class='quantity' onchange='CalcRatePerCatValue(count);'>" +
        "<span id='lblerr_ProductRequiermentQuantity_" + count + "' style='color: red;'></span>" +
        "</div></td>" +

        "<td><div class='input-field col s12 m6 l4' style='width: 100%' id='State-section-" + count + "'>" +
        "<select id='ddlState_" + count + "' class='browser-default Pdstate' name='ddlProduct' onchange='ddlProductRequierment();' searchable='' style='width:220px; height:40px;'>" +
        "</select>" +
        "<span id='lblerr_ddlState_" + count + "' style='color: red;'></span>" +
        "</div></td>" +

        "<td><div class='input-field col s12 m6 l4' style='width: 100%'>" +
        "<select id='ddlRateType_" + count + "' class='browser-default prdratetype' name='ddlProduct' onchange='ddlProductRequierment();' searchable='' style='width:220px; height:40px;'>" +
        "</select>" +
        "<span id='lblerr_ddlRateType_" + count + "' style='color: red;'></span>" +
        "</div></td>" +

        "<td><div class='input-field col s12 m6 l4' style='width: 100%'>" +
        "<input type='text' placeholder=' ' id='ddlRatePerCat_" + count + "' class='prdratecat' onchange='CalcRatePerCatValue(" + count + ");'>" +
        "<span id='lblerr_ddlRatePerCat_" + count + "' style='color: red;'></span>" +
        "</div></td>" +

        "<td><div class='input-field col s12 m6 l4' style='width: 100%'>" +
     
        "<input type='text' placeholder='' id='txtProductRequiermentValue_" + count + "' class='value' onkeypress='return isNumberSer(event)' onchange='CalcRatePerCatValue(count);' disabled>" +
        "<span id='lblerr_ProductRequiermentValue_0" + count + "' style='color: red;'></span>" +
        "</div></td>" +

        "<td>" + "<span class='rem'><a href='javascript:void(0);' style='font-weight:500;color:red'>X</span>" +
        "</td>" +
        "</tr>");
 
    GetProductDropdwn("ddlProductRequierment_" + count);
    GetAllRateTypeDropdwn("ddlRateType_" + count);
    GetAllStateDropdwn("ddlState_" + count);
   



    $(".rem").click(function () {
        $(this).parents("tr").remove();
        var cn = 1;
        $("#tempnewtable tr").each(function () {
            $(this).find("td:first").text(cn);
            cn++;
        });
        GetSummOfSerivceValues(this);
    });
}

//For Add More Client Details
function AddMoreCntrctDetails(action) {

    count1++;
    $('#ClntCntrcttable').append("<tr>" +
        "<td>" + (count1 + 1) + "</td>" +
        "<td><div class='input-field col s12 m6 l4' style='width: 100%'>" +
        "<input type='text' placeholder='' id='txtContPersName_" + count1 + "' class='cname'>" +
        "<span id='lblerr_txtContPersName_" + count1 + "' style='color: red;'></span>" +
        "</div></td>" +



        "<td><div class='input-field col s12 m6 l4' style='width: 100%' id='Department-section-" + count1 + "'>" +
        "<select id='txtCDepartment_" + count1 + "' class='browser-default cdept' style='width: 280px; height: 30px'>" +
        "</select>" +
        "<span id='lblerr_txtCDepartment_" + count1 + "' style='color: red;'></span>" +
        "</div></td>" +

        "<td><div class='input-field col s12 m6 l4' style='width: 100%'>" +
        "<input type='text' placeholder='' id='txtCDesignation_" + count1 + "' class='cdesig'>" +
        "<span id='lblerr_txtCDesignation_" + count1 + "' style='color: red;'></span>" +
        "</div></td>" +

        "<td><div class='input-field col s12 m6 l4' style='width: 100%'>" +
        "<input type='text' placeholder='' id='txtEmail_" + count1 + "' class='cemail'>" +
        "<span id='lblerr_txtEmail" + count1 + "' style='color: red;'></span>" +
        "</div></td>" +

        "<td><div class='input-field col s12 m6 l4' style='width: 100%'>" +
        "<input type='text' placeholder='' id='txtMobile_" + count1 + "' class='cmobile'>" +
        "<span id='lblerr_txtMobile_" + count1 + "' style='color: red;'></span>" +
        "</div></td>" +

        "<td><div class='input-field col s12 m6 l4' style='width: 100%'>" +
        "<input type='text' placeholder='' id='txtLocation_" + count1 + "' class='clocat'>" +
        "<span id='lblerr_txtLocation_" + count1 + "' style='color: red;'></span>" +
        "</div></td>" +

        "<td><span class='rem1'><a href='javascript:void(0);' style='font-weight:500;color:red'>X</span>" +
        "</td></tr>");
    GetDepartmentDropdwn("txtCDepartment_" + count1);

    $(".rem1").click(function () {
        $(this).parents("tr").remove();
        var cn = 1;
        $("#ClntCntrcttable tr").each(function () {
            $(this).find("td:first").text(cn);
            cn++;
        });
    });
}

function GetProductDropdwn(data) {

    var splitNumber = data.split("_")[1];

    $.ajax({  ///drop dowm list for Documents Type
        type: "GET",
        url: BaseUrl + "GetProductDropdwn",
        headers: { "Authorization": "Bearer " + accessToken },
        contentType: "application/json; charset=utf-8",
        data: "",
        async: false,
        dataType: "json",
        success: function (response) {

            $("#" + data + "").empty();
            $("#" + data + "").append('<option disabled selected="selected" value="-1">--Select Services--</option>');
            for (var i = 0; i < response.length; i++) {
                $("#" + data + "").append($("<option/>").val(response[i].value).text(response[i].text));
            }

            $(`#${data}`).select2({ dropdownParent: $('#State-section-' + splitNumber) });

        },

    });

    $(`#ddlProductRequierment_${splitNumber}`).change(function () {
        $(this).select2('close');
    });
}

function GetDepartmentDropdwn(data) {
    var splitNumber = data.split("_")[1];
    $.ajax({
        type: "GET",
        url: BaseUrl + "GetAllDepartmentDropdwn",
        headers: { "Content-Type": "application/json", "Accept": "application/json", "Authorization": "Bearer " + accessToken },
        contentType: "application/json; charset=utf-8",
        data: "",
        async: false,
        success: function (response) {
            $(`#${data}`).empty();
            $(`#${data}`).append('<option selected="selected" value="-1">--Select Department--</option>');
            for (var i = 0; i < response.length; i++) {
                /*   $(`#${data}`).append($("<option/>").val(response[i].value).text(response[i].text.split("-")[1]));*/
                $(`#${data}`).append($("<option/>").val(response[i].value).text(response[i].text));
            }
            $(`#${data}`).select2({ dropdownParent: $('#Department-section-' + splitNumber) });
        },
    });
}



function GetAllStateDropdwn(data) {
    var splitNumber = data.split("_")[1];
    $.ajax({
        type: "GET",
        url: BaseUrl + "GetPartyState",
        headers: { "Authorization": "Bearer " + accessToken },
        contentType: "application/json; charset=utf-8",
        data: "",
        async: false,
        dataType: "json",
        success: function (response) {

            $(`#${data}`).empty();
            $(`#${data}`).append('<option selected="selected" value="-1">--Select State--</option>');
            for (var i = 0; i < response.length; i++) {
                $(`#${data}`).append($("<option/>").val(response[i].value).text(response[i].text.split("-")[1]));
            }
            $(`#${data}`).select2({ dropdownParent: $('#State-section-' + splitNumber) });
        },
    });

    $(`#ddlState_${splitNumber}`).change(function () {
        $(this).select2('close');
    });
}



function GetAllRateTypeDropdwn(data) {
    $.ajax({
        type: "GET",
        url: "/API/ManageLead/GetAllRateTypeDropdwn",
        headers: { "Authorization": "Bearer " + accessToken },
        contentType: "application/json; charset=utf-8",
        data: "",
        async: false,
        dataType: "json",
        success: function (response) {
            //let response1 = JSON.parse(response)
            $("#" + data + "").empty();
            $("#" + data + "").append('<option disabled selected="selected" value="-1">--Select Rate--</option>');
            for (var i = 0; i < response.length; i++) {
                $("#" + data + "").append($("<option/>").val(response[i].value).text(response[i].text));
            }
        },

    });
}

function GetAllRatePerCatDropdwn(data) {
    $.ajax({
        type: "GET",
        url: "/API/ManageLead/GetAllRatePerCategoryDropdwn",
        headers: { "Authorization": "Bearer " + accessToken },
        contentType: "application/json; charset=utf-8",
        data: "",
        async: false,
        dataType: "json",
        success: function (response) {
            //debugger;
            //let response1 = JSON.parse(response)
            $("#" + data + "").empty();
            $("#" + data + "").append('<option disabled selected="selected" value="-1">--Select Rate--</option>');
            for (var i = 0; i < response.length; i++) {
                $("#" + data + "").append($("<option/>").val(response[i].value).text(response[i].text));
            }
        },

    });
}

function SendProductData(action) {
    var formdata1 = new FormData();
    var count = 0;
    $.each($("#tempnewtable").find('.quantity'), function () {

        var quantity = $(this).val();
        formdata1.append('quantity_' + count, quantity);
        if (quantity == "") {
            return;
        }
        count++;
    });

    count = 0;
    $.each($("#tempnewtable").find('.value'), function () {

        var value = $(this).val();
        formdata1.append('value_' + count, value);

        if (value == "") {
            return;
        }
        count++;
    });

    var count2 = 0;
    $.each($("#tempnewtable").find('.Pdstate'), function () {

        var state = $(this).val();
        var id = $(this).attr('id');
        if (state == "-1") {
            $('#' + id).text('Please Select State Type!');
            return;
        }
        formdata1.append('Stateid_' + count2, state);
        count2++;
        // alert(product);
    });

    var count2 = 0;
    $.each($("#tempnewtable").find('.prdratetype'), function () {

        var product = $(this).val();
        var id = $(this).attr('id');
        if (product == "-1") {
            $('#' + id).text('Please Select Rate Type!');
            return;
        }
        formdata1.append('Ratetypeid_' + count2, product);
        count2++;
        // alert(product);
    });

    count2 = 0;
    $.each($("#tempnewtable").find('.prdratecat'), function () {

        var ratecat = $(this).val();
        var id = $(this).attr('id');
        if (ratecat == "") {
            $('#lblerr_' + id).text('Please Enter Rate Per Category!');
            return;
        }
        formdata1.append('RatePerCatid_' + count2, ratecat);
        count2++;
    });

    count2 = 0;
    $.each($("#tempnewtable").find('.producttype'), function () {

        var product = $(this).val();
        var id = $(this).attr('id');
        if (product == "-1") {
            $('#' + id).text('Please Select Sevice!');
            return;
        }
        formdata1.append('Productid_' + count2, product);
        count2++;
    });

    formdata1.append('ListCount', count2);

    if (action == 1) {
        formdata1.append('LeadReturnId', LeadReturnId);
        formdata1.append('Action', 1);
    }
    else {
        formdata1.append('LeadReturnId', LeadReturnId);
        formdata1.append('Action', 2);
    }
    $.ajax({
        type: "POST",
        url: BaseUrl + "SendProductData",
        data: formdata1,
        headers: { "Authorization": "Bearer " + accessToken },
        dataType: 'json',
        async: false,
        contentType: false,
        processData: false,
        success: function (response) {
            var getData = $.parseJSON(response);
            if (getData != null) {
                //toastr.success("Product type added successfully!");
            }
        },
        failure: function (err) {
            toastr.error(err);
        },
    });
}

function SendClntContractData(action) {
    var formdata2 = new FormData();
    var coun3 = 0;
    $.each($("#ClntCntrcttable").find('.cname'), function () {
        var cname = $(this).val();
        formdata2.append('cname_' + coun3, cname);
        coun3++;
    });

    var count = 0;
    $.each($("#ClntCntrcttable").find('.cdesig'), function () {
        var cdesig = $(this).val();
        formdata2.append('cdesig_' + count, cdesig);
        count++;
    });

    var count = 0;
    $.each($("#ClntCntrcttable").find('.cdept'), function () {

        var cdept = $(this).val();
        var id = $(this).attr('id');
        if (cdept == "-1") {
            $('#' + id).text('Please Select Depatment Type!');
            return;
        }
        formdata2.append('cdept_' + count, cdept);
        count++;
    });

    var count = 0;
    $.each($("#ClntCntrcttable").find('.cemail'), function () {
        var cemail = $(this).val();
        formdata2.append('cemail_' + count, cemail);
        count++;
    });

    var count = 0;
    $.each($("#ClntCntrcttable").find('.cmobile'), function () {
        var cmobile = $(this).val();
        formdata2.append('cmobile_' + count, cmobile);
        count++;
    });

    var count = 0;
    $.each($("#ClntCntrcttable").find('.clocat'), function () {
        var clocat = $(this).val();
        formdata2.append('clocat_' + count, clocat);
        count++;
    });

    formdata2.append('ListCount', coun3);

    if (action == 1) {
        formdata2.append('LeadReturnId', LeadReturnId);
        formdata2.append('Action', 1);
    }
    else {
        formdata2.append('LeadReturnId', LeadReturnId);
        formdata2.append('Action', 2);
    }
    $.ajax({
        type: "POST",
        url: BaseUrl + "SendClntContractData",
        data: formdata2,
        headers: { "Authorization": "Bearer " + accessToken },
        dataType: 'json',
        async: false,
        contentType: false,
        processData: false,
        success: function (response) {
            var getData = $.parseJSON(response);
            if (getData != null) {
                //toastr.success("Product type added successfully!");
            }
        },
        failure: function (err) {
            toastr.error(err);
        },
    });
}

function CalcRatePerCatValue(data) {
    var lct = parseInt($('#ddlRatePerCat_' + data).val())
        * parseInt(($('#txtProductRequiermentQuantity_' + data).val() != "" ? $('#txtProductRequiermentQuantity_' + data).val() : 0));
    $('#txtProductRequiermentValue_' + data).val((lct.toString() != "NaN" ? lct : 0));

    var tempsum = 0;
    $.each($("#tempnewtable").find('.value'), function () {
        tempsum = tempsum + parseFloat($(this).val() != "" ? $(this).val() : 0);
    });
    $('#SumOfServices').val(tempsum);
    var quantsum = 0;
    $.each($("#tempnewtable").find('.quantity'), function () {
        quantsum = quantsum + parseFloat($(this).val() != "" ? $(this).val() : 0);
    });
    $('#SumOfQuantity').val(quantsum);
}

function GetSummOfSerivceValues(action) {
    var tempsum = 0;
    $.each($("#tempnewtable").find('.value'), function () {
        tempsum = tempsum + parseFloat($(this).val() != "" ? $(this).val() : 0);
    });
    $('#SumOfServices').val(tempsum);
    var quantsum = 0;
    $.each($("#tempnewtable").find('.quantity'), function () {
        quantsum = quantsum + parseFloat($(this).val() != "" ? $(this).val() : 0);
    });
    $('#SumOfQuantity').val(quantsum);
}

function ClearField() {
    $("#lblerr_ddlIndustryType").val("");

    //  $("#lblerr_ddlCompanySize").empty();

    $("#lblerr_ddlCity").empty();

    $('#txtClientName').val('');
    $('.txtClientName').val('');

    $('#txtContactName').val('');
    $('.txtContactName').val('');

    $('#txtDesignation').val('');
    $('.txtDesignation').val('');

    $('#txtDepartment').val("-1").trigger('change.select2');
    $('.txtDepartment').val("-1").trigger('change.select2');

    $('#txtEmail').val('');
    $('.txtEmail').val('');

    $('#txtMobile').val('');
    $('.txtMobile').val('');

    $('#txtTelephone').val('');
    $('.txtTelephone').val('');

    $('#txtAddress').val('');
    $('.txtAddress').val('');

    //  $('#txtArea').val('');
    //  $('.txtArea').val('');

    $('#txtPinCode').val('');
    $('.txtPinCode').val('');

    $('#txtWebsite').val('');
    $('.txtWebsite').val('');

    $('#txtBusinessAmount').val('');
    $('.txtBusinessAmount').val('');
    $('#SumOfServices').val('');
    $('.lblerr_ddlCity').val();

    //$('#txtBuddyAccompanied').val('');
    //$('.txtBuddyAccompanied').val('');

    $('#txtCurrentVendor').val('');
    $('.txtCurrentVendor').val('');

    $('#txtRemark').val('');
    $('.txtRemark').val('');

    //Lead Details Extra
    //Lead Details Extra
    $("#txtCompName").val('');
    $("#txtCompDesig").val('');
    $("#txtCompAddre").val('');
    $("#txtContact").val('');

    $("#ddlCity").val("-1").trigger('change.select2');
    //$("#ddlCompanySize").val("-1").trigger('change.select2');
    //$("#ddlCity").val("-1").val("");

    $("#ddlIndustryType").val('-1').trigger('change.select2');
    $("#ddlIndustRiskType").val('-1').trigger('change.select2');
    $("#ddlOfficeType").val('-1').trigger('change.select2');
    $("#ddlStatus").val("-1").trigger('change.select2');
    $("#ddlStatus").val("-1");

    $("#ddlLeadSource").val("");


    $("#ddlStage").val("-1").trigger('change.select2');
    //$("#ddlStage").val("21");
    $('.lblerr_ddlIndustryType').empty();

    $("#ddlIndustryType").val("-1").trigger('change.select2');

    $("#ddlAssignTo").val("-1").trigger('change.select2');
    $("#ddlAssignTo").val("-1");

    $("#RenewalDate").val('');

    $("#dateExpectedClosureDate").val('');

    $("#dateCompanyProfileDate").val('');

    $("#dateProposalDate").val('');
    ///////////////////////////////////
    $('#desgAndnumber tbody tr:not(:first)').remove();

    // $("#ddlProductRequierment_0").val("-1").trigger('change.select2');
    $("#ddlProductRequierment_0").val("-1");

    $('#txtProductRequiermentQuantity_0').val('');

    $('#txtProductRequiermentValue_0').val('');
    //////////////////////////////////

    $('#productDetailsPrint tbody tr:not(:first)').remove();
    $("#ddlProductRequiermentPrint_0").val("-1").trigger('change.select2');
    $('#txtProductRequiermentQuantityPrint_0').val('');
    $('#txtProductRequiermentValuePrint_0').val('');

    $("#txtOfficeTypeRemark").val('');
    $("#txtIndustryTypeRemark").val('');
    $(".lblerr_ddlOfficeType").text('');

    //clear label
    $(".txtClientName").text('');
    $(".lblerr_ddlIndustryType").text('');
    $(".lblerr_ddlCompanySize").text('');
    // $(".txtArea").text('');
    $(".txtAddress").text('');
    $(".txtPinCode").text('');
    $(".lblerr_ddlCity").text('');
    $(".txtCurrentVendor").text('');
    $(".lblerr_RenewalDate").text('');
    $(".txtContactName").text('');
    $(".txtDesignation").text('');
    $(".txtDepartment").val("-1").trigger('change.select2');
    $(".txtMobile").text('');
    $(".txtTelephone").text('');
    $(".txtEmail").text('');
    $(".txtWebsite").text('');
    $(".lblerr_ddlStatus").text('');
    $(".lblerr_ddlLeadSource").text('');
    $(".lblerr_ddlAssignTo").text('');
    $(".lblerr_ddlStage").text('');

}

function isNumber(evt) {
    //   $("#ddlIndustryType").val('-1').empty();
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        $('.' + evt.target.id).empty();
        $('.' + evt.target.id).append('Insert Numbers Only!');
        return false;
    }
    $('.' + evt.target.id).empty();
    return true;
}

function isNumberSer(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        toastr.error('Insert Numbers Only!');
        return false;
    }
    return true;
}

function ValidateAlpha(evt) {
    //    $("#ddlIndustryType").val('-1').empty();
    $('.' + evt.target.id).empty();
    evt = (evt) ? evt : window.event;
    var keyCode = (evt.which) ? evt.which : evt.keyCode;
    if ((keyCode < 65 || keyCode > 90) && (keyCode < 97 || keyCode > 122) && keyCode != 32) {
        $('.' + evt.target.id).empty();
        $('.' + evt.target.id).append('Insert Alphabet only!');
        return false;
    }
    return true;
}

function ValiadteDropDown(evt) {
    $('.' + evt.target.id).empty();
    evt = (evt) ? evt : window.event;
    var keyCode = (evt.which) ? evt.which : evt.keyCode;
    if (keyCode != "") {
        $('.' + evt.target.id).empty('');
    }
    return true;
}

function ResetThings() {
    count = 0;
    //$('#EmpCodeNew').html('');
    $('#ldstatus').html('');
    $("#btnAdd").html('Submit');
    $("#btnAdd").attr("onclick", "CreateLead(this);return false;");
    ClearField();
}

function validation_email_admin() {
    $(".txtEmail").empty();
    var x = $("#txtEmail").val();
    var atpos = x.indexOf("@");
    var dotpos = x.lastIndexOf(".");
    if (atpos < 1 || dotpos < atpos + 2 || dotpos + 2 >= x.length) {
        //alert("Not a valid e-mail address");
        if (x == "") {
            $(".txtEmail").text("");
        }
        else {
            $(".txtEmail").text("Not a valid e-mail address");
        }

    } else {
        $(".txtEmail").text('');
    }
}

function ddlIndustryTypeee() {
    ResetThings();
    $("#lblerr_ddlIndustryType").empty();

    //($('#ddlIndustryType') != null)
    //$("#lblerr_ddlIndustryType").fadeOut(500);
}

function ValidateText1() {
    $(".txtAddress").empty();
    if ($("#txtClientName").val() == "") {
        $(".txtClientName").text("Enter Client Name").fadeIn(1000);
    } else {
        $(".txtClientName").text("").fadeOut(1000);
    }

}

function ValidateText() {
    $(".txtAddress").empty();
    if ($("#txtAddress").val() == "") {
        $(".txtAddress").text("Enter Address").fadeIn(1000);
    } else {
        $(".txtAddress").text("").fadeOut(1000);
    }

}

function AskClearData() { //Add Akhilesh yadav
    var confrm = confirm('Do You Want to Clear This?');
    if (confrm == true) {
        ///   $('txtCompanyName').empty();
        $("#lblerr_ddlIndustryType").val("");

        //  $("#lblerr_ddlCompanySize").empty();

        $("#lblerr_ddlCity").empty();

        $('#txtClientName').val('');
        $('.txtClientName').val('');

        $('#txtContactName').val('');
        $('.txtContactName').val('');

        $('#txtDesignation').val('');
        $('.txtDesignation').val('');

        $('#txtDepartment').val("-1").trigger('change.select2');
        $('.txtDepartment').val("-1").trigger('change.select2');

        $('#txtEmail').val('');
        $('.txtEmail').val('');

        $('#txtMobile').val('');
        $('.txtMobile').val('');

        $('#txtTelephone').val('');
        $('.txtTelephone').val('');

        $('#txtAddress').val('');
        $('.txtAddress').val('');

        //$('#txtArea').val('');
        // $('.txtArea').val('');

        $('#txtPinCode').val('');
        $('.txtPinCode').val('');

        $('#txtWebsite').val('');
        $('.txtWebsite').val('');

        $('#txtBusinessAmount').val('');
        $('#SumOfServices').val('');
        $('.txtBusinessAmount').val('');
        $('.lblerr_ddlCity').val();

        //$('#txtBuddyAccompanied').val('');
        //$('.txtBuddyAccompanied').val('');

        $('#txtCurrentVendor').val('');
        $('.txtCurrentVendor').val('');

        $('#txtRemark').val('');
        $('.txtRemark').val('');

        $("#ddlCity").val("-1").trigger('change.select2');
        //$("#ddlCompanySize").val("-1").trigger('change.select2');
        //$("#ddlCity").val("-1").val("");

        $("#ddlIndustryType").val('-1').trigger('change.select2');
        $("#ddlIndustRiskType").val('-1').trigger('change.select2');
        $("#ddlStatus").val("-1").trigger('change.select2');
        $("#ddlStatus").val("-1");

        $("#ddlLeadSource").val("");


        $("#ddlStage").val("-1").trigger('change.select2');
        //$("#ddlStage").val("21");
        $('.lblerr_ddlIndustryType').empty();

        $("#ddlIndustryType").val("-1").trigger('change.select2');

        $("#ddlAssignTo").val("-1").trigger('change.select2');
        $("#ddlAssignTo").val("-1");

        $("#RenewalDate").val('');

        $("#dateExpectedClosureDate").val('');

        $("#dateCompanyProfileDate").val('');

        $("#dateProposalDate").val('');

        $("#txtIndustryTypeRemark").val('');
        ///  $('.txtCompanyName').empty('');
    }
}

function CreateFollowUp(action) {
    if ($("#ddlAction option:selected").val() == "-1" || $("#flowdate").val() == "" || $("#flowtime").val() == "" || $("#flowagenda").val() == "") {
        $('.ddlAction').empty();
        $('.flowdate').empty();
        $('.flowtime').empty();
        $('.flowagenda').empty();

        if ($("#ddlAction option:selected").val() == "-1") {
            $('.ddlAction').text('Please Select Action.');
        }
        if ($("#flowdate").val() == "") {
            $('.flowdate').text('Select enter Date.');
        }
        if ($("#flowtime").val() == "") {
            $('.flowtime').text('Please enter Time.');
        }
        if ($("#flowagenda").val() == "") {
            $('.flowagenda').text('Please enter Agenda.');
        }
        return;
    }

    else {
        $('.ddlAction').empty();
        $('.flowdate').empty();
        $('.flowtime').empty();
        $('.flowagenda').empty();
        $('.preloader').show();
        //step3 Append Form Control Values
        var formdata = new FormData();
        formdata.append('ActionId', $("#ddlAction option:selected").val());
        formdata.append('LeadId', LeadDocId);
        formdata.append('Date', $("#flowdate").val());
        formdata.append('Time', $("#flowtime").val());
        formdata.append('Remark', $("#flowagenda").val());
        $.ajax({
            type: "POST",
            url: BaseUrl + "CreateFollowUp",
            contentType: "application/json; charset=utf-8",
            headers: { "Authorization": "Bearer " + accessToken },
            data: formdata,
            contentType: false,
            processData: false,
            success: function (response) {
                $('.preloader').hide();
                GetFollowUpByLead(LeadDocId);
                var getData = $.parseJSON(response);
                if (getData != null) {
                    toastr.success('FollowUp Added Successfully !');
                    ClearFollowUp();
                    $('#modal_followup_tbl').modal('close');
                }
            },
        });
    }
}

function UploadLeadDocs(LeadId) {
    var formdata2 = new FormData();
    formdata2.append('LeadId', LeadId);
    /*    formdata2.append('LeadCode', $('#displddt').html());*/
    formdata2.append('FileName', $('#file-title-input').val());
    if ($("#fileID").val() != '') {
        formdata2.append($("#fileID").get(0).files[0].name, $("#fileID").get(0).files[0]);
    }
    if (formdata2.entries.length > -1) {
        $.ajax({
            type: "POST",
            url: "/API/ManageLead/UploadLeadDocs",
            headers: { "Authorization": "Bearer " + accessToken },
            data: formdata2,
            async: false,  //This Line Added By Faiz
            dataType: "json",
            processData: false,
            contentType: false,
            success: function (response) {
                GetDocumentsByLead(LeadId);
                toastr.success("Documents Submitted For This Leads!");
                ClearUpload();
                $('#modal_viewforFileUpload').modal('close');
            },
        });
    }

}

function DeleteLeadDocument(data) {
    if (confirm('Are You Sure You Want To Delete This Document ?')) {
        var formdata3 = new FormData();
        formdata3.append('LeadDocId', data);
        $('.preloader').show();
        $.ajax({
            type: "POST",
            url: "/API/ManageLead/DeleteLeadDocument",
            contentType: "application/json; charset=utf-8",
            headers: { "Authorization": "Bearer " + accessToken },
            data: formdata3,
            contentType: false,
            processData: false,
            success: function (response) {
                $('.preloader').hide();
                toastr.success('File Removed Successfully!');
            }
        });
    }
}
function TakeAction(data) {
    var detail = data.split("#");
    FollowupId = detail[0];
}
function CreateTakeAction(action) {

    if ($("#txtActionRemark").val() == "") {

        if ($("#txtActionRemark").val() == "") {
            $('.lblerr_txtActionRemark').text('Please Enter Remark.');
        } else {
            $('.lblerr_txtActionRemark').text('');
        }
        return;
    }
    else {

        var formdata = new FormData();

        formdata.append('FollowupId', FollowupId);
        formdata.append('ddlFollowupStatus', $("#ddlFollowupStatus option:selected").val());
        formdata.append('ActionRemark', $("#txtActionRemark").val());
        $.ajax({
            type: "POST",
            url: BaseUrl + "CreateTakeAction",
            headers: { "Authorization": "Bearer " + accessToken },
            data: formdata,
            dataType: "json",
            processData: false,
            contentType: false,
            success: function (response) {
                toastr.success("Follow Up Status Updated Successfully.");
                GetFollowUpByLead(LeadId);
                
            },
        });
    }

    $('#modal_view_takeFollowupAction_tbl').modal('close');
}

//For Lead FollowUp Details
function GetFollowUpByLead(data) {
    var formdata1 = new FormData();
    formdata1.append('LeadId', data);
    $.ajax({
        type: "POST",
        url: BaseUrl + "GetAllFollowUpByLead",
        headers: { "Authorization": "Bearer " + accessToken },
        contentType: "application/json; charset=utf-8",
        data: formdata1,
        processData: false,
        contentType: false,
        success: function (response) {

            $('#tblFollowUpbody').empty();
            for (var i = 0; i < response.length; i++) {
                $('#tblFollowUpbody').append("<tr><td>" + (i + 1) + "</td>" +
                    "<td><div class='col s12 m6 l2' style='width: 100%'><label>" + response[i].status + "</label></div></td>" +
                    "<td><div class='col s12 m6 l2' style='width: 100%'><label>" + response[i].actionname + "</label></div></td>" +
                    "<td><div class='col s12 m6 l2' style='width: 100%'><label>" + response[i].date + "</label></div></td>" +
                    "<td><div class='col s12 m6 l2' style='width: 100%'><label>" + response[i].time + "</label></div></td>" +
                    "<td><div class='col s12 m6 l2' style='width: 100%'><label>" + response[i].agenda + "</label></div></td>" +
                    "<td><div class='col s12 m6 l2' style='width: 100%'><label>" + response[i].remark + "</label></div></td>" +
                    "<td id='UserAction'><b href='#modal_view_takeFollowupAction_tbl' onclick='TakeAction(\"" + response[i].followid + "\");' class='action-normal modal-trigger'><button id='btnTakeAction' class='btn brand-color waves-effect waves-light' style='height: 32px' width: 85%' type='submit' onclick='Show();'>Take Action</button></b></td>" +
                    "</tr>");
            }
        }
    });
}

//For Lead Document Details
function GetDocumentsByLead(data) {
    var formdata2 = new FormData();
    formdata2.append('LeadId', data);
    $.ajax({
        type: "POST",
        url: BaseUrl + "GetAllDocumentByLead",
        headers: { "Authorization": "Bearer " + accessToken },
        contentType: "application/json; charset=utf-8",
        data: formdata2,
        processData: false,
        contentType: false,
        success: function (response) {
            if (response != null) {
                $('#file-table').empty();
                for (var i = 0; i < response.length; i++) {

                    var docpath = response[i].docpath;
                    const extension = docpath.substring(docpath.lastIndexOf('.'));
                    var src = SetFileThumbnail(docpath, extension);

                    $('#file-table').append("<tr><td>" + (i + 1) + "</td>" +
                        "<td><div class='col s12 m6 l2' style='width: 100%'><label>" + response[i].docname + "</label></div></td>" +
                        "<td><div class='col s12 m6 l2' style='width: 100%'><label>" + response[i].createdby + "</label></div></td>" +
                        "<td><div class='col s12 m6 l2' style='width: 100%'><label>" + response[i].createdat + "</label></div></td>" +
                        "<td><div class='col s12 m6 l2' style='width: 100%'><label>" +
                        "<a href='" + response[i].docpath.replace('~', '..') + "' download='" + response[i].docname + "." + response[i].docpath.split('.')[1] + "'>Download</a></label></div></td>" +
                        "<td id='Title'><a " + filedown + "><img src='" + src + "' width='40' height='40'></a></td>" +
                        "<td><div class='col s12 m6 l2' style='width: 100%'><label><a href='#' onclick='DeleteLeadDocument(\"" + response[i].leaddocid + "\");'><button type='button'>Delete</button></label></div></td>" +
                        "</tr>");
                }
            } else {
                $("#file-table").html("<b style='font-size:20px;'>Data Not Available !</b>");
            }

        }
    });
}

function SetFileThumbnail(path, extent) {

    var refile = 0;
    filedown = "";
    if (path != "" || path != null) {
        if (extent.toUpperCase() == ".JPG" || extent.toUpperCase() == ".JPEG" || extent.toUpperCase() == ".PNG" || extent.toUpperCase() == ".TIFF" || extent.toUpperCase() == ".BMP" || extent.toUpperCase() == ".SVG") {
            srcnew = path.replace("~", "..");
            refile = 1;
            filedown = "target='_blank' href='../ShowImage.aspx?imgPath=" + srcnew + "'";
        }
        if (extent.toUpperCase() == ".PDF") {
            srcnew = "../Assets/images/pdfthumb.jpg";
            refile = 0;
            filedown = "href='" + path.replace("~", "..") + "' download";
        }
        if (extent.toUpperCase() == ".DOC" || extent.toUpperCase() == ".DOCX" || extent.toUpperCase() == ".WPS") {
            srcnew = "../Assets/images/wordthumb.jpg";
            refile = 0;
            filedown = "href='" + path.replace("~", "..") + "' download";
        }
        if (extent.toUpperCase() == ".XLS" || extent.toUpperCase() == ".XLSX") {
            srcnew = "../Assets/images/excelthumb.png";
            refile = 0;
            filedown = "href='" + path.replace("~", "..") + "' download";
        }
        if (extent.toUpperCase() == ".TXT" || extent.toUpperCase() == ".TEXT") {
            srcnew = "../Assets/images/txtthumbnail.png";
            refile = 0;
            filedown = "href='" + path.replace("~", "..") + "' download";
        }
    }
    if (path == "" || path == null) {
        if (refile == 1) { srcnew = "../Assets/images/images.png"; }
        if (refile == 0) { srcnew = "../Assets/images/filemissthumbnail1.png"; }
    }
    return srcnew;
}

var flagToggle = true;
function GetALL_LeadList(action) {


    if (flagToggle) {

        flagToggle = false;

        $('.preloader').show();
        var formdata = new FormData();
        if (EmpBranchId != '0') { formdata.append('BranchId', EmpBranchId); formdata.append('BUserId', PrntUserId); }
        else { formdata.append('BranchId', $('#ddlBranchF option:selected').val()); }
        formdata.append("IsOpportunity", 0);
        formdata.append("ActionNo", 5);
        $.ajax({
            type: "POST",
            url: BaseUrl + "GetLeadList",
            headers: { "Authorization": "Bearer " + accessToken },
            data: formdata,
            dataType: "json",
            processData: false,
            contentType: false,
            beforeSend: function () {
                $('#table').empty();
            },
            success: function (response) {
                var getData = $.parseJSON(response);
                $('#div_Dept_tbl').empty();
                if (getData.length > 0) {
                    $('#div_Dept_tbl').append("<table id='Branch_tbl' class='responsive-table display withrowstrap' style='overflow-x: auto; white-space: nowrap; width:100%'>" +
                        "<thead class='fixed_header'><tr>" +
                        "<th class='noExport'>Sr.</th>" +
                        "<th>Enquiry<br />Code</th>" +
                        "<th >Client Name</th>" +
                        "<th >Contact Person</th>" +
                        "<th >Contact No.</th>" +
                        "<th >Contact Email</th>" +
                        "<th >Stage</th>" +
                        "<th >Lead Given By</th>" +
                        "<th >Assign To</th>" +
                        "<th >Proposal Date</th>" +
                        "<th >Created By</th>" +
                        "<th >Created Date</th>" +
                        "<th class='noExport'>Action</th>" +
                        "</tr></thead>");
                    $('#Branch_tbl').append("<tbody class='dataTables_scrollBodyEnq'>");
                    for (var j = 0; j < getData.length; j++) {
                        let color = "";

                        if (getData[j].LeadStageName == "Lead") {
                            color = "linear-gradient(108.7deg, rgba(34, 219, 231, 1) -0.9%, rgba(52, 118, 246, 1) 88.7%) !important;";
                        } else if (getData[j].LeadStageName == "Pipeline") {
                            color = "linear-gradient(109.6deg, rgba(247, 108, 243, 1) 11.2%, rgba(173, 64, 254, 1) 100.2%) !important;";
                        } else if (getData[j].LeadStageName == "Meeting Done") {
                            color = "radial-gradient(circle 711px at 21% 79%, rgba(0, 189, 157, 1) 0%, rgba(0, 231, 192, 0.45) 90%) !important;";
                        } else if (getData[j].LeadStageName == "Negotiation") {
                            color = "radial-gradient(circle farthest-corner at 10% 20%, rgba(246, 139, 31, 1) 0%, rgba(246, 103, 103, 1) 90.1%) !important;";
                        } else if (getData[j].LeadStageName == "Agreement") {
                            color = "aqua";
                        } else if (getData[j].LeadStageName == "Won") {
                            color = "burlywood"; // Correct color name
                        } else if (getData[j].LeadStageName == "Lost") {
                            color = "darkorange";
                        } else {
                            color = "blue"; // Fallback color
                        }



                        $('#Branch_tbl').append("<tr>" +
                            "<td style='width:70px;'>" + j + 1 + "</td>" +
                            "<td id='LeadId'><span title='" + getData[j].LeadCode + "'>" + getData[j].LeadCode + "</span></td>" +
                            "<td id='ClientName'><span title='" + getData[j].ClientName + "'>" + getData[j].ClientName + "</span></td>" +
                            "<td id='ContactNo'><span title='" + getData[j].ContactNo + "'>" + getData[j].ContactNo + "</span></td>" +
                            "<td id='Mobile' ><span title=' '>" + (getData[j].Mobile) + "</span></td>" +
                            "<td id='Mobile' ><span title=' '>" + (getData[j].Email) + "</span></td>" +
                            "<td id='LeadStageName' style='background:" + color + "'><span title='" + getData[j].LeadStageName + "'>" + getData[j].LeadStageName + "</span></td>" +
                            "<td id='FullName' class='wrap-content'><span title='" + getData[j].LeadGivenBy + "'>" + getData[j].LeadGivenBy + "</span></td>" +
                            "<td id='AssingTo' class='wrap-content'><span title='" + getData[j].AssingTo + "'>" + getData[j].AssingTo + "</span></td>" +
                            "<td id='ProposalDate' class='wrap-content'><span title='" + getData[j].ProposalDate + "'>" + getData[j].ProposalDate + "</span></td>" +
                            "<td id='CreatedBy'><span title='" + getData[j].CreatedBy + "'>" + getData[j].CreatedBy + "</span></td>" +
                            "<td id='CreatedAt'><span title='" + getData[j].CreatedAt + "'>" + getData[j].CreatedAt + "</span></td>" +
                            "<td><a href='#' onclick='ViewBeforeUpdate(\"" + getData[j].LeadId + "\");'>Update</a>" +

                            "</tr>");
                    }
                    /*             $('#Branch_tbl').append(table);*/
                    $('#Branch_tbl').append("</tbody>");
                    $('#div_Dept_tbl').append("</table>");
                } else {
                    $('#div_Dept_tbl').append("<table id='Branch_tbl' class='compact row-border order-column withrowstrap' cellspacing='0' width='100%' >" +
                        "<thead class='fixed_header'><tr>" +
                        "<th class='noExport'>Sr.</th>" +
                        // "<th>LeadId</th>" +
                        "<th>EnquiryCode</th>" +
                        "<th>Branch Name</th>" +
                        "<th>Enquiry<br />Code</th>" +
                        "<th >Enquiry<br />Date</th>" +
                        "<th >Status</th>" +
                        "<th >Client Name</th>" +
                        //"<th>Office Type</th>" +
                        "<th >Contact Person</th>" +
                        //"<th >Location</th>" +
                        "<th >Stage</th>" +
                        "<th >Emp Code</th>" +
                        "<th >AssignTo</th>" +
                        "<th >DeviceType</th>" +
                        "<th >Contact No.</th>" +
                        "<th >Altr Contact</th>" +
                        //"<th style='width:80px;'>LatLong</th>" +
                        //"<th style='width:70px;'>GeoLocation</th>" +
                        "<th class='noExport'>Action</th>" +
                        "</tr></thead>");
                    $('#Branch_tbl').append(table);
                    $('#Branch_tbl').append("</tbody>");
                    $('#div_Dept_tbl').append("</table>");
                }

                var table = $('#Branch_tbl').DataTable({
                    order: [[0, 'asc']],
                    columnDefs: [
                        { searchable: false, orderable: false, targets: [0] }
                    ],
                    dom: 'Bfrtip',
                    buttons: [
                        {
                            extend: 'excelHtml5',
                            title: 'Enquiry Details',
                            exportOptions: {
                                orthogonal: 'export',
                                columns: ':not(.noExport)'
                            }
                        },
                        'colvis'
                    ]
                });

                table.on('order.dt search.dt', function () {
                    table.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
                        cell.innerHTML = i + 1;
                    });
                }).draw();

            },
        });

        $('.preloader').hide();

        $("#main-container").hide();
        $("#div_Dept_tbl").show();
        $("#ToggleButton").text("Sales Dashboard");
        $("#AllLeadsBtn").css({ display: "none" });
        $(".toggleHS").css("visibility", "visible");
    }
    else {
        $("#main-container").show();
        $("#AllLeadsBtn").css({ display: "flex" });
        $("#div_Dept_tbl").hide();
        $("#ToggleButton").text("All Leads");
        $(".toggleHS").css("visibility", "hidden");
        flagToggle = true;
    }
}

function LeadReportFilter() {

    var formdata = new FormData();
    var asignToId = $("#ddlAssignToFilter option:selected").val();
    var statusId = $("#ddlStatusFilter option:selected").val();
    var stageId = $("#ddlStageFilter option:selected").val();

    var tempdate = null;
    var ffd = null;
    var ttd = null;
    var tepmfd = null;
    var tepmtd = null;
    var ffd = null;



    formdata.append('BranchId', $('#ddlBranchF option:selected').val());
    formdata.append('asignToId', asignToId);
    formdata.append('statusId', statusId);
    formdata.append('stageId', stageId);
    formdata.append('dateFrom', $("#daterangeFrom").val());
    formdata.append('dateTo', $("#daterangeTo").val());
    formdata.append("IsOpportunity", 0);

    $.ajax({
        type: "POST",
        url: BaseUrl + "LeadReportFilter",
        headers: { "Authorization": "Bearer " + accessToken },
        data: formdata,
        //async: false,
        dataType: "json",
        processData: false,
        contentType: false,
        success: function (response) {
            $('.preloader').hide();
            var getData = $.parseJSON(response);
            $('#div_Dept_tbl').empty();

            if (getData.length > 0) {
                // debugger;

                var tableHtml = "<table id='Branch_tbl' class='responsive-table display withrowstrap' style='width:100%' >" +
                    "<thead><tr>" +
                    "<th class='noExport'>Sr.</th>" +
                    "<th>Enquiry<br />Code</th>" +
                    "<th >Client Name</th>" +
                    "<th >Contact Person</th>" +
                    "<th >Contact No.</th>" +
                    "<th >Contact Email</th>" +
                    "<th >Stage</th>" +
                    "<th >Lead Given By</th>" +
                    "<th >Assign To</th>" +
                    "<th >Created By</th>" +
                    "<th >Created Date</th>" +
                    "<th class='noExport'>Action</th>" +
                    "</tr></thead>" +
                    "<tbody>";

                for (var j = 0; j < getData.length; j++) {
                    let color = "";

                    if (getData[j].LeadStageName == "Lead") {
                        color = "linear-gradient(108.7deg, rgba(34, 219, 231, 1) -0.9%, rgba(52, 118, 246, 1) 88.7%) !important;";
                    } else if (getData[j].LeadStageName == "Pipeline") {
                        color = "linear-gradient(109.6deg, rgba(247, 108, 243, 1) 11.2%, rgba(173, 64, 254, 1) 100.2%) !important;";
                    } else if (getData[j].LeadStageName == "Meeting Done") {
                        color = "radial-gradient(circle 711px at 21% 79%, rgba(0, 189, 157, 1) 0%, rgba(0, 231, 192, 0.45) 90%) !important;";
                    } else if (getData[j].LeadStageName == "Negotiation") {
                        color = "radial-gradient(circle farthest-corner at 10% 20%, rgba(246, 139, 31, 1) 0%, rgba(246, 103, 103, 1) 90.1%) !important;";
                    } else if (getData[j].LeadStageName == "Agreement") {
                        color = "aqua";
                    } else if (getData[j].LeadStageName == "Won") {
                        color = "burlywood";
                    } else if (getData[j].LeadStageName == "Lost") {
                        color = "darkorange";
                    } else {
                        color = "blue";
                    }

                    tableHtml += "<tr>" +
                        "<td style='width:68px;'>" + (j + 1) + "</td>" +
                        "<td>" + getData[j].LeadCode + "</td>" +
                        "<td id='ClientName'><span title='" + getData[j].ClientName + "'>" + getData[j].ClientName + "</span></td>" +
                        "<td id='ContactNo'><span title='" + getData[j].ContactNo + "'>" + getData[j].ContactNo + "</span></td>" +
                        "<td id='Mobile'><span title='" + getData[j].Mobile + "'>" + getData[j].Mobile + "</span></td>" +
                        "<td id='Email'><span title='" + getData[j].Email + "'>" + getData[j].Email + "</span></td>" +
                        "<td id='LeadStageName' style='background:" + color + ";'><span title='" + getData[j].LeadStageName + "'>" + getData[j].LeadStageName + "</span></td>" +
                        "<td id='LeadGivenBy'><span title='" + getData[j].LeadGivenBy + "'>" + getData[j].LeadGivenBy + "</span></td>" +
                        "<td id='AssingTo'><span title='" + getData[j].FullName + "'>" + getData[j].FullName + "</span></td>" +
                        "<td id='CreatedBy'><span title='" + getData[j].CreatedBy + "'>" + getData[j].CreatedBy + "</span></td>" +
                        "<td id='CreatedAt'><span title='" + getData[j].CreatedAt + "'>" + getData[j].CreatedAt + "</span></td>" +
                        "<td><a href='#' onclick='ViewBeforeUpdate(\"" + getData[j].LeadId + "\");'>Update</a></td>" +
                        "</tr>";
                }

                tableHtml += "</tbody></table>";
                $('#div_Dept_tbl').append(tableHtml);
            } else {
                $('#div_Dept_tbl').append("<p>No data available.</p>");
            }

            var table = $('#Branch_tbl').DataTable({

                "columnDefs": [{
                    "searchable": false,
                    "orderable": false,
                    "targets": [0],

                }],
                'order': [[0, 'desc']],
                dom: 'Bfrtip',
                buttons: [
                    {
                        extend: 'excelHtml5',
                        title: 'Recruitment Report',
                        //exportOptions: {columns: "thead th:not(.noExport)" },
                        exportOptions: {
                            columns: "thead th:not(.noExport)",
                            format: {
                                body: function (data, row, column, node) {
                                    return column === 43 ? '\u200C' + data.replace(/\n/g, " ").replace(/<.*?>/g, "") : data.replace(/\n/g, " ").replace(/<.*?>/g, "");
                                }
                            }
                        },
                    },
                    'colvis'
                ]
            });

            table.on('order.dt search.dt', function () {
                table.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
                    cell.innerHTML = i + 1;
                });
            }).draw();
            if (PrmsIsView == 'false') { table.columns([16]).visible(false); }
            $('.dataTables_wrapper .dataTables_filter input').attr('placeholder', 'Search...');
        },
        // error: function (err) {alert(err.responseText); }
    });
}
function SetStatusColor(data) {
    if (data == "HT") {
        $("#ldstatus").css("color", "Red");
    }
    else if (data == "WRM") {
        $("#ldstatus").css("color", "Lime");
    }
    else if (data == "Opport") {
        $("#ldstatus").css("color", "Orange");
    }
    else if (data == "CLD") {
        $("#ldstatus").css("color", "Blue");
    } else {
        $("#ldstatus").css("color", "Blue");
    }
}

$(".rem").click(function () {
    $(this).parents("tr").remove();
    var cn = 1;
    $("#tempnewtable tr").each(function () {
        $(this).find("td:first").text(cn);
        cn++;
    });
    GetSummOfSerivceValues(this);
});

$(".rem1").click(function () {
    $(this).parents("tr").remove();
    var cn = 1;
    $("#ClntCntrcttable tr").each(function () {
        $(this).find("td:first").text(cn);
        cn++;
    });
    GetSummOfSerivceValues(this);
});

function ClearUpload() {
    $('#docname').val('');
    $('#docfile').val('');
}

function ClearFollowUp() {
    $('.ddlAction').empty();
    $('.flowdate').empty();
    $('.flowtime').empty();
    $('.flowagenda').empty();

    $("#ddlAction").val('-1').trigger('change.select2');
    $("#flowdate").val('');
    $("#flowtime").val('');
    $("#flowagenda").val('');
}

function AddMoreComments(action) {

    count = $("#tblSubmitComnt tr").length;
    count++;
    $('#tblSubmitComnt').append("<tr>" +
        "<td>" + (count + 1) + "</td>" +
        "<td><div class='col s12 m6 l12' style='width: 100%'>" +
        "<textarea id='UserComment_" + (count + 1) + "' class='enqcomnt' style='width: 100%'></textarea>" +
        "</div></td>" +
        "<td><span class='rem'><a href='javascript:void(0);' style='font-weight: 500; color: red'>X</a></span></td>" +
        "</tr>");
    $(".rem").click(function () {
        $(this).parents("tr").remove();
        var cn = $(this).parents("tr").length;
        $("#tblSubmitComnt tr").each(function () {
            cn++;
            $(this).find("td:first").text(cn);
        });
    });
}

function AddMoreComments1(action) {

    count = $("#tblSubmitComnt1 tr").length;
    count++;
    $('#tblSubmitComnt1').append("<tr>" +
        "<td>" + (count + 1) + "</td>" +
        "<td><div class='col s12 m6 l12' style='width: 100%'>" +
        "<textarea id='UserCommentSection_" + (count + 1) + "' class='enqcomnt' style='width: 100%'></textarea>" +
        "</div></td>" +
        "<td><span class='rem'><a href='javascript:void(0);' style='font-weight: 500; color: red'>X</a></span></td>" +
        "</tr>");
    $(".rem").click(function () {
        $(this).parents("tr").remove();
        var cn = $(this).parents("tr").length;
        $("#tblSubmitComnt1 tr").each(function () {
            cn++;
            $(this).find("td:first").text(cn);
        });
    });
}

function SendLeadComment(action) {
    var formdata1 = new FormData();
    var count4 = 0;
    $.each($("#tblSubmitComnt").find('.enqcomnt'), function () {

        if ($(this).val() == "") {
            return;
        }
        formdata1.append('Comment_' + count4, $(this).val());
        count4++;
    });
    formdata1.append('ListCount', count4);
    formdata1.append('LeadId', LeadDocId);

    $.ajax({
        type: "POST",
        url: BaseUrl + "SendLeadComment",
        data: formdata1,
        headers: { "Authorization": "Bearer " + accessToken },
        dataType: 'json',
        async: false,
        contentType: false,
        processData: false,
        success: function (response) {
            GetLeadComments(LeadDocId);
            $.each($("#tblSubmitComnt").find('.enqcomnt'), function () { $(this).val('') });
            toastr.success("Comments Added Successfully.");
        },
    });
}

function SendLeadComment1(action) {
    var formdata1 = new FormData();
    var count4 = 0;
    $.each($("#tblSubmitComnt1").find('.enqcomnt'), function () {

        if ($(this).val() == "") {
            return;
        }
        formdata1.append('Comment_' + count4, $(this).val());
        count4++;
    });
    formdata1.append('ListCount', count4);
    formdata1.append('LeadId', LeadDocId);

    $.ajax({
        type: "POST",
        url: BaseUrl + "SendLeadComment",
        data: formdata1,
        headers: { "Authorization": "Bearer " + accessToken },
        dataType: 'json',
        async: false,
        contentType: false,
        processData: false,
        success: function (response) {
            GetLeadComments1(LeadDocId);
            $.each($("#tblSubmitComnt").find('.enqcomnt'), function () { $(this).val('') });
            toastr.success("Comments Added Successfully.");
        },
    });
}

function GetLeadComments(data) {
    var formdata2 = new FormData();
    formdata2.append('LeadId', data);
    $.ajax({
        type: "POST",
        url: BaseUrl + "GetAllLeadCommentByLead",
        headers: { "Authorization": "Bearer " + accessToken },
        contentType: "application/json; charset=utf-8",
        data: formdata2,
        processData: false,
        contentType: false,
        success: function (response) {
            if (response != null && response != '') {
                if (response.length > 0) {
                    $('#tblSaveComnt').empty();
                    for (var k = 0; k < response.length; k++) {
                        $('#tblSaveComnt').append("<tr>" +
                            "<td>" + (k + 1) + "</td>" +
                            "<td><div class='col s12 m6 l12' style='width: 100%'><span>" + response[k].userName + " - " + response[k].commentDate + "</span>" +
                            "<p>" + response[k].commentText + "</p></div></td>" +
                            "<td></td></tr>");
                    }
                }
            }
        }
    });
}

function GetLeadComments1(data) {
    var formdata2 = new FormData();
    formdata2.append('LeadId', data);
    $.ajax({
        type: "POST",
        url: BaseUrl + "GetAllLeadCommentByLead",
        headers: { "Authorization": "Bearer " + accessToken },
        contentType: "application/json; charset=utf-8",
        data: formdata2,
        processData: false,
        contentType: false,
        success: function (response) {
            if (response != null && response != '') {
                $('#tblSaveComnt1').empty();
                var CommentHtml = "";
                for (var k = 0; k < response.length; k++) {
                    CommentHtml += `<tr>
                            <td>${(k + 1)}</td>
                            <td>${response[k].userName}</td>
                             <td>${response[k].commentDate}</td>
                             <td>${response[k].commentText}</td>
                            </tr>`;
                }
                $('#tblSaveComnt1').append(CommentHtml);
            }
        }
    });
}

function GetSalesDashboardDataLeadWise() {

    $('.preloader').show();

    const stages = {
        5: { id: 'Lead', countEl: '#LeadCount', page: 1, loading: false, hasMore: true },
        6: { id: 'Pipeline', countEl: '#PipelineCount', page: 1, loading: false, hasMore: true },
        8: { id: 'Negotiation', countEl: '#NegotiationCount', page: 1, loading: false, hasMore: true },
        9: { id: 'Agreenent', countEl: '#AgreenentCount', page: 1, loading: false, hasMore: true },
        10: { id: 'Won', countEl: '#WonCount', page: 1, loading: false, hasMore: true },
        21: { id: 'lost', countEl: '#LostCount', page: 1, loading: false, hasMore: true }
    };

    const pageSize = 50;
    const MIN_SKELETON_TIME = 500; // 🔥 minimum skeleton visible time (ms)

    Object.keys(stages).forEach(key => {
        loadStage(parseInt(key), true);
    });

    function addSkeleton($column, count) {
        let html = '';
        for (let i = 0; i < count; i++) {
            html += `
            <div class="BoxSection skeleton-card">
                <div class="skeleton-line skeleton-title"></div>
                <div class="skeleton-line skeleton-contact"></div>
                <div class="skeleton-line skeleton-amount"></div>
                <div class="skeleton-line skeleton-footer"></div>
            </div>`;
        }
        $column.append(html);
    }

    function loadStage(stageId, initial) {

        const stage = stages[stageId];
        if (!stage || stage.loading || !stage.hasMore) return;

        stage.loading = true;

        const $column = $('#' + stage.id);

        /* Skeleton BEFORE ajax */
        if (initial) {
            $column.empty();
            addSkeleton($column, 10);
        } else {
            addSkeleton($column, 6);
            $column.scrollTop($column[0].scrollHeight);
        }

        /* 🔥 record skeleton start time */
        const skeletonStartTime = Date.now();

        /* Force browser paint */
        $column[0].offsetHeight;

        setTimeout(() => {

            var formdata = new FormData();
            formdata.append('StageId', stageId);
            formdata.append('Page', stage.page);
            formdata.append('PageSize', pageSize);

            $.ajax({
                type: "POST",
                url: "/API/ManageLead/GetSalesDashboardDataLeadWiseNew",
                data: formdata,
                contentType: false,
                processData: false,
                headers: { "Authorization": "Bearer " + accessToken },

                success: function (response) {

                    let res = typeof response === 'string' ? JSON.parse(response) : response;
                    let data = res.Leads || [];
                    let totalCount = res.TotalCount || 0;

                    $(stage.countEl).text(totalCount);

                    /* 🔥 ensure minimum skeleton time */
                    const elapsed = Date.now() - skeletonStartTime;
                    const remainingDelay = Math.max(0, MIN_SKELETON_TIME - elapsed);

                    setTimeout(() => {

                        /* Remove skeleton */
                        $column.find('.skeleton-card').remove();

                        if (data.length > 0) {
                            let html = '';
                            data.forEach(item => {
                                html += `
                                <div class="BoxSection"
                                     data-clientname="${(item.ClientName || '').toLowerCase()}"
                                     onclick="ViewForDetails('${item.LeadId}')">
                                    <span class="client-name">${item.ClientName || 'N/A'}</span>
                                    <span class="contact-no">${item.ContactNo || 'N/A'}</span>
                                    <div class="amount-row">Rs. ${item.BusinessAmount || 0}</div>
                                    <div class="footer-row">
                                        <span>${item.AssignToEmp || 'Unassigned'}</span>
                                        <span>${item.CreatedBy || item.ModifiedBy || 'N/A'}</span>
                                    </div>
                                </div>`;
                            });
                            $column.append(html);
                        }

                        stage.hasMore = data.length === pageSize;
                        stage.page++;
                        stage.loading = false;
                        $('.preloader').hide();

                    }, remainingDelay);
                },

                error: function () {
                    $column.find('.skeleton-card').remove();
                    stage.loading = false;
                    $('.preloader').hide();
                }
            });

        }, 60);
    }


    Object.keys(stages).forEach(key => {
        const stageId = parseInt(key);
        $('#' + stages[stageId].id).on('scroll', function () {
            if (this.scrollTop + this.clientHeight >= this.scrollHeight - 50) {
                loadStage(stageId, false);
            }
        });
    });
}







