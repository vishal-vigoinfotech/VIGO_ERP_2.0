using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;

namespace VIGO_ERP_2._0.ApiControllers
{
    [RoutePrefix("api/SuperAdmin")]
    public class SuperAdminController : ApiController
    {
        [HttpGet]
        [Route("Index")]
        public IHttpActionResult Index()
        {
            if (HttpContext.Current.Session["SuperAdmin"] == null)
                return Unauthorized();

            return Ok(new { message = "Welcome Super Admin" });
        }
    }

}
