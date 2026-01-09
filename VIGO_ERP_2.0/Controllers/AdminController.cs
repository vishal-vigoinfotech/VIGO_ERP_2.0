using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using VIGO_ERP_2._0.DAL;
using VIGO_ERP_2._0.Models;
using VIGO_ERP_2._0.Utilities;
using static VIGO_ERP_2._0.Models.Common_BO;

namespace VIGO_ERP_2._0.Controllers
{
    public class AdminController : BaseController
    {

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Dashboard()
        {
            return View();
        }

        public ActionResult NoInternet()
        {
            return View();
        }

        public ActionResult CompanySetup()
        {
            return View();
        }

        public ActionResult ManageMaster()
        {
            return View();
        }

        public ActionResult ManageDesignation()
        {
            var model = new BreadcrumbViewModel
            {
                PageTitle = "Designation Master",
                Breadcrumbs = new List<BreadcrumbItem>
                {
                    new BreadcrumbItem{Title = "Manage Master",Url = Url.Action("ManageMaster","Admin")},
                    new BreadcrumbItem{Title = "Designation Master", Url = null}
                }
            };
            return View(model);
        }
    }
}