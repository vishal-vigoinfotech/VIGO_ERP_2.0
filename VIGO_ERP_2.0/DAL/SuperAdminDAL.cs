using System;
using System.Data;
using System.Data.SqlClient;
using VIGO_ERP_2._0.Utilities;
using VIGO_ERP_2._0.StoreProcedures;
using System.Collections.Generic;
using System.Web.Security;
using VIGO_ERP_2._0.Models;

namespace VIGO_ERP_2._0.DAL
{
    public class SuperAdminDAL
    {
        //Start Company Management.
        #region Company Management.

        public static string ViewcompanyReport()
        {
            string output = "";
            SqlConnection con = new SqlConnection(Utility_CP.connectionString);
            try
            {
                string spName = StoreProcedure.SuperAdmin.CompanyManagement.sp_ViewcompanyReport;
                var ds = SqlHelper.ExecuteDataset(Utility_CP.connectionString, CommandType.StoredProcedure, spName);

                if (ds.Tables.Count > 0)
                {
                    output = Utility_CP.ConvertDataSetToJSONString(ds.Tables[0]);
                }
                else
                {
                    output = Utility_CP.GetJSONString(StoreProcedure.SuperAdmin.NewBusiness.NoRecords);
                }
            }
            catch (Exception ex)
            {
                output = ex.Message;
                output = StoreProcedure.SuperAdmin.Common.EXCEPTION;
            }
            finally
            {
                if (con.State != ConnectionState.Closed)
                    con.Close();
            }
            return output;

        }
        public static bool? GetCompExist(string CompanyCode)
        {
            bool? output1 = null;
            SqlConnection con = new SqlConnection(Utility_CP.connectionString);
            try
            {
                string sp_name = StoreProcedure.SuperAdmin.CompanyManagement.sp_GetCompExist;
                DataSet output = new DataSet();
                List<SqlParameter> lstSql = new List<SqlParameter>();
                lstSql.Add(new SqlParameter("@compcode", CompanyCode));
                SqlParameter[] sqlParam = lstSql.ToArray();
                var ds = SqlHelper.ExecuteDataset(con, CommandType.StoredProcedure, sp_name, sqlParam);
                if (ds.Tables[0].Rows.Count > 0)
                {
                    output1 = true;
                }
                else
                {
                    output1 = false;
                }
            }
            catch (Exception e)
            {
                return null;
            }
            return output1;
        }
        public static string CreateCompany(Utility_CP.Action enAction, SuperAdmin_BO.EmpRecruitment empRecruitmentBO)
        {
            string output = "";
            string code = "";
            int CompanyId = 0;
            SqlConnection con = new SqlConnection(Utility_CP.connectionString);
            try
            {
                if (empRecruitmentBO.CompanyCode != null)
                {
                    code = empRecruitmentBO.CompanyCode;
                }
                string spNameTemp = StoreProcedure.SuperAdmin.CompanyManagement.sp_CreateCompany;
                int actionTemp = 1;
                if (actionTemp == 1)
                {
                    con.Open();
                    SqlCommand cmd = new SqlCommand(spNameTemp, con);
                    cmd.Parameters.AddWithValue("@action", actionTemp);

                    cmd.Parameters.AddWithValue("@CompanyName", string.IsNullOrEmpty(empRecruitmentBO.CompanyName) ? (object)DBNull.Value : empRecruitmentBO.CompanyName);

                    cmd.Parameters.AddWithValue("@CompanyCode", string.IsNullOrEmpty(empRecruitmentBO.CompanyCode) ? (object)DBNull.Value : Utility_CP.GetSafeString(empRecruitmentBO.CompanyCode));

                    cmd.Parameters.AddWithValue("@OtherDetails", string.IsNullOrEmpty(empRecruitmentBO.OtherDetails) ? (object)DBNull.Value : Utility_CP.GetSafeString(empRecruitmentBO.OtherDetails));

                    cmd.Parameters.AddWithValue("@Address", string.IsNullOrEmpty(empRecruitmentBO.CompanyAddress) ? (object)DBNull.Value : empRecruitmentBO.CompanyAddress);

                    cmd.Parameters.AddWithValue("@Email", string.IsNullOrEmpty(empRecruitmentBO.Email) ? (object)DBNull.Value : Utility_CP.GetSafeString(empRecruitmentBO.Email));

                    cmd.Parameters.AddWithValue("@ContactNo", string.IsNullOrEmpty(empRecruitmentBO.Contact) ? (object)DBNull.Value : Utility_CP.GetSafeString(empRecruitmentBO.Contact));

                    cmd.Parameters.AddWithValue("@TotalLicenses", string.IsNullOrEmpty(empRecruitmentBO.License) ? (object)DBNull.Value : Utility_CP.GetSafeString(empRecruitmentBO.License));

                    cmd.Parameters.AddWithValue("@StartDate",
                        string.IsNullOrEmpty(empRecruitmentBO.StartDate) ? (object)DBNull.Value : Utility_CP.ConvertToDDMMYYY(empRecruitmentBO.StartDate));

                    cmd.Parameters.AddWithValue("@Enddate", string.IsNullOrEmpty(empRecruitmentBO.EndDate) ? (object)DBNull.Value : Utility_CP.ConvertToDDMMYYY(empRecruitmentBO.EndDate));

                    //No.ofLogins
                    cmd.Parameters.AddWithValue("@NoOfLogin", Convert.ToInt32(empRecruitmentBO.NoOfLogin) != 1 ? 0 : Convert.ToInt32(empRecruitmentBO.NoOfLogin));

                    cmd.Parameters.AddWithValue("@ModeOFPayment", string.IsNullOrEmpty(empRecruitmentBO.ModeOFPayment) ? (object)DBNull.Value : Utility_CP.GetSafeString(empRecruitmentBO.ModeOFPayment));

                    cmd.Parameters.AddWithValue("@APK", string.IsNullOrEmpty(empRecruitmentBO.APK) ? (object)DBNull.Value : Utility_CP.GetSafeString(empRecruitmentBO.APK));

                    //cmd.Parameters.AddWithValue("@APK", Convert.ToInt32(empRecruitmentBO.APK) !=1 ? 0 : Convert.ToInt32(empRecruitmentBO.APK));
                    cmd.Parameters.AddWithValue("@Aadhaar", empRecruitmentBO.Aadhaar);

                    cmd.Parameters.AddWithValue("@Bank", empRecruitmentBO.Bank);

                    cmd.Parameters.AddWithValue("@UAN", empRecruitmentBO.UAN);

                    cmd.Parameters.AddWithValue("@ClientV", empRecruitmentBO.ClientV);

                    cmd.Parameters.AddWithValue("@RecruitmentV", empRecruitmentBO.RecruitmentV);

                    cmd.CommandText = spNameTemp;
                    cmd.CommandType = CommandType.StoredProcedure;

                    CompanyId = Convert.ToInt32(cmd.ExecuteScalar());
                    if (CompanyId > 0)
                    {
                    }
                    con.Close();

                }

                MembershipCreateStatus status = MembershipCreateStatus.ProviderError;
                MembershipUser user = Membership.CreateUser(code + "/" + empRecruitmentBO.TempEmployeeCode, "Test@1234", empRecruitmentBO.Email, null, null, false, out status);
                if (user != null)
                {
                    string spName = "SP_CMM_ManageComapny";
                    con.Open();
                    SqlCommand cmd = new SqlCommand(spName, con);
                    cmd.Parameters.AddWithValue("@Action", 1);

                    if (!string.IsNullOrEmpty(user.ProviderUserKey.ToString()))
                        cmd.Parameters.AddWithValue("@UserId", new Guid(user.ProviderUserKey.ToString()));
                    else
                        cmd.Parameters.AddWithValue("@UserId", DBNull.Value);

                    cmd.Parameters.AddWithValue("@MobilePIN", string.IsNullOrWhiteSpace(empRecruitmentBO.Contact) ? (object)DBNull.Value : Utility_CP.GetSafeString(empRecruitmentBO.Contact));

                    cmd.Parameters.AddWithValue("@EmployeeCode", string.IsNullOrWhiteSpace(empRecruitmentBO.UserName) ? (object)DBNull.Value : Utility_CP.GetSafeString(empRecruitmentBO.UserName));

                    cmd.Parameters.AddWithValue("@FullName", string.IsNullOrWhiteSpace(empRecruitmentBO.FullName) ? (object)DBNull.Value : Utility_CP.GetSafeString(empRecruitmentBO.FullName));

                    cmd.Parameters.AddWithValue("@FirstName", string.IsNullOrWhiteSpace(empRecruitmentBO.FirstName) ? (object)DBNull.Value : Utility_CP.GetSafeString(empRecruitmentBO.FirstName));

                    cmd.Parameters.AddWithValue("@LastName", string.IsNullOrWhiteSpace(empRecruitmentBO.LastName) ? (object)DBNull.Value : Utility_CP.GetSafeString(empRecruitmentBO.LastName));

                    cmd.Parameters.AddWithValue("@Email", string.IsNullOrWhiteSpace(empRecruitmentBO.Email) ? (object)DBNull.Value : Utility_CP.GetSafeString(empRecruitmentBO.Email));

                    if (CompanyId > 0)
                        cmd.Parameters.AddWithValue("@CompanyId", CompanyId);
                    else
                        cmd.Parameters.AddWithValue("@CompanyId", DBNull.Value);

                    cmd.Parameters.AddWithValue("@IsApproved", 1);
                    cmd.Parameters.AddWithValue("@IsLockedOut", 0);
                    cmd.CommandText = spName;
                    cmd.CommandType = CommandType.StoredProcedure;

                    output = Convert.ToInt32(cmd.ExecuteScalar()).ToString();
                    con.Close();

                    return user.ProviderUserKey.ToString() + "#" + 1;
                }
            }
            catch (Exception ex)
            {
                output = ex.Message;
                output = StoreProcedure.SuperAdmin.Common.EXCEPTION;
                throw;
            }
            finally
            {
                if (con.State != ConnectionState.Closed)
                    con.Close();
            }
            return output + "#" + 0;
        }
        public static string UpdateCompany(Utility_CP.Action enAction, SuperAdmin_BO.EmpRecruitment empRecruitmentBO)
        {
            string output = "";
            SqlConnection con = new SqlConnection(Utility_CP.connectionString);
            try
            {
                string spNameTemp = StoreProcedure.SuperAdmin.CompanyManagement.sp_UpdateCompany;
                int actionTemp = 2;
                if (actionTemp == 2)
                {
                    con.Open();
                    SqlCommand cmd = new SqlCommand(spNameTemp, con);
                    cmd.Parameters.AddWithValue("@action", actionTemp);


                    cmd.Parameters.AddWithValue("@ID", string.IsNullOrEmpty(empRecruitmentBO.CompId) ? (object)DBNull.Value : empRecruitmentBO.CompId);

                    cmd.Parameters.AddWithValue("@CompanyName", string.IsNullOrEmpty(empRecruitmentBO.CompanyName) ? (object)DBNull.Value : empRecruitmentBO.CompanyName);

                    cmd.Parameters.AddWithValue("@CompanyCode", string.IsNullOrEmpty(empRecruitmentBO.CompanyCode) ? (object)DBNull.Value : Utility_CP.GetSafeString(empRecruitmentBO.CompanyCode));

                    cmd.Parameters.AddWithValue("@OtherDetails", string.IsNullOrEmpty(empRecruitmentBO.OtherDetails) ? (object)DBNull.Value : Utility_CP.GetSafeString(empRecruitmentBO.OtherDetails));

                    cmd.Parameters.AddWithValue("@Address", string.IsNullOrEmpty(empRecruitmentBO.CompanyAddress) ? (object)DBNull.Value : empRecruitmentBO.CompanyAddress);

                    cmd.Parameters.AddWithValue("@Email", string.IsNullOrEmpty(empRecruitmentBO.Email) ? (object)DBNull.Value : Utility_CP.GetSafeString(empRecruitmentBO.Email));

                    cmd.Parameters.AddWithValue("@ContactNo", string.IsNullOrEmpty(empRecruitmentBO.Contact) ? (object)DBNull.Value : Utility_CP.GetSafeString(empRecruitmentBO.Contact));

                    cmd.Parameters.AddWithValue("@TotalLicenses", string.IsNullOrEmpty(empRecruitmentBO.License) ? (object)DBNull.Value : Utility_CP.GetSafeString(empRecruitmentBO.License));

                    cmd.Parameters.AddWithValue("@StartDate",
                        string.IsNullOrEmpty(empRecruitmentBO.StartDate) ? (object)DBNull.Value : Utility_CP.ConvertToDDMMYYY(empRecruitmentBO.StartDate));

                    cmd.Parameters.AddWithValue("@Enddate", string.IsNullOrEmpty(empRecruitmentBO.EndDate) ? (object)DBNull.Value : Utility_CP.ConvertToDDMMYYY(empRecruitmentBO.EndDate));

                    cmd.Parameters.AddWithValue("@ModeOFPayment", string.IsNullOrEmpty(empRecruitmentBO.ModeOFPayment) ? (object)DBNull.Value : Utility_CP.GetSafeString(empRecruitmentBO.ModeOFPayment));

                    cmd.Parameters.AddWithValue("@APK", string.IsNullOrEmpty(empRecruitmentBO.APK) ? (object)DBNull.Value : Utility_CP.GetSafeString(empRecruitmentBO.APK));

                    cmd.Parameters.AddWithValue("@Aadhaar", empRecruitmentBO.Aadhaar);

                    cmd.Parameters.AddWithValue("@Bank", empRecruitmentBO.Bank);

                    cmd.Parameters.AddWithValue("@UAN", empRecruitmentBO.UAN);

                    cmd.Parameters.AddWithValue("@ClientV", empRecruitmentBO.ClientV);

                    cmd.Parameters.AddWithValue("@RecruitmentV", empRecruitmentBO.RecruitmentV);

                    cmd.CommandText = spNameTemp;
                    cmd.CommandType = CommandType.StoredProcedure;

                    output = Convert.ToInt32(cmd.ExecuteScalar()).ToString();

                    con.Close();
                }
                if (empRecruitmentBO.UserID != null)
                {
                    string spName = "SP_CMM_ManageComapny";
                    int action = 2;

                    if (action == 2)
                    {
                        con.Open();
                        SqlCommand cmd = new SqlCommand(spName, con);
                        cmd.Parameters.AddWithValue("@Action", action);

                        cmd.Parameters.AddWithValue("@UserId", string.IsNullOrWhiteSpace(empRecruitmentBO.UserID) ? (object)DBNull.Value : Utility_CP.GetSafeString(empRecruitmentBO.UserID));

                        cmd.Parameters.AddWithValue("@MobilePIN", string.IsNullOrWhiteSpace(empRecruitmentBO.Contact) ? (object)DBNull.Value : Utility_CP.GetSafeString(empRecruitmentBO.Contact));

                        cmd.Parameters.AddWithValue("@EmployeeCode", string.IsNullOrWhiteSpace(empRecruitmentBO.UserName) ? (object)DBNull.Value : Utility_CP.GetSafeString(empRecruitmentBO.UserName));

                        cmd.Parameters.AddWithValue("@FullName", string.IsNullOrWhiteSpace(empRecruitmentBO.FullName) ? (object)DBNull.Value : Utility_CP.GetSafeString(empRecruitmentBO.FullName));

                        cmd.Parameters.AddWithValue("@FirstName", string.IsNullOrWhiteSpace(empRecruitmentBO.FirstName) ? (object)DBNull.Value : Utility_CP.GetSafeString(empRecruitmentBO.FirstName));

                        cmd.Parameters.AddWithValue("@LastName", string.IsNullOrWhiteSpace(empRecruitmentBO.LastName) ? (object)DBNull.Value : Utility_CP.GetSafeString(empRecruitmentBO.LastName));

                        cmd.Parameters.AddWithValue("@Email", string.IsNullOrWhiteSpace(empRecruitmentBO.Email) ? (object)DBNull.Value : Utility_CP.GetSafeString(empRecruitmentBO.Email));

                        if (!string.IsNullOrEmpty(empRecruitmentBO.CompId))
                        {
                            cmd.Parameters.AddWithValue("@CompanyId", Utility_CP.GetSafeString(empRecruitmentBO.CompId));
                        }

                        cmd.Parameters.AddWithValue("@IsApproved", 1);
                        cmd.Parameters.AddWithValue("@IsLockedOut", 0);
                        cmd.CommandText = spName;
                        cmd.CommandType = CommandType.StoredProcedure;
                        output = Convert.ToInt32(cmd.ExecuteScalar()).ToString();
                        con.Close();
                        // return user.ProviderUserKey.ToString();
                    }
                }
            }
            catch (Exception ex)
            {
                output = ex.Message;
                output = Constants.Common.EXCEPTION;
            }
            finally
            {
                if (con.State != ConnectionState.Closed)
                    con.Close();
            }
            return output;
        }
        public static string ActiveDeactiveClients(string statusId, string clientId)
        {
            string output = "";
            SqlConnection con = new SqlConnection(Utility_CP.connectionString);
            try
            {
                if (statusId == "True")
                    statusId = "InActive";
                else
                    statusId = "Active";

                string spName = StoreProcedure.SuperAdmin.CompanyManagement.sp_ActiveDeactiveClients;
                con.Open();
                List<SqlParameter> lstSql = new List<SqlParameter>();
                lstSql.Add(new SqlParameter("@IasActive", statusId));
                lstSql.Add(new SqlParameter("@CompanyId", clientId));
                SqlParameter[] sqlParam = lstSql.ToArray();
                var ds = SqlHelper.ExecuteDataset(Utility_CP.connectionString, CommandType.StoredProcedure, spName, sqlParam);
                if (ds.Tables.Count > 0)
                {
                    output = Utility_CP.ConvertDataSetToJSONString(ds.Tables[0]);
                }
                else
                {
                    output = Utility_CP.GetJSONString(StoreProcedure.SuperAdmin.NewBusiness.NoRecords);
                }
            }
            catch (Exception ex)
            {
                output = ex.Message;
                output = StoreProcedure.SuperAdmin.Common.EXCEPTION;
            }
            finally
            {
                if (con.State != ConnectionState.Closed)
                    con.Close();
            }
            return output;
        }
        public static string GetCompanyDetailsById(int companyId)
        {
            string output = "";
            SqlConnection con = new SqlConnection(Utility_CP.connectionString);
            try
            {
                string spName = "SP_CMM_ManegeCompnay";
                con.Open();
                List<SqlParameter> lstSql = new List<SqlParameter>();
                lstSql.Add(new SqlParameter("@action", 4));
                lstSql.Add(new SqlParameter("@ID", companyId));
                SqlParameter[] sqlParam = lstSql.ToArray();
                var ds = SqlHelper.ExecuteDataset(Utility_CP.connectionString, CommandType.StoredProcedure, spName, sqlParam);
                if (ds.Tables.Count > 0)
                {
                    output = Utility_CP.ConvertDataSetToJSONString(ds.Tables[0]);
                }
                else
                {
                    output = Utility_CP.GetJSONString(Constants.NewBusiness.NoRecords);
                }
            }
            catch (Exception ex)
            {
                output = ex.Message;
                output = Constants.Common.EXCEPTION;
            }
            finally
            {
                if (con.State != ConnectionState.Closed)
                    con.Close();
            }
            return output;
        }
        #endregion

