using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Diagnostics;
using System.Net;
using System.Net.Http;
using System.Net.Mail;
using System.Security.Claims;
using System.Threading;

using System.Web.Configuration;
using System.Web.Http;
using System.Web.Script.Serialization;
using VIGO_ERP_2._0.Models;
using VIGO_ERP_2._0.StoreProcedures;

namespace VIGO_ERP_2._0.Utilities
{
    public class Utility_CP
    {
        public static string connectionString = WebConfigurationManager.ConnectionStrings["LNC_ERPConnectionString"].ConnectionString;

        public Utility_CP()
        {
            //
            // TODO: Add constructor logic here
            //
        }

        public static int GenerateRandomCode()
        {
            int _min = 0001;
            int _max = 9999;
            Random _rdm = new Random();
            return _rdm.Next(_min, _max);
        }
        private static object GetDbValue(string value)
        {
            if (string.IsNullOrWhiteSpace(value))
                return DBNull.Value;

            return Utility_CP.GetSafeString(value);
        }

        public static string ConvertToDDMMYYY(string date)
        {
            if (date != null && date != string.Empty)  //This If Condition Added By Faiz
            {
                string formattedDate = string.Empty;
                string[] dates;
                if (date.Contains("/"))
                    dates = date.Split(new string[] { "/" }, StringSplitOptions.RemoveEmptyEntries);
                else
                    dates = date.Split(new string[] { "-" }, StringSplitOptions.RemoveEmptyEntries);

                if (dates[0].Length == 1)
                    dates[0] = "0" + dates[0];
                if (dates.Count() > 1)
                {
                    if (dates[1].Length == 1)
                        dates[1] = "0" + dates[1];
                    return formattedDate = dates[1] + "-" + dates[0] + "-" + dates[2];
                }
                else
                    return date;
            }
            return null;
        }

        public static string UserRole()
        {
            try
            {
                if (HttpContext.Current.Session["UserRole"] != null)
                {
                    return (HttpContext.Current.Session["UserRole"].ToString());
                }
            }
            catch (Exception ex)
            {
                var userClaim = GetUserClaims();
                if (userClaim != null)
                {
                    return userClaim.Role;
                }
            }
            return null;
        }

        public static Common_BO.UserDetails GetUserClaims()
        {
            try
            {
                try
                {
                    Common_BO.UserDetails _usrDetails = new Common_BO.UserDetails();
                    var identity = (ClaimsIdentity)HttpContext.Current.User.Identity;
                    IEnumerable<Claim> claims = identity.Claims;
                    if (_usrDetails != null)
                    {
                        _usrDetails.UserId = new Guid(claims.Where(c => c.Type == "UserId").Select(c => c.Value).FirstOrDefault().ToString());
                        _usrDetails.Name = claims.Where(c => c.Type == "UserName").Select(c => c.Value).FirstOrDefault().ToUpper().ToString();
                        _usrDetails.Email = claims.Where(c => c.Type == "Email").Select(c => c.Value).FirstOrDefault().ToString();
                        _usrDetails.Role = claims.Where(c => c.Type == "UserRole").Select(c => c.Value).FirstOrDefault().ToString();
                        _usrDetails.CompId = Convert.ToInt32(claims.Where(c => c.Type == "CompId").Select(c => c.Value).FirstOrDefault().ToString());
                        //_usrDetails.Designation = claims.Where(c => c.Type == "DESIGNATION").Select(c => c.Value).FirstOrDefault().ToUpper().ToString();
                        //_usrDetails.UserFullName = claims.Where(c => c.Type == "FullName").Select(c => c.Value).FirstOrDefault().ToUpper().ToString();
                        //_usrDetails.DeviceInfo = claims.Where(c => c.Type == "DeviceInfo").Select(c => c.Value).FirstOrDefault().ToUpper().ToString();
                        //_usrDetails.DeviceIp = claims.Where(c => c.Type == "DeviceIp").Select(c => c.Value).FirstOrDefault().ToUpper().ToString();
                        return _usrDetails;
                    }
                    return null;
                }
                catch (Exception ex)
                {
                    HttpResponseMessage msg = new HttpResponseMessage(HttpStatusCode.Redirect);
                    msg.Content = new StringContent(StoreProcedure.SuperAdmin.Common.SessionExpired);
                    throw new HttpResponseException(msg);
                }

            }
            catch (Exception ex)
            {
                return null;
            }

        }

