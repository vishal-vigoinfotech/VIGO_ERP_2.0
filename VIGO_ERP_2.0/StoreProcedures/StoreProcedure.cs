using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace VIGO_ERP_2._0.StoreProcedures
{
    public static class StoreProcedure
    {
        public class SuperAdmin
        {
            #region Super Admin Stored Procedures
            public class CompanyManagement
            {
                public const string sp_ViewcompanyReport = "sp_GetCompanyDetail";
                public const string sp_GetClientsListForFilter = "SP_CMM_ComapnyDropdownList";
                public const string sp_GetCompExist = "Sp_GetCompanyExist";
                public const string sp_CreateCompany = "SP_CMM_ManegeCompnay";
                public const string sp_UpdateCompany = "SP_CMM_ManegeCompnay";
                public const string sp_ActiveDeactiveClients = "SP_CMM_CompanyStatus";
                public const string sp_ViewRequirements_WithSearch = "SP_CMM_GetCompanyDetail_Filter";
            }

            public class ModuleMasterNew
            {
                public const string sp_GetModuleMasterReportList = "SP_MOD_ModuleMaster";
                public const string sp_CreateModuleMaster = "SP_MOD_ModuleMaster";
                public const string sp_UpdateModule = "SP_MOD_ModuleMaster";
                public const string sp_ActiveDeactiveModule = "SP_MOD_ModuleMaster";
                public const string sp_GetModuleExist = "SP_MOD_ModuleMaster";
            }

            public class ResourceMasterNew
            {
                public const string sp_GetResourceList = "SP_MOD_ResourceMaster";
                public const string sp_CreateResourceMaster = "SP_MOD_ResourceMaster";
                public const string sp_UpdateResource = "SP_MOD_ResourceMaster";
                public const string sp_ActiveDeactiveResource = "SP_MOD_ResourceMaster";
                public const string sp_GetResourceExist = "SP_MOD_ResourceMaster";
            }

            public class Company_Module_Mapping
            {
                public const string sp_GetCompanyModuleList = "SP_MOD_GetCompanyModule";
                public const string sp_GetModuleList = "SP_MOD_ModuleMaster";
                public const string sp_GetAllCompanydrpdwn = "sp_GetCompanyDetailList";
                public const string sp_GetAllModuleDropdown = "SP_MOD_GetModuleDetail";
                public const string sp_AssignCompanyToModule = "SP_MOD_AssignCompanyToModule";
                public const string sp_GetMappedModuleIds = "SP_MOD_GetCompanyModule";
                public const string sp_GetCompanyModuleList_filter = "SP_MOD_GetCompanyModule";
                public const string sp_DeleteCompanyModuleData = "SP_MOD_AssignCompanyToModule";
                public const string sp_UpdateCompanyModule = "SP_MOD_ModuleMaster"; //Missing In Dal Table
                public const string sp_UserPermissionOnModuleResourceMapping = "SP_MOD_CompanyModuleResourceUserMapping"; //Missing In Dal Table
                public const string sp_RolePermissionOnModuleResourceMapping = "SP_MOD_CompanyModuleResourceRoleMapping";
                public const string sp_RevokeUserPermissionOnModuleResourceMapping = "SP_MOD_CompanyModuleResourceUserMapping";     //Added by Sushil for Revoke Permission
            }

            public class Company_Module_Resuorce_User_Permission
            {
            }

            public class Company_Role_Mapping
            {
                public const string sp_GetCompanyRoleList = "SP_RL_GetCompanyRole";
                public const string sp_GetRoleList = "SP_RL_RoleMaster";
                public const string sp_AssignCompanyToRole = "SP_RL_AssignCompanyToRole";
                public const string sp_GetMappedRoleIds = "SP_RL_GetCompanyRole";
                public const string sp_GetAllCompanydrpdwn1 = "SP_CMM_ComapnyDropdownList";
                public const string sp_GetAllRoledrpdwn1 = "SP_RL_GetRoleDetailList";
                public const string sp_UpdateCompanyRole = "SP_RL_RoleMaster";//Missing In Dal Table
                public const string sp_DeleteCompanyRoleData = "SP_RL_AssignCompanyToRole";
                public const string sp_GetCompanyRoleList_filter = "SP_RL_GetCompanyRole";
                public const string sp_GetResourceList1 = "SP_MOD_ResourceMaster";
                public const string sp_GetAllCompanyModuledrpdwn = "sp_GetCompanyModuleDetailList" + "";
            }

            public class City
            {
                public const string sp_CreateCity = "SP_LOC_ManageCity";
                public const string sp_GetCityList = "SP_LOC_ManageCity";
                public const string sp_UpdateCity = "SP_LOC_ManageCity";
                public const string sp_DeleteCity = "SP_LOC_ManageCity";
                public const string sp_SetCityEnableDisable = "SP_LOC_ManageCity";
                public const string sp_GetCityExist = "SP_LOC_ManageCity";
            }

            public class State
            {
                public const string sp_CreateState = "SP_LOC_State";
                public const string sp_GetStateList = "SP_LOC_State";
                public const string sp_UpdateState = "SP_LOC_State";
                public const string sp_DeleteState = "SP_LOC_State";
                public const string sp_SetStateEnableDisable = "SP_LOC_State";
            }

            public class Country
            {
                public const string sp_CreateCountry = "SP_SM_Country";
                public const string sp_GetCountryList = "SP_SM_Country";
                public const string sp_UpdateCountry = "SP_SM_Country";
                public const string sp_DeleteCountry = "SP_SM_Country";
                public const string sp_SetCountryEnableDisable = "SP_SM_Country";
                public const string sp_GetCountryExist = "SP_SM_Country";
            }

            public class MapModuleResource
            {
                public const string sp_GetAllModulesdrpdwn = "SP_MOD_ModuleMaster";
                public const string sp_GetModulesdrpdwnforSearch = "SP_MOD_ModuleMaster";
                public const string sp_GetAllResourcesdrpdwn = "SP_MOD_ResourceMaster";
                public const string sp_GetResourcesList = "SP_MOD_ResourceMaster";
                public const string sp_AssignModulesToResources = "SP_MOD_AssignModulesToResources";
                public const string sp_GetModuleResourceList = "SP_MOD_GetModuleResource";
                public const string sp_GetMappedResourceIds = "SP_MOD_GetModuleResource";
                public const string sp_DeleteModuleResourceData = "SP_MOD_AssignModulesToResources";

            }

            public class MapRoleResource
            {
                public const string sp_GetRoleResourceList = "sp_GetRoleResource";
                public const string sp_AssignRolesToResources = "SP_RL_AssignRolesToResources";
                public const string sp_GetMappedResourceIds1 = "sp_GetRoleResource";
                public const string sp_DeleteRoleResourceData = "SP_RL_AssignRolesToResources";
                public const string sp_GetAllRolesdrpdwn = "SP_RL_RoleMaster";
                public const string sp_GetRolesdrpdwnforsearch = "SP_RL_RoleMaster";
            }

            public class RoleMaster
            {
                public const string sp_CreateRole = "SP_RL_RoleMaster";
                public const string sp_GetDesignationMaster = "sp_tblDesignation";
                public const string sp_UpdateRole = "SP_RL_RoleMaster";
                public const string sp_DeleteRole = "SP_RL_RoleMaster";
                public const string sp_SetRoleEnableDisable = "SP_RL_RoleMaster";
                public const string sp_GetRoleExist = "SP_RL_RoleMaster";

            }

            public class UserManagement
            {
                public const string sp_GetNewPasswordResetLink = "SP_UM_Passreset";
                public const string sp_GetUserIdByCode = "select aspnet_users.UserId from aspnet_users left join aspnet_membership on aspnet_membership.UserId = aspnet_users.UserID where loweredusername = @Code ";
                public const string sp_GetEmpMailByUserId = "select UserId,Email from aspnet_membership where UserId=@userId";
                public const string sp_GetEmpNameByUserId = "select FullName from aspnet_membership where UserId=@UserId";
                public const string sp_GetCompByCode = "select companyid from aspnet_membership where UserId = @userId";
            }

            public class Geo
            {
                public const string sp_GetAPK = "select APK from tbl_CMM_CompanyMaster where Id = @CompId";
            }
            public class FollowupStatus
            {
                public const string sp_FollowupStatus = "SP_LD_FollowupStatus";
            }

            public class ManageSalaryHeads
            {
                public const string sp_ManageMasterSalaryComponent = "SP_PAY_ManageMasterSalaryComponent";
            }

            public class MasterSalaryHeads
            {
                public const string sp_ManageMasterSalaryHead = "SP_SM_ManageMasterSalaryHead";
            }

            public class Attendance
            {
                public const string SP_GetAttendanceSummary_ForExcel = "SP_GetAttendanceSummary_ForExcel";
            }

            public class EmpRecruitment
            {
                public const string Create = "Employee's recruitment details added successfully.";
                public const string Update = "Employee's recruitment details updated successfully.";
                public const string Delete = "Employee's recruitment details deleted successfully.";
                public const string NoRecords = "No Records Found.";
                public const string Exception = "Exception Occured !";
                public const string ExceptionCode = "444";
                public const string InvalidRequest = "Invalid Request !";
            }

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

            public static class UserRoles
            {
                public const string ACCOUNT = "ACCOUNT";
                public const string SALES = "SALES";
                public const string ADMIN = "ADMIN";
                public const string CLIENT = "CLIENT";
                public const string COMPANYADMIN = "COMPANYADMIN";
                public const string OPERATIONS = "OPERATIONS";
                public const string RECEPTION = "RECEPTION";
                public const string RECRUITMENT = "RECRUITMENT";
                public const string SUPERADMIN = "SUPERADMIN";
            }
            #endregion
        }

        #region SystemMasters 
        public class SystemMasters
        {
            #region Dashboard
            public class Dashboard
            {
                public const string sp_GetDashboardDetails = "SP_CMM_ManageCopmanySetup";
            }
            #endregion

            #region Manage Designation
            public class ManageDesignation
            {
                public const string sp_GetDesignationLis = "SP_SM_ManageDesignation";
                public const string sp_CreateDesignation = "SP_SM_ManageDesignation";
                public const string sp_GetdesgExist = "SP_SM_ManageDesignation";
                public const string sp_UpdateDesignation = "SP_SM_ManageDesignation";
                public const string sp_SetDesignationEnableDisable = "SP_SM_ManageDesignation";
                public const string sp_DeleteDesignation = "SP_SM_ManageDesignation";
            }
            #endregion

            #region Manage PF Group
            public class ManagePFGroup
            {
                public const string sp_GetPFGroupList = "SP_SM_ManagePFGroupMaster";
                public const string sp_CreatePFGroup = "SP_SM_ManagePFGroupMaster";
                public const string sp_UpdatePFGroup = "SP_SM_ManagePFGroupMaster";
                public const string sp_SetPFGroupEnableDisable = "SP_SM_ManagePFGroupMaster";

            }

            #endregion

            #region Manage Department
            public class ManageDepartment
            {
                public const string sp_CreateDapartment = "SP_SM_ManageDepatment";
                public const string sp_GetdeptExist = "SP_SM_ManageDepatment";
                public const string sp_GetDepartmentList = "SP_SM_ManageDepatment";
                public const string sp_SetDepartmentEnableDisable = "SP_SM_ManageDepatment";
                public const string sp_DeleteDepartment = "SP_SM_ManageDepatment";
                public const string sp_UpdateDepartment = "SP_SM_ManageDepatment";
            }
            #endregion
            public class ManageDirectorDetails
            {
                public const string sp_ManageDirectorDetails = "SP_DirectorDetails";
                public const string sp_ManageOwnerDetails = "SP_OwnerDetails";
            }
            public class ManageBankDetails
            {
                public const string sp_ManageBankDetails = "SP_SM_ManageBankList";
            }

            public class ManageHolidayMaster
            {
                public const string sp_ManageHolidayMaster = "SP_SM_HolidayMaster";
            }
            public class ServiceCategory
            {
                public const string sp_ManageServiceCategory = "SP_SM_ManageServiceCategory";
            }

            public class ManageLeaveDetails
            {
                public const string sp_ManageLeaveDetails = "SP_SM_ManageLeaveList";
            }

            #region Manage Entity
            public class ManageEntity
            {
                public const string sp_GetEntityList = "SP_SM_AddEntity";
                public const string sp_CreateEntity = "SP_SM_AddEntity";
                public const string sp_GetEntityExist = "SP_SM_AddEntity";
                public const string sp_UpdateEntity = "SP_SM_AddEntity";
                public const string sp_SetEntityEnableDisable = "SP_SM_AddEntity";
                public const string sp_DeleteEntity = "SP_SM_AddEntity";

            }
            #endregion

            #region Manage Region
            public class ManageRegion
            {
                public const string sp_CreateRegion = "SP_SM_AddRegion";
                public const string sp_GetRegionExist = "SP_SM_GetRegionNew";
                public const string sp_GetRegionList = "SP_SM_GetRegionNew";
                public const string sp_SetRegionEnableDisable = "SP_SM_GetRegionNew";
                public const string sp_UpdateRegion = "SP_SM_AddRegion";
            }
            #endregion

            #region Manage Branch
            public class ManageBranch
            {
                public const string sp_CreateBranch = "SP_SM_AddBranch";
                public const string sp_GetBranchExist = "SP_SM_GetBranch";
                public const string sp_GetBranchList = "SP_SM_GetBranch";
                public const string sp_UpdateBranch = "SP_SM_AddBranch";
            }
            #endregion

            #region Company Setup
            public class CompanySetup
            {
                public const string sp_SubmitCompanySetup = "SP_CMM_ManageCopmanySetup";
                public const string sp_GetCompanySetupDetails = "SP_CMM_ManageCopmanySetup";
            }
            #endregion
        }
        #endregion
    }
}