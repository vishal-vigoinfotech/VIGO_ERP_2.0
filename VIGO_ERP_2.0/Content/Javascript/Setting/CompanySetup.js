var BaseUrl = "/api/Admin/";
var format = /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;

$(document).ready(function () {
    GetCompanySetupDetails('VIEW');
});

function GetCompanySetupDetails(action) {
    ClearAll();
    App.showLoader();

    $.ajax({
        type: "POST",
        url: BaseUrl +"GetCompanySetupDetails",
        headers: { "Content-Type": "application/json", "Accept": "application/json", "Authorization": "Bearer " + accessToken },
        contentType: "application/json; charset=utf-8",
        data: "",
        dataType: "json",
        success: function (response) {
            App.hideLoader();
            if (response.TempEmpCodePrefix != "" || response.TempEmpCodePrefix != null) {
                $("#tcodeprifx").val(response.TempEmpCodePrefix);
            }
            if (response.TempEmpCodeSuffix != "" || response.TempEmpCodeSuffix != null) {
                $("#tcodesuffix").val(response.TempEmpCodeSuffix);
            }

            if (response.ClientPrefix != "" || response.ClientPrefix != null) {
                $("#tclientprifx").val(response.ClientPrefix);
            }
            if (response.ClientSuffix != "" || response.ClientSuffix != null) {
                $("#tclientsuffix").val(response.ClientSuffix);
            }
            if (response.SitePrefix != "" || response.SitePrefix != null) {
                $("#tsiteprifx").val(response.SitePrefix);
            }
            if (response.SiteSuffix != "" || response.SiteSuffix != null) {
                $("#tsitesuffix").val(response.SiteSuffix);
            }

            if (response.EnquiryPrefix != "" || response.EnquiryPrefix != null) {
                $("#enquiryprifx").val(response.EnquiryPrefix);
            }
            if (response.EnquirySuffix != "" || response.EnquirySuffix != null) {
                $("#enquirysuffix").val(response.EnquirySuffix);
            }
            if (response.ComplaintPrefix != "" || response.ComplaintPrefix != null) {
                $("#complaintprifx").val(response.ComplaintPrefix);
            }
            if (response.ComplaintSuffix != "" || response.ComplaintSuffix != null) {
                $("#complaintsuffix").val(response.ComplaintSuffix);
            }

            if (response.FeedbackPrefix != "" || response.FeedbackPrefix != null) {
                $("#feedbackprifx").val(response.FeedbackPrefix);
            }
            if (response.FeedbackSuffix != "" || response.FeedbackSuffix != null) {
                $("#feedbacksuffix").val(response.FeedbackSuffix);
            }

            if (response.TendorPrefix != "" || response.TendorPrefix != null) {
                $("#tendorprifx").val(response.TendorPrefix);
            }
            if (response.TendorSuffix != "" || response.TendorSuffix != null) {
                $("#tendorsuffix").val(response.TendorSuffix);
            }
            if (response.LeadPrefix != "" || response.LeadPrefix != null) {
                $("#leadprifx").val(response.LeadPrefix);
            }
            if (response.LeadSuffix != "" || response.LeadSuffix != null) {
                $("#leadsuffix").val(response.LeadSuffix);
            }
            if (response.PartyPrefix != "" || response.PartyPrefix != null) {
                $("#partyprifx").val(response.PartyPrefix);
            }
            if (response.PartySuffix != "" || response.PartySuffix != null) {
                $("#partysuffix").val(response.PartySuffix);
            }
            if (response.ContractPrefix != "" || response.ContractPrefix != null) {
                $("#Contractprifx").val(response.ContractPrefix);
            }
            if (response.ContractSuffix != "" || response.ContractSuffix != null) {
                $("#Contractsuffix").val(response.ContractSuffix);
            }

            if (response.Designationprifx != "" || response.Designationprifx != null) {
                $("#Designationprifx").val(response.Designationprifx);
            }
            if (response.Designationsuffix != "" || response.Designationsuffix != null) {
                $("#Designationsuffix").val(response.Designationsuffix);
            }

            if (response.PostingOrderPrefix != "" || response.PostingOrderPrefix != null) {
                $("#PoPrifix").val(response.PostingOrderPrefix);
            }
            if (response.PostingOrderSuffix != "" || response.PostingOrderSuffix != null) {
                $("#Posuffix").val(response.PostingOrderSuffix);
            }

       
            if (response.CompEmpCodePrefix != "" || response.CompEmpCodePrefix != null) {
                $("#codeprifx").val(response.CompEmpCodePrefix);
            }
            if (response.CompEmpCodeSuffix != "" || response.CompEmpCodeSuffix != null) {
                $("#codesuffix").val(response.CompEmpCodeSuffix);
            }
            if (response.CompEmpCodeLength != "" || response.CompEmpCodeLength != null) {
                $("#codelength").val(response.CompEmpCodeLength);
            }
            if (response.ModifiedBy != "" || response.ModifiedBy != null) {
                $('#modifby').html(response.ModifiedBy);
            }
            if (response.ModifiedAt != "" || response.ModifiedAt != null) {
                $('#modifat').html(response.ModifiedAt);
            }

            if (response.AttCutOfTime != "" || response.AttCutOfTime != null) {
                $('#AttCutOfTime').val(response.AttCutOfTime);
            }

            if (response.ItemPrifx != "" || response.ItemPrifx != null) {
                $("#Itemprifx").val(response.ItemPrifx);
            }
            if (response.ItemSuffix != "" || response.ItemSuffix != null) {
                $("#Itemsuffix").val(response.ItemSuffix);
            }
           
            if (response.FullName != "" || response.FullName != null) {
                $("#modifiedBy").html(response.FullName);
            }

            if (response.CreatedAt != "" || response.CreatedAt != null) {
                $("#modifiedAt").html(response.CreatedAt);
            }
        },
    });
}