        #region PayRoll Setup
        public static string ViewSalaryReport()
        {
            string output = "";
            SqlConnection con = new SqlConnection(Utility.connectionString);
            try
            {
                string spName = StoreProcedure.SuperAdmin.ManageSalaryHeads.sp_ManageMasterSalaryComponent;
                con.Open();
                SqlCommand cmd = new SqlCommand(spName, con);
                cmd.Parameters.AddWithValue("@action", 4);
                cmd.CommandText = spName;
                cmd.CommandType = CommandType.StoredProcedure;
                SqlDataAdapter sda = new SqlDataAdapter(cmd);
                DataSet ds = new DataSet();
                sda.Fill(ds);
                if (ds.Tables.Count > 0)
                {
                    output = Utility.ConvertDataSetToJSONString(ds.Tables[0]);
                }
                else
                {
                    output = Utility.GetJSONString(Constants.NewBusiness.NoRecords);
                }
            }
            catch (Exception ex)
            {
                output = ex.Message;
                output = Constants.Common.EXCEPTION;
            }
            finally
            {
                if (con.State != ConnectionState.Closed)
                    con.Close();
            }
            return output;
        }
        #endregion

        #region Manage COmapny Module
        public static string GetModuleMasterReportList()
        {
            string output = "";
            SqlConnection con = new SqlConnection(Utility_CP.connectionString);
            try
            {
                // string spName = "sp_ModuleMaster"; // Stored Procedure Name
                string spName = StoreProcedure.SuperAdmin.ModuleMasterNew.sp_GetModuleMasterReportList;
                int actionTemp = 4;
                con.Open();
                SqlCommand cmd = new SqlCommand(spName, con);
                cmd.Parameters.AddWithValue("@action", actionTemp);
                cmd.CommandText = spName;
                cmd.CommandType = CommandType.StoredProcedure;
                SqlDataAdapter sda = new SqlDataAdapter(cmd);
                DataSet ds = new DataSet();
                sda.Fill(ds);
                if (ds.Tables.Count > 0)
                {
                    output = Utility_CP.ConvertDataSetToJSONString(ds.Tables[0]);
                }
                else
                {
                    output = Utility_CP.GetJSONString(Constants.NewBusiness.NoRecords);
                }
            }
            catch (Exception ex)
            {
                output = ex.Message;
                output = Constants.Common.EXCEPTION;
            }
            finally
            {
                if (con.State != ConnectionState.Closed)
                    con.Close();
            }
            return output;
        }
        public static string CreateModuleMaster(SuperAdmin_BO.EmpRecruitment empRecruitmentBO)
        {
            string output = "";
            bool? exist = GetModuleExist(Utility.IsNullOrEmptyString(empRecruitmentBO.ModuleId));
            if (exist != true)
            {
                SqlConnection con = new SqlConnection(Utility_CP.connectionString);
                try
                {
                    string spNameTemp = StoreProcedure.SuperAdmin.ModuleMasterNew.sp_CreateModuleMaster;
                    con.Open();
                    SqlCommand cmd = new SqlCommand(spNameTemp, con);
                    cmd.Parameters.AddWithValue("@action", 1);
                    cmd.Parameters.AddWithValue("@ModuleName", Utility_CP.IsNullOrEmptyString(empRecruitmentBO.ModuleName));
                    cmd.Parameters.AddWithValue("@ModuleCode", Utility_CP.IsNullOrEmptyString(empRecruitmentBO.ModuleCode));
                    cmd.Parameters.AddWithValue("@ModuleDescription", Utility_CP.IsNullOrEmptyString(empRecruitmentBO.ModuleDescription));
                    cmd.CommandText = spNameTemp;
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.ExecuteScalar();
                    con.Close();
                    output = "!#1";
                }
                catch (Exception ex)
                {
                    return null;
                }
            }
            else
            {
                output = "!#2";
            }
            return output;
        }
        public static string UpdateModule(SuperAdmin_BO.EmpRecruitment empRecruitmentBO)
        {
            string output = "";
            SqlConnection con = new SqlConnection(Utility_CP.connectionString);
            try
            {
                string spNameTemp = StoreProcedure.SuperAdmin.ModuleMasterNew.sp_UpdateModule;
                con.Open();
                SqlCommand cmd = new SqlCommand(spNameTemp, con);
                cmd.Parameters.AddWithValue("@action", 2);
                cmd.Parameters.AddWithValue("@ModuleId", Utility_CP.IsNullOrEmptyString(empRecruitmentBO.ModuleId));
                cmd.Parameters.AddWithValue("@ModuleName", Utility_CP.IsNullOrEmptyString(empRecruitmentBO.ModuleName));
                cmd.Parameters.AddWithValue("@ModuleCode", Utility_CP.IsNullOrEmptyString(empRecruitmentBO.ModuleCode));
                cmd.Parameters.AddWithValue("@ModuleDescription", Utility_CP.IsNullOrEmptyString(empRecruitmentBO.ModuleDescription));
                cmd.CommandText = spNameTemp;
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.ExecuteScalar();
                con.Close();
                output = "!#1";
            }
            catch (Exception ex)
            {
                return "!#2";
            }
            return output;
        }
        public static string ActiveDeactiveModule(SuperAdmin_BO.ViewRequirements_WithSearch _objVRWS)
        {
            string output = "";
            SqlConnection con = new SqlConnection(Utility_CP.connectionString);
            try
            {
                string spName = StoreProcedure.SuperAdmin.ModuleMasterNew.sp_ActiveDeactiveModule;
                con.Open();
                List<SqlParameter> lstSql = new List<SqlParameter>();
                lstSql.Add(new SqlParameter("@action", 5));
                lstSql.Add(new SqlParameter("@IsVisible", _objVRWS.statusId));
                lstSql.Add(new SqlParameter("@ModuleId", _objVRWS.moduleId));
                SqlParameter[] sqlParam = lstSql.ToArray();
                var ds = SqlHelper.ExecuteDataset(Utility_CP.connectionString, CommandType.StoredProcedure, spName, sqlParam);
                if (ds.Tables.Count > 0)
                {
                    output = Utility_CP.ConvertDataSetToJSONString(ds.Tables[0]);
                }
                else
                {
                    output = Utility_CP.GetJSONString(Constants.NewBusiness.NoRecords);
                }
            }
            catch (Exception ex)
            {
                return null;
            }
            finally
            {
                if (con.State != ConnectionState.Closed)
                    con.Close();
            }
            return output;
        }

