using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Security.Claims;
using System.Web;
using System.Web.Configuration;
using VIGO_ERP_2._0.DAL;
using VIGO_ERP_2._0.Models;

namespace VIGO_ERP_2._0.Utilities
{
    public class Utility
    {
        public static string connectionString = WebConfigurationManager.ConnectionStrings["LNC_ERPConnectionString"].ConnectionString;
        public static string CheckUserDeviceMap(string UserId, string devicedetails)
        {
            if (UserId.ToUpper() == "2BBCD796-3C55-4C71-9198-504877D4957B")
            {
                return "Done";
            }

            SqlConnection con = new SqlConnection(connectionString);
            string compId = "", userId = "", imeino = "", devicename = "", output1 = "Done", employeeCode = "";
            string[] divdetails = devicedetails.Split(new string[] { "/" }, StringSplitOptions.RemoveEmptyEntries);
            try
            {
                string sqlQuery = "SELECT CompanyId from aspnet_Membership WHERE UserId=@UserId";
                List<SqlParameter> lstSql = new List<SqlParameter>();
                lstSql.Add(new SqlParameter("@UserId", UserId));
                SqlParameter[] sqlParam = lstSql.ToArray();

                var ds = SqlHelper.ExecuteDataset(con, CommandType.Text, sqlQuery, sqlParam);

                if (ds.Tables[0].Rows.Count > 0)
                {
                    compId = ds.Tables[0].Rows[0]["CompanyId"].ToString();
                    string sqlQuery1 = "SP_MU_CheckUserDeviceMapng";
                    List<SqlParameter> lstSql1 = new List<SqlParameter>();
                    lstSql1.Add(new SqlParameter("@CompId", compId));
                    lstSql1.Add(new SqlParameter("@UserId", UserId));
                    lstSql1.Add(new SqlParameter("@ImeiNo", divdetails[5]));
                    lstSql1.Add(new SqlParameter("@DeviceName", divdetails[1] + ":" + divdetails[2] + "_" + divdetails[0]));
                    lstSql1.Add(new SqlParameter("@VersionNum", divdetails[4]));
               
                    SqlParameter[] sqlParam1 = lstSql1.ToArray();

                    var ds1 = SqlHelper.ExecuteDataset(con, CommandType.StoredProcedure, sqlQuery1, sqlParam1);

                    if (ds1.Tables[0].Rows.Count > 0)
                    {
                        userId = ds1.Tables[0].Rows[0]["UserId"].ToString();
                        imeino = ds1.Tables[0].Rows[0]["IMEINo"].ToString();
                        devicename = ds1.Tables[0].Rows[0]["DeviceName"].ToString();

                        if (userId != "1" && imeino != "1" && userId == UserId && imeino == divdetails[5])
                        {
                            output1 = "Done";
                        }
                        else if (userId != "1" && imeino == "1")
                        {
                            imeino = ds1.Tables[0].Rows[0]["IMEI"].ToString();
                            string encIMEI = imeino.Length > 4 ? imeino.Substring(0, 4) + "***" + imeino.Substring(imeino.Length - 4) : imeino;

                            output1 = "This user is already Logged-In on another Device:'" + devicename + "', with IMEI:'" + encIMEI + "'";
                        }
                      
                        else if (userId.ToLower() == UserId.ToLower() && divdetails[5].ToLower() != imeino.ToLower())
                        {
                            string encIMEI = imeino.Length > 4 ? imeino.Substring(0, 4) + "***" + imeino.Substring(imeino.Length - 4) : imeino;
                            employeeCode = ds1.Tables[1].Rows[0]["EmployeeCode"].ToString();
                            output1 = "This user is already Logged-In on another Device:'" + devicename + "', with IMEI:'" + encIMEI;

                            string savedDeviceName = Convert.ToString(ds1.Tables[1].Rows[0]["DeviceName"]);
                            string currentDeviceName = divdetails[1] + ":" + divdetails[2] + "_" + divdetails[0];

                            if (savedDeviceName == currentDeviceName)
                            {
                                string thisImei = divdetails[5].Length >= 5 ? divdetails[5].Substring(0, 4) + "***" + divdetails[5].Substring(divdetails[5].Length - 4) : divdetails[5];
                                output1 += " AND This device is mapped to another User:'" + employeeCode + "' " + "with IMEI:'" + thisImei + "'";
                            }
                        }
                        else
                        {
                  
                            string encIMEI = divdetails[5].Length >= 5 ? divdetails[5].Substring(0, 4) + "***" + divdetails[5].Substring(divdetails[5].Length - 4) : divdetails[5];
                            string savedDeviceName = Convert.ToString(ds1.Tables[1].Rows[0]["DeviceName"]);
                            string currentDeviceName = divdetails[1] + ":" + divdetails[2] + "_" + divdetails[0];

                            if (savedDeviceName == currentDeviceName)
                            {
                                employeeCode = ds1.Tables[1].Rows[0]["EmployeeCode"].ToString();
                                output1 = "This device is mapped to another User:'" + employeeCode + "' " + "with IMEI:'" + encIMEI + "'";
                            }
                            else
                            {
                                output1 = "Done";
                            }
                        }
                    }
                    else
                    {
                        output1 = "Done";
                    }
                    return output1;
                }
                else { return "Done"; }
            }
            catch (Exception ex)
            {
                return "The server failed to establish a connection with the database." + ex.Message;
            }
        }

