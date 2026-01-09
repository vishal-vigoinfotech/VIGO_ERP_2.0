using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using VIGO_ERP_2._0.DAL;
using System.Web.Mvc;
using VIGO_ERP_2._0.StoreProcedures;
using VIGO_ERP_2._0.Models;
using VIGO_ERP_2._0.Utilities;

namespace VIGO_ERP_2._0.Controllers
{
    public class SuperAdminController : Controller
    {
        // GET: SuperAdmin by Subham
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult CompanyManagement()
        {
            var cmpList = SuperAdminDAL.ViewcompanyReport();
            return View();
        }
        public ActionResult ManageMasterSalaryHead() { return View(); }
        public ActionResult ModuleMasterNew() { return View(); }
        #region Manage Country Page 
        //Add By Himanshu Vishwakarma
        public ActionResult ManageCountry()
        {
            return View();
        }
        public ActionResult ManageState()
        {
            return View();
        }
        public ActionResult ManageCity()
        {
            return View();
        }
        #endregion
    }
}