        public static bool? GetModuleExist(string ModuleCode)
        {
            bool? output1 = null;
            string sp_name = StoreProcedure.SuperAdmin.ModuleMasterNew.sp_GetModuleExist;
            SqlConnection con = new SqlConnection(Utility.connectionString);
            try
            {
                DataSet output = new DataSet();
                List<SqlParameter> lstSql = new List<SqlParameter>();
                lstSql.Add(new SqlParameter("@action", 6));
                lstSql.Add(new SqlParameter("@ModuleCode", ModuleCode));
                SqlParameter[] sqlParam = lstSql.ToArray();
                var ds = SqlHelper.ExecuteDataset(con, CommandType.StoredProcedure, sp_name, sqlParam);
                if (ds.Tables[0].Rows.Count > 0)
                {
                    output1 = true;
                }
                else
                {
                    output1 = false;
                }
            }
            catch (Exception e)
            {
            }
            return output1;
        }
        #endregion

        #region Country Master
        public static string GetCountryDetails()
        {
            string output = "";
            SqlConnection con = new SqlConnection(Utility_CP.connectionString);
            try
            {
                string spName = StoreProcedure.SuperAdmin.Country.sp_GetCountryList;
                con.Open();
                SqlCommand cmd = new SqlCommand(spName, con);
                cmd.Parameters.AddWithValue("@action", 4);
                cmd.CommandText = spName;
                cmd.CommandType = CommandType.StoredProcedure;
                SqlDataAdapter sda = new SqlDataAdapter(cmd);
                DataSet ds = new DataSet();
                sda.Fill(ds);
                if (ds.Tables.Count > 0)
                {
                    output = Utility_CP.ConvertDataSetToJSONString(ds.Tables[0]);
                }
                else
                {
                    output = Utility_CP.GetJSONString(StoreProcedure.SuperAdmin.NewBusiness.NoRecords);
                }
            }
            catch (Exception ex)
            {
                output = ex.Message;
                output = StoreProcedure.SuperAdmin.Common.EXCEPTION;
            }
            finally
            {
                if (con.State != ConnectionState.Closed)
                    con.Close();
            }
            return output;
        }
        public static string CreateCountry(SuperAdmin_BO.country empRecruitmentBO)
        {
            string output;

            bool? exist = GetCountryExist(
                Utility_CP.IsNullOrEmptyString(empRecruitmentBO.CountryCode)
            );

            if (exist == true)
            {
                return "Country Code Already Exist!#2";
            }

            using (SqlConnection con = new SqlConnection(Utility_CP.connectionString))
            {
                try
                {
                    string spName = StoreProcedure.SuperAdmin.Country.sp_CreateCountry;

                    using (SqlCommand cmd = new SqlCommand(spName, con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@Action", 1);
                        cmd.Parameters.AddWithValue("@CountryName",Utility_CP.IsNullOrEmptyString(empRecruitmentBO.CountryName));
                        cmd.Parameters.AddWithValue("@CountryCode",Utility_CP.IsNullOrEmptyString(empRecruitmentBO.CountryCode));
                        con.Open();
                        cmd.ExecuteScalar();
                    }

                    output = "Country Created Successfully!#1";
                }
                catch (Exception)
                {
                    output = "Error occurred while creating country!#0";
                }
            }

            return output;
        }

        public static string UpdateCountry(string countryId, string name)
        {
            using (SqlConnection con = new SqlConnection(Utility_CP.connectionString))
            {
                try
                {
                    string spName = StoreProcedure.SuperAdmin.Country.sp_UpdateCountry;
                    con.Open();

                    SqlCommand cmd = new SqlCommand(spName, con);
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.AddWithValue("@Action", 2);
                    cmd.Parameters.AddWithValue("@CountryId", countryId);
                    cmd.Parameters.AddWithValue("@CountryName", name);

                    cmd.ExecuteScalar();
                    return "Country Updated Successfully!#1";
                }
                catch
                {
                    return "Update Failed!#0";
                }
            }
        }

        public static string DeleteCountry(string countryId)
        {
            using (SqlConnection con = new SqlConnection(Utility_CP.connectionString))
            {
                try
                {
                    string spName = StoreProcedure.SuperAdmin.Country.sp_DeleteCountry;
                    con.Open();

                    SqlCommand cmd = new SqlCommand(spName, con);
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.AddWithValue("@Action", 3);
                    cmd.Parameters.AddWithValue("@CountryId", countryId);

                    cmd.ExecuteScalar();
                    return "Country Deleted Successfully!#1";
                }
                catch
                {
                    return "Delete Failed!#0";
                }
            }
        }
        public static string SetCountryEnableDisable(string statusId, string CountryId)
        {
            string output = "";
            SqlConnection con = new SqlConnection(Utility_CP.connectionString);
            try
            {
                int isVisible = statusId == "Active" ? 0 : 1;

                string spName = StoreProcedure.SuperAdmin.Country.sp_SetCountryEnableDisable;
                con.Open();
                List<SqlParameter> lstSql = new List<SqlParameter>();
                lstSql.Add(new SqlParameter("@Action", 5));
                lstSql.Add(new SqlParameter("@CountryId", CountryId));
                lstSql.Add(new SqlParameter("@IsVisible", isVisible));
                SqlParameter[] sqlParam = lstSql.ToArray();
                var ds = SqlHelper.ExecuteDataset(Utility_CP.connectionString, CommandType.StoredProcedure, spName, sqlParam);
                if (ds.Tables.Count > 0)
                {
                    output = Utility_CP.ConvertDataSetToJSONString(ds.Tables[0]);
                }
                else
                {
                    output = Utility_CP.GetJSONString(StoreProcedure.SuperAdmin.NewBusiness.NoRecords);
                }
            }
            catch (Exception ex)
            {
                output = ex.Message;
                output = StoreProcedure.SuperAdmin.Common.EXCEPTION;
            }
            finally
            {
                if (con.State != ConnectionState.Closed)
                    con.Close();
            }
            return output;
        }

        public static bool GetCountryExist(string countryCode)
        {
            string spName = StoreProcedure.SuperAdmin.Country.sp_GetCountryExist;

            using (SqlConnection con = new SqlConnection(Utility_CP.connectionString))
            {
                SqlParameter[] sqlParam =
                {
            new SqlParameter("@Action", 6),
            new SqlParameter("@CountryCode", countryCode)
        };

                var ds = SqlHelper.ExecuteDataset(con, CommandType.StoredProcedure, spName, sqlParam);
                return ds.Tables[0].Rows.Count > 0;
            }
        }


        #endregion
    }
}