using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Diagnostics;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
using System.Web;
using VIGO_ERP_2._0.DAL;

namespace VIGO_ERP_2._0.Utilities
{
    public class AutoMailing
    {
        public static async Task<string> CheckAndSendMail(int MailType)
        {
            await Task.Delay(5000);
            string MailSentStats = "";
            try
            {
                MailSentStats = CheckandSendMail_Code();
            }
            catch (Exception ex)
            {
                StackTrace trace = new StackTrace(ex, true);
                StackFrame stackFrame = trace.GetFrame(trace.FrameCount - 1);
                InsertExcecptionInLicenseException(ex.Message.ToString(), ex.GetType().FullName, DateTime.Now.ToString("dd-MM-yyyy"), stackFrame.GetFileLineNumber(), ex.StackTrace);
            }
            return MailSentStats;
        }

        public static string CheckandSendMail_Code()
        {
            DataTable LicenseByGroupId = new DataTable();
            string output = null;
            int differenceInDays = 0;
            try
            {
                DataTable GroupMasterList = GetGroupMaster();
                for (int i = 0; i < Convert.ToInt32(GroupMasterList.Rows.Count.ToString()); i++)
                {
                    LicenseByGroupId = GetAllLicenseByGraoupId(Convert.ToInt32(GroupMasterList.Rows[i]["LicGroupId"].ToString()));
                    if (LicenseByGroupId.Rows.Count > 0)
                    {
                        for (int j = 0; j < Convert.ToInt32(LicenseByGroupId.Rows.Count.ToString()); j++)
                        {
                            output = "";

                            output = SendEmailForExpiringLicense(GroupMasterList, LicenseByGroupId, i, j);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                StackTrace trace = new StackTrace(ex, true);
                StackFrame stackFrame = trace.GetFrame(trace.FrameCount - 1);
                InsertExcecptionInLicenseException(ex.Message.ToString(), ex.GetType().FullName, DateTime.Now.ToString("dd-MM-yyyy"), stackFrame.GetFileLineNumber(), ex.StackTrace);
            }
            return output;
        }


        public static string SendEmailForExpiringLicense(DataTable GroupMasterList, DataTable LicenseByGroupId, int GroupMaster_IV, int LicenseMaster_IV)
        {
            string output = null;
            string[] CCMailIds = null;
            string cmpMail = "noreply.smarterp@innovision.co.in"; //"enquiry.vigoinfotech@gmail.com";
            string cmpPassword = "wvazbkhzgxhkqwjg";//"vnyoqijtblehwhdo"; 

            string NoteString = "";

            try
            {
                if (GroupMasterList.Rows[GroupMaster_IV]["NotificationIn7Days"].ToString() == "1")
                {
                    NoteString = "\n*Note that you will be notified about this in every 7 days until last day!!";
                }

                SmtpClient client1 = new SmtpClient("smtp.gmail.com", 587)
                {
                    Credentials = new NetworkCredential(cmpMail, cmpPassword),
                    EnableSsl = true
                };

                MailMessage mailMessage = new MailMessage
                {
                    From = new MailAddress(cmpMail),
                    Subject = "License number : " + LicenseByGroupId.Rows[LicenseMaster_IV]["LicenseNumber"].ToString() + " is expiring very soon!!",
                    Body = "\n\n\nDear " + GroupMasterList.Rows[GroupMaster_IV]["MailReciversname"].ToString() + ",\n\nThis mail is sent to inform you that the License Number " + LicenseByGroupId.Rows[LicenseMaster_IV]["LicenseNumber"].ToString() + " is expiring in next " + LicenseByGroupId.Rows[LicenseMaster_IV]["DateDifference"].ToString() + " days.\nPlease look into this matter!!!" +
                "\n\n\nFollowing are the license's details" +
                "\nLicense Name  :  " + LicenseByGroupId.Rows[LicenseMaster_IV]["LicenseName"].ToString() +
                "\nLicense Number  :  " + LicenseByGroupId.Rows[LicenseMaster_IV]["LicenseNumber"].ToString() +
                "\nLicense group Name  :  " + GroupMasterList.Rows[GroupMaster_IV]["LicGroupName"].ToString() +
                "\nLicense Valid From  :  " + LicenseByGroupId.Rows[LicenseMaster_IV]["LicenseStartDate"].ToString() +
                "\nLicense To  :  " + LicenseByGroupId.Rows[LicenseMaster_IV]["LicenseValidUpto"].ToString() +
                "\n\n\nBest Regards" + NoteString,
                };
                mailMessage.To.Add(GroupMasterList.Rows[GroupMaster_IV]["LicMailId"].ToString());
                if (GroupMasterList.Rows[GroupMaster_IV]["LicCC"].ToString().Trim().Contains(";"))
                {
                    CCMailIds = GroupMasterList.Rows[GroupMaster_IV]["LicCC"].ToString().Split(';');
                    foreach (var ccId in CCMailIds)
                    {
                        mailMessage.CC.Add(ccId);
                    }
                }
                else
                {
                    mailMessage.CC.Add(GroupMasterList.Rows[GroupMaster_IV]["LicCC"].ToString());
                }

                client1.Send(mailMessage);
                UpdateLicenseSentDataByid(Convert.ToInt32(LicenseByGroupId.Rows[LicenseMaster_IV]["LicenseId"].ToString()));
                output = "Mail Sent Succesfully";
            }
            catch (Exception ex)
            {
                StackTrace trace = new StackTrace(ex, true);
                StackFrame stackFrame = trace.GetFrame(trace.FrameCount - 1);
                InsertExcecptionInLicenseException(ex.Message.ToString(), ex.GetType().FullName, DateTime.Now.ToString("dd-MM-yyyy"), stackFrame.GetFileLineNumber(), ex.StackTrace);
                return "Error in sending mail! Contact Admin : " + ex.Message.ToString();
            }
            return output;
        }

        public static DataTable GetAllLicenseByGraoupId(int GroupId)
        {
            DataTable LicenseMasterList = new DataTable();
            try
            {
                string spName = "SP_CM_LicenseMaster_AutoMail";
                var ds = new DataSet();
                {
                    SqlConnection con = new SqlConnection(Utility.connectionString);
                    con.Open();

                    SqlCommand command = new SqlCommand(spName, con);
                    List<SqlParameter> lstSql = new List<SqlParameter>();
                    lstSql.Add(new SqlParameter("@Action", 2));
                    lstSql.Add(new SqlParameter("@GroupId", GroupId));
                    SqlParameter[] sqlParam = lstSql.ToArray();
                    ds = SqlHelper.ExecuteDataset(con, CommandType.StoredProcedure, spName, sqlParam);

                    if (ds.Tables.Count > 0)
                    {
                        LicenseMasterList = ds.Tables[0];
                    }
                }
            }
            catch (Exception ex)
            {
                StackTrace trace = new StackTrace(ex, true);
                StackFrame stackFrame = trace.GetFrame(trace.FrameCount - 1);
                InsertExcecptionInLicenseException(ex.Message.ToString(), ex.GetType().FullName, DateTime.Now.ToString("dd-MM-yyyy"), stackFrame.GetFileLineNumber(), ex.StackTrace);
            }
            return LicenseMasterList;
        }

        public static DataTable GetGroupMaster()
        {
            DataTable GroupMasterList = new DataTable();
            try
            {
                string spName = "SP_CM_LicenseMaster_AutoMail";
                var ds = new DataSet();
                {
                    SqlConnection con = new SqlConnection(Utility.connectionString);
                    con.Open();

                    SqlCommand command = new SqlCommand(spName, con);
                    List<SqlParameter> lstSql = new List<SqlParameter>();
                    lstSql.Add(new SqlParameter("@Action", 1));
                    SqlParameter[] sqlParam = lstSql.ToArray();
                    ds = SqlHelper.ExecuteDataset(con, CommandType.StoredProcedure, spName, sqlParam);

                    if (ds.Tables.Count > 0)
                    {
                        GroupMasterList = ds.Tables[0];
                    }
                }
            }
            catch (Exception ex)
            {
                StackTrace trace = new StackTrace(ex, true);
                StackFrame stackFrame = trace.GetFrame(trace.FrameCount - 1);
                InsertExcecptionInLicenseException(ex.Message.ToString(), ex.GetType().FullName, DateTime.Now.ToString("dd-MM-yyyy"), stackFrame.GetFileLineNumber(), ex.StackTrace);
            }
            return GroupMasterList;
        }

        public static DataTable InsertExcecptionInLicenseException(string ExceptionMessage, string ExceptionType, string ExceptionAtTime, int ExceptionLine, string StackTrace)
        {
            DataTable LicenseMasterList = new DataTable();
            try
            {
                string spName = "SP_CM_LicenseMaster_AutoMail_ExceptionLog";
                var ds = new DataSet();
                {
                    SqlConnection con = new SqlConnection(Utility.connectionString);
                    con.Open();

                    SqlCommand command = new SqlCommand(spName, con);
                    List<SqlParameter> lstSql = new List<SqlParameter>();
                    lstSql.Add(new SqlParameter("@ExceptionMessage", ExceptionMessage));
                    lstSql.Add(new SqlParameter("@ExceptionLine", ExceptionLine));
                    lstSql.Add(new SqlParameter("@ExceotionAtTime", ExceptionAtTime));
                    lstSql.Add(new SqlParameter("@StackTrace", StackTrace));
                    lstSql.Add(new SqlParameter("@ExceptionType", ExceptionType));
                    SqlParameter[] sqlParam = lstSql.ToArray();
                    ds = SqlHelper.ExecuteDataset(con, CommandType.StoredProcedure, spName, sqlParam);
                }
            }
            catch (Exception ex)
            {

            }
            return LicenseMasterList;
        }

        public static DataTable UpdateLicenseSentDataByid(int LicenseId)
        {
            DataTable LicenseMasterList = new DataTable();
            try
            {
                string spName = "SP_CM_LicenseMaster_AutoMail";
                var ds = new DataSet();
                {
                    SqlConnection con = new SqlConnection(Utility.connectionString);
                    con.Open();

                    SqlCommand command = new SqlCommand(spName, con);
                    List<SqlParameter> lstSql = new List<SqlParameter>();
                    lstSql.Add(new SqlParameter("@Action", 3));
                    lstSql.Add(new SqlParameter("@LicenseId", LicenseId));
                    SqlParameter[] sqlParam = lstSql.ToArray();
                    ds = SqlHelper.ExecuteDataset(con, CommandType.StoredProcedure, spName, sqlParam);
                }
            }
            catch (Exception ex)
            {
                StackTrace trace = new StackTrace(ex, true);
                StackFrame stackFrame = trace.GetFrame(trace.FrameCount - 1);
                InsertExcecptionInLicenseException(ex.Message.ToString(), ex.GetType().FullName, DateTime.Now.ToString("dd-MM-yyyy"), stackFrame.GetFileLineNumber(), ex.StackTrace);
            }
            return LicenseMasterList;
        }
    }
}