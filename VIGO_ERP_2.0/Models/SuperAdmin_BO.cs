using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace VIGO_ERP_2._0.Models
{
    public class SuperAdmin_BO
    {
        public class StateComplianceData
        {
            public int StatetId { get; set; }
            public string CreatedBy { get; set; }
            public string FormId { get; set; }
            public string FormName { get; set; }
            public string FormRegisterName { get; set; }
            public string FormRuleNumber { get; set; }
        }

        public class GetEmployee
        {
            public string SiteId { get; set; }
            public string ClientId { get; set; }
            public string EmpTypeId { get; set; }
            public string StatusId { get; set; }

        }
        public class state

        {
            public string statusId { get; set; }
            public string stateId { get; set; }
            public string stateCode { get; set; }
            public string stateName { get; set; }
        }
        public class country
        {
            public string CountryId { get; set; }
            public string CountryCode { get; set; }
            public string CountryName { get; set; }
            public string statusId { get; set; }


        }
        public class city
        {
            public string statusId { get; set; }
            public string CityId { get; set; }
            public string CityCode { get; set; }
            public string CityName { get; set; }

        }
        public class role
        {
            public string statusId { get; set; }
            public string RoleId { get; set; }
            public string RoleCode { get; set; }
            public string RoleName { get; set; }
        }
        public class lstItems
        {
            public string Value { get; set; }
            public string Text { get; set; }
        }
        public class AssignUser
        {
            public string action { get; set; }
            public string assignUserId { get; set; }

            public string SiteDesignationId { get; set; }
            public string CompID { get; set; }
        }
        public class ManageEmployee_WithSearch
        {
            public string EmployeeTypeID { get; set; }
            public string ClientID { get; set; }
            public string Siteid { get; set; }
            public string StatusId { get; set; }
        }
        public class ReportSite_WithSearch
        {
            public string DesignationId { get; set; }

            public string SiteId { get; set; }
            public string date { get; set; }
        }
        public class AddPEmployees_View_filter
        {

            public string DesignationId { get; set; }
            public string CompId { get; set; }

            public string StatusId { get; set; }
            public string EmployeeId { get; set; }
        }
        public class siteUser
        {
            public string userId { get; set; }

            public string SiteId { get; set; }
            public string sitedesignationId { get; set; }
            public string StatusId { get; set; }
            public string compId { get; set; }

        }
        public class OfficeType
        {
            public string officeTypeId { get; set; }

            public string officeType { get; set; }
            public string IsVisible { get; set; }

        }
        public class ViewRequirements_WithSearch
        {
            public string statusId { get; set; }
            public string reqTypeId { get; set; }
            public string siteId { get; set; }
            public string clientId { get; set; }
            public string moduleId { get; set; }
            public string resourceId { get; set; }
        }
        public class ManageClient_WithSearch
        {
            public string statusId { get; set; }
            public string siteId { get; set; }
            public string clientId { get; set; }
            public int CompId { get; set; }

        }
        public class ManageCompanyModule
        {
            public string companyId { get; set; }
            public string moduleId { get; set; }

            public string companyname { get; set; }

            public string moduleName { get; set; }

        }
        public class CompanyModuleData
        {
            public List<CompanyModule> moduledata { get; set; }
            public string companyId { get; set; }
            public string createdBy { get; set; }
        }
        public class CompanyModule
        {
            public int ModuleId { get; set; }
        }
        public class GetCompanyModuleList_filter
        {
            public string moduleId { get; set; }
            public string companyId { get; set; }
        }
        internal static object GetAllCompanydrpdwn1()
        {
            throw new NotImplementedException();
        }
        public class CompanyRoleData
        {
            public List<CompanyRole> Roledata { get; set; }
            public string companyId { get; set; }
        }
        public class CompanyRole
        {
            public string RoleId { get; set; }
        }
        public class ManageCompanyRole
        {
            public string companyId { get; set; }
            public string RoleId { get; set; }
            public string companyname { get; set; }
            public string RoleName { get; set; }
        }
        public class EmpRecruitment
        {
            public string IsAddedByAdmin { get; set; }
            public string IsUniform { get; set; }
            public string Action { get; set; }
            public string CompId { get; set; }
            public string TempEmpId { get; set; }
            public string UserId { get; set; }
            public string Reference { get; set; }
            public string Status { get; set; }
            public string temp { get; set; }
            public string TempEmployeeCode { get; set; }
            public string FName { get; set; }
            public string MName { get; set; }
            public string LName { get; set; }
            public string FullName { get; set; }
            public string Gender { get; set; }
            public string Image { get; set; }
            public string CurrentAddress { get; set; }
            public string PermanentAddress { get; set; }
            public string ContactNo { get; set; }
            public string Email { get; set; }
            public string DOB { get; set; }
            public string Education { get; set; }
            public string Aadharno { get; set; }
            public string WorkExp1 { get; set; }
            public string WorkExp2 { get; set; }
            public string Experience { get; set; }
            public string Height { get; set; }
            public string Weight { get; set; }
            public string Pan { get; set; }
            public string IsRecruited { get; set; }
            public string IsSentToAdmin { get; set; }
            public string IsApprovedByAdmin { get; set; }
            public string IsRejectedByAdmin { get; set; }
            public string ApprovedBy_admin { get; set; }
            public string RejectedBy_admin { get; set; }
            public string RejectedBy { get; set; }
            public string IsApprovedByClient { get; set; }
            public string ClientApproverName { get; set; }
            public string IsRejected { get; set; }
            public string IsSentToClient { get; set; }
            public string IsRejectedByClient { get; set; }
            public string ReasonForRejection_Client { get; set; }
            public string ReasonForRejection_admin { get; set; }
            public string IsOnHold { get; set; }
            public string IsVisible { get; set; }
            public string CreatedBy { get; set; }
            public string ModifiedBy { get; set; }
            public string Role { get; set; }
            public string PlaceOfBirth { get; set; }
            public string CCity { get; set; }
            public string CState { get; set; }
            public string CPin { get; set; }
            public string Pcity { get; set; }
            public string PPIN { get; set; }
            public string PState { get; set; }
            public string Dateofpassing { get; set; }
            public string CollegeName { get; set; }
            public string CollegeAddress { get; set; }
            public string SiteId { get; set; }
            public string physical_waist { get; set; }
            public string physical_chest { get; set; }
            public string physical_shoe { get; set; }
            public string physical_blood { get; set; }
            public string compcode { get; set; }
            public string UserID { get; set; }
            public string License { get; set; }
            public string StartDate { get; set; }
            public string EndDate { get; set; }
            public string FirstName { get; set; }
            public string LastName { get; set; }
            public string Contact { get; set; }
            public string email { get; set; }
            public string CompanyAddress { get; set; }
            public string OtherDetails { get; set; }
            public string UserName { get; set; }
            public string NoOfLogin { get; internal set; }
            public string ModeOFPayment { get; set; }
            public string CompanyCode { get; set; }
            public string CompanyName { get; set; }
            //For Saving State 

            public string StateId { get; set; }
            public string StateName { get; set; }
            public string StateCode { get; set; }


            // For Saving Country

            public string CountryId { get; set; }
            public string CountryName { get; set; }
            public string CountryCode { get; set; }


            // For Saving City

            public string CityId { get; set; }
            public string CityName { get; set; }
            public string CityCode { get; set; }

            //For Saving Role

            public string RoleId { get; set; }
            public string RoleName { get; set; }
            public string RoleCode { get; set; }

            // For Saving Resource

            public string ResourceId { get; set; }
            public string ResourceName { get; set; }
            public string ResourceCode { get; set; }

            // For Saving Module

            public string ModuleId { get; set; }
            public string ModuleName { get; set; }
            public string ModuleCode { get; set; }
            public string ModuleDescription { get; set; }
            public string APK { get; set; }
            public string Aadhaar { get; set; }
            public string Bank { get; set; }
            public string UAN { get; set; }
            public string ClientV { get; set; }
            public string RecruitmentV { get; set; }
        }

        public class BO_CompanyModule
        {
            public int CompId { get; set; }
            public int ModuleId { get; set; }
            public string ModuleName { get; set; }
            public string ModuleCode { get; set; }
            public string ModuleDescription { get; set; }
        }

        public class BO_CompanyModuleResource
        {
            public int CompId { get; set; }
            public int ResourceId { get; set; }
            public string ResourceName { get; set; }
            public string ResourceCode { get; set; }
        }
        public class ModuleResourceData
        {
            public List<ModuleResource> resourcedata { get; set; }
            public string ModuleId { get; set; }
            public string CompanyId { get; set; }
        }
        public class ModuleResource
        {
            public string ResourceId { get; set; }
        }
        public class GetModuleResourceList_filter
        {
            public string moduleId { get; set; }
            public string resourceId { get; set; }
        }
        public class RoleResourceData
        {
            public List<RoleResource> resourcedata { get; set; }
            public string RoleId { get; set; }
        }
        public class RoleResource
        {
            public string ResourceId { get; set; }
        }

        public class LeadSource
        {
            public string LeadSourceId { get; set; }
            public string SourceName { get; set; }
            public string SourceCode { get; set; }
        }

        public class LeadStatus
        {
            public string LeadStatusId { get; set; }
            public string StatusName { get; set; }
            public string StatusCode { get; set; }
        }

        public class LeadStage
        {
            public string LeadStageId { get; set; }
            public string StageName { get; set; }
            public string StageCode { get; set; }
        }

        public class ModuleResourceIds
        {
            public int ModuleId { get; set; }
            public int ResourceId { get; set; }
        }

        public class Industry
        {
            public string IndustryId { get; set; }
            public string CodeIndustry { get; set; }
            public string NameIndustry { get; set; }
        }

        public class product
        {
            public string produtId { get; set; }
            public string produtCode { get; set; }
            public string produtName { get; set; }
        }
        public class Action
        {
            public string ActionId { get; set; }
            public string ActionCode { get; set; }
            public string ActionName { get; set; }
        }

        public class FollowupStatus
        {
            public string FollowupStatusId { get; set; }
            public string FollowupStatusCode { get; set; }
            public string FollowupStatusName { get; set; }
            public string IsVisible { get; set; }
        }

        public class Zone
        {
            public string ZoneId { get; set; }
            public string ZoneCode { get; set; }
            public string ZoneName { get; set; }
            public string IsVisible { get; set; }
        }

        public class ComplaintType
        {
            public string ComplaintTypeId { get; set; }
            public string ComplaintTypeCode { get; set; }
            public string ComplaintTypeName { get; set; }
            public string IsVisible { get; set; }
        }

        public class SalaryComponent
        {
            public string CompId { get; set; }
            public string SalaryComponentId { get; set; }
            public string ComponentName { get; set; }
            public string ComponentDispName { get; set; }
            public string ShortCode { get; set; }
            public string DispPaySlip { get; set; }
            public string ComponentType { get; set; }
            public string IsActive { get; set; }
            public string IsCalMonthly { get; set; }
            public string ShowInAttendance { get; set; }
            public string IsDefault { get; set; }
        }

        public class SalaryHeadData
        {
            public int CompId { get; set; }
            public List<SalaryHeadValue> SalComponentIds { get; set; }
        }

        public class SalaryHeadValue
        {
            public int SalaryComponentId { get; set; }
        }

    }
}