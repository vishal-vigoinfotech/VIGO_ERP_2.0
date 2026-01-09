using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using VIGO_ERP_2._0.DAL;
using VIGO_ERP_2._0.Utilities;
using static VIGO_ERP_2._0.Models.Admin_BO;
using static VIGO_ERP_2._0.Models.Common_BO;

namespace VIGO_ERP_2._0.ApiControllers
{
    [RoutePrefix("api/Admin")]
    public class AdminController : ApiController
    {
        [Route("GetCompanySetupDetails")]
        [HttpPost]
        public IHttpActionResult GetCompanySetupDetails()
        {
            try
            {
                var userdtl = Utility.GetUserClaims();

                if (userdtl == null)
                {
                    return Content(HttpStatusCode.Unauthorized, new { message = "Session expired. Please login again." });
                }

                int compid = userdtl.CompId;
                var model = AdminDAL.GetCompanySetupDetails(compid);

                if (model == null)
                {
                    return Content(HttpStatusCode.NotFound, new { message = "No records found." });
                }

                return Ok(model);
            }
            catch (Exception ex)
            {
                return Content(HttpStatusCode.InternalServerError, new { message = "Something went wrong." });
            }
        }

        [Route("SubmitCompanySetup")]
        [HttpPost]
        public ApiResponse SubmitCompanySetup(CompanySetupModel companySetupModel)
        {
           
            var user = Utility.GetUserClaims();
            if (user == null)
            {
                HttpResponseMessage msg = new HttpResponseMessage(HttpStatusCode.Redirect);
                msg.Content = new StringContent(Constants.Common.SessionExpired);
                throw new HttpResponseException(msg);
            }

            try
            {
                CompanySetupModel _objRec = new CompanySetupModel
                {
                    CompEmpCodePrefix = Utility.IsNullOrEmptyString(companySetupModel.CompEmpCodePrefix),
                    CompEmpCodeSuffix = Utility.IsNullOrEmptyString(companySetupModel.CompEmpCodeSuffix),

                    TempEmpCodePrefix = Utility.IsNullOrEmptyString(companySetupModel.TempEmpCodePrefix),
                    TempEmpCodeSuffix = Utility.IsNullOrEmptyString(companySetupModel.TempEmpCodeSuffix),

                    ClientPrefix = Utility.IsNullOrEmptyString(companySetupModel.ClientPrefix),
                    ClientSuffix = Utility.IsNullOrEmptyString(companySetupModel.ClientSuffix),

                    SitePrefix = Utility.IsNullOrEmptyString(companySetupModel.SitePrefix),
                    SiteSuffix = Utility.IsNullOrEmptyString(companySetupModel.SiteSuffix),

                    EnquiryPrefix = Utility.IsNullOrEmptyString(companySetupModel.EnquiryPrefix),
                    EnquirySuffix = Utility.IsNullOrEmptyString(companySetupModel.EnquirySuffix),

                    ComplaintPrefix = Utility.IsNullOrEmptyString(companySetupModel.ComplaintPrefix),
                    ComplaintSuffix = Utility.IsNullOrEmptyString(companySetupModel.ComplaintSuffix),

                    FeedbackPrefix = Utility.IsNullOrEmptyString(companySetupModel.FeedbackPrefix),
                    FeedbackSuffix = Utility.IsNullOrEmptyString(companySetupModel.FeedbackSuffix),

                    TendorPrefix = Utility.IsNullOrEmptyString(companySetupModel.TendorPrefix),
                    TendorSuffix = Utility.IsNullOrEmptyString(companySetupModel.TendorSuffix),

                    LeadPrefix = Utility.IsNullOrEmptyString(companySetupModel.LeadPrefix),
                    LeadSuffix = Utility.IsNullOrEmptyString(companySetupModel.LeadSuffix),

                    PartyPrefix = Utility.IsNullOrEmptyString(companySetupModel.PartyPrefix),
                    PartySuffix = Utility.IsNullOrEmptyString(companySetupModel.PartySuffix),

                    ContractPrefix = Utility.IsNullOrEmptyString(companySetupModel.ContractPrefix),
                    ContractSuffix = Utility.IsNullOrEmptyString(companySetupModel.ContractSuffix),

                    PostingOrderPrefix = Utility.IsNullOrEmptyString(companySetupModel.PostingOrderPrefix),
                    PostingOrderSuffix = Utility.IsNullOrEmptyString(companySetupModel.PostingOrderSuffix),

                    VendorPrefix = Utility.IsNullOrEmptyString(companySetupModel.VendorPrefix),
                    VendorSuffix = Utility.IsNullOrEmptyString(companySetupModel.VendorSuffix),

                    Designationprifx = Utility.IsNullOrEmptyString(companySetupModel.Designationprifx),
                    Designationsuffix = Utility.IsNullOrEmptyString(companySetupModel.Designationsuffix),

                    ItemPrifx = Utility.IsNullOrEmptyString(companySetupModel.ItemPrifx),
                    ItemSuffix = Utility.IsNullOrEmptyString(companySetupModel.ItemSuffix),

                    CompId = user.CompId,
                    CreatedBy = user.UserId
                };

                var response = AdminDAL.SubmitCompanySetup(_objRec);
                return response;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

    }
}