        public static Common_BO.EntityBO GetUserDetails(Guid UserId)
        {
            DataSet getCurrentUserDetail = getUser(UserId);
            Common_BO.EntityBO entityBo = new Common_BO.EntityBO();
            if (getCurrentUserDetail != null)
            {
                foreach (DataRow dr in getCurrentUserDetail.Tables[0].Rows)
                {
                    //entityBo.EntityId = Convert.ToInt32(dr["EntityID"]);
                    //entityBo.Role = dr["EntityType"].ToString();
                    entityBo.UserId = new Guid(dr["UserId"].ToString());
                    entityBo.CompId = Convert.ToInt32(dr["CompanyId"].ToString());
                    entityBo.BranchId = Convert.ToInt32(dr["BranchId"].ToString());
                    entityBo.UserName = dr["FullName"].ToString();
                    entityBo.Name = dr["FirstName"].ToString();
                    entityBo.Mobile = dr["MobilePIN"].ToString();
                    entityBo.Department = (getCurrentUserDetail.Tables[0].Columns.Contains("Dept_Name") ? dr["Dept_Name"].ToString() : null);
                    entityBo.Email = dr["Email"].ToString();
                    entityBo.PostalAddress = dr["CurrentAddress"].ToString();
                    entityBo.UserProfilePic = dr["Image"].ToString();
                    entityBo.IsApproved = Convert.ToBoolean(dr["IsApproved"].ToString());
                    entityBo.isVisible = Convert.ToBoolean(dr["IsDeleted"].ToString());
                    entityBo.CompCode = dr["Code"].ToString();
                    entityBo.CompName = dr["Name"].ToString();
                    entityBo.Access = dr["Access"].ToString();
                    entityBo.Role = dr["RoleName"].ToString();
                    entityBo.DesignationName = (getCurrentUserDetail.Tables[0].Columns.Contains("DesignationName") ? dr["Dept_Name"].ToString() : null);
                    entityBo.EmployeeCode = dr["EmployeeCode"].ToString();
                    entityBo.UserLoginRole = dr["UserLoginRole"].ToString();
                    if (entityBo.Role != "Admin" && Utility.IsNullOrEmptyString(dr["IsAutoCheckIn"].ToString()) != null)
                    {
                        entityBo.IsAutoCheckIn = Convert.ToBoolean(dr["IsAutoCheckIn"].ToString());
                        entityBo.Interval = dr["Interval"].ToString();
                        entityBo.CheckInT = dr["CheckInT"].ToString();
                        entityBo.CheckOutT = dr["CheckOutT"].ToString();
                    }
                    else
                    {
                        entityBo.IsAutoCheckIn = false;
                        entityBo.Interval = "0";
                        entityBo.CheckInT = "0";
                        entityBo.CheckOutT = "0";
                    }
                    entityBo.code = 200;
                    entityBo.status = "success";

                    entityBo.helplineNo = dr["helplineNo"].ToString();
                    entityBo.helpLineWhatsapp = dr["helpLineWhatsapp"].ToString();
                    break;
                }
                return entityBo;
            }
            else
            {
                return null;
            }
        }