function SubmitCompanySetup(action) {
   
    if (!ValidateCompanySetup()) return false;

    App.showLoader();

    var model = {
        CompEmpCodePrefix: $("#codeprifx").val().toUpperCase().trim(),
        CompEmpCodeSuffix: $("#codesuffix").val(),
        TempEmpCodePrefix: $("#tcodeprifx").val().toUpperCase().trim(),
        TempEmpCodeSuffix: $("#tcodesuffix").val(),

        ClientPrefix: $("#tclientprifx").val().toUpperCase().trim(),
        ClientSuffix: $("#tclientsuffix").val(),

        SitePrefix: $("#tsiteprifx").val().toUpperCase().trim(),
        SiteSuffix: $("#tsitesuffix").val(),

        EnquiryPrefix: $("#enquiryprifx").val().toUpperCase().trim(),
        EnquirySuffix: $("#enquirysuffix").val(),

        ComplaintPrefix: $("#complaintprifx").val().toUpperCase().trim(),
        ComplaintSuffix: $("#complaintsuffix").val(),

        FeedbackPrefix: $("#feedbackprifx").val().toUpperCase().trim(),
        FeedbackSuffix: $("#feedbacksuffix").val(),

        TendorPrefix: $("#tendorprifx").val().toUpperCase().trim(),
        TendorSuffix: $("#tendorsuffix").val(),

        LeadPrefix: $("#leadprifx").val().toUpperCase().trim(),
        LeadSuffix: $("#leadsuffix").val(),

        PartyPrefix: $("#partyprifx").val().toUpperCase().trim(),
        PartySuffix: $("#partysuffix").val(),

        ContractPrefix: $("#Contractprifx").val().toUpperCase().trim(),
        ContractSuffix: $("#Contractsuffix").val(),

        PostingOrderPrefix: $("#PoPrifix").val().toUpperCase().trim(),
        PostingOrderSuffix: $("#Posuffix").val(),

        VendorPrefix: $("#Vendorprifx").val().toUpperCase().trim(),
        VendorSuffix: $("#Vendorsuffix").val(),

        Designationprifx: $("#Designationprifx").val().toUpperCase().trim(),
        Designationsuffix: $("#Designationsuffix").val(),

        ItemPrifx: $("#Itemprifx").val().toUpperCase().trim(),
        ItemSuffix: $("#Itemsuffix").val()
    };

    $.ajax({
        type: "POST",
        url: BaseUrl + "SubmitCompanySetup",
        headers: { "Authorization": "Bearer " + accessToken },
        data: JSON.stringify(model),
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            debugger
            App.hideLoader();

            if (response.IsSuccess) {
                showToast(response.Message, "success");
                ClearAll();
                GetCompanySetupDetails('VIEW');
            } else {
                showToast(response.Message, "error");
            }
        },
        error: function () {
            App.hideLoader();
            showToast("Something Went Wrong", "error");
        }
    });
}


