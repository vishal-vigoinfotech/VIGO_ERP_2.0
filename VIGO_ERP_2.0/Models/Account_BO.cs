using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;

namespace VIGO_ERP_2._0.Models
{
    public class Account_BO
    {
        public class TokenResponse
        {
            public string access_token { get; set; }
            public string token_type { get; set; }
            public int expires_in { get; set; }
        }

        public class ConnectionManager
        {
            public static String ConnectionString
            {
                get { return ConfigurationManager.ConnectionStrings["LNC_ERPConnectionString"].ConnectionString; }
            }
        }
    }
}