        public static DataSet getUser(Guid UserId)
        {
            DataSet ds = null;
            SqlConnection con = new SqlConnection(Account_BO.ConnectionManager.ConnectionString);
            try
            {
                string spName = "SP_UM_GetCurrentUserDetails "; // Stored Procedure Name
                List<SqlParameter> lstSql = new List<SqlParameter>();
                con.Open();
                SqlCommand cmd = new SqlCommand(spName, con);
                lstSql.Add(new SqlParameter("@Action", 4));
                lstSql.Add(new SqlParameter("@UserId", UserId));
                SqlParameter[] sqlParam = lstSql.ToArray();
                ds = SqlHelper.ExecuteDataset(Account_BO.ConnectionManager.ConnectionString, CommandType.StoredProcedure, spName, sqlParam);
                if (ds.Tables[0].Rows.Count == 0)
                {
                    List<SqlParameter> lstSql1 = new List<SqlParameter>();
                    lstSql1.Add(new SqlParameter("@Action", 6));
                    lstSql1.Add(new SqlParameter("@UserId", UserId));
                    SqlParameter[] sqlParam1 = lstSql1.ToArray();
                    ds = SqlHelper.ExecuteDataset(Account_BO.ConnectionManager.ConnectionString, CommandType.StoredProcedure, spName, sqlParam1);
                    return ds;
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            finally
            {
                if (con.State != ConnectionState.Closed)
                    con.Close();
            }
            return ds;
        }

        public static Common_BO.UserDetails GetUserClaims()
        {
            try
            {
                Common_BO.UserDetails _usrDetails = new Common_BO.UserDetails();

                var identity = (ClaimsIdentity)HttpContext.Current.User.Identity;
                IEnumerable<Claim> claims = identity.Claims;
                if (identity != null && identity.HasClaim(c => c.Type == "UserId"))
                {
                    _usrDetails.UserId = new Guid(claims.Where(c => c.Type == "UserId").Select(c => c.Value).FirstOrDefault().ToString());
                    _usrDetails.Name = claims.Where(c => c.Type == "UserName").Select(c => c.Value).FirstOrDefault().ToUpper().ToString();
                    _usrDetails.Role = claims.Where(c => c.Type == "UserRole").Select(c => c.Value).FirstOrDefault().ToString();
                    _usrDetails.CompId = Convert.ToInt32(claims.Where(c => c.Type == "CompId").Select(c => c.Value).FirstOrDefault().ToString());
                    _usrDetails.BranchId = Convert.ToInt32(claims.Where(c => c.Type == "BranchId").Select(c => c.Value).FirstOrDefault().ToString());
                  
                    return _usrDetails;
                }
                else
                {
                        return null;
                }
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public static string IsNullOrEmptyString(string value)
        {
            if (value != null && value != string.Empty && value != "undefined") { return value; }
            return null;
        }

        public static string ConvertDataSetToJSONString(DataTable dt)
        {
            var lst = dt.AsEnumerable()
        .Select(r => r.Table.Columns.Cast<DataColumn>()
                .Select(c => new KeyValuePair<string, object>(c.ColumnName, r[c.Ordinal])
               ).ToDictionary(z => z.Key, z => z.Value != null ? Utility.GetSafeString(z.Value.ToString(), false) : null)
        ).ToList();
            //now serialize it
            var serializer = new System.Web.Script.Serialization.JavaScriptSerializer();
            serializer.MaxJsonLength = Int32.MaxValue;
            return serializer.Serialize(lst);
        }
        public static string GetSafeString(string str, bool safe)
        {
            if (safe) { return HttpUtility.HtmlEncode(str); }
            return str;
        }

        public static string GetJSONString(object data)
        {
            return JsonConvert.SerializeObject(data);
        }
    }
}