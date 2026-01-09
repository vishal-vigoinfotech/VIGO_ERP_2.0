using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace VIGO_ERP_2._0.Utilities
{
    public class Constants
    {
        public class NewBusiness
        {
            public const string NoRecords = "No Records Found.";
            public const string Exception = "Exception Occured !";
            public const string ExceptionCode = "444";
            public const string InvalidRequest = "Invalid Request !";

        }

        public static class Common
        {
            public const string FieldType = "FIELD";
            public const string InvalidUser = "InvalidUser";
            public const string UnathorizationAccess = "Unathorized Access";
            public const string SessionExpired = "Session Expired";
            public const string EXCEPTION = "Err: " + "An Error has Occurred.";
        }
    }
}