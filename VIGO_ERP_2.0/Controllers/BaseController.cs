using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace VIGO_ERP_2._0.Controllers
{
    public class BaseController : Controller
    {

        protected int CompId
        {
            get
            {
                return Session["CompId"] != null ? Convert.ToInt32(Session["CompId"]): 0;
            }
        }
        protected override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            if (Session["UserId"] == null)
            {
                filterContext.Result = new RedirectToRouteResult(
                    new RouteValueDictionary(
                        new { controller = "Account", action = "Login" }
                    )
                );
            }

            base.OnActionExecuting(filterContext);
        }
    }
}