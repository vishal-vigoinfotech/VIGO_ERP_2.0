using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace VIGO_ERP_2._0.Models
{
    public class Admin_BO
    {
        public class CompanySetupModel
        {
            public int CompSetupId { get; set; }
            public int CompId { get; set; }

            public string TempEmpCodePrefix { get; set; }
            public string TempEmpCodeSuffix { get; set; }

            public string CompEmpCodePrefix { get; set; }
            public string CompEmpCodeSuffix { get; set; }
            public string CompEmpCodeLength { get; set; }

            public string InternalCodePrifix { get; set; }
            public string InternalCodeSuffix { get; set; }

            public string ClientPrefix { get; set; }
            public string ClientSuffix { get; set; }

            public string SitePrefix { get; set; }
            public string SiteSuffix { get; set; }

            public string EnquiryPrefix { get; set; }
            public string EnquirySuffix { get; set; }

            public string ComplaintPrefix { get; set; }
            public string ComplaintSuffix { get; set; }

            public string FeedbackPrefix { get; set; }
            public string FeedbackSuffix { get; set; }

            public string TendorPrefix { get; set; }
            public string TendorSuffix { get; set; }

            public string LeadPrefix { get; set; }
            public string LeadSuffix { get; set; }

            public string PartyPrefix { get; set; }
            public string PartySuffix { get; set; }

            public string ContractPrefix { get; set; }
            public string ContractSuffix { get; set; }

            public string ItemPrifx { get; set; }
            public string ItemSuffix { get; set; }

            public string VendorPrefix { get; set; }
            public string VendorSuffix { get; set; }

            public string Designationprifx { get; set; }
            public string Designationsuffix { get; set; }

            public string AdvancePrefix { get; set; }
            public string AdvanceSuffix { get; set; }

            public string PostingOrderPrefix { get; set; }
            public string PostingOrderSuffix { get; set; }

            public string ArrearBatchPrefix { get; set; }
            public string ArrearBatchSuffix { get; set; }

            public string BonusBatchPrefix { get; set; }
            public string BonusBatchSuffix { get; set; }

            public string LeaveBatchPrefix { get; set; }
            public string LeaveBatchSuffix { get; set; }

            public string CompSalaryYear { get; set; }
            public int? CompSalaryMonth { get; set; }
            public int? CompSalaryDays { get; set; }

            public TimeSpan? AttCutOfTime { get; set; }
            public Guid CreatedBy { get; set; }
            public DateTime CreatedAt { get; set; }
            public string FullName { get; set; }
        }

    }
}