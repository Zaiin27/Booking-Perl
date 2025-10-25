import * as Yup from "yup"

const alertFieldSchema = Yup.object().shape({
  enabled: Yup.boolean().required(),
  daysBefore: Yup.number()
    .transform((value, originalValue) =>
      String(originalValue).trim() === '' ? undefined : value
    )
    .when('enabled', {
      is: true,
      then: Yup.number()
        .typeError('Must be a number')
        .required('Required when enabled')
        .min(1, 'Must be at least 1'),
      otherwise: Yup.number().nullable()
    })
});

export const informationSchema = Yup.object({
  companyName: Yup.string()
    .min(2, "Company name must be at least 2 characters")
    .max(100, "Company name must be at most 100 characters")
    .matches(/^[a-zA-Z0-9\s\-']+$/, "Company name can only contain letters, numbers, spaces, hyphens, and apostrophes")
    .required("Company name is required"),
  dotNumber: Yup.string()
    .matches(/^\d{7,8}$/, "DOT Number must be 7-8 digits only")
    .required("DOT Number is required"),
  companyStatus: Yup.string().required("Required"),
  mcNumber: Yup.string()
    .matches(/^\d{6}$/, "MC Number must be exactly 6 digits")
    .required("MC Number is required"),
  ownerEmail: Yup.string()
    .required("Required")
    .email("Invalid email")
    .matches(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/, "Invalid email"),
  caMotorCarrierPermitNumber: Yup.string()
    .matches(/^\d{6,8}$/, "CA Permit Number must be 6-8 digits only")
    .nullable()
    .transform((value) => (value === '' ? null : value)),
  formE: Yup.object({
    formnumber: Yup.string()
      .matches(/^\d{3,6}$/, "Form E Number must be 3-6 digits")
      .nullable()
      .transform((value) => (value === '' ? null : value)),
    iftaBase: Yup.string().required("Required"),
    website: Yup.string()
      .trim()
      .test(
        'no-leading-space',
        'Website cannot start with a space. Please enter a valid website (e.g., example.com, subdomain.example.com or https://example.com)',
        value => !value || !/^\s/.test(value)
      )
      .notRequired(),
    // website: Yup.string()
    //   .trim()
    //   .matches(
    //     /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/,
    //     'Please enter a valid website (e.g., example.com, subdomain.example.com or https://example.com)'
    //   )
    //   .notRequired(),
    // username: Yup.string().required("Required"),
    // password: Yup.string().required("Required"),
    idNumber: Yup.string().required("Required"),
  }),
  // websiteAndLoginInformation: Yup.array().of(
  //   Yup.object({
  //     website: Yup.string().url("Invalid URL"),
  //     username: Yup.string().required("Username is required"),
  //     password: Yup.string().required("Password is required"),
  //     description: Yup.string().required("Description is required"),
  //   }),
  // ),
  // customFields: Yup.array().of(
  //     Yup.object({
  //         name: Yup.string().required('Required'),
  //         value: Yup.string().required('Required'),
  //     })
  // ),
})

export const addressSchema = Yup.object({
  physicalAddress: Yup.object({
    street: Yup.string().required("Required"),
    city: Yup.string().required("Required"),
    state: Yup.string().required("Required"),
    zip: Yup.string().required("Required"),
    country: Yup.string().required("Required"),
  }),
  mailingAddress: Yup.object({
    street: Yup.string().required("Required"),
    city: Yup.string().required("Required"),
    state: Yup.string().required("Required"),
    zip: Yup.string().required("Required"),
    country: Yup.string().required("Required"),
  }),
  // sameAsPhysical: Yup.boolean(),
})

const scacPattern = /^[A-Z0-9]{2,4}$/;
export const permitsSchema = Yup.object({
  permitsAndlicenses: Yup.object({
    scacCode: Yup.string()
      .required("SCAC code is required")
      .matches(scacPattern, "SCAC code must be 2-4 uppercase letters or digits, no spaces or special characters"),
    scacCodeExpirationDate: Yup.date()
      .required("SCAC expiration date is required")
      .min(
        new Date(new Date().setHours(0, 0, 0, 0)),
        "SCAC expiration date cannot be in the past"
      ),
    ExpirationDate2290: Yup.string().required("Required"),
  }),
  permitRenewableChecklist: Yup.object({
    agreementPrepMaintainRecords: Yup.boolean(),
    cabCard: Yup.boolean(),
    copyLeaseAgreement: Yup.boolean(),
    customerApplicationChecklistREG2129: Yup.boolean(),
    declarationGrossCombinedVehWeight4008: Yup.boolean(),
    evidenceOfIFTALicense: Yup.boolean(),
    form135MCP: Yup.boolean(),
    form706MCP: Yup.boolean(),
    insuranceCertificate: Yup.boolean(),
    vehicleRegistration: Yup.boolean(),
  }),
  // permitFiles: Yup.array(),
})

export const iftaSchema = Yup.object({
  iftaLicenseNumber: Yup.string()
    .required("Required")
    .min(8, "Must be at least 8 characters")
    .max(12, "Must be at most 12 characters"),
  iftaTagExpirationDate: Yup.string().required("Required"),
  iftaBaseJurisdiction: Yup.string().required("Required"),
  documents: Yup.array(),
})

export const alertsSchema = Yup.object({
  // alertSettings: Yup.object().shape({
  //   licensePlateRenewal: alertFieldSchema,
  //   iftaTagExpiration: alertFieldSchema,
  //   iftaFilingDeadline: alertFieldSchema,
  //   driverLicenseExpiration: alertFieldSchema,
  //   driverMedicalExpiration: alertFieldSchema,
  //   twicCardExpiration: alertFieldSchema,
  //   customAlertField: alertFieldSchema,
  //   driverWorkPermit: alertFieldSchema,
  //   crashReportPopup: alertFieldSchema,
  //   smogInspection: alertFieldSchema,
  //   scacCodeExpiration: alertFieldSchema,
  //   exp2290: alertFieldSchema,
  //   annualInspection: alertFieldSchema,
  //   arbExpiration: alertFieldSchema,
  //   oilChange: alertFieldSchema,
  //   crashInjuryReport: alertFieldSchema
  // }),

  // customAlerts: Yup.array().of(
  //   Yup.object().shape({
  //     type: Yup.string().trim().required('Alert name is required'),
  //     date: Yup.date()
  //       .required('Date is required')
  //       .typeError('Must be a valid date'),
  //     daysBefore: Yup.number()
  //       .typeError('Must be a number')
  //       .required('Days before is required')
  //       .min(1, 'Must be at least 1'),
  //     message: Yup.string().trim().required('Notes are required')
  //   })
  // ),

  // newCustomAlert: Yup.array().of(
  //   Yup.object().shape({
  //     type: Yup.string().trim().required('Alert name is required'),
  //     date: Yup.date()
  //       .required('Date is required')
  //       .typeError('Must be a valid date'),
  //     daysBefore: Yup.number()
  //       .typeError('Must be a number')
  //       .required('Days before is required')
  //       .min(1, 'Must be at least 1'),
  //     message: Yup.string().trim().required('Notes are required')
  //   })
  // ),
})

export const mapCompanyToInitialValues = (company) => ({
  companyName: company?.name || "",
  dotNumber: company?.dotNumber || "",
  companyStatus: company?.companyStatus || "",
  mcNumber: company?.mcNumber || "",
  ownerEmail: company?.ownerEmail || "",
  caMotorCarrierPermitNumber: company?.caMotorCarrierPermitNumber || "",
  formE: {
    formnumber: company?.formE?.formnumber || "",
    iftaBase: company?.formE?.iftaBase || "",
    website: company?.formE?.website || "",
    username: company?.formE?.username || "",
    password: company?.formE?.password || "",
    idNumber: company?.formE?.idNumber || "",
  },
  websiteAndLoginInformation: company?.websiteAndLoginInformation || [],
  customFields: company?.customFields || [],
  physicalAddress: {
    street: company?.physicalAddress?.street || "",
    city: company?.physicalAddress?.city || "",
    state: company?.physicalAddress?.state || "",
    zip: company?.physicalAddress?.zip || "",
    country: company?.physicalAddress?.country || "USA",
  },
  mailingAddress: {
    street: company?.mailingAddress?.street || "",
    city: company?.mailingAddress?.city || "",
    state: company?.mailingAddress?.state || "",
    zip: company?.mailingAddress?.zip || "",
    country: company?.mailingAddress?.country || "USA",
  },
  sameAsPhysical: false,
  permitsAndlicenses: {
    scacCode: company?.permitsAndlicenses?.scacCode || "",
    scacCodeExpirationDate: company?.permitsAndlicenses?.scacCodeExpirationDate || "",
    ExpirationDate2290: company?.permitsAndlicenses?.ExpirationDate2290 || "",
  },
  permitRenewableChecklist: {
    agreementPrepMaintainRecords: company?.permitRenewableChecklist?.agreementPrepMaintainRecords || false,
    cabCard: company?.permitRenewableChecklist?.cabCard || false,
    copyLeaseAgreement: company?.permitRenewableChecklist?.copyLeaseAgreement || false,
    customerApplicationChecklistREG2129:
      company?.permitRenewableChecklist?.customerApplicationChecklistREG2129 || false,
    declarationGrossCombinedVehWeight4008:
      company?.permitRenewableChecklist?.declarationGrossCombinedVehWeight4008 || false,
    evidenceOfIFTALicense: company?.permitRenewableChecklist?.evidenceOfIFTALicense || false,
    form135MCP: company?.permitRenewableChecklist?.form135MCP || false,
    form706MCP: company?.permitRenewableChecklist?.form706MCP || false,
    insuranceCertificate: company?.permitRenewableChecklist?.insuranceCertificate || false,
    vehicleRegistration: company?.permitRenewableChecklist?.vehicleRegistration || false,
  },
  permitFiles: [],
  iftaLicenseNumber: company?.iftaInfo?.iftaLicenseNumber || "",
  iftaTagExpirationDate: company?.iftaInfo?.iftaTagExpirationDate || "",
  iftaBaseJurisdiction: company?.iftaInfo?.iftaBaseJurisdiction || "",
  documents: company?.iftaInfo?.documents || [],
  alertSettings: company?.alertSettings || {},
  customAlerts: company?.customAlerts || [],
})
