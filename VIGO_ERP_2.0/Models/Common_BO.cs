using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace VIGO_ERP_2._0.Models
{
    public class Common_BO
    {
        public class EntityBO
        {
            public int EntityId { get; set; }
            public Guid? UserId { get; set; }
            public string Role { get; set; }
            public string UserName { get; set; }
            public string Password { get; set; }
            public string Scheme { get; set; }
            public string RetailerType { get; set; }
            public Int64 ParentID { get; set; }
            public string Name { get; set; }
            public string PostalAddress { get; set; }
            public int CityID { get; set; }
            public int StateID { get; set; }
            public string DistrictName { get; set; }
            public string StateName { get; set; }
            public string PINCode { get; set; }
            public string LandLineNo { get; set; }
            public string Mobile { get; set; }
            public string Email { get; set; }
            public string PanNo { get; set; }
            public string UserProfilePic { get; set; }
            public int CompId { get; set; }
            public string CreatedBy { get; set; }
            public string ModifiedBy { get; set; }
            public bool IsApproved { get; set; }
            public bool isVisible { get; set; }
            public string Department { get; set; }
            public string CompCode { get; set; }
            public string CompName { get; set; }
            public string Access { get; set; }
            public int BranchId { get; set; }
            public int DepartmentId { get; set; }
            public string DesignationName { get; set; }
            public string EmployeeCode { get; set; }
            public string UserLoginRole { get; set; }
            public bool IsAutoCheckIn { get; set; }
            public string Interval { get; set; }
            public string CheckInT { get; set; }
            public string CheckOutT { get; set; }
            public string CompanyContactNo { get; set; }
            public string CompanyAddress { get; set; }
            public int code { get; set; }
            public string status { get; set; }
            public string message { get; set; }
            public string helplineNo { get; set; }
            public string helpLineWhatsapp { get; set; }
            public int StatusId { get; set; }
        }

        public class UserDetails
        {
            public Guid UserId { get; set; }
            public string UserFullName { get; set; }
            public string Name { get; set; }
            public string Email { get; set; }
            public string Role { get; set; }
            public string Mobile { get; set; }
            public int CompId { get; set; }
            public int BranchId { get; set; }
            public int DepartmentId { get; set; }
            public string CompCode { get; set; }
            public string Manager1 { get; set; }
            public string Manager2 { get; set; }
            public string Designation { get; set; }
            public string DepartmentCode { get; set; }
            public string DepartmentName { get; set; }
            public string PartyCode { get; set; }
        }

        public class ApiResponse
        {
            public bool IsSuccess { get; set; }
            public string Message { get; set; }
        }

        public class BreadcrumbItem
        {
            public string Title { get; set; }
            public string Url { get; set; } 
        }

        public class BreadcrumbViewModel
        {
            public string PageTitle { get; set; }
            public List<BreadcrumbItem> Breadcrumbs { get; set; }
        }


    }
}