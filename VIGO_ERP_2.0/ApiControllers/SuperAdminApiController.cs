using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using VIGO_ERP_2._0.DAL;
using VIGO_ERP_2._0.Models;
using VIGO_ERP_2._0.StoreProcedures;
using VIGO_ERP_2._0.Utilities;

namespace VIGO_ERP_2._0.ApiControllers
{
    [RoutePrefix("api/SuperAdminApi")]
    public class SuperAdminApiController : ApiController
    {
        #region Mange Comapny Added By Subham
        [HttpGet]
        [Route("GetAllCompanyDetails")]
        public IHttpActionResult GetAllCompanyDetails()
        {
            try
            {
                var getResult = SuperAdminDAL.ViewcompanyReport();
                //  return getResult;
                if (getResult != StoreProcedure.SuperAdmin.EmpRecruitment.ExceptionCode)
                {
                    return Ok(getResult);
                }
                else
                {
                    return BadRequest(StoreProcedure.SuperAdmin.EmpRecruitment.Exception);
                }
            }
            catch (Exception ex)
            {

                return InternalServerError(ex);
            }
        }
        [HttpPost]
        [Route("CreateCompany")]
        public IHttpActionResult CreateCompany(SuperAdmin_BO.EmpRecruitment model)
        {
            var response = string.Empty;
            try
            {
                if (!string.IsNullOrWhiteSpace(model.CompanyCode) && !string.IsNullOrWhiteSpace(model.CompanyName))
                {
                    var getUserRoles = Utility_CP.UserRole();
                    bool? exist = SuperAdminDAL.GetCompExist(model.CompanyCode.ToString());
                    int temp = Utility_CP.GenerateRandomCode();
                    if (exist != true)
                    {
                        var TempEmpCode = "TEMP" + temp;
                        var getResult = SuperAdminDAL.CreateCompany(Utility_CP.Action.MODIFY, model);
                        return Ok("Sucessy#1");
                    }
                    else
                        return Ok("This Comapany allready exit !#0");
                }
                else
                {
                    return Ok("Please fill mandatory details !#0");
                }
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }
        [HttpPost]
        [Route("ActiveDeactiveClients")]
        public IHttpActionResult ActiveDeactiveClients(SuperAdmin_BO.EmpRecruitment model)
        {
            try
            {
                if (!string.IsNullOrEmpty(model.Status) && !string.IsNullOrEmpty(model.CompId))
                {
                    var getResult = SuperAdminDAL.ActiveDeactiveClients(model.Status, model.CompId);

                    return Ok("Company Status Update Successfully#1");
                }
                else
                {
                    return Ok("Invalid Status or Company Id#0");
                }
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }

        }
        [HttpPost]
        [Route("GetCompanyDetailById")]
        public IHttpActionResult GetCompanyDetailById([FromBody] int CompId)
        {
            try
            {
                var cmpDetails = SuperAdminDAL.GetCompanyDetailsById(CompId);
                if (cmpDetails != null)
                    return Ok(cmpDetails);
                else
                    return BadRequest("No data found!");
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }

        }
        [HttpPost]
        [Route("UpdateCompanyDetails")]
        public IHttpActionResult UpdateCompanyDetails(SuperAdmin_BO.EmpRecruitment model)
        {
            try
            {
                if (!string.IsNullOrWhiteSpace(model.CompanyCode) && !string.IsNullOrWhiteSpace(model.CompanyName) && !string.IsNullOrWhiteSpace(model.CompId))
                {
                    var result = SuperAdminDAL.UpdateCompany(Utility_CP.Action.MODIFY, model);
                    return Ok("Sucessy#1");
                }
                else
                {
                    return BadRequest("Please fill mandatory details !#0");
                }
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }
        #endregion

        #region PayRoll Setup Added by SUbham
        [HttpGet]
        [Route("ViewSalaryReport")]
        public IHttpActionResult ViewSalaryReport()
        {
            try
            {
                var result = SuperAdminDAL.ViewSalaryReport();
                if (result != null)
                    return Ok(result);
                else
                    return Ok("Error");
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        #endregion

        #region Manage Company Module Master
        [HttpPost]
        [Route("GetModuleMasterReportList")]
        public IHttpActionResult GetModuleMasterReportList()
        {
            try
            {
                var result = SuperAdminDAL.GetModuleMasterReportList();
                if (result != null)
                    return Ok(result);
                else
                    return Ok("Error");
            }
            catch (Exception ex)
            {
                return InternalServerError();
            }
        }
        [HttpPost]
        [Route("CreateModuleMaster")]
        public IHttpActionResult CreateModuleMaster(SuperAdmin_BO.EmpRecruitment cmpModule)
        {
            try
            {
                if (!string.IsNullOrWhiteSpace(cmpModule.ModuleName) && !string.IsNullOrWhiteSpace(cmpModule.ModuleCode))
                {
                    var result = SuperAdminDAL.CreateModuleMaster(cmpModule);
                    var succes = result.Split('#');
                    if (succes[1] == "1")
                        return Ok("Module Create Successfully!#1");
                    else
                        return Ok("Module Code Already Exist#0");
                }
                else
                {
                    return Ok("Please fill mandatory details !#0");
                }
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }
        [HttpPost]
        [Route("UpdateModuleMaster")]
        public IHttpActionResult UpdateModuleMaster(SuperAdmin_BO.EmpRecruitment cmpModule)
        {
            try
            {
                if (!string.IsNullOrWhiteSpace(cmpModule.ModuleName) && !string.IsNullOrWhiteSpace(cmpModule.ModuleId))
                {
                    var result = SuperAdminDAL.UpdateModule(cmpModule);
                    var succes = result.Split('#');
                    if (succes[1] == "1")
                        return Ok("Module Update Successfully!#1");
                    else
                        return Ok("Something went wrong!#0");
                }
                else
                {
                    return Ok("Please fill mandatory details !#0");
                }
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }
        [HttpPost]
        [Route("ActiveDeactiveModule")]
        public IHttpActionResult ActiveDeactiveModule(SuperAdmin_BO.ViewRequirements_WithSearch model)
        {
            try
            {
                if(!string.IsNullOrEmpty(model.moduleId))
                {
                    var result = SuperAdminDAL.ActiveDeactiveModule(model);
                    return Ok(result);
                }
                else
                {
                    return Ok("Some Server error!#0");
                }
            }
            catch(Exception ex)
            {
                return InternalServerError(ex);
            }
        }
        #endregion

        #region Manage Country Page   Add By Himanshu Vishwakarma

        [HttpPost]
        [Route("GetCountryList")]
        public IHttpActionResult GetCountryList()
        {
            try
            {
                var model = SuperAdminDAL.GetCountryDetails();

                if (model == null)
                {
                    return Content(
                        HttpStatusCode.NotFound,
                        new { message = "No records found." }
                    );
                }

                return Ok(model);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }
        [HttpPost]
        [Route("CreateCountry")]
        public IHttpActionResult CreateCountry(SuperAdmin_BO.country model)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(model.CountryCode) ||
                    string.IsNullOrWhiteSpace(model.CountryName))
                {
                    return BadRequest("Please fill mandatory details !#0");
                }
                var result = SuperAdminDAL.CreateCountry(model);

                return Ok(result);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        [HttpPost]
        [Route("UpdateCountry")]
        public IHttpActionResult UpdateCountry(SuperAdmin_BO.country model)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(model.CountryId) || model.CountryId == "0" || string.IsNullOrWhiteSpace(model.CountryName))
                {
                    return BadRequest("Please fill mandatory details !#0");
                }

                var result = SuperAdminDAL.UpdateCountry(model.CountryId.ToString(),Utility_CP.GetTextStandardCasing(model.CountryName)
                );

                return Ok(result);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }


        [HttpPost]
        [Route("DeleteCountry")]
        public IHttpActionResult DeleteCountry(SuperAdmin_BO.country model)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(model.CountryId) || model.CountryId == "0")
                {
                    return BadRequest("Invalid Country Id !#0");
                }

                var result = SuperAdminDAL.DeleteCountry(model.CountryId);

                return Ok("Country Deleted Successfully!#1");
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }


        [HttpPost]
        [Route("SetCountryEnableDisable")]
        public IHttpActionResult SetCountryEnableDisable(SuperAdmin_BO.country model)
        {
            try
            {
                if (!string.IsNullOrEmpty(model.statusId) && !string.IsNullOrEmpty(model.CountryId))
                {
                    var getResult = SuperAdminDAL.SetCountryEnableDisable(model.statusId, model.CountryId);

                    return Ok("Company Status Update Successfully#1");
                }
                else
                {
                    return BadRequest("Invalid Status or Company Id#0");
                }
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }

        }

        #endregion
    }
}
