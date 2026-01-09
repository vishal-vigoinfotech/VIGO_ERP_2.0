using Microsoft.AspNet.Identity;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using VIGO_ERP_2._0.StoreProcedures;
using VIGO_ERP_2._0.Utilities;
using static VIGO_ERP_2._0.Models.Admin_BO;
using static VIGO_ERP_2._0.Models.Common_BO;

namespace VIGO_ERP_2._0.DAL
{
    public class AdminDAL
    {
        public static CompanySetupModel GetCompanySetupDetails(int compId)
        {
            var model = new CompanySetupModel();
            string spName = StoreProcedure.SystemMasters.CompanySetup.sp_GetCompanySetupDetails;

            try
            {
                var ds = SqlHelper.ExecuteDataset(
                    Utility.connectionString,
                    CommandType.StoredProcedure,
                    spName,
                    new SqlParameter("@Action", 4),
                    new SqlParameter("@CompId", compId)
                );

                if (ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
                {
                    var dr = ds.Tables[0].Rows[0];

                    model.CompId = dr.Field<int?>("CompId") ?? 0;
                    model.TempEmpCodePrefix = dr["TempEmpCodePrefix"] as string;
                    model.TempEmpCodeSuffix = dr["TempEmpCodeSuffix"] as string;
                    model.CompEmpCodePrefix = dr["CompEmpCodePrefix"] as string;
                    model.CompEmpCodeSuffix = dr["CompEmpCodeSuffix"] as string;
                    model.CompEmpCodeLength = dr["CompEmpCodeLength"] as string;
                    model.ClientPrefix = dr["ClientPrefix"] as string;
                    model.ClientSuffix = dr["ClientSuffix"] as string;
                    model.SitePrefix = dr["SitePrefix"] as string;
                    model.SiteSuffix = dr["SiteSuffix"] as string;
                    model.EnquiryPrefix = dr["EnquiryPrefix"] as string;
                    model.EnquirySuffix = dr["EnquirySuffix"] as string;
                    model.ComplaintPrefix = dr["ComplaintPrefix"] as string;
                    model.ComplaintSuffix = dr["ComplaintSuffix"] as string;
                    model.FeedbackPrefix = dr["FeedbackPrefix"] as string;
                    model.FeedbackSuffix = dr["FeedbackSuffix"] as string;
                    model.TendorPrefix = dr["TendorPrefix"] as string;
                    model.TendorSuffix = dr["TendorSuffix"] as string;
                    model.LeadPrefix = dr["LeadPrefix"] as string;
                    model.LeadSuffix = dr["LeadSuffix"] as string;
                    model.PartyPrefix = dr["PartyPrefix"] as string;
                    model.PartySuffix = dr["PartySuffix"] as string;
                    model.ContractPrefix = dr["ContractPrefix"] as string;
                    model.ContractSuffix = dr["ContractSuffix"] as string;
                    model.ItemPrifx = dr["ItemPrifx"] as string;
                    model.ItemSuffix = dr["ItemSuffix"] as string;
                    model.VendorPrefix = dr["VendorPrefix"] as string;
                    model.VendorSuffix = dr["VendorSuffix"] as string;
                    model.Designationprifx = dr["Designationprifx"] as string;
                    model.Designationsuffix = dr["Designationsuffix"] as string;
                    model.PostingOrderPrefix = dr["PostingOrderPrefix"] as string;
                    model.PostingOrderSuffix = dr["PostingOrderSuffix"] as string;
                    model.FullName = dr["ModifiedBy"] as string;
                    model.CreatedAt = dr["ModifiedAt"] != DBNull.Value ? Convert.ToDateTime(dr["ModifiedAt"]): DateTime.MinValue;

                }
            }
            catch (Exception ex)
            {
                throw;
            }

            return model;
        }

        public static ApiResponse SubmitCompanySetup(CompanySetupModel _objRec)
        {
            string output = "";
            int Action = 2;
            var response = new ApiResponse();
            SqlConnection con = new SqlConnection(Utility.connectionString);
            try
            {
         
                string spName = StoreProcedure.SystemMasters.CompanySetup.sp_SubmitCompanySetup;
                con.Open();
                SqlCommand cmd = new SqlCommand(spName, con);
                cmd.Parameters.AddWithValue("@Action", Action);
                cmd.Parameters.AddWithValue("@CompId", Convert.ToInt16(_objRec.CompId));
                cmd.Parameters.AddWithValue("@CodePrifx", _objRec.CompEmpCodePrefix);
                cmd.Parameters.AddWithValue("@CodeSuffix", _objRec.CompEmpCodeSuffix);
                cmd.Parameters.AddWithValue("@TempCodePrifx", _objRec.TempEmpCodePrefix);
                cmd.Parameters.AddWithValue("@TempCodeSuffix", _objRec.TempEmpCodeSuffix);
                cmd.Parameters.AddWithValue("@ClientPrefix", _objRec.ClientPrefix);
                cmd.Parameters.AddWithValue("@ClientSuffix", _objRec.ClientSuffix);
                cmd.Parameters.AddWithValue("@SitePrefix", _objRec.SitePrefix);
                cmd.Parameters.AddWithValue("@SiteSuffix", _objRec.SiteSuffix);
                cmd.Parameters.AddWithValue("@EnquiryPrifx", _objRec.EnquiryPrefix);
                cmd.Parameters.AddWithValue("@EnquirySuffix", _objRec.EnquirySuffix);
                cmd.Parameters.AddWithValue("@ComplaintPrefix", _objRec.ComplaintPrefix);
                cmd.Parameters.AddWithValue("@ComplaintSuffix", _objRec.ComplaintSuffix);
                cmd.Parameters.AddWithValue("@FeedbackPrefix", _objRec.FeedbackPrefix);
                cmd.Parameters.AddWithValue("@FeedbackSuffix", _objRec.FeedbackSuffix);
                cmd.Parameters.AddWithValue("@TendorPrefix", _objRec.TendorPrefix);
                cmd.Parameters.AddWithValue("@TendorSuffix", _objRec.TendorSuffix);
                cmd.Parameters.AddWithValue("@LeadPrefix", _objRec.LeadPrefix);
                cmd.Parameters.AddWithValue("@LeadSuffix", _objRec.LeadSuffix);
                cmd.Parameters.AddWithValue("@PartyPrefix", _objRec.PartyPrefix);
                cmd.Parameters.AddWithValue("@PartySuffix", _objRec.PartySuffix);
                cmd.Parameters.AddWithValue("@ContractPrefix", _objRec.ContractPrefix);
                cmd.Parameters.AddWithValue("@ContractSuffix", _objRec.ContractSuffix);
                cmd.Parameters.AddWithValue("@PostingOrderPrefix", _objRec.PostingOrderPrefix);
                cmd.Parameters.AddWithValue("@PostingOrderSuffix", _objRec.PostingOrderSuffix);
                cmd.Parameters.AddWithValue("@VendorPrefix", _objRec.VendorPrefix);
                cmd.Parameters.AddWithValue("@VendorSuffix", _objRec.VendorSuffix);
                cmd.Parameters.AddWithValue("@Designationprifx", _objRec.Designationprifx);
                cmd.Parameters.AddWithValue("@Designationsuffix", _objRec.Designationsuffix);
                cmd.Parameters.AddWithValue("@ItemPrifx", _objRec.ItemPrifx);
                cmd.Parameters.AddWithValue("@ItemSuffix", _objRec.ItemSuffix);
                cmd.Parameters.AddWithValue("@ModifiedBy", _objRec.CreatedBy);
                cmd.CommandText = spName;
                cmd.CommandType = CommandType.StoredProcedure;
                output = Convert.ToInt32(cmd.ExecuteScalar()).ToString();

                if (output != null && Convert.ToInt32(output) > 0)
                {
                    response.IsSuccess = true;
                    response.Message = "Company setup saved successfully.";
                }
                else
                {
                    response.IsSuccess = false;
                    response.Message = "Company setup could not be saved.";
                }
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = "Something Went Wrong.";
            }
            return response;
        }


    }
}