        public enum Action
        {
            INSERT = 1, MODIFY = 2, DELETE = 3, VIEW = 4, EDIT = 5, EXCEPTION = 6
        }

        public static string GetJSONString(string JsonList)
        {
            var json = new JavaScriptSerializer().Serialize(JsonList);
            return json;
        }

        public static string ConvertDataSetToJSONString(DataTable dt)
        {
            var lst = dt.AsEnumerable()
        .Select(r => r.Table.Columns.Cast<DataColumn>()
                .Select(c => new KeyValuePair<string, object>(c.ColumnName, r[c.Ordinal])
               ).ToDictionary(z => z.Key, z => z.Value != null ? Utility_CP.GetSafeString(z.Value.ToString(), true) : null)
        ).ToList();
            //now serialize it
            var serializer = new System.Web.Script.Serialization.JavaScriptSerializer();
            serializer.MaxJsonLength = Int32.MaxValue;
            return serializer.Serialize(lst);
        }

        public static string GetSafeString(string str, bool safe)
        {
            if (safe)
            {
                return HttpUtility.HtmlEncode(str);
            }
            return str;
        }

        public static string GetSafeString(string str)
        {
            if (str != null && str.Length > 1 && !string.IsNullOrEmpty(str))
            {
                return HttpUtility.HtmlEncode(str);
            }
            else return DBNull.Value.ToString();
        }

        public static string IsNullOrEmptyString(string value)
        {
            if (value != null || value != string.Empty)
            {
                return value;
            }
            return null;
        }
        public static string GetTextStandardCasing(string value)    //Here '||' Is Changed In '&&' By Himanshu
        {
            if (value != null && value != string.Empty) {
                return System.Threading.Thread.CurrentThread.CurrentCulture.TextInfo.ToTitleCase(value.ToLower()); 
            }
            return null;
        }
        public static string IpAddress()
        {

            string strIpAddress;

            // THIS ADDRESS CAN BE SPOOFED - REMIVE AFTER DEMO
            strIpAddress = HttpContext.Current.Request.ServerVariables["HTTP_X_FORWARDED_FOR"];


            if (strIpAddress == null)

                strIpAddress = HttpContext.Current.Request.ServerVariables["REMOTE_ADDR"];

            return strIpAddress;

        }

        public static void SendEmail(string from, string to, string body, string subject)
        {
            try
            {
                MailMessage message = new MailMessage();
                message.From = new MailAddress(from);
                message.To.Add(new MailAddress(to));
                message.Subject = subject;
                message.Body = body;
                message.IsBodyHtml = true;
                SmtpClient client = new SmtpClient();
                client.Send(message);

                //Log("Send Email " + ex.Message, AuditDAL.Email.Exception);
            }
            catch (Exception ex)
            {


            }
        }

        //public static void SendEmail(string to, string body, string subject)
        //{
        //    try
        //    {
        //        //var usr = new UserDataContext();

        //        // TAKE DEFAULT SETTINGS
        //        var message = new SendGridMessage();
        //        message.From = new MailAddress(WebConfigurationManager.AppSettings["SupportEmail"]);
        //        message.AddTo(to);
        //        message.Subject = subject;
        //        message.Html = body;

        //        var credentials = new NetworkCredential("azure_9a292e7a8ba7e144014a30bd24a38ded@azure.com", "0gu8HfsYQnWF3EK");


        //        // Create an Web transport for sending email.
        //        var transportWeb = new Web(credentials);

        //        // Send the email, which returns an awaitable task.\
        //        Thread.Sleep(3000);
        //        transportWeb.DeliverAsync(message);
        //        Thread.Sleep(2000);


        //        //}
        //    }
        //    catch (Exception ex)
        //    {
        //        //Exception
        //        //ExceptionLog(ex, "", "Email.cs", "SendEmail");
        //        StackTrace trace = new StackTrace(ex, true);
        //        StackFrame stackFrame = trace.GetFrame(trace.FrameCount - 1);
        //        string fileName = stackFrame.GetFileName();
        //        string methodName = stackFrame.GetMethod().Name;
        //        int lineNo = stackFrame.GetFileLineNumber();
        //        //log
        //        //Log("Send Email " + ex.Message, AuditDAL.Email.Exception);


        //    }
        //}

        public static void RedirectToLogin()
        {
            HttpContext.Current.Response.Redirect("~/LoginNew.aspx");
        }
    }
}