function ValidateCompanySetup() {
    var isSetupValid = true;

    ClearErrorMessage();

    var codesuffix= $("#codesuffix").val();
    var tcodeprifx = $("#tcodeprifx").val();
    var tclientprifx = $("#tclientprifx").val();
    var tclientsuffix = $("#tclientsuffix").val();
    var tsiteprifx = $("#tsiteprifx").val();
    var tsitesuffix = $("#tsitesuffix").val();

    if (codesuffix=="") {
        $('#lblerr_codesuffix').text('Please Enter Suffix Of Code !').fadeIn(1000);
        isSetupValid = false;
    }
    if (tcodeprifx == "") {
        $('#lblerr_tcodeprifx').text('Please Enter Prix Of Code !').fadeIn(1000);
        isSetupValid = false;
    }
    if (tclientprifx=="") {
        $('#lblerr_tclientprifx').text('Please Enter Pri Of Client !').fadeIn(1000);
        isSetupValid = false;
    }
    if (tclientsuffix == "") {
        $('#lblerr_tclientprifx').text('Please Enter Pri Of Client !').fadeIn(1000);
        isSetupValid = false;
    }
    if (tsiteprifx == "") {
        $('#lblerr_tsiteprifx').text('Please Enter Prix Of Site !').fadeIn(1000);
        isSetupValid = false;
    }
    if (tsitesuffix == "") {
        $('#lblerr_tsitesuffix').text('Please Enter Suffix Of Site !').fadeIn(1000);
        isSetupValid = false;
    }

    return isSetupValid;
}

function ClearAll() {
    $("#tcodeprifx").val('');
    $("#tcodesuffix").val('');
    $("#codeprifx").val('');
    $("#codesuffix").val('');
    $("#codelength").val('');
    $('#modifby').html('');
    $('#modifat').html('');
}

function ClearErrorMessage() {
    $('#lblerr_codeprifx').empty();
    $('#lblerr_codesuffix').empty();
    $('#lblerr_tcodeprifx').empty();
    $('#lblerr_tcodesuffix').empty();
    $('#lblerr_codelength').empty();

    $('#lblerr_tclientprifx').empty();
    $('#lblerr_tclientsuffix').empty();
    $('#lblerr_tsiteprifx').empty();
    $('#lblerr_tsitesuffix').empty();
    $('#lblerr_tendorprifx').empty();
    $('#lblerr_tendorsuffix').empty();
    $('#lblerr_leadprifx').empty();
    $('#lblerr_leadsuffix').empty();

    $('#lblerr_Contractprifx').empty();
    $('#lblerr_Contractsuffix').empty();
    $('#lblerr_Designationprifx').empty();
    $('#lblerr_Designationsuffix').empty();
    $('#lblerr_Vendorprifx').empty();
    $('#lblerr_Vendorsuffix').empty();
}

function isNumber(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
}

function ValidateAlpha(evt) {
    evt = (evt) ? evt : window.event;
    var keyCode = (evt.which) ? evt.which : evt.keyCode;
    if ((keyCode < 48 || keyCode > 57) && (keyCode < 65 || keyCode > 90) && (keyCode < 97 || keyCode > 122) && keyCode != 32) {
        return false;
    }
    return true;
}

function ValidateAlpha1(evt) {
    evt = (evt) ? evt : window.event;
    var keyCode = (evt.which) ? evt.which : evt.keyCode;
    if ((keyCode < 65 || keyCode > 90) && (keyCode < 97 || keyCode > 122) && keyCode != 32) {
        return false;
    }
    return true;
}